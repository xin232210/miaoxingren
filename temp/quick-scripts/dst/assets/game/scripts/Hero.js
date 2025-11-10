
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

    var isSameSpine = this.itemSpineOriginal === characterSpine; // 【关键】保存character spine在被移动到Hero节点之前，在Item节点下的位置
    // 这个位置将用于一波结束后恢复spine到正确位置

    if (characterSpine && characterSpine.node && characterSpine.node.parent === e.node) {
      this.characterSpineInitialPos = characterSpine.node.position.clone();
      console.log("[Hero] 保存character spine在Item节点下的初始位置:", this.characterSpineInitialPos);
    } // 将item.spine指向character spine，这样Item组件能正常工作


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSGVyby5qcyJdLCJuYW1lcyI6WyIkYnVsbGV0IiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiemQiLCJ6ZDIiLCJsYW5kTWluZU5vZGUiLCJOb2RlIiwib25Mb2FkIiwibm9kZSIsImFjdGl2ZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJlbmFibGVkIiwic3RhcnQiLCJpbml0QnkiLCJ0IiwiaSIsImNoYXJhY3RlclNwaW5lIiwibiIsInNjZW5lIiwiaW5mbyIsIml0ZW0iLCJpdGVtU3BpbmVPcmlnaW5hbCIsImlzU2FtZVNwaW5lIiwicGFyZW50IiwiY2hhcmFjdGVyU3BpbmVJbml0aWFsUG9zIiwicG9zaXRpb24iLCJjbG9uZSIsImxvZyIsIml0ZW1TcGluZUluaXRpYWxQb3MiLCJpZCIsIm8iLCJqc29uIiwicmFuZ2UiLCJhdGtSUiIsImx2cyIsImhwIiwibWF4SHAiLCJzaGllbGRWYWx1ZSIsImhhc0RpZSIsInNldEFuaW1hdGlvbiIsInNldHVwQW5pbWF0aW9uRXZlbnRzIiwiaXNQaHkiLCJpc01hZ2ljIiwiaXMzZ3oiLCJzb21lIiwiaXMyZ3oiLCJidXRsZXIiLCJvbiIsIm9uTHZ1cCIsImluaXRpYWxQb3NpdGlvbiIsIm1vdmVTcGVlZCIsImN1cnJlbnRUYXJnZXQiLCJpc01vdmluZyIsImhhc1JlYWNoZWRBdHRhY2tSYW5nZSIsImlzSW5pdGlhbGl6ZWQiLCJpc0F0dGFja2luZyIsImN1cnJlbnRBdHRhY2tUYXJnZXQiLCJpbkNvb2xEb3duIiwidXNlQ2hhcmFjdGVyQXR0YWNrIiwiZGVmYXVsdFNraW4iLCJNYXRoIiwic3FydCIsInNjYWxlIiwib3BhY2l0eSIsImluZGV4IiwibHZ1cCIsImh1YiIsInNob3dMdnVwRWZmZWN0IiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwiVmVjMiIsIlpFUk8iLCJzZXRFdmVudExpc3RlbmVyIiwidHJhY2tFbnRyeSIsImV2ZW50IiwiZGF0YSIsIm5hbWUiLCJvbkFuaW1hdGlvbkF0dGFja0V2ZW50IiwidGFyZ2V0IiwiY2hvb3NlRW5lbXkiLCJkYW1hZ2UiLCJnZXRBdGsiLCJsdiIsImRlYWxEYW1hZ2VUb0VuZW15IiwiZW5lbXkiLCJjaGVja0J1ZmYiLCJjcml0VHlwZSIsImNoZWNrQ3JpdCIsImdldENyaXRQbHVzIiwibWF0aCIsInJhbmRvbVJhbmdlIiwiZmxvb3IiLCJodXJ0QnkiLCJzaG93RW5lbXlIdXJ0TnVtIiwic2hvd0pzRWZmZWN0IiwicHZ6IiwicnVudGltZURhdGEiLCJzdGF0cyIsInJhbmRvbSIsImFkZEJ1ZmZXZWFrIiwicmVwdWxzZSIsImFuaW1OYW1lIiwiYW5pbU1hcCIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJtaW4iLCJsdjEiLCJhdHRyaWJ1dGUyIiwibGVuZ3RoIiwiZmlnaHRsdnVwMiIsImdldEJ1ZmZWYWx1ZSIsIml0ZW1zIiwiZ2V0U2hpZWxkIiwicHVzaEx2QW5kQXRrIiwicHVzaCIsImF0ayIsInBsYXlBdHRBbmREbyIsImNoZWNrVG9TdGFydFJlbG9hZFRpbWVyIiwicGxheVNvdW5kIiwicGxheUVmZmVjdEFzeW5jIiwidHJ5U2hvb3QiLCJ0cnlTaG9vdENhbGxDb3VudCIsImF0dGFja1JhbmdlQnVmZmVyIiwidGFyZ2V0UG9zIiwiYWRkIiwidjIiLCJjZW50ZXJZIiwiZGlzdFNxciIsInN1YiIsImxlbmd0aFNxciIsInRvRml4ZWQiLCJsb2dnZWROb1RhcmdldCIsImF0dGFja0ZhaWxDb3VudCIsImF0dGFja0FuaW0iLCJhdHRhY2tEZWxheSIsImluZGV4T2YiLCJjZFRpbWUiLCJjZE1zIiwic2V0VGltZW91dCIsIm5lZWRUYXJnZXRDaGVjayIsIm5lYXJUYXJnZXQiLCJkaXN0YW5jZSIsInIiLCJpc1ZhbGlkIiwiY2hlY2tUb1Nob290IiwiYnVsbGV0Q291bnQiLCJJS0JvbmUiLCJ0d2VlbiIsInRvIiwieCIsInkiLCJmaW5kQm9uZSIsImhhc0VuYWJsZUJ1ZmYiLCJjcm9zc0l0ZW1zIiwiZm9yRWFjaCIsImhlcm8iLCJhZGRTaGllbGQiLCJzaG93QnVmZkVmZmVjdCIsImNob29zZU1pbkhwSGVybyIsImFkZEhwIiwiZ2V0QW5nZXJCYXJXUG9zIiwiYW5nZXIiLCJ1cGRhdGVBbmdlciIsImxhc3RCdWxsZXRDb3VudCIsImluc3RhbnRpYXRlIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsImdyb3VuZEFyZWFMQiIsImdyb3VuZEFyZWFUUiIsIm9ianNSb290IiwiekluZGV4IiwiZ2V0Q29tcG9uZW50IiwiQ29sbGlkZXIiLCJzIiwibWF4IiwiY2hvb3NlRW5lbXlzIiwiYyIsImEiLCJoIiwiYnVsbGV0c1Jvb3QiLCJkZWZhdWx0QW5pbWF0aW9uIiwiZCIsInUiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsImF0dCIsInAiLCJsIiwic2hpZnQiLCJzaG9vdCIsImJpbmQiLCJnZXRTaG9vdEFQb3MiLCJIYW5kQm9uZSIsIndvcmxkWCIsIndvcmxkWSIsIkdQQm9uZSIsInNob290TiIsInNob290SUsiLCJzaG9vdDEiLCJhdGFuMiIsImhpdENvdW50IiwibW9kZSIsIm1vdmVCeUFuZ2xlIiwiUEkiLCJjb2xsaWRlciIsInJhZGl1cyIsInNldFRyYWNrRXZlbnRMaXN0ZW5lciIsImNoZWNrSGVyb0J1ZmYiLCJkb0J1bGxldEF0dExvZ2ljIiwid2Vha05vZGUiLCJhY3RCdWZmMSIsImpzRWZmRXhjbHVzaXZlIiwiYnVmZlNsb3ciLCJhZGRCdWZmU2xvdyIsImJ1ZmZJY2UiLCJhZGRCdWZmSWNlIiwiYXR0Q291bnRlciIsImRvTGFuZE1pbmVzTG9naWMiLCJvbkxhbmRtaW5lc0NvbGxpc2lvbiIsImZpbmQiLCJ1dGlscyIsIm1hbnVhbGx5Q2hlY2tDb2xsaWRlciIsImRlc3Ryb3kiLCJ1cGRhdGVIcCIsImRlbEhwIiwidXBkYXRlU2hpZWxkIiwiaGFzRW5kZWQiLCJoYXNVc2VSZWJvcm4iLCJoYXNIZXJvIiwiYmFyTm9kZSIsInJlYm9ybiIsImNoZWNrSXNGYWlsIiwiYWRkQnVmZlByZWZhYiIsImFkZE5vZGVUbyIsInVwZGF0ZSIsImxvZ2dlZE5vdEluaXQiLCJ3YXJuIiwidGltZVBhdXNlZCIsImRpcmVjdG9yIiwiZ2V0U2NoZWR1bGVyIiwiZ2V0VGltZVNjYWxlIiwibGFzdExvZ1RpbWUiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJub3ciLCJlbmVteXMiLCJ1cGRhdGVNb3ZlbWVudCIsInJldHVyblRvSW5pdGlhbFBvc2l0aW9uIiwibW92ZW1lbnREZWJ1Z0NvdW50IiwiYWxpdmVFbmVteUNvdW50IiwiZW5lbXlQb3NpdGlvbnMiLCJqb2luIiwiY29zIiwic2luIiwib2xkUG9zIiwidXBkYXRlSXRlbVNwaW5lUG9zaXRpb24iLCJsYXN0TW92ZUxvZ1RpbWUiLCJub3dUaW1lIiwicG9zaXRpb24yIiwiYXR0T2Zmc2V0IiwiYWxpdmVDb3VudCIsImhlcm9Xb3JsZFBvcyIsInNwaW5lTG9jYWxQb3MiLCJsb2dnZWRTcGluZVVwZGF0ZSIsImxvZ2dlZFNwaW5lRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFyQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUMsRUFBRSxDQUFDQyxRQURGO0lBRVJDLEVBQUUsRUFBRVQsT0FGSTtJQUdSVSxHQUFHLEVBQUVWLE9BSEc7SUFJUlcsWUFBWSxFQUFFVCxFQUFFLENBQUNVO0VBSlQsQ0FGUDtFQVFMQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsSUFBSTtNQUNBLElBQUksS0FBS0osRUFBTCxJQUFXLEtBQUtBLEVBQUwsQ0FBUUssSUFBdkIsRUFBNkI7UUFDekIsS0FBS0wsRUFBTCxDQUFRSyxJQUFSLENBQWFDLE1BQWIsR0FBc0IsQ0FBQyxDQUF2QjtNQUNIOztNQUNELElBQUksS0FBS0wsR0FBTCxJQUFZLEtBQUtBLEdBQUws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c291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJGJ1bGxldCA9IHJlcXVpcmUoXCIuL0J1bGxldFwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIHpkOiAkYnVsbGV0LFxuICAgICAgICB6ZDI6ICRidWxsZXQsXG4gICAgICAgIGxhbmRNaW5lTm9kZTogY2MuTm9kZVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy56ZCAmJiB0aGlzLnpkLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpkLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy56ZDIgJiYgdGhpcy56ZDIubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuemQyLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5sYW5kTWluZU5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhbmRNaW5lTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvIG9uTG9hZF0g5Yid5aeL5YyW57uE5Lu25aSx6LSlOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlkK/nlKh1cGRhdGXmlrnms5Xku6XmlK/mjIHnp7vliqjpgLvovpFcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uICh0LCBlLCBpLCBjaGFyYWN0ZXJTcGluZSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2NlbmUgPSB0O1xuICAgICAgICB0aGlzLmluZm8gPSBpO1xuICAgICAgICB0aGlzLml0ZW0gPSBlO1xuICAgICAgICBcbiAgICAgICAgLy8g5L2/55So5Lyg5YWl55qEY2hhcmFjdGVyIHNwaW5l5L2c5Li65pi+56S6c3BpbmVcbiAgICAgICAgdGhpcy5zcGluZSA9IGNoYXJhY3RlclNwaW5lO1xuICAgICAgICB0aGlzLmNoYXJhY3RlclNwaW5lID0gY2hhcmFjdGVyU3BpbmU7XG4gICAgICAgIFxuICAgICAgICAvLyDkv53lrZjljp/mnaXnmoRpdGVtLnNwaW5l5byV55SoXG4gICAgICAgIHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwgPSB0aGlzLml0ZW0uc3BpbmU7XG4gICAgICAgIFxuICAgICAgICAvLyDmo4Dmn6Xljp/lp4tzcGluZeWSjGNoYXJhY3RlciBzcGluZeaYr+WQpuaYr+WQjOS4gOS4quWvueixoVxuICAgICAgICB2YXIgaXNTYW1lU3BpbmUgPSAodGhpcy5pdGVtU3BpbmVPcmlnaW5hbCA9PT0gY2hhcmFjdGVyU3BpbmUpO1xuICAgICAgICBcbiAgICAgICAgLy8g44CQ5YWz6ZSu44CR5L+d5a2YY2hhcmFjdGVyIHNwaW5l5Zyo6KKr56e75Yqo5YiwSGVyb+iKgueCueS5i+WJje+8jOWcqEl0ZW3oioLngrnkuIvnmoTkvY3nva5cbiAgICAgICAgLy8g6L+Z5Liq5L2N572u5bCG55So5LqO5LiA5rOi57uT5p2f5ZCO5oGi5aSNc3BpbmXliLDmraPnoa7kvY3nva5cbiAgICAgICAgaWYgKGNoYXJhY3RlclNwaW5lICYmIGNoYXJhY3RlclNwaW5lLm5vZGUgJiYgY2hhcmFjdGVyU3BpbmUubm9kZS5wYXJlbnQgPT09IGUubm9kZSkge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJTcGluZUluaXRpYWxQb3MgPSBjaGFyYWN0ZXJTcGluZS5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDkv53lrZhjaGFyYWN0ZXIgc3BpbmXlnKhJdGVt6IqC54K55LiL55qE5Yid5aeL5L2N572uOlwiLCB0aGlzLmNoYXJhY3RlclNwaW5lSW5pdGlhbFBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWwhml0ZW0uc3BpbmXmjIflkJFjaGFyYWN0ZXIgc3BpbmXvvIzov5nmoLdJdGVt57uE5Lu26IO95q2j5bi45bel5L2cXG4gICAgICAgIHRoaXMuaXRlbS5zcGluZSA9IGNoYXJhY3RlclNwaW5lO1xuICAgICAgICBcbiAgICAgICAgLy8g5L+d5a2YaXRlbS5zcGluZeiKgueCueeahOWIneWni+S9jee9ru+8iOWmguaenOWtmOWcqO+8iVxuICAgICAgICBpZiAodGhpcy5pdGVtU3BpbmVPcmlnaW5hbCAmJiB0aGlzLml0ZW1TcGluZU9yaWdpbmFsLm5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbVNwaW5lSW5pdGlhbFBvcyA9IHRoaXMuaXRlbVNwaW5lT3JpZ2luYWwubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlj6rmnInlvZPljp/lp4tzcGluZeWSjGNoYXJhY3RlciBzcGluZeS4jeaYr+WQjOS4gOS4quWvueixoeaXtu+8jOaJjemakOiXj+WOn+Wni3NwaW5lXG4gICAgICAgICAgICAvLyDlpoLmnpzmmK/lkIzkuIDkuKrvvIzor7TmmI7nlKjmiLflnKjnvJbovpHlmajkuK3lt7Lnu4/phY3nva7kuoZjaGFyYWN0ZXIgc3BpbmXvvIzkuI3lupTor6XpmpDol4/lroNcbiAgICAgICAgICAgIGlmICghaXNTYW1lU3BpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDpmpDol4/ljp/lp4twbGFudCBzcGluZe+8jElEOlwiICsgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1TcGluZU9yaWdpbmFsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOS9v+eUqOe8lui+keWZqOmFjee9rueahHNwaW5l77yM5LiN6ZqQ6JeP77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDnoa7kv53lvZPliY3kvb/nlKjnmoRzcGluZeaYr+WPr+ingeeahFxuICAgICAgICBpZiAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g56Gu5L+dc3BpbmXlj6/op4HvvIxJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCBhY3RpdmU6XCIgKyB0aGlzLnNwaW5lLm5vZGUuYWN0aXZlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIG8gPSB0aGlzLmluZm8uanNvbi5yYW5nZTtcbiAgICAgICAgdGhpcy5hdGtSUiA9IG8gKiBvO1xuICAgICAgICB0aGlzLmx2cyA9IFtdO1xuICAgICAgICB0aGlzLmhwID0gdGhpcy5pdGVtLm1heEhwO1xuICAgICAgICB0aGlzLnNoaWVsZFZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5oYXNEaWUgPSAhMTtcbiAgICAgICAgXG4gICAgICAgIC8vIOiuvue9ruinkuiJsuWKqOeUu+WSjOS6i+S7tuebkeWQrFxuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICB0aGlzLnNldHVwQW5pbWF0aW9uRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmlzUGh5ID0gITA7XG4gICAgICAgIHRoaXMuaXNNYWdpYyA9ICEwO1xuICAgICAgICB0aGlzLmlzM2d6ID0gWzIsIDUsIDksIDEwXS5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCA9PSBuLml0ZW0uaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlzMmd6ID0gWzIsIDQsIDhdLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09IG4uaXRlbS5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGNjLmJ1dGxlci5ub2RlLm9uKFwibHZ1cFwiLCB0aGlzLm9uTHZ1cCwgdGhpcyk7XG4gICAgICAgIFxuICAgICAgICAvLyDnp7vliqjnm7jlhbPnmoTliJ3lp4vljJZcbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSB0aGlzLm5vZGUucG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgdGhpcy5tb3ZlU3BlZWQgPSAyMDsgLy8g6Iux6ZuE56e75Yqo6YCf5bqmXG4gICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOaUu+WHu+eKtuaAgeWIneWni+WMllxuICAgICAgICB0aGlzLmlzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudEF0dGFja1RhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXRlbS5pbkNvb2xEb3duID0gZmFsc2U7IC8vIOehruS/neWGt+WNtOeKtuaAgeiiq+ato+ehruWIneWni+WMllxuICAgICAgICBcbiAgICAgICAgLy8g5LiN5YaN6ZyA6KaB5a2Q5by557O757uf77yM5pS75Ye76YCa6L+H5Yqo55S75LqL5Lu26Kem5Y+RXG4gICAgICAgIHRoaXMudXNlQ2hhcmFjdGVyQXR0YWNrID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOaUu+WHu+eKtuaAgeWIneWni+WMlu+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGlzQXR0YWNraW5nOlwiICsgdGhpcy5pc0F0dGFja2luZyArIFwiLCBpbkNvb2xEb3duOlwiICsgdGhpcy5pdGVtLmluQ29vbERvd24pO1xuICAgICAgICBcbiAgICAgICAgLy8g5YWz6ZSu77ya56Gu5L+dSGVyb+e7hOS7tuWcqOWIneWni+WMluWQjuWQr+eUqO+8jOS7peS+v3VwZGF0ZeaWueazleiDveiiq+iwg+eUqFxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgLy8g6LCD6K+V5pel5b+X77yM56Gu6K6k5Yid5aeL5YyW5a6M5oiQXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIGluaXRCeeWujOaIkO+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGVuYWJsZWQ6XCIgKyB0aGlzLmVuYWJsZWQgKyBcIiwgc3BpbmU6XCIgKyAodGhpcy5zcGluZSA/IHRoaXMuc3BpbmUuZGVmYXVsdFNraW4gOiBcIm51bGxcIikgKyBcIiwg5pS75Ye76IyD5Zu0OlwiICsgTWF0aC5zcXJ0KHRoaXMuYXRrUlIpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gc3BpbmXoioLngrnkv6Hmga8gLSBhY3RpdmU6XCIgKyAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUgPyB0aGlzLnNwaW5lLm5vZGUuYWN0aXZlIDogXCJudWxsXCIpICsgXG4gICAgICAgICAgICAgICAgICAgIFwiLCDkvY3nva46XCIgKyAodGhpcy5zcGluZSAmJiB0aGlzLnNwaW5lLm5vZGUgPyB0aGlzLnNwaW5lLm5vZGUucG9zaXRpb24gOiBcIm51bGxcIikgKyBcbiAgICAgICAgICAgICAgICAgICAgXCIsIOe8qeaUvjpcIiArICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5zY2FsZSA6IFwibnVsbFwiKSArIFxuICAgICAgICAgICAgICAgICAgICBcIiwg5LiN6YCP5piO5bqmOlwiICsgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5ub2RlID8gdGhpcy5zcGluZS5ub2RlLm9wYWNpdHkgOiBcIm51bGxcIikpO1xuICAgIH0sXG4gICAgb25MdnVwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5pdGVtLmluZGV4ID09IHQpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbS5sdnVwKCExKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuaHViLnNob3dMdnVwRWZmZWN0KHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldHVwQW5pbWF0aW9uRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgLy8g55uR5ZCsU3BpbmXliqjnlLvkuovku7bvvIzlnKjmlLvlh7vliqjnlLvnmoTlhbPplK7luKfop6blj5HkvKTlrrPliKTlrppcbiAgICAgICAgaWYgKHRoaXMuc3BpbmUgJiYgdGhpcy5zcGluZS5zZXRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW5lLnNldEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKHRyYWNrRW50cnksIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8g5b2T5Yqo55S75LqL5Lu25ZCN5Li6XCJhdHRhY2tcIuaIllwiaGl0XCLml7bvvIzmiafooYzmlLvlh7vpgLvovpFcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZGF0YS5uYW1lID09PSBcImF0dGFja1wiIHx8IGV2ZW50LmRhdGEubmFtZSA9PT0gXCJoaXRcIikge1xuICAgICAgICAgICAgICAgICAgICBuLm9uQW5pbWF0aW9uQXR0YWNrRXZlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25BbmltYXRpb25BdHRhY2tFdmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDlnKjliqjnlLvkuovku7bop6blj5Hml7bov5vooYzkvKTlrrPliKTlrppcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmhwID4gMCkge1xuICAgICAgICAgICAgdmFyIGRhbWFnZSA9IHRoaXMuZ2V0QXRrKHRoaXMuaXRlbS5sdik7XG4gICAgICAgICAgICB0aGlzLmRlYWxEYW1hZ2VUb0VuZW15KHRhcmdldCwgZGFtYWdlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVhbERhbWFnZVRvRW5lbXk6IGZ1bmN0aW9uIChlbmVteSwgZGFtYWdlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gZGVhbERhbWFnZVRvRW5lbXldIOW8gOWni+iuoeeul++8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIOWOn+Wni+S8pOWuszpcIiArIGRhbWFnZSArIFwiLCDmlYzkurpIUDpcIiArIGVuZW15LmhwKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOW6lOeUqOWQhOenjeWinuebiuaViOaenFxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDQpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAxKSkge1xuICAgICAgICAgICAgZGFtYWdlICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDEpKSB7XG4gICAgICAgICAgICBkYW1hZ2UgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTIwMSkpIHtcbiAgICAgICAgICAgIGRhbWFnZSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDmo4Dmn6XmmrTlh7tcbiAgICAgICAgdmFyIGNyaXRUeXBlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDcml0KHt9LCBlbmVteSkpIHtcbiAgICAgICAgICAgIGNyaXRUeXBlID0gMTtcbiAgICAgICAgICAgIGRhbWFnZSAqPSB0aGlzLmdldENyaXRQbHVzKHt9LCBlbmVteSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDmmrTlh7vvvIHkvKTlrrM6XCIgKyBkYW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDpmo/mnLrmta7liqhcbiAgICAgICAgZGFtYWdlICo9IGNjLm1hdGgucmFuZG9tUmFuZ2UoMC45NSwgMS4wNSk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIGRlYWxEYW1hZ2VUb0VuZW15XSDmnIDnu4jkvKTlrrM6XCIgKyBNYXRoLmZsb29yKGRhbWFnZSkgKyBcIiwg5pq05Ye7OlwiICsgKGNyaXRUeXBlID09PSAxKSk7XG4gICAgICAgIFxuICAgICAgICAvLyDpgKDmiJDkvKTlrrNcbiAgICAgICAgZW5lbXkuaHVydEJ5KHRoaXMsIGRhbWFnZSk7XG4gICAgICAgIFxuICAgICAgICAvLyDmmL7npLrkvKTlrrPmlbDlrZdcbiAgICAgICAgdGhpcy5zY2VuZS5zaG93RW5lbXlIdXJ0TnVtKGNyaXRUeXBlLCBlbmVteS5ub2RlLnBvc2l0aW9uLCBkYW1hZ2UpO1xuICAgICAgICBcbiAgICAgICAgLy8g5pi+56S65Ye75Lit54m55pWI77yI5LuF5Zyo6Z2eY2hhcmFjdGVy5pS75Ye757O757uf5pe25pi+56S6cGxhbnTnibnmlYjvvIlcbiAgICAgICAgLy8gY2hhcmFjdGVy57O757uf5L2/55So5Yqo55S76Ieq5bim55qE54m55pWIXG4gICAgICAgIGlmICghdGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGVuZW15Lm5vZGUucG9zaXRpb24sIHRoaXMuaW5mby5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOe7n+iuoeS8pOWus1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdGhpcy5pbmZvLmlkXSArPSBkYW1hZ2U7XG4gICAgICAgIFxuICAgICAgICAvLyDlupTnlKjlkITnp41kZWJ1ZmbmlYjmnpxcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwNCkgJiYgTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICAgICAgZW5lbXkuYWRkQnVmZldlYWsoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjA0KSkge1xuICAgICAgICAgICAgZW5lbXkucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDMpKSB7XG4gICAgICAgICAgICBlbmVteS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDIpKSB7XG4gICAgICAgICAgICBlbmVteS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gZGVhbERhbWFnZVRvRW5lbXldIOWujOaIkO+8jOaVjOS6uuWJqeS9mUhQOlwiICsgZW5lbXkuaHApO1xuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uOiBmdW5jdGlvbiAodCwgZSwgaSwgbikge1xuICAgICAgICAvLyB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbih0LCBlICsgKHRoaXMuaXRlbS5sdiArIDEpLCBpKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5zcGluZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvIHNldEFuaW1hdGlvbl0gc3BpbmXkuLrnqbrvvIFJRDpcIiArICh0aGlzLmluZm8gPyB0aGlzLmluZm8uaWQgOiBcInVua25vd25cIikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDlpoLmnpzkvb/nlKhjaGFyYWN0ZXIgc3BpbmXvvIzpnIDopoHmmKDlsITliqjnlLvlkI3np7BcbiAgICAgICAgdmFyIGFuaW1OYW1lID0gZTtcbiAgICAgICAgaWYgKHRoaXMuY2hhcmFjdGVyU3BpbmUgJiYgdGhpcy5zcGluZSA9PT0gdGhpcy5jaGFyYWN0ZXJTcGluZSkge1xuICAgICAgICAgICAgLy8g5Yqo55S75ZCN56ew5pig5bCE77yacGxhbnTliqjnlLsgLT4gY2hhcmFjdGVy5Yqo55S7XG4gICAgICAgICAgICB2YXIgYW5pbU1hcCA9IHtcbiAgICAgICAgICAgICAgICBcIklkbGVcIjogXCJJZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJIaXRcIjogXCJIaXRcIixcbiAgICAgICAgICAgICAgICBcIkRlYWRcIjogXCJEZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJXYWxrXCI6IFwiV2Fsa1wiLFxuICAgICAgICAgICAgICAgIFwiZnVodW9cIjogXCJJZGxlXCIgIC8vIOWkjea0u+WKqOeUu+aaguaXtuaYoOWwhOS4uklkbGXvvIxjaGFyYWN0ZXLkuK3msqHmnIlmdWh1b1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFuaW1OYW1lID0gYW5pbU1hcFtlXSB8fCBlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHNldEFuaW1hdGlvbl0gSUQ6XCIgKyAodGhpcy5pbmZvID8gdGhpcy5pbmZvLmlkIDogXCJ1bmtub3duXCIpICsgXCIsIOWKqOeUuzpcIiArIGFuaW1OYW1lICsgXCIsIHNwaW5l6IqC54K5YWN0aXZlOlwiICsgKHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgOiBcIm51bGxcIikpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24odCwgYW5pbU5hbWUsIGkpO1xuICAgICAgICB0aGlzLnNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobik7XG4gICAgfSxcbiAgICBnZXRBdGs6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gTWF0aC5taW4odGhpcy5pbmZvLmx2MSwgdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMi5sZW5ndGggLSAxKTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyW2VdO1xuICAgICAgICBpZiAodCA+IDApIHtcbiAgICAgICAgICAgIGkgKj0gdGhpcy5pbmZvLmpzb24uZmlnaHRsdnVwMlt0IC0gMV0gLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDIpO1xuICAgICAgICB2YXIgbyA9IGNjLnB2ei5ydW50aW1lRGF0YS5nZXRCdWZmVmFsdWUoMTApO1xuICAgICAgICBpZiAobyA+IDApIHtcbiAgICAgICAgICAgIG4gKz0gbyAqIGNjLnB2ei5ydW50aW1lRGF0YS5pdGVtcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICBpICo9IDEgKyAwLjAxICogbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIGdldFNoaWVsZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSBNYXRoLm1pbih0aGlzLmluZm8ubHYxLCB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyLmxlbmd0aCAtIDEpO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTJbZV07XG4gICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgaSAqPSB0aGlzLmluZm8uanNvbi5maWdodGx2dXAyW3QgLSAxXSAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIHB1c2hMdkFuZEF0azogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmdldEF0ayh0Lmx2KTtcbiAgICAgICAgdGhpcy5sdnMucHVzaCh7XG4gICAgICAgICAgICBsdjogdC5sdixcbiAgICAgICAgICAgIGF0azogZVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHBsYXlBdHRBbmREbzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzO1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIkhpdFwiLCAhMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaS5pdGVtLmNoZWNrVG9TdGFydFJlbG9hZFRpbWVyKCk7XG4gICAgICAgICAgICBpLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNwaW5lLnNldEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICB0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcGxheVNvdW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZHVuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvaHBcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9qaWd1YW5nXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2dldFN1blNoaW5lXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3Nob290XCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB0cnlTaG9vdDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy8g5re75Yqg6LCD6K+V6K6h5pWw5ZmoXG4gICAgICAgIGlmICghdGhpcy50cnlTaG9vdENhbGxDb3VudCkge1xuICAgICAgICAgICAgdGhpcy50cnlTaG9vdENhbGxDb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cnlTaG9vdENhbGxDb3VudCsrO1xuICAgICAgICBcbiAgICAgICAgLy8g5q+PMTDmrKHosIPnlKjmiZPljbDkuIDmrKHvvIzpgb/lhY3liLflsY9cbiAgICAgICAgaWYgKHRoaXMudHJ5U2hvb3RDYWxsQ291bnQgJSAxMCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyB0cnlTaG9vdF0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDooqvosIPnlKjvvIzmrKHmlbA6XCIgKyB0aGlzLnRyeVNob290Q2FsbENvdW50ICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgdXNlQ2hhcmFjdGVyQXR0YWNrOlwiICsgdGhpcy51c2VDaGFyYWN0ZXJBdHRhY2sgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBpc0F0dGFja2luZzpcIiArIHRoaXMuaXNBdHRhY2tpbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGluQ29vbERvd246XCIgKyB0aGlzLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOebtOaOpeaSreaUvuaUu+WHu+WKqOeUu1xuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIC8vIOS8mOWFiOS9v+eUqHVwZGF0ZU1vdmVtZW505bey57uP5om+5Yiw55qE55uu5qCH77yM56Gu5L+d6Led56a76K6h566X5LiA6Ie05oCnXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZSB8fCB0aGlzLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieW9k+WJjeebruagh++8jOWwneivleafpeaJvlxuICAgICAgICAgICAgaWYgKCF0YXJnZXQgfHwgdGFyZ2V0LmhwIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmnInmlYzkurrlnKjmlLvlh7vojIPlm7TlhoXvvIjkvb/nlKjnqI3lpKfnmoTojIPlm7Tpgb/lhY3ovrnnlYzpl67popjvvIlcbiAgICAgICAgICAgICAgICB2YXIgYXR0YWNrUmFuZ2VCdWZmZXIgPSB0aGlzLmF0a1JSICogMS4wNTsgLy8g5aKe5YqgNSXnmoTlrrnlt65cbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIGF0dGFja1JhbmdlQnVmZmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ55uu5qCH77yM6aqM6K+B6Led56a777yI5L2/55So5LiOdXBkYXRlTW92ZW1lbnTnm7jlkIznmoTorqHnrpfmlrnlvI/vvIlcbiAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmhwID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRQb3MgPSB0YXJnZXQubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgdGFyZ2V0LmNlbnRlclkpKTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdFNxciA9IHRhcmdldFBvcy5zdWIodGhpcy5ub2RlLnBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgYXR0YWNrUmFuZ2VCdWZmZXIgPSB0aGlzLmF0a1JSICogMS4wNTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpznm67moIfkuI3lnKjmlLvlh7vojIPlm7TlhoXvvIzmuIXpmaTnm67moIdcbiAgICAgICAgICAgICAgICBpZiAoZGlzdFNxciA+IGF0dGFja1JhbmdlQnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyeVNob290Q2FsbENvdW50ICUgMzAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdHJ5U2hvb3RdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg55uu5qCH6Led56a7OlwiICsgTWF0aC5zcXJ0KGRpc3RTcXIpLnRvRml4ZWQoMSkgKyBcIiA+IOaUu+WHu+iMg+WbtDpcIiArIE1hdGguc3FydChhdHRhY2tSYW5nZUJ1ZmZlcikudG9GaXhlZCgxKSArIFwi77yM5riF6Zmk55uu5qCHXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXRhcmdldCB8fCB0YXJnZXQuaHAgPD0gMCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5sb2dnZWROb1RhcmdldCB8fCB0aGlzLnRyeVNob290Q2FsbENvdW50ICUgMzAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyB0cnlTaG9vdF0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDmsqHmnInmib7liLDmlLvlh7vnm67moIfvvIzmlLvlh7vojIPlm7Q6XCIgKyBNYXRoLnNxcnQodGhpcy5hdGtSUikudG9GaXhlZCgxKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkTm9UYXJnZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDnoa7kv53ph43nva7mlLvlh7vnirbmgIHvvIzpgb/lhY3ljaHkvY9cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOayoeacieebruagh++8jOmHjee9ruaUu+WHu+eKtuaAgVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0F0dGFja2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDlhbPplK7kv67lpI3vvJrlpoLmnpzkuYvliY3orqTkuLrliLDovr7kuobmlLvlh7vojIPlm7TvvIzkvYbnjrDlnKjmib7kuI3liLDnm67moIfvvIzor7TmmI7liKTmlq3mnInor6/vvIzpnIDopoHph43nva7orqnoi7Hpm4Tnu6fnu63np7vliqhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aKe5Yqg5aSx6LSl6K6h5pWw5ZmoXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5hdHRhY2tGYWlsQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNrRmFpbENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFja0ZhaWxDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c6L+e57ut5aSa5qyh5om+5LiN5Yiw55uu5qCH77yM6YeN572u5pS75Ye76IyD5Zu05qCH6K6w77yM6K6p6Iux6ZuE57un57ut5ZCR5pWM5Lq656e75YqoXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dGFja0ZhaWxDb3VudCA+PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSDimqDvuI8gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDov57nu61cIiArIHRoaXMuYXR0YWNrRmFpbENvdW50ICsgXCLmrKHmib7kuI3liLDnm67moIfvvIzph43nva5oYXNSZWFjaGVkQXR0YWNrUmFuZ2XvvIznu6fnu63np7vliqhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2tGYWlsQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5om+5Yiw55uu5qCH5LqG77yM6YeN572u5aSx6LSl6K6h5pWw5ZmoXG4gICAgICAgICAgICB0aGlzLmF0dGFja0ZhaWxDb3VudCA9IDA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOmHjee9rlwi5rKh5pyJ55uu5qCHXCLml6Xlv5fmoIflv5dcbiAgICAgICAgICAgIHRoaXMubG9nZ2VkTm9UYXJnZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5q2j5Zyo5pS75Ye75Lit77yM5LiN6YeN5aSN6Kem5Y+RXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5pc0F0dGFja2luZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBdHRhY2tUYXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaSreaUvuaUu+WHu+WKqOeUu++8iEhpdOaIllRocm93aW5n77yJXG4gICAgICAgICAgICB2YXIgYXR0YWNrQW5pbSA9IFwiSGl0XCI7IC8vIOm7mOiupOi/keaImOaUu+WHu1xuICAgICAgICAgICAgdmFyIGF0dGFja0RlbGF5ID0gMjAwOyAvLyDpu5jorqTlu7bov58yMDBtc+inpuWPkeS8pOWus++8iOWKqOeUu+aSreaUvuWIsOS4gOWNiu+8iVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmipXmjrflnovoi7Hpm4Tlj6/ku6Xkvb/nlKhUaHJvd2luZ+WKqOeUu1xuICAgICAgICAgICAgaWYgKFs0LCA1LCAxMl0uaW5kZXhPZih0aGlzLmluZm8uaWQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGF0dGFja0FuaW0gPSBcIlRocm93aW5nXCI7XG4gICAgICAgICAgICAgICAgYXR0YWNrRGVsYXkgPSAzMDA7IC8vIOaKleaOt+WKqOeUu+W7tui/n+abtOmVv1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHRyeVNob290XSDinIUgSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDlvIDlp4vmlLvlh7vvvIHliqjnlLs6XCIgKyBhdHRhY2tBbmltICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwg55uu5qCHSUQ6XCIgKyB0YXJnZXQuaWQgKyBcIiwg55uu5qCHSFA6XCIgKyB0YXJnZXQuaHAgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBzcGluZeWtmOWcqDpcIiArICEhdGhpcy5zcGluZSArIFwiLCBzcGluZS5ub2RlLmFjdGl2ZTpcIiArICh0aGlzLnNwaW5lICYmIHRoaXMuc3BpbmUubm9kZSA/IHRoaXMuc3BpbmUubm9kZS5hY3RpdmUgOiBcIm51bGxcIikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBhdHRhY2tBbmltLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOKchSBJRDpcIiArIGkuaW5mby5pZCArIFwiIOaUu+WHu+WKqOeUu+WujOaIkO+8jGlzQXR0YWNraW5nOlwiICsgaS5pc0F0dGFja2luZyArIFwiIOKGkiBmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICBpLmlzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsIHRydWUsIG51bGwpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS4jemcgOimgeWtkOW8uemHjeijheWhq+acuuWItlxuICAgICAgICAgICAgICAgIC8vIEl0ZW0uanPlt7Lnu4/orr7nva7kuoZpbkNvb2xEb3duPXRydWXvvIzmiJHku6zlj6rpnIDopoHorr7nva7orqHml7blmajmnaXph43nva7lroNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIGkuaW5mby5pZCArIFwiIOiuvue9ruWGt+WNtOiuoeaXtuWZqO+8jOW9k+WJjSBpbkNvb2xEb3duOlwiICsgaS5pdGVtLmluQ29vbERvd24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOaXoOadoeS7tuiuvue9ruWGt+WNtOiuoeaXtuWZqO+8iOWboOS4ukl0ZW0uanPlt7Lnu4/orr7nva7kuoZpbkNvb2xEb3duPXRydWXvvIlcbiAgICAgICAgICAgICAgICB2YXIgY2RUaW1lID0gaS5pdGVtLmNkTXMgfHwgNTAwOyAvLyDpu5jorqQ1MDBtc+WGt+WNtFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIElEOlwiICsgaS5pbmZvLmlkICsgXCIg5ZCv5Yqo5Ya35Y206K6h5pe25Zmo77yM5pe26Ze0OlwiICsgY2RUaW1lICsgXCJtc1wiKTtcbiAgICAgICAgICAgICAgICBpLnNjZW5lLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGkuaXRlbS5pbkNvb2xEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOKPsCBJRDpcIiArIGkuaW5mby5pZCArIFwiIOWGt+WNtOWujOaIkO+8gWluQ29vbERvd246XCIgKyBpLml0ZW0uaW5Db29sRG93bik7XG4gICAgICAgICAgICAgICAgfSwgY2RUaW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDlu7bov5/op6blj5HkvKTlrrPliKTlrprvvIjmqKHmi5/mlLvlh7vliqjnlLvnmoTmiZPlh7vngrnvvIlcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10g8J+SpSBJRDpcIiArIGkuaW5mby5pZCArIFwiIOWHhuWkh+mAoOaIkOS8pOWus1wiKTtcbiAgICAgICAgICAgICAgICBpZiAoaS5jdXJyZW50QXR0YWNrVGFyZ2V0ICYmIGkuY3VycmVudEF0dGFja1RhcmdldC5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhbWFnZSA9IGkuZ2V0QXRrKGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIPCfkqUgSUQ6XCIgKyBpLmluZm8uaWQgKyBcIiDpgKDmiJDkvKTlrrM6XCIgKyBkYW1hZ2UgKyBcIiDnu5nnm67moIdJRDpcIiArIGkuY3VycmVudEF0dGFja1RhcmdldC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGkuZGVhbERhbWFnZVRvRW5lbXkoaS5jdXJyZW50QXR0YWNrVGFyZ2V0LCBkYW1hZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIOKaoO+4jyBJRDpcIiArIGkuaW5mby5pZCArIFwiIOebruagh+W3suWkseaViO+8jOWPlua2iOS8pOWus1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBhdHRhY2tEZWxheSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucGxheVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5Lul5LiL5piv5Y6f5p2l55qE5a2Q5by557O757uf6YC76L6R77yI5L+d55WZ5ZCR5ZCO5YW85a6577yJXG4gICAgICAgIC8vIOWvueS6jumcgOimgeaVjOS6uuebruagh+eahOaUu+WHu+Wei+iLsembhO+8iElEIDEsMiw0LDUsNyw5LDEy77yJ77yM5qOA5p+l5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgIC8vIHRvZG8g5L+u5pS55Li65YWo6YOo6Iux6ZuE6YO95qOA5rWLXG4gICAgICAgIHZhciBuZWVkVGFyZ2V0Q2hlY2sgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOSwgMTJdO1xuICAgICAgICBpZiAobmVlZFRhcmdldENoZWNrLmluZGV4T2YodGhpcy5pbmZvLmlkKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAgICAgLy8g5rOo5oSP77ya5LiN5Zyo6L+Z6YeM5p+l5om+55uu5qCH77yM5Zug5Li6dXBkYXRlTW92ZW1lbnTlt7Lnu4/lnKjnlKjlpKfojIPlm7Tmn6Xmib7kuoZcbiAgICAgICAgICAgIC8vIOi/memHjOWPquajgOafpeW9k+WJjeaYr+WQpuacieebruagh+S4lOWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRUYXJnZXQgfHwgdGhpcy5jdXJyZW50VGFyZ2V0LmhwIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInlvZPliY3nm67moIfvvIznlKjlrp7pmYXmlLvlh7vojIPlm7TlsJ3or5Xmn6Xmib5cbiAgICAgICAgICAgICAgICB2YXIgbmVhclRhcmdldCA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgaWYgKCFuZWFyVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOayoeacieWcqOaUu+WHu+iMg+WbtOWGheeahOaVjOS6uu+8jOi/lOWbnmZhbHNl6K6p6Iux6ZuE57un57ut56e75YqoXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbmVhclRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5qOA5p+l5b2T5YmN55uu5qCH5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UG9zID0gdGhpcy5jdXJyZW50VGFyZ2V0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHRoaXMuY3VycmVudFRhcmdldC5jZW50ZXJZKSk7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSB0YXJnZXRQb3Muc3ViKHRoaXMubm9kZS5wb3NpdGlvbikubGVuZ3RoU3FyKCk7XG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLmF0a1JSKSB7XG4gICAgICAgICAgICAgICAgLy8g55uu5qCH5LiN5Zyo5pS75Ye76IyD5Zu05YaF77yM6L+U5ZueZmFsc2Xorqnoi7Hpm4Tnu6fnu63np7vliqhcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgLy8gM+WPt+iLsembhOaUueS4uuaZrumAmuaUu+WHu+Wei1xuICAgICAgICAgICAgICAgIHZhciByID0gZSB8fCB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIHRoaXMuYXRrUlIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICEhciAmJlxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wdXNoTHZBbmRBdGsodCksXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLmlzQXR0YWNraW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoKHRoaXMuaXNBdHRhY2tpbmcgPSAhMCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuY2hlY2tUb1Nob290KHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLml0ZW0uYnVsbGV0Q291bnQgPD0gMCAmJiBpLklLQm9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4oaS5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvKDAuMDY0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogNTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS7heW9k+S9v+eUqHBsYW50IHNwaW5l5pe25omN5L2/55SoSUvpqqjpqrxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJhY3RlciBzcGluZeS4jemcgOimgUlL556E5YeGXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXRoaXMuY2hhcmFjdGVyU3BpbmUgfHwgdGhpcy5zcGluZSAhPT0gdGhpcy5jaGFyYWN0ZXJTcGluZSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSUtCb25lIHx8ICh0aGlzLklLQm9uZSA9IHRoaXMuc3BpbmUuZmluZEJvbmUoXCJJS1wiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnR3ZWVuKHRoaXMuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IChyLm5vZGUueCAtIHRoaXMubm9kZS54KSAvIDAuNzYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAoci5ub2RlLnkgKyByLmNlbnRlclkgLSB0aGlzLm5vZGUueSkgLyAwLjc2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgITApKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdikgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDYwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSAwLjE1O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig2MDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICs9IDAuMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMSArIGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmNyb3NzSXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaGVybyAmJiBlLmhlcm8uaHAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5oZXJvLmFkZFNoaWVsZChlLm1heEhwICogdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcInNoaWVsZFwiLCBlLmhlcm8ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICB2YXIgbiA9IHRoaXMuc2NlbmUuY2hvb3NlTWluSHBIZXJvKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgISFuICYmXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaS5jaGVja0J1ZmYoODAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMS4yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbi5hZGRIcCh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0J1ZmZFZmZlY3QoXCJIUFwiLCBuLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgITApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gMC4xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZigxMDAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSArPSAwLjI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ICo9IDEgKyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0J1ZmZFZmZlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm11c2ljXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIDUwKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLmdldEFuZ2VyQmFyV1BvcygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciArPSB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUudXBkYXRlQW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gITA7XG4gICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTEwNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLmxhc3RCdWxsZXRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgxID09IGkubGFzdEJ1bGxldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkubGFzdEJ1bGxldENvdW50ID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gY2MuaW5zdGFudGlhdGUoaS5sYW5kTWluZU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBjYy52MihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLmdldEhlcm9lc01heE1hcmdpblgoKSArIGNjLm1hdGgucmFuZG9tUmFuZ2UoMCwgMTUwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5tYXRoLnJhbmRvbVJhbmdlKGkuc2NlbmUuZ3JvdW5kQXJlYUxCLnkgKyAxMjAsIGkuc2NlbmUuZ3JvdW5kQXJlYVRSLnkgLSAxMjApXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IGkubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnBhcmVudCA9IGkuc2NlbmUub2Jqc1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnpJbmRleCA9IC10Lnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IHQuZ2V0Q29tcG9uZW50KGNjLkNvbGxpZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uZW5hYmxlZCA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSB0LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG8uZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueCA9IChlLnggLSB0LngpIC8gdC5zY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueSA9IChlLnkgLSB0LnkpIC8gdC5zY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueCA9IE1hdGgubWF4KDAsIHMueCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLnNldEFuaW1hdGlvbigwLCBcInpkMTFfMVwiLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucG9zaXRpb24gPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4uZW5hYmxlZCA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0QW5pbWF0aW9uKDAsIFwiemQxMV8yXCIsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0OyBuKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgdmFyIG8gPSB0aGlzLmNoZWNrQnVmZigxMjA0KSA/IDIgOiAxLFxuICAgICAgICAgICAgICAgICAgICBzID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteXModGhpcywgdGhpcy5hdGtSUiwgbyk7XG4gICAgICAgICAgICAgICAgaWYgKDAgPT0gcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRoaXMuc2NlbmUuZ2V0SGVyb2VzTWF4TWFyZ2luWCgpLFxuICAgICAgICAgICAgICAgICAgICBhID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxICE9IGEgfHwgaS5jaGVja0J1ZmYoMTIwNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gc1tNYXRoLm1pbihzLmxlbmd0aCAtIDEsIGEpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gdC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0LmNlbnRlclkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gY2MudjIoTWF0aC5taW4oYywgZS54KSwgZS55KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gaS5zY2VuZS5vYmpzUm9vdC5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIobik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IGNjLmluc3RhbnRpYXRlKGkuemQubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IHIuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgci5wYXJlbnQgPSBpLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICAgICAgICAgICAgICAgICAgci5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucG9zaXRpb24gPSBpLm5vZGUucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICBoLnNwaW5lLnNldEFuaW1hdGlvbigwLCBoLnNwaW5lLmRlZmF1bHRBbmltYXRpb24sICEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gaC5zcGluZS5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHUgPSBoLnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnggPSB1Lng7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnkgPSB1Lnk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLmluaXRCeShpLnNjZW5lLCBpLml0ZW0ubHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5hID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguYXR0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNob3dKc0VmZmVjdChjYy52MihuLnggKyAxMDAgKiB0LCBuLnkpLCBpLmluZm8uaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQ4ICogdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDE7IGwgPCA1OyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9ndW56aVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGErKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgciA9IGUgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICEhciAmJlxuICAgICAgICAgICAgKHRoaXMucHVzaEx2QW5kQXRrKHQpLFxuICAgICAgICAgICAgIXRoaXMuaXNBdHRhY2tpbmcgJiZcbiAgICAgICAgICAgICAgICAoKHRoaXMuaXNBdHRhY2tpbmcgPSAhMCksXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmlzQXR0YWNraW5nID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5jaGVja1RvU2hvb3Qocik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLml0ZW0uYnVsbGV0Q291bnQgPD0gMCAmJiBpLklLQm9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnR3ZWVuKGkuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IDUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LuF5b2T5L2/55SocGxhbnQgc3BpbmXml7bmiY3kvb/nlKhJS+mqqOmqvFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcmFjdGVyIHNwaW5l5LiN6ZyA6KaBSUvnnoTlh4ZcbiAgICAgICAgICAgICAgICAgICAgICAgICghdGhpcy5jaGFyYWN0ZXJTcGluZSB8fCB0aGlzLnNwaW5lICE9PSB0aGlzLmNoYXJhY3RlclNwaW5lKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JS0JvbmUgfHwgKHRoaXMuSUtCb25lID0gdGhpcy5zcGluZS5maW5kQm9uZShcIklLXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHdlZW4odGhpcy5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogKHIubm9kZS54IC0gdGhpcy5ub2RlLngpIC8gMC43NixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChyLm5vZGUueSArIHIuY2VudGVyWSAtIHRoaXMubm9kZS55KSAvIDAuNzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAhMCkpXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBjaGVja1RvU2hvb3Q6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICgwICE9IHRoaXMubHZzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuemQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMubHZzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSB0IHx8IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG9vdChpLCB0aGlzLml0ZW0ubHYsIGUuYXRrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5sdnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuc2V0VGltZW91dCh0aGlzLmNoZWNrVG9TaG9vdC5iaW5kKHRoaXMpLCA4MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFNob290QVBvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDlpoLmnpzkvb/nlKhjaGFyYWN0ZXLmlLvlh7vns7vnu5/vvIzkvb/nlKhIYW5kX0bpqqjpqrzkvZzkuLrmlLvlh7vngrlcbiAgICAgICAgaWYgKHRoaXMudXNlQ2hhcmFjdGVyQXR0YWNrICYmIHRoaXMuc3BpbmUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5IYW5kQm9uZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuSGFuZEJvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiSGFuZF9GXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuSGFuZEJvbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IGNjLnYyKHRoaXMuSGFuZEJvbmUud29ybGRYLCB0aGlzLkhhbmRCb25lLndvcmxkWSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BpbmUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOaJvuS4jeWIsEhhbmRfRumqqOmqvO+8jOi/lOWbnnNwaW5l6IqC54K55L2N572uXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BpbmUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5Y6f5p2l55qE5a2Q5by557O757uf6YC76L6R77yI5L+d55WZ5ZCR5ZCO5YW85a6577yJXG4gICAgICAgIGlmICh0aGlzLkdQQm9uZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuR1BCb25lID0gdGhpcy5zcGluZS5maW5kQm9uZShcIkdQXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ID0gY2MudjIodGhpcy5HUEJvbmUud29ybGRYLCB0aGlzLkdQQm9uZS53b3JsZFkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0KTtcbiAgICB9LFxuICAgIHNob290OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICBpZiAoNCA9PSB0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIHZhciBuO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwMSkpIHtcbiAgICAgICAgICAgICAgICBuID0gOTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbiA9IDU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG9vdE4obiwgdCwgZSwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwNCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290TigzLCB0LCBlLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICg3ID09IHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290SUsodCwgZSwgaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIHRoaXMuc2hvb3QxKHQsIGUsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG9vdDE6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcy5nZXRTaG9vdEFQb3MoKTtcbiAgICAgICAgdmFyIG8gPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG4pO1xuICAgICAgICB2YXIgcyA9IHQubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgdC5jZW50ZXJZKSkuc3ViKG8pO1xuICAgICAgICBpZiAocy54IDwgMCkge1xuICAgICAgICAgICAgcy54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYyA9IE1hdGguYXRhbjIocy55LCBzLngpO1xuICAgICAgICB2YXIgYSA9IHRoaXMuemQ7XG4gICAgICAgIHZhciByID0gY2MuaW5zdGFudGlhdGUoYS5ub2RlKTtcbiAgICAgICAgci5wYXJlbnQgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICByLmFjdGl2ZSA9ICEwO1xuICAgICAgICByLnBvc2l0aW9uID0gbztcbiAgICAgICAgdmFyIGggPSByLmdldENvbXBvbmVudChcIkJ1bGxldFwiKTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwNCkpIHtcbiAgICAgICAgICAgIGguaGl0Q291bnQgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDMpKSB7XG4gICAgICAgICAgICBoLmhpdENvdW50ID0gMjtcbiAgICAgICAgfVxuICAgICAgICBoLmluaXRCeSh0aGlzLnNjZW5lLCBlKTtcbiAgICAgICAgaC5hID0gdGhpcztcbiAgICAgICAgaWYgKDEzID09IHRoaXMuaW5mby5pZCAmJiAyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICBoLmF0dCA9IGkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaC5hdHQgPSBpO1xuICAgICAgICB9XG4gICAgICAgIGgubW92ZUJ5QW5nbGUoKDE4MCAqIGMpIC8gTWF0aC5QSSk7XG4gICAgfSxcbiAgICBzaG9vdE46IGZ1bmN0aW9uICh0LCBlLCBpLCBuKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5nZXRTaG9vdEFQb3MoKTtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG8pO1xuICAgICAgICB2YXIgYyA9IGUubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgZS5jZW50ZXJZKSkuc3ViKHMpO1xuICAgICAgICBpZiAoYy54IDwgMCkge1xuICAgICAgICAgICAgYy54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYSA9ICgxODAgKiBNYXRoLmF0YW4yKGMueSwgYy54KSkgLyBNYXRoLlBJO1xuICAgICAgICB2YXIgcjtcbiAgICAgICAgaWYgKHQgPiA1KSB7XG4gICAgICAgICAgICByID0gWzAsIC0xMCwgLTIwLCAtMzAsIDQwLCAxMCwgMjAsIDMwLCA0MF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByID0gWzAsIC0xNSwgMTUsIC0zMCwgMzBdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGggPSAwOyBoIDwgdDsgaCsrKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuemQubm9kZSk7XG4gICAgICAgICAgICBkLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgICAgICBkLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgZC5wb3NpdGlvbiA9IHM7XG4gICAgICAgICAgICB2YXIgdSA9IGQuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICAgICAgdS5pbml0QnkodGhpcy5zY2VuZSwgaSk7XG4gICAgICAgICAgICB1LmEgPSB0aGlzO1xuICAgICAgICAgICAgdS5hdHQgPSBuO1xuICAgICAgICAgICAgdS5tb3ZlQnlBbmdsZShhICsgcltoXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob290SUs6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgdmFyIG8gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgcyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgIHZhciBjID0gdC5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigwLCB0LmNlbnRlclkpKTtcbiAgICAgICAgdmFyIGEgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnpkLm5vZGUpO1xuICAgICAgICB2YXIgciA9IGEuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICBhLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgIGEuYWN0aXZlID0gITA7XG4gICAgICAgIGEucG9zaXRpb24gPSBzO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzAyKSkge1xuICAgICAgICAgICAgYS5nZXRDb21wb25lbnQoXCJFdmVudENvbGxpZGVyXCIpLmNvbGxpZGVyLnJhZGl1cyAqPSAxLjM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGggPSByLnNwaW5lLnNldEFuaW1hdGlvbigwLCByLnNwaW5lLmRlZmF1bHRBbmltYXRpb24sICEwKTtcbiAgICAgICAgci5zcGluZS5zZXRUcmFja0V2ZW50TGlzdGVuZXIoaCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbi5zY2VuZS5zaG93SnNFZmZlY3QodC5ub2RlLnBvc2l0aW9uLCBuLmluZm8uaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGQgPSByLnNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgIHZhciB1ID0gci5zcGluZS5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGMpO1xuICAgICAgICBkLnggPSB1Lng7XG4gICAgICAgIGQueSA9IHUueTtcbiAgICAgICAgZC54ID0gTWF0aC5tYXgoMCwgZC54KTtcbiAgICAgICAgci5pbml0QnkodGhpcy5zY2VuZSwgZSk7XG4gICAgICAgIHIuYSA9IHRoaXM7XG4gICAgICAgIHIuYXR0ID0gaTtcbiAgICB9LFxuICAgIGNoZWNrSGVyb0J1ZmY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0sXG4gICAgY2hlY2tCdWZmOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9ICh0IC0gKHQgJSAxMDApKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5mby5pZCA9PSBlICYmIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKHQpO1xuICAgIH0sXG4gICAgZG9CdWxsZXRBdHRMb2dpYzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0LmF0dDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDQpKSB7XG4gICAgICAgICAgICBpICo9IDEuNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEyMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUud2Vha05vZGUgJiYgdGhpcy5pc1BoeSkge1xuICAgICAgICAgICAgaSAqPSAxLjI7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BoeSkge1xuICAgICAgICAgICAgICAgICAgICBpICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEgLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXMzZ3opIHtcbiAgICAgICAgICAgICAgICAgICAgaSAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxIC0gNF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzMmd6KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSAtIDEwXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICBpZiAodGhpcy5jaGVja0NyaXQodCwgZSkpIHtcbiAgICAgICAgICAgIG4gPSAxO1xuICAgICAgICAgICAgaSAqPSB0aGlzLmdldENyaXRQbHVzKHQsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGkgKj0gY2MubWF0aC5yYW5kb21SYW5nZSgwLjk1LCAxLjA1KTtcbiAgICAgICAgZS5odXJ0QnkodGhpcywgaSk7XG4gICAgICAgIHRoaXMuc2NlbmUuc2hvd0VuZW15SHVydE51bShuLCBlLm5vZGUucG9zaXRpb24sIGkpO1xuICAgICAgICBpZiAodC5qc0VmZkV4Y2x1c2l2ZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGUubm9kZS5wb3NpdGlvbiwgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdGhpcy5pbmZvLmlkXSArPSBpO1xuICAgICAgICBpZiAodC5idWZmU2xvdykge1xuICAgICAgICAgICAgZS5hZGRCdWZmU2xvdygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0LmJ1ZmZJY2UgJiYgdGhpcy5jaGVja0J1ZmYoMTIwMykgJiYgTWF0aC5yYW5kb20oKSA8IDAuMikge1xuICAgICAgICAgICAgZS5hZGRCdWZmSWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwNCkgJiYgTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICAgICAgZS5hZGRCdWZmV2VhaygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDQpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAzKSkge1xuICAgICAgICAgICAgZS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDIpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tDcml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDEpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRDb3VudGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRDb3VudGVyID0gdGhpcy5hdHRDb3VudGVyICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRDb3VudGVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0O1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMikpIHtcbiAgICAgICAgICAgICAgICB0ID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdCA9IDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRDb3VudGVyID49IHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZSA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDIpKSB7XG4gICAgICAgICAgICBlICs9IDAuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwNCkpIHtcbiAgICAgICAgICAgIGUgKz0gMC4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAzKSkge1xuICAgICAgICAgICAgZSArPSAwLjE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPCBlO1xuICAgIH0sXG4gICAgZ2V0Q3JpdFBsdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSAxLjU7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDMpKSB7XG4gICAgICAgICAgICB0ICs9IDAuNTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9LFxuICAgIGRvTGFuZE1pbmVzTG9naWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdC5nZXRDb21wb25lbnQoXCJFbmVteVwiKTtcbiAgICAgICAgaWYgKGUgJiYgZS5ocCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZG9CdWxsZXRBdHRMb2dpYyhcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGF0dDogdGhpcy5nZXRBdGsodGhpcy5pdGVtLmx2KSxcbiAgICAgICAgICAgICAgICAgICAgbHY6IHRoaXMuaXRlbS5sdixcbiAgICAgICAgICAgICAgICAgICAganNFZmZFeGNsdXNpdmU6ICEwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkxhbmRtaW5lc0NvbGxpc2lvbjogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0LmdldENvbXBvbmVudChcIkVuZW15XCIpO1xuICAgICAgICAgICAgaWYgKGkgJiYgaS5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICBlLmVuYWJsZWQgPSAhMTtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IGUubm9kZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICAgICAgICAgIHZhciBvID0gY2MuZmluZChcInJhbmdlXCIsIGUubm9kZSkuZ2V0Q29tcG9uZW50KGNjLkNvbGxpZGVyKTtcbiAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMubWFudWFsbHlDaGVja0NvbGxpZGVyKG8pO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGUubm9kZS5wb3NpdGlvbiwgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgICAgICAgICBuLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhZGRIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocCA9IE1hdGgubWluKHRoaXMuaXRlbS5tYXhIcCwgdGhpcy5ocCArIHQpO1xuICAgICAgICB0aGlzLml0ZW0udXBkYXRlSHAodGhpcy5ocCAvIHRoaXMuaXRlbS5tYXhIcCk7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlSHAoITApO1xuICAgIH0sXG4gICAgZGVsSHA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuaHAgPSBNYXRoLm1heCgwLCB0aGlzLmhwIC0gdCk7XG4gICAgICAgIHRoaXMuaXRlbS51cGRhdGVIcCh0aGlzLmhwIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVIcCghMCk7XG4gICAgfSxcbiAgICBhZGRTaGllbGQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2hpZWxkVmFsdWUgPSBNYXRoLm1pbih0aGlzLml0ZW0ubWF4SHAsIHRoaXMuc2hpZWxkVmFsdWUgKyB0KTtcbiAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZVNoaWVsZCh0aGlzLnNoaWVsZFZhbHVlIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVTaGllbGQoKTtcbiAgICB9LFxuICAgIGh1cnRCeTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgLy8g5Y+X5LykXG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgaWYgKCEodGhpcy5oYXNFbmRlZCB8fCB0aGlzLmhwIDw9IDApKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaGllbGRWYWx1ZSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IE1hdGgubWluKHRoaXMuc2hpZWxkVmFsdWUsIGkpO1xuICAgICAgICAgICAgICAgIGkgLT0gbztcbiAgICAgICAgICAgICAgICB0aGlzLnNoaWVsZFZhbHVlIC09IG87XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZVNoaWVsZCh0aGlzLnNoaWVsZFZhbHVlIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID4gMCAmJiAodGhpcy5kZWxIcChpKSwgdGhpcy5ocCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHZhciBzID1cbiAgICAgICAgICAgICAgICAgICAgIWNjLnB2ei5ydW50aW1lRGF0YS5oYXNVc2VSZWJvcm4gJiZcbiAgICAgICAgICAgICAgICAgICAgKDggPT0gdGhpcy5pbmZvLmlkIHx8IHRoaXMuc2NlbmUuaGFzSGVybyg4KSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoODAzKTtcbiAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaGFzVXNlUmVib3JuID0gITA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6KGA5p2hXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5iYXJOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIkRlYWRcIiwgITEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4ucmVib3JuKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDgwNCkgPyAxIDogMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc2hvd0J1ZmZFZmZlY3QoXCJyZXZpdmVcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5oYXNEaWUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc2NlbmUuY2hlY2tJc0ZhaWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWJvcm46IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOWkjea0u1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiZnVodW9cIiwgITEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGUuaHAgPSBlLml0ZW0ubWF4SHAgKiB0O1xuICAgICAgICAgICAgZS5pdGVtLnVwZGF0ZUhwKCk7XG4gICAgICAgICAgICBlLmhhc0RpZSA9ICExO1xuICAgICAgICAgICAgZS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzaG93QnVmZkVmZmVjdDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gZSkge1xuICAgICAgICAgICAgZSA9ICExO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZEJ1ZmZQcmVmYWJcbiAgICAgICAgICAgICAgICAuYWRkTm9kZVRvKHRoaXMuaXRlbS5zcGluZS5ub2RlLCBjYy5WZWMyLlpFUk8pXG4gICAgICAgICAgICAgICAgLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbilcbiAgICAgICAgICAgICAgICAuc2V0QW5pbWF0aW9uKDAsIHQsICExKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0J1ZmZFZmZlY3QodCwgdGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyDnoa7kv53liJ3lp4vljJblrozmiJBcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWQgfHwgIXRoaXMuc2NlbmUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2dnZWROb3RJbml0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0hlcm8gVXBkYXRlXSBJROacquefpSwg5pyq5Yid5aeL5YyW5oiWc2NlbmXkuI3lrZjlnKhcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWROb3RJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zY2VuZSAmJiAhdGhpcy5zY2VuZS50aW1lUGF1c2VkICYmICEodGhpcy5zY2VuZS5oYXNFbmRlZCB8fCB0aGlzLmhwIDw9IDAgfHwgdGhpcy5oYXNEaWUpKSB7XG4gICAgICAgICAgICB2YXIgZSA9IHQgKiBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5nZXRUaW1lU2NhbGUoKTtcbiAgICAgICAgICAgIC8vIOavj+enkuWPquaJk+WNsOS4gOasoeaXpeW/l++8jOmBv+WFjeWIt+Wxj1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RMb2dUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TG9nVGltZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0TG9nVGltZSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIFVwZGF0ZV0gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiwgZW5hYmxlZDpcIiArIHRoaXMuZW5hYmxlZCArIFwiLCDkvY3nva46XCIgKyB0aGlzLm5vZGUucG9zaXRpb24gKyBcIiwg5pWM5Lq65pWwOlwiICsgKHRoaXMuc2NlbmUuZW5lbXlzID8gdGhpcy5zY2VuZS5lbmVteXMubGVuZ3RoIDogMCkgKyBcIiwgaXNNb3Zpbmc6XCIgKyB0aGlzLmlzTW92aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RMb2dUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1vdmVtZW50KGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVNb3ZlbWVudDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8g5qOA5p+l5piv5ZCm5pyJ5pWM5Lq65a2Y5ZyoXG4gICAgICAgIGlmICghdGhpcy5zY2VuZS5lbmVteXMgfHwgdGhpcy5zY2VuZS5lbmVteXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyDmsqHmnInmlYzkurrml7bvvIzov5Tlm57liJ3lp4vkvY3nva5cbiAgICAgICAgICAgIHRoaXMucmV0dXJuVG9Jbml0aWFsUG9zaXRpb24odCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOa4heeQhuW3suatu+S6oeeahOebruagh+W8leeUqFxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGFyZ2V0ICYmIHRoaXMuY3VycmVudFRhcmdldC5ocCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOa4hemZpOW3suatu+S6oeeahOebruagh+W8leeUqFwiKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICAvLyDlpoLmnpzkuYvliY3lt7Lnu4/liLDovr7mlLvlh7vojIPlm7TvvIznjrDlnKjnm67moIfmrbvkuobvvIzpnIDopoHph43mlrDlvIDlp4vlr7vmib7lkoznp7vliqhcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDph43nva7mlLvlh7vojIPlm7TmoIforrDvvIzlh4blpIflr7vmib7mlrDnm67moIdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIOWvu+aJvuacgOi/keeahOaVjOS6uu+8iOaJgOacieiLsembhOmDveenu+WKqO+8jOS4jeWMuuWIhuexu+Wei++8iVxuICAgICAgICB2YXIgZSA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgOTk5OTk5KTtcbiAgICAgICAgXG4gICAgICAgIC8vIOa3u+WKoOiwg+ivleaXpeW/l1xuICAgICAgICBpZiAoIXRoaXMubW92ZW1lbnREZWJ1Z0NvdW50KSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVtZW50RGVidWdDb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb3ZlbWVudERlYnVnQ291bnQrKztcbiAgICAgICAgXG4gICAgICAgIC8vIOavjzLnp5LmiZPljbDkuIDmrKHosIPor5Xkv6Hmga9cbiAgICAgICAgaWYgKHRoaXMubW92ZW1lbnREZWJ1Z0NvdW50ICUgMTIwID09PSAxKSB7XG4gICAgICAgICAgICAvLyDnu5/orqHmtLvnnYDnmoTmlYzkurrmlbDph49cbiAgICAgICAgICAgIHZhciBhbGl2ZUVuZW15Q291bnQgPSAwO1xuICAgICAgICAgICAgdmFyIGVuZW15UG9zaXRpb25zID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5zY2VuZS5lbmVteXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmVuZW15cy5mb3JFYWNoKGZ1bmN0aW9uKGVuZW15KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmVteS5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaXZlRW5lbXlDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXlQb3NpdGlvbnMucHVzaChcIihcIiArIGVuZW15Lm5vZGUueC50b0ZpeGVkKDApICsgXCIsXCIgKyBlbmVteS5ub2RlLnkudG9GaXhlZCgwKSArIFwiLEhQOlwiICsgZW5lbXkuaHAudG9GaXhlZCgwKSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHVwZGF0ZU1vdmVtZW50XSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOiLsembhOS9jee9rjooXCIgKyB0aGlzLm5vZGUueC50b0ZpeGVkKDApICsgXCIsXCIgKyB0aGlzLm5vZGUueS50b0ZpeGVkKDApICsgXCIpXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOaJvuWIsOaVjOS6ujpcIiArICEhZSArIFxuICAgICAgICAgICAgICAgICAgICAgICAgKGUgPyBcIiwg5pWM5Lq65L2N572uOihcIiArIGUubm9kZS54LnRvRml4ZWQoMCkgKyBcIixcIiArIGUubm9kZS55LnRvRml4ZWQoMCkgKyBcIiksIOaVjOS6ukhQOlwiICsgZS5ocC50b0ZpeGVkKDApIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOa0u+edgOeahOaVjOS6ujpcIiArIGFsaXZlRW5lbXlDb3VudCArIFwiL1wiICsgdGhpcy5zY2VuZS5lbmVteXMubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBpc01vdmluZzpcIiArIHRoaXMuaXNNb3ZpbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGlzQXR0YWNraW5nOlwiICsgdGhpcy5pc0F0dGFja2luZyArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgaGFzUmVhY2hlZEF0dGFja1JhbmdlOlwiICsgdGhpcy5oYXNSZWFjaGVkQXR0YWNrUmFuZ2UpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWxpdmVFbmVteUNvdW50ID4gMCAmJiBhbGl2ZUVuZW15Q291bnQgPD0gMTApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIHVwZGF0ZU1vdmVtZW50XSDliankvZnmlYzkurrkvY3nva46IFwiICsgZW5lbXlQb3NpdGlvbnMuam9pbihcIiwgXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGUgJiYgZS5ocCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGU7XG4gICAgICAgICAgICB2YXIgaSA9IGUubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgZS5jZW50ZXJZKSk7XG4gICAgICAgICAgICB2YXIgbiA9IGkuc3ViKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB2YXIgbyA9IG4ubGVuZ3RoU3FyKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOavjzLnp5LmiZPljbDot53nprvkv6Hmga9cbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmVtZW50RGVidWdDb3VudCAlIDEyMCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm8gdXBkYXRlTW92ZW1lbnRdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOi3neaVjOS6ujpcIiArIE1hdGguc3FydChvKS50b0ZpeGVkKDEpICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOaUu+WHu+iMg+WbtDpcIiArIE1hdGguc3FydCh0aGlzLmF0a1JSKS50b0ZpeGVkKDEpICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOWBnOatoui3neemuzpcIiArIE1hdGguc3FydCh0aGlzLmF0a1JSICogMC45OCkudG9GaXhlZCgxKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsIOaYr+WQpuWcqOiMg+WbtOWGhTpcIiArIChvIDw9IHRoaXMuYXRrUlIgKiAwLjk4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhe+8iOS9v+eUqDAuOTjnmoTns7vmlbDvvIznoa7kv53oi7Hpm4Tnp7vliqjliLDnoa7lrp7og73mlLvlh7vliLDnmoTkvY3nva7vvIlcbiAgICAgICAgICAgIC8vIOi/meagt+WPr+S7pemBv+WFjei+ueeVjOaDheWGteWvvOiHtOiLsembhOWBnOatouenu+WKqOS9huaXoOazleaUu+WHu1xuICAgICAgICAgICAgdmFyIGF0dGFja1JhbmdlQnVmZmVyID0gdGhpcy5hdGtSUiAqIDAuOTg7IC8vIOeojeW+ruS/neWuiOS4gOeCue+8jOehruS/neiDveaUu+WHu+WIsFxuICAgICAgICAgICAgaWYgKG8gPD0gYXR0YWNrUmFuZ2VCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAvLyDlnKjmlLvlh7vojIPlm7TlhoXvvIzlgZzmraLnp7vliqhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDliLDovr7mlLvlh7vojIPlm7TvvIzlgZzmraLnp7vliqhcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWKqOeUu+eUseaUu+WHu+ezu+e7n+aOp+WItu+8jOi/memHjOS4jeWIh+aNolxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5LiN5Zyo5pS75Ye76IyD5Zu05YaF77yM57un57ut5ZCR5pWM5Lq656e75YqoXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDwn5q2IElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5byA5aeL5ZCR5pWM5Lq656e75Yqo77yM5b2T5YmN6Led56a7OlwiICsgTWF0aC5zcXJ0KG8pLnRvRml4ZWQoMSkgKyBcIiwg55uu5qCH5L2N572uOlwiICsgZS5ub2RlLnBvc2l0aW9uLngudG9GaXhlZCgxKSArIFwiLFwiICsgZS5ub2RlLnBvc2l0aW9uLnkudG9GaXhlZCgxKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWPquWcqOmdnuaUu+WHu+eKtuaAgeaXtuWIh+aNouS4uuenu+WKqOWKqOeUu1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiV2Fsa1wiLCAhMCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSDimqDvuI8gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDpnIDopoHnp7vliqjkvYbov5jlnKjmlLvlh7vnirbmgIHvvIzkuI3liIfmjaLliqjnlLtcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g6K6h566X56e75Yqo5pa55ZCR5ZKM56e75YqoXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBNYXRoLmF0YW4yKG4ueSwgbi54KTtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNjLnYyKHRoaXMubW92ZVNwZWVkICogTWF0aC5jb3MocykgKiB0LCB0aGlzLm1vdmVTcGVlZCAqIE1hdGguc2luKHMpICogdCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5L2N572uXG4gICAgICAgICAgICAgICAgdmFyIG9sZFBvcyA9IHRoaXMubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQoYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnpJbmRleCA9IC10aGlzLm5vZGUueTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW0uYmFyTm9kZS5wb3NpdGlvbiA9IHRoaXMuaXRlbS5iYXJOb2RlLnBvc2l0aW9uLmFkZChjKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbVNwaW5lUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDosIPor5XvvJrmiZPljbDnp7vliqjkv6Hmga/vvIjmr48y56eS5LiA5qyh77yJXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RNb3ZlTG9nVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlTG9nVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBub3dUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICBpZiAobm93VGltZSAtIHRoaXMubGFzdE1vdmVMb2dUaW1lID4gMjAwMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvIE1vdmVdIPCfmrYgSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDmraPlnKjnp7vliqjvvIzkvY3nva46XCIgKyB0aGlzLm5vZGUucG9zaXRpb24ueC50b0ZpeGVkKDEpICsgXCIsXCIgKyB0aGlzLm5vZGUucG9zaXRpb24ueS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZUxvZ1RpbWUgPSBub3dUaW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrBwb3NpdGlvbjLnlKjkuo7mlYzkurrnmoTmlLvlh7vliKTmlq1cbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uMiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5pdGVtLmF0dE9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDmsqHmnInmnInmlYjmlYzkurrvvIzov5Tlm57liJ3lp4vkvY3nva5cbiAgICAgICAgICAgIC8vIOaJk+WNsOitpuWRiuS/oeaBr++8jOW4ruWKqeiwg+ivlVxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZW1lbnREZWJ1Z0NvdW50ICUgMTIwID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsaXZlQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjZW5lLmVuZW15cykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmVuZW15cy5mb3JFYWNoKGZ1bmN0aW9uKGVuZW15KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5lbXkuaHAgPiAwKSBhbGl2ZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWxpdmVDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0hlcm8gdXBkYXRlTW92ZW1lbnRdIOKaoO+4jyBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIGNob29zZUVuZW156L+U5ZuebnVsbO+8jOS9huaciVwiICsgYWxpdmVDb3VudCArIFwi5Liq5rS7552A55qE5pWM5Lq677yBXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmV0dXJuVG9Jbml0aWFsUG9zaXRpb24odCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUl0ZW1TcGluZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWmguaenOS9v+eUqGNoYXJhY3RlcuaUu+WHu+ezu+e7n++8jOS4jemcgOimgeabtOaWsGl0ZW0uc3BpbmXnmoTkvY3nva5cbiAgICAgICAgLy8g5Zug5Li6Y2hhcmFjdGVyIHNwaW5l5pivSGVyb+iKgueCueeahOWtkOiKgueCue+8jOS8muiHquWKqOi3n+maj+enu+WKqFxuICAgICAgICBpZiAodGhpcy51c2VDaGFyYWN0ZXJBdHRhY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5Y6f5p2l55qEcGxhbnTns7vnu5/pnIDopoHlkIzmraVpdGVtLnNwaW5l5L2N572u77yI5L+d55WZ5ZCR5ZCO5YW85a6577yJXG4gICAgICAgIC8vIOWwhkhlcm/oioLngrnnmoTkuJbnlYzlnZDmoIfovazmjaLkuLppdGVtLnNwaW5l54i26IqC54K555qE5pys5Zyw5Z2Q5qCHXG4gICAgICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnNwaW5lICYmIHRoaXMuaXRlbS5zcGluZS5ub2RlKSB7XG4gICAgICAgICAgICAvLyDojrflj5ZIZXJv6IqC54K555qE5LiW55WM5Z2Q5qCHXG4gICAgICAgICAgICB2YXIgaGVyb1dvcmxkUG9zID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIC8vIOi9rOaNouS4uml0ZW0uc3BpbmXniLboioLngrnnmoTmnKzlnLDlnZDmoIdcbiAgICAgICAgICAgIHZhciBzcGluZUxvY2FsUG9zID0gdGhpcy5pdGVtLnNwaW5lLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGhlcm9Xb3JsZFBvcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiwg+ivle+8mummluasoeenu+WKqOaXtuaJk+WNsOaXpeW/l1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZFNwaW5lVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDnrKzkuIDmrKHlkIzmraVzcGluZeS9jee9riAtIEhlcm/kuJbnlYzlnZDmoIc6XCIsIGhlcm9Xb3JsZFBvcywgXCJzcGluZeacrOWcsOWdkOaghzpcIiwgc3BpbmVMb2NhbFBvcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWRTcGluZVVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOabtOaWsGl0ZW0uc3BpbmXnmoTkvY3nva5cbiAgICAgICAgICAgIHRoaXMuaXRlbS5zcGluZS5ub2RlLnBvc2l0aW9uID0gc3BpbmVMb2NhbFBvcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2dnZWRTcGluZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOaXoOazleWQjOatpXNwaW5l5L2N572u77yBaXRlbTpcIiwgISF0aGlzLml0ZW0sIFwic3BpbmU6XCIsICEhKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUpLCBcInNwaW5lLm5vZGU6XCIsICEhKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUgJiYgdGhpcy5pdGVtLnNwaW5lLm5vZGUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFNwaW5lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXR1cm5Ub0luaXRpYWxQb3NpdGlvbjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGRpc3RTcXIgPSB0aGlzLm5vZGUucG9zaXRpb24uc3ViKHRoaXMuaW5pdGlhbFBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgaWYgKGRpc3RTcXIgPiAxKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJXYWxrXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLmF0YW4yKGEueSwgYS54KTtcbiAgICAgICAgICAgIHZhciBoID0gY2MudjIodGhpcy5tb3ZlU3BlZWQgKiBNYXRoLmNvcyhyKSAqIHQsIHRoaXMubW92ZVNwZWVkICogTWF0aC5zaW4ocikgKiB0KTtcbiAgICAgICAgICAgIGlmIChoLmxlbmd0aFNxcigpID4gYS5sZW5ndGhTcXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5hZGQoaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLXRoaXMubm9kZS55O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDjgJDlhbPplK7jgJHlkIzmraXmm7TmlrBpdGVtLnNwaW5l55qE5pi+56S65L2N572uXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1TcGluZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24yID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLml0ZW0uYXR0T2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIOi/lOWbnuWIneWni+S9jee9ruWQju+8jOaBouWkjWl0ZW0uc3BpbmXliLDliJ3lp4vkvY3nva5cbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzkvb/nlKhjaGFyYWN0ZXLmlLvlh7vns7vnu5/vvIzkuI3pnIDopoHmgaLlpI1pdGVtLnNwaW5l5L2N572uXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZUNoYXJhY3RlckF0dGFjayAmJiBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSAmJiB0aGlzLml0ZW0uc3BpbmUubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW0uc3BpbmUubm9kZS5wb3NpdGlvbiA9IHRoaXMuaXRlbVNwaW5lSW5pdGlhbFBvcy5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7Il19