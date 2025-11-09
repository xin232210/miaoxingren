
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
      var n = t.getComponent("Item"); // 检查用户是否已经在编辑器中设置了character spine
      // 如果n.spine已经配置好了，就直接使用它（保留用户的设置）

      var useExistingSpine = n.spine && n.spine.skeletonData && n.spine.skeletonData.name && n.spine.skeletonData.name.indexOf("Characters") !== -1;

      if (useExistingSpine) {
        // 用户已经在编辑器中配置了character spine，直接使用
        console.log("[Game] 使用编辑器配置的spine，ID:" + n.id + ", skin:" + n.spine.defaultSkin);
        console.log("[Game] 原始spine状态 - active:" + n.spine.node.active + ", scale:" + n.spine.node.scale + ", scaleX:" + n.spine.node.scaleX + ", scaleY:" + n.spine.node.scaleY); // 保存spine的原始设置（在移动节点之前）

        var spineActive = n.spine.node.active;
        var spineScale = n.spine.node.scale;
        var spineScaleX = n.spine.node.scaleX;
        var spineScaleY = n.spine.node.scaleY;
        var spineOpacity = n.spine.node.opacity; // 如果spine原本就是隐藏或缩放为0，设置为默认值

        if (!spineActive || spineScale === 0 || spineScaleX === 0 && spineScaleY === 0) {
          console.log("[Game] spine原本隐藏或缩放为0，使用默认设置");
          spineActive = true;
          spineScale = 0.3; // 默认缩放

          spineScaleX = 0.3;
          spineScaleY = 0.3;
        } // 创建Hero节点


        var heroNode = new cc.Node("hero" + n.id);
        heroNode.position = e.objsRoot.convertToNodeSpaceAR(n.spine.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        heroNode.parent = e.objsRoot; // 添加Hero组件

        var heroComponent = heroNode.addComponent("Hero"); // 将spine节点移动到hero节点下

        n.spine.node.removeFromParent(false);
        n.spine.node.parent = heroNode;
        n.spine.node.position = cc.Vec2.ZERO; // 恢复或设置spine节点属性，确保可见

        n.spine.node.active = spineActive;
        n.spine.node.opacity = spineOpacity > 0 ? spineOpacity : 255;
        n.spine.node.scale = spineScale;
        n.spine.node.scaleX = spineScaleX;
        n.spine.node.scaleY = spineScaleY; // 强制设置spine动画，确保渲染

        if (n.spine.defaultAnimation) {
          n.spine.setAnimation(0, n.spine.defaultAnimation, true);
        } else {
          n.spine.setAnimation(0, "Idle", true);
        } // 设置hero节点的zIndex，确保正确显示


        heroNode.zIndex = -heroNode.y;
        console.log("[Game] spine设置后 - active:" + n.spine.node.active + ", scale:" + n.spine.node.scale + ", scaleX:" + n.spine.node.scaleX + ", scaleY:" + n.spine.node.scaleY); // 初始化Hero组件，使用已配置的spine

        heroComponent.initBy(e, n, {
          json: n.json,
          index: i,
          id: n.id,
          lv1: cc.pvz.PlayerData.getToolData(n.id).lv - 1,
          maxLv: 0
        }, n.spine);
        heroComponent.position2 = heroNode.position.add(n.attOffset);
        n.hero = heroComponent;
        n.initHeroNodes();
        e.heroes.push(heroComponent);
        e.updateHp(!1);
        console.log("[Game] Hero节点创建完成，位置:" + heroNode.position + ", heroZIndex:" + heroNode.zIndex);
        console.log("[Game] Hero父节点:" + heroNode.parent.name + ", spine父节点:" + n.spine.node.parent.name);
        console.log("[Game] 最终spine状态 - active:" + n.spine.node.active + ", scale:" + n.spine.node.scale + ", opacity:" + n.spine.node.opacity);
      } else {
        // 用户没有配置spine，动态创建（回退逻辑）
        console.log("[Game] 动态创建spine，ID:" + n.id); // 创建Hero节点

        var heroNode = new cc.Node("hero" + n.id);
        heroNode.position = e.objsRoot.convertToNodeSpaceAR(n.spine.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        heroNode.parent = e.objsRoot; // 添加Hero组件

        var heroComponent = heroNode.addComponent("Hero"); // 加载character角色资源

        var characterSkinName = "Character" + (n.id < 10 ? "0" + n.id : n.id);
        cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (characterSpineData) {
          // 创建character的spine节点
          var characterSpineNode = new cc.Node("characterSpine");
          characterSpineNode.parent = heroNode;
          var characterSpine = characterSpineNode.addComponent(sp.Skeleton);
          characterSpine.skeletonData = characterSpineData;
          characterSpine.defaultSkin = characterSkinName;
          characterSpine.setSkin(characterSkinName);
          characterSpine.defaultAnimation = "Idle";
          characterSpine.setAnimation(0, "Idle", true);
          characterSpine.premultipliedAlpha = false;
          characterSpine.useTint = true;
          characterSpine.enableBatch = true; // 确保spine节点可见

          characterSpineNode.active = true;
          characterSpineNode.opacity = 255; // 设置hero节点的zIndex，确保正确显示

          heroNode.zIndex = -heroNode.y; // 初始化Hero组件

          heroComponent.initBy(e, n, {
            json: n.json,
            index: i,
            id: n.id,
            lv1: cc.pvz.PlayerData.getToolData(n.id).lv - 1,
            maxLv: 0
          }, characterSpine);
          heroComponent.position2 = heroNode.position.add(n.attOffset);
          n.hero = heroComponent;
          n.initHeroNodes();
          e.heroes.push(heroComponent);
          e.updateHp(!1);
          console.log("[Game] Hero初始化完成，ID:" + n.id + ", skin:" + characterSkinName + ", 位置:" + heroNode.position);
        });
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvZ2FtZS5qcyJdLCJuYW1lcyI6WyIkcHJlZmFiSW5mbyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImJnMlNwIiwiU3ByaXRlIiwiZ3JvdW5kQXJlYU5vZGUiLCJOb2RlIiwiYmdNdXNpYzIiLCJBdWRpb0NsaXAiLCJzaGllbGRCYXIiLCJQcm9ncmVzc0JhciIsInNoaWVsZExhYmVsIiwiTGFiZWwiLCJocEJhciIsImhwTGFiZWwiLCJwYXVzZU5vZGUiLCJzcGVlZE5vZGUiLCJzcGVlZExhYmVsIiwic3RhdHNCdG5Ob2RlIiwibGV2ZWxzSnNvbkZpbGUiLCJKc29uQXNzZXQiLCJncm91bmQiLCJvYmpzUm9vdCIsImJ1bGxldHNSb290IiwiZmlnaHROb2RlcyIsImhlcm9Kc29uRmlsZSIsImVIdXJ0TnVtIiwiZUh1cnRDcml0TnVtIiwiZURpZVByZWZhYiIsImVQb2lzb25QcmVmYWIiLCJlU2xvd1ByZWZhYiIsImVJY2VQcmVmYWIiLCJlV2Vha1ByZWZhYiIsImVIcFByZWZhYiIsImVCb3NzSHBQcmVmYWIiLCJlSGl0UHJlZmFiIiwiZUhpdEdyb3VuZFByZWZhYiIsInBIdXJ0TnVtIiwicEZpcmVFZmZlY3QiLCJhZGRCdWZmUHJlZmFiIiwiYWNjQnVmZlByZWZhYiIsIndhdmVFbmRBbmlTcGluZSIsInNwIiwiU2tlbGV0b24iLCJtb25leUljb25Ob2RlIiwidHJ5UGxhbnROb2RlIiwidHJ5UGxhbnRJY29uIiwic3RhdHNQYW5lbCIsInN0YXRzSXRlbVByZWZhYiIsImFuZ2VyQmFyIiwiYW5nZXJCYXJTcCIsImFuZ2VyQmFyU3BmcyIsIlNwcml0ZUZyYW1lIiwiYW5nZXJFbXB0eVRpcCIsImFuZ2VyQmFyTm9kZSIsImFuZ2VyTW9kZU5vZGUiLCJvbkxvYWQiLCJub2RlIiwiYWN0aXZlIiwic3RhcnRMb2dpYyIsInQiLCJlIiwiaSIsImh1YiIsImxldmVsRGF0YSIsIm4iLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJncm91bmRBcmVhTEIiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsInYyIiwieE1pbiIsInlNaW4iLCJncm91bmRBcmVhVFIiLCJ4TWF4IiwieU1heCIsInRpbWVQYXVzZWQiLCJtc0luZGV4IiwiZnJhbWVBY3Rpb25zIiwiY2JzMiIsImNiSWQiLCJwYXVzZWRDYnMiLCJwYXVzZWRDYnMyIiwiaGFzRW5kZWQiLCJwdnoiLCJydW50aW1lRGF0YSIsIm1vZGUiLCJtYXhXYXZlIiwid2F2ZSIsImlzTGFzdFdhdmUiLCJlbmVteXMiLCJ0YXNrRW5lbXlDb3VudDEiLCJ0YXNrRW5lbXlDb3VudDIiLCJidXRsZXIiLCJvbiIsIm9uR2V0SHBCdWZmIiwiaW5pdEhlcm9lcyIsInVwZGF0ZUhwIiwidXBkYXRlU2hpZWxkIiwidXBkYXRlU3BlZWQiLCJpc0FuZ2VyUHJlc3NlZCIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwic3RhcnRBbmdlck1vZGUiLCJUT1VDSF9FTkQiLCJzdG9wQW5nZXJNb2RlIiwiVE9VQ0hfQ0FOQ0VMIiwidXBkYXRlQW5nZXIiLCJkaXJlY3RvciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJlbmFibGVkIiwic2hvd0dhbWUxc3QiLCJndWlkZU1hbmFnZXIiLCJzaG93R3VpZGUiLCJoaWRlRmluZ2VyIiwidGlwIiwiYmVnaW5FbWl0RW5lbXlzIiwiRGlyZWN0b3IiLCJFVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORyIsInJlc2V0U3BlZWQiLCJvbkJhY2tGcm9tR2FtZSIsImZvckVhY2giLCJyZW1vdmVBbGxDaGlsZHJlbiIsIm9mZiIsImhlcm9lcyIsIklLQm9uZSIsInR3ZWVuIiwidG8iLCJ4IiwieSIsInN0YXJ0IiwibGV2ZWwiLCJwb3B1cE1hbmFnZXIiLCJzaG93VG9hc3QiLCJ1dGlscyIsInVzZUJ1bmRsZUFzc2V0IiwiZW1pdEVuZW15cyIsImpzb24iLCJzZXRTcGVlZExvZ2ljIiwicHJvZ3Jlc3MiLCJhbmdlciIsIndpZHRoIiwib3BhY2l0eSIsImdldE1vbmV5V1BvcyIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlZlYzIiLCJaRVJPIiwiZ2V0QW5nZXJCYXJXUG9zIiwic2hvd0J1ZmZFZmZlY3QiLCJvIiwiYWRkTm9kZSIsInMiLCJnZXRDb21wb25lbnQiLCJjIiwic2V0QW5pbWF0aW9uIiwiYSIsInIiLCJmaW5kQm9uZSIsInNldFRyYWNrQ29tcGxldGVMaXN0ZW5lciIsImJhZyIsInJlZHVjZSIsImhwIiwiaXRlbSIsIm1heEhwIiwic3RyaW5nIiwiTWF0aCIsInJvdW5kIiwic2hpZWxkVmFsdWUiLCJwYXJlbnQiLCJmbG9vciIsImluc2VydEZyYW1lQWN0aW9uIiwiZmluZCIsIm1zIiwiY2JzIiwicHVzaCIsImluc2VydEZyYW1lQ0IiLCJmaW5kSW5kZXgiLCJsZW5ndGgiLCJzcGxpY2UiLCJjYiIsImlkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInRpbWUiLCJ1cGRhdGVUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJpbnRldmFsIiwiY2xlYXJJbnRlcnZhbCIsInVwZGF0ZSIsImNhbGwiLCJtaW4iLCJzaGlmdCIsInBsYXlNdXNpYyIsInNwcml0ZUZyYW1lIiwiYmdNdXNpYyIsInN0YXJ0VHdlZW4iLCJfdW5pb24iLCJydW5BY3Rpb24iLCJ0YXJnZXRlZEFjdGlvbiIsIl90YXJnZXQiLCJwYXVzZUdhbWUiLCJwYXVzZURpcmVjdG9yIiwicmVzdW1lR2FtZSIsInJlc3VtZURpcmVjdG9yIiwib25Qb3B1cDFzdCIsIm9uQWxsQ2xvc2VkIiwiYmxvY2tSb290IiwiYm9hcmRJdGVtc1Jvb3QiLCJjaGlsZHJlbiIsInVzZUV4aXN0aW5nU3BpbmUiLCJzcGluZSIsInNrZWxldG9uRGF0YSIsIm5hbWUiLCJpbmRleE9mIiwiY29uc29sZSIsImxvZyIsImRlZmF1bHRTa2luIiwic2NhbGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJzcGluZUFjdGl2ZSIsInNwaW5lU2NhbGUiLCJzcGluZVNjYWxlWCIsInNwaW5lU2NhbGVZIiwic3BpbmVPcGFjaXR5IiwiaGVyb05vZGUiLCJwb3NpdGlvbiIsImhlcm9Db21wb25lbnQiLCJhZGRDb21wb25lbnQiLCJyZW1vdmVGcm9tUGFyZW50IiwiZGVmYXVsdEFuaW1hdGlvbiIsInpJbmRleCIsImluaXRCeSIsImluZGV4IiwibHYxIiwiUGxheWVyRGF0YSIsImdldFRvb2xEYXRhIiwibHYiLCJtYXhMdiIsInBvc2l0aW9uMiIsImFkZCIsImF0dE9mZnNldCIsImhlcm8iLCJpbml0SGVyb05vZGVzIiwiY2hhcmFjdGVyU2tpbk5hbWUiLCJTa2VsZXRvbkRhdGEiLCJjaGFyYWN0ZXJTcGluZURhdGEiLCJjaGFyYWN0ZXJTcGluZU5vZGUiLCJjaGFyYWN0ZXJTcGluZSIsInNldFNraW4iLCJwcmVtdWx0aXBsaWVkQWxwaGEiLCJ1c2VUaW50IiwiZW5hYmxlQmF0Y2giLCJoYXNIZXJvIiwic29tZSIsImluZm8iLCJ3YXZlUGx1c0hwIiwid2F2ZVBsdXNBdGsiLCJocHdhdmUiLCJhdGt3YXZlIiwiZW5lbXlDb3VudCIsImZpbHRlciIsIkVuZW15TnVtIiwiU3BhY2UiLCJleGVjdXRlRXZlbnQyIiwic29ydCIsIkVuZW15SWQiLCJQcmVmYWIiLCJleGVjdXRlRXZlbnROZXdFbmVteSIsImluc3RhbnRpYXRlIiwibWF0aCIsInJhbmRvbVJhbmdlIiwiYXRrIiwiYWN0QnVmZjIiLCJocGFkZCIsImF0a2FkZCIsImdldFN0YWdlTGV2ZWwiLCJhZGRFbmVteUluIiwiZXhwIiwic2hvd0hwQmFyIiwiYWRkRW5lbXkiLCJkZWxFbmVteSIsImdldEJ1ZmZWYWx1ZSIsImx2dXBKc29uRmlsZSIsInBsYXlFZmZlY3RBc3luYyIsInBvcHVwIiwiY2hlY2tJc1N1Y2MiLCJ1cGRhdGVFeHAiLCJhZGRFbmVteUhwQmFyIiwiaHBCYXJQb3MiLCJhZGRNaXNzaW9uUHJvZ3Jlc3MiLCJHYW1lQ29uZmlnIiwiTWlzc2lvblR5cGUiLCJhZGRNb25leSIsImlzU3VjYyIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJhdXRvVGltZXMiLCJsdjJDb3VudCIsImJhY2tUb0JhZyIsIlRBVXRpbHMiLCJ0cmFja0VuZExldmVsIiwiY2hvb3NlRW5lbXkiLCJzdWIiLCJsZW5ndGhTcXIiLCJjaG9vc2VFbmVteXMiLCJyYW5kb21SYW5nZUludCIsImNob29zZUVuZW15QnlCdWxsZXQiLCJjaG9vc2VIZXJvIiwiYWJzIiwiY2hvb3NlTWluSHBIZXJvIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsIm1heCIsInJpZ2hNYXJnaW4iLCJjaGVja0lzRmFpbCIsImhhc0RpZSIsImhhc1JlYm9ybiIsImxvYWRTY2VuZSIsInNob3dFbmVteUh1cnROdW0iLCJBbmltYXRpb24iLCJwbGF5Iiwic2hvd0pzRWZmZWN0Iiwic2hvd0hlcm9IdXJ0TnVtIiwib25DbGlja1NwZWVkIiwib3BlblNwZWVkIiwic3BlZWQiLCJ0aW1lU2NhbGUiLCJnZXRTY2hlZHVsZXIiLCJzZXRUaW1lU2NhbGUiLCJvbkNsaWNrU3RhdHMiLCJpc1N0YXRzU2hvd24iLCJoaWRlU3RhdHMiLCJ1cGRhdGVTdGF0cyIsIndyYXBNb2RlIiwiV3JhcE1vZGUiLCJOb3JtYWwiLCJzdGF0cyIsInpkIiwicm9vdCIsIl9faWQiLCJzZXRTcHJpdGVGcmFtZSIsInF1YWxpdHkiLCJ0b0ZpeGVkIiwiUmV2ZXJzZSIsIm9uY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsMEJBQUQsQ0FBekI7O0FBQ0FDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0ssTUFERjtJQUVSQyxjQUFjLEVBQUVOLEVBQUUsQ0FBQ08sSUFGWDtJQUdSQyxRQUFRLEVBQUVSLEVBQUUsQ0FBQ1MsU0FITDtJQUlSQyxTQUFTLEVBQUVWLEVBQUUsQ0FBQ1csV0FKTjtJQUtSQyxXQUFXLEVBQUVaLEVBQUUsQ0FBQ2EsS0FMUjtJQU1SQyxLQUFLLEVBQUVkLEVB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dEIsQ0FBaEIsRUFBbUJHLFlBQW5CLENBQWdDeEosRUFBRSxDQUFDYSxLQUFuQyxFQUEwQ3VKLE1BQTFDLEdBQW1EWCxDQUFDLENBQUMyRCxJQUFyRDtVQUNBLElBQUl4RCxDQUFDLEdBQUdMLENBQUMsR0FBR3pGLENBQVo7VUFDQTlELEVBQUUsQ0FBQzJLLElBQUgsQ0FBUSxNQUFSLEVBQWdCdEIsQ0FBaEIsRUFBbUJHLFlBQW5CLENBQWdDeEosRUFBRSxDQUFDYSxLQUFuQyxFQUEwQ3VKLE1BQTFDLEdBQW1ELENBQUMsTUFBTVIsQ0FBUCxFQUFVeUwsT0FBVixDQUFrQixDQUFsQixJQUF1QixHQUExRTtVQUNBclYsRUFBRSxDQUFDMkssSUFBSCxDQUFRLEtBQVIsRUFBZXRCLENBQWYsRUFBa0JHLFlBQWxCLENBQStCeEosRUFBRSxDQUFDVyxXQUFsQyxFQUErQ2dJLFFBQS9DLEdBQTBEaUIsQ0FBMUQ7UUFDSDtNQUNKLENBOUJMO0lBK0JIO0VBQ0osQ0FuL0JJO0VBby9CTDhLLFNBQVMsRUFBRSxxQkFBWTtJQUNuQixJQUFJN1EsQ0FBQyxHQUFHLElBQVI7SUFDQSxLQUFLNFEsWUFBTCxHQUFvQixDQUFDLENBQXJCO0lBQ0EsS0FBS3pSLFVBQUwsQ0FBZ0J3RyxZQUFoQixDQUE2QnhKLEVBQUUsQ0FBQzhULFNBQWhDLEVBQTJDQyxJQUEzQyxHQUFrRGEsUUFBbEQsR0FBNkQ1VSxFQUFFLENBQUM2VSxRQUFILENBQVlTLE9BQXpFO0lBQ0EsS0FBS3RTLFVBQUwsQ0FBZ0J3RyxZQUFoQixDQUE2QnhKLEVBQUUsQ0FBQzhULFNBQWhDLEVBQTJDeUIsSUFBM0MsQ0FBZ0QsVUFBaEQsRUFBNEQsWUFBWTtNQUNwRTFSLENBQUMsQ0FBQ2IsVUFBRixDQUFhVyxNQUFiLEdBQXNCLENBQUMsQ0FBdkI7SUFDSCxDQUZEO0VBR0g7QUEzL0JJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkcHJlZmFiSW5mbyA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL1ByZWZhYkluZm9cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmcyU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgZ3JvdW5kQXJlYU5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGJnTXVzaWMyOiBjYy5BdWRpb0NsaXAsXG4gICAgICAgIHNoaWVsZEJhcjogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIHNoaWVsZExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgaHBCYXI6IGNjLlByb2dyZXNzQmFyLFxuICAgICAgICBocExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcGF1c2VOb2RlOiBjYy5Ob2RlLFxuICAgICAgICBzcGVlZE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHNwZWVkTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBzdGF0c0J0bk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGxldmVsc0pzb25GaWxlOiBjYy5Kc29uQXNzZXQsXG4gICAgICAgIGdyb3VuZDogY2MuTm9kZSxcbiAgICAgICAgb2Jqc1Jvb3Q6IGNjLk5vZGUsXG4gICAgICAgIGJ1bGxldHNSb290OiBjYy5Ob2RlLFxuICAgICAgICBmaWdodE5vZGVzOiBbY2MuTm9kZV0sXG4gICAgICAgIGhlcm9Kc29uRmlsZTogY2MuSnNvbkFzc2V0LFxuICAgICAgICBlSHVydE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIGVIdXJ0Q3JpdE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIGVEaWVQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlUG9pc29uUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZVNsb3dQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlSWNlUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZVdlYWtQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlSHBQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlQm9zc0hwUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZUhpdFByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVIaXRHcm91bmRQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBwSHVydE51bTogJHByZWZhYkluZm8sXG4gICAgICAgIHBGaXJlRWZmZWN0OiAkcHJlZmFiSW5mbyxcbiAgICAgICAgYWRkQnVmZlByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGFjY0J1ZmZQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICB3YXZlRW5kQW5pU3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICBtb25leUljb25Ob2RlOiBjYy5Ob2RlLFxuICAgICAgICB0cnlQbGFudE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHRyeVBsYW50SWNvbjogY2MuU3ByaXRlLFxuICAgICAgICBzdGF0c1BhbmVsOiBjYy5Ob2RlLFxuICAgICAgICBzdGF0c0l0ZW1QcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBhbmdlckJhcjogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIGFuZ2VyQmFyU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgYW5nZXJCYXJTcGZzOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgICAgICBhbmdlckVtcHR5VGlwOiBjYy5Ob2RlLFxuICAgICAgICBhbmdlckJhck5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGFuZ2VyTW9kZU5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLndhdmVFbmRBbmlTcGluZS5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBpZiAodGhpcy5zdGF0c1BhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRzUGFuZWwuYWN0aXZlID0gITE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmdlckVtcHR5VGlwLmFjdGl2ZSA9ICExO1xuICAgIH0sXG4gICAgc3RhcnRMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB2YXIgaSA9IHRoaXMuaHViLmxldmVsRGF0YTtcbiAgICAgICAgdGhpcy5sZXZlbERhdGEgPSBpO1xuICAgICAgICB2YXIgbiA9IHRoaXMuZ3JvdW5kQXJlYU5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgIHRoaXMuZ3JvdW5kQXJlYUxCID0gdGhpcy5vYmpzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihjYy52MihuLnhNaW4sIG4ueU1pbikpO1xuICAgICAgICB0aGlzLmdyb3VuZEFyZWFUUiA9IHRoaXMub2Jqc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIoY2MudjIobi54TWF4LCBuLnlNYXgpKTtcbiAgICAgICAgdGhpcy50aW1lUGF1c2VkID0gITE7XG4gICAgICAgIHRoaXMudCA9IDA7XG4gICAgICAgIHRoaXMubXNJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zID0gW107XG4gICAgICAgIHRoaXMuY2JzMiA9IFtdO1xuICAgICAgICB0aGlzLmNiSWQgPSAxO1xuICAgICAgICB0aGlzLnBhdXNlZENicyA9IFtdO1xuICAgICAgICB0aGlzLnBhdXNlZENiczIgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNFbmRlZCA9ICExO1xuICAgICAgICB0aGlzLnN0YXRzQnRuTm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgaWYgKDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4V2F2ZSA9IDk5OTk5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXhXYXZlID0gaS53YXZlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNMYXN0V2F2ZSA9IDIgIT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLndhdmUgPT0gaS53YXZlIC0gMTtcbiAgICAgICAgdGhpcy5lbmVteXMgPSBbXTtcbiAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDEgPSAwO1xuICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MiA9IDA7XG4gICAgICAgIGNjLmJ1dGxlci5ub2RlLm9uKFwibWF4SHBcIiwgdGhpcy5vbkdldEhwQnVmZiwgdGhpcyk7XG4gICAgICAgIHRoaXMuaW5pdEhlcm9lcyh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVIcCghMSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hpZWxkKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3BlZWQoKTtcbiAgICAgICAgdGhpcy5pc0FuZ2VyUHJlc3NlZCA9ICExO1xuICAgICAgICB0aGlzLmFuZ2VyQmFyTm9kZS5vbihcbiAgICAgICAgICAgIGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RhcnRBbmdlck1vZGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5nZXJCYXJOb2RlLm9uKFxuICAgICAgICAgICAgY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIGUuYW5nZXJFbXB0eVRpcC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5nZXJCYXJOb2RlLm9uKFxuICAgICAgICAgICAgY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGUuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIGUuYW5nZXJFbXB0eVRpcC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudXBkYXRlQW5nZXIoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSAhMDtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGU7XG4gICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QgJiYgMCA9PSBjYy5wdnoucnVudGltZURhdGEud2F2ZSkge1xuICAgICAgICAgICAgY2MuZ3VpZGVNYW5hZ2VyLnNob3dHdWlkZShcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXA6IFwi5YO15bC45q2j5Zyo6L+b5pS75oiR5Lus55qE6Iqx5Zut77yM6LW257Sn5raI54Gt5LuW5LusIVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmJlZ2luRW1pdEVuZW15cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmVnaW5FbWl0RW5lbXlzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVkID0gITA7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HLCB0aGlzLnJlc2V0U3BlZWQsIHRoaXMpO1xuICAgIH0sXG4gICAgb25CYWNrRnJvbUdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wQW5nZXJNb2RlKCk7XG4gICAgICAgIHRoaXMuZmlnaHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub2ZmKFwibWF4SHBcIiwgdGhpcy5vbkdldEhwQnVmZiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9ICExO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcsIHRoaXMucmVzZXRTcGVlZCwgdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkID0gITE7XG4gICAgICAgIHRoaXMuaGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0LklLQm9uZSkge1xuICAgICAgICAgICAgICAgIGNjLnR3ZWVuKHQuSUtCb25lKVxuICAgICAgICAgICAgICAgICAgICAudG8oMC4wNjQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IDUwXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGJlZ2luRW1pdEVuZW15czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHZhciBlID0gbnVsbDtcbiAgICAgICAgdmFyIGkgPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgZSA9IFwiZ2FtZVwiO1xuICAgICAgICAgICAgICAgIGkgPSBcImNvbmZpZy9MZXZlbFwiICsgdGhpcy5sZXZlbERhdGEubGV2ZWw7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCkge1xuICAgICAgICAgICAgICAgICAgICBpICs9IFwiQlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBlID0gXCJnYW1lXCI7XG4gICAgICAgICAgICAgICAgaSA9IFwiY29uZmlnL1wiICsgdGhpcy5sZXZlbERhdGEubGV2ZWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZSA9IFwicmFua1wiO1xuICAgICAgICAgICAgICAgIGkgPSBcImNvbmZpZy9cIiArIHRoaXMubGV2ZWxEYXRhLmxldmVsO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5zaG93VG9hc3QoXCLnrKxcIiArIChjYy5wdnoucnVudGltZURhdGEud2F2ZSArIDEpICsgXCLms6LlvIDlp4tcIik7XG4gICAgICAgIH1cbiAgICAgICAgY2MucHZ6LnV0aWxzLnVzZUJ1bmRsZUFzc2V0KGUsIGksIGNjLkpzb25Bc3NldCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHQuZW1pdEVuZW15cyhlLmpzb24pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2V0U3BlZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpO1xuICAgIH0sXG4gICAgdXBkYXRlQW5nZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hbmdlckJhci5wcm9ncmVzcyA9IGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciAvIDFlMztcbiAgICAgICAgaWYgKHRoaXMuYW5nZXJCYXIubm9kZS53aWR0aCA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmFuZ2VyQmFyLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJCYXIubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TW9uZXlXUG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbmV5SWNvbk5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgfSxcbiAgICBnZXRBbmdlckJhcldQb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5nZXJCYXIubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIodGhpcy5hbmdlckJhci5ub2RlLndpZHRoLCAwKSk7XG4gICAgfSxcbiAgICBzaG93QnVmZkVmZmVjdDogZnVuY3Rpb24gKHQsIGUsIGksIG4pIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmFkZEJ1ZmZQcmVmYWIuYWRkTm9kZShlKTtcbiAgICAgICAgdmFyIHMgPSBvLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgIHZhciBjID0gcy5zZXRBbmltYXRpb24oMCwgdCwgITEpO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdmFyIGEgPSBvLmNvbnZlcnRUb05vZGVTcGFjZUFSKGkpO1xuICAgICAgICAgICAgdmFyIHIgPSBzLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICByLnggPSBhLng7XG4gICAgICAgICAgICByLnkgPSBhLnk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHMuc2V0VHJhY2tDb21wbGV0ZUxpc3RlbmVyKGMsIG4pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkdldEhwQnVmZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJhZy51cGRhdGVIcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUhwKCk7XG4gICAgfSxcbiAgICB1cGRhdGVIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmhlcm9lcy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICsgZS5ocDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHZhciBpID0gdGhpcy5oZXJvZXMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdCArIGUuaXRlbS5tYXhIcDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIGlmICgwICE9IGkpIHtcbiAgICAgICAgICAgIHRoaXMuaHBMYWJlbC5zdHJpbmcgPSBNYXRoLnJvdW5kKGUpO1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICBjYy50d2Vlbih0aGlzLmhwQmFyKVxuICAgICAgICAgICAgICAgICAgICAudG8oMC4xLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogZSAvIGlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSBlIC8gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlU2hpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5oZXJvZXMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdCArIGUuc2hpZWxkVmFsdWU7XG4gICAgICAgIH0sIDApO1xuICAgICAgICB2YXIgZSA9IHRoaXMuaGVyb2VzLnJlZHVjZShmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgcmV0dXJuIHQgKyBlLml0ZW0ubWF4SHA7XG4gICAgICAgIH0sIDApO1xuICAgICAgICB2YXIgaSA9IHQgPiAwO1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5ub2RlLmFjdGl2ZSA9IGk7XG4gICAgICAgIHRoaXMuc2hpZWxkTGFiZWwubm9kZS5wYXJlbnQuYWN0aXZlID0gaTtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkTGFiZWwuc3RyaW5nID0gTWF0aC5mbG9vcih0KTtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gdCAvIGU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluc2VydEZyYW1lQWN0aW9uOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuZnJhbWVBY3Rpb25zLmZpbmQoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLm1zID09IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaS5jYnMucHVzaChlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIG1zOiB0LFxuICAgICAgICAgICAgICAgIGNiczogW2VdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5zZXJ0RnJhbWVDQjogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmNiSWQ7XG4gICAgICAgIHZhciBuID0gdGhpcy5jYnMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5tcyA+IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbztcbiAgICAgICAgaWYgKC0xID09IG4pIHtcbiAgICAgICAgICAgIG8gPSB0aGlzLmNicy5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvID0gbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNicy5zcGxpY2UobywgMCwge1xuICAgICAgICAgICAgbXM6IHQsXG4gICAgICAgICAgICBjYjogZSxcbiAgICAgICAgICAgIGlkOiBpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNiSWQrKztcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVvdXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKGNjLnB2ei50aW1lKSArIGU7XG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEZyYW1lQ0IobiwgdCk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5jYnMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5pZCA9PSB0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKC0xICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlVGltZW91dDogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmNicy5maW5kKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5pZCA9PSBpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHJldHVybiAobi5tcyArPSBlKSwgaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFRpbWVvdXQodCwgZSwgaSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEludGVydmFsOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuY2JJZDtcbiAgICAgICAgdGhpcy5jYnMyLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgICBjYjogdCxcbiAgICAgICAgICAgIG1zOiBNYXRoLmZsb29yKGNjLnB2ei50aW1lKSArIGUsXG4gICAgICAgICAgICBpbnRldmFsOiBlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNiSWQrKztcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSxcbiAgICBjbGVhckludGVydmFsOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuY2JzMi5maW5kSW5kZXgoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmlkID09IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoLTEgIT0gZSkge1xuICAgICAgICAgICAgdGhpcy5jYnMyLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy50aW1lUGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLnQgKz0gdDtcbiAgICAgICAgICAgIHRoaXMudDtcbiAgICAgICAgICAgIHZhciBpID0gMWUzICogdGhpcy50O1xuICAgICAgICAgICAgaWYgKHRoaXMubXNJbmRleCA8IHRoaXMuZnJhbWVBY3Rpb25zLmxlbmd0aCAmJiBpID49IHRoaXMuZnJhbWVBY3Rpb25zW3RoaXMubXNJbmRleF0ubXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lQWN0aW9uc1t0aGlzLm1zSW5kZXhdLmNicy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmNhbGwoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tc0luZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciAtPSAxMjUgKiB0O1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuYW5nZXIgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRW1wdHlUaXAuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciA9IE1hdGgubWluKDFlMywgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyICsgNSAqIHQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmdlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyB0aGlzLmNicy5sZW5ndGggPiAwICYmIGNjLnB2ei50aW1lID4gdGhpcy5jYnNbMF0ubXM7ICkge1xuICAgICAgICAgICAgdGhpcy5jYnMuc2hpZnQoKS5jYi5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2JzMi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoY2MucHZ6LnRpbWUgPj0gdC5tcykge1xuICAgICAgICAgICAgICAgIHQuY2IuY2FsbChlKTtcbiAgICAgICAgICAgICAgICB0Lm1zICs9IHQuaW50ZXZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzdGFydEFuZ2VyTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCB8fCB0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciA+IDApIHtcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheU11c2ljKHRoaXMuYmdNdXNpYzIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBbmdlclByZXNzZWQgPSAhMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyQmFyU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmFuZ2VyQmFyU3Bmc1sxXTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyTW9kZU5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5pdGVtLnN0YXJ0QW5nZXJNb2RlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0b3BBbmdlck1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmdlclByZXNzZWQpIHtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5TXVzaWModGhpcy5iYWcuYmdNdXNpYyk7XG4gICAgICAgICAgICB0aGlzLmlzQW5nZXJQcmVzc2VkID0gITE7XG4gICAgICAgICAgICB0aGlzLmFuZ2VyQmFyU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmFuZ2VyQmFyU3Bmc1swXTtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJNb2RlTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuaGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdC5pdGVtLnN0b3BBbmdlck1vZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydFR3ZWVuOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHQuX3VuaW9uKCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MudGFyZ2V0ZWRBY3Rpb24odC5fdGFyZ2V0LCBlKSk7XG4gICAgfSxcbiAgICBwYXVzZUdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuYnV0bGVyLnBhdXNlRGlyZWN0b3IoMSk7XG4gICAgfSxcbiAgICByZXN1bWVHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5yZXN1bWVEaXJlY3RvcigxKTtcbiAgICB9LFxuICAgIG9uUG9wdXAxc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVQYXVzZWQgPSAhMDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25BbGxDbG9zZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lUGF1c2VkID0gITE7XG4gICAgfSxcbiAgICBpbml0SGVyb2VzOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGVyb2VzID0gW107XG4gICAgICAgIHQuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQsIGkpIHtcbiAgICAgICAgICAgIHZhciBuID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmo4Dmn6XnlKjmiLfmmK/lkKblt7Lnu4/lnKjnvJbovpHlmajkuK3orr7nva7kuoZjaGFyYWN0ZXIgc3BpbmVcbiAgICAgICAgICAgIC8vIOWmguaenG4uc3BpbmXlt7Lnu4/phY3nva7lpb3kuobvvIzlsLHnm7TmjqXkvb/nlKjlroPvvIjkv53nlZnnlKjmiLfnmoTorr7nva7vvIlcbiAgICAgICAgICAgIHZhciB1c2VFeGlzdGluZ1NwaW5lID0gbi5zcGluZSAmJiBuLnNwaW5lLnNrZWxldG9uRGF0YSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5za2VsZXRvbkRhdGEubmFtZSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5za2VsZXRvbkRhdGEubmFtZS5pbmRleE9mKFwiQ2hhcmFjdGVyc1wiKSAhPT0gLTE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1c2VFeGlzdGluZ1NwaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8g55So5oi35bey57uP5Zyo57yW6L6R5Zmo5Lit6YWN572u5LqGY2hhcmFjdGVyIHNwaW5l77yM55u05o6l5L2/55SoXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZV0g5L2/55So57yW6L6R5Zmo6YWN572u55qEc3BpbmXvvIxJRDpcIiArIG4uaWQgKyBcIiwgc2tpbjpcIiArIG4uc3BpbmUuZGVmYXVsdFNraW4pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOWOn+Wni3NwaW5l54q25oCBIC0gYWN0aXZlOlwiICsgbi5zcGluZS5ub2RlLmFjdGl2ZSArIFwiLCBzY2FsZTpcIiArIG4uc3BpbmUubm9kZS5zY2FsZSArIFwiLCBzY2FsZVg6XCIgKyBuLnNwaW5lLm5vZGUuc2NhbGVYICsgXCIsIHNjYWxlWTpcIiArIG4uc3BpbmUubm9kZS5zY2FsZVkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOS/neWtmHNwaW5l55qE5Y6f5aeL6K6+572u77yI5Zyo56e75Yqo6IqC54K55LmL5YmN77yJXG4gICAgICAgICAgICAgICAgdmFyIHNwaW5lQWN0aXZlID0gbi5zcGluZS5ub2RlLmFjdGl2ZTtcbiAgICAgICAgICAgICAgICB2YXIgc3BpbmVTY2FsZSA9IG4uc3BpbmUubm9kZS5zY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgc3BpbmVTY2FsZVggPSBuLnNwaW5lLm5vZGUuc2NhbGVYO1xuICAgICAgICAgICAgICAgIHZhciBzcGluZVNjYWxlWSA9IG4uc3BpbmUubm9kZS5zY2FsZVk7XG4gICAgICAgICAgICAgICAgdmFyIHNwaW5lT3BhY2l0eSA9IG4uc3BpbmUubm9kZS5vcGFjaXR5O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWmguaenHNwaW5l5Y6f5pys5bCx5piv6ZqQ6JeP5oiW57yp5pS+5Li6MO+8jOiuvue9ruS4uum7mOiupOWAvFxuICAgICAgICAgICAgICAgIGlmICghc3BpbmVBY3RpdmUgfHwgc3BpbmVTY2FsZSA9PT0gMCB8fCAoc3BpbmVTY2FsZVggPT09IDAgJiYgc3BpbmVTY2FsZVkgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIHNwaW5l5Y6f5pys6ZqQ6JeP5oiW57yp5pS+5Li6MO+8jOS9v+eUqOm7mOiupOiuvue9rlwiKTtcbiAgICAgICAgICAgICAgICAgICAgc3BpbmVBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzcGluZVNjYWxlID0gMC4zOyAvLyDpu5jorqTnvKnmlL5cbiAgICAgICAgICAgICAgICAgICAgc3BpbmVTY2FsZVggPSAwLjM7XG4gICAgICAgICAgICAgICAgICAgIHNwaW5lU2NhbGVZID0gMC4zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pIZXJv6IqC54K5XG4gICAgICAgICAgICAgICAgdmFyIGhlcm9Ob2RlID0gbmV3IGNjLk5vZGUoXCJoZXJvXCIgKyBuLmlkKTtcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wb3NpdGlvbiA9IGUub2Jqc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobi5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wYXJlbnQgPSBlLm9ianNSb290O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOa3u+WKoEhlcm/nu4Tku7ZcbiAgICAgICAgICAgICAgICB2YXIgaGVyb0NvbXBvbmVudCA9IGhlcm9Ob2RlLmFkZENvbXBvbmVudChcIkhlcm9cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5bCGc3BpbmXoioLngrnnp7vliqjliLBoZXJv6IqC54K55LiLXG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5wYXJlbnQgPSBoZXJvTm9kZTtcbiAgICAgICAgICAgICAgICBuLnNwaW5lLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5oGi5aSN5oiW6K6+572uc3BpbmXoioLngrnlsZ7mgKfvvIznoa7kv53lj6/op4FcbiAgICAgICAgICAgICAgICBuLnNwaW5lLm5vZGUuYWN0aXZlID0gc3BpbmVBY3RpdmU7XG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLm9wYWNpdHkgPSBzcGluZU9wYWNpdHkgPiAwID8gc3BpbmVPcGFjaXR5IDogMjU1O1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5zY2FsZSA9IHNwaW5lU2NhbGU7XG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLnNjYWxlWCA9IHNwaW5lU2NhbGVYO1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5zY2FsZVkgPSBzcGluZVNjYWxlWTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDlvLrliLborr7nva5zcGluZeWKqOeUu++8jOehruS/nea4suafk1xuICAgICAgICAgICAgICAgIGlmIChuLnNwaW5lLmRlZmF1bHRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5zZXRBbmltYXRpb24oMCwgbi5zcGluZS5kZWZhdWx0QW5pbWF0aW9uLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuLnNwaW5lLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiuvue9rmhlcm/oioLngrnnmoR6SW5kZXjvvIznoa7kv53mraPnoa7mmL7npLpcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS56SW5kZXggPSAtaGVyb05vZGUueTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBzcGluZeiuvue9ruWQjiAtIGFjdGl2ZTpcIiArIG4uc3BpbmUubm9kZS5hY3RpdmUgKyBcIiwgc2NhbGU6XCIgKyBuLnNwaW5lLm5vZGUuc2NhbGUgKyBcIiwgc2NhbGVYOlwiICsgbi5zcGluZS5ub2RlLnNjYWxlWCArIFwiLCBzY2FsZVk6XCIgKyBuLnNwaW5lLm5vZGUuc2NhbGVZKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJZIZXJv57uE5Lu277yM5L2/55So5bey6YWN572u55qEc3BpbmVcbiAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LmluaXRCeShlLCBuLCB7XG4gICAgICAgICAgICAgICAgICAgIGpzb246IG4uanNvbixcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBuLmlkLFxuICAgICAgICAgICAgICAgICAgICBsdjE6IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKG4uaWQpLmx2IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgbWF4THY6IDBcbiAgICAgICAgICAgICAgICB9LCBuLnNwaW5lKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LnBvc2l0aW9uMiA9IGhlcm9Ob2RlLnBvc2l0aW9uLmFkZChuLmF0dE9mZnNldCk7XG4gICAgICAgICAgICAgICAgbi5oZXJvID0gaGVyb0NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBuLmluaXRIZXJvTm9kZXMoKTtcbiAgICAgICAgICAgICAgICBlLmhlcm9lcy5wdXNoKGhlcm9Db21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGUudXBkYXRlSHAoITEpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIEhlcm/oioLngrnliJvlu7rlrozmiJDvvIzkvY3nva46XCIgKyBoZXJvTm9kZS5wb3NpdGlvbiArIFwiLCBoZXJvWkluZGV4OlwiICsgaGVyb05vZGUuekluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBIZXJv54i26IqC54K5OlwiICsgaGVyb05vZGUucGFyZW50Lm5hbWUgKyBcIiwgc3BpbmXniLboioLngrk6XCIgKyBuLnNwaW5lLm5vZGUucGFyZW50Lm5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOacgOe7iHNwaW5l54q25oCBIC0gYWN0aXZlOlwiICsgbi5zcGluZS5ub2RlLmFjdGl2ZSArIFwiLCBzY2FsZTpcIiArIG4uc3BpbmUubm9kZS5zY2FsZSArIFwiLCBvcGFjaXR5OlwiICsgbi5zcGluZS5ub2RlLm9wYWNpdHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDnlKjmiLfmsqHmnInphY3nva5zcGluZe+8jOWKqOaAgeWIm+W7uu+8iOWbnumAgOmAu+i+ke+8iVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOWKqOaAgeWIm+W7unNwaW5l77yMSUQ6XCIgKyBuLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pIZXJv6IqC54K5XG4gICAgICAgICAgICAgICAgdmFyIGhlcm9Ob2RlID0gbmV3IGNjLk5vZGUoXCJoZXJvXCIgKyBuLmlkKTtcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wb3NpdGlvbiA9IGUub2Jqc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobi5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wYXJlbnQgPSBlLm9ianNSb290O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOa3u+WKoEhlcm/nu4Tku7ZcbiAgICAgICAgICAgICAgICB2YXIgaGVyb0NvbXBvbmVudCA9IGhlcm9Ob2RlLmFkZENvbXBvbmVudChcIkhlcm9cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5Yqg6L29Y2hhcmFjdGVy6KeS6Imy6LWE5rqQXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlclNraW5OYW1lID0gXCJDaGFyYWN0ZXJcIiArIChuLmlkIDwgMTAgPyBcIjBcIiArIG4uaWQgOiBuLmlkKTtcbiAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMudXNlQnVuZGxlQXNzZXQoXCJhY3RvcnNcIiwgXCJjaGFyYWN0ZXIvQ2hhcmFjdGVyc1wiLCBzcC5Ta2VsZXRvbkRhdGEsIGZ1bmN0aW9uIChjaGFyYWN0ZXJTcGluZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yib5bu6Y2hhcmFjdGVy55qEc3BpbmXoioLngrlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlclNwaW5lTm9kZSA9IG5ldyBjYy5Ob2RlKFwiY2hhcmFjdGVyU3BpbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lTm9kZS5wYXJlbnQgPSBoZXJvTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlclNwaW5lID0gY2hhcmFjdGVyU3BpbmVOb2RlLmFkZENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lLnNrZWxldG9uRGF0YSA9IGNoYXJhY3RlclNwaW5lRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUuZGVmYXVsdFNraW4gPSBjaGFyYWN0ZXJTa2luTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUuc2V0U2tpbihjaGFyYWN0ZXJTa2luTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lLmRlZmF1bHRBbmltYXRpb24gPSBcIklkbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUucHJlbXVsdGlwbGllZEFscGhhID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lLnVzZVRpbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZS5lbmFibGVCYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDnoa7kv51zcGluZeiKgueCueWPr+ingVxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZU5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmVOb2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva5oZXJv6IqC54K555qEekluZGV477yM56Gu5L+d5q2j56Gu5pi+56S6XG4gICAgICAgICAgICAgICAgICAgIGhlcm9Ob2RlLnpJbmRleCA9IC1oZXJvTm9kZS55O1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yid5aeL5YyWSGVyb+e7hOS7tlxuICAgICAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LmluaXRCeShlLCBuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiBuLmpzb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBuLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbHYxOiBjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YShuLmlkKS5sdiAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhMdjogMFxuICAgICAgICAgICAgICAgICAgICB9LCBjaGFyYWN0ZXJTcGluZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LnBvc2l0aW9uMiA9IGhlcm9Ob2RlLnBvc2l0aW9uLmFkZChuLmF0dE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIG4uaGVybyA9IGhlcm9Db21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIG4uaW5pdEhlcm9Ob2RlcygpO1xuICAgICAgICAgICAgICAgICAgICBlLmhlcm9lcy5wdXNoKGhlcm9Db21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICBlLnVwZGF0ZUhwKCExKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIEhlcm/liJ3lp4vljJblrozmiJDvvIxJRDpcIiArIG4uaWQgKyBcIiwgc2tpbjpcIiArIGNoYXJhY3RlclNraW5OYW1lICsgXCIsIOS9jee9rjpcIiArIGhlcm9Ob2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBoYXNIZXJvOiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXJvZXMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUuaW5mby5pZCA9PSB0ICYmIGUuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGVtaXRFbmVteXM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdmFyIGkgPSBjYy5wdnoucnVudGltZURhdGEud2F2ZSArIDE7XG4gICAgICAgIGlmICgyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICB0aGlzLndhdmVQbHVzSHAgPSAwO1xuICAgICAgICAgICAgdGhpcy53YXZlUGx1c0F0ayA9IDA7XG4gICAgICAgICAgICBpZiAoaSA+IDEwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlUGx1c0hwID0gKGkgLSAxMCkgKiB0aGlzLmxldmVsRGF0YS5ocHdhdmU7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlUGx1c0F0ayA9IChpIC0gMTApICogdGhpcy5sZXZlbERhdGEuYXRrd2F2ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID4gMTgpIHtcbiAgICAgICAgICAgICAgICBpID0gKChpIC0gMTkpICUgNSkgKyAxNDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuZW15Q291bnQgPSAwO1xuICAgICAgICB0LmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQud2F2ZSA9PSBpO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgaSA9IGUudCArIHQudGltZTtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgdC5FbmVteU51bTsgbisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSAxZTMgKiAoaSArIG4gKiB0LlNwYWNlKTtcbiAgICAgICAgICAgICAgICBlLmluc2VydEZyYW1lQWN0aW9uKG8sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5leGVjdXRlRXZlbnQyKHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZS5lbmVteUNvdW50ICs9IHQuRW5lbXlOdW07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZyYW1lQWN0aW9ucy5zb3J0KGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdC5tcyAtIGUubXM7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZXhlY3V0ZUV2ZW50MjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBjYy5wdnoudXRpbHMudXNlQnVuZGxlQXNzZXQoXCJhY3RvcnNcIiwgXCJab21iaWUvRW5lbXlcIiArIHQuRW5lbXlJZCwgY2MuUHJlZmFiLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZS5leGVjdXRlRXZlbnROZXdFbmVteShpLCB0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleGVjdXRlRXZlbnROZXdFbmVteTogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSBjYy5pbnN0YW50aWF0ZSh0KTtcbiAgICAgICAgdmFyIG4gPSBjYy5tYXRoLnJhbmRvbVJhbmdlKHRoaXMuZ3JvdW5kQXJlYUxCLnksIHRoaXMuZ3JvdW5kQXJlYVRSLnkpO1xuICAgICAgICB2YXIgbyA9IGUuaHA7XG4gICAgICAgIHZhciBzID0gZS5hdGs7XG4gICAgICAgIHN3aXRjaCAoY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYyKSB7XG4gICAgICAgICAgICBjYXNlIDEwMTpcbiAgICAgICAgICAgIGNhc2UgMTAyOlxuICAgICAgICAgICAgY2FzZSAxMDM6XG4gICAgICAgICAgICAgICAgbyAqPSBbMS4zLCAxLjQsIDEuNV1bY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYyIC0gMTAxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTA3OlxuICAgICAgICAgICAgY2FzZSAxMDg6XG4gICAgICAgICAgICBjYXNlIDEwOTpcbiAgICAgICAgICAgICAgICBzICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjIgLSAxMDddO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBvICo9IHRoaXMubGV2ZWxEYXRhLmhwYWRkIC8gMTAwO1xuICAgICAgICAgICAgICAgIHMgKj0gdGhpcy5sZXZlbERhdGEuYXRrYWRkIC8gMTAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG8gKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA5KSAqIHRoaXMubGV2ZWxEYXRhLmhwYWRkO1xuICAgICAgICAgICAgICAgIHMgKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA5KSAqIHRoaXMubGV2ZWxEYXRhLmF0a2FkZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBvICo9IDEgKyAoY2MucHZ6LlBsYXllckRhdGEuZ2V0U3RhZ2VMZXZlbCgpIC0gNSkgKiB0aGlzLmxldmVsRGF0YS5ocGFkZCArIHRoaXMud2F2ZVBsdXNIcDtcbiAgICAgICAgICAgICAgICBzICo9IDEgKyAoY2MucHZ6LlBsYXllckRhdGEuZ2V0U3RhZ2VMZXZlbCgpIC0gNSkgKiB0aGlzLmxldmVsRGF0YS5hdGthZGQgKyB0aGlzLndhdmVQbHVzQXRrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjID0gdGhpcy5hZGRFbmVteUluKGUuRW5lbXlJZCwgaSwgMzYwLCBuLCBvLCBzKTtcbiAgICAgICAgaWYgKDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIGMuZXhwID0gMC42ICogYy5leHA7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEVuZW15SW46IGZ1bmN0aW9uICh0LCBlLCBpLCBuLCBvLCBzKSB7XG4gICAgICAgIGUucGFyZW50ID0gdGhpcy5vYmpzUm9vdDtcbiAgICAgICAgZS54ID0gaTtcbiAgICAgICAgZS55ID0gbjtcbiAgICAgICAgdmFyIGMgPSBlLmdldENvbXBvbmVudChcIkVuZW15XCIpO1xuICAgICAgICBjLmluaXRCeSh0aGlzLCB0aGlzLmJ1bGxldHNSb290LCBvLCBzKTtcbiAgICAgICAgYy5pZCA9IHQ7XG4gICAgICAgIGMuc2hvd0hwQmFyID0gdCA+IDEwMDtcbiAgICAgICAgdGhpcy5hZGRFbmVteShjKTtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcbiAgICBhZGRFbmVteTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5lbmVteXMucHVzaCh0KTtcbiAgICB9LFxuICAgIGRlbEVuZW15OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuZW5lbXlzLmZpbmRJbmRleChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUgPT0gdDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICgtMSAhPSBlKSB7XG4gICAgICAgICAgICB0aGlzLmVuZW15cy5zcGxpY2UoZSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdC5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuZW5lbXlDb3VudC0tO1xuICAgICAgICBpZiAodC5pZCA+IDEwMCkge1xuICAgICAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDErKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFza0VuZW15Q291bnQyKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCghdGhpcy5pc0xhc3RXYXZlIHx8IHRoaXMuZW5lbXlDb3VudCA+IDApICYmIHQuZXhwID4gMCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0LmV4cDtcbiAgICAgICAgICAgIHZhciBuID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSgxMSk7XG4gICAgICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICAgICAgICBpID0gTWF0aC5yb3VuZChpICogKDEgKyAwLjAxICogbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmV4cCArPSBpO1xuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLmh1Yi5sdnVwSnNvbkZpbGUuanNvbltjYy5wdnoucnVudGltZURhdGEubHZdLmV4cDtcbiAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuZXhwID49IG8pIHtcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZXhwIC09IG87XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmx2Kys7XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC9wbGF5ZXJsZXZlbHVwXCIpO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQnVmZlVJXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lQnVmZlwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJc1N1Y2MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaHViLnVwZGF0ZUV4cCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0lzU3VjYygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBhZGRFbmVteUhwQmFyOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoIXQuaHBCYXIpIHtcbiAgICAgICAgICAgIHZhciBlID0gKHQuc2hvd0hwQmFyID8gdGhpcy5lQm9zc0hwUHJlZmFiIDogdGhpcy5lSHBQcmVmYWIpLmFkZE5vZGUodC5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIGNjLmZpbmQoXCJub2RlXCIsIGUpLnBvc2l0aW9uID0gdC5ocEJhclBvcztcbiAgICAgICAgICAgIHQuaHBCYXIgPSBlLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0Jhcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoZWNrSXNTdWNjOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLmhhc0VuZGVkICYmIDAgPT0gdGhpcy5lbmVteUNvdW50KSB7XG4gICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEud2F2ZSsrO1xuICAgICAgICAgICAgaWYgKHRoaXMudGFza0VuZW15Q291bnQxID4gMCkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5QbGF5ZXJEYXRhLmFkZE1pc3Npb25Qcm9ncmVzcyhcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLlh7votKXpppbpooZu5LiqXCJdLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrRW5lbXlDb3VudDIgPiAwKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkTWlzc2lvblByb2dyZXNzKFxuICAgICAgICAgICAgICAgICAgICBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWHu+i0peWDteWwuG7kuKpcIl0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFza0VuZW15Q291bnQyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hZGRNb25leSgxMCArIGNjLnB2ei5ydW50aW1lRGF0YS5nZXRCdWZmVmFsdWUoNSkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXN0V2F2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdWNjID0gITA7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNFbmRlZCA9ICEwO1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9ICExO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYygxKTtcbiAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgIFwiZ2FtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIndpblwiLFxuICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZUVuZFwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlFZmZlY3RBc3luYyhcImdhbWVcIiwgXCJzb3VuZC93aW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2F2ZUVuZEFuaVNwaW5lLm5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzLm1vbmV5SWNvbk5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLndhdmVFbmRBbmlTcGluZS5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy53YXZlRW5kQW5pU3BpbmUuZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgICAgICAgICBuLnggPSBpLng7XG4gICAgICAgICAgICAgICAgbi55ID0gaS55O1xuICAgICAgICAgICAgICAgIHRoaXMud2F2ZUVuZEFuaVNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYXV0b1RpbWVzKys7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5sdjJDb3VudCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHQuaHViLmJhY2tUb0JhZygpO1xuICAgICAgICAgICAgICAgICAgICB0LndhdmVFbmRBbmlTcGluZS5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgICAgICAgICB0LndhdmVFbmRBbmlTcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKDAgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja0VuZExldmVsKGNjLnB2ei5ydW50aW1lRGF0YS5sZXZlbCwgY2MucHZ6LnJ1bnRpbWVEYXRhLndhdmUgLSAxLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNob29zZUVuZW15OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodGhpcy5oYXNFbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSB0aGlzLmVuZW15cy5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmhwID4gMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBuO1xuICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCkge1xuICAgICAgICAgICAgbiA9IDFlNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG4gPSBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvID0gbnVsbDtcbiAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGUubm9kZS5wb3NpdGlvbi5zdWIodC5ub2RlLnBvc2l0aW9uKS5sZW5ndGhTcXIoKTtcbiAgICAgICAgICAgIGlmIChpIDwgbikge1xuICAgICAgICAgICAgICAgIG4gPSBpO1xuICAgICAgICAgICAgICAgIG8gPSBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgfSxcbiAgICBjaG9vc2VFbmVteXM6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHZhciBuID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvID0gdGhpcy5lbmVteXMuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gKGkuaHAgPiAwICYmIG4uaXNBbmdlclByZXNzZWQpIHx8IGkubm9kZS5wb3NpdGlvbi5zdWIodC5ub2RlLnBvc2l0aW9uKS5sZW5ndGhTcXIoKSA8IGU7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaSA+PSBvLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBpOyBjKyspIHtcbiAgICAgICAgICAgIHZhciBhID0gY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCBvLmxlbmd0aCk7XG4gICAgICAgICAgICBzLnB1c2goby5zcGxpY2UoYSwgMSlbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH0sXG4gICAgY2hvb3NlRW5lbXlCeUJ1bGxldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNFbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSB0aGlzLmVuZW15cy5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmhwID4gMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0W2NjLm1hdGgucmFuZG9tUmFuZ2VJbnQoMCwgdC5sZW5ndGgpXTtcbiAgICB9LFxuICAgIGNob29zZUhlcm86IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZSA9IHRoaXMuaGVyb2VzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGkgPSAxNjAwO1xuICAgICAgICB2YXIgbiA9IGVbMF07XG4gICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgZS5sZW5ndGg7IG8rKykge1xuICAgICAgICAgICAgdmFyIHM7XG4gICAgICAgICAgICBpZiAoZVtvXS5wb3NpdGlvbjIpIHtcbiAgICAgICAgICAgICAgICBzID0gZVtvXS5wb3NpdGlvbjIueDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcyA9IGVbb10ubm9kZS54O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGMgPSBNYXRoLmFicyhzIC0gdC54KTtcbiAgICAgICAgICAgIGlmIChjIDwgaSkge1xuICAgICAgICAgICAgICAgIGkgPSBjO1xuICAgICAgICAgICAgICAgIG4gPSBlW29dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH0sXG4gICAgY2hvb3NlTWluSHBIZXJvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gMTtcbiAgICAgICAgdmFyIGUgPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaGVyb2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5oZXJvZXNbaV0uaHAgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSB0aGlzLmhlcm9lc1tpXS5ocCAvIHRoaXMuaGVyb2VzW2ldLml0ZW0ubWF4SHA7XG4gICAgICAgICAgICAgICAgaWYgKG4gPCB0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQgPSBuO1xuICAgICAgICAgICAgICAgICAgICBlID0gdGhpcy5oZXJvZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgZ2V0SGVyb2VzTWF4TWFyZ2luWDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXJvZXNcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdC5ocCA+IDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCh0LCBlLm5vZGUueCArIGUuaXRlbS5yaWdoTWFyZ2luKTtcbiAgICAgICAgICAgIH0sIC0zNjApO1xuICAgIH0sXG4gICAgY2hlY2tJc0ZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmhlcm9lcy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0Lmhhc0RpZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdWNjID0gITE7XG4gICAgICAgICAgICB0aGlzLmhhc0VuZGVkID0gITA7XG4gICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL2ZhaWxcIik7XG4gICAgICAgICAgICBpZiAoMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYygxKSxcbiAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYW5rXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJhbmt3aW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlSYW5rRW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc1JlYm9ybikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNwZWVkTG9naWMoMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZUVuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgMCA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrRW5kTGV2ZWwoY2MucHZ6LnJ1bnRpbWVEYXRhLmxldmVsLCBjYy5wdnoucnVudGltZURhdGEud2F2ZSwgITEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2FtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmdWh1b1VJXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZVJlYm9yblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFkZE1vbmV5KDMwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyID0gMWUzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaGFzUmVib3JuID0gITA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hdXRvVGltZXMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmx2MkNvdW50ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiZ2FtZTFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVSUdhbWVFbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0VuZW15SHVydE51bTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSAoMSA9PSB0ID8gdGhpcy5lSHVydENyaXROdW0gOiB0aGlzLmVIdXJ0TnVtKS5hZGROb2RlKGUpO1xuICAgICAgICBuLnggKz0gY2MubWF0aC5yYW5kb21SYW5nZSgtNDAsIDQwKTtcbiAgICAgICAgbi55ICs9IDUwICsgY2MubWF0aC5yYW5kb21SYW5nZSgtMTAsIDQwKTtcbiAgICAgICAgY2MuZmluZChcIm51bVwiLCBuKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiLVwiICsgTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihpKSk7XG4gICAgICAgIG4uZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpO1xuICAgICAgICBuLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9uKFwiZmluaXNoZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbi5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dKc0VmZmVjdDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKDEyICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMuZUhpdFByZWZhYlxuICAgICAgICAgICAgICAgIC5hZGROb2RlKHQpXG4gICAgICAgICAgICAgICAgLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbilcbiAgICAgICAgICAgICAgICAuc2V0QW5pbWF0aW9uKDAsIFwiemRcIiArIGUgKyBcIl9oaXRcIiArIGNjLm1hdGgucmFuZG9tUmFuZ2VJbnQoMSwgNCksICExKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVIaXRHcm91bmRQcmVmYWJcbiAgICAgICAgICAgIC5hZGROb2RlKHQpXG4gICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKVxuICAgICAgICAgICAgLnNldEFuaW1hdGlvbigwLCBcInpkXCIgKyBlICsgXCJfanNcIiArIGNjLm1hdGgucmFuZG9tUmFuZ2VJbnQoMSwgNCksICExKTtcbiAgICB9LFxuICAgIHNob3dIZXJvSHVydE51bTogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLnBIdXJ0TnVtLmFkZE5vZGUodCk7XG4gICAgICAgIGkueCArPSBjYy5tYXRoLnJhbmRvbVJhbmdlKC00MCwgNDApO1xuICAgICAgICBpLnkgKz0gY2MubWF0aC5yYW5kb21SYW5nZSgxMCwgNzApO1xuICAgICAgICBjYy5maW5kKFwibnVtXCIsIGkpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCItXCIgKyBNYXRoLmZsb29yKGUpO1xuICAgICAgICBpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoKTtcbiAgICAgICAgaS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5vbihcImZpbmlzaGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGkucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkNsaWNrU3BlZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5vcGVuU3BlZWQpIHtcbiAgICAgICAgICAgIGlmICgxID09IGNjLnB2ei5ydW50aW1lRGF0YS5zcGVlZCkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zcGVlZCA9IDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zcGVlZCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwZWVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgXCIyc3BlZWRVSVwiLFxuICAgICAgICAgICAgICAgIFwiVUlTcGVlZFwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTcGVlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFNwZWVkTG9naWMoY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkKTtcbiAgICB9LFxuICAgIHNldFNwZWVkTG9naWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHNwLnRpbWVTY2FsZSA9IHQ7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNldFRpbWVTY2FsZSh0KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0YXRzU2hvd24pIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZVN0YXRzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRzUGFuZWwuYWN0aXZlID0gITA7XG4gICAgICAgICAgICB0aGlzLmlzU3RhdHNTaG93biA9ICEwO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0cygpO1xuICAgICAgICAgICAgdGhpcy5zdGF0c1BhbmVsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoKS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLk5vcm1hbDtcbiAgICAgICAgICAgIHRoaXMuc3RhdHNQYW5lbC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5vZmYoXCJmaW5pc2hlZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlU3RhdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pc1N0YXRzU2hvd24pIHtcbiAgICAgICAgICAgIHZhciBlID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuc3RhdHMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ICsgZTtcbiAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuaGVyb2VzXG4gICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0c1tlLmluZm8uaWRdIC0gY2MucHZ6LnJ1bnRpbWVEYXRhLnN0YXRzW3QuaW5mby5pZF07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaS56ZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSB0LnN0YXRzSXRlbVByZWZhYi5yb290LmNoaWxkcmVuLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5fX2lkID09IGkuaW5mby5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobyA9IHQuc3RhdHNJdGVtUHJlZmFiLmFkZE5vZGUoKSkuX19pZCA9IGkuaW5mby5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG8uekluZGV4ID0gbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gY2MucHZ6LnJ1bnRpbWVEYXRhLnN0YXRzW2kuaW5mby5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGkuaW5mby5qc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnV0aWxzLnNldFNwcml0ZUZyYW1lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJxdWFsaXR5XCIsIG8pLmdldENvbXBvbmVudChjYy5TcHJpdGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidWlJbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbS9wel9cIiArIGMucXVhbGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gY2MuZmluZChcImljb25cIiwgbykuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuc2tlbGV0b25EYXRhID0gaS5zcGluZS5za2VsZXRvbkRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIm5hbWVcIiwgbykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHMgLyBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIm51bTJcIiwgbykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSAoMTAwICogcikudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcImJhclwiLCBvKS5nZXRDb21wb25lbnQoY2MuUHJvZ3Jlc3NCYXIpLnByb2dyZXNzID0gcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoaWRlU3RhdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmlzU3RhdHNTaG93biA9ICExO1xuICAgICAgICB0aGlzLnN0YXRzUGFuZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuUmV2ZXJzZTtcbiAgICAgICAgdGhpcy5zdGF0c1BhbmVsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9uY2UoXCJmaW5pc2hlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0LnN0YXRzUGFuZWwuYWN0aXZlID0gITE7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyJdfQ==