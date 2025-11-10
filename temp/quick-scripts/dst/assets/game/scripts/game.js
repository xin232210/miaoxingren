
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


        var heroNode = new cc.Node("hero" + n.id); // 【修复】使用Item节点的位置作为Hero节点位置，而不是spine的(0,0)点
        // 这样Hero节点会在格子中央，spine在Hero节点下方偏移

        heroNode.position = e.objsRoot.convertToNodeSpaceAR(n.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        heroNode.parent = e.objsRoot;
        console.log("[Game] Hero节点位置（基于Item节点）- ID:" + n.id + ", x:" + heroNode.position.x.toFixed(1) + ", y:" + heroNode.position.y.toFixed(1)); // 添加Hero组件

        var heroComponent = heroNode.addComponent("Hero"); // 【关键】在移动spine之前，保存它在Item节点下的位置
        // 这个位置将用于一波结束后恢复spine

        n.spineInitialPos = n.spine.node.position.clone();
        console.log("[Game] 保存spine在Item节点下的初始位置 - ID:" + n.id + ", x:" + n.spineInitialPos.x + ", y:" + n.spineInitialPos.y); // 将spine节点移动到hero节点下

        n.spine.node.removeFromParent(false);
        n.spine.node.parent = heroNode; // 【修复】保持spine相对于Item的偏移量，这样spine在Hero节点下的位置正确

        n.spine.node.position = n.spineInitialPos.clone();
        console.log("[Game] spine在Hero节点下的位置 - ID:" + n.id + ", x:" + n.spine.node.position.x + ", y:" + n.spine.node.position.y); // 恢复或设置spine节点属性，确保可见

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

        var heroNode = new cc.Node("hero" + n.id); // 【修复】使用Item节点的位置作为Hero节点位置

        heroNode.position = e.objsRoot.convertToNodeSpaceAR(n.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        heroNode.parent = e.objsRoot;
        console.log("[Game] Hero节点位置（基于Item节点）- ID:" + n.id + ", x:" + heroNode.position.x.toFixed(1) + ", y:" + heroNode.position.y.toFixed(1)); // 添加Hero组件

        var heroComponent = heroNode.addComponent("Hero"); // 加载character角色资源

        var characterSkinName = "Character" + (n.id < 10 ? "0" + n.id : n.id);
        cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (characterSpineData) {
          // 【关键】保存spine的初始位置（对于动态创建的spine，初始位置是(0,0)）
          n.spineInitialPos = cc.v2(0, 0);
          console.log("[Game] 动态创建spine，初始位置:", n.spineInitialPos); // 创建character的spine节点

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvZ2FtZS5qcyJdLCJuYW1lcyI6WyIkcHJlZmFiSW5mbyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImJnMlNwIiwiU3ByaXRlIiwiZ3JvdW5kQXJlYU5vZGUiLCJOb2RlIiwiYmdNdXNpYzIiLCJBdWRpb0NsaXAiLCJzaGllbGRCYXIiLCJQcm9ncmVzc0JhciIsInNoaWVsZExhYmVsIiwiTGFiZWwiLCJocEJhciIsImhwTGFiZWwiLCJwYXVzZU5vZGUiLCJzcGVlZE5vZGUiLCJzcGVlZExhYmVsIiwic3RhdHNCdG5Ob2RlIiwibGV2ZWxzSnNvbkZpbGUiLCJKc29uQXNzZXQiLCJncm91bmQiLCJvYmpzUm9vdCIsImJ1bGxldHNSb290IiwiZmlnaHROb2RlcyIsImhlcm9Kc29uRmlsZSIsImVIdXJ0TnVtIiwiZUh1cnRDcml0TnVtIiwiZURpZVByZWZhYiIsImVQb2lzb25QcmVmYWIiLCJlU2xvd1ByZWZhYiIsImVJY2VQcmVmYWIiLCJlV2Vha1ByZWZhYiIsImVIcFByZWZhYiIsImVCb3NzSHBQcmVmYWIiLCJlSGl0UHJlZmFiIiwiZUhpdEdyb3VuZFByZWZhYiIsInBIdXJ0TnVtIiwicEZpcmVFZmZlY3QiLCJhZGRCdWZmUHJlZmFiIiwiYWNjQnVmZlByZWZhYiIsIndhdmVFbmRBbmlTcGluZSIsInNwIiwiU2tlbGV0b24iLCJtb25leUljb25Ob2RlIiwidHJ5UGxhbnROb2RlIiwidHJ5UGxhbnRJY29uIiwic3RhdHNQYW5lbCIsInN0YXRzSXRlbVByZWZhYiIsImFuZ2VyQmFyIiwiYW5nZXJCYXJTcCIsImFuZ2VyQmFyU3BmcyIsIlNwcml0ZUZyYW1lIiwiYW5nZXJFbXB0eVRpcCIsImFuZ2VyQmFyTm9kZSIsImFuZ2VyTW9kZU5vZGUiLCJvbkxvYWQiLCJub2RlIiwiYWN0aXZlIiwic3RhcnRMb2dpYyIsInQiLCJlIiwiaSIsImh1YiIsImxldmVsRGF0YSIsIm4iLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJncm91bmRBcmVhTEIiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsInYyIiwieE1pbiIsInlNaW4iLCJncm91bmRBcmVhVFIiLCJ4TWF4IiwieU1heCIsInRpbWVQYXVzZWQiLCJtc0luZGV4IiwiZnJhbWVBY3Rpb25zIiwiY2JzMiIsImNiSWQiLCJwYXVzZWRDYnMiLCJwYXVzZWRDYnMyIiwiaGFzRW5kZWQiLCJwdnoiLCJydW50aW1lRGF0YSIsIm1vZGUiLCJtYXhXYXZlIiwid2F2ZSIsImlzTGFzdFdhdmUiLCJlbmVteXMiLCJ0YXNrRW5lbXlDb3VudDEiLCJ0YXNrRW5lbXlDb3VudDIiLCJidXRsZXIiLCJvbiIsIm9uR2V0SHBCdWZmIiwiaW5pdEhlcm9lcyIsInVwZGF0ZUhwIiwidXBkYXRlU2hpZWxkIiwidXBkYXRlU3BlZWQiLCJpc0FuZ2VyUHJlc3NlZCIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwic3RhcnRBbmdlck1vZGUiLCJUT1VDSF9FTkQiLCJzdG9wQW5nZXJNb2RlIiwiVE9VQ0hfQ0FOQ0VMIiwidXBkYXRlQW5nZXIiLCJkaXJlY3RvciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJlbmFibGVkIiwic2hvd0dhbWUxc3QiLCJndWlkZU1hbmFnZXIiLCJzaG93R3VpZGUiLCJoaWRlRmluZ2VyIiwidGlwIiwiYmVnaW5FbWl0RW5lbXlzIiwiRGlyZWN0b3IiLCJFVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORyIsInJlc2V0U3BlZWQiLCJvbkJhY2tGcm9tR2FtZSIsImZvckVhY2giLCJyZW1vdmVBbGxDaGlsZHJlbiIsIm9mZiIsImhlcm9lcyIsIklLQm9uZSIsInR3ZWVuIiwidG8iLCJ4IiwieSIsInN0YXJ0IiwibGV2ZWwiLCJwb3B1cE1hbmFnZXIiLCJzaG93VG9hc3QiLCJ1dGlscyIsInVzZUJ1bmRsZUFzc2V0IiwiZW1pdEVuZW15cyIsImpzb24iLCJzZXRTcGVlZExvZ2ljIiwicHJvZ3Jlc3MiLCJhbmdlciIsIndpZHRoIiwib3BhY2l0eSIsImdldE1vbmV5V1BvcyIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlZlYzIiLCJaRVJPIiwiZ2V0QW5nZXJCYXJXUG9zIiwic2hvd0J1ZmZFZmZlY3QiLCJvIiwiYWRkTm9kZSIsInMiLCJnZXRDb21wb25lbnQiLCJjIiwic2V0QW5pbWF0aW9uIiwiYSIsInIiLCJmaW5kQm9uZSIsInNldFRyYWNrQ29tcGxldGVMaXN0ZW5lciIsImJhZyIsInJlZHVjZSIsImhwIiwiaXRlbSIsIm1heEhwIiwic3RyaW5nIiwiTWF0aCIsInJvdW5kIiwic2hpZWxkVmFsdWUiLCJwYXJlbnQiLCJmbG9vciIsImluc2VydEZyYW1lQWN0aW9uIiwiZmluZCIsIm1zIiwiY2JzIiwicHVzaCIsImluc2VydEZyYW1lQ0IiLCJmaW5kSW5kZXgiLCJsZW5ndGgiLCJzcGxpY2UiLCJjYiIsImlkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInRpbWUiLCJ1cGRhdGVUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJpbnRldmFsIiwiY2xlYXJJbnRlcnZhbCIsInVwZGF0ZSIsImNhbGwiLCJtaW4iLCJzaGlmdCIsInBsYXlNdXNpYyIsInNwcml0ZUZyYW1lIiwiYmdNdXNpYyIsInN0YXJ0VHdlZW4iLCJfdW5pb24iLCJydW5BY3Rpb24iLCJ0YXJnZXRlZEFjdGlvbiIsIl90YXJnZXQiLCJwYXVzZUdhbWUiLCJwYXVzZURpcmVjdG9yIiwicmVzdW1lR2FtZSIsInJlc3VtZURpcmVjdG9yIiwib25Qb3B1cDFzdCIsIm9uQWxsQ2xvc2VkIiwiYmxvY2tSb290IiwiYm9hcmRJdGVtc1Jvb3QiLCJjaGlsZHJlbiIsInVzZUV4aXN0aW5nU3BpbmUiLCJzcGluZSIsInNrZWxldG9uRGF0YSIsIm5hbWUiLCJpbmRleE9mIiwiY29uc29sZSIsImxvZyIsImRlZmF1bHRTa2luIiwic2NhbGUiLCJzY2FsZVgiLCJzY2FsZVkiLCJzcGluZUFjdGl2ZSIsInNwaW5lU2NhbGUiLCJzcGluZVNjYWxlWCIsInNwaW5lU2NhbGVZIiwic3BpbmVPcGFjaXR5IiwiaGVyb05vZGUiLCJwb3NpdGlvbiIsInRvRml4ZWQiLCJoZXJvQ29tcG9uZW50IiwiYWRkQ29tcG9uZW50Iiwic3BpbmVJbml0aWFsUG9zIiwiY2xvbmUiLCJyZW1vdmVGcm9tUGFyZW50IiwiZGVmYXVsdEFuaW1hdGlvbiIsInpJbmRleCIsImluaXRCeSIsImluZGV4IiwibHYxIiwiUGxheWVyRGF0YSIsImdldFRvb2xEYXRhIiwibHYiLCJtYXhMdiIsInBvc2l0aW9uMiIsImFkZCIsImF0dE9mZnNldCIsImhlcm8iLCJpbml0SGVyb05vZGVzIiwiY2hhcmFjdGVyU2tpbk5hbWUiLCJTa2VsZXRvbkRhdGEiLCJjaGFyYWN0ZXJTcGluZURhdGEiLCJjaGFyYWN0ZXJTcGluZU5vZGUiLCJjaGFyYWN0ZXJTcGluZSIsInNldFNraW4iLCJwcmVtdWx0aXBsaWVkQWxwaGEiLCJ1c2VUaW50IiwiZW5hYmxlQmF0Y2giLCJoYXNIZXJvIiwic29tZSIsImluZm8iLCJ3YXZlUGx1c0hwIiwid2F2ZVBsdXNBdGsiLCJocHdhdmUiLCJhdGt3YXZlIiwiZW5lbXlDb3VudCIsImZpbHRlciIsIkVuZW15TnVtIiwiU3BhY2UiLCJleGVjdXRlRXZlbnQyIiwic29ydCIsIkVuZW15SWQiLCJQcmVmYWIiLCJleGVjdXRlRXZlbnROZXdFbmVteSIsImluc3RhbnRpYXRlIiwibWF0aCIsInJhbmRvbVJhbmdlIiwiYXRrIiwiYWN0QnVmZjIiLCJocGFkZCIsImF0a2FkZCIsImdldFN0YWdlTGV2ZWwiLCJhZGRFbmVteUluIiwiZXhwIiwic2hvd0hwQmFyIiwiYWRkRW5lbXkiLCJkZWxFbmVteSIsImdldEJ1ZmZWYWx1ZSIsImx2dXBKc29uRmlsZSIsInBsYXlFZmZlY3RBc3luYyIsInBvcHVwIiwiY2hlY2tJc1N1Y2MiLCJ1cGRhdGVFeHAiLCJhZGRFbmVteUhwQmFyIiwiaHBCYXJQb3MiLCJhZGRNaXNzaW9uUHJvZ3Jlc3MiLCJHYW1lQ29uZmlnIiwiTWlzc2lvblR5cGUiLCJhZGRNb25leSIsImlzU3VjYyIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJhdXRvVGltZXMiLCJsdjJDb3VudCIsImJhY2tUb0JhZyIsIlRBVXRpbHMiLCJ0cmFja0VuZExldmVsIiwiY2hvb3NlRW5lbXkiLCJzdWIiLCJsZW5ndGhTcXIiLCJjaG9vc2VFbmVteXMiLCJyYW5kb21SYW5nZUludCIsImNob29zZUVuZW15QnlCdWxsZXQiLCJjaG9vc2VIZXJvIiwiYWJzIiwiY2hvb3NlTWluSHBIZXJvIiwiZ2V0SGVyb2VzTWF4TWFyZ2luWCIsIm1heCIsInJpZ2hNYXJnaW4iLCJjaGVja0lzRmFpbCIsImhhc0RpZSIsImhhc1JlYm9ybiIsImxvYWRTY2VuZSIsInNob3dFbmVteUh1cnROdW0iLCJBbmltYXRpb24iLCJwbGF5Iiwic2hvd0pzRWZmZWN0Iiwic2hvd0hlcm9IdXJ0TnVtIiwib25DbGlja1NwZWVkIiwib3BlblNwZWVkIiwic3BlZWQiLCJ0aW1lU2NhbGUiLCJnZXRTY2hlZHVsZXIiLCJzZXRUaW1lU2NhbGUiLCJvbkNsaWNrU3RhdHMiLCJpc1N0YXRzU2hvd24iLCJoaWRlU3RhdHMiLCJ1cGRhdGVTdGF0cyIsIndyYXBNb2RlIiwiV3JhcE1vZGUiLCJOb3JtYWwiLCJzdGF0cyIsInpkIiwicm9vdCIsIl9faWQiLCJzZXRTcHJpdGVGcmFtZSIsInF1YWxpdHkiLCJSZXZlcnNlIiwib25jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQywwQkFBRCxDQUF6Qjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUosRUFBRSxDQUFDSyxNQURGO0lBRVJDLGNBQWMsRUFBRU4sRUFBRSxDQUFDTyxJQUZYO0lBR1JDLFFBQVEsRUFBRVIsRUFBRSxDQUFDUyxTQUhMO0lBSVJDLFNBQVMsRUFBRVYsRUFBRSxDQUFDVyxXQUpOO0lBS1JDLFdBQVcsRUFBRVosRUFBRSxDQUFD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QUFDaVUsU0FBaEMsRUFBMkN3QixJQUEzQyxDQUFnRCxVQUFoRCxFQUE0RCxZQUFZO01BQ3BFNVIsQ0FBQyxDQUFDYixVQUFGLENBQWFXLE1BQWIsR0FBc0IsQ0FBQyxDQUF2QjtJQUNILENBRkQ7RUFHSDtBQTNnQ0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyICRwcmVmYWJJbmZvID0gcmVxdWlyZShcIi4uLy4uL3NjcmlwdHMvUHJlZmFiSW5mb1wiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBiZzJTcDogY2MuU3ByaXRlLFxuICAgICAgICBncm91bmRBcmVhTm9kZTogY2MuTm9kZSxcbiAgICAgICAgYmdNdXNpYzI6IGNjLkF1ZGlvQ2xpcCxcbiAgICAgICAgc2hpZWxkQmFyOiBjYy5Qcm9ncmVzc0JhcixcbiAgICAgICAgc2hpZWxkTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBocEJhcjogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIGhwTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBwYXVzZU5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHNwZWVkTm9kZTogY2MuTm9kZSxcbiAgICAgICAgc3BlZWRMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIHN0YXRzQnRuTm9kZTogY2MuTm9kZSxcbiAgICAgICAgbGV2ZWxzSnNvbkZpbGU6IGNjLkpzb25Bc3NldCxcbiAgICAgICAgZ3JvdW5kOiBjYy5Ob2RlLFxuICAgICAgICBvYmpzUm9vdDogY2MuTm9kZSxcbiAgICAgICAgYnVsbGV0c1Jvb3Q6IGNjLk5vZGUsXG4gICAgICAgIGZpZ2h0Tm9kZXM6IFtjYy5Ob2RlXSxcbiAgICAgICAgaGVyb0pzb25GaWxlOiBjYy5Kc29uQXNzZXQsXG4gICAgICAgIGVIdXJ0TnVtOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZUh1cnRDcml0TnVtOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZURpZVByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVQb2lzb25QcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlU2xvd1ByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVJY2VQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlV2Vha1ByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVIcFByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGVCb3NzSHBQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBlSGl0UHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgZUhpdEdyb3VuZFByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIHBIdXJ0TnVtOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgcEZpcmVFZmZlY3Q6ICRwcmVmYWJJbmZvLFxuICAgICAgICBhZGRCdWZmUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgYWNjQnVmZlByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIHdhdmVFbmRBbmlTcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIG1vbmV5SWNvbk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHRyeVBsYW50Tm9kZTogY2MuTm9kZSxcbiAgICAgICAgdHJ5UGxhbnRJY29uOiBjYy5TcHJpdGUsXG4gICAgICAgIHN0YXRzUGFuZWw6IGNjLk5vZGUsXG4gICAgICAgIHN0YXRzSXRlbVByZWZhYjogJHByZWZhYkluZm8sXG4gICAgICAgIGFuZ2VyQmFyOiBjYy5Qcm9ncmVzc0JhcixcbiAgICAgICAgYW5nZXJCYXJTcDogY2MuU3ByaXRlLFxuICAgICAgICBhbmdlckJhclNwZnM6IFtjYy5TcHJpdGVGcmFtZV0sXG4gICAgICAgIGFuZ2VyRW1wdHlUaXA6IGNjLk5vZGUsXG4gICAgICAgIGFuZ2VyQmFyTm9kZTogY2MuTm9kZSxcbiAgICAgICAgYW5nZXJNb2RlTm9kZTogY2MuTm9kZVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMud2F2ZUVuZEFuaVNwaW5lLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgIGlmICh0aGlzLnN0YXRzUGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHNQYW5lbC5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuZ2VyRW1wdHlUaXAuYWN0aXZlID0gITE7XG4gICAgfSxcbiAgICBzdGFydExvZ2ljOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHZhciBpID0gdGhpcy5odWIubGV2ZWxEYXRhO1xuICAgICAgICB0aGlzLmxldmVsRGF0YSA9IGk7XG4gICAgICAgIHZhciBuID0gdGhpcy5ncm91bmRBcmVhTm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcbiAgICAgICAgdGhpcy5ncm91bmRBcmVhTEIgPSB0aGlzLm9ianNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKGNjLnYyKG4ueE1pbiwgbi55TWluKSk7XG4gICAgICAgIHRoaXMuZ3JvdW5kQXJlYVRSID0gdGhpcy5vYmpzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihjYy52MihuLnhNYXgsIG4ueU1heCkpO1xuICAgICAgICB0aGlzLnRpbWVQYXVzZWQgPSAhMTtcbiAgICAgICAgdGhpcy50ID0gMDtcbiAgICAgICAgdGhpcy5tc0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5mcmFtZUFjdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5jYnMyID0gW107XG4gICAgICAgIHRoaXMuY2JJZCA9IDE7XG4gICAgICAgIHRoaXMucGF1c2VkQ2JzID0gW107XG4gICAgICAgIHRoaXMucGF1c2VkQ2JzMiA9IFtdO1xuICAgICAgICB0aGlzLmhhc0VuZGVkID0gITE7XG4gICAgICAgIHRoaXMuc3RhdHNCdG5Ob2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICBpZiAoMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgdGhpcy5tYXhXYXZlID0gOTk5OTk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1heFdhdmUgPSBpLndhdmU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0xhc3RXYXZlID0gMiAhPSBjYy5wdnoucnVudGltZURhdGEubW9kZSAmJiBjYy5wdnoucnVudGltZURhdGEud2F2ZSA9PSBpLndhdmUgLSAxO1xuICAgICAgICB0aGlzLmVuZW15cyA9IFtdO1xuICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MSA9IDA7XG4gICAgICAgIHRoaXMudGFza0VuZW15Q291bnQyID0gMDtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub24oXCJtYXhIcFwiLCB0aGlzLm9uR2V0SHBCdWZmLCB0aGlzKTtcbiAgICAgICAgdGhpcy5pbml0SGVyb2VzKHQpO1xuICAgICAgICB0aGlzLnVwZGF0ZUhwKCExKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGllbGQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTcGVlZCgpO1xuICAgICAgICB0aGlzLmlzQW5nZXJQcmVzc2VkID0gITE7XG4gICAgICAgIHRoaXMuYW5nZXJCYXJOb2RlLm9uKFxuICAgICAgICAgICAgY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZS5zdGFydEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5hbmdlckJhck5vZGUub24oXG4gICAgICAgICAgICBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wQW5nZXJNb2RlKCk7XG4gICAgICAgICAgICAgICAgZS5hbmdlckVtcHR5VGlwLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5hbmdlckJhck5vZGUub24oXG4gICAgICAgICAgICBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wQW5nZXJNb2RlKCk7XG4gICAgICAgICAgICAgICAgZS5hbmdlckVtcHR5VGlwLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy51cGRhdGVBbmdlcigpO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZCA9ICEwO1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEubW9kZTtcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCAmJiAwID09IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlKSB7XG4gICAgICAgICAgICBjYy5ndWlkZU1hbmFnZXIuc2hvd0d1aWRlKFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlRmluZ2VyOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogXCLlg7XlsLjmraPlnKjov5vmlLvmiJHku6znmoToirHlm63vvIzotbbntKfmtojnga3ku5bku6whXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuYmVnaW5FbWl0RW5lbXlzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iZWdpbkVtaXRFbmVteXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuYWJsZWQgPSAhMDtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcsIHRoaXMucmVzZXRTcGVlZCwgdGhpcyk7XG4gICAgfSxcbiAgICBvbkJhY2tGcm9tR2FtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0b3BBbmdlck1vZGUoKTtcbiAgICAgICAgdGhpcy5maWdodE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYy5idXRsZXIubm9kZS5vZmYoXCJtYXhIcFwiLCB0aGlzLm9uR2V0SHBCdWZmLCB0aGlzKTtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORywgdGhpcy5yZXNldFNwZWVkLCB0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSAhMTtcbiAgICAgICAgdGhpcy5oZXJvZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQuSUtCb25lKSB7XG4gICAgICAgICAgICAgICAgY2MudHdlZW4odC5JS0JvbmUpXG4gICAgICAgICAgICAgICAgICAgIC50bygwLjA2NCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogNTBcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYmVnaW5FbWl0RW5lbXlzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdmFyIGUgPSBudWxsO1xuICAgICAgICB2YXIgaSA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAoY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBlID0gXCJnYW1lXCI7XG4gICAgICAgICAgICAgICAgaSA9IFwiY29uZmlnL0xldmVsXCIgKyB0aGlzLmxldmVsRGF0YS5sZXZlbDtcbiAgICAgICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLnNob3dHYW1lMXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gXCJCXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGUgPSBcImdhbWVcIjtcbiAgICAgICAgICAgICAgICBpID0gXCJjb25maWcvXCIgKyB0aGlzLmxldmVsRGF0YS5sZXZlbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlID0gXCJyYW5rXCI7XG4gICAgICAgICAgICAgICAgaSA9IFwiY29uZmlnL1wiICsgdGhpcy5sZXZlbERhdGEubGV2ZWw7XG4gICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnNob3dUb2FzdChcIuesrFwiICsgKGNjLnB2ei5ydW50aW1lRGF0YS53YXZlICsgMSkgKyBcIuazouW8gOWni1wiKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5wdnoudXRpbHMudXNlQnVuZGxlQXNzZXQoZSwgaSwgY2MuSnNvbkFzc2V0LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdC5lbWl0RW5lbXlzKGUuanNvbik7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzZXRTcGVlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFNwZWVkTG9naWMoMSk7XG4gICAgfSxcbiAgICB1cGRhdGVBbmdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFuZ2VyQmFyLnByb2dyZXNzID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyIC8gMWUzO1xuICAgICAgICBpZiAodGhpcy5hbmdlckJhci5ub2RlLndpZHRoID4gMTApIHtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJCYXIubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hbmdlckJhci5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRNb25leVdQb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uZXlJY29uTm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICB9LFxuICAgIGdldEFuZ2VyQmFyV1BvczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmdlckJhci5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52Mih0aGlzLmFuZ2VyQmFyLm5vZGUud2lkdGgsIDApKTtcbiAgICB9LFxuICAgIHNob3dCdWZmRWZmZWN0OiBmdW5jdGlvbiAodCwgZSwgaSwgbikge1xuICAgICAgICB2YXIgbyA9IHRoaXMuYWRkQnVmZlByZWZhYi5hZGROb2RlKGUpO1xuICAgICAgICB2YXIgcyA9IG8uZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgdmFyIGMgPSBzLnNldEFuaW1hdGlvbigwLCB0LCAhMSk7XG4gICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICB2YXIgYSA9IG8uY29udmVydFRvTm9kZVNwYWNlQVIoaSk7XG4gICAgICAgICAgICB2YXIgciA9IHMuZmluZEJvbmUoXCJJS1wiKTtcbiAgICAgICAgICAgIHIueCA9IGEueDtcbiAgICAgICAgICAgIHIueSA9IGEueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgcy5zZXRUcmFja0NvbXBsZXRlTGlzdGVuZXIoYywgbik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uR2V0SHBCdWZmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYmFnLnVwZGF0ZUhwKCk7XG4gICAgICAgIHRoaXMudXBkYXRlSHAoKTtcbiAgICB9LFxuICAgIHVwZGF0ZUhwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMuaGVyb2VzLnJlZHVjZShmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgcmV0dXJuIHQgKyBlLmhwO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmhlcm9lcy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICsgZS5pdGVtLm1heEhwO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgaWYgKDAgIT0gaSkge1xuICAgICAgICAgICAgdGhpcy5ocExhYmVsLnN0cmluZyA9IE1hdGgucm91bmQoZSk7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMuaHBCYXIpXG4gICAgICAgICAgICAgICAgICAgIC50bygwLjEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBlIC8gaVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ocEJhci5wcm9ncmVzcyA9IGUgLyBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTaGllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLmhlcm9lcy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICsgZS5zaGllbGRWYWx1ZTtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5oZXJvZXMucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdCArIGUuaXRlbS5tYXhIcDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHZhciBpID0gdCA+IDA7XG4gICAgICAgIHRoaXMuc2hpZWxkQmFyLm5vZGUuYWN0aXZlID0gaTtcbiAgICAgICAgdGhpcy5zaGllbGRMYWJlbC5ub2RlLnBhcmVudC5hY3RpdmUgPSBpO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdGhpcy5zaGllbGRMYWJlbC5zdHJpbmcgPSBNYXRoLmZsb29yKHQpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGRCYXIucHJvZ3Jlc3MgPSB0IC8gZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5zZXJ0RnJhbWVBY3Rpb246IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5mcmFtZUFjdGlvbnMuZmluZChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUubXMgPT0gdDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICBpLmNicy5wdXNoKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFtZUFjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgbXM6IHQsXG4gICAgICAgICAgICAgICAgY2JzOiBbZV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbnNlcnRGcmFtZUNCOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuY2JJZDtcbiAgICAgICAgdmFyIG4gPSB0aGlzLmNicy5maW5kSW5kZXgoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLm1zID4gdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBvO1xuICAgICAgICBpZiAoLTEgPT0gbikge1xuICAgICAgICAgICAgbyA9IHRoaXMuY2JzLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG8gPSBuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2JzLnNwbGljZShvLCAwLCB7XG4gICAgICAgICAgICBtczogdCxcbiAgICAgICAgICAgIGNiOiBlLFxuICAgICAgICAgICAgaWQ6IGlcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2JJZCsrO1xuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIHNldFRpbWVvdXQ6IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZW91dChpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoY2MucHZ6LnRpbWUpICsgZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RnJhbWVDQihuLCB0KTtcbiAgICB9LFxuICAgIGNsZWFyVGltZW91dDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmNicy5maW5kSW5kZXgoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmlkID09IHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoLTEgIT0gZSkge1xuICAgICAgICAgICAgdGhpcy5jYnMuc3BsaWNlKGUsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVUaW1lb3V0OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXMuY2JzLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmlkID09IGk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgcmV0dXJuIChuLm1zICs9IGUpLCBpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0VGltZW91dCh0LCBlLCBpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0SW50ZXJ2YWw6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5jYklkO1xuICAgICAgICB0aGlzLmNiczIucHVzaCh7XG4gICAgICAgICAgICBpZDogaSxcbiAgICAgICAgICAgIGNiOiB0LFxuICAgICAgICAgICAgbXM6IE1hdGguZmxvb3IoY2MucHZ6LnRpbWUpICsgZSxcbiAgICAgICAgICAgIGludGV2YWw6IGVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2JJZCsrO1xuICAgICAgICByZXR1cm4gaTtcbiAgICB9LFxuICAgIGNsZWFySW50ZXJ2YWw6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5jYnMyLmZpbmRJbmRleChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUuaWQgPT0gdDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICgtMSAhPSBlKSB7XG4gICAgICAgICAgICB0aGlzLmNiczIuc3BsaWNlKGUsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnRpbWVQYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMudCArPSB0O1xuICAgICAgICAgICAgdGhpcy50O1xuICAgICAgICAgICAgdmFyIGkgPSAxZTMgKiB0aGlzLnQ7XG4gICAgICAgICAgICBpZiAodGhpcy5tc0luZGV4IDwgdGhpcy5mcmFtZUFjdGlvbnMubGVuZ3RoICYmIGkgPj0gdGhpcy5mcmFtZUFjdGlvbnNbdGhpcy5tc0luZGV4XS5tcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zW3RoaXMubXNJbmRleF0uY2JzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQuY2FsbChlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1zSW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQW5nZXJQcmVzc2VkKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyIC09IDEyNSAqIHQ7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5hbmdlciA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJFbXB0eVRpcC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wQW5nZXJNb2RlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyID0gTWF0aC5taW4oMWUzLCBjYy5wdnoucnVudGltZURhdGEuYW5nZXIgKyA1ICogdCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFuZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IHRoaXMuY2JzLmxlbmd0aCA+IDAgJiYgY2MucHZ6LnRpbWUgPiB0aGlzLmNic1swXS5tczsgKSB7XG4gICAgICAgICAgICB0aGlzLmNicy5zaGlmdCgpLmNiLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYnMyLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmIChjYy5wdnoudGltZSA+PSB0Lm1zKSB7XG4gICAgICAgICAgICAgICAgdC5jYi5jYWxsKGUpO1xuICAgICAgICAgICAgICAgIHQubXMgKz0gdC5pbnRldmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHN0YXJ0QW5nZXJNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5nZXJQcmVzc2VkIHx8IHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLmFuZ2VyID4gMCkge1xuICAgICAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5TXVzaWModGhpcy5iZ011c2ljMik7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FuZ2VyUHJlc3NlZCA9ICEwO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJCYXJTcC5zcHJpdGVGcmFtZSA9IHRoaXMuYW5nZXJCYXJTcGZzWzFdO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJNb2RlTm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm9lcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lml0ZW0uc3RhcnRBbmdlck1vZGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RvcEFuZ2VyTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuZ2VyUHJlc3NlZCkge1xuICAgICAgICAgICAgY2MuYnV0bGVyLnBsYXlNdXNpYyh0aGlzLmJhZy5iZ011c2ljKTtcbiAgICAgICAgICAgIHRoaXMuaXNBbmdlclByZXNzZWQgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJCYXJTcC5zcHJpdGVGcmFtZSA9IHRoaXMuYW5nZXJCYXJTcGZzWzBdO1xuICAgICAgICAgICAgdGhpcy5hbmdlck1vZGVOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgdGhpcy5oZXJvZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0Lml0ZW0uc3RvcEFuZ2VyTW9kZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0YXJ0VHdlZW46IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdC5fdW5pb24oKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy50YXJnZXRlZEFjdGlvbih0Ll90YXJnZXQsIGUpKTtcbiAgICB9LFxuICAgIHBhdXNlR2FtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5idXRsZXIucGF1c2VEaXJlY3RvcigxKTtcbiAgICB9LFxuICAgIHJlc3VtZUdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuYnV0bGVyLnJlc3VtZURpcmVjdG9yKDEpO1xuICAgIH0sXG4gICAgb25Qb3B1cDFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNFbmRlZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZVBhdXNlZCA9ICEwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkFsbENsb3NlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVQYXVzZWQgPSAhMTtcbiAgICB9LFxuICAgIGluaXRIZXJvZXM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdGhpcy5oZXJvZXMgPSBbXTtcbiAgICAgICAgdC5ibG9ja1Jvb3QuYm9hcmRJdGVtc1Jvb3QuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAodCwgaSkge1xuICAgICAgICAgICAgdmFyIG4gPSB0LmdldENvbXBvbmVudChcIkl0ZW1cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOajgOafpeeUqOaIt+aYr+WQpuW3sue7j+WcqOe8lui+keWZqOS4reiuvue9ruS6hmNoYXJhY3RlciBzcGluZVxuICAgICAgICAgICAgLy8g5aaC5p6cbi5zcGluZeW3sue7j+mFjee9ruWlveS6hu+8jOWwseebtOaOpeS9v+eUqOWug++8iOS/neeVmeeUqOaIt+eahOiuvue9ru+8iVxuICAgICAgICAgICAgdmFyIHVzZUV4aXN0aW5nU3BpbmUgPSBuLnNwaW5lICYmIG4uc3BpbmUuc2tlbGV0b25EYXRhICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuLnNwaW5lLnNrZWxldG9uRGF0YS5uYW1lICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuLnNwaW5lLnNrZWxldG9uRGF0YS5uYW1lLmluZGV4T2YoXCJDaGFyYWN0ZXJzXCIpICE9PSAtMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHVzZUV4aXN0aW5nU3BpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyDnlKjmiLflt7Lnu4/lnKjnvJbovpHlmajkuK3phY3nva7kuoZjaGFyYWN0ZXIgc3BpbmXvvIznm7TmjqXkvb/nlKhcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSDkvb/nlKjnvJbovpHlmajphY3nva7nmoRzcGluZe+8jElEOlwiICsgbi5pZCArIFwiLCBza2luOlwiICsgbi5zcGluZS5kZWZhdWx0U2tpbik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZV0g5Y6f5aeLc3BpbmXnirbmgIEgLSBhY3RpdmU6XCIgKyBuLnNwaW5lLm5vZGUuYWN0aXZlICsgXCIsIHNjYWxlOlwiICsgbi5zcGluZS5ub2RlLnNjYWxlICsgXCIsIHNjYWxlWDpcIiArIG4uc3BpbmUubm9kZS5zY2FsZVggKyBcIiwgc2NhbGVZOlwiICsgbi5zcGluZS5ub2RlLnNjYWxlWSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5L+d5a2Yc3BpbmXnmoTljp/lp4vorr7nva7vvIjlnKjnp7vliqjoioLngrnkuYvliY3vvIlcbiAgICAgICAgICAgICAgICB2YXIgc3BpbmVBY3RpdmUgPSBuLnNwaW5lLm5vZGUuYWN0aXZlO1xuICAgICAgICAgICAgICAgIHZhciBzcGluZVNjYWxlID0gbi5zcGluZS5ub2RlLnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBzcGluZVNjYWxlWCA9IG4uc3BpbmUubm9kZS5zY2FsZVg7XG4gICAgICAgICAgICAgICAgdmFyIHNwaW5lU2NhbGVZID0gbi5zcGluZS5ub2RlLnNjYWxlWTtcbiAgICAgICAgICAgICAgICB2YXIgc3BpbmVPcGFjaXR5ID0gbi5zcGluZS5ub2RlLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6cc3BpbmXljp/mnKzlsLHmmK/pmpDol4/miJbnvKnmlL7kuLow77yM6K6+572u5Li66buY6K6k5YC8XG4gICAgICAgICAgICAgICAgaWYgKCFzcGluZUFjdGl2ZSB8fCBzcGluZVNjYWxlID09PSAwIHx8IChzcGluZVNjYWxlWCA9PT0gMCAmJiBzcGluZVNjYWxlWSA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZV0gc3BpbmXljp/mnKzpmpDol4/miJbnvKnmlL7kuLow77yM5L2/55So6buY6K6k6K6+572uXCIpO1xuICAgICAgICAgICAgICAgICAgICBzcGluZUFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNwaW5lU2NhbGUgPSAwLjM7IC8vIOm7mOiupOe8qeaUvlxuICAgICAgICAgICAgICAgICAgICBzcGluZVNjYWxlWCA9IDAuMztcbiAgICAgICAgICAgICAgICAgICAgc3BpbmVTY2FsZVkgPSAwLjM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWIm+W7ukhlcm/oioLngrlcbiAgICAgICAgICAgICAgICB2YXIgaGVyb05vZGUgPSBuZXcgY2MuTm9kZShcImhlcm9cIiArIG4uaWQpO1xuICAgICAgICAgICAgICAgIC8vIOOAkOS/ruWkjeOAkeS9v+eUqEl0ZW3oioLngrnnmoTkvY3nva7kvZzkuLpIZXJv6IqC54K55L2N572u77yM6ICM5LiN5pivc3BpbmXnmoQoMCwwKeeCuVxuICAgICAgICAgICAgICAgIC8vIOi/meagt0hlcm/oioLngrnkvJrlnKjmoLzlrZDkuK3lpK7vvIxzcGluZeWcqEhlcm/oioLngrnkuIvmlrnlgY/np7tcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wb3NpdGlvbiA9IGUub2Jqc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIobi5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS5wYXJlbnQgPSBlLm9ianNSb290O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIEhlcm/oioLngrnkvY3nva7vvIjln7rkuo5JdGVt6IqC54K577yJLSBJRDpcIiArIG4uaWQgKyBcIiwgeDpcIiArIGhlcm9Ob2RlLnBvc2l0aW9uLngudG9GaXhlZCgxKSArIFwiLCB5OlwiICsgaGVyb05vZGUucG9zaXRpb24ueS50b0ZpeGVkKDEpKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmt7vliqBIZXJv57uE5Lu2XG4gICAgICAgICAgICAgICAgdmFyIGhlcm9Db21wb25lbnQgPSBoZXJvTm9kZS5hZGRDb21wb25lbnQoXCJIZXJvXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOOAkOWFs+mUruOAkeWcqOenu+WKqHNwaW5l5LmL5YmN77yM5L+d5a2Y5a6D5ZyoSXRlbeiKgueCueS4i+eahOS9jee9rlxuICAgICAgICAgICAgICAgIC8vIOi/meS4quS9jee9ruWwhueUqOS6juS4gOazoue7k+adn+WQjuaBouWkjXNwaW5lXG4gICAgICAgICAgICAgICAgbi5zcGluZUluaXRpYWxQb3MgPSBuLnNwaW5lLm5vZGUucG9zaXRpb24uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSDkv53lrZhzcGluZeWcqEl0ZW3oioLngrnkuIvnmoTliJ3lp4vkvY3nva4gLSBJRDpcIiArIG4uaWQgKyBcIiwgeDpcIiArIG4uc3BpbmVJbml0aWFsUG9zLnggKyBcIiwgeTpcIiArIG4uc3BpbmVJbml0aWFsUG9zLnkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWwhnNwaW5l6IqC54K556e75Yqo5YiwaGVyb+iKgueCueS4i1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5yZW1vdmVGcm9tUGFyZW50KGZhbHNlKTtcbiAgICAgICAgICAgICAgICBuLnNwaW5lLm5vZGUucGFyZW50ID0gaGVyb05vZGU7XG4gICAgICAgICAgICAgICAgLy8g44CQ5L+u5aSN44CR5L+d5oyBc3BpbmXnm7jlr7nkuo5JdGVt55qE5YGP56e76YeP77yM6L+Z5qC3c3BpbmXlnKhIZXJv6IqC54K55LiL55qE5L2N572u5q2j56GuXG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLnBvc2l0aW9uID0gbi5zcGluZUluaXRpYWxQb3MuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBzcGluZeWcqEhlcm/oioLngrnkuIvnmoTkvY3nva4gLSBJRDpcIiArIG4uaWQgKyBcIiwgeDpcIiArIG4uc3BpbmUubm9kZS5wb3NpdGlvbi54ICsgXCIsIHk6XCIgKyBuLnNwaW5lLm5vZGUucG9zaXRpb24ueSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5oGi5aSN5oiW6K6+572uc3BpbmXoioLngrnlsZ7mgKfvvIznoa7kv53lj6/op4FcbiAgICAgICAgICAgICAgICBuLnNwaW5lLm5vZGUuYWN0aXZlID0gc3BpbmVBY3RpdmU7XG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLm9wYWNpdHkgPSBzcGluZU9wYWNpdHkgPiAwID8gc3BpbmVPcGFjaXR5IDogMjU1O1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5zY2FsZSA9IHNwaW5lU2NhbGU7XG4gICAgICAgICAgICAgICAgbi5zcGluZS5ub2RlLnNjYWxlWCA9IHNwaW5lU2NhbGVYO1xuICAgICAgICAgICAgICAgIG4uc3BpbmUubm9kZS5zY2FsZVkgPSBzcGluZVNjYWxlWTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDlvLrliLborr7nva5zcGluZeWKqOeUu++8jOehruS/nea4suafk1xuICAgICAgICAgICAgICAgIGlmIChuLnNwaW5lLmRlZmF1bHRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbi5zcGluZS5zZXRBbmltYXRpb24oMCwgbi5zcGluZS5kZWZhdWx0QW5pbWF0aW9uLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuLnNwaW5lLnNldEFuaW1hdGlvbigwLCBcIklkbGVcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOiuvue9rmhlcm/oioLngrnnmoR6SW5kZXjvvIznoa7kv53mraPnoa7mmL7npLpcbiAgICAgICAgICAgICAgICBoZXJvTm9kZS56SW5kZXggPSAtaGVyb05vZGUueTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBzcGluZeiuvue9ruWQjiAtIGFjdGl2ZTpcIiArIG4uc3BpbmUubm9kZS5hY3RpdmUgKyBcIiwgc2NhbGU6XCIgKyBuLnNwaW5lLm5vZGUuc2NhbGUgKyBcIiwgc2NhbGVYOlwiICsgbi5zcGluZS5ub2RlLnNjYWxlWCArIFwiLCBzY2FsZVk6XCIgKyBuLnNwaW5lLm5vZGUuc2NhbGVZKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJZIZXJv57uE5Lu277yM5L2/55So5bey6YWN572u55qEc3BpbmVcbiAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LmluaXRCeShlLCBuLCB7XG4gICAgICAgICAgICAgICAgICAgIGpzb246IG4uanNvbixcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBuLmlkLFxuICAgICAgICAgICAgICAgICAgICBsdjE6IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKG4uaWQpLmx2IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgbWF4THY6IDBcbiAgICAgICAgICAgICAgICB9LCBuLnNwaW5lKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoZXJvQ29tcG9uZW50LnBvc2l0aW9uMiA9IGhlcm9Ob2RlLnBvc2l0aW9uLmFkZChuLmF0dE9mZnNldCk7XG4gICAgICAgICAgICAgICAgbi5oZXJvID0gaGVyb0NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBuLmluaXRIZXJvTm9kZXMoKTtcbiAgICAgICAgICAgICAgICBlLmhlcm9lcy5wdXNoKGhlcm9Db21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGUudXBkYXRlSHAoITEpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIEhlcm/oioLngrnliJvlu7rlrozmiJDvvIzkvY3nva46XCIgKyBoZXJvTm9kZS5wb3NpdGlvbiArIFwiLCBoZXJvWkluZGV4OlwiICsgaGVyb05vZGUuekluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBIZXJv54i26IqC54K5OlwiICsgaGVyb05vZGUucGFyZW50Lm5hbWUgKyBcIiwgc3BpbmXniLboioLngrk6XCIgKyBuLnNwaW5lLm5vZGUucGFyZW50Lm5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOacgOe7iHNwaW5l54q25oCBIC0gYWN0aXZlOlwiICsgbi5zcGluZS5ub2RlLmFjdGl2ZSArIFwiLCBzY2FsZTpcIiArIG4uc3BpbmUubm9kZS5zY2FsZSArIFwiLCBvcGFjaXR5OlwiICsgbi5zcGluZS5ub2RlLm9wYWNpdHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDnlKjmiLfmsqHmnInphY3nva5zcGluZe+8jOWKqOaAgeWIm+W7uu+8iOWbnumAgOmAu+i+ke+8iVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOWKqOaAgeWIm+W7unNwaW5l77yMSUQ6XCIgKyBuLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pIZXJv6IqC54K5XG4gICAgICAgICAgICAgICAgdmFyIGhlcm9Ob2RlID0gbmV3IGNjLk5vZGUoXCJoZXJvXCIgKyBuLmlkKTtcbiAgICAgICAgICAgICAgICAvLyDjgJDkv67lpI3jgJHkvb/nlKhJdGVt6IqC54K555qE5L2N572u5L2c5Li6SGVyb+iKgueCueS9jee9rlxuICAgICAgICAgICAgICAgIGhlcm9Ob2RlLnBvc2l0aW9uID0gZS5vYmpzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihuLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTykpO1xuICAgICAgICAgICAgICAgIGhlcm9Ob2RlLnBhcmVudCA9IGUub2Jqc1Jvb3Q7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZV0gSGVyb+iKgueCueS9jee9ru+8iOWfuuS6jkl0ZW3oioLngrnvvIktIElEOlwiICsgbi5pZCArIFwiLCB4OlwiICsgaGVyb05vZGUucG9zaXRpb24ueC50b0ZpeGVkKDEpICsgXCIsIHk6XCIgKyBoZXJvTm9kZS5wb3NpdGlvbi55LnRvRml4ZWQoMSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOa3u+WKoEhlcm/nu4Tku7ZcbiAgICAgICAgICAgICAgICB2YXIgaGVyb0NvbXBvbmVudCA9IGhlcm9Ob2RlLmFkZENvbXBvbmVudChcIkhlcm9cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5Yqg6L29Y2hhcmFjdGVy6KeS6Imy6LWE5rqQXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlclNraW5OYW1lID0gXCJDaGFyYWN0ZXJcIiArIChuLmlkIDwgMTAgPyBcIjBcIiArIG4uaWQgOiBuLmlkKTtcbiAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMudXNlQnVuZGxlQXNzZXQoXCJhY3RvcnNcIiwgXCJjaGFyYWN0ZXIvQ2hhcmFjdGVyc1wiLCBzcC5Ta2VsZXRvbkRhdGEsIGZ1bmN0aW9uIChjaGFyYWN0ZXJTcGluZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g44CQ5YWz6ZSu44CR5L+d5a2Yc3BpbmXnmoTliJ3lp4vkvY3nva7vvIjlr7nkuo7liqjmgIHliJvlu7rnmoRzcGluZe+8jOWIneWni+S9jee9ruaYrygwLDAp77yJXG4gICAgICAgICAgICAgICAgICAgIG4uc3BpbmVJbml0aWFsUG9zID0gY2MudjIoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIOWKqOaAgeWIm+W7unNwaW5l77yM5Yid5aeL5L2N572uOlwiLCBuLnNwaW5lSW5pdGlhbFBvcyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7pjaGFyYWN0ZXLnmoRzcGluZeiKgueCuVxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hhcmFjdGVyU3BpbmVOb2RlID0gbmV3IGNjLk5vZGUoXCJjaGFyYWN0ZXJTcGluZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmVOb2RlLnBhcmVudCA9IGhlcm9Ob2RlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hhcmFjdGVyU3BpbmUgPSBjaGFyYWN0ZXJTcGluZU5vZGUuYWRkQ29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUuc2tlbGV0b25EYXRhID0gY2hhcmFjdGVyU3BpbmVEYXRhO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZS5kZWZhdWx0U2tpbiA9IGNoYXJhY3RlclNraW5OYW1lO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZS5zZXRTa2luKGNoYXJhY3RlclNraW5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUuZGVmYXVsdEFuaW1hdGlvbiA9IFwiSWRsZVwiO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZS5wcmVtdWx0aXBsaWVkQWxwaGEgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyU3BpbmUudXNlVGludCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lLmVuYWJsZUJhdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIOehruS/nXNwaW5l6IqC54K55Y+v6KeBXG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlclNwaW5lTm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJTcGluZU5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuvue9rmhlcm/oioLngrnnmoR6SW5kZXjvvIznoa7kv53mraPnoa7mmL7npLpcbiAgICAgICAgICAgICAgICAgICAgaGVyb05vZGUuekluZGV4ID0gLWhlcm9Ob2RlLnk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJZIZXJv57uE5Lu2XG4gICAgICAgICAgICAgICAgICAgIGhlcm9Db21wb25lbnQuaW5pdEJ5KGUsIG4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IG4uanNvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG4uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBsdjE6IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKG4uaWQpLmx2IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEx2OiAwXG4gICAgICAgICAgICAgICAgICAgIH0sIGNoYXJhY3RlclNwaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGhlcm9Db21wb25lbnQucG9zaXRpb24yID0gaGVyb05vZGUucG9zaXRpb24uYWRkKG4uYXR0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgbi5oZXJvID0gaGVyb0NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgbi5pbml0SGVyb05vZGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIGUuaGVyb2VzLnB1c2goaGVyb0NvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGUudXBkYXRlSHAoITEpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZV0gSGVyb+WIneWni+WMluWujOaIkO+8jElEOlwiICsgbi5pZCArIFwiLCBza2luOlwiICsgY2hhcmFjdGVyU2tpbk5hbWUgKyBcIiwg5L2N572uOlwiICsgaGVyb05vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGhhc0hlcm86IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlcm9lcy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5pbmZvLmlkID09IHQgJiYgZS5ocCA+IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZW1pdEVuZW15czogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB2YXIgaSA9IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlICsgMTtcbiAgICAgICAgaWYgKDIgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMud2F2ZVBsdXNIcCA9IDA7XG4gICAgICAgICAgICB0aGlzLndhdmVQbHVzQXRrID0gMDtcbiAgICAgICAgICAgIGlmIChpID4gMTApIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhdmVQbHVzSHAgPSAoaSAtIDEwKSAqIHRoaXMubGV2ZWxEYXRhLmhwd2F2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLndhdmVQbHVzQXRrID0gKGkgLSAxMCkgKiB0aGlzLmxldmVsRGF0YS5hdGt3YXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPiAxOCkge1xuICAgICAgICAgICAgICAgIGkgPSAoKGkgLSAxOSkgJSA1KSArIDE0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5lbXlDb3VudCA9IDA7XG4gICAgICAgIHQuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC53YXZlID09IGk7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBpID0gZS50ICsgdC50aW1lO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0LkVuZW15TnVtOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IDFlMyAqIChpICsgbiAqIHQuU3BhY2UpO1xuICAgICAgICAgICAgICAgIGUuaW5zZXJ0RnJhbWVBY3Rpb24obywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBlLmV4ZWN1dGVFdmVudDIodCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLmVuZW15Q291bnQgKz0gdC5FbmVteU51bTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZnJhbWVBY3Rpb25zLnNvcnQoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0Lm1zIC0gZS5tcztcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleGVjdXRlRXZlbnQyOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGNjLnB2ei51dGlscy51c2VCdW5kbGVBc3NldChcImFjdG9yc1wiLCBcIlpvbWJpZS9FbmVteVwiICsgdC5FbmVteUlkLCBjYy5QcmVmYWIsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlLmV4ZWN1dGVFdmVudE5ld0VuZW15KGksIHQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGV4ZWN1dGVFdmVudE5ld0VuZW15OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IGNjLmluc3RhbnRpYXRlKHQpO1xuICAgICAgICB2YXIgbiA9IGNjLm1hdGgucmFuZG9tUmFuZ2UodGhpcy5ncm91bmRBcmVhTEIueSwgdGhpcy5ncm91bmRBcmVhVFIueSk7XG4gICAgICAgIHZhciBvID0gZS5ocDtcbiAgICAgICAgdmFyIHMgPSBlLmF0aztcbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjIpIHtcbiAgICAgICAgICAgIGNhc2UgMTAxOlxuICAgICAgICAgICAgY2FzZSAxMDI6XG4gICAgICAgICAgICBjYXNlIDEwMzpcbiAgICAgICAgICAgICAgICBvICo9IFsxLjMsIDEuNCwgMS41XVtjYy5wdnoucnVudGltZURhdGEuYWN0QnVmZjIgLSAxMDFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDc6XG4gICAgICAgICAgICBjYXNlIDEwODpcbiAgICAgICAgICAgIGNhc2UgMTA5OlxuICAgICAgICAgICAgICAgIHMgKj0gWzEuMywgMS40LCAxLjVdW2NjLnB2ei5ydW50aW1lRGF0YS5hY3RCdWZmMiAtIDEwN107XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG8gKj0gdGhpcy5sZXZlbERhdGEuaHBhZGQgLyAxMDA7XG4gICAgICAgICAgICAgICAgcyAqPSB0aGlzLmxldmVsRGF0YS5hdGthZGQgLyAxMDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgbyAqPSAxICsgKGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKSAtIDkpICogdGhpcy5sZXZlbERhdGEuaHBhZGQ7XG4gICAgICAgICAgICAgICAgcyAqPSAxICsgKGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKSAtIDkpICogdGhpcy5sZXZlbERhdGEuYXRrYWRkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIG8gKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA1KSAqIHRoaXMubGV2ZWxEYXRhLmhwYWRkICsgdGhpcy53YXZlUGx1c0hwO1xuICAgICAgICAgICAgICAgIHMgKj0gMSArIChjYy5wdnouUGxheWVyRGF0YS5nZXRTdGFnZUxldmVsKCkgLSA1KSAqIHRoaXMubGV2ZWxEYXRhLmF0a2FkZCArIHRoaXMud2F2ZVBsdXNBdGs7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGMgPSB0aGlzLmFkZEVuZW15SW4oZS5FbmVteUlkLCBpLCAzNjAsIG4sIG8sIHMpO1xuICAgICAgICBpZiAoMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgYy5leHAgPSAwLjYgKiBjLmV4cDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYWRkRW5lbXlJbjogZnVuY3Rpb24gKHQsIGUsIGksIG4sIG8sIHMpIHtcbiAgICAgICAgZS5wYXJlbnQgPSB0aGlzLm9ianNSb290O1xuICAgICAgICBlLnggPSBpO1xuICAgICAgICBlLnkgPSBuO1xuICAgICAgICB2YXIgYyA9IGUuZ2V0Q29tcG9uZW50KFwiRW5lbXlcIik7XG4gICAgICAgIGMuaW5pdEJ5KHRoaXMsIHRoaXMuYnVsbGV0c1Jvb3QsIG8sIHMpO1xuICAgICAgICBjLmlkID0gdDtcbiAgICAgICAgYy5zaG93SHBCYXIgPSB0ID4gMTAwO1xuICAgICAgICB0aGlzLmFkZEVuZW15KGMpO1xuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuICAgIGFkZEVuZW15OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmVuZW15cy5wdXNoKHQpO1xuICAgIH0sXG4gICAgZGVsRW5lbXk6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbmVteXMuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZSA9PSB0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKC0xICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMuZW5lbXlzLnNwbGljZShlLCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0Lm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5lbmVteUNvdW50LS07XG4gICAgICAgIGlmICh0LmlkID4gMTAwKSB7XG4gICAgICAgICAgICB0aGlzLnRhc2tFbmVteUNvdW50MSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDIrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCF0aGlzLmlzTGFzdFdhdmUgfHwgdGhpcy5lbmVteUNvdW50ID4gMCkgJiYgdC5leHAgPiAwKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHQuZXhwO1xuICAgICAgICAgICAgdmFyIG4gPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDExKTtcbiAgICAgICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgICAgIGkgPSBNYXRoLnJvdW5kKGkgKiAoMSArIDAuMDEgKiBuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZXhwICs9IGk7XG4gICAgICAgICAgICB2YXIgbyA9IHRoaXMuaHViLmx2dXBKc29uRmlsZS5qc29uW2NjLnB2ei5ydW50aW1lRGF0YS5sdl0uZXhwO1xuICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5leHAgPj0gbykge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5leHAgLT0gbztcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEubHYrKztcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3BsYXllcmxldmVsdXBcIik7XG4gICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJCdWZmVUlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJVSUdhbWVCdWZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0lzU3VjYygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5odWIudXBkYXRlRXhwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSXNTdWNjKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEVuZW15SHBCYXI6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICghdC5ocEJhcikge1xuICAgICAgICAgICAgdmFyIGUgPSAodC5zaG93SHBCYXIgPyB0aGlzLmVCb3NzSHBQcmVmYWIgOiB0aGlzLmVIcFByZWZhYikuYWRkTm9kZSh0Lm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgY2MuZmluZChcIm5vZGVcIiwgZSkucG9zaXRpb24gPSB0LmhwQmFyUG9zO1xuICAgICAgICAgICAgdC5ocEJhciA9IGUuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tJc1N1Y2M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuaGFzRW5kZWQgJiYgMCA9PSB0aGlzLmVuZW15Q291bnQpIHtcbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS53YXZlKys7XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrRW5lbXlDb3VudDEgPiAwKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkTWlzc2lvblByb2dyZXNzKFxuICAgICAgICAgICAgICAgICAgICBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWHu+i0pemmlumihm7kuKpcIl0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFza0VuZW15Q291bnQxXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnRhc2tFbmVteUNvdW50MiA+IDApIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRNaXNzaW9uUHJvZ3Jlc3MoXG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi5Ye76LSl5YO15bC4buS4qlwiXSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXNrRW5lbXlDb3VudDJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFkZE1vbmV5KDEwICsgY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSg1KSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RXYXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N1Y2MgPSAhMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0VuZGVkID0gITA7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2luXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lRW5kXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdEFzeW5jKFwiZ2FtZVwiLCBcInNvdW5kL3dpblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlRW5kQW5pU3BpbmUubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMubW9uZXlJY29uTm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHRoaXMud2F2ZUVuZEFuaVNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoZSk7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSB0aGlzLndhdmVFbmRBbmlTcGluZS5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgIG4ueCA9IGkueDtcbiAgICAgICAgICAgICAgICBuLnkgPSBpLnk7XG4gICAgICAgICAgICAgICAgdGhpcy53YXZlRW5kQW5pU3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hdXRvVGltZXMrKztcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmx2MkNvdW50ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdC5odWIuYmFja1RvQmFnKCk7XG4gICAgICAgICAgICAgICAgICAgIHQud2F2ZUVuZEFuaVNwaW5lLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgICAgIHQud2F2ZUVuZEFuaVNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoMCA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrRW5kTGV2ZWwoY2MucHZ6LnJ1bnRpbWVEYXRhLmxldmVsLCBjYy5wdnoucnVudGltZURhdGEud2F2ZSAtIDEsICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hvb3NlRW5lbXk6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IHRoaXMuZW5lbXlzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG47XG4gICAgICAgIGlmICh0aGlzLmlzQW5nZXJQcmVzc2VkKSB7XG4gICAgICAgICAgICBuID0gMWU2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbiA9IGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBudWxsO1xuICAgICAgICBpLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpID0gZS5ub2RlLnBvc2l0aW9uLnN1Yih0Lm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpO1xuICAgICAgICAgICAgaWYgKGkgPCBuKSB7XG4gICAgICAgICAgICAgICAgbiA9IGk7XG4gICAgICAgICAgICAgICAgbyA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9LFxuICAgIGNob29zZUVuZW15czogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5oYXNFbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSB0aGlzLmVuZW15cy5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiAoaS5ocCA+IDAgJiYgbi5pc0FuZ2VyUHJlc3NlZCkgfHwgaS5ub2RlLnBvc2l0aW9uLnN1Yih0Lm5vZGUucG9zaXRpb24pLmxlbmd0aFNxcigpIDwgZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpID49IG8ubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGk7IGMrKykge1xuICAgICAgICAgICAgdmFyIGEgPSBjYy5tYXRoLnJhbmRvbVJhbmdlSW50KDAsIG8ubGVuZ3RoKTtcbiAgICAgICAgICAgIHMucHVzaChvLnNwbGljZShhLCAxKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfSxcbiAgICBjaG9vc2VFbmVteUJ5QnVsbGV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IHRoaXMuZW5lbXlzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuaHAgPiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRbY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCB0Lmxlbmd0aCldO1xuICAgIH0sXG4gICAgY2hvb3NlSGVybzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gdGhpcy5oZXJvZXMuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5ocCA+IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaSA9IDE2MDA7XG4gICAgICAgIHZhciBuID0gZVswXTtcbiAgICAgICAgZm9yICh2YXIgbyA9IDA7IG8gPCBlLmxlbmd0aDsgbysrKSB7XG4gICAgICAgICAgICB2YXIgcztcbiAgICAgICAgICAgIGlmIChlW29dLnBvc2l0aW9uMikge1xuICAgICAgICAgICAgICAgIHMgPSBlW29dLnBvc2l0aW9uMi54O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzID0gZVtvXS5ub2RlLng7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYyA9IE1hdGguYWJzKHMgLSB0LngpO1xuICAgICAgICAgICAgaWYgKGMgPCBpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGM7XG4gICAgICAgICAgICAgICAgbiA9IGVbb107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfSxcbiAgICBjaG9vc2VNaW5IcEhlcm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSAxO1xuICAgICAgICB2YXIgZSA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oZXJvZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm9lc1tpXS5ocCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IHRoaXMuaGVyb2VzW2ldLmhwIC8gdGhpcy5oZXJvZXNbaV0uaXRlbS5tYXhIcDtcbiAgICAgICAgICAgICAgICBpZiAobiA8IHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdCA9IG47XG4gICAgICAgICAgICAgICAgICAgIGUgPSB0aGlzLmhlcm9lc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBnZXRIZXJvZXNNYXhNYXJnaW5YOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlcm9lc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0LmhwID4gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHQsIGUubm9kZS54ICsgZS5pdGVtLnJpZ2hNYXJnaW4pO1xuICAgICAgICAgICAgfSwgLTM2MCk7XG4gICAgfSxcbiAgICBjaGVja0lzRmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaGVyb2VzLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXQuaGFzRGllO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc1N1Y2MgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuaGFzRW5kZWQgPSAhMDtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZmFpbFwiKTtcbiAgICAgICAgICAgIGlmICgyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZExvZ2ljKDEpLFxuICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhbmtcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmFua3dpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVSVJhbmtFbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuaGFzUmVib3JuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYygxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lRW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAwID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LlRBVXRpbHMudHJhY2tFbmRMZXZlbChjYy5wdnoucnVudGltZURhdGEubGV2ZWwsIGNjLnB2ei5ydW50aW1lRGF0YS53YXZlLCAhMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZ1aHVvVUlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlHYW1lUmVib3JuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYWRkTW9uZXkoMzApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYW5nZXIgPSAxZTM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNSZWJvcm4gPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmF1dG9UaW1lcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEubHYyQ291bnQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2luXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZUVuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93RW5lbXlIdXJ0TnVtOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9ICgxID09IHQgPyB0aGlzLmVIdXJ0Q3JpdE51bSA6IHRoaXMuZUh1cnROdW0pLmFkZE5vZGUoZSk7XG4gICAgICAgIG4ueCArPSBjYy5tYXRoLnJhbmRvbVJhbmdlKC00MCwgNDApO1xuICAgICAgICBuLnkgKz0gNTAgKyBjYy5tYXRoLnJhbmRvbVJhbmdlKC0xMCwgNDApO1xuICAgICAgICBjYy5maW5kKFwibnVtXCIsIG4pLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCItXCIgKyBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGkpKTtcbiAgICAgICAgbi5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KCk7XG4gICAgICAgIG4uZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikub24oXCJmaW5pc2hlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2hvd0pzRWZmZWN0OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoMTIgIT0gZSkge1xuICAgICAgICAgICAgdGhpcy5lSGl0UHJlZmFiXG4gICAgICAgICAgICAgICAgLmFkZE5vZGUodClcbiAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKVxuICAgICAgICAgICAgICAgIC5zZXRBbmltYXRpb24oMCwgXCJ6ZFwiICsgZSArIFwiX2hpdFwiICsgY2MubWF0aC5yYW5kb21SYW5nZUludCgxLCA0KSwgITEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZUhpdEdyb3VuZFByZWZhYlxuICAgICAgICAgICAgLmFkZE5vZGUodClcbiAgICAgICAgICAgIC5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pXG4gICAgICAgICAgICAuc2V0QW5pbWF0aW9uKDAsIFwiemRcIiArIGUgKyBcIl9qc1wiICsgY2MubWF0aC5yYW5kb21SYW5nZUludCgxLCA0KSwgITEpO1xuICAgIH0sXG4gICAgc2hvd0hlcm9IdXJ0TnVtOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXMucEh1cnROdW0uYWRkTm9kZSh0KTtcbiAgICAgICAgaS54ICs9IGNjLm1hdGgucmFuZG9tUmFuZ2UoLTQwLCA0MCk7XG4gICAgICAgIGkueSArPSBjYy5tYXRoLnJhbmRvbVJhbmdlKDEwLCA3MCk7XG4gICAgICAgIGNjLmZpbmQoXCJudW1cIiwgaSkuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIi1cIiArIE1hdGguZmxvb3IoZSk7XG4gICAgICAgIGkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpO1xuICAgICAgICBpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9uKFwiZmluaXNoZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTcGVlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLm9wZW5TcGVlZCkge1xuICAgICAgICAgICAgaWYgKDEgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3BlZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICBcIjJzcGVlZFVJXCIsXG4gICAgICAgICAgICAgICAgXCJVSVNwZWVkXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVNwZWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0U3BlZWRMb2dpYyhjYy5wdnoucnVudGltZURhdGEuc3BlZWQpO1xuICAgIH0sXG4gICAgc2V0U3BlZWRMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgc3AudGltZVNjYWxlID0gdDtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2V0VGltZVNjYWxlKHQpO1xuICAgIH0sXG4gICAgb25DbGlja1N0YXRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhdHNTaG93bikge1xuICAgICAgICAgICAgdGhpcy5oaWRlU3RhdHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHNQYW5lbC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGF0c1Nob3duID0gITA7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRzKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRzUGFuZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTm9ybWFsO1xuICAgICAgICAgICAgdGhpcy5zdGF0c1BhbmVsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLm9mZihcImZpbmlzaGVkXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhdHNTaG93bikge1xuICAgICAgICAgICAgdmFyIGUgPSBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zdGF0cy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQgKyBlO1xuICAgICAgICAgICAgICAgIH0sIDApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5oZXJvZXNcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2MucHZ6LnJ1bnRpbWVEYXRhLnN0YXRzW2UuaW5mby5pZF0gLSBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbdC5pbmZvLmlkXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpLnpkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHQuc3RhdHNJdGVtUHJlZmFiLnJvb3QuY2hpbGRyZW4uZmluZChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Ll9faWQgPT0gaS5pbmZvLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvID0gdC5zdGF0c0l0ZW1QcmVmYWIuYWRkTm9kZSgpKS5fX2lkID0gaS5pbmZvLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgby56SW5kZXggPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBjYy5wdnoucnVudGltZURhdGEuc3RhdHNbaS5pbmZvLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gaS5pbmZvLmpzb247XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcInF1YWxpdHlcIiwgbykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1aUltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtL3B6X1wiICsgYy5xdWFsaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBjYy5maW5kKFwiaWNvblwiLCBvKS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5za2VsZXRvbkRhdGEgPSBpLnNwaW5lLnNrZWxldG9uRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwibmFtZVwiLCBvKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGMubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcyAvIGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwibnVtMlwiLCBvKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICgxMDAgKiByKS50b0ZpeGVkKDIpICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiYmFyXCIsIG8pLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0JhcikucHJvZ3Jlc3MgPSByO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhpZGVTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXNTdGF0c1Nob3duID0gITE7XG4gICAgICAgIHRoaXMuc3RhdHNQYW5lbC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KCkud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5SZXZlcnNlO1xuICAgICAgICB0aGlzLnN0YXRzUGFuZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikub25jZShcImZpbmlzaGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHQuc3RhdHNQYW5lbC5hY3RpdmUgPSAhMTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7Il19