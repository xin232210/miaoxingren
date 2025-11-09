
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/Hero.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'c10aaYp4v9JQa5O0YxpAt/C', 'Hero');
// game/scripts/Hero.js

"use strict";

var $bullet = require("./Bullet");

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    zd: $bullet,
    zd2: $bullet,
    landMineNode: cc.Node
  },
  onLoad: function onLoad() {
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
    } // 启用update方法以支持移动逻辑


    this.enabled = true;
  },
  start: function start() {},
  initBy: function initBy(t, e, i, characterSpine) {
    var n = this;
    this.scene = t;
    this.info = i;
    this.item = e; // 使用传入的character spine作为显示spine

    this.spine = characterSpine;
    this.characterSpine = characterSpine; // 保存原来的item.spine引用

    this.itemSpineOriginal = this.item.spine; // 检查原始spine和character spine是否是同一个对象

    var isSameSpine = this.itemSpineOriginal === characterSpine; // 将item.spine指向character spine，这样Item组件能正常工作

    this.item.spine = characterSpine; // 保存item.spine节点的初始位置（如果存在）

    if (this.itemSpineOriginal && this.itemSpineOriginal.node) {
      this.itemSpineInitialPos = this.itemSpineOriginal.node.position.clone(); // 只有当原始spine和character spine不是同一个对象时，才隐藏原始spine
      // 如果是同一个，说明用户在编辑器中已经配置了character spine，不应该隐藏它

      if (!isSameSpine) {
        console.log("[Hero] 隐藏原始plant spine，ID:" + this.info.id);
        this.itemSpineOriginal.node.active = false;
      } else {
        console.log("[Hero] 使用编辑器配置的spine，不隐藏，ID:" + this.info.id);
      }
    } // 确保当前使用的spine是可见的


    if (this.spine && this.spine.node) {
      this.spine.node.active = true;
      console.log("[Hero] 确保spine可见，ID:" + this.info.id + ", active:" + this.spine.node.active);
    }

    var o = this.info.json.range;
    this.atkRR = o * o;
    this.lvs = [];
    this.hp = this.item.maxHp;
    this.shieldValue = 0;
    this.hasDie = !1; // 设置角色动画和事件监听

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
    cc.butler.node.on("lvup", this.onLvup, this); // 移动相关的初始化

    this.initialPosition = this.node.position.clone();
    this.moveSpeed = 20; // 英雄移动速度

    this.currentTarget = null;
    this.isMoving = false;
    this.hasReachedAttackRange = false;
    this.isInitialized = true; // 攻击状态初始化

    this.isAttacking = false;
    this.currentAttackTarget = null;
    this.item.inCoolDown = false; // 确保冷却状态被正确初始化
    // 不再需要子弹系统，攻击通过动画事件触发

    this.useCharacterAttack = true;
    console.log("[Hero] 攻击状态初始化，ID:" + this.info.id + ", isAttacking:" + this.isAttacking + ", inCoolDown:" + this.item.inCoolDown); // 关键：确保Hero组件在初始化后启用，以便update方法能被调用

    this.enabled = true; // 调试日志，确认初始化完成

    console.log("[Hero] initBy完成，ID:" + this.info.id + ", enabled:" + this.enabled + ", spine:" + (this.spine ? this.spine.defaultSkin : "null") + ", 攻击范围:" + Math.sqrt(this.atkRR));
    console.log("[Hero] spine节点信息 - active:" + (this.spine && this.spine.node ? this.spine.node.active : "null") + ", 位置:" + (this.spine && this.spine.node ? this.spine.node.position : "null") + ", 缩放:" + (this.spine && this.spine.node ? this.spine.node.scale : "null") + ", 不透明度:" + (this.spine && this.spine.node ? this.spine.node.opacity : "null"));
  },
  onLvup: function onLvup(t) {
    if (this.item.index == t) {
      this.item.lvup(!1);
      this.scene.hub.showLvupEffect(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
    }
  },
  setupAnimationEvents: function setupAnimationEvents() {
    var n = this; // 监听Spine动画事件，在攻击动画的关键帧触发伤害判定

    if (this.spine && this.spine.setEventListener) {
      this.spine.setEventListener(function (trackEntry, event) {
        // 当动画事件名为"attack"或"hit"时，执行攻击逻辑
        if (event.data.name === "attack" || event.data.name === "hit") {
          n.onAnimationAttackEvent();
        }
      });
    }
  },
  onAnimationAttackEvent: function onAnimationAttackEvent() {
    // 在动画事件触发时进行伤害判定
    var target = this.scene.chooseEnemy(this, this.atkRR);

    if (target && target.hp > 0) {
      var damage = this.getAtk(this.item.lv);
      this.dealDamageToEnemy(target, damage);
    }
  },
  dealDamageToEnemy: function dealDamageToEnemy(enemy, damage) {
    console.log("[Hero dealDamageToEnemy] 开始计算，ID:" + this.info.id + ", 原始伤害:" + damage + ", 敌人HP:" + enemy.hp); // 应用各种增益效果

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
    } // 检查暴击


    var critType = 0;

    if (this.checkCrit({}, enemy)) {
      critType = 1;
      damage *= this.getCritPlus({}, enemy);
      console.log("[Hero] 暴击！伤害:" + damage);
    } // 随机浮动


    damage *= cc.math.randomRange(0.95, 1.05);
    console.log("[Hero dealDamageToEnemy] 最终伤害:" + Math.floor(damage) + ", 暴击:" + (critType === 1)); // 造成伤害

    enemy.hurtBy(this, damage); // 显示伤害数字

    this.scene.showEnemyHurtNum(critType, enemy.node.position, damage); // 显示击中特效（仅在非character攻击系统时显示plant特效）
    // character系统使用动画自带的特效

    if (!this.useCharacterAttack) {
      this.scene.showJsEffect(enemy.node.position, this.info.id);
    } // 统计伤害


    cc.pvz.runtimeData.stats[this.info.id] += damage; // 应用各种debuff效果

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
  setAnimation: function setAnimation(t, e, i, n) {
    // this.spine.setAnimation(t, e + (this.item.lv + 1), i);
    if (!this.spine) {
      console.error("[Hero setAnimation] spine为空！ID:" + (this.info ? this.info.id : "unknown"));
      return;
    } // 如果使用character spine，需要映射动画名称


    var animName = e;

    if (this.characterSpine && this.spine === this.characterSpine) {
      // 动画名称映射：plant动画 -> character动画
      var animMap = {
        "Idle": "Idle",
        "Hit": "Hit",
        "Dead": "Dead",
        "Walk": "Walk",
        "fuhuo": "Idle" // 复活动画暂时映射为Idle，character中没有fuhuo

      };
      animName = animMap[e] || e;
    }

    console.log("[Hero setAnimation] ID:" + (this.info ? this.info.id : "unknown") + ", 动画:" + animName + ", spine节点active:" + (this.spine.node ? this.spine.node.active : "null"));
    this.spine.setAnimation(t, animName, i);
    this.spine.setCompleteListener(n);
  },
  getAtk: function getAtk(t) {
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
  getShield: function getShield(t) {
    var e = Math.min(this.info.lv1, this.info.json.attribute2.length - 1);
    var i = this.info.json.attribute2[e];

    if (t > 0) {
      i *= this.info.json.fightlvup2[t - 1] / 100;
    }

    return i;
  },
  pushLvAndAtk: function pushLvAndAtk(t) {
    var e = this.getAtk(t.lv);
    this.lvs.push({
      lv: t.lv,
      atk: e
    });
  },
  playAttAndDo: function playAttAndDo(t, e) {
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
  playSound: function playSound() {
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
  tryShoot: function tryShoot(t, e) {
    var i = this; // 添加调试计数器

    if (!this.tryShootCallCount) {
      this.tryShootCallCount = 0;
    }

    this.tryShootCallCount++; // 每10次调用打印一次，避免刷屏

    if (this.tryShootCallCount % 10 === 1) {
      console.log("[Hero tryShoot] ID:" + this.info.id + " 被调用，次数:" + this.tryShootCallCount + ", useCharacterAttack:" + this.useCharacterAttack + ", isAttacking:" + this.isAttacking + ", inCoolDown:" + this.item.inCoolDown);
    } // 如果使用character攻击系统，直接播放攻击动画


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
      } // 重置"没有目标"日志标志


      this.loggedNoTarget = false; // 如果正在攻击中，不重复触发

      if (this.isAttacking) {
        return false;
      }

      this.isAttacking = true;
      this.currentAttackTarget = target; // 播放攻击动画（Hit或Throwing）

      var attackAnim = "Hit"; // 默认近战攻击

      var attackDelay = 200; // 默认延迟200ms触发伤害（动画播放到一半）
      // 投掷型英雄可以使用Throwing动画

      if ([4, 5, 12].indexOf(this.info.id) !== -1) {
        attackAnim = "Throwing";
        attackDelay = 300; // 投掷动画延迟更长
      }

      console.log("[Hero tryShoot] ✅ ID:" + this.info.id + " 开始攻击！动画:" + attackAnim + ", 目标ID:" + target.id + ", 目标HP:" + target.hp + ", spine存在:" + !!this.spine + ", spine.node.active:" + (this.spine && this.spine.node ? this.spine.node.active : "null"));
      this.setAnimation(0, attackAnim, false, function () {
        console.log("[Hero] ✅ ID:" + i.info.id + " 攻击动画完成，isAttacking:" + i.isAttacking + " → false");
        i.isAttacking = false;
        i.setAnimation(0, "Idle", true, null); // 使用character攻击系统，不需要子弹重装填机制
        // Item.js已经设置了inCoolDown=true，我们只需要设置计时器来重置它

        console.log("[Hero] ID:" + i.info.id + " 设置冷却计时器，当前 inCoolDown:" + i.item.inCoolDown); // 无条件设置冷却计时器（因为Item.js已经设置了inCoolDown=true）

        var cdTime = i.item.cdMs || 500; // 默认500ms冷却

        console.log("[Hero] ID:" + i.info.id + " 启动冷却计时器，时间:" + cdTime + "ms");
        i.scene.setTimeout(function () {
          i.item.inCoolDown = false;
          console.log("[Hero] ⏰ ID:" + i.info.id + " 冷却完成！inCoolDown:" + i.item.inCoolDown);
        }, cdTime);
      }); // 延迟触发伤害判定（模拟攻击动画的打击点）

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
    } // 以下是原来的子弹系统逻辑（保留向后兼容）
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
      } // 检查当前目标是否在攻击范围内


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
        return !!r && (this.pushLvAndAtk(t), !this.isAttacking && (this.isAttacking = !0, this.playAttAndDo(function () {
          if (r.isValid) {
            i.isAttacking = !1;
            i.checkToShoot(r);
          }
        }, function () {
          if (i.item.bulletCount <= 0 && i.IKBone) {
            cc.tween(i.IKBone).to(0.064, {
              x: 150,
              y: 50
            }).start();
          }
        }), // 仅当使用plant spine时才使用IK骨骼
        // character spine不需要IK瞄准
        (!this.characterSpine || this.spine !== this.characterSpine) && (this.IKBone || (this.IKBone = this.spine.findBone("IK")), cc.tween(this.IKBone).to(0.064, {
          x: (r.node.x - this.node.x) / 0.76,
          y: (r.node.y + r.centerY - this.node.y) / 0.76
        }).start()), !0));

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
        return !!n && (this.playAttAndDo(function () {
          var t = i.getAtk(i.item.lv);

          if (i.checkBuff(802)) {
            t *= 1.2;
          }

          n.addHp(t);
          i.scene.showBuffEffect("HP", n.node.position);
        }), !0);

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

          i.scene.showBuffEffect("music", i.node.position.add(cc.v2(0, 50)), i.scene.getAngerBarWPos(), function () {
            cc.pvz.runtimeData.anger += t;
            i.scene.updateAnger();
          });
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

          var e = function e() {
            var t = cc.instantiate(i.landMineNode);
            var e = cc.v2(i.scene.getHeroesMaxMarginX() + cc.math.randomRange(0, 150), cc.math.randomRange(i.scene.groundAreaLB.y + 120, i.scene.groundAreaTR.y - 120));
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

            var p = function p(t) {
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
    return !!r && (this.pushLvAndAtk(t), !this.isAttacking && (this.isAttacking = !0, this.playAttAndDo(function () {
      if (r.isValid) {
        i.isAttacking = !1;
        i.checkToShoot(r);
      }
    }, function () {
      if (i.item.bulletCount <= 0 && i.IKBone) {
        cc.tween(i.IKBone).to(0.064, {
          x: 150,
          y: 50
        }).start();
      }
    }), // 仅当使用plant spine时才使用IK骨骼
    // character spine不需要IK瞄准
    (!this.characterSpine || this.spine !== this.characterSpine) && (this.IKBone || (this.IKBone = this.spine.findBone("IK")), cc.tween(this.IKBone).to(0.064, {
      x: (r.node.x - this.node.x) / 0.76,
      y: (r.node.y + r.centerY - this.node.y) / 0.76
    }).start()), !0));
  },
  checkToShoot: function checkToShoot(t) {
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
  getShootAPos: function getShootAPos() {
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
    } // 原来的子弹系统逻辑（保留向后兼容）


    if (this.GPBone) {//
    } else {
      this.GPBone = this.spine.findBone("GP");
    }

    var t = cc.v2(this.GPBone.worldX, this.GPBone.worldY);
    return this.spine.node.convertToWorldSpaceAR(t);
  },
  shoot: function shoot(t, e, i) {
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
  shoot1: function shoot1(t, e, i) {
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

    h.moveByAngle(180 * c / Math.PI);
  },
  shootN: function shootN(t, e, i, n) {
    var o = this.getShootAPos();
    var s = this.scene.bulletsRoot.convertToNodeSpaceAR(o);
    var c = e.node.position.add(cc.v2(0, e.centerY)).sub(s);

    if (c.x < 0) {
      c.x = 0;
    }

    var a = 180 * Math.atan2(c.y, c.x) / Math.PI;
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
  shootIK: function shootIK(t, e, i) {
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
  checkHeroBuff: function checkHeroBuff() {
    return !1;
  },
  checkBuff: function checkBuff(t) {
    var e = (t - t % 100) / 100;
    return this.info.id == e && cc.pvz.runtimeData.hasEnableBuff(t);
  },
  doBulletAttLogic: function doBulletAttLogic(t, e) {
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

    if (t.jsEffExclusive) {//
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
  checkCrit: function checkCrit() {
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
  getCritPlus: function getCritPlus() {
    var t = 1.5;

    if (this.checkBuff(103)) {
      t += 0.5;
    }

    return t;
  },
  doLandMinesLogic: function doLandMinesLogic(t) {
    var e = t.getComponent("Enemy");

    if (e && e.hp > 0) {
      this.doBulletAttLogic({
        att: this.getAtk(this.item.lv),
        lv: this.item.lv,
        jsEffExclusive: !0
      }, e);
    }
  },
  onLandminesCollision: function onLandminesCollision(t, e) {
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
  addHp: function addHp(t) {
    this.hp = Math.min(this.item.maxHp, this.hp + t);
    this.item.updateHp(this.hp / this.item.maxHp);
    this.scene.updateHp(!0);
  },
  delHp: function delHp(t) {
    this.hp = Math.max(0, this.hp - t);
    this.item.updateHp(this.hp / this.item.maxHp);
    this.scene.updateHp(!0);
  },
  addShield: function addShield(t) {
    this.shieldValue = Math.min(this.item.maxHp, this.shieldValue + t);
    this.item.updateShield(this.shieldValue / this.item.maxHp);
    this.scene.updateShield();
  },
  hurtBy: function hurtBy(t, e, i) {
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
        var s = !cc.pvz.runtimeData.hasUseReborn && (8 == this.info.id || this.scene.hasHero(8)) && cc.pvz.runtimeData.hasEnableBuff(803);

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
  reborn: function reborn(t) {
    // 复活
    var e = this;
    this.setAnimation(0, "fuhuo", !1, function () {
      e.hp = e.item.maxHp * t;
      e.item.updateHp();
      e.hasDie = !1;
      e.setAnimation(0, "Idle", !0, null);
    });
  },
  showBuffEffect: function showBuffEffect(t, e) {
    if (void 0 === e) {
      e = !1;
    }

    if (e) {
      this.scene.addBuffPrefab.addNodeTo(this.item.spine.node, cc.Vec2.ZERO).getComponent(sp.Skeleton).setAnimation(0, t, !1);
    } else {
      this.scene.showBuffEffect(t, this.node.position);
    }
  },
  update: function update(t) {
    // 确保初始化完成
    if (!this.isInitialized || !this.scene) {
      if (!this.loggedNotInit) {
        console.warn("[Hero Update] ID未知, 未初始化或scene不存在");
        this.loggedNotInit = true;
      }

      return;
    }

    if (this.scene && !this.scene.timePaused && !(this.scene.hasEnded || this.hp <= 0 || this.hasDie)) {
      var e = t * cc.director.getScheduler().getTimeScale(); // 每秒只打印一次日志，避免刷屏

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
  updateMovement: function updateMovement(t) {
    // 检查是否有敌人存在
    if (!this.scene.enemys || this.scene.enemys.length === 0) {
      // 没有敌人时，返回初始位置
      this.returnToInitialPosition(t);
      return;
    } // 寻找最近的敌人（所有英雄都移动，不区分类型）


    var e = this.scene.chooseEnemy(this, 999999); // 添加调试日志

    if (!this.movementDebugCount) {
      this.movementDebugCount = 0;
    }

    this.movementDebugCount++; // 每2秒打印一次调试信息

    if (this.movementDebugCount % 120 === 1) {
      console.log("[Hero updateMovement] ID:" + this.info.id + ", 找到敌人:" + !!e + ", 敌人总数:" + this.scene.enemys.length + ", isMoving:" + this.isMoving + ", isAttacking:" + this.isAttacking);
    }

    if (e && e.hp > 0) {
      this.currentTarget = e;
      var i = e.node.position.add(cc.v2(0, e.centerY));
      var n = i.sub(this.node.position);
      var o = n.lengthSqr(); // 每2秒打印距离信息

      if (this.movementDebugCount % 120 === 1) {
        console.log("[Hero updateMovement] ID:" + this.info.id + ", 距敌人:" + Math.sqrt(o).toFixed(1) + ", 攻击范围:" + Math.sqrt(this.atkRR).toFixed(1));
      } // 检查是否在攻击范围内（添加小容差值，避免浮点数精度问题）


      var attackRangeBuffer = this.atkRR * 1.05; // 增加5%的容差

      if (o <= attackRangeBuffer) {
        // 在攻击范围内，停止移动
        if (this.isMoving) {
          this.isMoving = false;
          this.hasReachedAttackRange = true;
          console.log("[Hero] ID:" + this.info.id + " 到达攻击范围，停止移动"); // 动画由攻击系统控制，这里不切换
        }
      } else {
        // 不在攻击范围内，继续向敌人移动
        if (!this.isMoving) {
          this.isMoving = true;
          this.hasReachedAttackRange = false;
          console.log("[Hero] 🚶 ID:" + this.info.id + " 开始向敌人移动，当前距离:" + Math.sqrt(o).toFixed(1)); // 只在非攻击状态时切换为移动动画

          if (!this.isAttacking) {
            this.setAnimation(0, "Walk", !0, null);
          }
        } // 计算移动方向和移动


        var s = Math.atan2(n.y, n.x);
        var c = cc.v2(this.moveSpeed * Math.cos(s) * t, this.moveSpeed * Math.sin(s) * t); // 更新位置

        var oldPos = this.node.position.clone();
        this.node.position = this.node.position.add(c);
        this.node.zIndex = -this.node.y;
        this.item.barNode.position = this.item.barNode.position.add(c);
        this.updateItemSpinePosition(); // 调试：打印移动信息（每2秒一次）

        if (!this.lastMoveLogTime) {
          this.lastMoveLogTime = 0;
        }

        var nowTime = Date.now();

        if (nowTime - this.lastMoveLogTime > 2000) {
          console.log("[Hero Move] 🚶 ID:" + this.info.id + " 正在移动，位置:" + this.node.position.x.toFixed(1) + "," + this.node.position.y.toFixed(1));
          this.lastMoveLogTime = nowTime;
        } // 更新position2用于敌人的攻击判断


        this.position2 = this.node.position.add(this.item.attOffset);
      }
    } else {
      // 没有有效敌人，返回初始位置
      this.returnToInitialPosition(t);
    }
  },
  updateItemSpinePosition: function updateItemSpinePosition() {
    // 如果使用character攻击系统，不需要更新item.spine的位置
    // 因为character spine是Hero节点的子节点，会自动跟随移动
    if (this.useCharacterAttack) {
      return;
    } // 原来的plant系统需要同步item.spine位置（保留向后兼容）
    // 将Hero节点的世界坐标转换为item.spine父节点的本地坐标


    if (this.item && this.item.spine && this.item.spine.node) {
      // 获取Hero节点的世界坐标
      var heroWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position); // 转换为item.spine父节点的本地坐标

      var spineLocalPos = this.item.spine.node.parent.convertToNodeSpaceAR(heroWorldPos); // 调试：首次移动时打印日志

      if (!this.loggedSpineUpdate) {
        console.log("[Hero] ID:" + this.info.id + " 第一次同步spine位置 - Hero世界坐标:", heroWorldPos, "spine本地坐标:", spineLocalPos);
        this.loggedSpineUpdate = true;
      } // 更新item.spine的位置


      this.item.spine.node.position = spineLocalPos;
    } else {
      if (!this.loggedSpineError) {
        console.error("[Hero] ID:" + this.info.id + " 无法同步spine位置！item:", !!this.item, "spine:", !!(this.item && this.item.spine), "spine.node:", !!(this.item && this.item.spine && this.item.spine.node));
        this.loggedSpineError = true;
      }
    }
  },
  returnToInitialPosition: function returnToInitialPosition(t) {
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

      this.node.zIndex = -this.node.y; // 【关键】同步更新item.spine的显示位置

      this.updateItemSpinePosition();
      this.position2 = this.node.position.add(this.item.attOffset);
    } else {
      if (this.isMoving) {
        this.isMoving = false; // 返回初始位置后，恢复item.spine到初始位置
        // 如果使用character攻击系统，不需要恢复item.spine位置

        if (!this.useCharacterAttack && this.item && this.item.spine && this.item.spine.node) {
          this.item.spine.node.position = this.itemSpineInitialPos.clone();
        }

        if (!this.isAttacking) {
          this.setAnimation(0, "Idle", !0, null);
        }
      }
    }
  }
});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSGVyby5qcyJdLCJuYW1lcyI6WyIkYnVsbGV0IiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiemQiLCJ6ZDIiLCJsYW5kTWluZU5vZGUiLCJOb2RlIiwib25Mb2FkIiwibm9kZSIsImFjdGl2ZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJlbmFibGVkIiwic3RhcnQiLCJpbml0QnkiLCJ0IiwiaSIsImNoYXJhY3RlclNwaW5lIiwibiIsInNjZW5lIiwiaW5mbyIsIml0ZW0iLCJpdGVtU3BpbmVPcmlnaW5hbCIsImlzU2FtZVNwaW5lIiwiaXRlbVNwaW5lSW5pdGlhbFBvcyIsInBvc2l0aW9uIiwiY2xvbmUiLCJsb2ciLCJpZCIsIm8iLCJqc29uIiwicmFuZ2UiLCJhdGtSUiIsImx2cyIsImhwIiwibWF4SHAiLCJzaGllbGRWYWx1ZSIsImhhc0RpZSIsInNldEFuaW1hdGlvbiIsInNldHVwQW5pbWF0aW9uRXZlbnRzIiwiaXNQaHkiLCJpc01hZ2ljIiwiaXMzZ3oiLCJzb21lIiwiaXMyZ3oiLCJidXRsZXIiLCJvbiIsIm9uTHZ1cCIsImluaXRpYWxQb3NpdGlvbiIsIm1vdmVTcGVlZCIsImN1cnJlbnRUYXJnZXQiLCJpc01vdmluZyIsImhhc1JlYWNoZWRBdHRhY2tSYW5nZSIsImlzSW5pdGlhbGl6ZWQiLCJpc0F0dGFja2luZyIsImN1cnJlbnRBdHRhY2tUYXJnZXQiLCJpbkNvb2xEb3duIiwidXNlQ2hhcmFjdGVyQXR0YWNrIiwiZGVmYXVsdFNraW4iLCJNYXRoIiwic3FydCIsInNjYWxlIiwib3BhY2l0eSIsImluZGV4IiwibHZ1cCIsImh1YiIsInNob3dMdnVwRWZmZWN0IiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwiVmVjMiIsIlpFUk8iLCJzZXRFdmVudExpc3RlbmVyIiwidHJhY2tFbnRyeSIsImV2ZW50IiwiZGF0YSIsIm5hbWUiLCJvbkFuaW1hdGlvbkF0dGFja0V2ZW50IiwidGFyZ2V0IiwiY2hvb3NlRW5lbXkiLCJkYW1hZ2UiLCJnZXRBdGsiLCJsdiIsImRlYWxEYW1hZ2VUb0VuZW15IiwiZW5lbXkiLCJjaGVja0J1ZmYiLCJjcml0VHlwZSIsImNoZWNrQ3JpdCIsImdldENyaXRQbHVzIiwibWF0aCIsInJhbmRvbVJhbmdlIiwiZmxvb3IiLCJodXJ0QnkiLCJzaG93RW5lbXlIdXJ0TnVtIiwic2hvd0pzRWZmZWN0IiwicHZ6IiwicnVudGltZURhdGEiLCJzdGF0cyIsInJhbmRvbSIsImFkZEJ1ZmZXZWFrIiwicmVwdWxzZSIsImFuaW1OYW1lIiwiYW5pbU1hcCIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJtaW4iLCJsdjEiLCJhdHRyaWJ1dGUyIiwibGVuZ3RoIiwiZmlnaHRsdnVwMiIsImdldEJ1ZmZWYWx1ZSIsIml0ZW1zIiwiZ2V0U2hpZWxkIiwicHVzaEx2QW5kQXRrIiwicHVzaCIsImF0ayIsInBsYXlBdHRBbmREbyIsImNoZWNrVG9TdGFydFJlbG9hZFRpbWVyIiwicGxheVNvdW5kIiwicGxheUVmZmVjdEFzeW5jIiwidHJ5U2hvb3QiLCJ0cnlTaG9vdENhbGxDb3VudCIsImF0dGFja1JhbmdlQnVmZmVyIiwibG9nZ2VkTm9UYXJnZXQiLCJ0b0ZpeGVkIiwiYXR0YWNrQW5pbSIsImF0dGFja0RlbGF5IiwiaW5kZXhPZiIsImNkVGltZSIsImNkTXMiLCJzZXRUaW1lb3V0IiwibmVlZFRhcmdldENoZWNrIiwibmVhclRhcmdldCIsInRhcmdldFBvcyIsImFkZCIsInYyIiwiY2VudGVyWSIsImRpc3RhbmNlIiwic3ViIiwibGVuZ3RoU3FyIiwiciIsImlzVmFsaWQiLCJjaGVja1RvU2hvb3QiLCJidWxsZXRDb3VudCIsIklLQm9uZSIsInR3ZWVuIiwidG8iLCJ4IiwieSIsImZpbmRCb25lIiwiaGFzRW5hYmxlQnVmZiIsImNyb3NzSXRlbXMiLCJmb3JFYWNoIiwiaGVybyIsImFkZFNoaWVsZCIsInNob3dCdWZmRWZmZWN0IiwiY2hvb3NlTWluSHBIZXJvIiwiYWRkSHAiLCJnZXRBbmdlckJhcldQb3MiLCJhbmdlciIsInVwZGF0ZUFuZ2VyIiwibGFzdEJ1bGxldENvdW50IiwiaW5zdGFudGlhdGUiLCJnZXRIZXJvZXNNYXhNYXJnaW5YIiwiZ3JvdW5kQXJlYUxCIiwiZ3JvdW5kQXJlYVRSIiwicGFyZW50Iiwib2Jqc1Jvb3QiLCJ6SW5kZXgiLCJnZXRDb21wb25lbnQiLCJDb2xsaWRlciIsInMiLCJtYXgiLCJjaG9vc2VFbmVteXMiLCJjIiwiYSIsImgiLCJidWxsZXRzUm9vdCIsImRlZmF1bHRBbmltYXRpb24iLCJkIiwidSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwiYXR0IiwicCIsImwiLCJzaGlmdCIsInNob290IiwiYmluZCIsImdldFNob290QVBvcyIsIkhhbmRCb25lIiwid29ybGRYIiwid29ybGRZIiwiR1BCb25lIiwic2hvb3ROIiwic2hvb3RJSyIsInNob290MSIsImF0YW4yIiwiaGl0Q291bnQiLCJtb2RlIiwibW92ZUJ5QW5nbGUiLCJQSSIsImNvbGxpZGVyIiwicmFkaXVzIiwic2V0VHJhY2tFdmVudExpc3RlbmVyIiwiY2hlY2tIZXJvQnVmZiIsImRvQnVsbGV0QXR0TG9naWMiLCJ3ZWFrTm9kZSIsImFjdEJ1ZmYxIiwianNFZmZFeGNsdXNpdmUiLCJidWZmU2xvdyIsImFkZEJ1ZmZTbG93IiwiYnVmZkljZSIsImFkZEJ1ZmZJY2UiLCJhdHRDb3VudGVyIiwiZG9MYW5kTWluZXNMb2dpYyIsIm9uTGFuZG1pbmVzQ29sbGlzaW9uIiwiZmluZCIsInV0aWxzIiwibWFudWFsbHlDaGVja0NvbGxpZGVyIiwiZGVzdHJveSIsInVwZGF0ZUhwIiwiZGVsSHAiLCJ1cGRhdGVTaGllbGQiLCJoYXNFbmRlZCIsImhhc1VzZVJlYm9ybiIsImhhc0hlcm8iLCJiYXJOb2RlIiwicmVib3JuIiwiY2hlY2tJc0ZhaWwiLCJhZGRCdWZmUHJlZmFiIiwiYWRkTm9kZVRvIiwidXBkYXRlIiwibG9nZ2VkTm90SW5pdCIsIndhcm4iLCJ0aW1lUGF1c2VkIiwiZGlyZWN0b3IiLCJnZXRTY2hlZHVsZXIiLCJnZXRUaW1lU2NhbGUiLCJsYXN0TG9nVGltZSIsImN1cnJlbnRUaW1lIiwiRGF0ZSIsIm5vdyIsImVuZW15cyIsInVwZGF0ZU1vdmVtZW50IiwicmV0dXJuVG9Jbml0aWFsUG9zaXRpb24iLCJtb3ZlbWVudERlYnVnQ291bnQiLCJjb3MiLCJzaW4iLCJvbGRQb3MiLCJ1cGRhdGVJdGVtU3BpbmVQb3NpdGlvbiIsImxhc3RNb3ZlTG9nVGltZSIsIm5vd1RpbWUiLCJwb3NpdGlvbjIiLCJhdHRPZmZzZXQiLCJoZXJvV29ybGRQb3MiLCJzcGluZUxvY2FsUG9zIiwibG9nZ2VkU3BpbmVVcGRhdGUiLCJsb2dnZWRTcGluZUVycm9yIiwiZGlzdFNxciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUNBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsS0FBSyxFQUFFQyxFQUFFLENBQUNDLFFBREY7SUFFUkMsRUFBRSxFQUFFVCxPQUZJO0lBR1JVLEdBQUcsRUFBRVYsT0FIRztJQUlSVyxZQUFZLEVBQUVULEVBQUUsQ0FBQ1U7RUFKVCxDQUZQO0VBUUxDLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixJQUFJO01BQ0EsSUFBSSxLQUFLSixFQUFMLElBQVcsS0FBS0EsRUFBTCxDQUFRSyxJQUF2QixFQUE2QjtRQUN6QixLQUFLTCxFQUFMLENBQVFLLElBQVIsQ0FBYUMsTUFBYixHQUFzQixDQUFDLENBQXZCO01BQ0g7O01BQ0QsSUFBSSxLQUFLTCxHQUFMLElBQVksS0FBS0EsR0FBTCxDQUFTSSxJQUF6QixFQUErQjtRQUMzQixLQUFLSixHQUFMLENBQVNJLElBQVQsQ0FBY0MsTUFBZCxHQUF1QixDQUFDLENBQXhCO01BQ0g7O01BQ0QsSUFBSSxLQUFLSixZQUFU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Q0FBakI7SUFDSCxDQXJCRCxNQXFCTztNQUNILElBQUksS0FBS3ZNLFFBQVQsRUFBbUI7UUFDZixLQUFLQSxRQUFMLEdBQWdCLEtBQWhCLENBRGUsQ0FFZjtRQUNBOztRQUNBLElBQUksQ0FBQyxLQUFLTSxrQkFBTixJQUNBLEtBQUtwQyxJQURMLElBQ2EsS0FBS0EsSUFBTCxDQUFVdEIsS0FEdkIsSUFDZ0MsS0FBS3NCLElBQUwsQ0FBVXRCLEtBQVYsQ0FBZ0JRLElBRHBELEVBQzBEO1VBQ3RELEtBQUtjLElBQUwsQ0FBVXRCLEtBQVYsQ0FBZ0JRLElBQWhCLENBQXFCa0IsUUFBckIsR0FBZ0MsS0FBS0QsbUJBQUwsQ0FBeUJFLEtBQXpCLEVBQWhDO1FBQ0g7O1FBQ0QsSUFBSSxDQUFDLEtBQUs0QixXQUFWLEVBQXVCO1VBQ25CLEtBQUtoQixZQUFMLENBQWtCLENBQWxCLEVBQXFCLE1BQXJCLEVBQTZCLENBQUMsQ0FBOUIsRUFBaUMsSUFBakM7UUFDSDtNQUNKO0lBQ0o7RUFDSjtBQWxxQ0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyICRidWxsZXQgPSByZXF1aXJlKFwiLi9CdWxsZXRcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICB6ZDogJGJ1bGxldCxcbiAgICAgICAgemQyOiAkYnVsbGV0LFxuICAgICAgICBsYW5kTWluZU5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMuemQgJiYgdGhpcy56ZC5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56ZC5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuemQyICYmIHRoaXMuemQyLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpkMi5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubGFuZE1pbmVOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYW5kTWluZU5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbSGVybyBvbkxvYWRdIOWIneWni+WMlue7hOS7tuWksei0pTpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5ZCv55SodXBkYXRl5pa55rOV5Lul5pSv5oyB56e75Yqo6YC76L6RXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gKCkge30sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAodCwgZSwgaSwgY2hhcmFjdGVyU3BpbmUpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICB0aGlzLnNjZW5lID0gdDtcbiAgICAgICAgdGhpcy5pbmZvID0gaTtcbiAgICAgICAgdGhpcy5pdGVtID0gZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOS9v+eUqOS8oOWFpeeahGNoYXJhY3RlciBzcGluZeS9nOS4uuaYvuekunNwaW5lXG4gICAgICAgIHRoaXMuc3BpbmUgPSBjaGFyYWN0ZXJTcGluZTtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJTcGluZSA9IGNoYXJhY3RlclNwaW5lO1xuICAgICAgICBcbiAgICAgICAgLy8g5L+d5a2Y5Y6f5p2l55qEaXRlbS5zcGluZeW8leeUqFxuICAgICAgICB0aGlzLml0ZW1TcGluZU9yaWdpbmFsID0gdGhpcy5pdGVtLnNwaW5lO1xuICAgICAgICBcbiAgICAgICAgLy8g5qOA5p+l5Y6f5aeLc3BpbmXlkoxjaGFyYWN0ZXIgc3BpbmXmmK/lkKbmmK/lkIzkuIDkuKrlr7nosaFcbiAgICAgICAgdmFyIGlzU2FtZVNwaW5lID0gKHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwgPT09IGNoYXJhY3RlclNwaW5lKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWwhml0ZW0uc3BpbmXmjIflkJFjaGFyYWN0ZXIgc3BpbmXvvIzov5nmoLdJdGVt57uE5Lu26IO95q2j5bi45bel5L2cXG4gICAgICAgIHRoaXMuaXRlbS5zcGluZSA9IGNoYXJhY3RlclNwaW5lO1xuICAgICAgICBcbiAgICAgICAgLy8g5L+d5a2YaXRlbS5zcGluZeiKgueCueeahOWIneWni+S9jee9ru+8iOWmguaenOWtmOWcqO+8iVxuICAgICAgICBpZiAodGhpcy5pdGVtU3BpbmVPcmlnaW5hbCAmJiB0aGlzLml0ZW1TcGluZU9yaWdpbmFsLm5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbVNwaW5lSW5pdGlhbFBvcyA9IHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlj6rmnInlvZPljp/lp4tzcGluZeWSjGNoYXJhY3RlciBzcGluZeS4jeaYr+WQjOS4gOS4quWvueixoeaXtu+8jOaJjemakOiXj+WOn+Wni3NwaW5lXG4gICAgICAgICAgICAvLyDlpoLmnpzmmK/lkIzkuIDkuKrvvIzor7TmmI7nlKjmiLflnKjnvJbovpHlmajkuK3lt7Lnu4/phY3nva7kuoZjaGFyYWN0ZXIgc3BpbmXvvIzkuI3lupTor6XpmpDol4/lroNcbiAgICAgICAgICAgIGlmICghaXNTYW1lU3BpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDpmpDol4/ljp/lp4twbGFudCBzcGluZe+8jElEOlwiICsgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1TcGluZU9yaWdpbmFsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOS9v+eUqOe8lui+keWZqOmFjee9rueahHNwaW5l77yM5LiN6ZqQ6JeP77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDnoa7kv53lvZPliY3kvb/nlKjnmoRzcGluZeaYr+WPr+ingeeahFxuICAgICAgICBpZiAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g56Gu5L+dc3BpbmXlj6/op4HvvIxJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCBhY3RpdmU6XCIgKyB0aGlzLnNwaW5lLm5vZGUuYWN0aXZlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIG8gPSB0aGlzLmluZm8uanNvbi5yYW5nZTtcbiAgICAgICAgdGhpcy5hdGtSUiA9IG8gKiBvO1xuICAgICAgICB0aGlzLmx2cyA9IFtdO1xuICAgICAgICB0aGlzLmhwID0gdGhpcy5pdGVtLm1heEhwO1xuICAgICAgICB0aGlzLnNoaWVsZFZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5oYXNEaWUgPSAhMTtcbiAgICAgICAgXG4gICAgICAgIC8vIOiuvue9ruinkuiJsuWKqOeUu+WSjOS6i+S7tuebkeWQrFxuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICB0aGlzLnNldHVwQW5pbWF0aW9uRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmlzUGh5ID0gITA7XG4gICAgICAgIHRoaXMuaXNNYWdpYyA9ICEwO1xuICAgICAgICB0aGlzLmlzM2d6ID0gWzIsIDUsIDksIDEwXS5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCA9PSBuLml0ZW0uaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlzMmd6ID0gWzIsIDQsIDhdLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09IG4uaXRlbS5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGNjLmJ1dGxlci5ub2RlLm9uKFwibHZ1cFwiLCB0aGlzLm9uTHZ1cCwgdGhpcyk7XG4gICAgICAgIFxuICAgICAgICAvLyDnp7vliqjnm7jlhbPnmoTliJ3lp4vljJZcbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSB0aGlzLm5vZGUucG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgdGhpcy5tb3ZlU3BlZWQgPSAyMDsgLy8g6Iux6ZuE56e75Yqo6YCf5bqmXG4gICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOaUu+WHu+eKtuaAgeWIneWni+WMllxuICAgICAgICB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudEF0dGFja1RhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXRlbS5pbkNvb2xEb3duID0gZmFsc2U7IC8vIOehruS/neWGt+WNtOeKtuaAgeiiq+ato+ehruWIneWni+WMllxuICAgICAgICBcbiAgICAgICAgLy8g5LiN5YaN6ZyA6KaB5a2Q5by557O757uf77yM5pS75Ye76YCa6L+H5Yqo55S75LqL5Lu26Kem5Y+RXG4gICAgICAgIHRoaXMudXNlQ2hhcmFjdGVyQXR0YWNrID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOaUu+WHu+eKtuaAgeWIneWni+WMlu+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGlzQXR0YWNraW5nOlwiICsgdGhpcy5pc0F0dGFja2luZyArIFwiLCBpbkNvb2xEb3duOlwiICsgdGhpcy5pdGVtLmluQ29vbERvd24pO1xuICAgICAgICBcbiAgICAgICAgLy8g5YWz6ZSu77ya56Gu5L+dSGVyb+e7hOS7tuWcqOWIneWni+WMluWQjuWQr+eUqO+8jOS7peS+v3VwZGF0ZeaWueazleiDveiiq+iwg+eUqFxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgLy8g6LCD6K+V5pel5b+X77yM56Gu6K6k5Yid5aeL5YyW5a6M5oiQXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIGluaXRCeeWujOaIkO+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGVuYWJsZWQ6XCIgKyB0aGlzLmVuYWJsZWQgKyBcIiwgc3BpbmU6XCIgKyAodGhpcy5zcGluZSA/IHRoaXMuc3BpbmUuZGVmYXVsdFNraW4gOiBcIm51bGxcIikgKyBcIiwg5pS75Ye76IyD5Zu0OlwiICsgTWF0aC5zcXJ0KHRoaXMuYXRrUlIpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gc3BpbmXoioLngrnkv6Hmga8gLSBhY3RpdmU6XCIgKyAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUgPyB0aGlzLnNwaW5lLm5vZGUuYWN0aXZlIDogXCJudWxsXCIpICsgXG4gICAgICAgICAgICAgICAgICAgIFwiLCDkvY3nva46XCIgKyAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUgPyB0aGlzLnNwaW5lLm5vZGUucG9zaXRpb24gOiBcIm51bGxcIikgKyBcbiAgICAgICAgICAgICAgICAgICAgXCIsIOe8qeaUvjpcIiArICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5zY2FsZSA6IFwibnVsbFwiKSArIFxuICAgICAgICAgICAgICAgICAgICBcIiwg5LiN6YCP5piO5bqmOlwiICsgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLm9wYWNpdHkgOiBcIm51bGxcIikpO1xuICAgIH0sXG4gICAgb25MdnVwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5pdGVtLmluZGV4ID09IHQpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbS5sdnVwKCExKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuaHViLnNob3dMdnVwRWZmZWN0KHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldHVwQW5pbWF0aW9uRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgLy8g55uR5ZCsU3BpbmXliqjnlLvkuovku7bvvIzlnKjmlLvlh7vliqjnlLvnmoTlhbPplK7luKfop6blj5HkvKTlrrPliKTlrppcbiAgICAgICAgaWYgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5zZXRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW5lLnNldEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKHRyYWNrRW50cnksIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8g5b2T5Yqo55S75LqL5Lu25ZCN5Li6XCJhdHRhY2tcIuaIllwiaGl0XCLml7bvvIzmiafooYzmlLvlh7vpgLvovpFcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZGF0YS5uYW1lID09PSBcImF0dGFja1wiIHx8IGV2ZW50LmRhdGEubmFtZSA9PT0gXCJoaXRcIikge1xuICAgICAgICAgICAgICAgICAgICBuLm9uQW5pbWF0aW9uQXR0YWNrRXZlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25BbmltYXRpb25BdHRhY2tFdmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDlnKjliqjnlLvkuovku7bop6blj5Hml7bov5vooYzkvKTlrrPliKTlrppcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmhwID4gMCkge1xuICAgICAgICAgICAgdmFyIGRhbWFnZSA9IHRoaXMuZ2V0QXRrKHRoaXMuaXRlbS5sdik7XG4gICAgICAgICAgICB0aGlzLmRlYWxEYW1hZ2VUb0VuZW15KHRhcmdldCwgZGFtYWdlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVhbERhbWFnZVRvRW5lbXk6IGZ1bmN0aW9uIChlbmVteSwgZGFtYWdlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gZGVhbERhbWFnZVRvRW5lbXldIOW8gOWni+iuoeeul++8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIOWOn+Wni+S8pOWuszpcIiArIGRhbWFnZSArIFwiLCDmlYzkurpIUDpcIiArIGVuZW15LmhwKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOW6lOeUqOWQhOenjeWinuebiuaViOaenFxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDQpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTIwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDmo4Dmn6XmmrTlh7tcbiAgICAgICAgdmFyIGNyaXRUeXBlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDcml0KHt9LCBlbmVteSkpIHtcbiAgICAgICAgICAgIGNyaXRUeXBlID0gMTtcbiAgICAgICAgICAgIGRhbWFnZSAqPSB0aGlzLmdldENyaXRQbHVzKHt9LCBlbmVteSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDmmrTlh7vvvIHkvKTlrrM6XCIgKyBkYW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDpmo/mnLrmta7liqhcbiAgICAgICAgZGFtYWdlICo9IGNjLm1hdGgucmFuZG9tUmFuZ2UoMC45NSwgMS4wNSk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIGRlYWxEYW1hZ2VUb0VuZW15XSDmnIDnu4jkvKTlrrM6XCIgKyBNYXRoLmZsb29yKGRhbWFnZSkgKyBcIiwg5pq05Ye7OlwiICsgKGNyaXRUeXBlID09PSAxKSk7XG4gICAgICAgIFxuICAgICAgICAvLyDpgKDmiJDkvKTlrrNcbiAgICAgICAgZW5lbXkuaHVydEJ5KHRoaXMsIGRhbWFnZSk7XG4gICAgICAgIFxuICAgICAgICAvLyDmmL7npLrkvKTlrrPmlbDlrZdcbiAgICAgICAgdGhpcy5zY2VuZS5zaG93RW5lbXlIdXJ0TnVtKGNyaXRUeXBlLCBlbmVteS5ub2RlLnBvc2l0aW9uLCBkYW1hZ2UpO1xuICAgICAgICBcbiAgICAgICAgLy8g5pi+56S65Ye75Lit54m55pWI77yI5LuF5Zyo6Z2eY2hhcmFjdGVy5pS75Ye757O757uf5pe25pi+56S6cGxhbnTnibnmlYjvvIlcbiAgICAgICAgLy8gY2hhcmFjdGVy57O757uf5L2/55So5Yqo55S76Ieq5bim55qE54m55pWIXG4gICAgICAgIGlmICghdGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGVuZW15Lm5vZGUucG9zaXRpb24sIHRoaXMuaW5mby5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOe7n+iuoeS8pOWus1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdGhpcy5pbmZvLmlkXSArPSBkYW1hZ2U7XG4gICAgICAgIFxuICAgICAgICAvLyDlupTnlKjlkITnp41kZWJ1ZmbmlYjmnpxcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwNCkgJiYgTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICAgICAgZW5lbXkuYWRkQnVmZldlYWsoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjA0KSkge1xuICAgICAgICAgICAgZW5lbXkucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDMpKSB7XG4gICAgICAgICAgICBlbmVteS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDIpKSB7XG4gICAgICAgICAgICBlbmVteS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gZGVhbERhbWFnZVRvRW5lbXldIOWujOaIkO+8jOaVjOS6uuWJqeS9mUhQOlwiICsgZW5lbXkuaHApO1xuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uOiBmdW5jdGlvbiAodCwgZSwgaSwgbikge1xuICAgICAgICAvLyB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbih0LCBlICsgKHRoaXMuaXRlbS5sdiArIDEpLCBpKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5zcGluZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvIHNldEFuaW1hdGlvbl0gc3BpbmXkuLrnqbrvvIFJRDpcIiArICh0aGlzLmluZm8gPyB0aGlzLmluZm8uaWQgOiBcInVua25vd25cIikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDlpoLmnpzkvb/nlKhjaGFyYWN0ZXIgc3BpbmXvvIzpnIDopoHmmKDlsITliqjnlLvlkI3np7BcbiAgICAgICAgdmFyIGFuaW1OYW1lID0gZTtcbiAgICAgICAgaWYgKHRoaXMuY2hhcmFjdGVyU3BpbmUgJiYgdGhpcy5zcGluZSA9PT0gdGhpcy5jaGFyYWN0ZXJTcGluZSkge1xuICAgICAgICAgICAgLy8g5Yqo55S75ZCN56ew5pig5bCE77yacGxhbnTliqjnlLsgLT4gY2hhcmFjdGVy5Yqo55S7XG4gICAgICAgICAgICB2YXIgYW5pbU1hcCA9IHtcbiAgICAgICAgICAgICAgICBcIklkbGVcIjogXCJJZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJIaXRcIjogXCJIaXRcIixcbiAgICAgICAgICAgICAgICBcIkRlYWRcIjogXCJEZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJXYWxrXCI6IFwiV2Fsa1wiLFxuICAgICAgICAgICAgICAgIFwiZnVodW9cIjogXCJJZGxlXCIgIC8vIOWkjea0u+WKqOeUu+aaguaXtuaYoOWwhOS4uklkbGXvvIxjaGFyYWN0ZXLkuK3msqHmnIlmdWh1b1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFuaW1OYW1lID0gYW5pbU1hcFtlXSB8fCBlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHNldEFuaW1hdGlvbl0gSUQ6XCIgKyAodGhpcy5pbmZvID8gdGhpcy5pbmZvLmlkIDogXCJ1bmtub3duXCIpICsgXCIsIOWKqOeUuzpcIiArIGFuaW1OYW1lICsgXCIsIHNwaW5l6IqC54K5YWN0aXZlOlwiICsgKHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgOiBcIm51bGxcIikpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24odCwgYW5pbU5hbWUsIGkpO1xuICAgICAgICB0aGlzLnNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobik7XG4gICAgfSxcbiAgICBnZXRBdGs6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gTWF0aC5taW4odGhpcy5pbmZvLmx2MSwgdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMi5sZW5ndGggLSAxKTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyW2VdO1xuICAgICAgICBpZiAodCA+IDApIHtcbiAgICAgICAgICAgIGkgKj0gdGhpcy5pbmZvLmpzb24uZmlnaHRsdnVwMlt0IC0gMV0gLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDIpO1xuICAgICAgICB2YXIgbyA9IGNjLnB2ei5ydW50aW1lRGF0YS5nZXRCdWZmVmFsdWUoMTApO1xuICAgICAgICBpZiAobyA+IDApIHtcbiAgICAgICAgICAgIG4gKz0gbyAqIGNjLnB2ei5ydW50aW1lRGF0YS5pdGVtcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICBpICo9IDEgKyAwLjAxICogbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIGdldFNoaWVsZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSBNYXRoLm1pbih0aGlzLmluZm8ubHYxLCB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyLmxlbmd0aCAtIDEpO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTJbZV07XG4gICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgaSAqPSB0aGlzLmluZm8uanNvbi5maWdodGx2dXAyW3QgLSAxXSAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIHB1c2hMdkFuZEF0azogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmdldEF0ayh0Lmx2KTtcbiAgICAgICAgdGhpcy5sdnMucHVzaCh7XG4gICAgICAgICAgICBsdjogdC5sdixcbiAgICAgICAgICAgIGF0azogZVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHBsYXlBdHRBbmREbzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzO1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIkhpdFwiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaS5pdGVtLmNoZWNrVG9TdGFydFJlbG9hZFRpbWVyKCk7XG4gICAgICAgICAgICBpLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNwaW5lLnNldEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICB0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcGxheVNvdW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZHVuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvaHBcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9qaWd1YW5nXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2dldFN1blNoaW5lXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3Nob290XCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB0cnlTaG9vdDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy8g5re75Yqg6LCD6K+V6K6h5pWw5ZmoXG4gICAgICAgIGlmICghdGhpcy50cnlTaG9vdENhbGxDb3VudCkge1xuICAgICAgICAgICAgdGhpcy50cnlTaG9vdENhbGxDb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cnlTaG9vdENhbGxDb3VudCsrO1xuICAgICAgICBcbiAgICAgICAgLy8g5q+PMTDmrKHosIPnlKjmiZPljbDkuIDmrKHvvIzpgb/lhY3liLflsY9cbiAgICAgICAgaWYgKHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgJSAxMCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyB0cnlTaG9vdF0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDooqvosIPnlKjvvIzmrKHmlbA6XCIgKyB0aGlzLnRyeVNob290Q2FsbENvdW50ICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgdXNlQ2hhcmFjdGVyQXR0YWNrOlwiICsgdGhpcy51c2VDaGFyYWN0ZXJBdHRhY2sgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBpc0F0dGFja2luZzpcIiArIHRoaXMuaXNBdHRhY2tpbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGluQ29vbERvd246XCIgKyB0aGlzLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOebtOaOpeaSreaUvuaUu+WHu+WKqOeUu1xuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuacieaVjOS6uuWcqOaUu+WHu+iMg+WbtOWGhe+8iOS9v+eUqOeojeWkp+eahOiMg+WbtOmBv+WFjei+ueeVjOmXrumimO+8iVxuICAgICAgICAgICAgdmFyIGF0dGFja1JhbmdlQnVmZmVyID0gdGhpcy5hdGtSUiAqIDEuMDU7IC8vIOWinuWKoDUl55qE5a655beuXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZSB8fCB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIGF0dGFja1JhbmdlQnVmZmVyKTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0IHx8IHRhcmdldC5ocCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZE5vVGFyZ2V0IHx8IHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgJSAzMCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOayoeacieaJvuWIsOaUu+WHu+ebruagh++8jOaUu+WHu+iMg+WbtDpcIiArIE1hdGguc3FydCh0aGlzLmF0a1JSKS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZWROb1RhcmdldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6YeN572uXCLmsqHmnInnm67moIdcIuaXpeW/l+agh+W/l1xuICAgICAgICAgICAgdGhpcy5sb2dnZWROb1RhcmdldCA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzmraPlnKjmlLvlh7vkuK3vvIzkuI3ph43lpI3op6blj5FcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXR0YWNraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEF0dGFja1RhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pKt5pS+5pS75Ye75Yqo55S777yISGl05oiWVGhyb3dpbmfvvIlcbiAgICAgICAgICAgIHZhciBhdHRhY2tBbmltID0gXCJIaXRcIjsgLy8g6buY6K6k6L+R5oiY5pS75Ye7XG4gICAgICAgICAgICB2YXIgYXR0YWNrRGVsYXkgPSAyMDA7IC8vIOm7mOiupOW7tui/nzIwMG1z6Kem5Y+R5Lyk5a6z77yI5Yqo55S75pKt5pS+5Yiw5LiA5Y2K77yJXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaKleaOt+Wei+iLsembhOWPr+S7peS9v+eUqFRocm93aW5n5Yqo55S7XG4gICAgICAgICAgICBpZiAoWzQsIDUsIDEyXS5pbmRleE9mKHRoaXMuaW5mby5pZCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNrQW5pbSA9IFwiVGhyb3dpbmdcIjtcbiAgICAgICAgICAgICAgICBhdHRhY2tEZWxheSA9IDMwMDsgLy8g5oqV5o635Yqo55S75bu26L+f5pu06ZW/XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdHJ5U2hvb3RdIOKchSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOW8gOWni+aUu+WHu++8geWKqOeUuzpcIiArIGF0dGFja0FuaW0gKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCDnm67moIdJRDpcIiArIHRhcmdldC5pZCArIFwiLCDnm67moIdIUDpcIiArIHRhcmdldC5ocCArIFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIHNwaW5l5a2Y5ZyoOlwiICsgISF0aGlzLnNwaW5lICsgXCIsIHNwaW5lLm5vZGUuYWN0aXZlOlwiICsgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLmFjdGl2ZSA6IFwibnVsbFwiKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIGF0dGFja0FuaW0sIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4pyFIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5pS75Ye75Yqo55S75a6M5oiQ77yMaXNBdHRhY2tpbmc6XCIgKyBpLmlzQXR0YWNraW5nICsgXCIg4oaSIGZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5L2/55SoY2hhcmFjdGVy5pS75Ye757O757uf77yM5LiN6ZyA6KaB5a2Q5by56YeN6KOF5aGr5py65Yi2XG4gICAgICAgICAgICAgICAgLy8gSXRlbS5qc+W3sue7j+iuvue9ruS6hmluQ29vbERvd249dHJ1Ze+8jOaIkeS7rOWPqumcgOimgeiuvue9ruiuoeaXtuWZqOadpemHjee9ruWug1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIElEOlwiICsgaS5pbmZvLmlkICsgXCIg6K6+572u5Ya35Y206K6h5pe25Zmo77yM5b2T5YmNIGluQ29vbERvd246XCIgKyBpLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5peg5p2h5Lu26K6+572u5Ya35Y206K6h5pe25Zmo77yI5Zug5Li6SXRlbS5qc+W3sue7j+iuvue9ruS6hmluQ29vbERvd249dHJ1Ze+8iVxuICAgICAgICAgICAgICAgIHZhciBjZFRpbWUgPSBpLml0ZW0uY2RNcyB8fCA1MDA7IC8vIOm7mOiupDUwMG1z5Ya35Y20XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyBpLmluZm8uaWQgKyBcIiDlkK/liqjlhrfljbTorqHml7blmajvvIzml7bpl7Q6XCIgKyBjZFRpbWUgKyBcIm1zXCIpO1xuICAgICAgICAgICAgICAgIGkuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmluQ29vbERvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4o+wIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5Ya35Y205a6M5oiQ77yBaW5Db29sRG93bjpcIiArIGkuaXRlbS5pbkNvb2xEb3duKTtcbiAgICAgICAgICAgICAgICB9LCBjZFRpbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOW7tui/n+inpuWPkeS8pOWus+WIpOWumu+8iOaooeaLn+aUu+WHu+WKqOeUu+eahOaJk+WHu+eCue+8iVxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDwn5KlIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5YeG5aSH6YCg5oiQ5Lyk5a6zXCIpO1xuICAgICAgICAgICAgICAgIGlmIChpLmN1cnJlbnRBdHRhY2tUYXJnZXQgJiYgaS5jdXJyZW50QXR0YWNrVGFyZ2V0LmhwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGFtYWdlID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g8J+SpSBJRDpcIiArIGkuaW5mby5pZCArIFwiIOmAoOaIkOS8pOWuszpcIiArIGRhbWFnZSArIFwiIOe7meebruagh0lEOlwiICsgaS5jdXJyZW50QXR0YWNrVGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgaS5kZWFsRGFtYWdlVG9FbmVteShpLmN1cnJlbnRBdHRhY2tUYXJnZXQsIGRhbWFnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4pqg77iPIElEOlwiICsgaS5pbmZvLmlkICsgXCIg55uu5qCH5bey5aSx5pWI77yM5Y+W5raI5Lyk5a6zXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGF0dGFja0RlbGF5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5U291bmQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDku6XkuIvmmK/ljp/mnaXnmoTlrZDlvLnns7vnu5/pgLvovpHvvIjkv53nlZnlkJHlkI7lhbzlrrnvvIlcbiAgICAgICAgLy8g5a+55LqO6ZyA6KaB5pWM5Lq655uu5qCH55qE5pS75Ye75Z6L6Iux6ZuE77yISUQgMSwyLDQsNSw3LDksMTLvvInvvIzmo4Dmn6XmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgLy8gdG9kbyDkv67mlLnkuLrlhajpg6joi7Hpm4Tpg73mo4DmtYtcbiAgICAgICAgdmFyIG5lZWRUYXJnZXRDaGVjayA9IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA5LCAxMl07XG4gICAgICAgIGlmIChuZWVkVGFyZ2V0Q2hlY2suaW5kZXhPZih0aGlzLmluZm8uaWQpICE9PSAtMSkge1xuICAgICAgICAgICAgLy8g5qOA5p+l5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICAvLyDms6jmhI/vvJrkuI3lnKjov5nph4zmn6Xmib7nm67moIfvvIzlm6DkuLp1cGRhdGVNb3ZlbWVudOW3sue7j+WcqOeUqOWkp+iMg+WbtOafpeaJvuS6hlxuICAgICAgICAgICAgLy8g6L+Z6YeM5Y+q5qOA5p+l5b2T5YmN5piv5ZCm5pyJ55uu5qCH5LiU5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFRhcmdldCB8fCB0aGlzLmN1cnJlbnRUYXJnZXQuaHAgPD0gMCkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeacieW9k+WJjeebruagh++8jOeUqOWunumZheaUu+WHu+iMg+WbtOWwneivleafpeaJvlxuICAgICAgICAgICAgICAgIHZhciBuZWFyVGFyZ2V0ID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5lYXJUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Zyo5pS75Ye76IyD5Zu05YaF55qE5pWM5Lq677yM6L+U5ZueZmFsc2Xorqnoi7Hpm4Tnu6fnu63np7vliqhcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBuZWFyVGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmo4Dmn6XlvZPliY3nm67moIfmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIHZhciB0YXJnZXRQb3MgPSB0aGlzLmN1cnJlbnRUYXJnZXQubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgdGhpcy5jdXJyZW50VGFyZ2V0LmNlbnRlclkpKTtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRhcmdldFBvcy5zdWIodGhpcy5ub2RlLnBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IHRoaXMuYXRrUlIpIHtcbiAgICAgICAgICAgICAgICAvLyDnm67moIfkuI3lnKjmlLvlh7vojIPlm7TlhoXvvIzov5Tlm55mYWxzZeiuqeiLsembhOe7p+e7reenu+WKqFxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoICh0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAvLyAz5Y+36Iux6ZuE5pS55Li65pmu6YCa5pS75Ye75Z6LXG4gICAgICAgICAgICAgICAgdmFyIHIgPSBlIHx8IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgISFyICYmXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnB1c2hMdkFuZEF0ayh0KSxcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuaXNBdHRhY2tpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcy5pc0F0dGFja2luZyA9ICEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5pc0F0dGFja2luZyA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5jaGVja1RvU2hvb3Qocik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuaXRlbS5idWxsZXRDb3VudCA8PSAwICYmIGkuSUtCb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy50d2VlbihpLklLQm9uZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiA1MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LuF5b2T5L2/55SocGxhbnQgc3BpbmXml7bmiY3kvb/nlKhJS+mqqOmqvFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcmFjdGVyIHNwaW5l5LiN6ZyA6KaBSUvnnoTlh4ZcbiAgICAgICAgICAgICAgICAgICAgICAgICghdGhpcy5jaGFyYWN0ZXJTcGluZSB8fCB0aGlzLnNwaW5lICE9PSB0aGlzLmNoYXJhY3RlclNwaW5lKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JS0JvbmUgfHwgKHRoaXMuSUtCb25lID0gdGhpcy5zcGluZS5maW5kQm9uZShcIklLXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHdlZW4odGhpcy5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogKHIubm9kZS54IC0gdGhpcy5ub2RlLngpIC8gMC43NixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChyLm5vZGUueSArIHIuY2VudGVyWSAtIHRoaXMubm9kZS55KSAvIDAuNzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAhMCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoNjAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IDAuMTU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDYwMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKz0gMC4zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxICsgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY3Jvc3NJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5oZXJvICYmIGUuaGVyby5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmhlcm8uYWRkU2hpZWxkKGUubWF4SHAgKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNob3dCdWZmRWZmZWN0KFwic2hpZWxkXCIsIGUuaGVyby5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy5zY2VuZS5jaG9vc2VNaW5IcEhlcm8oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAhIW4gJiZcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLmNoZWNrQnVmZig4MDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxLjI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEhwKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcIkhQXCIsIG4ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAhMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTAwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSAwLjE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICs9IDAuMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMSArIGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibXVzaWNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGkubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgNTApKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0QW5nZXJCYXJXUG9zKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyICs9IHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS51cGRhdGVBbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZigxMTA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkubGFzdEJ1bGxldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT0gaS5sYXN0QnVsbGV0Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaS5sYXN0QnVsbGV0Q291bnQgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBjYy5pbnN0YW50aWF0ZShpLmxhbmRNaW5lTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNjLnYyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0SGVyb2VzTWF4TWFyZ2luWCgpICsgY2MubWF0aC5yYW5kb21SYW5nZSgwLCAxNTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLm1hdGgucmFuZG9tUmFuZ2UoaS5zY2VuZS5ncm91bmRBcmVhTEIueSArIDEyMCwgaS5zY2VuZS5ncm91bmRBcmVhVFIueSAtIDEyMClcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnBvc2l0aW9uID0gaS5ub2RlLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQucGFyZW50ID0gaS5zY2VuZS5vYmpzUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuekluZGV4ID0gLXQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gdC5nZXRDb21wb25lbnQoY2MuQ29sbGlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHQuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gby5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gKGUueCAtIHQueCkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy55ID0gKGUueSAtIHQueSkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gTWF0aC5tYXgoMCwgcy54KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0QW5pbWF0aW9uKDAsIFwiemQxMV8xXCIsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5zZXRBbmltYXRpb24oMCwgXCJ6ZDExXzJcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHQ7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICB2YXIgbyA9IHRoaXMuY2hlY2tCdWZmKDEyMDQpID8gMiA6IDEsXG4gICAgICAgICAgICAgICAgICAgIHMgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15cyh0aGlzLCB0aGlzLmF0a1JSLCBvKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA9PSBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5zY2VuZS5nZXRIZXJvZXNNYXhNYXJnaW5YKCksXG4gICAgICAgICAgICAgICAgICAgIGEgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgIT0gYSB8fCBpLmNoZWNrQnVmZigxMjA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBzW01hdGgubWluKHMubGVuZ3RoIC0gMSwgYSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSB0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHQuY2VudGVyWSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBjYy52MihNYXRoLm1pbihjLCBlLngpLCBlLnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBpLnNjZW5lLm9ianNSb290LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gY2MuaW5zdGFudGlhdGUoaS56ZC5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoID0gci5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByLnBhcmVudCA9IGkuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICByLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgci5wb3NpdGlvbiA9IGkubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguc3BpbmUuc2V0QW5pbWF0aW9uKDAsIGguc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiwgITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBoLnNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdSA9IGguc3BpbmUubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueCA9IHUueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueSA9IHUueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguaW5pdEJ5KGkuc2NlbmUsIGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLmEgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5hdHQgPSBpLmdldEF0ayhpLml0ZW0ubHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0pzRWZmZWN0KGNjLnYyKG4ueCArIDEwMCAqIHQsIG4ueSksIGkuaW5mby5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDggKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gMTsgbCA8IDU7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2d1bnppXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByID0gZSB8fCB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIHRoaXMuYXRrUlIpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgISFyICYmXG4gICAgICAgICAgICAodGhpcy5wdXNoTHZBbmRBdGsodCksXG4gICAgICAgICAgICAhdGhpcy5pc0F0dGFja2luZyAmJlxuICAgICAgICAgICAgICAgICgodGhpcy5pc0F0dGFja2luZyA9ICEwKSxcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmNoZWNrVG9TaG9vdChyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuaXRlbS5idWxsZXRDb3VudCA8PSAwICYmIGkuSUtCb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4oaS5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogNTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDku4XlvZPkvb/nlKhwbGFudCBzcGluZeaXtuaJjeS9v+eUqElL6aqo6aq8XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFyYWN0ZXIgc3BpbmXkuI3pnIDopoFJS+eehOWHhlxuICAgICAgICAgICAgICAgICAgICAgICAgKCF0aGlzLmNoYXJhY3RlclNwaW5lIHx8IHRoaXMuc3BpbmUgIT09IHRoaXMuY2hhcmFjdGVyU3BpbmUpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklLQm9uZSB8fCAodGhpcy5JS0JvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiSUtcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50d2Vlbih0aGlzLklLQm9uZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvKDAuMDY0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAoci5ub2RlLnggLSB0aGlzLm5vZGUueCkgLyAwLjc2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKHIubm9kZS55ICsgci5jZW50ZXJZIC0gdGhpcy5ub2RlLnkpIC8gMC43NlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICEwKSlcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGNoZWNrVG9TaG9vdDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5sdnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy56ZCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5sdnMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHQgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob290KGksIHRoaXMuaXRlbS5sdiwgZS5hdGspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmx2cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KHRoaXMuY2hlY2tUb1Nob290LmJpbmQodGhpcyksIDgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2hvb3RBUG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS9v+eUqEhhbmRfRumqqOmqvOS9nOS4uuaUu+WHu+eCuVxuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2sgJiYgdGhpcy5zcGluZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLkhhbmRCb25lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5IYW5kQm9uZSA9IHRoaXMuc3BpbmUuZmluZEJvbmUoXCJIYW5kX0ZcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5IYW5kQm9uZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gY2MudjIodGhpcy5IYW5kQm9uZS53b3JsZFgsIHRoaXMuSGFuZEJvbmUud29ybGRZKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5om+5LiN5YiwSGFuZF9G6aqo6aq877yM6L+U5Zuec3BpbmXoioLngrnkvY3nva5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDljp/mnaXnmoTlrZDlvLnns7vnu5/pgLvovpHvvIjkv53nlZnlkJHlkI7lhbzlrrnvvIlcbiAgICAgICAgaWYgKHRoaXMuR1BCb25lKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5HUEJvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiR1BcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSBjYy52Mih0aGlzLkdQQm9uZS53b3JsZFgsIHRoaXMuR1BCb25lLndvcmxkWSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNwaW5lLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKHQpO1xuICAgIH0sXG4gICAgc2hvb3Q6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIGlmICg0ID09IHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgdmFyIG47XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAxKSkge1xuICAgICAgICAgICAgICAgIG4gPSA5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuID0gNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290TihuLCB0LCBlLCBpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTA0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3ROKDMsIHQsIGUsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKDcgPT0gdGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3RJSyh0LCBlLCBpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgdGhpcy5zaG9vdDEodCwgZSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob290MTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgbyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobik7XG4gICAgICAgIHZhciBzID0gdC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0LmNlbnRlclkpKS5zdWIobyk7XG4gICAgICAgIGlmIChzLnggPCAwKSB7XG4gICAgICAgICAgICBzLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjID0gTWF0aC5hdGFuMihzLnksIHMueCk7XG4gICAgICAgIHZhciBhID0gdGhpcy56ZDtcbiAgICAgICAgdmFyIHIgPSBjYy5pbnN0YW50aWF0ZShhLm5vZGUpO1xuICAgICAgICByLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgIHIuYWN0aXZlID0gITA7XG4gICAgICAgIHIucG9zaXRpb24gPSBvO1xuICAgICAgICB2YXIgaCA9IHIuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTA0KSkge1xuICAgICAgICAgICAgaC5oaXRDb3VudCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMykpIHtcbiAgICAgICAgICAgIGguaGl0Q291bnQgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGguaW5pdEJ5KHRoaXMuc2NlbmUsIGUpO1xuICAgICAgICBoLmEgPSB0aGlzO1xuICAgICAgICBpZiAoMTMgPT0gdGhpcy5pbmZvLmlkICYmIDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIGguYXR0ID0gaSAvIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoLmF0dCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgaC5tb3ZlQnlBbmdsZSgoMTgwICogYykgLyBNYXRoLlBJKTtcbiAgICB9LFxuICAgIHNob290TjogZnVuY3Rpb24gKHQsIGUsIGksIG4pIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgcyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgIHZhciBjID0gZS5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCBlLmNlbnRlclkpKS5zdWIocyk7XG4gICAgICAgIGlmIChjLnggPCAwKSB7XG4gICAgICAgICAgICBjLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhID0gKDE4MCAqIE1hdGguYXRhbjIoYy55LCBjLngpKSAvIE1hdGguUEk7XG4gICAgICAgIHZhciByO1xuICAgICAgICBpZiAodCA+IDUpIHtcbiAgICAgICAgICAgIHIgPSBbMCwgLTEwLCAtMjAsIC0zMCwgNDAsIDEwLCAyMCwgMzAsIDQwXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHIgPSBbMCwgLTE1LCAxNSwgLTMwLCAzMF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCB0OyBoKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gY2MuaW5zdGFudGlhdGUodGhpcy56ZC5ub2RlKTtcbiAgICAgICAgICAgIGQucGFyZW50ID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdDtcbiAgICAgICAgICAgIGQuYWN0aXZlID0gITA7XG4gICAgICAgICAgICBkLnBvc2l0aW9uID0gcztcbiAgICAgICAgICAgIHZhciB1ID0gZC5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgICAgICB1LmluaXRCeSh0aGlzLnNjZW5lLCBpKTtcbiAgICAgICAgICAgIHUuYSA9IHRoaXM7XG4gICAgICAgICAgICB1LmF0dCA9IG47XG4gICAgICAgICAgICB1Lm1vdmVCeUFuZ2xlKGEgKyByW2hdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvb3RJSzogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IHRoaXMuZ2V0U2hvb3RBUG9zKCk7XG4gICAgICAgIHZhciBzID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgdmFyIGMgPSB0Lm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKDAsIHQuY2VudGVyWSkpO1xuICAgICAgICB2YXIgYSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuemQubm9kZSk7XG4gICAgICAgIHZhciByID0gYS5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgIGEucGFyZW50ID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdDtcbiAgICAgICAgYS5hY3RpdmUgPSAhMDtcbiAgICAgICAgYS5wb3NpdGlvbiA9IHM7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDIpKSB7XG4gICAgICAgICAgICBhLmdldENvbXBvbmVudChcIkV2ZW50Q29sbGlkZXJcIikuY29sbGlkZXIucmFkaXVzICo9IDEuMztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaCA9IHIuc3BpbmUuc2V0QW5pbWF0aW9uKDAsIHIuc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiwgITApO1xuICAgICAgICByLnNwaW5lLnNldFRyYWNrRXZlbnRMaXN0ZW5lcihoLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuLnNjZW5lLnNob3dKc0VmZmVjdCh0Lm5vZGUucG9zaXRpb24sIG4uaW5mby5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZCA9IHIuc3BpbmUuZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgdmFyIHUgPSByLnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoYyk7XG4gICAgICAgIGQueCA9IHUueDtcbiAgICAgICAgZC55ID0gdS55O1xuICAgICAgICBkLnggPSBNYXRoLm1heCgwLCBkLngpO1xuICAgICAgICByLmluaXRCeSh0aGlzLnNjZW5lLCBlKTtcbiAgICAgICAgci5hID0gdGhpcztcbiAgICAgICAgci5hdHQgPSBpO1xuICAgIH0sXG4gICAgY2hlY2tIZXJvQnVmZjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gITE7XG4gICAgfSxcbiAgICBjaGVja0J1ZmY6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gKHQgLSAodCAlIDEwMCkpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmZvLmlkID09IGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYodCk7XG4gICAgfSxcbiAgICBkb0J1bGxldEF0dExvZ2ljOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHQuYXR0O1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwNCkpIHtcbiAgICAgICAgICAgIGkgKj0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTIwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS53ZWFrTm9kZSAmJiB0aGlzLmlzUGh5KSB7XG4gICAgICAgICAgICBpICo9IDEuMjtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGNjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUGh5KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pczNneikge1xuICAgICAgICAgICAgICAgICAgICBpICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEgLSA0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXMyZ3opIHtcbiAgICAgICAgICAgICAgICAgICAgaSAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxIC0gMTBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ3JpdCh0LCBlKSkge1xuICAgICAgICAgICAgbiA9IDE7XG4gICAgICAgICAgICBpICo9IHRoaXMuZ2V0Q3JpdFBsdXModCwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgaSAqPSBjYy5tYXRoLnJhbmRvbVJhbmdlKDAuOTUsIDEuMDUpO1xuICAgICAgICBlLmh1cnRCeSh0aGlzLCBpKTtcbiAgICAgICAgdGhpcy5zY2VuZS5zaG93RW5lbXlIdXJ0TnVtKG4sIGUubm9kZS5wb3NpdGlvbiwgaSk7XG4gICAgICAgIGlmICh0LmpzRWZmRXhjbHVzaXZlKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93SnNFZmZlY3QoZS5ub2RlLnBvc2l0aW9uLCB0aGlzLmluZm8uaWQpO1xuICAgICAgICB9XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0c1t0aGlzLmluZm8uaWRdICs9IGk7XG4gICAgICAgIGlmICh0LmJ1ZmZTbG93KSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZTbG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQuYnVmZkljZSAmJiB0aGlzLmNoZWNrQnVmZigxMjAzKSAmJiBNYXRoLnJhbmRvbSgpIDwgMC4yKSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZJY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzA0KSAmJiBNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZXZWFrKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwNCkpIHtcbiAgICAgICAgICAgIGUucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDMpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMikpIHtcbiAgICAgICAgICAgIGUucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja0NyaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dENvdW50ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSB0aGlzLmF0dENvdW50ZXIgKyAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNTAyKSkge1xuICAgICAgICAgICAgICAgIHQgPSAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ID0gMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF0dENvdW50ZXIgPj0gdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0Q291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMikpIHtcbiAgICAgICAgICAgIGUgKz0gMC4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDA0KSkge1xuICAgICAgICAgICAgZSArPSAwLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDMpKSB7XG4gICAgICAgICAgICBlICs9IDAuMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IGU7XG4gICAgfSxcbiAgICBnZXRDcml0UGx1czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IDEuNTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMykpIHtcbiAgICAgICAgICAgIHQgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG4gICAgZG9MYW5kTWluZXNMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0LmdldENvbXBvbmVudChcIkVuZW15XCIpO1xuICAgICAgICBpZiAoZSAmJiBlLmhwID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kb0J1bGxldEF0dExvZ2ljKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0OiB0aGlzLmdldEF0ayh0aGlzLml0ZW0ubHYpLFxuICAgICAgICAgICAgICAgICAgICBsdjogdGhpcy5pdGVtLmx2LFxuICAgICAgICAgICAgICAgICAgICBqc0VmZkV4Y2x1c2l2ZTogITBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uTGFuZG1pbmVzQ29sbGlzaW9uOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoZS5lbmFibGVkKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHQuZ2V0Q29tcG9uZW50KFwiRW5lbXlcIik7XG4gICAgICAgICAgICBpZiAoaSAmJiBpLmhwID4gMCkge1xuICAgICAgICAgICAgICAgIGUuZW5hYmxlZCA9ICExO1xuICAgICAgICAgICAgICAgIHZhciBuID0gZS5ub2RlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSBjYy5maW5kKFwicmFuZ2VcIiwgZS5ub2RlKS5nZXRDb21wb25lbnQoY2MuQ29sbGlkZXIpO1xuICAgICAgICAgICAgICAgIGNjLnB2ei51dGlscy5tYW51YWxseUNoZWNrQ29sbGlkZXIobyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93SnNFZmZlY3QoZS5ub2RlLnBvc2l0aW9uLCB0aGlzLmluZm8uaWQpO1xuICAgICAgICAgICAgICAgIG4ubm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEhwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmhwID0gTWF0aC5taW4odGhpcy5pdGVtLm1heEhwLCB0aGlzLmhwICsgdCk7XG4gICAgICAgIHRoaXMuaXRlbS51cGRhdGVIcCh0aGlzLmhwIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVIcCghMCk7XG4gICAgfSxcbiAgICBkZWxIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocCA9IE1hdGgubWF4KDAsIHRoaXMuaHAgLSB0KTtcbiAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZUhwKHRoaXMuaHAgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZUhwKCEwKTtcbiAgICB9LFxuICAgIGFkZFNoaWVsZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5zaGllbGRWYWx1ZSA9IE1hdGgubWluKHRoaXMuaXRlbS5tYXhIcCwgdGhpcy5zaGllbGRWYWx1ZSArIHQpO1xuICAgICAgICB0aGlzLml0ZW0udXBkYXRlU2hpZWxkKHRoaXMuc2hpZWxkVmFsdWUgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZVNoaWVsZCgpO1xuICAgIH0sXG4gICAgaHVydEJ5OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICAvLyDlj5fkvKRcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICBpZiAoISh0aGlzLmhhc0VuZGVkIHx8IHRoaXMuaHAgPD0gMCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNoaWVsZFZhbHVlID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBvID0gTWF0aC5taW4odGhpcy5zaGllbGRWYWx1ZSwgaSk7XG4gICAgICAgICAgICAgICAgaSAtPSBvO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hpZWxkVmFsdWUgLT0gbztcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW0udXBkYXRlU2hpZWxkKHRoaXMuc2hpZWxkVmFsdWUgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPiAwICYmICh0aGlzLmRlbEhwKGkpLCB0aGlzLmhwIDw9IDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHMgPVxuICAgICAgICAgICAgICAgICAgICAhY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc1VzZVJlYm9ybiAmJlxuICAgICAgICAgICAgICAgICAgICAoOCA9PSB0aGlzLmluZm8uaWQgfHwgdGhpcy5zY2VuZS5oYXNIZXJvKDgpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig4MDMpO1xuICAgICAgICAgICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNVc2VSZWJvcm4gPSAhMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDooYDmnaFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtLmJhck5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiRGVhZFwiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5yZWJvcm4oY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoODA0KSA/IDEgOiAwLjMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zaG93QnVmZkVmZmVjdChcInJldml2ZVwiLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLmhhc0RpZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zY2VuZS5jaGVja0lzRmFpbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlYm9ybjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8g5aSN5rS7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJmdWh1b1wiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZS5ocCA9IGUuaXRlbS5tYXhIcCAqIHQ7XG4gICAgICAgICAgICBlLml0ZW0udXBkYXRlSHAoKTtcbiAgICAgICAgICAgIGUuaGFzRGllID0gITE7XG4gICAgICAgICAgICBlLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dCdWZmRWZmZWN0OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodm9pZCAwID09PSBlKSB7XG4gICAgICAgICAgICBlID0gITE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkQnVmZlByZWZhYlxuICAgICAgICAgICAgICAgIC5hZGROb2RlVG8odGhpcy5pdGVtLnNwaW5lLm5vZGUsIGNjLlZlYzIuWkVSTylcbiAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKVxuICAgICAgICAgICAgICAgIC5zZXRBbmltYXRpb24oMCwgdCwgITEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93QnVmZkVmZmVjdCh0LCB0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOehruS/neWIneWni+WMluWujOaIkFxuICAgICAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCB8fCAhdGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZE5vdEluaXQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSGVybyBVcGRhdGVdIElE5pyq55+lLCDmnKrliJ3lp4vljJbmiJZzY2VuZeS4jeWtmOWcqFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZE5vdEluaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNjZW5lICYmICF0aGlzLnNjZW5lLnRpbWVQYXVzZWQgJiYgISh0aGlzLnNjZW5lLmhhc0VuZGVkIHx8IHRoaXMuaHAgPD0gMCB8fCB0aGlzLmhhc0RpZSkpIHtcbiAgICAgICAgICAgIHZhciBlID0gdCAqIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmdldFRpbWVTY2FsZSgpO1xuICAgICAgICAgICAgLy8g5q+P56eS5Y+q5omT5Y2w5LiA5qyh5pel5b+X77yM6YG/5YWN5Yi35bGPXG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdExvZ1RpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RMb2dUaW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RMb2dUaW1lID4gMTAwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gVXBkYXRlXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCBlbmFibGVkOlwiICsgdGhpcy5lbmFibGVkICsgXCIsIOS9jee9rjpcIiArIHRoaXMubm9kZS5wb3NpdGlvbiArIFwiLCDmlYzkurrmlbA6XCIgKyAodGhpcy5zY2VuZS5lbmVteXMgPyB0aGlzLnNjZW5lLmVuZW15cy5sZW5ndGggOiAwKSArIFwiLCBpc01vdmluZzpcIiArIHRoaXMuaXNNb3ZpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdExvZ1RpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTW92ZW1lbnQoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZU1vdmVtZW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmnInmlYzkurrlrZjlnKhcbiAgICAgICAgaWYgKCF0aGlzLnNjZW5lLmVuZW15cyB8fCB0aGlzLnNjZW5lLmVuZW15cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIOayoeacieaVjOS6uuaXtu+8jOi/lOWbnuWIneWni+S9jee9rlxuICAgICAgICAgICAgdGhpcy5yZXR1cm5Ub0luaXRpYWxQb3NpdGlvbih0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5a+75om+5pyA6L+R55qE5pWM5Lq677yI5omA5pyJ6Iux6ZuE6YO956e75Yqo77yM5LiN5Yy65YiG57G75Z6L77yJXG4gICAgICAgIHZhciBlID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCA5OTk5OTkpO1xuICAgICAgICBcbiAgICAgICAgLy8g5re75Yqg6LCD6K+V5pel5b+XXG4gICAgICAgIGlmICghdGhpcy5tb3ZlbWVudERlYnVnQ291bnQpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZW1lbnREZWJ1Z0NvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVtZW50RGVidWdDb3VudCsrO1xuICAgICAgICBcbiAgICAgICAgLy8g5q+PMuenkuaJk+WNsOS4gOasoeiwg+ivleS/oeaBr1xuICAgICAgICBpZiAodGhpcy5tb3ZlbWVudERlYnVnQ291bnQgJSAxMjAgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdXBkYXRlTW92ZW1lbnRdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg5om+5Yiw5pWM5Lq6OlwiICsgISFlICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg5pWM5Lq65oC75pWwOlwiICsgdGhpcy5zY2VuZS5lbmVteXMubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBpc01vdmluZzpcIiArIHRoaXMuaXNNb3ZpbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGlzQXR0YWNraW5nOlwiICsgdGhpcy5pc0F0dGFja2luZyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChlICYmIGUuaHAgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlO1xuICAgICAgICAgICAgdmFyIGkgPSBlLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIGUuY2VudGVyWSkpO1xuICAgICAgICAgICAgdmFyIG4gPSBpLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgdmFyIG8gPSBuLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmr48y56eS5omT5Y2w6Led56a75L+h5oGvXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlbWVudERlYnVnQ291bnQgJSAxMjAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHVwZGF0ZU1vdmVtZW50XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLCDot53mlYzkuro6XCIgKyBNYXRoLnNxcnQobykudG9GaXhlZCgxKSArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLCDmlLvlh7vojIPlm7Q6XCIgKyBNYXRoLnNxcnQodGhpcy5hdGtSUikudG9GaXhlZCgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhe+8iOa3u+WKoOWwj+WuueW3ruWAvO+8jOmBv+WFjea1rueCueaVsOeyvuW6pumXrumimO+8iVxuICAgICAgICAgICAgdmFyIGF0dGFja1JhbmdlQnVmZmVyID0gdGhpcy5hdGtSUiAqIDEuMDU7IC8vIOWinuWKoDUl55qE5a655beuXG4gICAgICAgICAgICBpZiAobyA8PSBhdHRhY2tSYW5nZUJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIC8vIOWcqOaUu+WHu+iMg+WbtOWGhe+8jOWBnOatouenu+WKqFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOWIsOi+vuaUu+WHu+iMg+WbtO+8jOWBnOatouenu+WKqFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yqo55S755Sx5pS75Ye757O757uf5o6n5Yi277yM6L+Z6YeM5LiN5YiH5o2iXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDkuI3lnKjmlLvlh7vojIPlm7TlhoXvvIznu6fnu63lkJHmlYzkurrnp7vliqhcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIPCfmrYgSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDlvIDlp4vlkJHmlYzkurrnp7vliqjvvIzlvZPliY3ot53nprs6XCIgKyBNYXRoLnNxcnQobykudG9GaXhlZCgxKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWPquWcqOmdnuaUu+WHu+eKtuaAgeaXtuWIh+aNouS4uuenu+WKqOWKqOeUu1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiV2Fsa1wiLCAhMCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g6K6h566X56e75Yqo5pa55ZCR5ZKM56e75YqoXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBNYXRoLmF0YW4yKG4ueSwgbi54KTtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNjLnYyKHRoaXMubW92ZVNwZWVkICogTWF0aC5jb3MocykgKiB0LCB0aGlzLm1vdmVTcGVlZCAqIE1hdGguc2luKHMpICogdCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5L2N572uXG4gICAgICAgICAgICAgICAgdmFyIG9sZFBvcyA9IHRoaXMubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQoYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnpJbmRleCA9IC10aGlzLm5vZGUueTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW0uYmFyTm9kZS5wb3NpdGlvbiA9IHRoaXMuaXRlbS5iYXJOb2RlLnBvc2l0aW9uLmFkZChjKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbVNwaW5lUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDosIPor5XvvJrmiZPljbDnp7vliqjkv6Hmga/vvIjmr48y56eS5LiA5qyh77yJXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RNb3ZlTG9nVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlTG9nVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBub3dUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICBpZiAobm93VGltZSAtIHRoaXMubGFzdE1vdmVMb2dUaW1lID4gMjAwMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIE1vdmVdIPCfmrYgSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDmraPlnKjnp7vliqjvvIzkvY3nva46XCIgKyB0aGlzLm5vZGUucG9zaXRpb24ueC50b0ZpeGVkKDEpICsgXCIsXCIgKyB0aGlzLm5vZGUucG9zaXRpb24ueS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZUxvZ1RpbWUgPSBub3dUaW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrBwb3NpdGlvbjLnlKjkuo7mlYzkurrnmoTmlLvlh7vliKTmlq1cbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uMiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5pdGVtLmF0dE9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDmsqHmnInmnInmlYjmlYzkurrvvIzov5Tlm57liJ3lp4vkvY3nva5cbiAgICAgICAgICAgIHRoaXMucmV0dXJuVG9Jbml0aWFsUG9zaXRpb24odCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUl0ZW1TcGluZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS4jemcgOimgeabtOaWsGl0ZW0uc3BpbmXnmoTkvY3nva5cbiAgICAgICAgLy8g5Zug5Li6Y2hhcmFjdGVyIHNwaW5l5pivSGVyb+iKgueCueeahOWtkOiKgueCue+8jOS8muiHquWKqOi3n+maj+enu+WKqFxuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5Y6f5p2l55qEcGxhbnTns7vnu5/pnIDopoHlkIzmraVpdGVtLnNwaW5l5L2N572u77yI5L+d55WZ5ZCR5ZCO5YW85a6577yJXG4gICAgICAgIC8vIOWwhkhlcm/oioLngrnnmoTkuJbnlYzlnZDmoIfovazmjaLkuLppdGVtLnNwaW5l54i26IqC54K555qE5pys5Zyw5Z2Q5qCHXG4gICAgICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnNwaW5lICYmIHRoaXMuaXRlbS5zcGluZS5ub2RlKSB7XG4gICAgICAgICAgICAvLyDojrflj5ZIZXJv6IqC54K555qE5LiW55WM5Z2Q5qCHXG4gICAgICAgICAgICB2YXIgaGVyb1dvcmxkUG9zID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIC8vIOi9rOaNouS4uml0ZW0uc3BpbmXniLboioLngrnnmoTmnKzlnLDlnZDmoIdcbiAgICAgICAgICAgIHZhciBzcGluZUxvY2FsUG9zID0gdGhpcy5pdGVtLnNwaW5lLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGhlcm9Xb3JsZFBvcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiwg+ivle+8mummluasoeenu+WKqOaXtuaJk+WNsOaXpeW/l1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZFNwaW5lVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDnrKzkuIDmrKHlkIzmraVzcGluZeS9jee9riAtIEhlcm/kuJbnlYzlnZDmoIc6XCIsIGhlcm9Xb3JsZFBvcywgXCJzcGluZeacrOWcsOWdkOaghzpcIiwgc3BpbmVMb2NhbFBvcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWRTcGluZVVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOabtOaWsGl0ZW0uc3BpbmXnmoTkvY3nva5cbiAgICAgICAgICAgIHRoaXMuaXRlbS5zcGluZS5ub2RlLnBvc2l0aW9uID0gc3BpbmVMb2NhbFBvcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2dnZWRTcGluZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOaXoOazleWQjOatpXNwaW5l5L2N572u77yBaXRlbTpcIiwgISF0aGlzLml0ZW0sIFwic3BpbmU6XCIsICEhKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUpLCBcInNwaW5lLm5vZGU6XCIsICEhKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUgJiYgdGhpcy5pdGVtLnNwaW5lLm5vZGUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFNwaW5lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXR1cm5Ub0luaXRpYWxQb3NpdGlvbjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGRpc3RTcXIgPSB0aGlzLm5vZGUucG9zaXRpb24uc3ViKHRoaXMuaW5pdGlhbFBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgaWYgKGRpc3RTcXIgPiAxKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJXYWxrXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLmF0YW4yKGEueSwgYS54KTtcbiAgICAgICAgICAgIHZhciBoID0gY2MudjIodGhpcy5tb3ZlU3BlZWQgKiBNYXRoLmNvcyhyKSAqIHQsIHRoaXMubW92ZVNwZWVkICogTWF0aC5zaW4ocikgKiB0KTtcbiAgICAgICAgICAgIGlmIChoLmxlbmd0aFNxcigpID4gYS5sZW5ndGhTcXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQoaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLXRoaXMubm9kZS55O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDjgJDlhbPplK7jgJHlkIzmraXmm7TmlrBpdGVtLnNwaW5l55qE5pi+56S65L2N572uXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1TcGluZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24yID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLml0ZW0uYXR0T2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIOi/lOWbnuWIneWni+S9jee9ruWQju+8jOaBouWkjWl0ZW0uc3BpbmXliLDliJ3lp4vkvY3nva5cbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzkvb/nlKhjaGFyYWN0ZXLmlLvlh7vns7vnu5/vvIzkuI3pnIDopoHmgaLlpI1pdGVtLnNwaW5l5L2N572uXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZUNoYXJhY3RlckF0dGFjayAmJiBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSAmJiB0aGlzLml0ZW0uc3BpbmUubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW0uc3BpbmUubm9kZS5wb3NpdGlvbiA9IHRoaXMuaXRlbVNwaW5lSW5pdGlhbFBvcy5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7Il19