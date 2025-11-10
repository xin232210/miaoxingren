
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
      // 优先使用updateMovement已经找到的目标，确保距离计算一致性
      var target = e || this.currentTarget; // 如果没有当前目标，尝试查找

      if (!target || target.hp <= 0) {
        // 检查是否有敌人在攻击范围内（使用稍大的范围避免边界问题）
        var attackRangeBuffer = this.atkRR * 1.05; // 增加5%的容差

        target = this.scene.chooseEnemy(this, attackRangeBuffer);
      } // 如果有目标，验证距离（使用与updateMovement相同的计算方式）


      if (target && target.hp > 0) {
        var targetPos = target.node.position.add(cc.v2(0, target.centerY));
        var distSqr = targetPos.sub(this.node.position).lengthSqr();
        var attackRangeBuffer = this.atkRR * 1.05; // 如果目标不在攻击范围内，清除目标

        if (distSqr > attackRangeBuffer) {
          if (this.tryShootCallCount % 30 === 1) {
            console.log("[Hero tryShoot] ID:" + this.info.id + " 目标距离:" + Math.sqrt(distSqr).toFixed(1) + " > 攻击范围:" + Math.sqrt(attackRangeBuffer).toFixed(1) + "，清除目标");
          }

          target = null;
        }
      } else {
        target = null;
      }

      if (!target || target.hp <= 0) {
        if (!this.loggedNoTarget || this.tryShootCallCount % 30 === 1) {
          console.log("[Hero tryShoot] ID:" + this.info.id + " 没有找到攻击目标，攻击范围:" + Math.sqrt(this.atkRR).toFixed(1));
          this.loggedNoTarget = true;
        } // 确保重置攻击状态，避免卡住


        if (this.isAttacking) {
          console.log("[Hero tryShoot] ID:" + this.info.id + " 没有目标，重置攻击状态");
          this.isAttacking = false;
        } // 关键修复：如果之前认为到达了攻击范围，但现在找不到目标，说明判断有误，需要重置让英雄继续移动


        if (this.hasReachedAttackRange) {
          // 增加失败计数器
          if (!this.attackFailCount) {
            this.attackFailCount = 0;
          }

          this.attackFailCount++; // 如果连续多次找不到目标，重置攻击范围标记，让英雄继续向敌人移动

          if (this.attackFailCount >= 5) {
            console.log("[Hero tryShoot] ⚠️ ID:" + this.info.id + " 连续" + this.attackFailCount + "次找不到目标，重置hasReachedAttackRange，继续移动");
            this.hasReachedAttackRange = false;
            this.attackFailCount = 0;
          }
        }

        return false;
      } // 找到目标了，重置失败计数器


      this.attackFailCount = 0; // 重置"没有目标"日志标志

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
    } // 清理已死亡的目标引用


    if (this.currentTarget && this.currentTarget.hp <= 0) {
      console.log("[Hero] ID:" + this.info.id + " 清除已死亡的目标引用");
      this.currentTarget = null; // 如果之前已经到达攻击范围，现在目标死了，需要重新开始寻找和移动

      if (this.hasReachedAttackRange) {
        this.hasReachedAttackRange = false;
        console.log("[Hero] ID:" + this.info.id + " 重置攻击范围标记，准备寻找新目标");
      }
    } // 寻找最近的敌人（所有英雄都移动，不区分类型）


    var e = this.scene.chooseEnemy(this, 999999); // 添加调试日志

    if (!this.movementDebugCount) {
      this.movementDebugCount = 0;
    }

    this.movementDebugCount++; // 每2秒打印一次调试信息

    if (this.movementDebugCount % 120 === 1) {
      // 统计活着的敌人数量
      var aliveEnemyCount = 0;
      var enemyPositions = [];

      if (this.scene.enemys) {
        this.scene.enemys.forEach(function (enemy) {
          if (enemy.hp > 0) {
            aliveEnemyCount++;
            enemyPositions.push("(" + enemy.node.x.toFixed(0) + "," + enemy.node.y.toFixed(0) + ",HP:" + enemy.hp.toFixed(0) + ")");
          }
        });
      }

      console.log("[Hero updateMovement] ID:" + this.info.id + ", 英雄位置:(" + this.node.x.toFixed(0) + "," + this.node.y.toFixed(0) + ")" + ", 找到敌人:" + !!e + (e ? ", 敌人位置:(" + e.node.x.toFixed(0) + "," + e.node.y.toFixed(0) + "), 敌人HP:" + e.hp.toFixed(0) : "") + ", 活着的敌人:" + aliveEnemyCount + "/" + this.scene.enemys.length + ", isMoving:" + this.isMoving + ", isAttacking:" + this.isAttacking + ", hasReachedAttackRange:" + this.hasReachedAttackRange);

      if (aliveEnemyCount > 0 && aliveEnemyCount <= 10) {
        console.log("[Hero updateMovement] 剩余敌人位置: " + enemyPositions.join(", "));
      }
    }

    if (e && e.hp > 0) {
      this.currentTarget = e;
      var i = e.node.position.add(cc.v2(0, e.centerY));
      var n = i.sub(this.node.position);
      var o = n.lengthSqr(); // 每2秒打印距离信息

      if (this.movementDebugCount % 120 === 1) {
        console.log("[Hero updateMovement] ID:" + this.info.id + ", 距敌人:" + Math.sqrt(o).toFixed(1) + ", 攻击范围:" + Math.sqrt(this.atkRR).toFixed(1) + ", 停止距离:" + Math.sqrt(this.atkRR * 0.98).toFixed(1) + ", 是否在范围内:" + (o <= this.atkRR * 0.98));
      } // 检查是否在攻击范围内（使用0.98的系数，确保英雄移动到确实能攻击到的位置）
      // 这样可以避免边界情况导致英雄停止移动但无法攻击


      var attackRangeBuffer = this.atkRR * 0.98; // 稍微保守一点，确保能攻击到

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
          console.log("[Hero] 🚶 ID:" + this.info.id + " 开始向敌人移动，当前距离:" + Math.sqrt(o).toFixed(1) + ", 目标位置:" + e.node.position.x.toFixed(1) + "," + e.node.position.y.toFixed(1)); // 只在非攻击状态时切换为移动动画

          if (!this.isAttacking) {
            this.setAnimation(0, "Walk", !0, null);
          } else {
            console.log("[Hero] ⚠️ ID:" + this.info.id + " 需要移动但还在攻击状态，不切换动画");
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
      // 打印警告信息，帮助调试
      if (this.movementDebugCount % 120 === 1) {
        var aliveCount = 0;

        if (this.scene.enemys) {
          this.scene.enemys.forEach(function (enemy) {
            if (enemy.hp > 0) aliveCount++;
          });
        }

        if (aliveCount > 0) {
          console.warn("[Hero updateMovement] ⚠️ ID:" + this.info.id + " chooseEnemy返回null，但有" + aliveCount + "个活着的敌人！");
        }
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSGVyby5qcyJdLCJuYW1lcyI6WyIkYnVsbGV0IiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiemQiLCJ6ZDIiLCJsYW5kTWluZU5vZGUiLCJOb2RlIiwib25Mb2FkIiwibm9kZSIsImFjdGl2ZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJlbmFibGVkIiwic3RhcnQiLCJpbml0QnkiLCJ0IiwiaSIsImNoYXJhY3RlclNwaW5lIiwibiIsInNjZW5lIiwiaW5mbyIsIml0ZW0iLCJpdGVtU3BpbmVPcmlnaW5hbCIsImlzU2FtZVNwaW5lIiwiaXRlbVNwaW5lSW5pdGlhbFBvcyIsInBvc2l0aW9uIiwiY2xvbmUiLCJsb2ciLCJpZCIsIm8iLCJqc29uIiwicmFuZ2UiLCJhdGtSUiIsImx2cyIsImhwIiwibWF4SHAiLCJzaGllbGRWYWx1ZSIsImhhc0RpZSIsInNldEFuaW1hdGlvbiIsInNldHVwQW5pbWF0aW9uRXZlbnRzIiwiaXNQaHkiLCJpc01hZ2ljIiwiaXMzZ3oiLCJzb21lIiwiaXMyZ3oiLCJidXRsZXIiLCJvbiIsIm9uTHZ1cCIsImluaXRpYWxQb3NpdGlvbiIsIm1vdmVTcGVlZCIsImN1cnJlbnRUYXJnZXQiLCJpc01vdmluZyIsImhhc1JlYWNoZWRBdHRhY2tSYW5nZSIsImlzSW5pdGlhbGl6ZWQiLCJpc0F0dGFja2luZyIsImN1cnJlbnRBdHRhY2tUYXJnZXQiLCJpbkNvb2xEb3duIiwidXNlQ2hhcmFjdGVyQXR0YWNrIiwiZGVmYXVsdFNraW4iLCJNYXRoIiwic3FydCIsInNjYWxlIiwib3BhY2l0eSIsImluZGV4IiwibHZ1cCIsImh1YiIsInNob3dMdnVwRWZmZWN0IiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwiVmVjMiIsIlpFUk8iLCJzZXRFdmVudExpc3RlbmVyIiwidHJhY2tFbnRyeSIsImV2ZW50IiwiZGF0YSIsIm5hbWUiLCJvbkFuaW1hdGlvbkF0dGFja0V2ZW50IiwidGFyZ2V0IiwiY2hvb3NlRW5lbXkiLCJkYW1hZ2UiLCJnZXRBdGsiLCJsdiIsImRlYWxEYW1hZ2VUb0VuZW15IiwiZW5lbXkiLCJjaGVja0J1ZmYiLCJjcml0VHlwZSIsImNoZWNrQ3JpdCIsImdldENyaXRQbHVzIiwibWF0aCIsInJhbmRvbVJhbmdlIiwiZmxvb3IiLCJodXJ0QnkiLCJzaG93RW5lbXlIdXJ0TnVtIiwic2hvd0pzRWZmZWN0IiwicHZ6IiwicnVudGltZURhdGEiLCJzdGF0cyIsInJhbmRvbSIsImFkZEJ1ZmZXZWFrIiwicmVwdWxzZSIsImFuaW1OYW1lIiwiYW5pbU1hcCIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJtaW4iLCJsdjEiLCJhdHRyaWJ1dGUyIiwibGVuZ3RoIiwiZmlnaHRsdnVwMiIsImdldEJ1ZmZWYWx1ZSIsIml0ZW1zIiwiZ2V0U2hpZWxkIiwicHVzaEx2QW5kQXRrIiwicHVzaCIsImF0ayIsInBsYXlBdHRBbmREbyIsImNoZWNrVG9TdGFydFJlbG9hZFRpbWVyIiwicGxheVNvdW5kIiwicGxheUVmZmVjdEFzeW5jIiwidHJ5U2hvb3QiLCJ0cnlTaG9vdENhbGxDb3VudCIsImF0dGFja1JhbmdlQnVmZmVyIiwidGFyZ2V0UG9zIiwiYWRkIiwidjIiLCJjZW50ZXJZIiwiZGlzdFNxciIsInN1YiIsImxlbmd0aFNxciIsInRvRml4ZWQiLCJsb2dnZWROb1RhcmdldCIsImF0dGFja0ZhaWxDb3VudCIsImF0dGFja0FuaW0iLCJhdHRhY2tEZWxheSIsImluZGV4T2YiLCJjZFRpbWUiLCJjZE1zIiwic2V0VGltZW91dCIsIm5lZWRUYXJnZXRDaGVjayIsIm5lYXJUYXJnZXQiLCJkaXN0YW5jZSIsInIiLCJpc1ZhbGlkIiwiY2hlY2tUb1Nob290IiwiYnVsbGV0Q291bnQiLCJJS0JvbmUiLCJ0d2VlbiIsInRvIiwieCIsInkiLCJmaW5kQm9uZSIsImhhc0VuYWJsZUJ1ZmYiLCJjcm9zc0l0ZW1zIiwiZm9yRWFjaCIsImhlcm8iLCJhZGRTaGllbGQiLCJzaG93QnVmZkVmZmVjdCIsImNob29zZU1pbkhwSGVybyIsImFkZEhwIiwiZ2V0QW5nZXJCYXJXUG9zIiwiYW5nZXIiLCJ1cGRhdGVBbmdlciIsImxhc3RCdWxsZXRDb3VudCIsImluc3RhbnRpYXRlIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsImdyb3VuZEFyZWFMQiIsImdyb3VuZEFyZWFUUiIsInBhcmVudCIsIm9ianNSb290IiwiekluZGV4IiwiZ2V0Q29tcG9uZW50IiwiQ29sbGlkZXIiLCJzIiwibWF4IiwiY2hvb3NlRW5lbXlzIiwiYyIsImEiLCJoIiwiYnVsbGV0c1Jvb3QiLCJkZWZhdWx0QW5pbWF0aW9uIiwiZCIsInUiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsImF0dCIsInAiLCJsIiwic2hpZnQiLCJzaG9vdCIsImJpbmQiLCJnZXRTaG9vdEFQb3MiLCJIYW5kQm9uZSIsIndvcmxkWCIsIndvcmxkWSIsIkdQQm9uZSIsInNob290TiIsInNob290SUsiLCJzaG9vdDEiLCJhdGFuMiIsImhpdENvdW50IiwibW9kZSIsIm1vdmVCeUFuZ2xlIiwiUEkiLCJjb2xsaWRlciIsInJhZGl1cyIsInNldFRyYWNrRXZlbnRMaXN0ZW5lciIsImNoZWNrSGVyb0J1ZmYiLCJkb0J1bGxldEF0dExvZ2ljIiwid2Vha05vZGUiLCJhY3RCdWZmMSIsImpzRWZmRXhjbHVzaXZlIiwiYnVmZlNsb3ciLCJhZGRCdWZmU2xvdyIsImJ1ZmZJY2UiLCJhZGRCdWZmSWNlIiwiYXR0Q291bnRlciIsImRvTGFuZE1pbmVzTG9naWMiLCJvbkxhbmRtaW5lc0NvbGxpc2lvbiIsImZpbmQiLCJ1dGlscyIsIm1hbnVhbGx5Q2hlY2tDb2xsaWRlciIsImRlc3Ryb3kiLCJ1cGRhdGVIcCIsImRlbEhwIiwidXBkYXRlU2hpZWxkIiwiaGFzRW5kZWQiLCJoYXNVc2VSZWJvcm4iLCJoYXNIZXJvIiwiYmFyTm9kZSIsInJlYm9ybiIsImNoZWNrSXNGYWlsIiwiYWRkQnVmZlByZWZhYiIsImFkZE5vZGVUbyIsInVwZGF0ZSIsImxvZ2dlZE5vdEluaXQiLCJ3YXJuIiwidGltZVBhdXNlZCIsImRpcmVjdG9yIiwiZ2V0U2NoZWR1bGVyIiwiZ2V0VGltZVNjYWxlIiwibGFzdExvZ1RpbWUiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJub3ciLCJlbmVteXMiLCJ1cGRhdGVNb3ZlbWVudCIsInJldHVyblRvSW5pdGlhbFBvc2l0aW9uIiwibW92ZW1lbnREZWJ1Z0NvdW50IiwiYWxpdmVFbmVteUNvdW50IiwiZW5lbXlQb3NpdGlvbnMiLCJqb2luIiwiY29zIiwic2luIiwib2xkUG9zIiwidXBkYXRlSXRlbVNwaW5lUG9zaXRpb24iLCJsYXN0TW92ZUxvZ1RpbWUiLCJub3dUaW1lIiwicG9zaXRpb24yIiwiYXR0T2Zmc2V0IiwiYWxpdmVDb3VudCIsImhlcm9Xb3JsZFBvcyIsInNwaW5lTG9jYWxQb3MiLCJsb2dnZWRTcGluZVVwZGF0ZSIsImxvZ2dlZFNwaW5lRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFyQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUMsRUFBRSxDQUFDQyxRQURGO0lBRVJDLEVBQUUsRUFBRVQsT0FGSTtJQUdSVSxHQUFHLEVBQUVWLE9BSEc7SUFJUlcsWUFBWSxFQUFFVCxFQUFFLENBQUNVO0VBSlQsQ0FGUDtFQVFMQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsSUFBSTtNQUNBLElBQUksS0FBS0osRUFBTCxJQUFXLEtBQUtBLEVBQUwsQ0FBUUssSUFBdkIsRUFBNkI7UUFDekIsS0FBS0wsRUFBTCxDQUFRSyxJQUFSLENBQWFDLE1BQWIsR0FBc0IsQ0FBQyxDQUF2QjtNQUNIOztNQUNELElBQUksS0FBS0wsR0FBTCxJQUFZLEtBQUtBLEdBQUwsQ0FBU0ksSUFBekIsRUFBK0I7UUFDM0IsS0FB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QUMsS0FBS2hLLElBQUwsQ0FBVTRJLENBQTlCLENBZmEsQ0FpQmI7O01BQ0EsS0FBS3dHLHVCQUFMO01BRUEsS0FBS0csU0FBTCxHQUFpQixLQUFLdlAsSUFBTCxDQUFVa0IsUUFBVixDQUFtQmdHLEdBQW5CLENBQXVCLEtBQUtwRyxJQUFMLENBQVUwTyxTQUFqQyxDQUFqQjtJQUNILENBckJELE1BcUJPO01BQ0gsSUFBSSxLQUFLNU0sUUFBVCxFQUFtQjtRQUNmLEtBQUtBLFFBQUwsR0FBZ0IsS0FBaEIsQ0FEZSxDQUVmO1FBQ0E7O1FBQ0EsSUFBSSxDQUFDLEtBQUtNLGtCQUFOLElBQ0EsS0FBS3BDLElBREwsSUFDYSxLQUFLQSxJQUFMLENBQVV0QixLQUR2QixJQUNnQyxLQUFLc0IsSUFBTCxDQUFVdEIsS0FBVixDQUFnQlEsSUFEcEQsRUFDMEQ7VUFDdEQsS0FBS2MsSUFBTCxDQUFVdEIsS0FBVixDQUFnQlEsSUFBaEIsQ0FBcUJrQixRQUFyQixHQUFnQyxLQUFLRCxtQkFBTCxDQUF5QkUsS0FBekIsRUFBaEM7UUFDSDs7UUFDRCxJQUFJLENBQUMsS0FBSzRCLFdBQVYsRUFBdUI7VUFDbkIsS0FBS2hCLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUIsTUFBckIsRUFBNkIsQ0FBQyxDQUE5QixFQUFpQyxJQUFqQztRQUNIO01BQ0o7SUFDSjtFQUNKO0FBaHdDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJGJ1bGxldCA9IHJlcXVpcmUoXCIuL0J1bGxldFwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIHpkOiAkYnVsbGV0LFxuICAgICAgICB6ZDI6ICRidWxsZXQsXG4gICAgICAgIGxhbmRNaW5lTm9kZTogY2MuTm9kZVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy56ZCAmJiB0aGlzLnpkLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpkLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy56ZDIgJiYgdGhpcy56ZDIubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuemQyLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5sYW5kTWluZU5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhbmRNaW5lTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvIG9uTG9hZF0g5Yid5aeL5YyW57uE5Lu25aSx6LSlOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlkK/nlKh1cGRhdGXmlrnms5Xku6XmlK/mjIHnp7vliqjpgLvovpFcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uICh0LCBlLCBpLCBjaGFyYWN0ZXJTcGluZSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2NlbmUgPSB0O1xuICAgICAgICB0aGlzLmluZm8gPSBpO1xuICAgICAgICB0aGlzLml0ZW0gPSBlO1xuICAgICAgICBcbiAgICAgICAgLy8g5L2/55So5Lyg5YWl55qEY2hhcmFjdGVyIHNwaW5l5L2c5Li65pi+56S6c3BpbmVcbiAgICAgICAgdGhpcy5zcGluZSA9IGNoYXJhY3RlclNwaW5lO1xuICAgICAgICB0aGlzLmNoYXJhY3RlclNwaW5lID0gY2hhcmFjdGVyU3BpbmU7XG4gICAgICAgIFxuICAgICAgICAvLyDkv53lrZjljp/mnaXnmoRpdGVtLnNwaW5l5byV55SoXG4gICAgICAgIHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwgPSB0aGlzLml0ZW0uc3BpbmU7XG4gICAgICAgIFxuICAgICAgICAvLyDmo4Dmn6Xljp/lp4tzcGluZeWSjGNoYXJhY3RlciBzcGluZeaYr+WQpuaYr+WQjOS4gOS4quWvueixoVxuICAgICAgICB2YXIgaXNTYW1lU3BpbmUgPSAodGhpcy5pdGVtU3BpbmVPcmlnaW5hbCA9PT0gY2hhcmFjdGVyU3BpbmUpO1xuICAgICAgICBcbiAgICAgICAgLy8g5bCGaXRlbS5zcGluZeaMh+WQkWNoYXJhY3RlciBzcGluZe+8jOi/meagt0l0ZW3nu4Tku7bog73mraPluLjlt6XkvZxcbiAgICAgICAgdGhpcy5pdGVtLnNwaW5lID0gY2hhcmFjdGVyU3BpbmU7XG4gICAgICAgIFxuICAgICAgICAvLyDkv53lrZhpdGVtLnNwaW5l6IqC54K555qE5Yid5aeL5L2N572u77yI5aaC5p6c5a2Y5Zyo77yJXG4gICAgICAgIGlmICh0aGlzLml0ZW1TcGluZU9yaWdpbmFsICYmIHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwubm9kZSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtU3BpbmVJbml0aWFsUG9zID0gdGhpcy5pdGVtU3BpbmVPcmlnaW5hbC5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWPquacieW9k+WOn+Wni3NwaW5l5ZKMY2hhcmFjdGVyIHNwaW5l5LiN5piv5ZCM5LiA5Liq5a+56LGh5pe277yM5omN6ZqQ6JeP5Y6f5aeLc3BpbmVcbiAgICAgICAgICAgIC8vIOWmguaenOaYr+WQjOS4gOS4qu+8jOivtOaYjueUqOaIt+WcqOe8lui+keWZqOS4reW3sue7j+mFjee9ruS6hmNoYXJhY3RlciBzcGluZe+8jOS4jeW6lOivpemakOiXj+Wug1xuICAgICAgICAgICAgaWYgKCFpc1NhbWVTcGluZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOmakOiXj+WOn+Wni3BsYW50IHNwaW5l77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g5L2/55So57yW6L6R5Zmo6YWN572u55qEc3BpbmXvvIzkuI3pmpDol4/vvIxJRDpcIiArIHRoaXMuaW5mby5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOehruS/neW9k+WJjeS9v+eUqOeahHNwaW5l5piv5Y+v6KeB55qEXG4gICAgICAgIGlmICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSkge1xuICAgICAgICAgICAgdGhpcy5zcGluZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDnoa7kv51zcGluZeWPr+inge+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGFjdGl2ZTpcIiArIHRoaXMuc3BpbmUubm9kZS5hY3RpdmUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgbyA9IHRoaXMuaW5mby5qc29uLnJhbmdlO1xuICAgICAgICB0aGlzLmF0a1JSID0gbyAqIG87XG4gICAgICAgIHRoaXMubHZzID0gW107XG4gICAgICAgIHRoaXMuaHAgPSB0aGlzLml0ZW0ubWF4SHA7XG4gICAgICAgIHRoaXMuc2hpZWxkVmFsdWUgPSAwO1xuICAgICAgICB0aGlzLmhhc0RpZSA9ICExO1xuICAgICAgICBcbiAgICAgICAgLy8g6K6+572u6KeS6Imy5Yqo55S75ZKM5LqL5Lu255uR5ZCsXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0dXBBbmltYXRpb25FdmVudHMoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaXNQaHkgPSAhMDtcbiAgICAgICAgdGhpcy5pc01hZ2ljID0gITA7XG4gICAgICAgIHRoaXMuaXMzZ3ogPSBbMiwgNSwgOSwgMTBdLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09IG4uaXRlbS5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaXMyZ3ogPSBbMiwgNCwgOF0uc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT0gbi5pdGVtLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub24oXCJsdnVwXCIsIHRoaXMub25MdnVwLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOenu+WKqOebuOWFs+eahOWIneWni+WMllxuICAgICAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IDIwOyAvLyDoi7Hpm4Tnp7vliqjpgJ/luqZcbiAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgLy8g5pS75Ye754q25oCB5Yid5aeL5YyWXG4gICAgICAgIHRoaXMuaXNBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QXR0YWNrVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pdGVtLmluQ29vbERvd24gPSBmYWxzZTsgLy8g56Gu5L+d5Ya35Y2054q25oCB6KKr5q2j56Gu5Yid5aeL5YyWXG4gICAgICAgIFxuICAgICAgICAvLyDkuI3lho3pnIDopoHlrZDlvLnns7vnu5/vvIzmlLvlh7vpgJrov4fliqjnlLvkuovku7bop6blj5FcbiAgICAgICAgdGhpcy51c2VDaGFyYWN0ZXJBdHRhY2sgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g5pS75Ye754q25oCB5Yid5aeL5YyW77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiwgaXNBdHRhY2tpbmc6XCIgKyB0aGlzLmlzQXR0YWNraW5nICsgXCIsIGluQ29vbERvd246XCIgKyB0aGlzLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgIFxuICAgICAgICAvLyDlhbPplK7vvJrnoa7kv51IZXJv57uE5Lu25Zyo5Yid5aeL5YyW5ZCO5ZCv55So77yM5Lul5L6/dXBkYXRl5pa55rOV6IO96KKr6LCD55SoXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvLyDosIPor5Xml6Xlv5fvvIznoa7orqTliJ3lp4vljJblrozmiJBcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gaW5pdEJ55a6M5oiQ77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiwgZW5hYmxlZDpcIiArIHRoaXMuZW5hYmxlZCArIFwiLCBzcGluZTpcIiArICh0aGlzLnNwaW5lID8gdGhpcy5zcGluZS5kZWZhdWx0U2tpbiA6IFwibnVsbFwiKSArIFwiLCDmlLvlh7vojIPlm7Q6XCIgKyBNYXRoLnNxcnQodGhpcy5hdGtSUikpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBzcGluZeiKgueCueS/oeaBryAtIGFjdGl2ZTpcIiArICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgOiBcIm51bGxcIikgKyBcbiAgICAgICAgICAgICAgICAgICAgXCIsIOS9jee9rjpcIiArICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5wb3NpdGlvbiA6IFwibnVsbFwiKSArIFxuICAgICAgICAgICAgICAgICAgICBcIiwg57yp5pS+OlwiICsgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLnNjYWxlIDogXCJudWxsXCIpICsgXG4gICAgICAgICAgICAgICAgICAgIFwiLCDkuI3pgI/mmI7luqY6XCIgKyAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUgPyB0aGlzLnNwaW5lLm5vZGUub3BhY2l0eSA6IFwibnVsbFwiKSk7XG4gICAgfSxcbiAgICBvbkx2dXA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW0uaW5kZXggPT0gdCkge1xuICAgICAgICAgICAgdGhpcy5pdGVtLmx2dXAoITEpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5odWIuc2hvd0x2dXBFZmZlY3QodGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0dXBBbmltYXRpb25FdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICAvLyDnm5HlkKxTcGluZeWKqOeUu+S6i+S7tu+8jOWcqOaUu+WHu+WKqOeUu+eahOWFs+mUruW4p+inpuWPkeS8pOWus+WIpOWumlxuICAgICAgICBpZiAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLnNldEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUuc2V0RXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAodHJhY2tFbnRyeSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyDlvZPliqjnlLvkuovku7blkI3kuLpcImF0dGFja1wi5oiWXCJoaXRcIuaXtu+8jOaJp+ihjOaUu+WHu+mAu+i+kVxuICAgICAgICAgICAgICAgIGlmIChldmVudC5kYXRhLm5hbWUgPT09IFwiYXR0YWNrXCIgfHwgZXZlbnQuZGF0YS5uYW1lID09PSBcImhpdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG4ub25BbmltYXRpb25BdHRhY2tFdmVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkFuaW1hdGlvbkF0dGFja0V2ZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWcqOWKqOeUu+S6i+S7tuinpuWPkeaXtui/m+ihjOS8pOWus+WIpOWumlxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuaHAgPiAwKSB7XG4gICAgICAgICAgICB2YXIgZGFtYWdlID0gdGhpcy5nZXRBdGsodGhpcy5pdGVtLmx2KTtcbiAgICAgICAgICAgIHRoaXMuZGVhbERhbWFnZVRvRW5lbXkodGFyZ2V0LCBkYW1hZ2UpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWFsRGFtYWdlVG9FbmVteTogZnVuY3Rpb24gKGVuZW15LCBkYW1hZ2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBkZWFsRGFtYWdlVG9FbmVteV0g5byA5aeL6K6h566X77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiwg5Y6f5aeL5Lyk5a6zOlwiICsgZGFtYWdlICsgXCIsIOaVjOS6ukhQOlwiICsgZW5lbXkuaHApO1xuICAgICAgICBcbiAgICAgICAgLy8g5bqU55So5ZCE56eN5aKe55uK5pWI5p6cXG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwNCkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMjAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOajgOafpeaatOWHu1xuICAgICAgICB2YXIgY3JpdFR5cGUgPSAwO1xuICAgICAgICBpZiAodGhpcy5jaGVja0NyaXQoe30sIGVuZW15KSkge1xuICAgICAgICAgICAgY3JpdFR5cGUgPSAxO1xuICAgICAgICAgICAgZGFtYWdlICo9IHRoaXMuZ2V0Q3JpdFBsdXMoe30sIGVuZW15KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOaatOWHu++8geS8pOWuszpcIiArIGRhbWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOmaj+acuua1ruWKqFxuICAgICAgICBkYW1hZ2UgKj0gY2MubWF0aC5yYW5kb21SYW5nZSgwLjk1LCAxLjA1KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gZGVhbERhbWFnZVRvRW5lbXldIOacgOe7iOS8pOWuszpcIiArIE1hdGguZmxvb3IoZGFtYWdlKSArIFwiLCDmmrTlh7s6XCIgKyAoY3JpdFR5cGUgPT09IDEpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOmAoOaIkOS8pOWus1xuICAgICAgICBlbmVteS5odXJ0QnkodGhpcywgZGFtYWdlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOaYvuekuuS8pOWus+aVsOWtl1xuICAgICAgICB0aGlzLnNjZW5lLnNob3dFbmVteUh1cnROdW0oY3JpdFR5cGUsIGVuZW15Lm5vZGUucG9zaXRpb24sIGRhbWFnZSk7XG4gICAgICAgIFxuICAgICAgICAvLyDmmL7npLrlh7vkuK3nibnmlYjvvIjku4XlnKjpnZ5jaGFyYWN0ZXLmlLvlh7vns7vnu5/ml7bmmL7npLpwbGFudOeJueaViO+8iVxuICAgICAgICAvLyBjaGFyYWN0ZXLns7vnu5/kvb/nlKjliqjnlLvoh6rluKbnmoTnibnmlYhcbiAgICAgICAgaWYgKCF0aGlzLnVzZUNoYXJhY3RlckF0dGFjaykge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93SnNFZmZlY3QoZW5lbXkubm9kZS5wb3NpdGlvbiwgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g57uf6K6h5Lyk5a6zXG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0c1t0aGlzLmluZm8uaWRdICs9IGRhbWFnZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOW6lOeUqOWQhOenjWRlYnVmZuaViOaenFxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzA0KSAmJiBNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICAgICAgICBlbmVteS5hZGRCdWZmV2VhaygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDQpKSB7XG4gICAgICAgICAgICBlbmVteS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwMykpIHtcbiAgICAgICAgICAgIGVuZW15LnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMikpIHtcbiAgICAgICAgICAgIGVuZW15LnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBkZWFsRGFtYWdlVG9FbmVteV0g5a6M5oiQ77yM5pWM5Lq65Ymp5L2ZSFA6XCIgKyBlbmVteS5ocCk7XG4gICAgfSxcbiAgICBzZXRBbmltYXRpb246IGZ1bmN0aW9uICh0LCBlLCBpLCBuKSB7XG4gICAgICAgIC8vIHRoaXMuc3BpbmUuc2V0QW5pbWF0aW9uKHQsIGUgKyAodGhpcy5pdGVtLmx2ICsgMSksIGkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLnNwaW5lKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0hlcm8gc2V0QW5pbWF0aW9uXSBzcGluZeS4uuepuu+8gUlEOlwiICsgKHRoaXMuaW5mbyA/IHRoaXMuaW5mby5pZCA6IFwidW5rbm93blwiKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlciBzcGluZe+8jOmcgOimgeaYoOWwhOWKqOeUu+WQjeensFxuICAgICAgICB2YXIgYW5pbU5hbWUgPSBlO1xuICAgICAgICBpZiAodGhpcy5jaGFyYWN0ZXJTcGluZSAmJiB0aGlzLnNwaW5lID09PSB0aGlzLmNoYXJhY3RlclNwaW5lKSB7XG4gICAgICAgICAgICAvLyDliqjnlLvlkI3np7DmmKDlsITvvJpwbGFudOWKqOeUuyAtPiBjaGFyYWN0ZXLliqjnlLtcbiAgICAgICAgICAgIHZhciBhbmltTWFwID0ge1xuICAgICAgICAgICAgICAgIFwiSWRsZVwiOiBcIklkbGVcIixcbiAgICAgICAgICAgICAgICBcIkhpdFwiOiBcIkhpdFwiLFxuICAgICAgICAgICAgICAgIFwiRGVhZFwiOiBcIkRlYWRcIixcbiAgICAgICAgICAgICAgICBcIldhbGtcIjogXCJXYWxrXCIsXG4gICAgICAgICAgICAgICAgXCJmdWh1b1wiOiBcIklkbGVcIiAgLy8g5aSN5rS75Yqo55S75pqC5pe25pig5bCE5Li6SWRsZe+8jGNoYXJhY3RlcuS4reayoeaciWZ1aHVvXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYW5pbU5hbWUgPSBhbmltTWFwW2VdIHx8IGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gc2V0QW5pbWF0aW9uXSBJRDpcIiArICh0aGlzLmluZm8gPyB0aGlzLmluZm8uaWQgOiBcInVua25vd25cIikgKyBcIiwg5Yqo55S7OlwiICsgYW5pbU5hbWUgKyBcIiwgc3BpbmXoioLngrlhY3RpdmU6XCIgKyAodGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLmFjdGl2ZSA6IFwibnVsbFwiKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbih0LCBhbmltTmFtZSwgaSk7XG4gICAgICAgIHRoaXMuc3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihuKTtcbiAgICB9LFxuICAgIGdldEF0azogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSBNYXRoLm1pbih0aGlzLmluZm8ubHYxLCB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyLmxlbmd0aCAtIDEpO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTJbZV07XG4gICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgaSAqPSB0aGlzLmluZm8uanNvbi5maWdodGx2dXAyW3QgLSAxXSAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IGNjLnB2ei5ydW50aW1lRGF0YS5nZXRCdWZmVmFsdWUoMik7XG4gICAgICAgIHZhciBvID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSgxMCk7XG4gICAgICAgIGlmIChvID4gMCkge1xuICAgICAgICAgICAgbiArPSBvICogY2MucHZ6LnJ1bnRpbWVEYXRhLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICAgIGkgKj0gMSArIDAuMDEgKiBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH0sXG4gICAgZ2V0U2hpZWxkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IE1hdGgubWluKHRoaXMuaW5mby5sdjEsIHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTIubGVuZ3RoIC0gMSk7XG4gICAgICAgIHZhciBpID0gdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMltlXTtcbiAgICAgICAgaWYgKHQgPiAwKSB7XG4gICAgICAgICAgICBpICo9IHRoaXMuaW5mby5qc29uLmZpZ2h0bHZ1cDJbdCAtIDFdIC8gMTAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH0sXG4gICAgcHVzaEx2QW5kQXRrOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuZ2V0QXRrKHQubHYpO1xuICAgICAgICB0aGlzLmx2cy5wdXNoKHtcbiAgICAgICAgICAgIGx2OiB0Lmx2LFxuICAgICAgICAgICAgYXRrOiBlXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcGxheUF0dEFuZERvOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiSGl0XCIsICExLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpLml0ZW0uY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXIoKTtcbiAgICAgICAgICAgIGkuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3BpbmUuc2V0RXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9kdW5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9ocFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2ppZ3VhbmdcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZ2V0U3VuU2hpbmVcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvc2hvb3RcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyeVNob290OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAvLyDmt7vliqDosIPor5XorqHmlbDlmahcbiAgICAgICAgaWYgKCF0aGlzLnRyeVNob290Q2FsbENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnRyeVNob290Q2FsbENvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyeVNob290Q2FsbENvdW50Kys7XG4gICAgICAgIFxuICAgICAgICAvLyDmr48xMOasoeiwg+eUqOaJk+WNsOS4gOasoe+8jOmBv+WFjeWIt+Wxj1xuICAgICAgICBpZiAodGhpcy50cnlTaG9vdENhbGxDb3VudCAlIDEwID09PSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOiiq+iwg+eUqO+8jOasoeaVsDpcIiArIHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCB1c2VDaGFyYWN0ZXJBdHRhY2s6XCIgKyB0aGlzLnVzZUNoYXJhY3RlckF0dGFjayArIFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGlzQXR0YWNraW5nOlwiICsgdGhpcy5pc0F0dGFja2luZyArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgaW5Db29sRG93bjpcIiArIHRoaXMuaXRlbS5pbkNvb2xEb3duKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5aaC5p6c5L2/55SoY2hhcmFjdGVy5pS75Ye757O757uf77yM55u05o6l5pKt5pS+5pS75Ye75Yqo55S7XG4gICAgICAgIGlmICh0aGlzLnVzZUNoYXJhY3RlckF0dGFjaykge1xuICAgICAgICAgICAgLy8g5LyY5YWI5L2/55SodXBkYXRlTW92ZW1lbnTlt7Lnu4/mib7liLDnmoTnm67moIfvvIznoa7kv53ot53nprvorqHnrpfkuIDoh7TmgKdcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlIHx8IHRoaXMuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5b2T5YmN55uu5qCH77yM5bCd6K+V5p+l5om+XG4gICAgICAgICAgICBpZiAoIXRhcmdldCB8fCB0YXJnZXQuaHAgPD0gMCkge1xuICAgICAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuacieaVjOS6uuWcqOaUu+WHu+iMg+WbtOWGhe+8iOS9v+eUqOeojeWkp+eahOiMg+WbtOmBv+WFjei+ueeVjOmXrumimO+8iVxuICAgICAgICAgICAgICAgIHZhciBhdHRhY2tSYW5nZUJ1ZmZlciA9IHRoaXMuYXRrUlIgKiAxLjA1OyAvLyDlop7liqA1JeeahOWuueW3rlxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgYXR0YWNrUmFuZ2VCdWZmZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzmnInnm67moIfvvIzpqozor4Hot53nprvvvIjkvb/nlKjkuI51cGRhdGVNb3ZlbWVudOebuOWQjOeahOiuoeeul+aWueW8j++8iVxuICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuaHAgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFBvcyA9IHRhcmdldC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0YXJnZXQuY2VudGVyWSkpO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0U3FyID0gdGFyZ2V0UG9zLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgICAgIHZhciBhdHRhY2tSYW5nZUJ1ZmZlciA9IHRoaXMuYXRrUlIgKiAxLjA1O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWmguaenOebruagh+S4jeWcqOaUu+WHu+iMg+WbtOWGhe+8jOa4hemZpOebruagh1xuICAgICAgICAgICAgICAgIGlmIChkaXN0U3FyID4gYXR0YWNrUmFuZ2VCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgJSAzMCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyB0cnlTaG9vdF0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDnm67moIfot53nprs6XCIgKyBNYXRoLnNxcnQoZGlzdFNxcikudG9GaXhlZCgxKSArIFwiID4g5pS75Ye76IyD5Zu0OlwiICsgTWF0aC5zcXJ0KGF0dGFja1JhbmdlQnVmZmVyKS50b0ZpeGVkKDEpICsgXCLvvIzmuIXpmaTnm67moIdcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghdGFyZ2V0IHx8IHRhcmdldC5ocCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZE5vVGFyZ2V0IHx8IHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgJSAzMCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOayoeacieaJvuWIsOaUu+WHu+ebruagh++8jOaUu+WHu+iMg+WbtDpcIiArIE1hdGguc3FydCh0aGlzLmF0a1JSKS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZWROb1RhcmdldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOehruS/nemHjee9ruaUu+WHu+eKtuaAge+8jOmBv+WFjeWNoeS9j1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQXR0YWNraW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdHJ5U2hvb3RdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5rKh5pyJ55uu5qCH77yM6YeN572u5pS75Ye754q25oCBXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOWFs+mUruS/ruWkje+8muWmguaenOS5i+WJjeiupOS4uuWIsOi+vuS6huaUu+WHu+iMg+WbtO+8jOS9hueOsOWcqOaJvuS4jeWIsOebruagh++8jOivtOaYjuWIpOaWreacieivr++8jOmcgOimgemHjee9ruiuqeiLsembhOe7p+e7reenu+WKqFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlop7liqDlpLHotKXorqHmlbDlmahcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmF0dGFja0ZhaWxDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2tGYWlsQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNrRmFpbENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzov57nu63lpJrmrKHmib7kuI3liLDnm67moIfvvIzph43nva7mlLvlh7vojIPlm7TmoIforrDvvIzorqnoi7Hpm4Tnu6fnu63lkJHmlYzkurrnp7vliqhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXR0YWNrRmFpbENvdW50ID49IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdHJ5U2hvb3RdIOKaoO+4jyBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOi/nue7rVwiICsgdGhpcy5hdHRhY2tGYWlsQ291bnQgKyBcIuasoeaJvuS4jeWIsOebruagh++8jOmHjee9rmhhc1JlYWNoZWRBdHRhY2tSYW5nZe+8jOe7p+e7reenu+WKqFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFja0ZhaWxDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmib7liLDnm67moIfkuobvvIzph43nva7lpLHotKXorqHmlbDlmahcbiAgICAgICAgICAgIHRoaXMuYXR0YWNrRmFpbENvdW50ID0gMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6YeN572uXCLmsqHmnInnm67moIdcIuaXpeW/l+agh+W/l1xuICAgICAgICAgICAgdGhpcy5sb2dnZWROb1RhcmdldCA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzmraPlnKjmlLvlh7vkuK3vvIzkuI3ph43lpI3op6blj5FcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXR0YWNraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmlzQXR0YWNraW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEF0dGFja1RhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pKt5pS+5pS75Ye75Yqo55S777yISGl05oiWVGhyb3dpbmfvvIlcbiAgICAgICAgICAgIHZhciBhdHRhY2tBbmltID0gXCJIaXRcIjsgLy8g6buY6K6k6L+R5oiY5pS75Ye7XG4gICAgICAgICAgICB2YXIgYXR0YWNrRGVsYXkgPSAyMDA7IC8vIOm7mOiupOW7tui/nzIwMG1z6Kem5Y+R5Lyk5a6z77yI5Yqo55S75pKt5pS+5Yiw5LiA5Y2K77yJXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaKleaOt+Wei+iLsembhOWPr+S7peS9v+eUqFRocm93aW5n5Yqo55S7XG4gICAgICAgICAgICBpZiAoWzQsIDUsIDEyXS5pbmRleE9mKHRoaXMuaW5mby5pZCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNrQW5pbSA9IFwiVGhyb3dpbmdcIjtcbiAgICAgICAgICAgICAgICBhdHRhY2tEZWxheSA9IDMwMDsgLy8g5oqV5o635Yqo55S75bu26L+f5pu06ZW/XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdHJ5U2hvb3RdIOKchSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOW8gOWni+aUu+WHu++8geWKqOeUuzpcIiArIGF0dGFja0FuaW0gKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCDnm67moIdJRDpcIiArIHRhcmdldC5pZCArIFwiLCDnm67moIdIUDpcIiArIHRhcmdldC5ocCArIFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIHNwaW5l5a2Y5ZyoOlwiICsgISF0aGlzLnNwaW5lICsgXCIsIHNwaW5lLm5vZGUuYWN0aXZlOlwiICsgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLmFjdGl2ZSA6IFwibnVsbFwiKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIGF0dGFja0FuaW0sIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4pyFIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5pS75Ye75Yqo55S75a6M5oiQ77yMaXNBdHRhY2tpbmc6XCIgKyBpLmlzQXR0YWNraW5nICsgXCIg4oaSIGZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5L2/55SoY2hhcmFjdGVy5pS75Ye757O757uf77yM5LiN6ZyA6KaB5a2Q5by56YeN6KOF5aGr5py65Yi2XG4gICAgICAgICAgICAgICAgLy8gSXRlbS5qc+W3sue7j+iuvue9ruS6hmluQ29vbERvd249dHJ1Ze+8jOaIkeS7rOWPqumcgOimgeiuvue9ruiuoeaXtuWZqOadpemHjee9ruWug1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIElEOlwiICsgaS5pbmZvLmlkICsgXCIg6K6+572u5Ya35Y206K6h5pe25Zmo77yM5b2T5YmNIGluQ29vbERvd246XCIgKyBpLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5peg5p2h5Lu26K6+572u5Ya35Y206K6h5pe25Zmo77yI5Zug5Li6SXRlbS5qc+W3sue7j+iuvue9ruS6hmluQ29vbERvd249dHJ1Ze+8iVxuICAgICAgICAgICAgICAgIHZhciBjZFRpbWUgPSBpLml0ZW0uY2RNcyB8fCA1MDA7IC8vIOm7mOiupDUwMG1z5Ya35Y20XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyBpLmluZm8uaWQgKyBcIiDlkK/liqjlhrfljbTorqHml7blmajvvIzml7bpl7Q6XCIgKyBjZFRpbWUgKyBcIm1zXCIpO1xuICAgICAgICAgICAgICAgIGkuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmluQ29vbERvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4o+wIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5Ya35Y205a6M5oiQ77yBaW5Db29sRG93bjpcIiArIGkuaXRlbS5pbkNvb2xEb3duKTtcbiAgICAgICAgICAgICAgICB9LCBjZFRpbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOW7tui/n+inpuWPkeS8pOWus+WIpOWumu+8iOaooeaLn+aUu+WHu+WKqOeUu+eahOaJk+WHu+eCue+8iVxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDwn5KlIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5YeG5aSH6YCg5oiQ5Lyk5a6zXCIpO1xuICAgICAgICAgICAgICAgIGlmIChpLmN1cnJlbnRBdHRhY2tUYXJnZXQgJiYgaS5jdXJyZW50QXR0YWNrVGFyZ2V0LmhwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGFtYWdlID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g8J+SpSBJRDpcIiArIGkuaW5mby5pZCArIFwiIOmAoOaIkOS8pOWuszpcIiArIGRhbWFnZSArIFwiIOe7meebruagh0lEOlwiICsgaS5jdXJyZW50QXR0YWNrVGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgaS5kZWFsRGFtYWdlVG9FbmVteShpLmN1cnJlbnRBdHRhY2tUYXJnZXQsIGRhbWFnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g4pqg77iPIElEOlwiICsgaS5pbmZvLmlkICsgXCIg55uu5qCH5bey5aSx5pWI77yM5Y+W5raI5Lyk5a6zXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGF0dGFja0RlbGF5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5U291bmQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDku6XkuIvmmK/ljp/mnaXnmoTlrZDlvLnns7vnu5/pgLvovpHvvIjkv53nlZnlkJHlkI7lhbzlrrnvvIlcbiAgICAgICAgLy8g5a+55LqO6ZyA6KaB5pWM5Lq655uu5qCH55qE5pS75Ye75Z6L6Iux6ZuE77yISUQgMSwyLDQsNSw3LDksMTLvvInvvIzmo4Dmn6XmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgLy8gdG9kbyDkv67mlLnkuLrlhajpg6joi7Hpm4Tpg73mo4DmtYtcbiAgICAgICAgdmFyIG5lZWRUYXJnZXRDaGVjayA9IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA5LCAxMl07XG4gICAgICAgIGlmIChuZWVkVGFyZ2V0Q2hlY2suaW5kZXhPZih0aGlzLmluZm8uaWQpICE9PSAtMSkge1xuICAgICAgICAgICAgLy8g5qOA5p+l5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICAvLyDms6jmhI/vvJrkuI3lnKjov5nph4zmn6Xmib7nm67moIfvvIzlm6DkuLp1cGRhdGVNb3ZlbWVudOW3sue7j+WcqOeUqOWkp+iMg+WbtOafpeaJvuS6hlxuICAgICAgICAgICAgLy8g6L+Z6YeM5Y+q5qOA5p+l5b2T5YmN5piv5ZCm5pyJ55uu5qCH5LiU5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFRhcmdldCB8fCB0aGlzLmN1cnJlbnRUYXJnZXQuaHAgPD0gMCkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeacieW9k+WJjeebruagh++8jOeUqOWunumZheaUu+WHu+iMg+WbtOWwneivleafpeaJvlxuICAgICAgICAgICAgICAgIHZhciBuZWFyVGFyZ2V0ID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5lYXJUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Zyo5pS75Ye76IyD5Zu05YaF55qE5pWM5Lq677yM6L+U5ZueZmFsc2Xorqnoi7Hpm4Tnu6fnu63np7vliqhcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBuZWFyVGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmo4Dmn6XlvZPliY3nm67moIfmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIHZhciB0YXJnZXRQb3MgPSB0aGlzLmN1cnJlbnRUYXJnZXQubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgdGhpcy5jdXJyZW50VGFyZ2V0LmNlbnRlclkpKTtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRhcmdldFBvcy5zdWIodGhpcy5ub2RlLnBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IHRoaXMuYXRrUlIpIHtcbiAgICAgICAgICAgICAgICAvLyDnm67moIfkuI3lnKjmlLvlh7vojIPlm7TlhoXvvIzov5Tlm55mYWxzZeiuqeiLsembhOe7p+e7reenu+WKqFxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoICh0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAvLyAz5Y+36Iux6ZuE5pS55Li65pmu6YCa5pS75Ye75Z6LXG4gICAgICAgICAgICAgICAgdmFyIHIgPSBlIHx8IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgISFyICYmXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnB1c2hMdkFuZEF0ayh0KSxcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuaXNBdHRhY2tpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcy5pc0F0dGFja2luZyA9ICEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5pc0F0dGFja2luZyA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5jaGVja1RvU2hvb3Qocik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuaXRlbS5idWxsZXRDb3VudCA8PSAwICYmIGkuSUtCb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy50d2VlbihpLklLQm9uZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiA1MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LuF5b2T5L2/55SocGxhbnQgc3BpbmXml7bmiY3kvb/nlKhJS+mqqOmqvFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcmFjdGVyIHNwaW5l5LiN6ZyA6KaBSUvnnoTlh4ZcbiAgICAgICAgICAgICAgICAgICAgICAgICghdGhpcy5jaGFyYWN0ZXJTcGluZSB8fCB0aGlzLnNwaW5lICE9PSB0aGlzLmNoYXJhY3RlclNwaW5lKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JS0JvbmUgfHwgKHRoaXMuSUtCb25lID0gdGhpcy5zcGluZS5maW5kQm9uZShcIklLXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHdlZW4odGhpcy5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogKHIubm9kZS54IC0gdGhpcy5ub2RlLngpIC8gMC43NixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChyLm5vZGUueSArIHIuY2VudGVyWSAtIHRoaXMubm9kZS55KSAvIDAuNzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAhMCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoNjAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IDAuMTU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDYwMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKz0gMC4zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxICsgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY3Jvc3NJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5oZXJvICYmIGUuaGVyby5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmhlcm8uYWRkU2hpZWxkKGUubWF4SHAgKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNob3dCdWZmRWZmZWN0KFwic2hpZWxkXCIsIGUuaGVyby5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy5zY2VuZS5jaG9vc2VNaW5IcEhlcm8oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAhIW4gJiZcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLmNoZWNrQnVmZig4MDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxLjI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEhwKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcIkhQXCIsIG4ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAhMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTAwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSAwLjE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICs9IDAuMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMSArIGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibXVzaWNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGkubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgNTApKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0QW5nZXJCYXJXUG9zKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyICs9IHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS51cGRhdGVBbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZigxMTA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkubGFzdEJ1bGxldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT0gaS5sYXN0QnVsbGV0Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaS5sYXN0QnVsbGV0Q291bnQgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBjYy5pbnN0YW50aWF0ZShpLmxhbmRNaW5lTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNjLnYyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0SGVyb2VzTWF4TWFyZ2luWCgpICsgY2MubWF0aC5yYW5kb21SYW5nZSgwLCAxNTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLm1hdGgucmFuZG9tUmFuZ2UoaS5zY2VuZS5ncm91bmRBcmVhTEIueSArIDEyMCwgaS5zY2VuZS5ncm91bmRBcmVhVFIueSAtIDEyMClcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnBvc2l0aW9uID0gaS5ub2RlLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQucGFyZW50ID0gaS5zY2VuZS5vYmpzUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuekluZGV4ID0gLXQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gdC5nZXRDb21wb25lbnQoY2MuQ29sbGlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHQuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gby5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gKGUueCAtIHQueCkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy55ID0gKGUueSAtIHQueSkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gTWF0aC5tYXgoMCwgcy54KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0QW5pbWF0aW9uKDAsIFwiemQxMV8xXCIsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5zZXRBbmltYXRpb24oMCwgXCJ6ZDExXzJcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHQ7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICB2YXIgbyA9IHRoaXMuY2hlY2tCdWZmKDEyMDQpID8gMiA6IDEsXG4gICAgICAgICAgICAgICAgICAgIHMgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15cyh0aGlzLCB0aGlzLmF0a1JSLCBvKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA9PSBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5zY2VuZS5nZXRIZXJvZXNNYXhNYXJnaW5YKCksXG4gICAgICAgICAgICAgICAgICAgIGEgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgIT0gYSB8fCBpLmNoZWNrQnVmZigxMjA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBzW01hdGgubWluKHMubGVuZ3RoIC0gMSwgYSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSB0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHQuY2VudGVyWSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBjYy52MihNYXRoLm1pbihjLCBlLngpLCBlLnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBpLnNjZW5lLm9ianNSb290LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gY2MuaW5zdGFudGlhdGUoaS56ZC5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoID0gci5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByLnBhcmVudCA9IGkuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICByLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgci5wb3NpdGlvbiA9IGkubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguc3BpbmUuc2V0QW5pbWF0aW9uKDAsIGguc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiwgITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBoLnNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdSA9IGguc3BpbmUubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueCA9IHUueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueSA9IHUueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguaW5pdEJ5KGkuc2NlbmUsIGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLmEgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5hdHQgPSBpLmdldEF0ayhpLml0ZW0ubHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0pzRWZmZWN0KGNjLnYyKG4ueCArIDEwMCAqIHQsIG4ueSksIGkuaW5mby5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDggKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gMTsgbCA8IDU7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2d1bnppXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByID0gZSB8fCB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIHRoaXMuYXRrUlIpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgISFyICYmXG4gICAgICAgICAgICAodGhpcy5wdXNoTHZBbmRBdGsodCksXG4gICAgICAgICAgICAhdGhpcy5pc0F0dGFja2luZyAmJlxuICAgICAgICAgICAgICAgICgodGhpcy5pc0F0dGFja2luZyA9ICEwKSxcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmNoZWNrVG9TaG9vdChyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuaXRlbS5idWxsZXRDb3VudCA8PSAwICYmIGkuSUtCb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4oaS5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogNTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDku4XlvZPkvb/nlKhwbGFudCBzcGluZeaXtuaJjeS9v+eUqElL6aqo6aq8XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFyYWN0ZXIgc3BpbmXkuI3pnIDopoFJS+eehOWHhlxuICAgICAgICAgICAgICAgICAgICAgICAgKCF0aGlzLmNoYXJhY3RlclNwaW5lIHx8IHRoaXMuc3BpbmUgIT09IHRoaXMuY2hhcmFjdGVyU3BpbmUpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklLQm9uZSB8fCAodGhpcy5JS0JvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiSUtcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50d2Vlbih0aGlzLklLQm9uZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvKDAuMDY0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAoci5ub2RlLnggLSB0aGlzLm5vZGUueCkgLyAwLjc2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogKHIubm9kZS55ICsgci5jZW50ZXJZIC0gdGhpcy5ub2RlLnkpIC8gMC43NlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICEwKSlcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGNoZWNrVG9TaG9vdDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5sdnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy56ZCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5sdnMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHQgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob290KGksIHRoaXMuaXRlbS5sdiwgZS5hdGspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmx2cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KHRoaXMuY2hlY2tUb1Nob290LmJpbmQodGhpcyksIDgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2hvb3RBUG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS9v+eUqEhhbmRfRumqqOmqvOS9nOS4uuaUu+WHu+eCuVxuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2sgJiYgdGhpcy5zcGluZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLkhhbmRCb25lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5IYW5kQm9uZSA9IHRoaXMuc3BpbmUuZmluZEJvbmUoXCJIYW5kX0ZcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5IYW5kQm9uZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gY2MudjIodGhpcy5IYW5kQm9uZS53b3JsZFgsIHRoaXMuSGFuZEJvbmUud29ybGRZKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5om+5LiN5YiwSGFuZF9G6aqo6aq877yM6L+U5Zuec3BpbmXoioLngrnkvY3nva5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDljp/mnaXnmoTlrZDlvLnns7vnu5/pgLvovpHvvIjkv53nlZnlkJHlkI7lhbzlrrnvvIlcbiAgICAgICAgaWYgKHRoaXMuR1BCb25lKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5HUEJvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiR1BcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSBjYy52Mih0aGlzLkdQQm9uZS53b3JsZFgsIHRoaXMuR1BCb25lLndvcmxkWSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNwaW5lLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKHQpO1xuICAgIH0sXG4gICAgc2hvb3Q6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIGlmICg0ID09IHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgdmFyIG47XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAxKSkge1xuICAgICAgICAgICAgICAgIG4gPSA5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuID0gNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290TihuLCB0LCBlLCBpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTA0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3ROKDMsIHQsIGUsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKDcgPT0gdGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3RJSyh0LCBlLCBpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgdGhpcy5zaG9vdDEodCwgZSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob290MTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgbyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobik7XG4gICAgICAgIHZhciBzID0gdC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0LmNlbnRlclkpKS5zdWIobyk7XG4gICAgICAgIGlmIChzLnggPCAwKSB7XG4gICAgICAgICAgICBzLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjID0gTWF0aC5hdGFuMihzLnksIHMueCk7XG4gICAgICAgIHZhciBhID0gdGhpcy56ZDtcbiAgICAgICAgdmFyIHIgPSBjYy5pbnN0YW50aWF0ZShhLm5vZGUpO1xuICAgICAgICByLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgIHIuYWN0aXZlID0gITA7XG4gICAgICAgIHIucG9zaXRpb24gPSBvO1xuICAgICAgICB2YXIgaCA9IHIuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTA0KSkge1xuICAgICAgICAgICAgaC5oaXRDb3VudCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMykpIHtcbiAgICAgICAgICAgIGguaGl0Q291bnQgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGguaW5pdEJ5KHRoaXMuc2NlbmUsIGUpO1xuICAgICAgICBoLmEgPSB0aGlzO1xuICAgICAgICBpZiAoMTMgPT0gdGhpcy5pbmZvLmlkICYmIDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIGguYXR0ID0gaSAvIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoLmF0dCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgaC5tb3ZlQnlBbmdsZSgoMTgwICogYykgLyBNYXRoLlBJKTtcbiAgICB9LFxuICAgIHNob290TjogZnVuY3Rpb24gKHQsIGUsIGksIG4pIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgcyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgIHZhciBjID0gZS5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCBlLmNlbnRlclkpKS5zdWIocyk7XG4gICAgICAgIGlmIChjLnggPCAwKSB7XG4gICAgICAgICAgICBjLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhID0gKDE4MCAqIE1hdGguYXRhbjIoYy55LCBjLngpKSAvIE1hdGguUEk7XG4gICAgICAgIHZhciByO1xuICAgICAgICBpZiAodCA+IDUpIHtcbiAgICAgICAgICAgIHIgPSBbMCwgLTEwLCAtMjAsIC0zMCwgNDAsIDEwLCAyMCwgMzAsIDQwXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHIgPSBbMCwgLTE1LCAxNSwgLTMwLCAzMF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCB0OyBoKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gY2MuaW5zdGFudGlhdGUodGhpcy56ZC5ub2RlKTtcbiAgICAgICAgICAgIGQucGFyZW50ID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdDtcbiAgICAgICAgICAgIGQuYWN0aXZlID0gITA7XG4gICAgICAgICAgICBkLnBvc2l0aW9uID0gcztcbiAgICAgICAgICAgIHZhciB1ID0gZC5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgICAgICB1LmluaXRCeSh0aGlzLnNjZW5lLCBpKTtcbiAgICAgICAgICAgIHUuYSA9IHRoaXM7XG4gICAgICAgICAgICB1LmF0dCA9IG47XG4gICAgICAgICAgICB1Lm1vdmVCeUFuZ2xlKGEgKyByW2hdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvb3RJSzogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IHRoaXMuZ2V0U2hvb3RBUG9zKCk7XG4gICAgICAgIHZhciBzID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgdmFyIGMgPSB0Lm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKDAsIHQuY2VudGVyWSkpO1xuICAgICAgICB2YXIgYSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuemQubm9kZSk7XG4gICAgICAgIHZhciByID0gYS5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgIGEucGFyZW50ID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdDtcbiAgICAgICAgYS5hY3RpdmUgPSAhMDtcbiAgICAgICAgYS5wb3NpdGlvbiA9IHM7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDIpKSB7XG4gICAgICAgICAgICBhLmdldENvbXBvbmVudChcIkV2ZW50Q29sbGlkZXJcIikuY29sbGlkZXIucmFkaXVzICo9IDEuMztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaCA9IHIuc3BpbmUuc2V0QW5pbWF0aW9uKDAsIHIuc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiwgITApO1xuICAgICAgICByLnNwaW5lLnNldFRyYWNrRXZlbnRMaXN0ZW5lcihoLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuLnNjZW5lLnNob3dKc0VmZmVjdCh0Lm5vZGUucG9zaXRpb24sIG4uaW5mby5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZCA9IHIuc3BpbmUuZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgdmFyIHUgPSByLnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoYyk7XG4gICAgICAgIGQueCA9IHUueDtcbiAgICAgICAgZC55ID0gdS55O1xuICAgICAgICBkLnggPSBNYXRoLm1heCgwLCBkLngpO1xuICAgICAgICByLmluaXRCeSh0aGlzLnNjZW5lLCBlKTtcbiAgICAgICAgci5hID0gdGhpcztcbiAgICAgICAgci5hdHQgPSBpO1xuICAgIH0sXG4gICAgY2hlY2tIZXJvQnVmZjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gITE7XG4gICAgfSxcbiAgICBjaGVja0J1ZmY6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gKHQgLSAodCAlIDEwMCkpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmZvLmlkID09IGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYodCk7XG4gICAgfSxcbiAgICBkb0J1bGxldEF0dExvZ2ljOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHQuYXR0O1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwNCkpIHtcbiAgICAgICAgICAgIGkgKj0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTIwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS53ZWFrTm9kZSAmJiB0aGlzLmlzUGh5KSB7XG4gICAgICAgICAgICBpICo9IDEuMjtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGNjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUGh5KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pczNneikge1xuICAgICAgICAgICAgICAgICAgICBpICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEgLSA0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXMyZ3opIHtcbiAgICAgICAgICAgICAgICAgICAgaSAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxIC0gMTBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ3JpdCh0LCBlKSkge1xuICAgICAgICAgICAgbiA9IDE7XG4gICAgICAgICAgICBpICo9IHRoaXMuZ2V0Q3JpdFBsdXModCwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgaSAqPSBjYy5tYXRoLnJhbmRvbVJhbmdlKDAuOTUsIDEuMDUpO1xuICAgICAgICBlLmh1cnRCeSh0aGlzLCBpKTtcbiAgICAgICAgdGhpcy5zY2VuZS5zaG93RW5lbXlIdXJ0TnVtKG4sIGUubm9kZS5wb3NpdGlvbiwgaSk7XG4gICAgICAgIGlmICh0LmpzRWZmRXhjbHVzaXZlKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93SnNFZmZlY3QoZS5ub2RlLnBvc2l0aW9uLCB0aGlzLmluZm8uaWQpO1xuICAgICAgICB9XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0c1t0aGlzLmluZm8uaWRdICs9IGk7XG4gICAgICAgIGlmICh0LmJ1ZmZTbG93KSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZTbG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQuYnVmZkljZSAmJiB0aGlzLmNoZWNrQnVmZigxMjAzKSAmJiBNYXRoLnJhbmRvbSgpIDwgMC4yKSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZJY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzA0KSAmJiBNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICAgICAgICBlLmFkZEJ1ZmZXZWFrKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwNCkpIHtcbiAgICAgICAgICAgIGUucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDMpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMikpIHtcbiAgICAgICAgICAgIGUucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja0NyaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dENvdW50ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSB0aGlzLmF0dENvdW50ZXIgKyAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNTAyKSkge1xuICAgICAgICAgICAgICAgIHQgPSAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ID0gMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF0dENvdW50ZXIgPj0gdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0Q291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMikpIHtcbiAgICAgICAgICAgIGUgKz0gMC4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDA0KSkge1xuICAgICAgICAgICAgZSArPSAwLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDMpKSB7XG4gICAgICAgICAgICBlICs9IDAuMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IGU7XG4gICAgfSxcbiAgICBnZXRDcml0UGx1czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IDEuNTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMykpIHtcbiAgICAgICAgICAgIHQgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG4gICAgZG9MYW5kTWluZXNMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0LmdldENvbXBvbmVudChcIkVuZW15XCIpO1xuICAgICAgICBpZiAoZSAmJiBlLmhwID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kb0J1bGxldEF0dExvZ2ljKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0OiB0aGlzLmdldEF0ayh0aGlzLml0ZW0ubHYpLFxuICAgICAgICAgICAgICAgICAgICBsdjogdGhpcy5pdGVtLmx2LFxuICAgICAgICAgICAgICAgICAgICBqc0VmZkV4Y2x1c2l2ZTogITBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uTGFuZG1pbmVzQ29sbGlzaW9uOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoZS5lbmFibGVkKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHQuZ2V0Q29tcG9uZW50KFwiRW5lbXlcIik7XG4gICAgICAgICAgICBpZiAoaSAmJiBpLmhwID4gMCkge1xuICAgICAgICAgICAgICAgIGUuZW5hYmxlZCA9ICExO1xuICAgICAgICAgICAgICAgIHZhciBuID0gZS5ub2RlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSBjYy5maW5kKFwicmFuZ2VcIiwgZS5ub2RlKS5nZXRDb21wb25lbnQoY2MuQ29sbGlkZXIpO1xuICAgICAgICAgICAgICAgIGNjLnB2ei51dGlscy5tYW51YWxseUNoZWNrQ29sbGlkZXIobyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93SnNFZmZlY3QoZS5ub2RlLnBvc2l0aW9uLCB0aGlzLmluZm8uaWQpO1xuICAgICAgICAgICAgICAgIG4ubm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEhwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmhwID0gTWF0aC5taW4odGhpcy5pdGVtLm1heEhwLCB0aGlzLmhwICsgdCk7XG4gICAgICAgIHRoaXMuaXRlbS51cGRhdGVIcCh0aGlzLmhwIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVIcCghMCk7XG4gICAgfSxcbiAgICBkZWxIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocCA9IE1hdGgubWF4KDAsIHRoaXMuaHAgLSB0KTtcbiAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZUhwKHRoaXMuaHAgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZUhwKCEwKTtcbiAgICB9LFxuICAgIGFkZFNoaWVsZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5zaGllbGRWYWx1ZSA9IE1hdGgubWluKHRoaXMuaXRlbS5tYXhIcCwgdGhpcy5zaGllbGRWYWx1ZSArIHQpO1xuICAgICAgICB0aGlzLml0ZW0udXBkYXRlU2hpZWxkKHRoaXMuc2hpZWxkVmFsdWUgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZVNoaWVsZCgpO1xuICAgIH0sXG4gICAgaHVydEJ5OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICAvLyDlj5fkvKRcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICBpZiAoISh0aGlzLmhhc0VuZGVkIHx8IHRoaXMuaHAgPD0gMCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNoaWVsZFZhbHVlID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBvID0gTWF0aC5taW4odGhpcy5zaGllbGRWYWx1ZSwgaSk7XG4gICAgICAgICAgICAgICAgaSAtPSBvO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hpZWxkVmFsdWUgLT0gbztcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW0udXBkYXRlU2hpZWxkKHRoaXMuc2hpZWxkVmFsdWUgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPiAwICYmICh0aGlzLmRlbEhwKGkpLCB0aGlzLmhwIDw9IDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHMgPVxuICAgICAgICAgICAgICAgICAgICAhY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc1VzZVJlYm9ybiAmJlxuICAgICAgICAgICAgICAgICAgICAoOCA9PSB0aGlzLmluZm8uaWQgfHwgdGhpcy5zY2VuZS5oYXNIZXJvKDgpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig4MDMpO1xuICAgICAgICAgICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNVc2VSZWJvcm4gPSAhMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDooYDmnaFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtLmJhck5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiRGVhZFwiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5yZWJvcm4oY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoODA0KSA/IDEgOiAwLjMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zaG93QnVmZkVmZmVjdChcInJldml2ZVwiLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLmhhc0RpZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zY2VuZS5jaGVja0lzRmFpbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlYm9ybjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8g5aSN5rS7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJmdWh1b1wiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZS5ocCA9IGUuaXRlbS5tYXhIcCAqIHQ7XG4gICAgICAgICAgICBlLml0ZW0udXBkYXRlSHAoKTtcbiAgICAgICAgICAgIGUuaGFzRGllID0gITE7XG4gICAgICAgICAgICBlLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dCdWZmRWZmZWN0OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodm9pZCAwID09PSBlKSB7XG4gICAgICAgICAgICBlID0gITE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkQnVmZlByZWZhYlxuICAgICAgICAgICAgICAgIC5hZGROb2RlVG8odGhpcy5pdGVtLnNwaW5lLm5vZGUsIGNjLlZlYzIuWkVSTylcbiAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKVxuICAgICAgICAgICAgICAgIC5zZXRBbmltYXRpb24oMCwgdCwgITEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zaG93QnVmZkVmZmVjdCh0LCB0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOehruS/neWIneWni+WMluWujOaIkFxuICAgICAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCB8fCAhdGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZE5vdEluaXQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSGVybyBVcGRhdGVdIElE5pyq55+lLCDmnKrliJ3lp4vljJbmiJZzY2VuZeS4jeWtmOWcqFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZE5vdEluaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNjZW5lICYmICF0aGlzLnNjZW5lLnRpbWVQYXVzZWQgJiYgISh0aGlzLnNjZW5lLmhhc0VuZGVkIHx8IHRoaXMuaHAgPD0gMCB8fCB0aGlzLmhhc0RpZSkpIHtcbiAgICAgICAgICAgIHZhciBlID0gdCAqIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmdldFRpbWVTY2FsZSgpO1xuICAgICAgICAgICAgLy8g5q+P56eS5Y+q5omT5Y2w5LiA5qyh5pel5b+X77yM6YG/5YWN5Yi35bGPXG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdExvZ1RpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RMb2dUaW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RMb2dUaW1lID4gMTAwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gVXBkYXRlXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCBlbmFibGVkOlwiICsgdGhpcy5lbmFibGVkICsgXCIsIOS9jee9rjpcIiArIHRoaXMubm9kZS5wb3NpdGlvbiArIFwiLCDmlYzkurrmlbA6XCIgKyAodGhpcy5zY2VuZS5lbmVteXMgPyB0aGlzLnNjZW5lLmVuZW15cy5sZW5ndGggOiAwKSArIFwiLCBpc01vdmluZzpcIiArIHRoaXMuaXNNb3ZpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdExvZ1RpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTW92ZW1lbnQoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZU1vdmVtZW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmnInmlYzkurrlrZjlnKhcbiAgICAgICAgaWYgKCF0aGlzLnNjZW5lLmVuZW15cyB8fCB0aGlzLnNjZW5lLmVuZW15cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIOayoeacieaVjOS6uuaXtu+8jOi/lOWbnuWIneWni+S9jee9rlxuICAgICAgICAgICAgdGhpcy5yZXR1cm5Ub0luaXRpYWxQb3NpdGlvbih0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5riF55CG5bey5q275Lqh55qE55uu5qCH5byV55SoXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUYXJnZXQgJiYgdGhpcy5jdXJyZW50VGFyZ2V0LmhwIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5riF6Zmk5bey5q275Lqh55qE55uu5qCH5byV55SoXCIpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgIC8vIOWmguaenOS5i+WJjeW3sue7j+WIsOi+vuaUu+WHu+iMg+WbtO+8jOeOsOWcqOebruagh+atu+S6hu+8jOmcgOimgemHjeaWsOW8gOWni+Wvu+aJvuWSjOenu+WKqFxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOmHjee9ruaUu+WHu+iMg+WbtOagh+iusO+8jOWHhuWkh+Wvu+aJvuaWsOebruagh1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5a+75om+5pyA6L+R55qE5pWM5Lq677yI5omA5pyJ6Iux6ZuE6YO956e75Yqo77yM5LiN5Yy65YiG57G75Z6L77yJXG4gICAgICAgIHZhciBlID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCA5OTk5OTkpO1xuICAgICAgICBcbiAgICAgICAgLy8g5re75Yqg6LCD6K+V5pel5b+XXG4gICAgICAgIGlmICghdGhpcy5tb3ZlbWVudERlYnVnQ291bnQpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZW1lbnREZWJ1Z0NvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVtZW50RGVidWdDb3VudCsrO1xuICAgICAgICBcbiAgICAgICAgLy8g5q+PMuenkuaJk+WNsOS4gOasoeiwg+ivleS/oeaBr1xuICAgICAgICBpZiAodGhpcy5tb3ZlbWVudERlYnVnQ291bnQgJSAxMjAgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIOe7n+iuoea0u+edgOeahOaVjOS6uuaVsOmHj1xuICAgICAgICAgICAgdmFyIGFsaXZlRW5lbXlDb3VudCA9IDA7XG4gICAgICAgICAgICB2YXIgZW5lbXlQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjZW5lLmVuZW15cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuZW5lbXlzLmZvckVhY2goZnVuY3Rpb24oZW5lbXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZW15LmhwID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpdmVFbmVteUNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmVteVBvc2l0aW9ucy5wdXNoKFwiKFwiICsgZW5lbXkubm9kZS54LnRvRml4ZWQoMCkgKyBcIixcIiArIGVuZW15Lm5vZGUueS50b0ZpeGVkKDApICsgXCIsSFA6XCIgKyBlbmVteS5ocC50b0ZpeGVkKDApICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdXBkYXRlTW92ZW1lbnRdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg6Iux6ZuE5L2N572uOihcIiArIHRoaXMubm9kZS54LnRvRml4ZWQoMCkgKyBcIixcIiArIHRoaXMubm9kZS55LnRvRml4ZWQoMCkgKyBcIilcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg5om+5Yiw5pWM5Lq6OlwiICsgISFlICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAoZSA/IFwiLCDmlYzkurrkvY3nva46KFwiICsgZS5ub2RlLngudG9GaXhlZCgwKSArIFwiLFwiICsgZS5ub2RlLnkudG9GaXhlZCgwKSArIFwiKSwg5pWM5Lq6SFA6XCIgKyBlLmhwLnRvRml4ZWQoMCkgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg5rS7552A55qE5pWM5Lq6OlwiICsgYWxpdmVFbmVteUNvdW50ICsgXCIvXCIgKyB0aGlzLnNjZW5lLmVuZW15cy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGlzTW92aW5nOlwiICsgdGhpcy5pc01vdmluZyArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgaXNBdHRhY2tpbmc6XCIgKyB0aGlzLmlzQXR0YWNraW5nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBoYXNSZWFjaGVkQXR0YWNrUmFuZ2U6XCIgKyB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhbGl2ZUVuZW15Q291bnQgPiAwICYmIGFsaXZlRW5lbXlDb3VudCA8PSAxMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdXBkYXRlTW92ZW1lbnRdIOWJqeS9meaVjOS6uuS9jee9rjogXCIgKyBlbmVteVBvc2l0aW9ucy5qb2luKFwiLCBcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoZSAmJiBlLmhwID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZTtcbiAgICAgICAgICAgIHZhciBpID0gZS5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCBlLmNlbnRlclkpKTtcbiAgICAgICAgICAgIHZhciBuID0gaS5zdWIodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIHZhciBvID0gbi5sZW5ndGhTcXIoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5q+PMuenkuaJk+WNsOi3neemu+S/oeaBr1xuICAgICAgICAgICAgaWYgKHRoaXMubW92ZW1lbnREZWJ1Z0NvdW50ICUgMTIwID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyB1cGRhdGVNb3ZlbWVudF0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwg6Led5pWM5Lq6OlwiICsgTWF0aC5zcXJ0KG8pLnRvRml4ZWQoMSkgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwg5pS75Ye76IyD5Zu0OlwiICsgTWF0aC5zcXJ0KHRoaXMuYXRrUlIpLnRvRml4ZWQoMSkgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwg5YGc5q2i6Led56a7OlwiICsgTWF0aC5zcXJ0KHRoaXMuYXRrUlIgKiAwLjk4KS50b0ZpeGVkKDEpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwg5piv5ZCm5Zyo6IyD5Zu05YaFOlwiICsgKG8gPD0gdGhpcy5hdGtSUiAqIDAuOTgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5qOA5p+l5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaF77yI5L2/55SoMC45OOeahOezu+aVsO+8jOehruS/neiLsembhOenu+WKqOWIsOehruWunuiDveaUu+WHu+WIsOeahOS9jee9ru+8iVxuICAgICAgICAgICAgLy8g6L+Z5qC35Y+v5Lul6YG/5YWN6L6555WM5oOF5Ya15a+86Ie06Iux6ZuE5YGc5q2i56e75Yqo5L2G5peg5rOV5pS75Ye7XG4gICAgICAgICAgICB2YXIgYXR0YWNrUmFuZ2VCdWZmZXIgPSB0aGlzLmF0a1JSICogMC45ODsgLy8g56iN5b6u5L+d5a6I5LiA54K577yM56Gu5L+d6IO95pS75Ye75YiwXG4gICAgICAgICAgICBpZiAobyA8PSBhdHRhY2tSYW5nZUJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIC8vIOWcqOaUu+WHu+iMg+WbtOWGhe+8jOWBnOatouenu+WKqFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOWIsOi+vuaUu+WHu+iMg+WbtO+8jOWBnOatouenu+WKqFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yqo55S755Sx5pS75Ye757O757uf5o6n5Yi277yM6L+Z6YeM5LiN5YiH5o2iXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDkuI3lnKjmlLvlh7vojIPlm7TlhoXvvIznu6fnu63lkJHmlYzkurrnp7vliqhcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIPCfmrYgSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDlvIDlp4vlkJHmlYzkurrnp7vliqjvvIzlvZPliY3ot53nprs6XCIgKyBNYXRoLnNxcnQobykudG9GaXhlZCgxKSArIFwiLCDnm67moIfkvY3nva46XCIgKyBlLm5vZGUucG9zaXRpb24ueC50b0ZpeGVkKDEpICsgXCIsXCIgKyBlLm5vZGUucG9zaXRpb24ueS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+q5Zyo6Z2e5pS75Ye754q25oCB5pe25YiH5o2i5Li656e75Yqo5Yqo55S7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJXYWxrXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOKaoO+4jyBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOmcgOimgeenu+WKqOS9hui/mOWcqOaUu+WHu+eKtuaAge+8jOS4jeWIh+aNouWKqOeUu1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDorqHnrpfnp7vliqjmlrnlkJHlkoznp7vliqhcbiAgICAgICAgICAgICAgICB2YXIgcyA9IE1hdGguYXRhbjIobi55LCBuLngpO1xuICAgICAgICAgICAgICAgIHZhciBjID0gY2MudjIodGhpcy5tb3ZlU3BlZWQgKiBNYXRoLmNvcyhzKSAqIHQsIHRoaXMubW92ZVNwZWVkICogTWF0aC5zaW4ocykgKiB0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDkvY3nva5cbiAgICAgICAgICAgICAgICB2YXIgb2xkUG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChjKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLXRoaXMubm9kZS55O1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5iYXJOb2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtLmJhck5vZGUucG9zaXRpb24uYWRkKGMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtU3BpbmVQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiwg+ivle+8muaJk+WNsOenu+WKqOS/oeaBr++8iOavjzLnp5LkuIDmrKHvvIlcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGFzdE1vdmVMb2dUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmVMb2dUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG5vd1RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgIGlmIChub3dUaW1lIC0gdGhpcy5sYXN0TW92ZUxvZ1RpbWUgPiAyMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gTW92ZV0g8J+atiBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOato+WcqOenu+WKqO+8jOS9jee9rjpcIiArIHRoaXMubm9kZS5wb3NpdGlvbi54LnRvRml4ZWQoMSkgKyBcIixcIiArIHRoaXMubm9kZS5wb3NpdGlvbi55LnRvRml4ZWQoMSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlTG9nVGltZSA9IG5vd1RpbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOabtOaWsHBvc2l0aW9uMueUqOS6juaVjOS6uueahOaUu+WHu+WIpOaWrVxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24yID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLml0ZW0uYXR0T2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOayoeacieacieaViOaVjOS6uu+8jOi/lOWbnuWIneWni+S9jee9rlxuICAgICAgICAgICAgLy8g5omT5Y2w6K2m5ZGK5L+h5oGv77yM5biu5Yqp6LCD6K+VXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlbWVudERlYnVnQ291bnQgJSAxMjAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWxpdmVDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2NlbmUuZW5lbXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuZW5lbXlzLmZvckVhY2goZnVuY3Rpb24oZW5lbXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmVteS5ocCA+IDApIGFsaXZlQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbGl2ZUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSGVybyB1cGRhdGVNb3ZlbWVudF0g4pqg77iPIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIgY2hvb3NlRW5lbXnov5Tlm55udWxs77yM5L2G5pyJXCIgKyBhbGl2ZUNvdW50ICsgXCLkuKrmtLvnnYDnmoTmlYzkurrvvIFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXR1cm5Ub0luaXRpYWxQb3NpdGlvbih0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSXRlbVNwaW5lUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5aaC5p6c5L2/55SoY2hhcmFjdGVy5pS75Ye757O757uf77yM5LiN6ZyA6KaB5pu05pawaXRlbS5zcGluZeeahOS9jee9rlxuICAgICAgICAvLyDlm6DkuLpjaGFyYWN0ZXIgc3BpbmXmmK9IZXJv6IqC54K555qE5a2Q6IqC54K577yM5Lya6Ieq5Yqo6Lef6ZqP56e75YqoXG4gICAgICAgIGlmICh0aGlzLnVzZUNoYXJhY3RlckF0dGFjaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDljp/mnaXnmoRwbGFudOezu+e7n+mcgOimgeWQjOatpWl0ZW0uc3BpbmXkvY3nva7vvIjkv53nlZnlkJHlkI7lhbzlrrnvvIlcbiAgICAgICAgLy8g5bCGSGVyb+iKgueCueeahOS4lueVjOWdkOagh+i9rOaNouS4uml0ZW0uc3BpbmXniLboioLngrnnmoTmnKzlnLDlnZDmoIdcbiAgICAgICAgaWYgKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUgJiYgdGhpcy5pdGVtLnNwaW5lLm5vZGUpIHtcbiAgICAgICAgICAgIC8vIOiOt+WPlkhlcm/oioLngrnnmoTkuJbnlYzlnZDmoIdcbiAgICAgICAgICAgIHZhciBoZXJvV29ybGRQb3MgPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgLy8g6L2s5o2i5Li6aXRlbS5zcGluZeeItuiKgueCueeahOacrOWcsOWdkOagh1xuICAgICAgICAgICAgdmFyIHNwaW5lTG9jYWxQb3MgPSB0aGlzLml0ZW0uc3BpbmUubm9kZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIoaGVyb1dvcmxkUG9zKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6LCD6K+V77ya6aaW5qyh56e75Yqo5pe25omT5Y2w5pel5b+XXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9nZ2VkU3BpbmVVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOesrOS4gOasoeWQjOatpXNwaW5l5L2N572uIC0gSGVyb+S4lueVjOWdkOaghzpcIiwgaGVyb1dvcmxkUG9zLCBcInNwaW5l5pys5Zyw5Z2Q5qCHOlwiLCBzcGluZUxvY2FsUG9zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFNwaW5lVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pu05pawaXRlbS5zcGluZeeahOS9jee9rlxuICAgICAgICAgICAgdGhpcy5pdGVtLnNwaW5lLm5vZGUucG9zaXRpb24gPSBzcGluZUxvY2FsUG9zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZFNwaW5lRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0hlcm9dIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5peg5rOV5ZCM5q2lc3BpbmXkvY3nva7vvIFpdGVtOlwiLCAhIXRoaXMuaXRlbSwgXCJzcGluZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSksIFwic3BpbmUubm9kZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSAmJiB0aGlzLml0ZW0uc3BpbmUubm9kZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkU3BpbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJldHVyblRvSW5pdGlhbFBvc2l0aW9uOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZGlzdFNxciA9IHRoaXMubm9kZS5wb3NpdGlvbi5zdWIodGhpcy5pbml0aWFsUG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICBpZiAoZGlzdFNxciA+IDEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIldhbGtcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5pbml0aWFsUG9zaXRpb24uc3ViKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB2YXIgciA9IE1hdGguYXRhbjIoYS55LCBhLngpO1xuICAgICAgICAgICAgdmFyIGggPSBjYy52Mih0aGlzLm1vdmVTcGVlZCAqIE1hdGguY29zKHIpICogdCwgdGhpcy5tb3ZlU3BlZWQgKiBNYXRoLnNpbihyKSAqIHQpO1xuICAgICAgICAgICAgaWYgKGgubGVuZ3RoU3FyKCkgPiBhLmxlbmd0aFNxcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5pbml0aWFsUG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZS56SW5kZXggPSAtdGhpcy5ub2RlLnk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOOAkOWFs+mUruOAkeWQjOatpeabtOaWsGl0ZW0uc3BpbmXnmoTmmL7npLrkvY3nva5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbVNwaW5lUG9zaXRpb24oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbjIgPSB0aGlzLm5vZGUucG9zaXRpb24uYWRkKHRoaXMuaXRlbS5hdHRPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8g6L+U5Zue5Yid5aeL5L2N572u5ZCO77yM5oGi5aSNaXRlbS5zcGluZeWIsOWIneWni+S9jee9rlxuICAgICAgICAgICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS4jemcgOimgeaBouWkjWl0ZW0uc3BpbmXkvY3nva5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlQ2hhcmFjdGVyQXR0YWNrICYmIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnNwaW5lICYmIHRoaXMuaXRlbS5zcGluZS5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5zcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtU3BpbmVJbml0aWFsUG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTsiXX0=