
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
  initBy: function initBy(t, e, i) {
    var n = this;
    this.scene = t;
    this.info = i;
    this.item = e;
    this.spine = this.item.spine; // 保存item.spine节点的初始位置（相对于其父节点）

    this.itemSpineInitialPos = this.item.spine.node.position.clone();
    var o = this.info.json.range;
    this.atkRR = o * o;
    this.lvs = [];
    this.hp = this.item.maxHp;
    this.shieldValue = 0;
    this.hasDie = !1;
    this.setAnimation(0, "Idle", !0, null);
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
    this.isInitialized = true; // 关键：确保Hero组件在初始化后启用，以便update方法能被调用

    this.enabled = true; // 调试日志，确认初始化完成

    console.log("[Hero] initBy完成，ID:" + this.info.id + ", enabled:" + this.enabled + ", 初始位置:", this.initialPosition);
  },
  onLvup: function onLvup(t) {
    if (this.item.index == t) {
      this.item.lvup(!1);
      this.scene.hub.showLvupEffect(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
    }
  },
  setAnimation: function setAnimation(t, e, i, n) {
    // this.spine.setAnimation(t, e + (this.item.lv + 1), i);
    this.spine.setAnimation(t, e, i);
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
    var i = this; // 对于需要敌人目标的攻击型英雄（ID 1,2,4,5,7,9,12），检查是否在攻击范围内
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
          if (i.item.bulletCount <= 0) {
            cc.tween(i.IKBone).to(0.064, {
              x: 150,
              y: 50
            }).start();
          }
        }), this.IKBone || (this.IKBone = this.spine.findBone("IK")), cc.tween(this.IKBone).to(0.064, {
          x: (r.node.x - this.node.x) / 0.76,
          y: (r.node.y + r.centerY - this.node.y) / 0.76
        }).start(), !0));

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
      if (i.item.bulletCount <= 0) {
        cc.tween(i.IKBone).to(0.064, {
          x: 150,
          y: 50
        }).start();
      }
    }), this.IKBone || (this.IKBone = this.spine.findBone("IK")), cc.tween(this.IKBone).to(0.064, {
      x: (r.node.x - this.node.x) / 0.76,
      y: (r.node.y + r.centerY - this.node.y) / 0.76
    }).start(), !0));
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


    var e = this.scene.chooseEnemy(this, 999999);

    if (e && e.hp > 0) {
      this.currentTarget = e;
      var i = e.node.position.add(cc.v2(0, e.centerY));
      var n = i.sub(this.node.position);
      var o = n.lengthSqr(); // 检查是否在攻击范围内

      if (o <= this.atkRR) {
        // 在攻击范围内，停止移动
        if (this.isMoving) {
          this.isMoving = false;
          this.hasReachedAttackRange = true;
          console.log("[Hero] ID:" + this.info.id + " 到达攻击范围"); // 不立即切换动画，让攻击动画控制
        }
      } else {
        // 不在攻击范围内，继续向敌人移动
        if (!this.isMoving) {
          this.isMoving = true;
          this.hasReachedAttackRange = false;
          console.log("[Hero] ID:" + this.info.id + " 开始向敌人移动"); // 只在非攻击状态时切换为移动动画

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
        this.updateItemSpinePosition(); // 调试：打印移动信息（每秒一次）

        if (!this.lastMoveLogTime) {
          this.lastMoveLogTime = 0;
        }

        var nowTime = Date.now();

        if (nowTime - this.lastMoveLogTime > 1000) {
          console.log("[Hero Move] ID:" + this.info.id + ", 从" + oldPos + " 移动到" + this.node.position + ", 移动量:" + c);
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

        if (this.item && this.item.spine && this.item.spine.node) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSGVyby5qcyJdLCJuYW1lcyI6WyIkYnVsbGV0IiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiemQiLCJ6ZDIiLCJsYW5kTWluZU5vZGUiLCJOb2RlIiwib25Mb2FkIiwibm9kZSIsImFjdGl2ZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJlbmFibGVkIiwic3RhcnQiLCJpbml0QnkiLCJ0IiwiaSIsIm4iLCJzY2VuZSIsImluZm8iLCJpdGVtIiwiaXRlbVNwaW5lSW5pdGlhbFBvcyIsInBvc2l0aW9uIiwiY2xvbmUiLCJvIiwianNvbiIsInJhbmdlIiwiYXRrUlIiLCJsdnMiLCJocCIsIm1heEhwIiwic2hpZWxkVmFsdWUiLCJoYXNEaWUiLCJzZXRBbmltYXRpb24iLCJpc1BoeSIsImlzTWFnaWMiLCJpczNneiIsInNvbWUiLCJpZCIsImlzMmd6IiwiYnV0bGVyIiwib24iLCJvbkx2dXAiLCJpbml0aWFsUG9zaXRpb24iLCJtb3ZlU3BlZWQiLCJjdXJyZW50VGFyZ2V0IiwiaXNNb3ZpbmciLCJoYXNSZWFjaGVkQXR0YWNrUmFuZ2UiLCJpc0luaXRpYWxpemVkIiwibG9nIiwiaW5kZXgiLCJsdnVwIiwiaHViIiwic2hvd0x2dXBFZmZlY3QiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlQVIiLCJWZWMyIiwiWkVSTyIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJnZXRBdGsiLCJNYXRoIiwibWluIiwibHYxIiwiYXR0cmlidXRlMiIsImxlbmd0aCIsImZpZ2h0bHZ1cDIiLCJwdnoiLCJydW50aW1lRGF0YSIsImdldEJ1ZmZWYWx1ZSIsIml0ZW1zIiwiZ2V0U2hpZWxkIiwicHVzaEx2QW5kQXRrIiwibHYiLCJwdXNoIiwiYXRrIiwicGxheUF0dEFuZERvIiwiY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXIiLCJzZXRFdmVudExpc3RlbmVyIiwicGxheVNvdW5kIiwicGxheUVmZmVjdEFzeW5jIiwidHJ5U2hvb3QiLCJuZWVkVGFyZ2V0Q2hlY2siLCJpbmRleE9mIiwibmVhclRhcmdldCIsImNob29zZUVuZW15IiwidGFyZ2V0UG9zIiwiYWRkIiwidjIiLCJjZW50ZXJZIiwiZGlzdGFuY2UiLCJzdWIiLCJsZW5ndGhTcXIiLCJyIiwiaXNBdHRhY2tpbmciLCJpc1ZhbGlkIiwiY2hlY2tUb1Nob290IiwiYnVsbGV0Q291bnQiLCJ0d2VlbiIsIklLQm9uZSIsInRvIiwieCIsInkiLCJmaW5kQm9uZSIsImhhc0VuYWJsZUJ1ZmYiLCJjcm9zc0l0ZW1zIiwiZm9yRWFjaCIsImhlcm8iLCJhZGRTaGllbGQiLCJzaG93QnVmZkVmZmVjdCIsImNob29zZU1pbkhwSGVybyIsImNoZWNrQnVmZiIsImFkZEhwIiwiZ2V0QW5nZXJCYXJXUG9zIiwiYW5nZXIiLCJ1cGRhdGVBbmdlciIsImxhc3RCdWxsZXRDb3VudCIsImluc3RhbnRpYXRlIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsIm1hdGgiLCJyYW5kb21SYW5nZSIsImdyb3VuZEFyZWFMQiIsImdyb3VuZEFyZWFUUiIsInBhcmVudCIsIm9ianNSb290IiwiekluZGV4IiwiZ2V0Q29tcG9uZW50IiwiQ29sbGlkZXIiLCJzIiwic2NhbGUiLCJtYXgiLCJjaG9vc2VFbmVteXMiLCJjIiwiYSIsImgiLCJidWxsZXRzUm9vdCIsImRlZmF1bHRBbmltYXRpb24iLCJkIiwidSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwiYXR0IiwicCIsInNldFRpbWVvdXQiLCJzaG93SnNFZmZlY3QiLCJsIiwic2hpZnQiLCJzaG9vdCIsImJpbmQiLCJnZXRTaG9vdEFQb3MiLCJHUEJvbmUiLCJ3b3JsZFgiLCJ3b3JsZFkiLCJzaG9vdE4iLCJzaG9vdElLIiwic2hvb3QxIiwiYXRhbjIiLCJoaXRDb3VudCIsIm1vZGUiLCJtb3ZlQnlBbmdsZSIsIlBJIiwiY29sbGlkZXIiLCJyYWRpdXMiLCJzZXRUcmFja0V2ZW50TGlzdGVuZXIiLCJjaGVja0hlcm9CdWZmIiwiZG9CdWxsZXRBdHRMb2dpYyIsIndlYWtOb2RlIiwiYWN0QnVmZjEiLCJjaGVja0NyaXQiLCJnZXRDcml0UGx1cyIsImh1cnRCeSIsInNob3dFbmVteUh1cnROdW0iLCJqc0VmZkV4Y2x1c2l2ZSIsInN0YXRzIiwiYnVmZlNsb3ciLCJhZGRCdWZmU2xvdyIsImJ1ZmZJY2UiLCJyYW5kb20iLCJhZGRCdWZmSWNlIiwiYWRkQnVmZldlYWsiLCJyZXB1bHNlIiwiYXR0Q291bnRlciIsImRvTGFuZE1pbmVzTG9naWMiLCJvbkxhbmRtaW5lc0NvbGxpc2lvbiIsImZpbmQiLCJ1dGlscyIsIm1hbnVhbGx5Q2hlY2tDb2xsaWRlciIsImRlc3Ryb3kiLCJ1cGRhdGVIcCIsImRlbEhwIiwidXBkYXRlU2hpZWxkIiwiaGFzRW5kZWQiLCJoYXNVc2VSZWJvcm4iLCJoYXNIZXJvIiwiYmFyTm9kZSIsInJlYm9ybiIsImNoZWNrSXNGYWlsIiwiYWRkQnVmZlByZWZhYiIsImFkZE5vZGVUbyIsInVwZGF0ZSIsImxvZ2dlZE5vdEluaXQiLCJ3YXJuIiwidGltZVBhdXNlZCIsImRpcmVjdG9yIiwiZ2V0U2NoZWR1bGVyIiwiZ2V0VGltZVNjYWxlIiwibGFzdExvZ1RpbWUiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJub3ciLCJlbmVteXMiLCJ1cGRhdGVNb3ZlbWVudCIsInJldHVyblRvSW5pdGlhbFBvc2l0aW9uIiwiY29zIiwic2luIiwib2xkUG9zIiwidXBkYXRlSXRlbVNwaW5lUG9zaXRpb24iLCJsYXN0TW92ZUxvZ1RpbWUiLCJub3dUaW1lIiwicG9zaXRpb24yIiwiYXR0T2Zmc2V0IiwiaGVyb1dvcmxkUG9zIiwic3BpbmVMb2NhbFBvcyIsImxvZ2dlZFNwaW5lVXBkYXRlIiwibG9nZ2VkU3BpbmVFcnJvciIsImRpc3RTcXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFyQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFI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LEtBQUszRCxZQUFMLENBQWtCLENBQWxCLEVBQXFCLE1BQXJCLEVBQTZCLENBQUMsQ0FBOUIsRUFBaUMsSUFBakM7UUFDSDtNQUNKO0lBQ0o7RUFDSjtBQXIzQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyICRidWxsZXQgPSByZXF1aXJlKFwiLi9CdWxsZXRcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICB6ZDogJGJ1bGxldCxcbiAgICAgICAgemQyOiAkYnVsbGV0LFxuICAgICAgICBsYW5kTWluZU5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMuemQgJiYgdGhpcy56ZC5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56ZC5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuemQyICYmIHRoaXMuemQyLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpkMi5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubGFuZE1pbmVOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYW5kTWluZU5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbSGVybyBvbkxvYWRdIOWIneWni+WMlue7hOS7tuWksei0pTpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5ZCv55SodXBkYXRl5pa55rOV5Lul5pSv5oyB56e75Yqo6YC76L6RXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gKCkge30sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2NlbmUgPSB0O1xuICAgICAgICB0aGlzLmluZm8gPSBpO1xuICAgICAgICB0aGlzLml0ZW0gPSBlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zcGluZSA9IHRoaXMuaXRlbS5zcGluZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOS/neWtmGl0ZW0uc3BpbmXoioLngrnnmoTliJ3lp4vkvY3nva7vvIjnm7jlr7nkuo7lhbbniLboioLngrnvvIlcbiAgICAgICAgdGhpcy5pdGVtU3BpbmVJbml0aWFsUG9zID0gdGhpcy5pdGVtLnNwaW5lLm5vZGUucG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBvID0gdGhpcy5pbmZvLmpzb24ucmFuZ2U7XG4gICAgICAgIHRoaXMuYXRrUlIgPSBvICogbztcbiAgICAgICAgdGhpcy5sdnMgPSBbXTtcbiAgICAgICAgdGhpcy5ocCA9IHRoaXMuaXRlbS5tYXhIcDtcbiAgICAgICAgdGhpcy5zaGllbGRWYWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuaGFzRGllID0gITE7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgIHRoaXMuaXNQaHkgPSAhMDtcbiAgICAgICAgdGhpcy5pc01hZ2ljID0gITA7XG4gICAgICAgIHRoaXMuaXMzZ3ogPSBbMiwgNSwgOSwgMTBdLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09IG4uaXRlbS5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaXMyZ3ogPSBbMiwgNCwgOF0uc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT0gbi5pdGVtLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub24oXCJsdnVwXCIsIHRoaXMub25MdnVwLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOenu+WKqOebuOWFs+eahOWIneWni+WMllxuICAgICAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IDIwOyAvLyDoi7Hpm4Tnp7vliqjpgJ/luqZcbiAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgLy8g5YWz6ZSu77ya56Gu5L+dSGVyb+e7hOS7tuWcqOWIneWni+WMluWQjuWQr+eUqO+8jOS7peS+v3VwZGF0ZeaWueazleiDveiiq+iwg+eUqFxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgLy8g6LCD6K+V5pel5b+X77yM56Gu6K6k5Yid5aeL5YyW5a6M5oiQXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hlcm9dIGluaXRCeeWujOaIkO+8jElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGVuYWJsZWQ6XCIgKyB0aGlzLmVuYWJsZWQgKyBcIiwg5Yid5aeL5L2N572uOlwiLCB0aGlzLmluaXRpYWxQb3NpdGlvbik7XG4gICAgfSxcbiAgICBvbkx2dXA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW0uaW5kZXggPT0gdCkge1xuICAgICAgICAgICAgdGhpcy5pdGVtLmx2dXAoITEpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5odWIuc2hvd0x2dXBFZmZlY3QodGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QW5pbWF0aW9uOiBmdW5jdGlvbiAodCwgZSwgaSwgbikge1xuICAgICAgICAvLyB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbih0LCBlICsgKHRoaXMuaXRlbS5sdiArIDEpLCBpKTtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24odCwgZSwgaSk7XG4gICAgICAgIHRoaXMuc3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihuKTtcbiAgICB9LFxuICAgIGdldEF0azogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSBNYXRoLm1pbih0aGlzLmluZm8ubHYxLCB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyLmxlbmd0aCAtIDEpO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTJbZV07XG4gICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgaSAqPSB0aGlzLmluZm8uanNvbi5maWdodGx2dXAyW3QgLSAxXSAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IGNjLnB2ei5ydW50aW1lRGF0YS5nZXRCdWZmVmFsdWUoMik7XG4gICAgICAgIHZhciBvID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSgxMCk7XG4gICAgICAgIGlmIChvID4gMCkge1xuICAgICAgICAgICAgbiArPSBvICogY2MucHZ6LnJ1bnRpbWVEYXRhLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICAgIGkgKj0gMSArIDAuMDEgKiBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH0sXG4gICAgZ2V0U2hpZWxkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IE1hdGgubWluKHRoaXMuaW5mby5sdjEsIHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTIubGVuZ3RoIC0gMSk7XG4gICAgICAgIHZhciBpID0gdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMltlXTtcbiAgICAgICAgaWYgKHQgPiAwKSB7XG4gICAgICAgICAgICBpICo9IHRoaXMuaW5mby5qc29uLmZpZ2h0bHZ1cDJbdCAtIDFdIC8gMTAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH0sXG4gICAgcHVzaEx2QW5kQXRrOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuZ2V0QXRrKHQubHYpO1xuICAgICAgICB0aGlzLmx2cy5wdXNoKHtcbiAgICAgICAgICAgIGx2OiB0Lmx2LFxuICAgICAgICAgICAgYXRrOiBlXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcGxheUF0dEFuZERvOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiSGl0XCIsICExLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpLml0ZW0uY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXIoKTtcbiAgICAgICAgICAgIGkuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3BpbmUuc2V0RXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9kdW5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9ocFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2ppZ3VhbmdcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZ2V0U3VuU2hpbmVcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvc2hvb3RcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyeVNob290OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAvLyDlr7nkuo7pnIDopoHmlYzkurrnm67moIfnmoTmlLvlh7vlnovoi7Hpm4TvvIhJRCAxLDIsNCw1LDcsOSwxMu+8ie+8jOajgOafpeaYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAvLyB0b2RvIOS/ruaUueS4uuWFqOmDqOiLsembhOmDveajgOa1i1xuICAgICAgICB2YXIgbmVlZFRhcmdldENoZWNrID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDksIDEyXTtcbiAgICAgICAgaWYgKG5lZWRUYXJnZXRDaGVjay5pbmRleE9mKHRoaXMuaW5mby5pZCkgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIC8vIOazqOaEj++8muS4jeWcqOi/memHjOafpeaJvuebruagh++8jOWboOS4unVwZGF0ZU1vdmVtZW505bey57uP5Zyo55So5aSn6IyD5Zu05p+l5om+5LqGXG4gICAgICAgICAgICAvLyDov5nph4zlj6rmo4Dmn6XlvZPliY3mmK/lkKbmnInnm67moIfkuJTlnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50VGFyZ2V0IHx8IHRoaXMuY3VycmVudFRhcmdldC5ocCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5b2T5YmN55uu5qCH77yM55So5a6e6ZmF5pS75Ye76IyD5Zu05bCd6K+V5p+l5om+XG4gICAgICAgICAgICAgICAgdmFyIG5lYXJUYXJnZXQgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIHRoaXMuYXRrUlIpO1xuICAgICAgICAgICAgICAgIGlmICghbmVhclRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDmsqHmnInlnKjmlLvlh7vojIPlm7TlhoXnmoTmlYzkurrvvIzov5Tlm55mYWxzZeiuqeiLsembhOe7p+e7reenu+WKqFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG5lYXJUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOajgOafpeW9k+WJjeebruagh+aYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAgICAgdmFyIHRhcmdldFBvcyA9IHRoaXMuY3VycmVudFRhcmdldC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0aGlzLmN1cnJlbnRUYXJnZXQuY2VudGVyWSkpO1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gdGFyZ2V0UG9zLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gdGhpcy5hdGtSUikge1xuICAgICAgICAgICAgICAgIC8vIOebruagh+S4jeWcqOaUu+WHu+iMg+WbtOWGhe+8jOi/lOWbnmZhbHNl6K6p6Iux6ZuE57un57ut56e75YqoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIC8vIDPlj7foi7Hpm4TmlLnkuLrmma7pgJrmlLvlh7vlnotcbiAgICAgICAgICAgICAgICB2YXIgciA9IGUgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAhIXIgJiZcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucHVzaEx2QW5kQXRrKHQpLFxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5pc0F0dGFja2luZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCh0aGlzLmlzQXR0YWNraW5nID0gITApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoci5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmlzQXR0YWNraW5nID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmNoZWNrVG9TaG9vdChyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaS5pdGVtLmJ1bGxldENvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnR3ZWVuKGkuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAxNTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IDUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklLQm9uZSB8fCAodGhpcy5JS0JvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiSUtcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHdlZW4odGhpcy5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvKDAuMDY0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IChyLm5vZGUueCAtIHRoaXMubm9kZS54KSAvIDAuNzYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IChyLm5vZGUueSArIHIuY2VudGVyWSAtIHRoaXMubm9kZS55KSAvIDAuNzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdGFydCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgITApKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdikgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDYwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSAwLjE1O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig2MDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICs9IDAuMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMSArIGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmNyb3NzSXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaGVybyAmJiBlLmhlcm8uaHAgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5oZXJvLmFkZFNoaWVsZChlLm1heEhwICogdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcInNoaWVsZFwiLCBlLmhlcm8ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICB2YXIgbiA9IHRoaXMuc2NlbmUuY2hvb3NlTWluSHBIZXJvKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgISFuICYmXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaS5jaGVja0J1ZmYoODAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMS4yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbi5hZGRIcCh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0J1ZmZFZmZlY3QoXCJIUFwiLCBuLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgITApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGkuZ2V0QXRrKGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gMC4xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZigxMDAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSArPSAwLjI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ICo9IDEgKyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0J1ZmZFZmZlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm11c2ljXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIDUwKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLmdldEFuZ2VyQmFyV1BvcygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciArPSB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUudXBkYXRlQW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gITA7XG4gICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTEwNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLmxhc3RCdWxsZXRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgxID09IGkubGFzdEJ1bGxldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkubGFzdEJ1bGxldENvdW50ID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gY2MuaW5zdGFudGlhdGUoaS5sYW5kTWluZU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBjYy52MihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLmdldEhlcm9lc01heE1hcmdpblgoKSArIGNjLm1hdGgucmFuZG9tUmFuZ2UoMCwgMTUwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5tYXRoLnJhbmRvbVJhbmdlKGkuc2NlbmUuZ3JvdW5kQXJlYUxCLnkgKyAxMjAsIGkuc2NlbmUuZ3JvdW5kQXJlYVRSLnkgLSAxMjApXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IGkubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnBhcmVudCA9IGkuc2NlbmUub2Jqc1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnpJbmRleCA9IC10Lnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IHQuZ2V0Q29tcG9uZW50KGNjLkNvbGxpZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uZW5hYmxlZCA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSB0LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG8uZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueCA9IChlLnggLSB0LngpIC8gdC5zY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueSA9IChlLnkgLSB0LnkpIC8gdC5zY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMueCA9IE1hdGgubWF4KDAsIHMueCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLnNldEFuaW1hdGlvbigwLCBcInpkMTFfMVwiLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucG9zaXRpb24gPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4uZW5hYmxlZCA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0QW5pbWF0aW9uKDAsIFwiemQxMV8yXCIsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0OyBuKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgdmFyIG8gPSB0aGlzLmNoZWNrQnVmZigxMjA0KSA/IDIgOiAxLFxuICAgICAgICAgICAgICAgICAgICBzID0gdGhpcy5zY2VuZS5jaG9vc2VFbmVteXModGhpcywgdGhpcy5hdGtSUiwgbyk7XG4gICAgICAgICAgICAgICAgaWYgKDAgPT0gcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRoaXMuc2NlbmUuZ2V0SGVyb2VzTWF4TWFyZ2luWCgpLFxuICAgICAgICAgICAgICAgICAgICBhID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxICE9IGEgfHwgaS5jaGVja0J1ZmYoMTIwNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gc1tNYXRoLm1pbihzLmxlbmd0aCAtIDEsIGEpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gdC5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCB0LmNlbnRlclkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gY2MudjIoTWF0aC5taW4oYywgZS54KSwgZS55KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gaS5zY2VuZS5vYmpzUm9vdC5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIobik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IGNjLmluc3RhbnRpYXRlKGkuemQubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IHIuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgci5wYXJlbnQgPSBpLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICAgICAgICAgICAgICAgICAgci5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucG9zaXRpb24gPSBpLm5vZGUucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICBoLnNwaW5lLnNldEFuaW1hdGlvbigwLCBoLnNwaW5lLmRlZmF1bHRBbmltYXRpb24sICEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gaC5zcGluZS5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHUgPSBoLnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnggPSB1Lng7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnkgPSB1Lnk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLmluaXRCeShpLnNjZW5lLCBpLml0ZW0ubHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5hID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguYXR0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNob3dKc0VmZmVjdChjYy52MihuLnggKyAxMDAgKiB0LCBuLnkpLCBpLmluZm8uaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQ4ICogdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDE7IGwgPCA1OyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9ndW56aVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGErKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgciA9IGUgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICEhciAmJlxuICAgICAgICAgICAgKHRoaXMucHVzaEx2QW5kQXRrKHQpLFxuICAgICAgICAgICAgIXRoaXMuaXNBdHRhY2tpbmcgJiZcbiAgICAgICAgICAgICAgICAoKHRoaXMuaXNBdHRhY2tpbmcgPSAhMCksXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmlzQXR0YWNraW5nID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5jaGVja1RvU2hvb3Qocik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLml0ZW0uYnVsbGV0Q291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnR3ZWVuKGkuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IDUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB0aGlzLklLQm9uZSB8fCAodGhpcy5JS0JvbmUgPSB0aGlzLnNwaW5lLmZpbmRCb25lKFwiSUtcIikpLFxuICAgICAgICAgICAgICAgIGNjXG4gICAgICAgICAgICAgICAgICAgIC50d2Vlbih0aGlzLklLQm9uZSlcbiAgICAgICAgICAgICAgICAgICAgLnRvKDAuMDY0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAoci5ub2RlLnggLSB0aGlzLm5vZGUueCkgLyAwLjc2LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogKHIubm9kZS55ICsgci5jZW50ZXJZIC0gdGhpcy5ub2RlLnkpIC8gMC43NlxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3RhcnQoKSxcbiAgICAgICAgICAgICAgICAhMCkpXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBjaGVja1RvU2hvb3Q6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICgwICE9IHRoaXMubHZzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuemQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMubHZzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSB0IHx8IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG9vdChpLCB0aGlzLml0ZW0ubHYsIGUuYXRrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5sdnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuc2V0VGltZW91dCh0aGlzLmNoZWNrVG9TaG9vdC5iaW5kKHRoaXMpLCA4MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFNob290QVBvczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5HUEJvbmUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkdQQm9uZSA9IHRoaXMuc3BpbmUuZmluZEJvbmUoXCJHUFwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IGNjLnYyKHRoaXMuR1BCb25lLndvcmxkWCwgdGhpcy5HUEJvbmUud29ybGRZKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BpbmUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIodCk7XG4gICAgfSxcbiAgICBzaG9vdDogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgaWYgKDQgPT0gdGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICB2YXIgbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDEpKSB7XG4gICAgICAgICAgICAgICAgbiA9IDk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4gPSA1O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3ROKG4sIHQsIGUsIGkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG9vdE4oMywgdCwgZSwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoNyA9PSB0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaG9vdElLKHQsIGUsIGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCB0aGlzLnNob290MSh0LCBlLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvb3QxOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXMuZ2V0U2hvb3RBUG9zKCk7XG4gICAgICAgIHZhciBvID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihuKTtcbiAgICAgICAgdmFyIHMgPSB0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHQuY2VudGVyWSkpLnN1YihvKTtcbiAgICAgICAgaWYgKHMueCA8IDApIHtcbiAgICAgICAgICAgIHMueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGMgPSBNYXRoLmF0YW4yKHMueSwgcy54KTtcbiAgICAgICAgdmFyIGEgPSB0aGlzLnpkO1xuICAgICAgICB2YXIgciA9IGNjLmluc3RhbnRpYXRlKGEubm9kZSk7XG4gICAgICAgIHIucGFyZW50ID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdDtcbiAgICAgICAgci5hY3RpdmUgPSAhMDtcbiAgICAgICAgci5wb3NpdGlvbiA9IG87XG4gICAgICAgIHZhciBoID0gci5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDQpKSB7XG4gICAgICAgICAgICBoLmhpdENvdW50ID0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNTAzKSkge1xuICAgICAgICAgICAgaC5oaXRDb3VudCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaC5pbml0QnkodGhpcy5zY2VuZSwgZSk7XG4gICAgICAgIGguYSA9IHRoaXM7XG4gICAgICAgIGlmICgxMyA9PSB0aGlzLmluZm8uaWQgJiYgMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgaC5hdHQgPSBpIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGguYXR0ID0gaTtcbiAgICAgICAgfVxuICAgICAgICBoLm1vdmVCeUFuZ2xlKCgxODAgKiBjKSAvIE1hdGguUEkpO1xuICAgIH0sXG4gICAgc2hvb3ROOiBmdW5jdGlvbiAodCwgZSwgaSwgbikge1xuICAgICAgICB2YXIgbyA9IHRoaXMuZ2V0U2hvb3RBUG9zKCk7XG4gICAgICAgIHZhciBzID0gdGhpcy5zY2VuZS5idWxsZXRzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgdmFyIGMgPSBlLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIGUuY2VudGVyWSkpLnN1YihzKTtcbiAgICAgICAgaWYgKGMueCA8IDApIHtcbiAgICAgICAgICAgIGMueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSAoMTgwICogTWF0aC5hdGFuMihjLnksIGMueCkpIC8gTWF0aC5QSTtcbiAgICAgICAgdmFyIHI7XG4gICAgICAgIGlmICh0ID4gNSkge1xuICAgICAgICAgICAgciA9IFswLCAtMTAsIC0yMCwgLTMwLCA0MCwgMTAsIDIwLCAzMCwgNDBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgciA9IFswLCAtMTUsIDE1LCAtMzAsIDMwXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBoID0gMDsgaCA8IHQ7IGgrKykge1xuICAgICAgICAgICAgdmFyIGQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnpkLm5vZGUpO1xuICAgICAgICAgICAgZC5wYXJlbnQgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICAgICAgZC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgIGQucG9zaXRpb24gPSBzO1xuICAgICAgICAgICAgdmFyIHUgPSBkLmdldENvbXBvbmVudChcIkJ1bGxldFwiKTtcbiAgICAgICAgICAgIHUuaW5pdEJ5KHRoaXMuc2NlbmUsIGkpO1xuICAgICAgICAgICAgdS5hID0gdGhpcztcbiAgICAgICAgICAgIHUuYXR0ID0gbjtcbiAgICAgICAgICAgIHUubW92ZUJ5QW5nbGUoYSArIHJbaF0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG9vdElLOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHZhciBvID0gdGhpcy5nZXRTaG9vdEFQb3MoKTtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG8pO1xuICAgICAgICB2YXIgYyA9IHQubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIoMCwgdC5jZW50ZXJZKSk7XG4gICAgICAgIHZhciBhID0gY2MuaW5zdGFudGlhdGUodGhpcy56ZC5ub2RlKTtcbiAgICAgICAgdmFyIHIgPSBhLmdldENvbXBvbmVudChcIkJ1bGxldFwiKTtcbiAgICAgICAgYS5wYXJlbnQgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICBhLmFjdGl2ZSA9ICEwO1xuICAgICAgICBhLnBvc2l0aW9uID0gcztcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwMikpIHtcbiAgICAgICAgICAgIGEuZ2V0Q29tcG9uZW50KFwiRXZlbnRDb2xsaWRlclwiKS5jb2xsaWRlci5yYWRpdXMgKj0gMS4zO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoID0gci5zcGluZS5zZXRBbmltYXRpb24oMCwgci5zcGluZS5kZWZhdWx0QW5pbWF0aW9uLCAhMCk7XG4gICAgICAgIHIuc3BpbmUuc2V0VHJhY2tFdmVudExpc3RlbmVyKGgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG4uc2NlbmUuc2hvd0pzRWZmZWN0KHQubm9kZS5wb3NpdGlvbiwgbi5pbmZvLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBkID0gci5zcGluZS5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICB2YXIgdSA9IHIuc3BpbmUubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihjKTtcbiAgICAgICAgZC54ID0gdS54O1xuICAgICAgICBkLnkgPSB1Lnk7XG4gICAgICAgIGQueCA9IE1hdGgubWF4KDAsIGQueCk7XG4gICAgICAgIHIuaW5pdEJ5KHRoaXMuc2NlbmUsIGUpO1xuICAgICAgICByLmEgPSB0aGlzO1xuICAgICAgICByLmF0dCA9IGk7XG4gICAgfSxcbiAgICBjaGVja0hlcm9CdWZmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhMTtcbiAgICB9LFxuICAgIGNoZWNrQnVmZjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSAodCAtICh0ICUgMTAwKSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzLmluZm8uaWQgPT0gZSAmJiBjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZih0KTtcbiAgICB9LFxuICAgIGRvQnVsbGV0QXR0TG9naWM6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHZhciBpID0gdC5hdHQ7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNTA0KSkge1xuICAgICAgICAgICAgaSAqPSAxLjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMTAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMjAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLndlYWtOb2RlICYmIHRoaXMuaXNQaHkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQaHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaSAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzM2d6KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSAtIDRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pczJneikge1xuICAgICAgICAgICAgICAgICAgICBpICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEgLSAxMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDcml0KHQsIGUpKSB7XG4gICAgICAgICAgICBuID0gMTtcbiAgICAgICAgICAgIGkgKj0gdGhpcy5nZXRDcml0UGx1cyh0LCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpICo9IGNjLm1hdGgucmFuZG9tUmFuZ2UoMC45NSwgMS4wNSk7XG4gICAgICAgIGUuaHVydEJ5KHRoaXMsIGkpO1xuICAgICAgICB0aGlzLnNjZW5lLnNob3dFbmVteUh1cnROdW0obiwgZS5ub2RlLnBvc2l0aW9uLCBpKTtcbiAgICAgICAgaWYgKHQuanNFZmZFeGNsdXNpdmUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNob3dKc0VmZmVjdChlLm5vZGUucG9zaXRpb24sIHRoaXMuaW5mby5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnN0YXRzW3RoaXMuaW5mby5pZF0gKz0gaTtcbiAgICAgICAgaWYgKHQuYnVmZlNsb3cpIHtcbiAgICAgICAgICAgIGUuYWRkQnVmZlNsb3coKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodC5idWZmSWNlICYmIHRoaXMuY2hlY2tCdWZmKDEyMDMpICYmIE1hdGgucmFuZG9tKCkgPCAwLjIpIHtcbiAgICAgICAgICAgIGUuYWRkQnVmZkljZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDQpICYmIE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcbiAgICAgICAgICAgIGUuYWRkQnVmZldlYWsoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjA0KSkge1xuICAgICAgICAgICAgZS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwMykpIHtcbiAgICAgICAgICAgIGUucmVwdWxzZSh0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMTAyKSkge1xuICAgICAgICAgICAgZS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoZWNrQ3JpdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNTAxKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXR0Q291bnRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0Q291bnRlciA9IHRoaXMuYXR0Q291bnRlciArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0Q291bnRlciA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdDtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDIpKSB7XG4gICAgICAgICAgICAgICAgdCA9IDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHQgPSAzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXR0Q291bnRlciA+PSB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gITA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAyKSkge1xuICAgICAgICAgICAgZSArPSAwLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig0MDQpKSB7XG4gICAgICAgICAgICBlICs9IDAuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwMykpIHtcbiAgICAgICAgICAgIGUgKz0gMC4xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgZTtcbiAgICB9LFxuICAgIGdldENyaXRQbHVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gMS41O1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAzKSkge1xuICAgICAgICAgICAgdCArPSAwLjU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfSxcbiAgICBkb0xhbmRNaW5lc0xvZ2ljOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHQuZ2V0Q29tcG9uZW50KFwiRW5lbXlcIik7XG4gICAgICAgIGlmIChlICYmIGUuaHAgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRvQnVsbGV0QXR0TG9naWMoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhdHQ6IHRoaXMuZ2V0QXRrKHRoaXMuaXRlbS5sdiksXG4gICAgICAgICAgICAgICAgICAgIGx2OiB0aGlzLml0ZW0ubHYsXG4gICAgICAgICAgICAgICAgICAgIGpzRWZmRXhjbHVzaXZlOiAhMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25MYW5kbWluZXNDb2xsaXNpb246IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIGlmIChlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHZhciBpID0gdC5nZXRDb21wb25lbnQoXCJFbmVteVwiKTtcbiAgICAgICAgICAgIGlmIChpICYmIGkuaHAgPiAwKSB7XG4gICAgICAgICAgICAgICAgZS5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSBlLm5vZGUuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IGNjLmZpbmQoXCJyYW5nZVwiLCBlLm5vZGUpLmdldENvbXBvbmVudChjYy5Db2xsaWRlcik7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnV0aWxzLm1hbnVhbGx5Q2hlY2tDb2xsaWRlcihvKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLnNob3dKc0VmZmVjdChlLm5vZGUucG9zaXRpb24sIHRoaXMuaW5mby5pZCk7XG4gICAgICAgICAgICAgICAgbi5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYWRkSHA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuaHAgPSBNYXRoLm1pbih0aGlzLml0ZW0ubWF4SHAsIHRoaXMuaHAgKyB0KTtcbiAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZUhwKHRoaXMuaHAgLyB0aGlzLml0ZW0ubWF4SHApO1xuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZUhwKCEwKTtcbiAgICB9LFxuICAgIGRlbEhwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmhwID0gTWF0aC5tYXgoMCwgdGhpcy5ocCAtIHQpO1xuICAgICAgICB0aGlzLml0ZW0udXBkYXRlSHAodGhpcy5ocCAvIHRoaXMuaXRlbS5tYXhIcCk7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlSHAoITApO1xuICAgIH0sXG4gICAgYWRkU2hpZWxkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLnNoaWVsZFZhbHVlID0gTWF0aC5taW4odGhpcy5pdGVtLm1heEhwLCB0aGlzLnNoaWVsZFZhbHVlICsgdCk7XG4gICAgICAgIHRoaXMuaXRlbS51cGRhdGVTaGllbGQodGhpcy5zaGllbGRWYWx1ZSAvIHRoaXMuaXRlbS5tYXhIcCk7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlU2hpZWxkKCk7XG4gICAgfSxcbiAgICBodXJ0Qnk6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIC8vIOWPl+S8pFxuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIGlmICghKHRoaXMuaGFzRW5kZWQgfHwgdGhpcy5ocCA8PSAwKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hpZWxkVmFsdWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSBNYXRoLm1pbih0aGlzLnNoaWVsZFZhbHVlLCBpKTtcbiAgICAgICAgICAgICAgICBpIC09IG87XG4gICAgICAgICAgICAgICAgdGhpcy5zaGllbGRWYWx1ZSAtPSBvO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS51cGRhdGVTaGllbGQodGhpcy5zaGllbGRWYWx1ZSAvIHRoaXMuaXRlbS5tYXhIcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA+IDAgJiYgKHRoaXMuZGVsSHAoaSksIHRoaXMuaHAgPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9XG4gICAgICAgICAgICAgICAgICAgICFjYy5wdnoucnVudGltZURhdGEuaGFzVXNlUmVib3JuICYmXG4gICAgICAgICAgICAgICAgICAgICg4ID09IHRoaXMuaW5mby5pZCB8fCB0aGlzLnNjZW5lLmhhc0hlcm8oOCkpICYmXG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDgwMyk7XG4gICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc1VzZVJlYm9ybiA9ICEwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOihgOadoVxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW0uYmFyTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJEZWFkXCIsICExLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnJlYm9ybihjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig4MDQpID8gMSA6IDAuMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnNob3dCdWZmRWZmZWN0KFwicmV2aXZlXCIsICExKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uaGFzRGllID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnNjZW5lLmNoZWNrSXNGYWlsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVib3JuOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyDlpI3mtLtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcImZ1aHVvXCIsICExLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlLmhwID0gZS5pdGVtLm1heEhwICogdDtcbiAgICAgICAgICAgIGUuaXRlbS51cGRhdGVIcCgpO1xuICAgICAgICAgICAgZS5oYXNEaWUgPSAhMTtcbiAgICAgICAgICAgIGUuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2hvd0J1ZmZFZmZlY3Q6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IGUpIHtcbiAgICAgICAgICAgIGUgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGRCdWZmUHJlZmFiXG4gICAgICAgICAgICAgICAgLmFkZE5vZGVUbyh0aGlzLml0ZW0uc3BpbmUubm9kZSwgY2MuVmVjMi5aRVJPKVxuICAgICAgICAgICAgICAgIC5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pXG4gICAgICAgICAgICAgICAgLnNldEFuaW1hdGlvbigwLCB0LCAhMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNob3dCdWZmRWZmZWN0KHQsIHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8g56Gu5L+d5Yid5aeL5YyW5a6M5oiQXG4gICAgICAgIGlmICghdGhpcy5pc0luaXRpYWxpemVkIHx8ICF0aGlzLnNjZW5lKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubG9nZ2VkTm90SW5pdCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltIZXJvIFVwZGF0ZV0gSUTmnKrnn6UsIOacquWIneWni+WMluaIlnNjZW5l5LiN5a2Y5ZyoXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkTm90SW5pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2NlbmUgJiYgIXRoaXMuc2NlbmUudGltZVBhdXNlZCAmJiAhKHRoaXMuc2NlbmUuaGFzRW5kZWQgfHwgdGhpcy5ocCA8PSAwIHx8IHRoaXMuaGFzRGllKSkge1xuICAgICAgICAgICAgdmFyIGUgPSB0ICogY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuZ2V0VGltZVNjYWxlKCk7XG4gICAgICAgICAgICAvLyDmr4/np5Llj6rmiZPljbDkuIDmrKHml6Xlv5fvvIzpgb/lhY3liLflsY9cbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0TG9nVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdExvZ1RpbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VGltZSAtIHRoaXMubGFzdExvZ1RpbWUgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBVcGRhdGVdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGVuYWJsZWQ6XCIgKyB0aGlzLmVuYWJsZWQgKyBcIiwg5L2N572uOlwiICsgdGhpcy5ub2RlLnBvc2l0aW9uICsgXCIsIOaVjOS6uuaVsDpcIiArICh0aGlzLnNjZW5lLmVuZW15cyA/IHRoaXMuc2NlbmUuZW5lbXlzLmxlbmd0aCA6IDApICsgXCIsIGlzTW92aW5nOlwiICsgdGhpcy5pc01vdmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TG9nVGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNb3ZlbWVudChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTW92ZW1lbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOajgOafpeaYr+WQpuacieaVjOS6uuWtmOWcqFxuICAgICAgICBpZiAoIXRoaXMuc2NlbmUuZW5lbXlzIHx8IHRoaXMuc2NlbmUuZW5lbXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8g5rKh5pyJ5pWM5Lq65pe277yM6L+U5Zue5Yid5aeL5L2N572uXG4gICAgICAgICAgICB0aGlzLnJldHVyblRvSW5pdGlhbFBvc2l0aW9uKHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDlr7vmib7mnIDov5HnmoTmlYzkurrvvIjmiYDmnInoi7Hpm4Tpg73np7vliqjvvIzkuI3ljLrliIbnsbvlnovvvIlcbiAgICAgICAgdmFyIGUgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIDk5OTk5OSk7XG4gICAgICAgIGlmIChlICYmIGUuaHAgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlO1xuICAgICAgICAgICAgdmFyIGkgPSBlLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIGUuY2VudGVyWSkpO1xuICAgICAgICAgICAgdmFyIG4gPSBpLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgdmFyIG8gPSBuLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIGlmIChvIDw9IHRoaXMuYXRrUlIpIHtcbiAgICAgICAgICAgICAgICAvLyDlnKjmlLvlh7vojIPlm7TlhoXvvIzlgZzmraLnp7vliqhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDliLDovr7mlLvlh7vojIPlm7RcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4jeeri+WNs+WIh+aNouWKqOeUu++8jOiuqeaUu+WHu+WKqOeUu+aOp+WItlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5LiN5Zyo5pS75Ye76IyD5Zu05YaF77yM57un57ut5ZCR5pWM5Lq656e75YqoXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOW8gOWni+WQkeaVjOS6uuenu+WKqFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+q5Zyo6Z2e5pS75Ye754q25oCB5pe25YiH5o2i5Li656e75Yqo5Yqo55S7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJXYWxrXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDorqHnrpfnp7vliqjmlrnlkJHlkoznp7vliqhcbiAgICAgICAgICAgICAgICB2YXIgcyA9IE1hdGguYXRhbjIobi55LCBuLngpO1xuICAgICAgICAgICAgICAgIHZhciBjID0gY2MudjIodGhpcy5tb3ZlU3BlZWQgKiBNYXRoLmNvcyhzKSAqIHQsIHRoaXMubW92ZVNwZWVkICogTWF0aC5zaW4ocykgKiB0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDkvY3nva5cbiAgICAgICAgICAgICAgICB2YXIgb2xkUG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChjKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLXRoaXMubm9kZS55O1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5iYXJOb2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtLmJhck5vZGUucG9zaXRpb24uYWRkKGMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtU3BpbmVQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiwg+ivle+8muaJk+WNsOenu+WKqOS/oeaBr++8iOavj+enkuS4gOasoe+8iVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5sYXN0TW92ZUxvZ1RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZUxvZ1RpbWUgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbm93VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vd1RpbWUgLSB0aGlzLmxhc3RNb3ZlTG9nVGltZSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBNb3ZlXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCDku45cIiArIG9sZFBvcyArIFwiIOenu+WKqOWIsFwiICsgdGhpcy5ub2RlLnBvc2l0aW9uICsgXCIsIOenu+WKqOmHjzpcIiArIGMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlTG9nVGltZSA9IG5vd1RpbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOabtOaWsHBvc2l0aW9uMueUqOS6juaVjOS6uueahOaUu+WHu+WIpOaWrVxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24yID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLml0ZW0uYXR0T2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOayoeacieacieaViOaVjOS6uu+8jOi/lOWbnuWIneWni+S9jee9rlxuICAgICAgICAgICAgdGhpcy5yZXR1cm5Ub0luaXRpYWxQb3NpdGlvbih0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSXRlbVNwaW5lUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5bCGSGVyb+iKgueCueeahOS4lueVjOWdkOagh+i9rOaNouS4uml0ZW0uc3BpbmXniLboioLngrnnmoTmnKzlnLDlnZDmoIdcbiAgICAgICAgaWYgKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUgJiYgdGhpcy5pdGVtLnNwaW5lLm5vZGUpIHtcbiAgICAgICAgICAgIC8vIOiOt+WPlkhlcm/oioLngrnnmoTkuJbnlYzlnZDmoIdcbiAgICAgICAgICAgIHZhciBoZXJvV29ybGRQb3MgPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgLy8g6L2s5o2i5Li6aXRlbS5zcGluZeeItuiKgueCueeahOacrOWcsOWdkOagh1xuICAgICAgICAgICAgdmFyIHNwaW5lTG9jYWxQb3MgPSB0aGlzLml0ZW0uc3BpbmUubm9kZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIoaGVyb1dvcmxkUG9zKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6LCD6K+V77ya6aaW5qyh56e75Yqo5pe25omT5Y2w5pel5b+XXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9nZ2VkU3BpbmVVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOesrOS4gOasoeWQjOatpXNwaW5l5L2N572uIC0gSGVyb+S4lueVjOWdkOaghzpcIiwgaGVyb1dvcmxkUG9zLCBcInNwaW5l5pys5Zyw5Z2Q5qCHOlwiLCBzcGluZUxvY2FsUG9zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFNwaW5lVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pu05pawaXRlbS5zcGluZeeahOS9jee9rlxuICAgICAgICAgICAgdGhpcy5pdGVtLnNwaW5lLm5vZGUucG9zaXRpb24gPSBzcGluZUxvY2FsUG9zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZFNwaW5lRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0hlcm9dIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5peg5rOV5ZCM5q2lc3BpbmXkvY3nva7vvIFpdGVtOlwiLCAhIXRoaXMuaXRlbSwgXCJzcGluZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSksIFwic3BpbmUubm9kZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSAmJiB0aGlzLml0ZW0uc3BpbmUubm9kZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkU3BpbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJldHVyblRvSW5pdGlhbFBvc2l0aW9uOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZGlzdFNxciA9IHRoaXMubm9kZS5wb3NpdGlvbi5zdWIodGhpcy5pbml0aWFsUG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICBpZiAoZGlzdFNxciA+IDEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIldhbGtcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5pbml0aWFsUG9zaXRpb24uc3ViKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB2YXIgciA9IE1hdGguYXRhbjIoYS55LCBhLngpO1xuICAgICAgICAgICAgdmFyIGggPSBjYy52Mih0aGlzLm1vdmVTcGVlZCAqIE1hdGguY29zKHIpICogdCwgdGhpcy5tb3ZlU3BlZWQgKiBNYXRoLnNpbihyKSAqIHQpO1xuICAgICAgICAgICAgaWYgKGgubGVuZ3RoU3FyKCkgPiBhLmxlbmd0aFNxcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5pbml0aWFsUG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZS56SW5kZXggPSAtdGhpcy5ub2RlLnk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOOAkOWFs+mUruOAkeWQjOatpeabtOaWsGl0ZW0uc3BpbmXnmoTmmL7npLrkvY3nva5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbVNwaW5lUG9zaXRpb24oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbjIgPSB0aGlzLm5vZGUucG9zaXRpb24uYWRkKHRoaXMuaXRlbS5hdHRPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8g6L+U5Zue5Yid5aeL5L2N572u5ZCO77yM5oGi5aSNaXRlbS5zcGluZeWIsOWIneWni+S9jee9rlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnNwaW5lICYmIHRoaXMuaXRlbS5zcGluZS5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5zcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtU3BpbmVJbml0aWFsUG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTsiXX0=