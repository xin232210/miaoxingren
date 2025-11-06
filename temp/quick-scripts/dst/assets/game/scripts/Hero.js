
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
    if (this.zd) {
      this.zd.node.active = !1;
    }

    if (this.zd2) {
      this.zd2.node.active = !1;
    }

    if (this.landMineNode) {
      this.landMineNode.active = !1;
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
        this.playAttAndDo(function () {
          var t = Math.floor(i.getAtk(i.item.lv));

          if (i.checkBuff(302)) {
            t += 1;
          }

          if (i.checkBuff(304) && Math.random() < 0.25) {
            t *= 2;
          }

          cc.pvz.runtimeData.addMoney(t);
          i.scene.showBuffEffect("money", i.node.position, i.scene.getMoneyWPos());
        });
        return !0;

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

    if (!this.scene.timePaused && !(this.scene.hasEnded || this.hp <= 0 || this.hasDie)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSGVyby5qcyJdLCJuYW1lcyI6WyIkYnVsbGV0IiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiemQiLCJ6ZDIiLCJsYW5kTWluZU5vZGUiLCJOb2RlIiwib25Mb2FkIiwibm9kZSIsImFjdGl2ZSIsImVuYWJsZWQiLCJzdGFydCIsImluaXRCeSIsInQiLCJlIiwiaSIsIm4iLCJzY2VuZSIsImluZm8iLCJpdGVtIiwiaXRlbVNwaW5lSW5pdGlhbFBvcyIsInBvc2l0aW9uIiwiY2xvbmUiLCJvIiwianNvbiIsInJhbmdlIiwiYXRrUlIiLCJsdnMiLCJocCIsIm1heEhwIiwic2hpZWxkVmFsdWUiLCJoYXNEaWUiLCJzZXRBbmltYXRpb24iLCJpc1BoeSIsImlzTWFnaWMiLCJpczNneiIsInNvbWUiLCJpZCIsImlzMmd6IiwiYnV0bGVyIiwib24iLCJvbkx2dXAiLCJpbml0aWFsUG9zaXRpb24iLCJtb3ZlU3BlZWQiLCJjdXJyZW50VGFyZ2V0IiwiaXNNb3ZpbmciLCJoYXNSZWFjaGVkQXR0YWNrUmFuZ2UiLCJpc0luaXRpYWxpemVkIiwiY29uc29sZSIsImxvZyIsImluZGV4IiwibHZ1cCIsImh1YiIsInNob3dMdnVwRWZmZWN0IiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwiVmVjMiIsIlpFUk8iLCJzZXRDb21wbGV0ZUxpc3RlbmVyIiwiZ2V0QXRrIiwiTWF0aCIsIm1pbiIsImx2MSIsImF0dHJpYnV0ZTIiLCJsZW5ndGgiLCJmaWdodGx2dXAyIiwicHZ6IiwicnVudGltZURhdGEiLCJnZXRCdWZmVmFsdWUiLCJpdGVtcyIsImdldFNoaWVsZCIsInB1c2hMdkFuZEF0ayIsImx2IiwicHVzaCIsImF0ayIsInBsYXlBdHRBbmREbyIsImNoZWNrVG9TdGFydFJlbG9hZFRpbWVyIiwic2V0RXZlbnRMaXN0ZW5lciIsInBsYXlTb3VuZCIsInBsYXlFZmZlY3RBc3luYyIsInRyeVNob290IiwibmVlZFRhcmdldENoZWNrIiwiaW5kZXhPZiIsIm5lYXJUYXJnZXQiLCJjaG9vc2VFbmVteSIsInRhcmdldFBvcyIsImFkZCIsInYyIiwiY2VudGVyWSIsImRpc3RhbmNlIiwic3ViIiwibGVuZ3RoU3FyIiwiZmxvb3IiLCJjaGVja0J1ZmYiLCJyYW5kb20iLCJhZGRNb25leSIsInNob3dCdWZmRWZmZWN0IiwiZ2V0TW9uZXlXUG9zIiwiaGFzRW5hYmxlQnVmZiIsImNyb3NzSXRlbXMiLCJmb3JFYWNoIiwiaGVybyIsImFkZFNoaWVsZCIsImNob29zZU1pbkhwSGVybyIsImFkZEhwIiwiZ2V0QW5nZXJCYXJXUG9zIiwiYW5nZXIiLCJ1cGRhdGVBbmdlciIsImxhc3RCdWxsZXRDb3VudCIsImluc3RhbnRpYXRlIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsIm1hdGgiLCJyYW5kb21SYW5nZSIsImdyb3VuZEFyZWFMQiIsInkiLCJncm91bmRBcmVhVFIiLCJwYXJlbnQiLCJvYmpzUm9vdCIsInpJbmRleCIsImdldENvbXBvbmVudCIsIkNvbGxpZGVyIiwicyIsImZpbmRCb25lIiwieCIsInNjYWxlIiwibWF4IiwiY2hvb3NlRW5lbXlzIiwiYyIsImEiLCJyIiwiaCIsImJ1bGxldHNSb290IiwiZGVmYXVsdEFuaW1hdGlvbiIsImQiLCJ1IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJhdHQiLCJwIiwic2V0VGltZW91dCIsInNob3dKc0VmZmVjdCIsImwiLCJpc0F0dGFja2luZyIsImlzVmFsaWQiLCJjaGVja1RvU2hvb3QiLCJidWxsZXRDb3VudCIsInR3ZWVuIiwiSUtCb25lIiwidG8iLCJzaGlmdCIsInNob290IiwiYmluZCIsImdldFNob290QVBvcyIsIkdQQm9uZSIsIndvcmxkWCIsIndvcmxkWSIsInNob290TiIsInNob290SUsiLCJzaG9vdDEiLCJhdGFuMiIsImhpdENvdW50IiwibW9kZSIsIm1vdmVCeUFuZ2xlIiwiUEkiLCJjb2xsaWRlciIsInJhZGl1cyIsInNldFRyYWNrRXZlbnRMaXN0ZW5lciIsImNoZWNrSGVyb0J1ZmYiLCJkb0J1bGxldEF0dExvZ2ljIiwid2Vha05vZGUiLCJhY3RCdWZmMSIsImNoZWNrQ3JpdCIsImdldENyaXRQbHVzIiwiaHVydEJ5Iiwic2hvd0VuZW15SHVydE51bSIsImpzRWZmRXhjbHVzaXZlIiwic3RhdHMiLCJidWZmU2xvdyIsImFkZEJ1ZmZTbG93IiwiYnVmZkljZSIsImFkZEJ1ZmZJY2UiLCJhZGRCdWZmV2VhayIsInJlcHVsc2UiLCJhdHRDb3VudGVyIiwiZG9MYW5kTWluZXNMb2dpYyIsIm9uTGFuZG1pbmVzQ29sbGlzaW9uIiwiZmluZCIsInV0aWxzIiwibWFudWFsbHlDaGVja0NvbGxpZGVyIiwiZGVzdHJveSIsInVwZGF0ZUhwIiwiZGVsSHAiLCJ1cGRhdGVTaGllbGQiLCJoYXNFbmRlZCIsImhhc1VzZVJlYm9ybiIsImhhc0hlcm8iLCJiYXJOb2RlIiwicmVib3JuIiwiY2hlY2tJc0ZhaWwiLCJhZGRCdWZmUHJlZmFiIiwiYWRkTm9kZVRvIiwidXBkYXRlIiwibG9nZ2VkTm90SW5pdCIsIndhcm4iLCJ0aW1lUGF1c2VkIiwiZGlyZWN0b3IiLCJnZXRTY2hlZHVsZXIiLCJnZXRUaW1lU2NhbGUiLCJsYXN0TG9nVGltZSIsImN1cnJlbnRUaW1lIiwiRGF0ZSIsIm5vdyIsImVuZW15cyIsInVwZGF0ZU1vdmVtZW50IiwicmV0dXJuVG9Jbml0aWFsUG9zaXRpb24iLCJjb3MiLCJzaW4iLCJvbGRQb3MiLCJ1cGRhdGVJdGVtU3BpbmVQb3NpdGlvbiIsImxhc3RNb3ZlTG9nVGltZSIsIm5vd1RpbWUiLCJwb3NpdGlvbjIiLCJhdHRPZmZzZXQiLCJoZXJvV29ybGRQb3MiLCJzcGluZUxvY2FsUG9zIiwibG9nZ2VkU3BpbmVVcGRhdGUiLCJsb2dnZWRTcGluZUVycm9yIiwiZXJyb3IiLCJkaXN0U3FyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLE9BQU8sR0FBR0MsT0FBTyxDQUFD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ZSxDQUVmOztRQUNBLElBQUksS0FBSzFCLElBQUwsSUFBYSxLQUFLQSxJQUFMLENBQVVuQixLQUF2QixJQUFnQyxLQUFLbUIsSUFBTCxDQUFVbkIsS0FBVixDQUFnQlEsSUFBcEQsRUFBMEQ7VUFDdEQsS0FBS1csSUFBTCxDQUFVbkIsS0FBVixDQUFnQlEsSUFBaEIsQ0FBcUJhLFFBQXJCLEdBQWdDLEtBQUtELG1CQUFMLENBQXlCRSxLQUF6QixFQUFoQztRQUNIOztRQUNELElBQUksQ0FBQyxLQUFLc0gsV0FBVixFQUF1QjtVQUNuQixLQUFLNUcsWUFBTCxDQUFrQixDQUFsQixFQUFxQixNQUFyQixFQUE2QixDQUFDLENBQTlCLEVBQWlDLElBQWpDO1FBQ0g7TUFDSjtJQUNKO0VBQ0o7QUExMUJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkYnVsbGV0ID0gcmVxdWlyZShcIi4vQnVsbGV0XCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwaW5lOiBzcC5Ta2VsZXRvbixcbiAgICAgICAgemQ6ICRidWxsZXQsXG4gICAgICAgIHpkMjogJGJ1bGxldCxcbiAgICAgICAgbGFuZE1pbmVOb2RlOiBjYy5Ob2RlXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuemQpIHtcbiAgICAgICAgICAgIHRoaXMuemQubm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy56ZDIpIHtcbiAgICAgICAgICAgIHRoaXMuemQyLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubGFuZE1pbmVOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmxhbmRNaW5lTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlkK/nlKh1cGRhdGXmlrnms5Xku6XmlK/mjIHnp7vliqjpgLvovpFcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgdGhpcy5zY2VuZSA9IHQ7XG4gICAgICAgIHRoaXMuaW5mbyA9IGk7XG4gICAgICAgIHRoaXMuaXRlbSA9IGU7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNwaW5lID0gdGhpcy5pdGVtLnNwaW5lO1xuICAgICAgICBcbiAgICAgICAgLy8g5L+d5a2YaXRlbS5zcGluZeiKgueCueeahOWIneWni+S9jee9ru+8iOebuOWvueS6juWFtueItuiKgueCue+8iVxuICAgICAgICB0aGlzLml0ZW1TcGluZUluaXRpYWxQb3MgPSB0aGlzLml0ZW0uc3BpbmUubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIG8gPSB0aGlzLmluZm8uanNvbi5yYW5nZTtcbiAgICAgICAgdGhpcy5hdGtSUiA9IG8gKiBvO1xuICAgICAgICB0aGlzLmx2cyA9IFtdO1xuICAgICAgICB0aGlzLmhwID0gdGhpcy5pdGVtLm1heEhwO1xuICAgICAgICB0aGlzLnNoaWVsZFZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5oYXNEaWUgPSAhMTtcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgdGhpcy5pc1BoeSA9ICEwO1xuICAgICAgICB0aGlzLmlzTWFnaWMgPSAhMDtcbiAgICAgICAgdGhpcy5pczNneiA9IFsyLCA1LCA5LCAxMF0uc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT0gbi5pdGVtLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pczJneiA9IFsyLCA0LCA4XS5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCA9PSBuLml0ZW0uaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBjYy5idXRsZXIubm9kZS5vbihcImx2dXBcIiwgdGhpcy5vbkx2dXAsIHRoaXMpO1xuICAgICAgICBcbiAgICAgICAgLy8g56e75Yqo55u45YWz55qE5Yid5aeL5YyWXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgIHRoaXMubW92ZVNwZWVkID0gMjA7IC8vIOiLsembhOenu+WKqOmAn+W6plxuICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvLyDlhbPplK7vvJrnoa7kv51IZXJv57uE5Lu25Zyo5Yid5aeL5YyW5ZCO5ZCv55So77yM5Lul5L6/dXBkYXRl5pa55rOV6IO96KKr6LCD55SoXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvLyDosIPor5Xml6Xlv5fvvIznoa7orqTliJ3lp4vljJblrozmiJBcbiAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gaW5pdEJ55a6M5oiQ77yMSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiwgZW5hYmxlZDpcIiArIHRoaXMuZW5hYmxlZCArIFwiLCDliJ3lp4vkvY3nva46XCIsIHRoaXMuaW5pdGlhbFBvc2l0aW9uKTtcbiAgICB9LFxuICAgIG9uTHZ1cDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbS5pbmRleCA9PSB0KSB7XG4gICAgICAgICAgICB0aGlzLml0ZW0ubHZ1cCghMSk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmh1Yi5zaG93THZ1cEVmZmVjdCh0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTykpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRBbmltYXRpb246IGZ1bmN0aW9uICh0LCBlLCBpLCBuKSB7XG4gICAgICAgIC8vIHRoaXMuc3BpbmUuc2V0QW5pbWF0aW9uKHQsIGUgKyAodGhpcy5pdGVtLmx2ICsgMSksIGkpO1xuICAgICAgICB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbih0LCBlLCBpKTtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKG4pO1xuICAgIH0sXG4gICAgZ2V0QXRrOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IE1hdGgubWluKHRoaXMuaW5mby5sdjEsIHRoaXMuaW5mby5qc29uLmF0dHJpYnV0ZTIubGVuZ3RoIC0gMSk7XG4gICAgICAgIHZhciBpID0gdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMltlXTtcbiAgICAgICAgaWYgKHQgPiAwKSB7XG4gICAgICAgICAgICBpICo9IHRoaXMuaW5mby5qc29uLmZpZ2h0bHZ1cDJbdCAtIDFdIC8gMTAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSgyKTtcbiAgICAgICAgdmFyIG8gPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDEwKTtcbiAgICAgICAgaWYgKG8gPiAwKSB7XG4gICAgICAgICAgICBuICs9IG8gKiBjYy5wdnoucnVudGltZURhdGEuaXRlbXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgaSAqPSAxICsgMC4wMSAqIG47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBnZXRTaGllbGQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gTWF0aC5taW4odGhpcy5pbmZvLmx2MSwgdGhpcy5pbmZvLmpzb24uYXR0cmlidXRlMi5sZW5ndGggLSAxKTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmluZm8uanNvbi5hdHRyaWJ1dGUyW2VdO1xuICAgICAgICBpZiAodCA+IDApIHtcbiAgICAgICAgICAgIGkgKj0gdGhpcy5pbmZvLmpzb24uZmlnaHRsdnVwMlt0IC0gMV0gLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBwdXNoTHZBbmRBdGs6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5nZXRBdGsodC5sdik7XG4gICAgICAgIHRoaXMubHZzLnB1c2goe1xuICAgICAgICAgICAgbHY6IHQubHYsXG4gICAgICAgICAgICBhdGs6IGVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBwbGF5QXR0QW5kRG86IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHZhciBpID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJIaXRcIiwgITEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGkuaXRlbS5jaGVja1RvU3RhcnRSZWxvYWRUaW1lcigpO1xuICAgICAgICAgICAgaS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRFdmVudExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2R1blwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2hwXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvamlndWFuZ1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9nZXRTdW5TaGluZVwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9zaG9vdFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdHJ5U2hvb3Q6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHZhciBpID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8vIOWvueS6jumcgOimgeaVjOS6uuebruagh+eahOaUu+WHu+Wei+iLsembhO+8iElEIDEsMiw0LDUsNyw5LDEy77yJ77yM5qOA5p+l5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgIC8vIHRvZG8g5L+u5pS55Li65YWo6YOo6Iux6ZuE6YO95qOA5rWLXG4gICAgICAgIHZhciBuZWVkVGFyZ2V0Q2hlY2sgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOSwgMTJdO1xuICAgICAgICBpZiAobmVlZFRhcmdldENoZWNrLmluZGV4T2YodGhpcy5pbmZvLmlkKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAgICAgLy8g5rOo5oSP77ya5LiN5Zyo6L+Z6YeM5p+l5om+55uu5qCH77yM5Zug5Li6dXBkYXRlTW92ZW1lbnTlt7Lnu4/lnKjnlKjlpKfojIPlm7Tmn6Xmib7kuoZcbiAgICAgICAgICAgIC8vIOi/memHjOWPquajgOafpeW9k+WJjeaYr+WQpuacieebruagh+S4lOWcqOaUu+WHu+iMg+WbtOWGhVxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRUYXJnZXQgfHwgdGhpcy5jdXJyZW50VGFyZ2V0LmhwIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInlvZPliY3nm67moIfvvIznlKjlrp7pmYXmlLvlh7vojIPlm7TlsJ3or5Xmn6Xmib5cbiAgICAgICAgICAgICAgICB2YXIgbmVhclRhcmdldCA9IHRoaXMuc2NlbmUuY2hvb3NlRW5lbXkodGhpcywgdGhpcy5hdGtSUik7XG4gICAgICAgICAgICAgICAgaWYgKCFuZWFyVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOayoeacieWcqOaUu+WHu+iMg+WbtOWGheeahOaVjOS6uu+8jOi/lOWbnmZhbHNl6K6p6Iux6ZuE57un57ut56e75YqoXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbmVhclRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5qOA5p+l5b2T5YmN55uu5qCH5piv5ZCm5Zyo5pS75Ye76IyD5Zu05YaFXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UG9zID0gdGhpcy5jdXJyZW50VGFyZ2V0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHRoaXMuY3VycmVudFRhcmdldC5jZW50ZXJZKSk7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSB0YXJnZXRQb3Muc3ViKHRoaXMubm9kZS5wb3NpdGlvbikubGVuZ3RoU3FyKCk7XG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLmF0a1JSKSB7XG4gICAgICAgICAgICAgICAgLy8g55uu5qCH5LiN5Zyo5pS75Ye76IyD5Zu05YaF77yM6L+U5ZueZmFsc2Xorqnoi7Hpm4Tnu6fnu63np7vliqhcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodGhpcy5pbmZvLmlkKSB7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IE1hdGguZmxvb3IoaS5nZXRBdGsoaS5pdGVtLmx2KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpLmNoZWNrQnVmZigzMDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGkuY2hlY2tCdWZmKDMwNCkgJiYgTWF0aC5yYW5kb20oKSA8IDAuMjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYWRkTW9uZXkodCk7XG4gICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0J1ZmZFZmZlY3QoXCJtb25leVwiLCBpLm5vZGUucG9zaXRpb24sIGkuc2NlbmUuZ2V0TW9uZXlXUG9zKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoNjAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IDAuMTU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDYwMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKz0gMC4zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxICsgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY3Jvc3NJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5oZXJvICYmIGUuaGVyby5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmhlcm8uYWRkU2hpZWxkKGUubWF4SHAgKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnNjZW5lLnNob3dCdWZmRWZmZWN0KFwic2hpZWxkXCIsIGUuaGVyby5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy5zY2VuZS5jaG9vc2VNaW5IcEhlcm8oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAhIW4gJiZcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpLmNoZWNrQnVmZig4MDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCAqPSAxLjI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEhwKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcIkhQXCIsIG4ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAhMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gaS5nZXRBdGsoaS5pdGVtLmx2KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTAwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSAwLjE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICs9IDAuMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKj0gMSArIGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS5zaG93QnVmZkVmZmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibXVzaWNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGkubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgNTApKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0QW5nZXJCYXJXUG9zKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyICs9IHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zY2VuZS51cGRhdGVBbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QXR0QW5kRG8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZigxMTA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkubGFzdEJ1bGxldENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT0gaS5sYXN0QnVsbGV0Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaS5sYXN0QnVsbGV0Q291bnQgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBjYy5pbnN0YW50aWF0ZShpLmxhbmRNaW5lTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNjLnYyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuZ2V0SGVyb2VzTWF4TWFyZ2luWCgpICsgY2MubWF0aC5yYW5kb21SYW5nZSgwLCAxNTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLm1hdGgucmFuZG9tUmFuZ2UoaS5zY2VuZS5ncm91bmRBcmVhTEIueSArIDEyMCwgaS5zY2VuZS5ncm91bmRBcmVhVFIueSAtIDEyMClcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnBvc2l0aW9uID0gaS5ub2RlLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQucGFyZW50ID0gaS5zY2VuZS5vYmpzUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuekluZGV4ID0gLXQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gdC5nZXRDb21wb25lbnQoY2MuQ29sbGlkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHQuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gby5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gKGUueCAtIHQueCkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy55ID0gKGUueSAtIHQueSkgLyB0LnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy54ID0gTWF0aC5tYXgoMCwgcy54KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0QW5pbWF0aW9uKDAsIFwiemQxMV8xXCIsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbi5lbmFibGVkID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5zZXRBbmltYXRpb24oMCwgXCJ6ZDExXzJcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHQ7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICB2YXIgbyA9IHRoaXMuY2hlY2tCdWZmKDEyMDQpID8gMiA6IDEsXG4gICAgICAgICAgICAgICAgICAgIHMgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15cyh0aGlzLCB0aGlzLmF0a1JSLCBvKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA9PSBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5zY2VuZS5nZXRIZXJvZXNNYXhNYXJnaW5YKCksXG4gICAgICAgICAgICAgICAgICAgIGEgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUF0dEFuZERvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgIT0gYSB8fCBpLmNoZWNrQnVmZigxMjA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBzW01hdGgubWluKHMubGVuZ3RoIC0gMSwgYSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSB0Lm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIHQuY2VudGVyWSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBjYy52MihNYXRoLm1pbihjLCBlLngpLCBlLnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBpLnNjZW5lLm9ianNSb290LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gY2MuaW5zdGFudGlhdGUoaS56ZC5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoID0gci5nZXRDb21wb25lbnQoXCJCdWxsZXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByLnBhcmVudCA9IGkuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICByLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgci5wb3NpdGlvbiA9IGkubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguc3BpbmUuc2V0QW5pbWF0aW9uKDAsIGguc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiwgITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBoLnNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdSA9IGguc3BpbmUubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueCA9IHUueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQueSA9IHUueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGguaW5pdEJ5KGkuc2NlbmUsIGkuaXRlbS5sdik7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLmEgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5hdHQgPSBpLmdldEF0ayhpLml0ZW0ubHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2NlbmUuc2hvd0pzRWZmZWN0KGNjLnYyKG4ueCArIDEwMCAqIHQsIG4ueSksIGkuaW5mby5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDggKiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gMTsgbCA8IDU7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2d1bnppXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByID0gZSB8fCB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIHRoaXMuYXRrUlIpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgISFyICYmXG4gICAgICAgICAgICAodGhpcy5wdXNoTHZBbmRBdGsodCksXG4gICAgICAgICAgICAhdGhpcy5pc0F0dGFja2luZyAmJlxuICAgICAgICAgICAgICAgICgodGhpcy5pc0F0dGFja2luZyA9ICEwKSxcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdHRBbmREbyhcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuaXNBdHRhY2tpbmcgPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmNoZWNrVG9TaG9vdChyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuaXRlbS5idWxsZXRDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4oaS5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogNTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIHRoaXMuSUtCb25lIHx8ICh0aGlzLklLQm9uZSA9IHRoaXMuc3BpbmUuZmluZEJvbmUoXCJJS1wiKSksXG4gICAgICAgICAgICAgICAgY2NcbiAgICAgICAgICAgICAgICAgICAgLnR3ZWVuKHRoaXMuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IChyLm5vZGUueCAtIHRoaXMubm9kZS54KSAvIDAuNzYsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiAoci5ub2RlLnkgKyByLmNlbnRlclkgLSB0aGlzLm5vZGUueSkgLyAwLjc2XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdGFydCgpLFxuICAgICAgICAgICAgICAgICEwKSlcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGNoZWNrVG9TaG9vdDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5sdnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy56ZCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5sdnMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHQgfHwgdGhpcy5zY2VuZS5jaG9vc2VFbmVteSh0aGlzLCB0aGlzLmF0a1JSKTtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob290KGksIHRoaXMuaXRlbS5sdiwgZS5hdGspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmx2cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KHRoaXMuY2hlY2tUb1Nob290LmJpbmQodGhpcyksIDgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2hvb3RBUG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLkdQQm9uZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuR1BCb25lID0gdGhpcy5zcGluZS5maW5kQm9uZShcIkdQXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ID0gY2MudjIodGhpcy5HUEJvbmUud29ybGRYLCB0aGlzLkdQQm9uZS53b3JsZFkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0KTtcbiAgICB9LFxuICAgIHNob290OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICBpZiAoNCA9PSB0aGlzLmluZm8uaWQpIHtcbiAgICAgICAgICAgIHZhciBuO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwMSkpIHtcbiAgICAgICAgICAgICAgICBuID0gOTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbiA9IDU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG9vdE4obiwgdCwgZSwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwNCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290TigzLCB0LCBlLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICg3ID09IHRoaXMuaW5mby5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNob290SUsodCwgZSwgaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIHRoaXMuc2hvb3QxKHQsIGUsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG9vdDE6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcy5nZXRTaG9vdEFQb3MoKTtcbiAgICAgICAgdmFyIG8gPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG4pO1xuICAgICAgICB2YXIgcyA9IHQubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgdC5jZW50ZXJZKSkuc3ViKG8pO1xuICAgICAgICBpZiAocy54IDwgMCkge1xuICAgICAgICAgICAgcy54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYyA9IE1hdGguYXRhbjIocy55LCBzLngpO1xuICAgICAgICB2YXIgYSA9IHRoaXMuemQ7XG4gICAgICAgIHZhciByID0gY2MuaW5zdGFudGlhdGUoYS5ub2RlKTtcbiAgICAgICAgci5wYXJlbnQgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290O1xuICAgICAgICByLmFjdGl2ZSA9ICEwO1xuICAgICAgICByLnBvc2l0aW9uID0gbztcbiAgICAgICAgdmFyIGggPSByLmdldENvbXBvbmVudChcIkJ1bGxldFwiKTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwNCkpIHtcbiAgICAgICAgICAgIGguaGl0Q291bnQgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDMpKSB7XG4gICAgICAgICAgICBoLmhpdENvdW50ID0gMjtcbiAgICAgICAgfVxuICAgICAgICBoLmluaXRCeSh0aGlzLnNjZW5lLCBlKTtcbiAgICAgICAgaC5hID0gdGhpcztcbiAgICAgICAgaWYgKDEzID09IHRoaXMuaW5mby5pZCAmJiAyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICBoLmF0dCA9IGkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaC5hdHQgPSBpO1xuICAgICAgICB9XG4gICAgICAgIGgubW92ZUJ5QW5nbGUoKDE4MCAqIGMpIC8gTWF0aC5QSSk7XG4gICAgfSxcbiAgICBzaG9vdE46IGZ1bmN0aW9uICh0LCBlLCBpLCBuKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5nZXRTaG9vdEFQb3MoKTtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnNjZW5lLmJ1bGxldHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG8pO1xuICAgICAgICB2YXIgYyA9IGUubm9kZS5wb3NpdGlvbi5hZGQoY2MudjIoMCwgZS5jZW50ZXJZKSkuc3ViKHMpO1xuICAgICAgICBpZiAoYy54IDwgMCkge1xuICAgICAgICAgICAgYy54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYSA9ICgxODAgKiBNYXRoLmF0YW4yKGMueSwgYy54KSkgLyBNYXRoLlBJO1xuICAgICAgICB2YXIgcjtcbiAgICAgICAgaWYgKHQgPiA1KSB7XG4gICAgICAgICAgICByID0gWzAsIC0xMCwgLTIwLCAtMzAsIDQwLCAxMCwgMjAsIDMwLCA0MF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByID0gWzAsIC0xNSwgMTUsIC0zMCwgMzBdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGggPSAwOyBoIDwgdDsgaCsrKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuemQubm9kZSk7XG4gICAgICAgICAgICBkLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgICAgICBkLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgZC5wb3NpdGlvbiA9IHM7XG4gICAgICAgICAgICB2YXIgdSA9IGQuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICAgICAgdS5pbml0QnkodGhpcy5zY2VuZSwgaSk7XG4gICAgICAgICAgICB1LmEgPSB0aGlzO1xuICAgICAgICAgICAgdS5hdHQgPSBuO1xuICAgICAgICAgICAgdS5tb3ZlQnlBbmdsZShhICsgcltoXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob290SUs6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgdmFyIG8gPSB0aGlzLmdldFNob290QVBvcygpO1xuICAgICAgICB2YXIgcyA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobyk7XG4gICAgICAgIHZhciBjID0gdC5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigwLCB0LmNlbnRlclkpKTtcbiAgICAgICAgdmFyIGEgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnpkLm5vZGUpO1xuICAgICAgICB2YXIgciA9IGEuZ2V0Q29tcG9uZW50KFwiQnVsbGV0XCIpO1xuICAgICAgICBhLnBhcmVudCA9IHRoaXMuc2NlbmUuYnVsbGV0c1Jvb3Q7XG4gICAgICAgIGEuYWN0aXZlID0gITA7XG4gICAgICAgIGEucG9zaXRpb24gPSBzO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzAyKSkge1xuICAgICAgICAgICAgYS5nZXRDb21wb25lbnQoXCJFdmVudENvbGxpZGVyXCIpLmNvbGxpZGVyLnJhZGl1cyAqPSAxLjM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGggPSByLnNwaW5lLnNldEFuaW1hdGlvbigwLCByLnNwaW5lLmRlZmF1bHRBbmltYXRpb24sICEwKTtcbiAgICAgICAgci5zcGluZS5zZXRUcmFja0V2ZW50TGlzdGVuZXIoaCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbi5zY2VuZS5zaG93SnNFZmZlY3QodC5ub2RlLnBvc2l0aW9uLCBuLmluZm8uaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGQgPSByLnNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgIHZhciB1ID0gci5zcGluZS5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGMpO1xuICAgICAgICBkLnggPSB1Lng7XG4gICAgICAgIGQueSA9IHUueTtcbiAgICAgICAgZC54ID0gTWF0aC5tYXgoMCwgZC54KTtcbiAgICAgICAgci5pbml0QnkodGhpcy5zY2VuZSwgZSk7XG4gICAgICAgIHIuYSA9IHRoaXM7XG4gICAgICAgIHIuYXR0ID0gaTtcbiAgICB9LFxuICAgIGNoZWNrSGVyb0J1ZmY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0sXG4gICAgY2hlY2tCdWZmOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9ICh0IC0gKHQgJSAxMDApKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5mby5pZCA9PSBlICYmIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKHQpO1xuICAgIH0sXG4gICAgZG9CdWxsZXRBdHRMb2dpYzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0LmF0dDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMSkpIHtcbiAgICAgICAgICAgIGkgKj0gMS4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDQpKSB7XG4gICAgICAgICAgICBpICo9IDEuNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzAxKSkge1xuICAgICAgICAgICAgaSAqPSAxLjI1O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEyMDEpKSB7XG4gICAgICAgICAgICBpICo9IDEuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUud2Vha05vZGUgJiYgdGhpcy5pc1BoeSkge1xuICAgICAgICAgICAgaSAqPSAxLjI7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BoeSkge1xuICAgICAgICAgICAgICAgICAgICBpICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjEgLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXMzZ3opIHtcbiAgICAgICAgICAgICAgICAgICAgaSAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYxIC0gNF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzMmd6KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMSAtIDEwXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICBpZiAodGhpcy5jaGVja0NyaXQodCwgZSkpIHtcbiAgICAgICAgICAgIG4gPSAxO1xuICAgICAgICAgICAgaSAqPSB0aGlzLmdldENyaXRQbHVzKHQsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGkgKj0gY2MubWF0aC5yYW5kb21SYW5nZSgwLjk1LCAxLjA1KTtcbiAgICAgICAgZS5odXJ0QnkodGhpcywgaSk7XG4gICAgICAgIHRoaXMuc2NlbmUuc2hvd0VuZW15SHVydE51bShuLCBlLm5vZGUucG9zaXRpb24sIGkpO1xuICAgICAgICBpZiAodC5qc0VmZkV4Y2x1c2l2ZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGUubm9kZS5wb3NpdGlvbiwgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdGhpcy5pbmZvLmlkXSArPSBpO1xuICAgICAgICBpZiAodC5idWZmU2xvdykge1xuICAgICAgICAgICAgZS5hZGRCdWZmU2xvdygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0LmJ1ZmZJY2UgJiYgdGhpcy5jaGVja0J1ZmYoMTIwMykgJiYgTWF0aC5yYW5kb20oKSA8IDAuMikge1xuICAgICAgICAgICAgZS5hZGRCdWZmSWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwNCkgJiYgTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICAgICAgZS5hZGRCdWZmV2VhaygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDQpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAzKSkge1xuICAgICAgICAgICAgZS5yZXB1bHNlKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDIpKSB7XG4gICAgICAgICAgICBlLnJlcHVsc2UodGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tDcml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig1MDEpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRDb3VudGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRDb3VudGVyID0gdGhpcy5hdHRDb3VudGVyICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRDb3VudGVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0O1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDUwMikpIHtcbiAgICAgICAgICAgICAgICB0ID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdCA9IDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRDb3VudGVyID49IHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dENvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZSA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDIpKSB7XG4gICAgICAgICAgICBlICs9IDAuMjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwNCkpIHtcbiAgICAgICAgICAgIGUgKz0gMC4yNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAzKSkge1xuICAgICAgICAgICAgZSArPSAwLjE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPCBlO1xuICAgIH0sXG4gICAgZ2V0Q3JpdFBsdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSAxLjU7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDMpKSB7XG4gICAgICAgICAgICB0ICs9IDAuNTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9LFxuICAgIGRvTGFuZE1pbmVzTG9naWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdC5nZXRDb21wb25lbnQoXCJFbmVteVwiKTtcbiAgICAgICAgaWYgKGUgJiYgZS5ocCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZG9CdWxsZXRBdHRMb2dpYyhcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGF0dDogdGhpcy5nZXRBdGsodGhpcy5pdGVtLmx2KSxcbiAgICAgICAgICAgICAgICAgICAgbHY6IHRoaXMuaXRlbS5sdixcbiAgICAgICAgICAgICAgICAgICAganNFZmZFeGNsdXNpdmU6ICEwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkxhbmRtaW5lc0NvbGxpc2lvbjogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0LmdldENvbXBvbmVudChcIkVuZW15XCIpO1xuICAgICAgICAgICAgaWYgKGkgJiYgaS5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICBlLmVuYWJsZWQgPSAhMTtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IGUubm9kZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICAgICAgICAgIHZhciBvID0gY2MuZmluZChcInJhbmdlXCIsIGUubm9kZSkuZ2V0Q29tcG9uZW50KGNjLkNvbGxpZGVyKTtcbiAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMubWFudWFsbHlDaGVja0NvbGxpZGVyKG8pO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0pzRWZmZWN0KGUubm9kZS5wb3NpdGlvbiwgdGhpcy5pbmZvLmlkKTtcbiAgICAgICAgICAgICAgICBuLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhZGRIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocCA9IE1hdGgubWluKHRoaXMuaXRlbS5tYXhIcCwgdGhpcy5ocCArIHQpO1xuICAgICAgICB0aGlzLml0ZW0udXBkYXRlSHAodGhpcy5ocCAvIHRoaXMuaXRlbS5tYXhIcCk7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlSHAoITApO1xuICAgIH0sXG4gICAgZGVsSHA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuaHAgPSBNYXRoLm1heCgwLCB0aGlzLmhwIC0gdCk7XG4gICAgICAgIHRoaXMuaXRlbS51cGRhdGVIcCh0aGlzLmhwIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVIcCghMCk7XG4gICAgfSxcbiAgICBhZGRTaGllbGQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2hpZWxkVmFsdWUgPSBNYXRoLm1pbih0aGlzLml0ZW0ubWF4SHAsIHRoaXMuc2hpZWxkVmFsdWUgKyB0KTtcbiAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZVNoaWVsZCh0aGlzLnNoaWVsZFZhbHVlIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVTaGllbGQoKTtcbiAgICB9LFxuICAgIGh1cnRCeTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgLy8g5Y+X5LykXG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgaWYgKCEodGhpcy5oYXNFbmRlZCB8fCB0aGlzLmhwIDw9IDApKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaGllbGRWYWx1ZSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IE1hdGgubWluKHRoaXMuc2hpZWxkVmFsdWUsIGkpO1xuICAgICAgICAgICAgICAgIGkgLT0gbztcbiAgICAgICAgICAgICAgICB0aGlzLnNoaWVsZFZhbHVlIC09IG87XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtLnVwZGF0ZVNoaWVsZCh0aGlzLnNoaWVsZFZhbHVlIC8gdGhpcy5pdGVtLm1heEhwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID4gMCAmJiAodGhpcy5kZWxIcChpKSwgdGhpcy5ocCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHZhciBzID1cbiAgICAgICAgICAgICAgICAgICAgIWNjLnB2ei5ydW50aW1lRGF0YS5oYXNVc2VSZWJvcm4gJiZcbiAgICAgICAgICAgICAgICAgICAgKDggPT0gdGhpcy5pbmZvLmlkIHx8IHRoaXMuc2NlbmUuaGFzSGVybyg4KSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoODAzKTtcbiAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaGFzVXNlUmVib3JuID0gITA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6KGA5p2hXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5iYXJOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIkRlYWRcIiwgITEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4ucmVib3JuKGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDgwNCkgPyAxIDogMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc2hvd0J1ZmZFZmZlY3QoXCJyZXZpdmVcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbi5oYXNEaWUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc2NlbmUuY2hlY2tJc0ZhaWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWJvcm46IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOWkjea0u1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIFwiZnVodW9cIiwgITEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGUuaHAgPSBlLml0ZW0ubWF4SHAgKiB0O1xuICAgICAgICAgICAgZS5pdGVtLnVwZGF0ZUhwKCk7XG4gICAgICAgICAgICBlLmhhc0RpZSA9ICExO1xuICAgICAgICAgICAgZS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzaG93QnVmZkVmZmVjdDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gZSkge1xuICAgICAgICAgICAgZSA9ICExO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZEJ1ZmZQcmVmYWJcbiAgICAgICAgICAgICAgICAuYWRkTm9kZVRvKHRoaXMuaXRlbS5zcGluZS5ub2RlLCBjYy5WZWMyLlpFUk8pXG4gICAgICAgICAgICAgICAgLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbilcbiAgICAgICAgICAgICAgICAuc2V0QW5pbWF0aW9uKDAsIHQsICExKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuc2hvd0J1ZmZFZmZlY3QodCwgdGhpcy5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyDnoa7kv53liJ3lp4vljJblrozmiJBcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWQgfHwgIXRoaXMuc2NlbmUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2dnZWROb3RJbml0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0hlcm8gVXBkYXRlXSBJROacquefpSwg5pyq5Yid5aeL5YyW5oiWc2NlbmXkuI3lrZjlnKhcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZWROb3RJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuc2NlbmUudGltZVBhdXNlZCAmJiAhKHRoaXMuc2NlbmUuaGFzRW5kZWQgfHwgdGhpcy5ocCA8PSAwIHx8IHRoaXMuaGFzRGllKSkge1xuICAgICAgICAgICAgdmFyIGUgPSB0ICogY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuZ2V0VGltZVNjYWxlKCk7XG4gICAgICAgICAgICAvLyDmr4/np5Llj6rmiZPljbDkuIDmrKHml6Xlv5fvvIzpgb/lhY3liLflsY9cbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0TG9nVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdExvZ1RpbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VGltZSAtIHRoaXMubGFzdExvZ1RpbWUgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBVcGRhdGVdIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIsIGVuYWJsZWQ6XCIgKyB0aGlzLmVuYWJsZWQgKyBcIiwg5L2N572uOlwiICsgdGhpcy5ub2RlLnBvc2l0aW9uICsgXCIsIOaVjOS6uuaVsDpcIiArICh0aGlzLnNjZW5lLmVuZW15cyA/IHRoaXMuc2NlbmUuZW5lbXlzLmxlbmd0aCA6IDApICsgXCIsIGlzTW92aW5nOlwiICsgdGhpcy5pc01vdmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TG9nVGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNb3ZlbWVudChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTW92ZW1lbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIC8vIOajgOafpeaYr+WQpuacieaVjOS6uuWtmOWcqFxuICAgICAgICBpZiAoIXRoaXMuc2NlbmUuZW5lbXlzIHx8IHRoaXMuc2NlbmUuZW5lbXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8g5rKh5pyJ5pWM5Lq65pe277yM6L+U5Zue5Yid5aeL5L2N572uXG4gICAgICAgICAgICB0aGlzLnJldHVyblRvSW5pdGlhbFBvc2l0aW9uKHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDlr7vmib7mnIDov5HnmoTmlYzkurrvvIjmiYDmnInoi7Hpm4Tpg73np7vliqjvvIzkuI3ljLrliIbnsbvlnovvvIlcbiAgICAgICAgdmFyIGUgPSB0aGlzLnNjZW5lLmNob29zZUVuZW15KHRoaXMsIDk5OTk5OSk7XG4gICAgICAgIGlmIChlICYmIGUuaHAgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlO1xuICAgICAgICAgICAgdmFyIGkgPSBlLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIGUuY2VudGVyWSkpO1xuICAgICAgICAgICAgdmFyIG4gPSBpLnN1Yih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgdmFyIG8gPSBuLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKblnKjmlLvlh7vojIPlm7TlhoVcbiAgICAgICAgICAgIGlmIChvIDw9IHRoaXMuYXRrUlIpIHtcbiAgICAgICAgICAgICAgICAvLyDlnKjmlLvlh7vojIPlm7TlhoXvvIzlgZzmraLnp7vliqhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVhY2hlZEF0dGFja1JhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVyb10gSUQ6XCIgKyB0aGlzLmluZm8uaWQgKyBcIiDliLDovr7mlLvlh7vojIPlm7RcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4jeeri+WNs+WIh+aNouWKqOeUu++8jOiuqeaUu+WHu+WKqOeUu+aOp+WItlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5LiN5Zyo5pS75Ye76IyD5Zu05YaF77yM57un57ut5ZCR5pWM5Lq656e75YqoXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1JlYWNoZWRBdHRhY2tSYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOW8gOWni+WQkeaVjOS6uuenu+WKqFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+q5Zyo6Z2e5pS75Ye754q25oCB5pe25YiH5o2i5Li656e75Yqo5Yqo55S7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oMCwgXCJXYWxrXCIsICEwLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDorqHnrpfnp7vliqjmlrnlkJHlkoznp7vliqhcbiAgICAgICAgICAgICAgICB2YXIgcyA9IE1hdGguYXRhbjIobi55LCBuLngpO1xuICAgICAgICAgICAgICAgIHZhciBjID0gY2MudjIodGhpcy5tb3ZlU3BlZWQgKiBNYXRoLmNvcyhzKSAqIHQsIHRoaXMubW92ZVNwZWVkICogTWF0aC5zaW4ocykgKiB0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDkvY3nva5cbiAgICAgICAgICAgICAgICB2YXIgb2xkUG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChjKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLXRoaXMubm9kZS55O1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5iYXJOb2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtLmJhck5vZGUucG9zaXRpb24uYWRkKGMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtU3BpbmVQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiwg+ivle+8muaJk+WNsOenu+WKqOS/oeaBr++8iOavj+enkuS4gOasoe+8iVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5sYXN0TW92ZUxvZ1RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZUxvZ1RpbWUgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbm93VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vd1RpbWUgLSB0aGlzLmxhc3RNb3ZlTG9nVGltZSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSGVybyBNb3ZlXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiLCDku45cIiArIG9sZFBvcyArIFwiIOenu+WKqOWIsFwiICsgdGhpcy5ub2RlLnBvc2l0aW9uICsgXCIsIOenu+WKqOmHjzpcIiArIGMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlTG9nVGltZSA9IG5vd1RpbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOabtOaWsHBvc2l0aW9uMueUqOS6juaVjOS6uueahOaUu+WHu+WIpOaWrVxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24yID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLml0ZW0uYXR0T2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOayoeacieacieaViOaVjOS6uu+8jOi/lOWbnuWIneWni+S9jee9rlxuICAgICAgICAgICAgdGhpcy5yZXR1cm5Ub0luaXRpYWxQb3NpdGlvbih0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSXRlbVNwaW5lUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5bCGSGVyb+iKgueCueeahOS4lueVjOWdkOagh+i9rOaNouS4uml0ZW0uc3BpbmXniLboioLngrnnmoTmnKzlnLDlnZDmoIdcbiAgICAgICAgaWYgKHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc3BpbmUgJiYgdGhpcy5pdGVtLnNwaW5lLm5vZGUpIHtcbiAgICAgICAgICAgIC8vIOiOt+WPlkhlcm/oioLngrnnmoTkuJbnlYzlnZDmoIdcbiAgICAgICAgICAgIHZhciBoZXJvV29ybGRQb3MgPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0aGlzLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgLy8g6L2s5o2i5Li6aXRlbS5zcGluZeeItuiKgueCueeahOacrOWcsOWdkOagh1xuICAgICAgICAgICAgdmFyIHNwaW5lTG9jYWxQb3MgPSB0aGlzLml0ZW0uc3BpbmUubm9kZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIoaGVyb1dvcmxkUG9zKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6LCD6K+V77ya6aaW5qyh56e75Yqo5pe25omT5Y2w5pel5b+XXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9nZ2VkU3BpbmVVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltIZXJvXSBJRDpcIiArIHRoaXMuaW5mby5pZCArIFwiIOesrOS4gOasoeWQjOatpXNwaW5l5L2N572uIC0gSGVyb+S4lueVjOWdkOaghzpcIiwgaGVyb1dvcmxkUG9zLCBcInNwaW5l5pys5Zyw5Z2Q5qCHOlwiLCBzcGluZUxvY2FsUG9zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlZFNwaW5lVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pu05pawaXRlbS5zcGluZeeahOS9jee9rlxuICAgICAgICAgICAgdGhpcy5pdGVtLnNwaW5lLm5vZGUucG9zaXRpb24gPSBzcGluZUxvY2FsUG9zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ2dlZFNwaW5lRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0hlcm9dIElEOlwiICsgdGhpcy5pbmZvLmlkICsgXCIg5peg5rOV5ZCM5q2lc3BpbmXkvY3nva7vvIFpdGVtOlwiLCAhIXRoaXMuaXRlbSwgXCJzcGluZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSksIFwic3BpbmUubm9kZTpcIiwgISEodGhpcy5pdGVtICYmIHRoaXMuaXRlbS5zcGluZSAmJiB0aGlzLml0ZW0uc3BpbmUubm9kZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VkU3BpbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJldHVyblRvSW5pdGlhbFBvc2l0aW9uOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZGlzdFNxciA9IHRoaXMubm9kZS5wb3NpdGlvbi5zdWIodGhpcy5pbml0aWFsUG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICBpZiAoZGlzdFNxciA+IDEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIldhbGtcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5pbml0aWFsUG9zaXRpb24uc3ViKHRoaXMubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB2YXIgciA9IE1hdGguYXRhbjIoYS55LCBhLngpO1xuICAgICAgICAgICAgdmFyIGggPSBjYy52Mih0aGlzLm1vdmVTcGVlZCAqIE1hdGguY29zKHIpICogdCwgdGhpcy5tb3ZlU3BlZWQgKiBNYXRoLnNpbihyKSAqIHQpO1xuICAgICAgICAgICAgaWYgKGgubGVuZ3RoU3FyKCkgPiBhLmxlbmd0aFNxcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5pbml0aWFsUG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uLmFkZChoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZS56SW5kZXggPSAtdGhpcy5ub2RlLnk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOOAkOWFs+mUruOAkeWQjOatpeabtOaWsGl0ZW0uc3BpbmXnmoTmmL7npLrkvY3nva5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbVNwaW5lUG9zaXRpb24oKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbjIgPSB0aGlzLm5vZGUucG9zaXRpb24uYWRkKHRoaXMuaXRlbS5hdHRPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8g6L+U5Zue5Yid5aeL5L2N572u5ZCO77yM5oGi5aSNaXRlbS5zcGluZeWIsOWIneWni+S9jee9rlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnNwaW5lICYmIHRoaXMuaXRlbS5zcGluZS5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5zcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5pdGVtU3BpbmVJbml0aWFsUG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0F0dGFja2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTsiXX0=