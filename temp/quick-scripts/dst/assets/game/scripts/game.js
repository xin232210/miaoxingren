
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8230aOHPrNHQZMa4tDLZgoZ', 'game');
// game/scripts/game.js

"use strict";

var $prefabInfo = require("../../scripts/PrefabInfo");

cc.Class({
  "extends": cc.Component,
  properties: {
    bg2Sp: cc.Sprite,
    groundAreaNode: cc.Node,
    bgMusic2: cc.AudioClip,
    shieldBar: cc.ProgressBar,
    shieldLabel: cc.Label,
    hpBar: cc.ProgressBar,
    hpLabel: cc.Label,
    pauseNode: cc.Node,
    speedNode: cc.Node,
    speedLabel: cc.Label,
    statsBtnNode: cc.Node,
    levelsJsonFile: cc.JsonAsset,
    ground: cc.Node,
    objsRoot: cc.Node,
    bulletsRoot: cc.Node,
    fightNodes: [cc.Node],
    heroJsonFile: cc.JsonAsset,
    eHurtNum: $prefabInfo,
    eHurtCritNum: $prefabInfo,
    eDiePrefab: $prefabInfo,
    ePoisonPrefab: $prefabInfo,
    eSlowPrefab: $prefabInfo,
    eIcePrefab: $prefabInfo,
    eWeakPrefab: $prefabInfo,
    eHpPrefab: $prefabInfo,
    eBossHpPrefab: $prefabInfo,
    eHitPrefab: $prefabInfo,
    eHitGroundPrefab: $prefabInfo,
    pHurtNum: $prefabInfo,
    pFireEffect: $prefabInfo,
    addBuffPrefab: $prefabInfo,
    accBuffPrefab: $prefabInfo,
    waveEndAniSpine: sp.Skeleton,
    moneyIconNode: cc.Node,
    tryPlantNode: cc.Node,
    tryPlantIcon: cc.Sprite,
    statsPanel: cc.Node,
    statsItemPrefab: $prefabInfo,
    angerBar: cc.ProgressBar,
    angerBarSp: cc.Sprite,
    angerBarSpfs: [cc.SpriteFrame],
    angerEmptyTip: cc.Node,
    angerBarNode: cc.Node,
    angerModeNode: cc.Node
  },
  onLoad: function onLoad() {
    this.waveEndAniSpine.node.active = !1;

    if (this.statsPanel) {
      this.statsPanel.active = !1;
    }

    this.angerEmptyTip.active = !1;
  },
  startLogic: function startLogic(t) {
    var e = this;
    var i = this.hub.levelData;
    this.levelData = i;
    var n = this.groundAreaNode.getBoundingBoxToWorld();
    this.groundAreaLB = this.objsRoot.convertToNodeSpaceAR(cc.v2(n.xMin, n.yMin));
    this.groundAreaTR = this.objsRoot.convertToNodeSpaceAR(cc.v2(n.xMax, n.yMax));
    this.timePaused = !1;
    this.t = 0;
    this.msIndex = 0;
    this.frameActions = [];
    this.cbs2 = [];
    this.cbId = 1;
    this.pausedCbs = [];
    this.pausedCbs2 = [];
    this.hasEnded = !1;
    this.statsBtnNode.active = !0;

    if (2 == cc.pvz.runtimeData.mode) {
      this.maxWave = 99999;
    } else {
      this.maxWave = i.wave;
    }

    this.isLastWave = 2 != cc.pvz.runtimeData.mode && cc.pvz.runtimeData.wave == i.wave - 1;
    this.enemys = [];
    this.taskEnemyCount1 = 0;
    this.taskEnemyCount2 = 0;
    cc.butler.node.on("maxHp", this.onGetHpBuff, this);
    this.initHeroes(t);
    this.updateHp(!1);
    this.updateShield();
    this.updateSpeed();
    this.isAngerPressed = !1;
    this.angerBarNode.on(cc.Node.EventType.TOUCH_START, function () {
      e.startAngerMode();
    }, this);
    this.angerBarNode.on(cc.Node.EventType.TOUCH_END, function () {
      e.stopAngerMode();
      e.angerEmptyTip.active = !1;
    }, this);
    this.angerBarNode.on(cc.Node.EventType.TOUCH_CANCEL, function () {
      e.stopAngerMode();
      e.angerEmptyTip.active = !1;
    }, this);
    this.updateAnger();
    cc.director.getCollisionManager().enabled = !0;
    cc.pvz.runtimeData.mode;

    if (cc.pvz.runtimeData.showGame1st && 0 == cc.pvz.runtimeData.wave) {
      cc.guideManager.showGuide(0, [{
        hideFinger: !0,
        tip: "僵尸正在进攻我们的花园，赶紧消灭他们!"
      }], function (t) {
        if (t) {
          e.beginEmitEnemys();
        }
      });
    } else {
      this.beginEmitEnemys();
    }

    this.enabled = !0;
    cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.resetSpeed, this);
  },
  onBackFromGame: function onBackFromGame() {
    this.stopAngerMode();
    this.fightNodes.forEach(function (t) {
      return t.removeAllChildren();
    });
    cc.butler.node.off("maxHp", this.onGetHpBuff, this);
    this.enabled = !1;
    cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.resetSpeed, this);
    cc.director.getCollisionManager().enabled = !1;
    this.heroes.forEach(function (t) {
      if (t.IKBone) {
        cc.tween(t.IKBone).to(0.064, {
          x: 150,
          y: 50
        }).start();
      }
    });
  },
  beginEmitEnemys: function beginEmitEnemys() {
    var t = this;
    var e = null;
    var i = null;

    switch (cc.pvz.runtimeData.mode) {
      case 0:
        e = "game";
        i = "config/Level" + this.levelData.level;

        if (cc.pvz.runtimeData.showGame1st) {
          i += "B";
        }

        break;

      case 1:
        e = "game";
        i = "config/" + this.levelData.level;
        break;

      case 2:
        e = "rank";
        i = "config/" + this.levelData.level;
        cc.popupManager.showToast("第" + (cc.pvz.runtimeData.wave + 1) + "波开始");
    }

    cc.pvz.utils.useBundleAsset(e, i, cc.JsonAsset, function (e) {
      t.emitEnemys(e.json);
    });
  },
  resetSpeed: function resetSpeed() {
    this.setSpeedLogic(1);
  },
  updateAnger: function updateAnger() {
    this.angerBar.progress = cc.pvz.runtimeData.anger / 1e3;

    if (this.angerBar.node.width > 10) {
      this.angerBar.node.opacity = 255;
    } else {
      this.angerBar.node.opacity = 0;
    }
  },
  getMoneyWPos: function getMoneyWPos() {
    return this.moneyIconNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
  },
  getAngerBarWPos: function getAngerBarWPos() {
    return this.angerBar.node.convertToWorldSpaceAR(cc.v2(this.angerBar.node.width, 0));
  },
  showBuffEffect: function showBuffEffect(t, e, i, n) {
    var o = this.addBuffPrefab.addNode(e);
    var s = o.getComponent(sp.Skeleton);
    var c = s.setAnimation(0, t, !1);

    if (i) {
      var a = o.convertToNodeSpaceAR(i);
      var r = s.findBone("IK");
      r.x = a.x;
      r.y = a.y;
    }

    if (n) {
      s.setTrackCompleteListener(c, n);
    }
  },
  onGetHpBuff: function onGetHpBuff() {
    this.bag.updateHp();
    this.updateHp();
  },
  updateHp: function updateHp(t) {
    var e = this.heroes.reduce(function (t, e) {
      return t + e.hp;
    }, 0);
    var i = this.heroes.reduce(function (t, e) {
      return t + e.item.maxHp;
    }, 0);

    if (0 != i) {
      this.hpLabel.string = Math.round(e);

      if (t) {
        cc.tween(this.hpBar).to(0.1, {
          progress: e / i
        }).start();
      } else {
        this.hpBar.progress = e / i;
      }
    }
  },
  updateShield: function updateShield() {
    var t = this.heroes.reduce(function (t, e) {
      return t + e.shieldValue;
    }, 0);
    var e = this.heroes.reduce(function (t, e) {
      return t + e.item.maxHp;
    }, 0);
    var i = t > 0;
    this.shieldBar.node.active = i;
    this.shieldLabel.node.parent.active = i;

    if (i) {
      this.shieldLabel.string = Math.floor(t);
      this.shieldBar.progress = t / e;
    }
  },
  insertFrameAction: function insertFrameAction(t, e) {
    var i = this.frameActions.find(function (e) {
      return e.ms == t;
    });

    if (i) {
      i.cbs.push(e);
    } else {
      this.frameActions.push({
        ms: t,
        cbs: [e]
      });
    }
  },
  insertFrameCB: function insertFrameCB(t, e) {
    var i = this.cbId;
    var n = this.cbs.findIndex(function (e) {
      return e.ms > t;
    });
    var o;

    if (-1 == n) {
      o = this.cbs.length;
    } else {
      o = n;
    }

    this.cbs.splice(o, 0, {
      ms: t,
      cb: e,
      id: i
    });
    this.cbId++;
    return i;
  },
  setTimeout: function setTimeout(t, e, i) {
    if (i) {
      this.clearTimeout(i);
    }

    var n = Math.floor(cc.pvz.time) + e;
    return this.insertFrameCB(n, t);
  },
  clearTimeout: function clearTimeout(t) {
    var e = this.cbs.findIndex(function (e) {
      return e.id == t;
    });

    if (-1 != e) {
      this.cbs.splice(e, 1);
    }
  },
  updateTimeout: function updateTimeout(t, e, i) {
    var n = this.cbs.find(function (t) {
      return t.id == i;
    });

    if (n) {
      return n.ms += e, i;
    } else {
      return this.setTimeout(t, e, i);
    }
  },
  setInterval: function setInterval(t, e) {
    var i = this.cbId;
    this.cbs2.push({
      id: i,
      cb: t,
      ms: Math.floor(cc.pvz.time) + e,
      inteval: e
    });
    this.cbId++;
    return i;
  },
  clearInterval: function clearInterval(t) {
    var e = this.cbs2.findIndex(function (e) {
      return e.id == t;
    });

    if (-1 != e) {
      this.cbs2.splice(e, 1);
    }
  },
  update: function update(t) {
    var e = this;

    if (!this.timePaused) {
      this.t += t;
      this.t;
      var i = 1e3 * this.t;

      if (this.msIndex < this.frameActions.length && i >= this.frameActions[this.msIndex].ms) {
        this.frameActions[this.msIndex].cbs.forEach(function (t) {
          return t.call(e);
        });
        this.msIndex++;
      }

      if (this.isAngerPressed) {
        cc.pvz.runtimeData.anger -= 125 * t;

        if (cc.pvz.runtimeData.anger <= 0) {
          this.angerEmptyTip.active = !0;
          this.stopAngerMode();
        }
      }

      cc.pvz.runtimeData.anger = Math.min(1e3, cc.pvz.runtimeData.anger + 5 * t);
      this.updateAnger();
    }

    for (; this.cbs.length > 0 && cc.pvz.time > this.cbs[0].ms;) {
      this.cbs.shift().cb.call(this);
    }

    this.cbs2.forEach(function (t) {
      if (cc.pvz.time >= t.ms) {
        t.cb.call(e);
        t.ms += t.inteval;
      }
    });
  },
  startAngerMode: function startAngerMode() {
    if (this.isAngerPressed || this.hasEnded) {//
    } else {
      if (cc.pvz.runtimeData.anger > 0) {
        cc.butler.playMusic(this.bgMusic2);
        this.isAngerPressed = !0;
        this.angerBarSp.spriteFrame = this.angerBarSpfs[1];
        this.angerModeNode.active = !0;
        this.heroes.forEach(function (t) {
          return t.item.startAngerMode();
        });
      }
    }
  },
  stopAngerMode: function stopAngerMode() {
    if (this.isAngerPressed) {
      cc.butler.playMusic(this.bag.bgMusic);
      this.isAngerPressed = !1;
      this.angerBarSp.spriteFrame = this.angerBarSpfs[0];
      this.angerModeNode.active = !1;
      this.heroes.forEach(function (t) {
        return t.item.stopAngerMode();
      });
    }
  },
  startTween: function startTween(t) {
    var e = t._union();

    this.node.runAction(cc.targetedAction(t._target, e));
  },
  pauseGame: function pauseGame() {
    cc.butler.pauseDirector(1);
  },
  resumeGame: function resumeGame() {
    cc.butler.resumeDirector(1);
  },
  onPopup1st: function onPopup1st() {
    if (this.hasEnded) {//
    } else {
      this.timePaused = !0;
    }
  },
  onAllClosed: function onAllClosed() {
    this.timePaused = !1;
  },
  initHeroes: function initHeroes(t) {
    var e = this;
    this.heroes = [];
    t.blockRoot.boardItemsRoot.children.forEach(function (t, i) {
      var n = t.getComponent("Item");
      cc.pvz.utils.useBundleAsset("actors", "plant/plant" + n.id, cc.Prefab, function (t) {
        var o = cc.instantiate(t);
        var s = o.getComponent("Hero");
        o.position = e.objsRoot.convertToNodeSpaceAR(n.spine.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        o.parent = e.objsRoot;
        s.initBy(e, n, {
          json: n.json,
          index: i,
          id: n.id,
          lv1: cc.pvz.PlayerData.getToolData(n.id).lv - 1,
          maxLv: 0
        });
        s.position2 = o.position.add(n.attOffset);
        n.hero = s;
        n.initHeroNodes();
        e.heroes.push(s);
        e.updateHp(!1);
      });
    });
  },
  hasHero: function hasHero(t) {
    return this.heroes.some(function (e) {
      return e.info.id == t && e.hp > 0;
    });
  },
  emitEnemys: function emitEnemys(t) {
    var e = this;
    var i = cc.pvz.runtimeData.wave + 1;

    if (2 == cc.pvz.runtimeData.mode) {
      this.wavePlusHp = 0;
      this.wavePlusAtk = 0;

      if (i > 10) {
        this.wavePlusHp = (i - 10) * this.levelData.hpwave;
        this.wavePlusAtk = (i - 10) * this.levelData.atkwave;
      }

      if (i > 18) {
        i = (i - 19) % 5 + 14;
      }
    }

    this.enemyCount = 0;
    t.filter(function (t) {
      return t.wave == i;
    }).forEach(function (t) {
      var i = e.t + t.time;

      for (var n = 0; n < t.EnemyNum; n++) {
        var o = 1e3 * (i + n * t.Space);
        e.insertFrameAction(o, function () {
          e.executeEvent2(t);
        });
      }

      e.enemyCount += t.EnemyNum;
    });
    this.frameActions.sort(function (t, e) {
      return t.ms - e.ms;
    });
  },
  executeEvent2: function executeEvent2(t) {
    var e = this;
    cc.pvz.utils.useBundleAsset("actors", "Zombie/Enemy" + t.EnemyId, cc.Prefab, function (i) {
      e.executeEventNewEnemy(i, t);
    });
  },
  executeEventNewEnemy: function executeEventNewEnemy(t, e) {
    var i = cc.instantiate(t);
    var n = cc.math.randomRange(this.groundAreaLB.y, this.groundAreaTR.y);
    var o = e.hp;
    var s = e.atk;

    switch (cc.pvz.runtimeData.actBuff2) {
      case 101:
      case 102:
      case 103:
        o *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff2 - 101];
        break;

      case 107:
      case 108:
      case 109:
        s *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff2 - 107];
    }

    switch (cc.pvz.runtimeData.mode) {
      case 0:
        o *= this.levelData.hpadd / 100;
        s *= this.levelData.atkadd / 100;
        break;

      case 1:
        o *= 1 + (cc.pvz.PlayerData.getStageLevel() - 9) * this.levelData.hpadd;
        s *= 1 + (cc.pvz.PlayerData.getStageLevel() - 9) * this.levelData.atkadd;
        break;

      case 2:
        o *= 1 + (cc.pvz.PlayerData.getStageLevel() - 5) * this.levelData.hpadd + this.wavePlusHp;
        s *= 1 + (cc.pvz.PlayerData.getStageLevel() - 5) * this.levelData.atkadd + this.wavePlusAtk;
    }

    var c = this.addEnemyIn(e.EnemyId, i, 360, n, o, s);

    if (2 == cc.pvz.runtimeData.mode) {
      c.exp = 0.6 * c.exp;
    }
  },
  addEnemyIn: function addEnemyIn(t, e, i, n, o, s) {
    e.parent = this.objsRoot;
    e.x = i;
    e.y = n;
    var c = e.getComponent("Enemy");
    c.initBy(this, this.bulletsRoot, o, s);
    c.id = t;
    c.showHpBar = t > 100;
    this.addEnemy(c);
    return c;
  },
  addEnemy: function addEnemy(t) {
    this.enemys.push(t);
  },
  delEnemy: function delEnemy(t) {
    var e = this.enemys.findIndex(function (e) {
      return e == t;
    });

    if (-1 != e) {
      this.enemys.splice(e, 1);
    }

    t.node.parent = null;
    this.enemyCount--;

    if (t.id > 100) {
      this.taskEnemyCount1++;
    } else {
      this.taskEnemyCount2++;
    }

    if ((!this.isLastWave || this.enemyCount > 0) && t.exp > 0) {
      var i = t.exp;
      var n = cc.pvz.runtimeData.getBuffValue(11);

      if (n > 0) {
        i = Math.round(i * (1 + 0.01 * n));
      }

      cc.pvz.runtimeData.exp += i;
      var o = this.hub.lvupJsonFile.json[cc.pvz.runtimeData.lv].exp;

      if (cc.pvz.runtimeData.exp >= o) {
        cc.pvz.runtimeData.exp -= o;
        cc.pvz.runtimeData.lv++;
        cc.butler.playEffectAsync("game", "sound/playerlevelup");
        cc.popupManager.popup("game", "BuffUI", "UIGameBuff", {
          scale: !1
        }, this);
      } else {
        this.checkIsSucc();
      }

      this.hub.updateExp();
    } else {
      this.checkIsSucc();
    }
  },
  addEnemyHpBar: function addEnemyHpBar(t) {
    if (!t.hpBar) {
      var e = (t.showHpBar ? this.eBossHpPrefab : this.eHpPrefab).addNode(t.node.position);
      cc.find("node", e).position = t.hpBarPos;
      t.hpBar = e.getComponent(cc.ProgressBar);
    }
  },
  checkIsSucc: function checkIsSucc() {
    var t = this;

    if (!this.hasEnded && 0 == this.enemyCount) {
      cc.pvz.runtimeData.wave++;

      if (this.taskEnemyCount1 > 0) {
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["击败首领n个"], this.taskEnemyCount1);
      }

      if (this.taskEnemyCount2 > 0) {
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["击败僵尸n个"], this.taskEnemyCount2);
      }

      cc.pvz.runtimeData.addMoney(10 + cc.pvz.runtimeData.getBuffValue(5));

      if (this.isLastWave) {
        this.isSucc = !0;
        this.hasEnded = !0;
        this.enabled = !1;
        this.setSpeedLogic(1);
        cc.popupManager.popup("game", "win", "UIGameEnd", {
          scale: !1
        }, this);
        cc.butler.playEffectAsync("game", "sound/win");
      } else {
        this.waveEndAniSpine.node.active = !0;
        var e = this.moneyIconNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var i = this.waveEndAniSpine.node.convertToNodeSpaceAR(e);
        var n = this.waveEndAniSpine.findBone("IK");
        n.x = i.x;
        n.y = i.y;
        this.waveEndAniSpine.setCompleteListener(function () {
          cc.pvz.runtimeData.autoTimes++;
          cc.pvz.runtimeData.lv2Count = 1;
          t.hub.backToBag();
          t.waveEndAniSpine.node.active = !1;
          t.waveEndAniSpine.setCompleteListener(null);
        });
      }

      if (0 == cc.pvz.runtimeData.mode) {
        cc.pvz.TAUtils.trackEndLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave - 1, !0);
      }
    }
  },
  chooseEnemy: function chooseEnemy(t, e) {
    if (this.hasEnded) {
      return null;
    }

    var i = this.enemys.filter(function (t) {
      return t.hp > 0;
    });
    var n;

    if (this.isAngerPressed) {
      n = 1e6;
    } else {
      n = e;
    }

    var o = null;
    i.forEach(function (e) {
      var i = e.node.position.sub(t.node.position).lengthSqr();

      if (i < n) {
        n = i;
        o = e;
      }
    });
    return o;
  },
  chooseEnemys: function chooseEnemys(t, e, i) {
    var n = this;

    if (this.hasEnded) {
      return null;
    }

    var o = this.enemys.filter(function (i) {
      return i.hp > 0 && n.isAngerPressed || i.node.position.sub(t.node.position).lengthSqr() < e;
    });

    if (i >= o.length) {
      return o;
    }

    var s = [];

    for (var c = 0; c < i; c++) {
      var a = cc.math.randomRangeInt(0, o.length);
      s.push(o.splice(a, 1)[0]);
    }

    return s;
  },
  chooseEnemyByBullet: function chooseEnemyByBullet() {
    if (this.hasEnded) {
      return null;
    }

    var t = this.enemys.filter(function (t) {
      return t.hp > 0;
    });
    return t[cc.math.randomRangeInt(0, t.length)];
  },
  chooseHero: function chooseHero(t) {
    if (this.hasEnded) {
      return null;
    }

    var e = this.heroes.filter(function (t) {
      return t.hp > 0;
    });
    var i = 1600;
    var n = e[0];

    for (var o = 0; o < e.length; o++) {
      var s;

      if (e[o].position2) {
        s = e[o].position2.x;
      } else {
        s = e[o].node.x;
      }

      var c = Math.abs(s - t.x);

      if (c < i) {
        i = c;
        n = e[o];
      }
    }

    return n;
  },
  chooseMinHpHero: function chooseMinHpHero() {
    var t = 1;
    var e = null;

    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].hp > 0) {
        var n = this.heroes[i].hp / this.heroes[i].item.maxHp;

        if (n < t) {
          t = n;
          e = this.heroes[i];
        }
      }
    }

    return e;
  },
  getHeroesMaxMarginX: function getHeroesMaxMarginX() {
    return this.heroes.filter(function (t) {
      return t.hp > 0;
    }).reduce(function (t, e) {
      return Math.max(t, e.node.x + e.item.righMargin);
    }, -360);
  },
  checkIsFail: function checkIsFail() {
    var t = this;

    if (this.heroes.some(function (t) {
      return !t.hasDie;
    })) {//
    } else {
      this.isSucc = !1;
      this.hasEnded = !0;
      cc.butler.playEffectAsync("game", "sound/fail");

      if (2 == cc.pvz.runtimeData.mode) {
        this.setSpeedLogic(1), cc.popupManager.popup("rank", "Rankwin", "UIRankEnd", {
          scale: !1
        }, this);
      } else {
        if (cc.pvz.runtimeData.hasReborn) {
          this.setSpeedLogic(1), cc.popupManager.popup("game", "win", "UIGameEnd", {
            scale: !1
          }, this), 0 == cc.pvz.runtimeData.mode && cc.pvz.TAUtils.trackEndLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave, !1);
        } else {
          cc.popupManager.popup("game", "fuhuoUI", "UIGameReborn", {
            scale: !1
          }, function (e) {
            if (e) {
              cc.pvz.runtimeData.addMoney(30);
              cc.pvz.runtimeData.anger = 1e3;
              cc.pvz.runtimeData.hasReborn = !0;
              cc.pvz.runtimeData.autoTimes++;
              cc.pvz.runtimeData.lv2Count = 1;
              cc.director.loadScene("game1");
            } else {
              cc.popupManager.popup("game", "win", "UIGameEnd", {
                scale: !1
              }, t);
            }
          });
        }
      }
    }
  },
  showEnemyHurtNum: function showEnemyHurtNum(t, e, i) {
    var n = (1 == t ? this.eHurtCritNum : this.eHurtNum).addNode(e);
    n.x += cc.math.randomRange(-40, 40);
    n.y += 50 + cc.math.randomRange(-10, 40);
    cc.find("num", n).getComponent(cc.Label).string = "-" + Math.max(1, Math.floor(i));
    n.getComponent(cc.Animation).play();
    n.getComponent(cc.Animation).on("finished", function () {
      n.parent = null;
    });
  },
  showJsEffect: function showJsEffect(t, e) {
    if (12 != e) {
      this.eHitPrefab.addNode(t).getComponent(sp.Skeleton).setAnimation(0, "zd" + e + "_hit" + cc.math.randomRangeInt(1, 4), !1);
    }

    this.eHitGroundPrefab.addNode(t).getComponent(sp.Skeleton).setAnimation(0, "zd" + e + "_js" + cc.math.randomRangeInt(1, 4), !1);
  },
  showHeroHurtNum: function showHeroHurtNum(t, e) {
    var i = this.pHurtNum.addNode(t);
    i.x += cc.math.randomRange(-40, 40);
    i.y += cc.math.randomRange(10, 70);
    cc.find("num", i).getComponent(cc.Label).string = "-" + Math.floor(e);
    i.getComponent(cc.Animation).play();
    i.getComponent(cc.Animation).on("finished", function () {
      i.parent = null;
    });
  },
  onClickSpeed: function onClickSpeed() {
    if (cc.pvz.runtimeData.openSpeed) {
      if (1 == cc.pvz.runtimeData.speed) {
        cc.pvz.runtimeData.speed = 2;
      } else {
        cc.pvz.runtimeData.speed = 1;
      }

      this.updateSpeed();
    } else {
      cc.popupManager.popup("game", "2speedUI", "UISpeed", {
        scale: !1
      }, this);
    }
  },
  updateSpeed: function updateSpeed() {
    this.setSpeedLogic(cc.pvz.runtimeData.speed);
  },
  setSpeedLogic: function setSpeedLogic(t) {
    sp.timeScale = t;
    cc.director.getScheduler().setTimeScale(t);
  },
  onClickStats: function onClickStats() {
    if (this.isStatsShown) {
      this.hideStats();
    } else {
      this.statsPanel.active = !0;
      this.isStatsShown = !0;
      this.updateStats();
      this.statsPanel.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Normal;
      this.statsPanel.getComponent(cc.Animation).off("finished");
    }
  },
  updateStats: function updateStats() {
    var t = this;

    if (this.isStatsShown) {
      var e = Math.max(1, cc.pvz.runtimeData.stats.reduce(function (t, e) {
        return t + e;
      }, 0));
      this.heroes.sort(function (t, e) {
        return cc.pvz.runtimeData.stats[e.info.id] - cc.pvz.runtimeData.stats[t.info.id];
      }).forEach(function (i, n) {
        if (i.zd) {
          var o = t.statsItemPrefab.root.children.find(function (t) {
            return t.__id == i.info.id;
          });

          if (o) {//
          } else {
            (o = t.statsItemPrefab.addNode()).__id = i.info.id;
          }

          o.zIndex = n;
          var s = cc.pvz.runtimeData.stats[i.info.id];
          var c = i.info.json;
          cc.pvz.utils.setSpriteFrame(cc.find("quality", o).getComponent(cc.Sprite), "uiImage", "item/pz_" + c.quality);
          var a = cc.find("icon", o).getComponent(sp.Skeleton);
          a.skeletonData = i.spine.skeletonData;
          a.setAnimation(0, "Idle", !0);
          cc.find("name", o).getComponent(cc.Label).string = c.name;
          var r = s / e;
          cc.find("num2", o).getComponent(cc.Label).string = (100 * r).toFixed(2) + "%";
          cc.find("bar", o).getComponent(cc.ProgressBar).progress = r;
        }
      });
    }
  },
  hideStats: function hideStats() {
    var t = this;
    this.isStatsShown = !1;
    this.statsPanel.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Reverse;
    this.statsPanel.getComponent(cc.Animation).once("finished", function () {
      t.statsPanel.active = !1;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvZ2FtZS5qcyJdLCJuYW1lcyI6WyIkcHJlZmFiSW5mbyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImJnMlNwIiwiU3ByaXRlIiwiZ3JvdW5kQXJlYU5vZGUiLCJOb2RlIiwiYmdNdXNpYzIiLCJBdWRpb0NsaXAiLCJzaGllbGRCYXIiLCJQcm9ncmVzc0JhciIsInNoaWVsZExhYmVsIiwiTGFiZWwiLCJocEJhciIsImhwTGFiZWwiLCJwYXVzZU5vZGUiLCJzcGVlZE5vZGUiLCJzcGVlZExhYmVsIiwic3RhdHNCdG5Ob2RlIiwibGV2ZWxzSnNvbkZpbGUiLCJKc29uQXNzZXQiLCJncm91bmQiLCJvYmpzUm9vdCIsImJ1bGxldHNSb290IiwiZmlnaHROb2RlcyIsImhlcm9Kc29uRmlsZSIsImVIdXJ0TnVtIiwiZUh1cnRDcml0TnVtIiwiZURpZVByZWZhYiIsImVQb2lzb25QcmVmYWIiLCJlU2xvd1ByZWZhYiIsImVJY2VQcmVmYWIiLCJlV2Vha1ByZWZhYiIsImVIcFByZWZhYiIsImVCb3NzSHBQcmVmYWIiLCJlSGl0UHJlZmFiIiwiZUhpdEdyb3VuZFByZWZhYiIsInBIdXJ0TnVtIiwicEZpcmVFZmZlY3QiLCJhZGRCdWZmUHJlZmFiIiwiYWNjQnVmZlByZWZhYiIsIndhdmVFbmRBbmlTcGluZSIsInNwIiwiU2tlbGV0b24iLCJtb25leUljb25Ob2RlIiwidHJ5UGxhbnROb2RlIiwidHJ5UGxhbnRJY29uIiwic3RhdHNQYW5lbCIsInN0YXRzSXRlbVByZWZhYiIsImFuZ2VyQmFyIiwiYW5nZXJCYXJTcCIsImFuZ2VyQmFyU3BmcyIsIlNwcml0ZUZyYW1lIiwiYW5nZXJFbXB0eVRpcCIsImFuZ2VyQmFyTm9kZSIsImFuZ2VyTW9kZU5vZGUiLCJvbkxvYWQiLCJub2RlIiwiYWN0aXZlIiwic3RhcnRMb2dpYyIsInQiLCJlIiwiaSIsImh1YiIsImxldmVsRGF0YSIsIm4iLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJncm91bmRBcmVhTEIiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsInYyIiwieE1pbiIsInlNaW4iLCJncm91bmRBcmVhVFIiLCJ4TWF4IiwieU1heCIsInRpbWVQYXVzZWQiLCJtc0luZGV4IiwiZnJhbWVBY3Rpb25zIiwiY2JzMiIsImNiSWQiLCJwYXVzZWRDYnMiLCJwYXVzZWRDYnMyIiwiaGFzRW5kZWQiLCJwdnoiLCJydW50aW1lRGF0YSIsIm1vZGUiLCJtYXhXYXZlIiwid2F2ZSIsImlzTGFzdFdhdmUiLCJlbmVteXMiLCJ0YXNrRW5lbXlDb3VudDEiLCJ0YXNrRW5lbXlDb3VudDIiLCJidXRsZXIiLCJvbiIsIm9uR2V0SHBCdWZmIiwiaW5pdEhlcm9lcyIsInVwZGF0ZUhwIiwidXBkYXRlU2hpZWxkIiwidXBkYXRlU3BlZWQiLCJpc0FuZ2VyUHJlc3NlZCIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwic3RhcnRBbmdlck1vZGUiLCJUT1VDSF9FTkQiLCJzdG9wQW5nZXJNb2RlIiwiVE9VQ0hfQ0FOQ0VMIiwidXBkYXRlQW5nZXIiLCJkaXJlY3RvciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJlbmFibGVkIiwic2hvd0dhbWUxc3QiLCJndWlkZU1hbmFnZXIiLCJzaG93R3VpZGUiLCJoaWRlRmluZ2VyIiwidGlwIiwiYmVnaW5FbWl0RW5lbXlzIiwiRGlyZWN0b3IiLCJFVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORyIsInJlc2V0U3BlZWQiLCJvbkJhY2tGcm9tR2FtZSIsImZvckVhY2giLCJyZW1vdmVBbGxDaGlsZHJlbiIsIm9mZiIsImhlcm9lcyIsIklLQm9uZSIsInR3ZWVuIiwidG8iLCJ4IiwieSIsInN0YXJ0IiwibGV2ZWwiLCJwb3B1cE1hbmFnZXIiLCJzaG93VG9hc3QiLCJ1dGlscyIsInVzZUJ1bmRsZUFzc2V0IiwiZW1pdEVuZW15cyIsImpzb24iLCJzZXRTcGVlZExvZ2ljIiwicHJvZ3Jlc3MiLCJhbmdlciIsIndpZHRoIiwib3BhY2l0eSIsImdldE1vbmV5V1BvcyIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlZlYzIiLCJaRVJPIiwiZ2V0QW5nZXJCYXJXUG9zIiwic2hvd0J1ZmZFZmZlY3QiLCJvIiwiYWRkTm9kZSIsInMiLCJnZXRDb21wb25lbnQiLCJjIiwic2V0QW5pbWF0aW9uIiwiYSIsInIiLCJmaW5kQm9uZSIsInNldFRyYWNrQ29tcGxldGVMaXN0ZW5lciIsImJhZyIsInJlZHVjZSIsImhwIiwiaXRlbSIsIm1heEhwIiwic3RyaW5nIiwiTWF0aCIsInJvdW5kIiwic2hpZWxkVmFsdWUiLCJwYXJlbnQiLCJmbG9vciIsImluc2VydEZyYW1lQWN0aW9uIiwiZmluZCIsIm1zIiwiY2JzIiwicHVzaCIsImluc2VydEZyYW1lQ0IiLCJmaW5kSW5kZXgiLCJsZW5ndGgiLCJzcGxpY2UiLCJjYiIsImlkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInRpbWUiLCJ1cGRhdGVUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJpbnRldmFsIiwiY2xlYXJJbnRlcnZhbCIsInVwZGF0ZSIsImNhbGwiLCJtaW4iLCJzaGlmdCIsInBsYXlNdXNpYyIsInNwcml0ZUZyYW1lIiwiYmdNdXNpYyIsInN0YXJ0VHdlZW4iLCJfdW5pb24iLCJydW5BY3Rpb24iLCJ0YXJnZXRlZEFjdGlvbiIsIl90YXJnZXQiLCJwYXVzZUdhbWUiLCJwYXVzZURpcmVjdG9yIiwicmVzdW1lR2FtZSIsInJlc3VtZURpcmVjdG9yIiwib25Qb3B1cDFzdCIsIm9uQWxsQ2xvc2VkIiwiYmxvY2tSb290IiwiYm9hcmRJdGVtc1Jvb3QiLCJjaGlsZHJlbiIsIlByZWZhYiIsImluc3RhbnRpYXRlIiwicG9zaXRpb24iLCJzcGluZSIsImluaXRCeSIsImluZGV4IiwibHYxIiwiUGxheWVyRGF0YSIsImdldFRvb2xEYXRhIiwibHYiLCJtYXhMdiIsInBvc2l0aW9uMiIsImFkZCIsImF0dE9mZnNldCIsImhlcm8iLCJpbml0SGVyb05vZGVzIiwiaGFzSGVybyIsInNvbWUiLCJpbmZvIiwid2F2ZVBsdXNIcCIsIndhdmVQbHVzQXRrIiwiaHB3YXZlIiwiYXRrd2F2ZSIsImVuZW15Q291bnQiLCJmaWx0ZXIiLCJFbmVteU51bSIsIlNwYWNlIiwiZXhlY3V0ZUV2ZW50MiIsInNvcnQiLCJFbmVteUlkIiwiZXhlY3V0ZUV2ZW50TmV3RW5lbXkiLCJtYXRoIiwicmFuZG9tUmFuZ2UiLCJhdGsiLCJhY3RCdWZmMiIsImhwYWRkIiwiYXRrYWRkIiwiZ2V0U3RhZ2VMZXZlbCIsImFkZEVuZW15SW4iLCJleHAiLCJzaG93SHBCYXIiLCJhZGRFbmVteSIsImRlbEVuZW15IiwiZ2V0QnVmZlZhbHVlIiwibHZ1cEpzb25GaWxlIiwicGxheUVmZmVjdEFzeW5jIiwicG9wdXAiLCJzY2FsZSIsImNoZWNrSXNTdWNjIiwidXBkYXRlRXhwIiwiYWRkRW5lbXlIcEJhciIsImhwQmFyUG9zIiwiYWRkTWlzc2lvblByb2dyZXNzIiwiR2FtZUNvbmZpZyIsIk1pc3Npb25UeXBlIiwiYWRkTW9uZXkiLCJpc1N1Y2MiLCJzZXRDb21wbGV0ZUxpc3RlbmVyIiwiYXV0b1RpbWVzIiwibHYyQ291bnQiLCJiYWNrVG9CYWciLCJUQVV0aWxzIiwidHJhY2tFbmRMZXZlbCIsImNob29zZUVuZW15Iiwic3ViIiwibGVuZ3RoU3FyIiwiY2hvb3NlRW5lbXlzIiwicmFuZG9tUmFuZ2VJbnQiLCJjaG9vc2VFbmVteUJ5QnVsbGV0IiwiY2hvb3NlSGVybyIsImFicyIsImNob29zZU1pbkhwSGVybyIsImdldEhlcm9lc01heE1hcmdpblgiLCJtYXgiLCJyaWdoTWFyZ2luIiwiY2hlY2tJc0ZhaWwiLCJoYXNEaWUiLCJoYXNSZWJvcm4iLCJsb2FkU2NlbmUiLCJzaG93RW5lbXlIdXJ0TnVtIiwiQW5pbWF0aW9uIiwicGxheSIsInNob3dKc0VmZmVjdCIsInNob3dIZXJvSHVydE51bSIsIm9uQ2xpY2tTcGVlZCIsIm9wZW5TcGVlZCIsInNwZWVkIiwidGltZVNjYWxlIiwiZ2V0U2NoZWR1bGVyIiwic2V0VGltZVNjYWxlIiwib25DbGlja1N0YXRzIiwiaXNTdGF0c1Nob3duIiwiaGlkZVN0YXRzIiwidXBkYXRlU3RhdHMiLCJ3cmFwTW9kZSIsIldyYXBNb2RlIiwiTm9ybWFsIiwic3RhdHMiLCJ6ZCIsInJvb3QiLCJfX2lkIiwiekluZGV4Iiwic2V0U3ByaXRlRnJhbWUiLCJxdWFsaXR5Iiwic2tlbGV0b25EYXRhIiwibmFtZSIsInRvRml4ZWQiLCJSZXZlcnNlIiwib25jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQywwQkFBRCxDQUF6Qjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUosRUFBRSxDQUFDSyxNQURGO0lBRVJDLGNBQWMsRUFBRU4sRUFBRSxDQUFDTyxJQUZYO0lBR1JDLFFBQVEsRUFBRVIsRUFBRSxDQUFDUyxTQUhMO0lBSVJDLFNBQVMsRUFBRVYsRUFBRSxDQUFDVyxXQUpOO0lBS1JDLFdBQVcsRUFBRVosRUFBRSxDQUFDYSxLQUxSO0lBTVJDLEtBQUssRUFBRWQsRUFBRSxDQUFDVyxXQU5GO0lBT1JJLE9BQU8sRUFBRWYsRUFBRSxDQUFDYSxLQVBKO0lBUVJHLFNBQVMsRUFBRWhCLEVBQUUsQ0FBQ08sSUFSTjtJQVNSVSxTQUFTLEVBQUVqQixFQUFFLENBQUNPLElBVE47SUFVUlcsVUFBVSxFQUFFbEIsRUFBRSxDQUFDYSxLQVZQO0lBV1JNLFlBQVksRUFBRW5CLEVBQUUsQ0FBQ08sSUFYVDtJQVlSYSxjQUFjLEVBQUVwQixFQUFFLENBQUNxQixTQVpYO0lBYVJDLE1BQU0sRUFBRXRCLEVBQUUsQ0FBQ08sSUFiSDtJQWNSZ0IsUUFBUSxFQUFFdkIsRUFBRSxDQUFDTyxJQWRMO0lBZVJpQixXQUFXLEVBQUV4QixFQUFFLENBQUNPLElBZlI7SUFnQlJrQixVQUFVLEVBQUUsQ0FBQ3pCLEVBQUUsQ0FBQ08sSUFBSixDQWhCSjtJQWlCUm1C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VUFBaEQsRUFBNEQsWUFBWTtNQUNwRWhRLENBQUMsQ0FBQ2IsVUFBRixDQUFhVyxNQUFiLEdBQXNCLENBQUMsQ0FBdkI7SUFDSCxDQUZEO0VBR0g7QUExNEJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkcHJlZmFiSW5mbyA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL1ByZWZhYkluZm9cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmcyU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgZ3JvdW5kQXJlYU5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGJnTXVzaWMyOiBjYy5BdWRpb0NsaXAsXG4gICAgICAgIHNoaWVsZEJhcjogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIHNoaWVsZExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgaHBCYXI6IGNjLlByb2dyZXNzQmFyLFxuICAgICAgICBocExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcGF1c2VOb2RlOiBjYy5Ob2RlLFxuICAgICAgICBzcGVlZE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHNwZWVkTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBzdGF0c0J0bk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGxldmVsc0pzb25GaWxlOiBjYy5Kc29uQXNzZXQsXG4gICAgICAgIGdyb3VuZDogY2MuTm9kZSxcbiAgICAgICAgb2Jqc1Jvb3Q6IGNjLk5vZGUsXG4gICAgICAgIGJ1bGxldHNSb290OiBjYy5Ob2RlLFxuICAgICAgICBmaWdodE5vZGVzOiBbY2MuTm9kZV0sXG4gICAgICAgIGhlcm9Kc29uRmlsZTogY2MuSnNvbkFzc2V0LFxuICAgICAgICBlSHVydE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIGVIdXJ0Q3JpdE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIGVEaWVQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlUG9pc29uUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZVNsb3dQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlSWNlUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZVdlYWtQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlSHBQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlQm9zc0hwUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZUhpdFByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVIaXRHcm91bmRQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBwSHVydE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIHBGaXJlRWZmZWN0OiAkcHJlZmFiSW5mbyxcbiAgICAgICAgYWRkQnVmZlByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGFjY0J1ZmZQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICB3YXZlRW5kQW5pU3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICBtb25leUljb25Ob2RlOiBjYy5Ob2RlLFxuICAgICAgICB0cnlQbGFudE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHRyeVBsYW50SWNvbjogY2MuU3ByaXRlLFxuICAgICAgICBzdGF0c1BhbmVsOiBjYy5Ob2RlLFxuICAgICAgICBzdGF0c0l0ZW1QcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBhbmdlckJhcjogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIGFuZ2VyQmFyU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgYW5nZXJCYXJTcGZzOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgICAgICBhbmdlckVtcHR5VGlwOiBjYy5Ob2RlLFxuICAgICAgICBhbmdlckJhck5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGFuZ2VyTW9kZU5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLndhdmVFbmRBbmlTcGluZS5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBpZiAodGhpcy5zdGF0c1BhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRzUGFuZWwuYWN0aXZlID0gITE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmdlckVtcHR5VGlwLmFjdGl2ZSA9ICExO1xuICAgIH0sXG4gICAgc3RhcnRMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaHViLmxldmVsRGF0YTtcbiAgICAgICAgdGhpcy5sZXZlbERhdGEgPSBpO1xuICAgICAgICB2YXIgbiA9IHRoaXMuZ3JvdW5kQXJlYU5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgIHRoaXMuZ3JvdW5kQXJlYUxCID0gdGhpcy5vYmpzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihjYy52MihuLnhNaW4sIG4ueU1pbikpO1xuICAgICAgICB0aGlzLmdyb3VuZEFyZWFUUiA9IHRoaXMub2Jqc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIoY2MudjIobi54TWF4LCBuLnlNYXgpKTtcbiAgICAgICAgdGhpcy50aW1lUGF1c2VkID0gITE7XG4gICAgICAgIHRoaXMudCA9IDA7XG4gICAgICAgIHRoaXMubXNJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zID0gW107XG4gICAgICAgIHRoaXMuY2JzMiA9IFtdO1xuICAgICAgICB0aGlzLmNiSWQgPSAxO1xuICAgICAgICB0aGlzLnBhdXNlZENicyA9IFtdO1xuICAgICAgICB0aGlzLnBhdXNlZENiczIgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNFbmRlZCA9ICExO1xuICAgICAgICB0aGlzLnN0YXRzQnRuTm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgaWYgKDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4V2F2ZSA9IDk5OTk5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXhXYXZlID0gaS53YXZlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNMYXN0V2F2ZSA9IDIgIT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLndhdmUgPT0gaS53YXZlIC0gMTtcbiAgICAgICAgdGhpcy5lbmVteXMgPSBbXTtcbiAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDEgPSAwO1xuICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MiA9IDA7XG4gICAgICAgIGNjLmJ1dGxlci5ub2RlLm9uKFwibWF4SHBcIiwgdGhpcy5vbkdldEhwQnVmZiwgdGhpcyk7XG4gICAgICAgIHRoaXMuaW5pdEhlcm9lcyh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVIcCghMSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hpZWxkKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3BlZWQoKTtcbiAgICAgICAgdGhpcy5pc0FuZ2VyUHJlc3NlZCA9ICExO1xuICAgICAgICB0aGlzLmFuZ2VyQmFyTm9kZS5vbihcbiAgICAgICAgICAgIGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RhcnRBbmdlck1vZGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5nZXJCYXJOb2RlLm9uKFxuICAgICAgICAgICAgY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIGUuYW5nZXJFbXB0eVRpcC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5nZXJCYXJOb2RlLm9uKFxuICAgICAgICAgICAgY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIGUuYW5nZXJFbXB0eVRpcC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudXBkYXRlQW5nZXIoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSAhMDtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGU7XG4gICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QgJiYgMCA9PSBjYy5wdnoucnVudGltZURhdGEud2F2ZSkge1xuICAgICAgICAgICAgY2MuZ3VpZGVNYW5hZ2VyLnNob3dHdWlkZShcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXA6IFwi5YO15bC45q2j5Zyo6L+b5pS75oiR5Lus55qE6Iqx5Zut77yM6LW257Sn5raI54Gt5LuW5LusIVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmJlZ2luRW1pdEVuZW15cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmVnaW5FbWl0RW5lbXlzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVkID0gITA7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HLCB0aGlzLnJlc2V0U3BlZWQsIHRoaXMpO1xuICAgIH0sXG4gICAgb25CYWNrRnJvbUdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wQW5nZXJNb2RlKCk7XG4gICAgICAgIHRoaXMuZmlnaHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub2ZmKFwibWF4SHBcIiwgdGhpcy5vbkdldEhwQnVmZiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9ICExO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcsIHRoaXMucmVzZXRTcGVlZCwgdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkID0gITE7XG4gICAgICAgIHRoaXMuaGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0LklLQm9uZSkge1xuICAgICAgICAgICAgICAgIGNjLnR3ZWVuKHQuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IDUwXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGJlZ2luRW1pdEVuZW15czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHZhciBlID0gbnVsbDtcbiAgICAgICAgdmFyIGkgPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgZSA9IFwiZ2FtZVwiO1xuICAgICAgICAgICAgICAgIGkgPSBcImNvbmZpZy9MZXZlbFwiICsgdGhpcy5sZXZlbERhdGEubGV2ZWw7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCkge1xuICAgICAgICAgICAgICAgICAgICBpICs9IFwiQlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBlID0gXCJnYW1lXCI7XG4gICAgICAgICAgICAgICAgaSA9IFwiY29uZmlnL1wiICsgdGhpcy5sZXZlbERhdGEubGV2ZWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZSA9IFwicmFua1wiO1xuICAgICAgICAgICAgICAgIGkgPSBcImNvbmZpZy9cIiArIHRoaXMubGV2ZWxEYXRhLmxldmVsO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5zaG93VG9hc3QoXCLnrKxcIiArIChjYy5wdnoucnVudGltZURhdGEud2F2ZSArIDEpICsgXCLms6LlvIDlp4tcIik7XG4gICAgICAgIH1cbiAgICAgICAgY2MucHZ6LnV0aWxzLnVzZUJ1bmRsZUFzc2V0KGUsIGksIGNjLkpzb25Bc3NldCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHQuZW1pdEVuZW15cyhlLmpzb24pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2V0U3BlZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpO1xuICAgIH0sXG4gICAgdXBkYXRlQW5nZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hbmdlckJhci5wcm9ncmVzcyA9IGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciAvIDFlMztcbiAgICAgICAgaWYgKHRoaXMuYW5nZXJCYXIubm9kZS53aWR0aCA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmFuZ2VyQmFyLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJCYXIubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TW9uZXlXUG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbmV5SWNvbk5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgfSxcbiAgICBnZXRBbmdlckJhcldQb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nZXJCYXIubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIodGhpcy5hbmdlckJhci5ub2RlLndpZHRoLCAwKSk7XG4gICAgfSxcbiAgICBzaG93QnVmZkVmZmVjdDogZnVuY3Rpb24gKHQsIGUsIGksIG4pIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmFkZEJ1ZmZQcmVmYWIuYWRkTm9kZShlKTtcbiAgICAgICAgdmFyIHMgPSBvLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgIHZhciBjID0gcy5zZXRBbmltYXRpb24oMCwgdCwgITEpO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdmFyIGEgPSBvLmNvbnZlcnRUb05vZGVTcGFjZUFSKGkpO1xuICAgICAgICAgICAgdmFyIHIgPSBzLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICByLnggPSBhLng7XG4gICAgICAgICAgICByLnkgPSBhLnk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHMuc2V0VHJhY2tDb21wbGV0ZUxpc3RlbmVyKGMsIG4pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkdldEhwQnVmZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJhZy51cGRhdGVIcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUhwKCk7XG4gICAgfSxcbiAgICB1cGRhdGVIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmhlcm9lcy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICsgZS5ocDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHZhciBpID0gdGhpcy5oZXJvZXMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdCArIGUuaXRlbS5tYXhIcDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIGlmICgwICE9IGkpIHtcbiAgICAgICAgICAgIHRoaXMuaHBMYWJlbC5zdHJpbmcgPSBNYXRoLnJvdW5kKGUpO1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICBjYy50d2Vlbih0aGlzLmhwQmFyKVxuICAgICAgICAgICAgICAgICAgICAudG8oMC4xLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogZSAvIGlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSBlIC8gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlU2hpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5oZXJvZXMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdCArIGUuc2hpZWxkVmFsdWU7XG4gICAgICAgIH0sIDApO1xuICAgICAgICB2YXIgZSA9IHRoaXMuaGVyb2VzLnJlZHVjZShmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgcmV0dXJuIHQgKyBlLml0ZW0ubWF4SHA7XG4gICAgICAgIH0sIDApO1xuICAgICAgICB2YXIgaSA9IHQgPiAwO1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5ub2RlLmFjdGl2ZSA9IGk7XG4gICAgICAgIHRoaXMuc2hpZWxkTGFiZWwubm9kZS5wYXJlbnQuYWN0aXZlID0gaTtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkTGFiZWwuc3RyaW5nID0gTWF0aC5mbG9vcih0KTtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gdCAvIGU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluc2VydEZyYW1lQWN0aW9uOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuZnJhbWVBY3Rpb25zLmZpbmQoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLm1zID09IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaS5jYnMucHVzaChlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIG1zOiB0LFxuICAgICAgICAgICAgICAgIGNiczogW2VdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5zZXJ0RnJhbWVDQjogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmNiSWQ7XG4gICAgICAgIHZhciBuID0gdGhpcy5jYnMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5tcyA+IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbztcbiAgICAgICAgaWYgKC0xID09IG4pIHtcbiAgICAgICAgICAgIG8gPSB0aGlzLmNicy5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvID0gbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNicy5zcGxpY2UobywgMCwge1xuICAgICAgICAgICAgbXM6IHQsXG4gICAgICAgICAgICBjYjogZSxcbiAgICAgICAgICAgIGlkOiBpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNiSWQrKztcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVvdXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKGNjLnB2ei50aW1lKSArIGU7XG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEZyYW1lQ0IobiwgdCk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5jYnMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5pZCA9PSB0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKC0xICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlVGltZW91dDogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmNicy5maW5kKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5pZCA9PSBpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHJldHVybiAobi5tcyArPSBlKSwgaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFRpbWVvdXQodCwgZSwgaSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEludGVydmFsOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuY2JJZDtcbiAgICAgICAgdGhpcy5jYnMyLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgICBjYjogdCxcbiAgICAgICAgICAgIG1zOiBNYXRoLmZsb29yKGNjLnB2ei50aW1lKSArIGUsXG4gICAgICAgICAgICBpbnRldmFsOiBlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNiSWQrKztcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBjbGVhckludGVydmFsOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuY2JzMi5maW5kSW5kZXgoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmlkID09IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoLTEgIT0gZSkge1xuICAgICAgICAgICAgdGhpcy5jYnMyLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy50aW1lUGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLnQgKz0gdDtcbiAgICAgICAgICAgIHRoaXMudDtcbiAgICAgICAgICAgIHZhciBpID0gMWUzICogdGhpcy50O1xuICAgICAgICAgICAgaWYgKHRoaXMubXNJbmRleCA8IHRoaXMuZnJhbWVBY3Rpb25zLmxlbmd0aCAmJiBpID49IHRoaXMuZnJhbWVBY3Rpb25zW3RoaXMubXNJbmRleF0ubXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lQWN0aW9uc1t0aGlzLm1zSW5kZXhdLmNicy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmNhbGwoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tc0luZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciAtPSAxMjUgKiB0O1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuYW5nZXIgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRW1wdHlUaXAuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciA9IE1hdGgubWluKDFlMywgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyICsgNSAqIHQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmdlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyB0aGlzLmNicy5sZW5ndGggPiAwICYmIGNjLnB2ei50aW1lID4gdGhpcy5jYnNbMF0ubXM7ICkge1xuICAgICAgICAgICAgdGhpcy5jYnMuc2hpZnQoKS5jYi5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2JzMi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoY2MucHZ6LnRpbWUgPj0gdC5tcykge1xuICAgICAgICAgICAgICAgIHQuY2IuY2FsbChlKTtcbiAgICAgICAgICAgICAgICB0Lm1zICs9IHQuaW50ZXZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzdGFydEFuZ2VyTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCB8fCB0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciA+IDApIHtcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheU11c2ljKHRoaXMuYmdNdXNpYzIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBbmdlclByZXNzZWQgPSAhMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyQmFyU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmFuZ2VyQmFyU3Bmc1sxXTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyTW9kZU5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5pdGVtLnN0YXJ0QW5nZXJNb2RlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0b3BBbmdlck1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmdlclByZXNzZWQpIHtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5TXVzaWModGhpcy5iYWcuYmdNdXNpYyk7XG4gICAgICAgICAgICB0aGlzLmlzQW5nZXJQcmVzc2VkID0gITE7XG4gICAgICAgICAgICB0aGlzLmFuZ2VyQmFyU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmFuZ2VyQmFyU3Bmc1swXTtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJNb2RlTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuaGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdC5pdGVtLnN0b3BBbmdlck1vZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydFR3ZWVuOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHQuX3VuaW9uKCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MudGFyZ2V0ZWRBY3Rpb24odC5fdGFyZ2V0LCBlKSk7XG4gICAgfSxcbiAgICBwYXVzZUdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuYnV0bGVyLnBhdXNlRGlyZWN0b3IoMSk7XG4gICAgfSxcbiAgICByZXN1bWVHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5yZXN1bWVEaXJlY3RvcigxKTtcbiAgICB9LFxuICAgIG9uUG9wdXAxc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVQYXVzZWQgPSAhMDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25BbGxDbG9zZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lUGF1c2VkID0gITE7XG4gICAgfSxcbiAgICBpbml0SGVyb2VzOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGVyb2VzID0gW107XG4gICAgICAgIHQuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQsIGkpIHtcbiAgICAgICAgICAgIHZhciBuID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgY2MucHZ6LnV0aWxzLnVzZUJ1bmRsZUFzc2V0KFwiYWN0b3JzXCIsIFwicGxhbnQvcGxhbnRcIiArIG4uaWQsIGNjLlByZWZhYiwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IGNjLmluc3RhbnRpYXRlKHQpO1xuICAgICAgICAgICAgICAgIHZhciBzID0gby5nZXRDb21wb25lbnQoXCJIZXJvXCIpO1xuICAgICAgICAgICAgICAgIG8ucG9zaXRpb24gPSBlLm9ianNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKG4uc3BpbmUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKSk7XG4gICAgICAgICAgICAgICAgby5wYXJlbnQgPSBlLm9ianNSb290O1xuICAgICAgICAgICAgICAgIHMuaW5pdEJ5KGUsIG4sIHtcbiAgICAgICAgICAgICAgICAgICAganNvbjogbi5qc29uLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG4uaWQsXG4gICAgICAgICAgICAgICAgICAgIGx2MTogY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEobi5pZCkubHYgLSAxLFxuICAgICAgICAgICAgICAgICAgICBtYXhMdjogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHMucG9zaXRpb24yID0gby5wb3NpdGlvbi5hZGQobi5hdHRPZmZzZXQpO1xuICAgICAgICAgICAgICAgIG4uaGVybyA9IHM7XG4gICAgICAgICAgICAgICAgbi5pbml0SGVyb05vZGVzKCk7XG4gICAgICAgICAgICAgICAgZS5oZXJvZXMucHVzaChzKTtcbiAgICAgICAgICAgICAgICBlLnVwZGF0ZUhwKCExKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGhhc0hlcm86IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlcm9lcy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5pbmZvLmlkID09IHQgJiYgZS5ocCA+IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZW1pdEVuZW15czogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB2YXIgaSA9IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlICsgMTtcbiAgICAgICAgaWYgKDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMud2F2ZVBsdXNIcCA9IDA7XG4gICAgICAgICAgICB0aGlzLndhdmVQbHVzQXRrID0gMDtcbiAgICAgICAgICAgIGlmIChpID4gMTApIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhdmVQbHVzSHAgPSAoaSAtIDEwKSAqIHRoaXMubGV2ZWxEYXRhLmhwd2F2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLndhdmVQbHVzQXRrID0gKGkgLSAxMCkgKiB0aGlzLmxldmVsRGF0YS5hdGt3YXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPiAxOCkge1xuICAgICAgICAgICAgICAgIGkgPSAoKGkgLSAxOSkgJSA1KSArIDE0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5lbXlDb3VudCA9IDA7XG4gICAgICAgIHQuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC53YXZlID09IGk7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBpID0gZS50ICsgdC50aW1lO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0LkVuZW15TnVtOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IDFlMyAqIChpICsgbiAqIHQuU3BhY2UpO1xuICAgICAgICAgICAgICAgIGUuaW5zZXJ0RnJhbWVBY3Rpb24obywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBlLmV4ZWN1dGVFdmVudDIodCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLmVuZW15Q291bnQgKz0gdC5FbmVteU51bTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zLnNvcnQoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0Lm1zIC0gZS5tcztcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleGVjdXRlRXZlbnQyOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGNjLnB2ei51dGlscy51c2VCdW5kbGVBc3NldChcImFjdG9yc1wiLCBcIlpvbWJpZS9FbmVteVwiICsgdC5FbmVteUlkLCBjYy5QcmVmYWIsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlLmV4ZWN1dGVFdmVudE5ld0VuZW15KGksIHQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGV4ZWN1dGVFdmVudE5ld0VuZW15OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IGNjLmluc3RhbnRpYXRlKHQpO1xuICAgICAgICB2YXIgbiA9IGNjLm1hdGgucmFuZG9tUmFuZ2UodGhpcy5ncm91bmRBcmVhTEIueSwgdGhpcy5ncm91bmRBcmVhVFIueSk7XG4gICAgICAgIHZhciBvID0gZS5ocDtcbiAgICAgICAgdmFyIHMgPSBlLmF0aztcbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjIpIHtcbiAgICAgICAgICAgIGNhc2UgMTAxOlxuICAgICAgICAgICAgY2FzZSAxMDI6XG4gICAgICAgICAgICBjYXNlIDEwMzpcbiAgICAgICAgICAgICAgICBvICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjIgLSAxMDFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDc6XG4gICAgICAgICAgICBjYXNlIDEwODpcbiAgICAgICAgICAgIGNhc2UgMTA5OlxuICAgICAgICAgICAgICAgIHMgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMiAtIDEwN107XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG8gKj0gdGhpcy5sZXZlbERhdGEuaHBhZGQgLyAxMDA7XG4gICAgICAgICAgICAgICAgcyAqPSB0aGlzLmxldmVsRGF0YS5hdGthZGQgLyAxMDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgbyAqPSAxICsgKGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKSAtIDkpICogdGhpcy5sZXZlbERhdGEuaHBhZGQ7XG4gICAgICAgICAgICAgICAgcyAqPSAxICsgKGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKSAtIDkpICogdGhpcy5sZXZlbERhdGEuYXRrYWRkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIG8gKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA1KSAqIHRoaXMubGV2ZWxEYXRhLmhwYWRkICsgdGhpcy53YXZlUGx1c0hwO1xuICAgICAgICAgICAgICAgIHMgKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA1KSAqIHRoaXMubGV2ZWxEYXRhLmF0a2FkZCArIHRoaXMud2F2ZVBsdXNBdGs7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGMgPSB0aGlzLmFkZEVuZW15SW4oZS5FbmVteUlkLCBpLCAzNjAsIG4sIG8sIHMpO1xuICAgICAgICBpZiAoMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgYy5leHAgPSAwLjYgKiBjLmV4cDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYWRkRW5lbXlJbjogZnVuY3Rpb24gKHQsIGUsIGksIG4sIG8sIHMpIHtcbiAgICAgICAgZS5wYXJlbnQgPSB0aGlzLm9ianNSb290O1xuICAgICAgICBlLnggPSBpO1xuICAgICAgICBlLnkgPSBuO1xuICAgICAgICB2YXIgYyA9IGUuZ2V0Q29tcG9uZW50KFwiRW5lbXlcIik7XG4gICAgICAgIGMuaW5pdEJ5KHRoaXMsIHRoaXMuYnVsbGV0c1Jvb3QsIG8sIHMpO1xuICAgICAgICBjLmlkID0gdDtcbiAgICAgICAgYy5zaG93SHBCYXIgPSB0ID4gMTAwO1xuICAgICAgICB0aGlzLmFkZEVuZW15KGMpO1xuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuICAgIGFkZEVuZW15OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmVuZW15cy5wdXNoKHQpO1xuICAgIH0sXG4gICAgZGVsRW5lbXk6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbmVteXMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZSA9PSB0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKC0xICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMuZW5lbXlzLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0Lm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5lbmVteUNvdW50LS07XG4gICAgICAgIGlmICh0LmlkID4gMTAwKSB7XG4gICAgICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDIrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCF0aGlzLmlzTGFzdFdhdmUgfHwgdGhpcy5lbmVteUNvdW50ID4gMCkgJiYgdC5leHAgPiAwKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHQuZXhwO1xuICAgICAgICAgICAgdmFyIG4gPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDExKTtcbiAgICAgICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgICAgIGkgPSBNYXRoLnJvdW5kKGkgKiAoMSArIDAuMDEgKiBuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZXhwICs9IGk7XG4gICAgICAgICAgICB2YXIgbyA9IHRoaXMuaHViLmx2dXBKc29uRmlsZS5qc29uW2NjLnB2ei5ydW50aW1lRGF0YS5sdl0uZXhwO1xuICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5leHAgPj0gbykge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5leHAgLT0gbztcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEubHYrKztcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3BsYXllcmxldmVsdXBcIik7XG4gICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJCdWZmVUlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJVSUdhbWVCdWZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0lzU3VjYygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5odWIudXBkYXRlRXhwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSXNTdWNjKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEVuZW15SHBCYXI6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICghdC5ocEJhcikge1xuICAgICAgICAgICAgdmFyIGUgPSAodC5zaG93SHBCYXIgPyB0aGlzLmVCb3NzSHBQcmVmYWIgOiB0aGlzLmVIcFByZWZhYikuYWRkTm9kZSh0Lm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgY2MuZmluZChcIm5vZGVcIiwgZSkucG9zaXRpb24gPSB0LmhwQmFyUG9zO1xuICAgICAgICAgICAgdC5ocEJhciA9IGUuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tJc1N1Y2M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuaGFzRW5kZWQgJiYgMCA9PSB0aGlzLmVuZW15Q291bnQpIHtcbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS53YXZlKys7XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrRW5lbXlDb3VudDEgPiAwKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkTWlzc2lvblByb2dyZXNzKFxuICAgICAgICAgICAgICAgICAgICBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWHu+i0pemmlumihm7kuKpcIl0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFza0VuZW15Q291bnQxXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnRhc2tFbmVteUNvdW50MiA+IDApIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRNaXNzaW9uUHJvZ3Jlc3MoXG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi5Ye76LSl5YO15bC4buS4qlwiXSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFkZE1vbmV5KDEwICsgY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSg1KSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RXYXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N1Y2MgPSAhMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0VuZGVkID0gITA7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2luXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lRW5kXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3dpblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlRW5kQW5pU3BpbmUubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMubW9uZXlJY29uTm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHRoaXMud2F2ZUVuZEFuaVNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoZSk7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSB0aGlzLndhdmVFbmRBbmlTcGluZS5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgIG4ueCA9IGkueDtcbiAgICAgICAgICAgICAgICBuLnkgPSBpLnk7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlRW5kQW5pU3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hdXRvVGltZXMrKztcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmx2MkNvdW50ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdC5odWIuYmFja1RvQmFnKCk7XG4gICAgICAgICAgICAgICAgICAgIHQud2F2ZUVuZEFuaVNwaW5lLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgICAgIHQud2F2ZUVuZEFuaVNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoMCA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrRW5kTGV2ZWwoY2MucHZ6LnJ1bnRpbWVEYXRhLmxldmVsLCBjYy5wdnoucnVudGltZURhdGEud2F2ZSAtIDEsICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hvb3NlRW5lbXk6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IHRoaXMuZW5lbXlzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG47XG4gICAgICAgIGlmICh0aGlzLmlzQW5nZXJQcmVzc2VkKSB7XG4gICAgICAgICAgICBuID0gMWU2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbiA9IGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBudWxsO1xuICAgICAgICBpLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpID0gZS5ub2RlLnBvc2l0aW9uLnN1Yih0Lm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgaWYgKGkgPCBuKSB7XG4gICAgICAgICAgICAgICAgbiA9IGk7XG4gICAgICAgICAgICAgICAgbyA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9LFxuICAgIGNob29zZUVuZW15czogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5oYXNFbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSB0aGlzLmVuZW15cy5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiAoaS5ocCA+IDAgJiYgbi5pc0FuZ2VyUHJlc3NlZCkgfHwgaS5ub2RlLnBvc2l0aW9uLnN1Yih0Lm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpIDwgZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpID49IG8ubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGk7IGMrKykge1xuICAgICAgICAgICAgdmFyIGEgPSBjYy5tYXRoLnJhbmRvbVJhbmdlSW50KDAsIG8ubGVuZ3RoKTtcbiAgICAgICAgICAgIHMucHVzaChvLnNwbGljZShhLCAxKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfSxcbiAgICBjaG9vc2VFbmVteUJ5QnVsbGV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IHRoaXMuZW5lbXlzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRbY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCB0Lmxlbmd0aCldO1xuICAgIH0sXG4gICAgY2hvb3NlSGVybzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gdGhpcy5oZXJvZXMuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5ocCA+IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaSA9IDE2MDA7XG4gICAgICAgIHZhciBuID0gZVswXTtcbiAgICAgICAgZm9yICh2YXIgbyA9IDA7IG8gPCBlLmxlbmd0aDsgbysrKSB7XG4gICAgICAgICAgICB2YXIgcztcbiAgICAgICAgICAgIGlmIChlW29dLnBvc2l0aW9uMikge1xuICAgICAgICAgICAgICAgIHMgPSBlW29dLnBvc2l0aW9uMi54O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzID0gZVtvXS5ub2RlLng7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYyA9IE1hdGguYWJzKHMgLSB0LngpO1xuICAgICAgICAgICAgaWYgKGMgPCBpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGM7XG4gICAgICAgICAgICAgICAgbiA9IGVbb107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfSxcbiAgICBjaG9vc2VNaW5IcEhlcm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSAxO1xuICAgICAgICB2YXIgZSA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oZXJvZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm9lc1tpXS5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IHRoaXMuaGVyb2VzW2ldLmhwIC8gdGhpcy5oZXJvZXNbaV0uaXRlbS5tYXhIcDtcbiAgICAgICAgICAgICAgICBpZiAobiA8IHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdCA9IG47XG4gICAgICAgICAgICAgICAgICAgIGUgPSB0aGlzLmhlcm9lc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBnZXRIZXJvZXNNYXhNYXJnaW5YOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlcm9lc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0LmhwID4gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHQsIGUubm9kZS54ICsgZS5pdGVtLnJpZ2hNYXJnaW4pO1xuICAgICAgICAgICAgfSwgLTM2MCk7XG4gICAgfSxcbiAgICBjaGVja0lzRmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaGVyb2VzLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXQuaGFzRGllO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc1N1Y2MgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuaGFzRW5kZWQgPSAhMDtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZmFpbFwiKTtcbiAgICAgICAgICAgIGlmICgyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpLFxuICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhbmtcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmFua3dpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVSVJhbmtFbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzUmVib3JuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYygxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lRW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAwID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LlRBVXRpbHMudHJhY2tFbmRMZXZlbChjYy5wdnoucnVudGltZURhdGEubGV2ZWwsIGNjLnB2ei5ydW50aW1lRGF0YS53YXZlLCAhMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZ1aHVvVUlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lUmVib3JuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYWRkTW9uZXkoMzApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYW5nZXIgPSAxZTM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNSZWJvcm4gPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmF1dG9UaW1lcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEubHYyQ291bnQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2luXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZUVuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93RW5lbXlIdXJ0TnVtOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9ICgxID09IHQgPyB0aGlzLmVIdXJ0Q3JpdE51bSA6IHRoaXMuZUh1cnROdW0pLmFkZE5vZGUoZSk7XG4gICAgICAgIG4ueCArPSBjYy5tYXRoLnJhbmRvbVJhbmdlKC00MCwgNDApO1xuICAgICAgICBuLnkgKz0gNTAgKyBjYy5tYXRoLnJhbmRvbVJhbmdlKC0xMCwgNDApO1xuICAgICAgICBjYy5maW5kKFwibnVtXCIsIG4pLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCItXCIgKyBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGkpKTtcbiAgICAgICAgbi5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KCk7XG4gICAgICAgIG4uZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikub24oXCJmaW5pc2hlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2hvd0pzRWZmZWN0OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoMTIgIT0gZSkge1xuICAgICAgICAgICAgdGhpcy5lSGl0UHJlZmFiXG4gICAgICAgICAgICAgICAgLmFkZE5vZGUodClcbiAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKVxuICAgICAgICAgICAgICAgIC5zZXRBbmltYXRpb24oMCwgXCJ6ZFwiICsgZSArIFwiX2hpdFwiICsgY2MubWF0aC5yYW5kb21SYW5nZUludCgxLCA0KSwgITEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZUhpdEdyb3VuZFByZWZhYlxuICAgICAgICAgICAgLmFkZE5vZGUodClcbiAgICAgICAgICAgIC5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pXG4gICAgICAgICAgICAuc2V0QW5pbWF0aW9uKDAsIFwiemRcIiArIGUgKyBcIl9qc1wiICsgY2MubWF0aC5yYW5kb21SYW5nZUludCgxLCA0KSwgITEpO1xuICAgIH0sXG4gICAgc2hvd0hlcm9IdXJ0TnVtOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMucEh1cnROdW0uYWRkTm9kZSh0KTtcbiAgICAgICAgaS54ICs9IGNjLm1hdGgucmFuZG9tUmFuZ2UoLTQwLCA0MCk7XG4gICAgICAgIGkueSArPSBjYy5tYXRoLnJhbmRvbVJhbmdlKDEwLCA3MCk7XG4gICAgICAgIGNjLmZpbmQoXCJudW1cIiwgaSkuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIi1cIiArIE1hdGguZmxvb3IoZSk7XG4gICAgICAgIGkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpO1xuICAgICAgICBpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9uKFwiZmluaXNoZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTcGVlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLm9wZW5TcGVlZCkge1xuICAgICAgICAgICAgaWYgKDEgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3BlZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICBcIjJzcGVlZFVJXCIsXG4gICAgICAgICAgICAgICAgXCJVSVNwZWVkXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVNwZWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYyhjYy5wdnoucnVudGltZURhdGEuc3BlZWQpO1xuICAgIH0sXG4gICAgc2V0U3BlZWRMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgc3AudGltZVNjYWxlID0gdDtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2V0VGltZVNjYWxlKHQpO1xuICAgIH0sXG4gICAgb25DbGlja1N0YXRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhdHNTaG93bikge1xuICAgICAgICAgICAgdGhpcy5oaWRlU3RhdHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHNQYW5lbC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGF0c1Nob3duID0gITA7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRzKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRzUGFuZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTm9ybWFsO1xuICAgICAgICAgICAgdGhpcy5zdGF0c1BhbmVsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9mZihcImZpbmlzaGVkXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhdHNTaG93bikge1xuICAgICAgICAgICAgdmFyIGUgPSBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0cy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQgKyBlO1xuICAgICAgICAgICAgICAgIH0sIDApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5oZXJvZXNcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2MucHZ6LnJ1bnRpbWVEYXRhLnN0YXRzW2UuaW5mby5pZF0gLSBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdC5pbmZvLmlkXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpLnpkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHQuc3RhdHNJdGVtUHJlZmFiLnJvb3QuY2hpbGRyZW4uZmluZChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Ll9faWQgPT0gaS5pbmZvLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvID0gdC5zdGF0c0l0ZW1QcmVmYWIuYWRkTm9kZSgpKS5fX2lkID0gaS5pbmZvLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgby56SW5kZXggPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbaS5pbmZvLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gaS5pbmZvLmpzb247XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcInF1YWxpdHlcIiwgbykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1aUltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtL3B6X1wiICsgYy5xdWFsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBjYy5maW5kKFwiaWNvblwiLCBvKS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5za2VsZXRvbkRhdGEgPSBpLnNwaW5lLnNrZWxldG9uRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwibmFtZVwiLCBvKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGMubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcyAvIGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwibnVtMlwiLCBvKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICgxMDAgKiByKS50b0ZpeGVkKDIpICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiYmFyXCIsIG8pLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0JhcikucHJvZ3Jlc3MgPSByO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhpZGVTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXNTdGF0c1Nob3duID0gITE7XG4gICAgICAgIHRoaXMuc3RhdHNQYW5lbC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KCkud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5SZXZlcnNlO1xuICAgICAgICB0aGlzLnN0YXRzUGFuZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikub25jZShcImZpbmlzaGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHQuc3RhdHNQYW5lbC5hY3RpdmUgPSAhMTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7Il19