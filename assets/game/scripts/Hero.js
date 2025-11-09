var $bullet = require("./Bullet");
cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        zd: $bullet,
        zd2: $bullet,
        landMineNode: cc.Node
    },
    onLoad: function () {
        try {
            if (this.zd && this.zd.node) {
                this.zd.node.active = !1;
            }
            if (this.zd2 && this.zd2.node) {
                this.zd2.node.active = !1;
            }
            if (this.landMineNode) {
                this.landMineNode.active = !1;
            }
        } catch (e) {
            console.error("[Hero onLoad] 初始化组件失败:", e);
        }
        // 启用update方法以支持移动逻辑
        this.enabled = true;
    },
    start: function () {},
    initBy: function (t, e, i, characterSpine) {
        var n = this;
        this.scene = t;
        this.info = i;
        this.item = e;
        
        // 使用传入的character spine作为显示spine
        this.spine = characterSpine;
        this.characterSpine = characterSpine;
        
        // 保存原来的item.spine引用
        this.itemSpineOriginal = this.item.spine;
        
        // 检查原始spine和character spine是否是同一个对象
        var isSameSpine = (this.itemSpineOriginal === characterSpine);
        
        // 将item.spine指向character spine，这样Item组件能正常工作
        this.item.spine = characterSpine;
        
        // 保存item.spine节点的初始位置（如果存在）
        if (this.itemSpineOriginal && this.itemSpineOriginal.node) {
            this.itemSpineInitialPos = this.itemSpineOriginal.node.position.clone();
            
            // 只有当原始spine和character spine不是同一个对象时，才隐藏原始spine
            // 如果是同一个，说明用户在编辑器中已经配置了character spine，不应该隐藏它
            if (!isSameSpine) {
                console.log("[Hero] 隐藏原始plant spine，ID:" + this.info.id);
                this.itemSpineOriginal.node.active = false;
            } else {
                console.log("[Hero] 使用编辑器配置的spine，不隐藏，ID:" + this.info.id);
            }
        }
        
        // 确保当前使用的spine是可见的
        if (this.spine && this.spine.node) {
            this.spine.node.active = true;
            console.log("[Hero] 确保spine可见，ID:" + this.info.id + ", active:" + this.spine.node.active);
        }
        
        var o = this.info.json.range;
        this.atkRR = o * o;
        this.lvs = [];
        this.hp = this.item.maxHp;
        this.shieldValue = 0;
        this.hasDie = !1;
        
        // 设置角色动画和事件监听
        this.setAnimation(0, "Idle", !0, null);
        this.setupAnimationEvents();
        
        this.isPhy = !0;
        this.isMagic = !0;
        this.is3gz = [2, 5, 9, 10].some(function (t) {
            return t == n.item.id;
        });
        this.is2gz = [2, 4, 8].some(function (t) {
            return t == n.item.id;
        });
        cc.butler.node.on("lvup", this.onLvup, this);
        
        // 移动相关的初始化
        this.initialPosition = this.node.position.clone();
        this.moveSpeed = 20; // 英雄移动速度
        this.currentTarget = null;
        this.isMoving = false;
        this.hasReachedAttackRange = false;
        this.isInitialized = true;
        
        // 攻击状态初始化
        this.isAttacking = false;
        this.currentAttackTarget = null;
        this.item.inCoolDown = false; // 确保冷却状态被正确初始化
        
        // 不再需要子弹系统，攻击通过动画事件触发
        this.useCharacterAttack = true;
        
        console.log("[Hero] 攻击状态初始化，ID:" + this.info.id + ", isAttacking:" + this.isAttacking + ", inCoolDown:" + this.item.inCoolDown);
        
        // 关键：确保Hero组件在初始化后启用，以便update方法能被调用
        this.enabled = true;
        
        // 调试日志，确认初始化完成
        console.log("[Hero] initBy完成，ID:" + this.info.id + ", enabled:" + this.enabled + ", spine:" + (this.spine ? this.spine.defaultSkin : "null") + ", 攻击范围:" + Math.sqrt(this.atkRR));
        console.log("[Hero] spine节点信息 - active:" + (this.spine && this.spine.node ? this.spine.node.active : "null") + 
                    ", 位置:" + (this.spine && this.spine.node ? this.spine.node.position : "null") + 
                    ", 缩放:" + (this.spine && this.spine.node ? this.spine.node.scale : "null") + 
                    ", 不透明度:" + (this.spine && this.spine.node ? this.spine.node.opacity : "null"));
    },
    onLvup: function (t) {
        if (this.item.index == t) {
            this.item.lvup(!1);
            this.scene.hub.showLvupEffect(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        }
    },
    setupAnimationEvents: function () {
        var n = this;
        // 监听Spine动画事件，在攻击动画的关键帧触发伤害判定
        if (this.spine && this.spine.setEventListener) {
            this.spine.setEventListener(function (trackEntry, event) {
                // 当动画事件名为"attack"或"hit"时，执行攻击逻辑
                if (event.data.name === "attack" || event.data.name === "hit") {
                    n.onAnimationAttackEvent();
                }
            });
        }
    },
    onAnimationAttackEvent: function () {
        // 在动画事件触发时进行伤害判定
        var target = this.scene.chooseEnemy(this, this.atkRR);
        if (target && target.hp > 0) {
            var damage = this.getAtk(this.item.lv);
            this.dealDamageToEnemy(target, damage);
        }
    },
    dealDamageToEnemy: function (enemy, damage) {
        console.log("[Hero dealDamageToEnemy] 开始计算，ID:" + this.info.id + ", 原始伤害:" + damage + ", 敌人HP:" + enemy.hp);
        
        // 应用各种增益效果
        if (this.checkBuff(101)) {
            damage *= 1.25;
        }
        if (this.checkBuff(201)) {
            damage *= 1.25;
        }
        if (this.checkBuff(504)) {
            damage *= 1.5;
        }
        if (this.checkBuff(701)) {
            damage *= 1.25;
        }
        if (this.checkBuff(901)) {
            damage *= 1.25;
        }
        if (this.checkBuff(1101)) {
            damage *= 1.25;
        }
        if (this.checkBuff(1201)) {
            damage *= 1.25;
        }
        
        // 检查暴击
        var critType = 0;
        if (this.checkCrit({}, enemy)) {
            critType = 1;
            damage *= this.getCritPlus({}, enemy);
            console.log("[Hero] 暴击！伤害:" + damage);
        }
        
        // 随机浮动
        damage *= cc.math.randomRange(0.95, 1.05);
        
        console.log("[Hero dealDamageToEnemy] 最终伤害:" + Math.floor(damage) + ", 暴击:" + (critType === 1));
        
        // 造成伤害
        enemy.hurtBy(this, damage);
        
        // 显示伤害数字
        this.scene.showEnemyHurtNum(critType, enemy.node.position, damage);
        
        // 显示击中特效（仅在非character攻击系统时显示plant特效）
        // character系统使用动画自带的特效
        if (!this.useCharacterAttack) {
            this.scene.showJsEffect(enemy.node.position, this.info.id);
        }
        
        // 统计伤害
        cc.pvz.runtimeData.stats[this.info.id] += damage;
        
        // 应用各种debuff效果
        if (this.checkBuff(704) && Math.random() < 0.5) {
            enemy.addBuffWeak();
        }
        if (this.checkBuff(204)) {
            enemy.repulse(this.node.position);
        }
        if (this.checkBuff(403)) {
            enemy.repulse(this.node.position);
        }
        if (this.checkBuff(1102)) {
            enemy.repulse(this.node.position);
        }
        
        console.log("[Hero dealDamageToEnemy] 完成，敌人剩余HP:" + enemy.hp);
    },
    setAnimation: function (t, e, i, n) {
        // this.spine.setAnimation(t, e + (this.item.lv + 1), i);
        
        if (!this.spine) {
            console.error("[Hero setAnimation] spine为空！ID:" + (this.info ? this.info.id : "unknown"));
            return;
        }
        
        // 如果使用character spine，需要映射动画名称
        var animName = e;
        if (this.characterSpine && this.spine === this.characterSpine) {
            // 动画名称映射：plant动画 -> character动画
            var animMap = {
                "Idle": "Idle",
                "Hit": "Hit",
                "Dead": "Dead",
                "Walk": "Walk",
                "fuhuo": "Idle"  // 复活动画暂时映射为Idle，character中没有fuhuo
            };
            animName = animMap[e] || e;
        }
        
        console.log("[Hero setAnimation] ID:" + (this.info ? this.info.id : "unknown") + ", 动画:" + animName + ", spine节点active:" + (this.spine.node ? this.spine.node.active : "null"));
        
        this.spine.setAnimation(t, animName, i);
        this.spine.setCompleteListener(n);
    },
    getAtk: function (t) {
        var e = Math.min(this.info.lv1, this.info.json.attribute2.length - 1);
        var i = this.info.json.attribute2[e];
        if (t > 0) {
            i *= this.info.json.fightlvup2[t - 1] / 100;
        }
        var n = cc.pvz.runtimeData.getBuffValue(2);
        var o = cc.pvz.runtimeData.getBuffValue(10);
        if (o > 0) {
            n += o * cc.pvz.runtimeData.items.length;
        }
        if (n > 0) {
            i *= 1 + 0.01 * n;
        }
        return i;
    },
    getShield: function (t) {
        var e = Math.min(this.info.lv1, this.info.json.attribute2.length - 1);
        var i = this.info.json.attribute2[e];
        if (t > 0) {
            i *= this.info.json.fightlvup2[t - 1] / 100;
        }
        return i;
    },
    pushLvAndAtk: function (t) {
        var e = this.getAtk(t.lv);
        this.lvs.push({
            lv: t.lv,
            atk: e
        });
    },
    playAttAndDo: function (t, e) {
        var i = this;
        this.setAnimation(0, "Hit", !1, function () {
            i.item.checkToStartReloadTimer();
            i.setAnimation(0, "Idle", !0, null);
            if (e) {
                e();
            }
        });
        this.spine.setEventListener(function () {
            if (t) {
                t();
            }
        });
    },
    playSound: function () {
        switch (this.info.id) {
            case 3:
            case 12:
                break;
            case 6:
                cc.butler.playEffectAsync("game", "sound/dun");
                break;
            case 8:
                cc.butler.playEffectAsync("game", "sound/hp");
                break;
            case 9:
                cc.butler.playEffectAsync("game", "sound/jiguang");
                break;
            case 10:
                cc.butler.playEffectAsync("game", "sound/getSunShine");
                break;
            default:
                cc.butler.playEffectAsync("game", "sound/shoot");
        }
    },
    tryShoot: function (t, e) {
        var i = this;
        
        // 添加调试计数器
        if (!this.tryShootCallCount) {
            this.tryShootCallCount = 0;
        }
        this.tryShootCallCount++;
        
        // 每10次调用打印一次，避免刷屏
        if (this.tryShootCallCount % 10 === 1) {
            console.log("[Hero tryShoot] ID:" + this.info.id + " 被调用，次数:" + this.tryShootCallCount + 
                        ", useCharacterAttack:" + this.useCharacterAttack + 
                        ", isAttacking:" + this.isAttacking +
                        ", inCoolDown:" + this.item.inCoolDown);
        }
        
        // 如果使用character攻击系统，直接播放攻击动画
        if (this.useCharacterAttack) {
            // 检查是否有敌人在攻击范围内（使用稍大的范围避免边界问题）
            var attackRangeBuffer = this.atkRR * 1.05; // 增加5%的容差
            var target = e || this.scene.chooseEnemy(this, attackRangeBuffer);
            if (!target || target.hp <= 0) {
                if (!this.loggedNoTarget || this.tryShootCallCount % 30 === 1) {
                    console.log("[Hero tryShoot] ID:" + this.info.id + " 没有找到攻击目标，攻击范围:" + Math.sqrt(this.atkRR).toFixed(1));
                    this.loggedNoTarget = true;
                }
                return false;
            }
            
            // 重置"没有目标"日志标志
            this.loggedNoTarget = false;
            
            // 如果正在攻击中，不重复触发
            if (this.isAttacking) {
                return false;
            }
            
            this.isAttacking = true;
            this.currentAttackTarget = target;
            
            // 播放攻击动画（Hit或Throwing）
            var attackAnim = "Hit"; // 默认近战攻击
            var attackDelay = 200; // 默认延迟200ms触发伤害（动画播放到一半）
            
            // 投掷型英雄可以使用Throwing动画
            if ([4, 5, 12].indexOf(this.info.id) !== -1) {
                attackAnim = "Throwing";
                attackDelay = 300; // 投掷动画延迟更长
            }
            
            console.log("[Hero tryShoot] ✅ ID:" + this.info.id + " 开始攻击！动画:" + attackAnim + 
                        ", 目标ID:" + target.id + ", 目标HP:" + target.hp + 
                        ", spine存在:" + !!this.spine + ", spine.node.active:" + (this.spine && this.spine.node ? this.spine.node.active : "null"));
            
            this.setAnimation(0, attackAnim, false, function () {
                console.log("[Hero] ✅ ID:" + i.info.id + " 攻击动画完成，isAttacking:" + i.isAttacking + " → false");
                i.isAttacking = false;
                i.setAnimation(0, "Idle", true, null);
                
                // 使用character攻击系统，不需要子弹重装填机制
                // Item.js已经设置了inCoolDown=true，我们只需要设置计时器来重置它
                console.log("[Hero] ID:" + i.info.id + " 设置冷却计时器，当前 inCoolDown:" + i.item.inCoolDown);
                
                // 无条件设置冷却计时器（因为Item.js已经设置了inCoolDown=true）
                var cdTime = i.item.cdMs || 500; // 默认500ms冷却
                console.log("[Hero] ID:" + i.info.id + " 启动冷却计时器，时间:" + cdTime + "ms");
                i.scene.setTimeout(function() {
                    i.item.inCoolDown = false;
                    console.log("[Hero] ⏰ ID:" + i.info.id + " 冷却完成！inCoolDown:" + i.item.inCoolDown);
                }, cdTime);
            });
            
            // 延迟触发伤害判定（模拟攻击动画的打击点）
            this.scene.setTimeout(function () {
                console.log("[Hero] 💥 ID:" + i.info.id + " 准备造成伤害");
                if (i.currentAttackTarget && i.currentAttackTarget.hp > 0) {
                    var damage = i.getAtk(i.item.lv);
                    console.log("[Hero] 💥 ID:" + i.info.id + " 造成伤害:" + damage + " 给目标ID:" + i.currentAttackTarget.id);
                    i.dealDamageToEnemy(i.currentAttackTarget, damage);
                } else {
                    console.log("[Hero] ⚠️ ID:" + i.info.id + " 目标已失效，取消伤害");
                }
            }, attackDelay);
            
            this.playSound();
            return true;
        }
        
        // 以下是原来的子弹系统逻辑（保留向后兼容）
        // 对于需要敌人目标的攻击型英雄（ID 1,2,4,5,7,9,12），检查是否在攻击范围内
        // todo 修改为全部英雄都检测
        var needTargetCheck = [1, 2, 3, 4, 5, 6, 7, 9, 12];
        if (needTargetCheck.indexOf(this.info.id) !== -1) {
            // 检查是否在攻击范围内
            // 注意：不在这里查找目标，因为updateMovement已经在用大范围查找了
            // 这里只检查当前是否有目标且在攻击范围内
            if (!this.currentTarget || this.currentTarget.hp <= 0) {
                // 如果没有当前目标，用实际攻击范围尝试查找
                var nearTarget = this.scene.chooseEnemy(this, this.atkRR);
                if (!nearTarget) {
                    // 没有在攻击范围内的敌人，返回false让英雄继续移动
                    return false;
                }
                this.currentTarget = nearTarget;
            }
            
            // 检查当前目标是否在攻击范围内
            var targetPos = this.currentTarget.node.position.add(cc.v2(0, this.currentTarget.centerY));
            var distance = targetPos.sub(this.node.position).lengthSqr();
            if (distance > this.atkRR) {
                // 目标不在攻击范围内，返回false让英雄继续移动
                return false;
            }
        }
        
        switch (this.info.id) {
            case 3:
                // 3号英雄改为普通攻击型
                var r = e || this.scene.chooseEnemy(this, this.atkRR);
                return (
                    !!r &&
                    (this.pushLvAndAtk(t),
                    !this.isAttacking &&
                        ((this.isAttacking = !0),
                        this.playAttAndDo(
                            function () {
                                if (r.isValid) {
                                    i.isAttacking = !1;
                                    i.checkToShoot(r);
                                }
                            },
                            function () {
                                if (i.item.bulletCount <= 0 && i.IKBone) {
                                    cc.tween(i.IKBone)
                                        .to(0.064, {
                                            x: 150,
                                            y: 50
                                        })
                                        .start();
                                }
                            }
                        ),
                        // 仅当使用plant spine时才使用IK骨骼
                        // character spine不需要IK瞄准
                        (!this.characterSpine || this.spine !== this.characterSpine) && (
                            this.IKBone || (this.IKBone = this.spine.findBone("IK")),
                            cc
                                .tween(this.IKBone)
                                .to(0.064, {
                                    x: (r.node.x - this.node.x) / 0.76,
                                    y: (r.node.y + r.centerY - this.node.y) / 0.76
                                })
                                .start()
                        ),
                        !0))
                );
            case 6:
                this.playAttAndDo(function () {
                    var t = i.getAtk(i.item.lv) / 100;
                    var e = 0;
                    if (cc.pvz.runtimeData.hasEnableBuff(601)) {
                        e = 0.15;
                    }
                    if (cc.pvz.runtimeData.hasEnableBuff(602)) {
                        e += 0.3;
                    }
                    if (e > 0) {
                        t *= 1 + e;
                    }
                    i.item.crossItems.forEach(function (e) {
                        if (e.hero && e.hero.hp > 0) {
                            e.hero.addShield(e.maxHp * t);
                            i.scene.showBuffEffect("shield", e.hero.node.position);
                        }
                    });
                });
                return !0;
            case 8:
                var n = this.scene.chooseMinHpHero();
                return (
                    !!n &&
                    (this.playAttAndDo(function () {
                        var t = i.getAtk(i.item.lv);
                        if (i.checkBuff(802)) {
                            t *= 1.2;
                        }
                        n.addHp(t);
                        i.scene.showBuffEffect("HP", n.node.position);
                    }),
                    !0)
                );
            case 10:
                this.playAttAndDo(function () {
                    var t = i.getAtk(i.item.lv);
                    var e = 0;
                    if (cc.pvz.runtimeData.hasEnableBuff(1001)) {
                        e = 0.1;
                    }
                    if (cc.pvz.runtimeData.hasEnableBuff(1002)) {
                        e += 0.2;
                    }
                    if (e > 0) {
                        t *= 1 + e;
                    }
                    i.scene.showBuffEffect(
                        "music",
                        i.node.position.add(cc.v2(0, 50)),
                        i.scene.getAngerBarWPos(),
                        function () {
                            cc.pvz.runtimeData.anger += t;
                            i.scene.updateAnger();
                        }
                    );
                });
                return !0;
            case 11:
                this.playAttAndDo(function () {
                    var t = 1;
                    if (cc.pvz.runtimeData.hasEnableBuff(1104)) {
                        if (i.lastBulletCount) {
                            if (1 == i.lastBulletCount) {
                                t = 2;
                            } else {
                                t = 1;
                            }
                        }
                        i.lastBulletCount = t;
                    }
                    var e = function () {
                        var t = cc.instantiate(i.landMineNode);
                        var e = cc.v2(
                            i.scene.getHeroesMaxMarginX() + cc.math.randomRange(0, 150),
                            cc.math.randomRange(i.scene.groundAreaLB.y + 120, i.scene.groundAreaTR.y - 120)
                        );
                        t.position = i.node.position;
                        t.active = !0;
                        t.parent = i.scene.objsRoot;
                        t.zIndex = -t.y;
                        var n = t.getComponent(cc.Collider);
                        n.enabled = !1;
                        var o = t.getComponent(sp.Skeleton);
                        var s = o.findBone("IK");
                        s.x = (e.x - t.x) / t.scale;
                        s.y = (e.y - t.y) / t.scale;
                        s.x = Math.max(0, s.x);
                        o.setAnimation(0, "zd11_1", !0);
                        o.setCompleteListener(function () {
                            t.position = e;
                            n.enabled = !0;
                            o.setAnimation(0, "zd11_2", !1);
                            o.setCompleteListener(null);
                        });
                    };
                    for (var n = 0; n < t; n++) {
                        e();
                    }
                });
                return !0;
            case 12:
                var o = this.checkBuff(1204) ? 2 : 1,
                    s = this.scene.chooseEnemys(this, this.atkRR, o);
                if (0 == s.length) {
                    return !1;
                }
                var c = this.scene.getHeroesMaxMarginX(),
                    a = 0;
                this.playAttAndDo(function () {
                    if (1 != a || i.checkBuff(1204)) {
                        var t = s[Math.min(s.length - 1, a)];
                        var e = t.node.position.add(cc.v2(0, t.centerY));
                        var n = cc.v2(Math.min(c, e.x), e.y);
                        var o = i.scene.objsRoot.convertToWorldSpaceAR(n);
                        var r = cc.instantiate(i.zd.node);
                        var h = r.getComponent("Bullet");
                        r.parent = i.scene.bulletsRoot;
                        r.active = !0;
                        r.position = i.node.position;
                        h.spine.setAnimation(0, h.spine.defaultAnimation, !0);
                        var d = h.spine.findBone("IK");
                        var u = h.spine.node.convertToNodeSpaceAR(o);
                        d.x = u.x;
                        d.y = u.y;
                        h.initBy(i.scene, i.item.lv);
                        h.a = i;
                        h.att = i.getAtk(i.item.lv);
                        var p = function (t) {
                            i.scene.setTimeout(function () {
                                i.scene.showJsEffect(cc.v2(n.x + 100 * t, n.y), i.info.id);
                            }, 48 * t);
                        };
                        for (var l = 1; l < 5; l++) {
                            p(l);
                        }
                        cc.butler.playEffectAsync("game", "sound/gunzi");
                        a++;
                    }
                });
                return !0;
        }
        var r = e || this.scene.chooseEnemy(this, this.atkRR);
        return (
            !!r &&
            (this.pushLvAndAtk(t),
            !this.isAttacking &&
                ((this.isAttacking = !0),
                this.playAttAndDo(
                    function () {
                        if (r.isValid) {
                            i.isAttacking = !1;
                            i.checkToShoot(r);
                        }
                    },
                    function () {
                        if (i.item.bulletCount <= 0 && i.IKBone) {
                            cc.tween(i.IKBone)
                                .to(0.064, {
                                    x: 150,
                                    y: 50
                                })
                                .start();
                        }
                    }
                        ),
                        // 仅当使用plant spine时才使用IK骨骼
                        // character spine不需要IK瞄准
                        (!this.characterSpine || this.spine !== this.characterSpine) && (
                            this.IKBone || (this.IKBone = this.spine.findBone("IK")),
                            cc
                                .tween(this.IKBone)
                                .to(0.064, {
                                    x: (r.node.x - this.node.x) / 0.76,
                                    y: (r.node.y + r.centerY - this.node.y) / 0.76
                                })
                                .start()
                        ),
                        !0))
        );
    },
    checkToShoot: function (t) {
        if (0 != this.lvs.length) {
            if (this.zd) {
                var e = this.lvs.shift();
                var i = t || this.scene.chooseEnemy(this, this.atkRR);
                if (i) {
                    this.shoot(i, this.item.lv, e.atk);
                }
            }
            if (this.lvs.length > 0) {
                this.scene.setTimeout(this.checkToShoot.bind(this), 80);
            }
        }
    },
    getShootAPos: function () {
        // 如果使用character攻击系统，使用Hand_F骨骼作为攻击点
        if (this.useCharacterAttack && this.spine) {
            if (!this.HandBone) {
                this.HandBone = this.spine.findBone("Hand_F");
            }
            if (this.HandBone) {
                var t = cc.v2(this.HandBone.worldX, this.HandBone.worldY);
                return this.spine.node.convertToWorldSpaceAR(t);
            } else {
                // 如果找不到Hand_F骨骼，返回spine节点位置
                return this.spine.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            }
        }
        
        // 原来的子弹系统逻辑（保留向后兼容）
        if (this.GPBone) {
            //
        } else {
            this.GPBone = this.spine.findBone("GP");
        }
        var t = cc.v2(this.GPBone.worldX, this.GPBone.worldY);
        return this.spine.node.convertToWorldSpaceAR(t);
    },
    shoot: function (t, e, i) {
        if (4 == this.info.id) {
            var n;
            if (this.checkBuff(401)) {
                n = 9;
            } else {
                n = 5;
            }
            return this.shootN(n, t, e, i);
        }
        if (this.checkBuff(904)) {
            return this.shootN(3, t, e, i);
        } else {
            if (7 == this.info.id) {
                return this.shootIK(t, e, i);
            } else {
                return void this.shoot1(t, e, i);
            }
        }
    },
    shoot1: function (t, e, i) {
        var n = this.getShootAPos();
        var o = this.scene.bulletsRoot.convertToNodeSpaceAR(n);
        var s = t.node.position.add(cc.v2(0, t.centerY)).sub(o);
        if (s.x < 0) {
            s.x = 0;
        }
        var c = Math.atan2(s.y, s.x);
        var a = this.zd;
        var r = cc.instantiate(a.node);
        r.parent = this.scene.bulletsRoot;
        r.active = !0;
        r.position = o;
        var h = r.getComponent("Bullet");
        if (this.checkBuff(104)) {
            h.hitCount = 2;
        }
        if (this.checkBuff(503)) {
            h.hitCount = 2;
        }
        h.initBy(this.scene, e);
        h.a = this;
        if (13 == this.info.id && 2 == cc.pvz.runtimeData.mode) {
            h.att = i / 2;
        } else {
            h.att = i;
        }
        h.moveByAngle((180 * c) / Math.PI);
    },
    shootN: function (t, e, i, n) {
        var o = this.getShootAPos();
        var s = this.scene.bulletsRoot.convertToNodeSpaceAR(o);
        var c = e.node.position.add(cc.v2(0, e.centerY)).sub(s);
        if (c.x < 0) {
            c.x = 0;
        }
        var a = (180 * Math.atan2(c.y, c.x)) / Math.PI;
        var r;
        if (t > 5) {
            r = [0, -10, -20, -30, 40, 10, 20, 30, 40];
        } else {
            r = [0, -15, 15, -30, 30];
        }
        for (var h = 0; h < t; h++) {
            var d = cc.instantiate(this.zd.node);
            d.parent = this.scene.bulletsRoot;
            d.active = !0;
            d.position = s;
            var u = d.getComponent("Bullet");
            u.initBy(this.scene, i);
            u.a = this;
            u.att = n;
            u.moveByAngle(a + r[h]);
        }
    },
    shootIK: function (t, e, i) {
        var n = this;
        var o = this.getShootAPos();
        var s = this.scene.bulletsRoot.convertToNodeSpaceAR(o);
        var c = t.node.convertToWorldSpaceAR(cc.v2(0, t.centerY));
        var a = cc.instantiate(this.zd.node);
        var r = a.getComponent("Bullet");
        a.parent = this.scene.bulletsRoot;
        a.active = !0;
        a.position = s;
        if (this.checkBuff(702)) {
            a.getComponent("EventCollider").collider.radius *= 1.3;
        }
        var h = r.spine.setAnimation(0, r.spine.defaultAnimation, !0);
        r.spine.setTrackEventListener(h, function () {
            n.scene.showJsEffect(t.node.position, n.info.id);
        });
        var d = r.spine.findBone("IK");
        var u = r.spine.node.convertToNodeSpaceAR(c);
        d.x = u.x;
        d.y = u.y;
        d.x = Math.max(0, d.x);
        r.initBy(this.scene, e);
        r.a = this;
        r.att = i;
    },
    checkHeroBuff: function () {
        return !1;
    },
    checkBuff: function (t) {
        var e = (t - (t % 100)) / 100;
        return this.info.id == e && cc.pvz.runtimeData.hasEnableBuff(t);
    },
    doBulletAttLogic: function (t, e) {
        var i = t.att;
        if (this.checkBuff(101)) {
            i *= 1.25;
        }
        if (this.checkBuff(201)) {
            i *= 1.25;
        }
        if (this.checkBuff(504)) {
            i *= 1.5;
        }
        if (this.checkBuff(701)) {
            i *= 1.25;
        }
        if (this.checkBuff(901)) {
            i *= 1.25;
        }
        if (this.checkBuff(1101)) {
            i *= 1.25;
        }
        if (this.checkBuff(1201)) {
            i *= 1.25;
        }
        if (e.weakNode && this.isPhy) {
            i *= 1.2;
        }
        switch (cc.pvz.runtimeData.actBuff1) {
            case 1:
            case 2:
            case 3:
                if (this.isPhy) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 1];
                }
                break;
            case 4:
            case 5:
            case 6:
                if (this.is3gz) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 4];
                }
                break;
            case 10:
            case 11:
            case 12:
                if (this.is2gz) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 10];
                }
        }
        var n = 0;
        if (this.checkCrit(t, e)) {
            n = 1;
            i *= this.getCritPlus(t, e);
        }
        i *= cc.math.randomRange(0.95, 1.05);
        e.hurtBy(this, i);
        this.scene.showEnemyHurtNum(n, e.node.position, i);
        if (t.jsEffExclusive) {
            //
        } else {
            this.scene.showJsEffect(e.node.position, this.info.id);
        }
        cc.pvz.runtimeData.stats[this.info.id] += i;
        if (t.buffSlow) {
            e.addBuffSlow();
        }
        if (t.buffIce && this.checkBuff(1203) && Math.random() < 0.2) {
            e.addBuffIce();
        }
        if (this.checkBuff(704) && Math.random() < 0.5) {
            e.addBuffWeak();
        }
        if (this.checkBuff(204)) {
            e.repulse(this.node.position);
        }
        if (this.checkBuff(403)) {
            e.repulse(this.node.position);
        }
        if (this.checkBuff(1102)) {
            e.repulse(this.node.position);
        }
    },
    checkCrit: function () {
        if (this.checkBuff(501)) {
            if (this.attCounter) {
                this.attCounter = this.attCounter + 1;
            } else {
                this.attCounter = 1;
            }
            var t;
            if (this.checkBuff(502)) {
                t = 2;
            } else {
                t = 3;
            }
            if (this.attCounter >= t) {
                this.attCounter = 0;
                return !0;
            }
        }
        var e = 0;
        if (this.checkBuff(102)) {
            e += 0.25;
        }
        if (this.checkBuff(404)) {
            e += 0.25;
        }
        if (this.checkBuff(903)) {
            e += 0.1;
        }
        return Math.random() < e;
    },
    getCritPlus: function () {
        var t = 1.5;
        if (this.checkBuff(103)) {
            t += 0.5;
        }
        return t;
    },
    doLandMinesLogic: function (t) {
        var e = t.getComponent("Enemy");
        if (e && e.hp > 0) {
            this.doBulletAttLogic(
                {
                    att: this.getAtk(this.item.lv),
                    lv: this.item.lv,
                    jsEffExclusive: !0
                },
                e
            );
        }
    },
    onLandminesCollision: function (t, e) {
        if (e.enabled) {
            var i = t.getComponent("Enemy");
            if (i && i.hp > 0) {
                e.enabled = !1;
                var n = e.node.getComponent(sp.Skeleton);
                var o = cc.find("range", e.node).getComponent(cc.Collider);
                cc.pvz.utils.manuallyCheckCollider(o);
                this.scene.showJsEffect(e.node.position, this.info.id);
                n.node.destroy();
            }
        }
    },
    addHp: function (t) {
        this.hp = Math.min(this.item.maxHp, this.hp + t);
        this.item.updateHp(this.hp / this.item.maxHp);
        this.scene.updateHp(!0);
    },
    delHp: function (t) {
        this.hp = Math.max(0, this.hp - t);
        this.item.updateHp(this.hp / this.item.maxHp);
        this.scene.updateHp(!0);
    },
    addShield: function (t) {
        this.shieldValue = Math.min(this.item.maxHp, this.shieldValue + t);
        this.item.updateShield(this.shieldValue / this.item.maxHp);
        this.scene.updateShield();
    },
    hurtBy: function (t, e, i) {
        // 受伤
        var n = this;
        if (!(this.hasEnded || this.hp <= 0)) {
            if (this.shieldValue > 0) {
                var o = Math.min(this.shieldValue, i);
                i -= o;
                this.shieldValue -= o;
                this.item.updateShield(this.shieldValue / this.item.maxHp);
            }
            if (i > 0 && (this.delHp(i), this.hp <= 0)) {
                var s =
                    !cc.pvz.runtimeData.hasUseReborn &&
                    (8 == this.info.id || this.scene.hasHero(8)) &&
                    cc.pvz.runtimeData.hasEnableBuff(803);
                if (s) {
                    cc.pvz.runtimeData.hasUseReborn = !0;
                } else {
                    // 血条
                    this.item.barNode.active = !1;
                }
                this.setAnimation(0, "Dead", !1, function () {
                    if (s) {
                        n.reborn(cc.pvz.runtimeData.hasEnableBuff(804) ? 1 : 0.3);
                        n.showBuffEffect("revive", !1);
                    } else {
                        n.hasDie = !0;
                        n.scene.checkIsFail();
                        n.spine.setCompleteListener(null);
                    }
                });
            }
        }
    },
    reborn: function (t) {
        // 复活
        var e = this;
        this.setAnimation(0, "fuhuo", !1, function () {
            e.hp = e.item.maxHp * t;
            e.item.updateHp();
            e.hasDie = !1;
            e.setAnimation(0, "Idle", !0, null);
        });
    },
    showBuffEffect: function (t, e) {
        if (void 0 === e) {
            e = !1;
        }
        if (e) {
            this.scene.addBuffPrefab
                .addNodeTo(this.item.spine.node, cc.Vec2.ZERO)
                .getComponent(sp.Skeleton)
                .setAnimation(0, t, !1);
        } else {
            this.scene.showBuffEffect(t, this.node.position);
        }
    },
    update: function (t) {
        // 确保初始化完成
        if (!this.isInitialized || !this.scene) {
            if (!this.loggedNotInit) {
                console.warn("[Hero Update] ID未知, 未初始化或scene不存在");
                this.loggedNotInit = true;
            }
            return;
        }
        if (this.scene && !this.scene.timePaused && !(this.scene.hasEnded || this.hp <= 0 || this.hasDie)) {
            var e = t * cc.director.getScheduler().getTimeScale();
            // 每秒只打印一次日志，避免刷屏
            if (!this.lastLogTime) {
                this.lastLogTime = 0;
            }
            var currentTime = Date.now();
            if (currentTime - this.lastLogTime > 1000) {
                console.log("[Hero Update] ID:" + this.info.id + ", enabled:" + this.enabled + ", 位置:" + this.node.position + ", 敌人数:" + (this.scene.enemys ? this.scene.enemys.length : 0) + ", isMoving:" + this.isMoving);
                this.lastLogTime = currentTime;
            }
            this.updateMovement(e);
        }
    },
    updateMovement: function (t) {
        // 检查是否有敌人存在
        if (!this.scene.enemys || this.scene.enemys.length === 0) {
            // 没有敌人时，返回初始位置
            this.returnToInitialPosition(t);
            return;
        }
        
        // 寻找最近的敌人（所有英雄都移动，不区分类型）
        var e = this.scene.chooseEnemy(this, 999999);
        
        // 添加调试日志
        if (!this.movementDebugCount) {
            this.movementDebugCount = 0;
        }
        this.movementDebugCount++;
        
        // 每2秒打印一次调试信息
        if (this.movementDebugCount % 120 === 1) {
            console.log("[Hero updateMovement] ID:" + this.info.id + 
                        ", 找到敌人:" + !!e + 
                        ", 敌人总数:" + this.scene.enemys.length +
                        ", isMoving:" + this.isMoving +
                        ", isAttacking:" + this.isAttacking);
        }
        
        if (e && e.hp > 0) {
            this.currentTarget = e;
            var i = e.node.position.add(cc.v2(0, e.centerY));
            var n = i.sub(this.node.position);
            var o = n.lengthSqr();
            
            // 每2秒打印距离信息
            if (this.movementDebugCount % 120 === 1) {
                console.log("[Hero updateMovement] ID:" + this.info.id + 
                            ", 距敌人:" + Math.sqrt(o).toFixed(1) + 
                            ", 攻击范围:" + Math.sqrt(this.atkRR).toFixed(1));
            }
            
            // 检查是否在攻击范围内（添加小容差值，避免浮点数精度问题）
            var attackRangeBuffer = this.atkRR * 1.05; // 增加5%的容差
            if (o <= attackRangeBuffer) {
                // 在攻击范围内，停止移动
                if (this.isMoving) {
                    this.isMoving = false;
                    this.hasReachedAttackRange = true;
                    console.log("[Hero] ID:" + this.info.id + " 到达攻击范围，停止移动");
                    // 动画由攻击系统控制，这里不切换
                }
            } else {
                // 不在攻击范围内，继续向敌人移动
                if (!this.isMoving) {
                    this.isMoving = true;
                    this.hasReachedAttackRange = false;
                    console.log("[Hero] 🚶 ID:" + this.info.id + " 开始向敌人移动，当前距离:" + Math.sqrt(o).toFixed(1));
                    // 只在非攻击状态时切换为移动动画
                    if (!this.isAttacking) {
                        this.setAnimation(0, "Walk", !0, null);
                    }
                }
                
                // 计算移动方向和移动
                var s = Math.atan2(n.y, n.x);
                var c = cc.v2(this.moveSpeed * Math.cos(s) * t, this.moveSpeed * Math.sin(s) * t);
                
                // 更新位置
                var oldPos = this.node.position.clone();
                this.node.position = this.node.position.add(c);
                this.node.zIndex = -this.node.y;
                this.item.barNode.position = this.item.barNode.position.add(c);

                this.updateItemSpinePosition();
                
                // 调试：打印移动信息（每2秒一次）
                if (!this.lastMoveLogTime) {
                    this.lastMoveLogTime = 0;
                }
                var nowTime = Date.now();
                if (nowTime - this.lastMoveLogTime > 2000) {
                    console.log("[Hero Move] 🚶 ID:" + this.info.id + " 正在移动，位置:" + this.node.position.x.toFixed(1) + "," + this.node.position.y.toFixed(1));
                    this.lastMoveLogTime = nowTime;
                }
                
                // 更新position2用于敌人的攻击判断
                this.position2 = this.node.position.add(this.item.attOffset);
            }
        } else {
            // 没有有效敌人，返回初始位置
            this.returnToInitialPosition(t);
        }
    },
    updateItemSpinePosition: function () {
        // 如果使用character攻击系统，不需要更新item.spine的位置
        // 因为character spine是Hero节点的子节点，会自动跟随移动
        if (this.useCharacterAttack) {
            return;
        }
        
        // 原来的plant系统需要同步item.spine位置（保留向后兼容）
        // 将Hero节点的世界坐标转换为item.spine父节点的本地坐标
        if (this.item && this.item.spine && this.item.spine.node) {
            // 获取Hero节点的世界坐标
            var heroWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            // 转换为item.spine父节点的本地坐标
            var spineLocalPos = this.item.spine.node.parent.convertToNodeSpaceAR(heroWorldPos);
            
            // 调试：首次移动时打印日志
            if (!this.loggedSpineUpdate) {
                console.log("[Hero] ID:" + this.info.id + " 第一次同步spine位置 - Hero世界坐标:", heroWorldPos, "spine本地坐标:", spineLocalPos);
                this.loggedSpineUpdate = true;
            }
            
            // 更新item.spine的位置
            this.item.spine.node.position = spineLocalPos;
        } else {
            if (!this.loggedSpineError) {
                console.error("[Hero] ID:" + this.info.id + " 无法同步spine位置！item:", !!this.item, "spine:", !!(this.item && this.item.spine), "spine.node:", !!(this.item && this.item.spine && this.item.spine.node));
                this.loggedSpineError = true;
            }
        }
    },
    returnToInitialPosition: function (t) {
        var distSqr = this.node.position.sub(this.initialPosition).lengthSqr();
        if (distSqr > 1) {
            if (!this.isMoving) {
                this.isMoving = true;
                if (!this.isAttacking) {
                    this.setAnimation(0, "Walk", !0, null);
                }
            }
            var a = this.initialPosition.sub(this.node.position);
            var r = Math.atan2(a.y, a.x);
            var h = cc.v2(this.moveSpeed * Math.cos(r) * t, this.moveSpeed * Math.sin(r) * t);
            if (h.lengthSqr() > a.lengthSqr()) {
                this.node.position = this.initialPosition.clone();
            } else {
                this.node.position = this.node.position.add(h);
            }
            this.node.zIndex = -this.node.y;
            
            // 【关键】同步更新item.spine的显示位置
            this.updateItemSpinePosition();
            
            this.position2 = this.node.position.add(this.item.attOffset);
        } else {
            if (this.isMoving) {
                this.isMoving = false;
                // 返回初始位置后，恢复item.spine到初始位置
                // 如果使用character攻击系统，不需要恢复item.spine位置
                if (!this.useCharacterAttack && 
                    this.item && this.item.spine && this.item.spine.node) {
                    this.item.spine.node.position = this.itemSpineInitialPos.clone();
                }
                if (!this.isAttacking) {
                    this.setAnimation(0, "Idle", !0, null);
                }
            }
        }
    },
});