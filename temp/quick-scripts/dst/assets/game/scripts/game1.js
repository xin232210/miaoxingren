
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/game1.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '487ddT1mbRK4quxyYqSXMJE', 'game1');
// game/scripts/game1.js

"use strict";

var $blockRoot = require("./BlockRoot");

var $itemRoot = require("./ItemRoot");

var $prefabInfo = require("../../scripts/PrefabInfo");

var s = [3, 6, 8, 10];
var c = [1, 2, 4, 5, 7, 9, 11, 12];
cc.Class({
  "extends": cc.Component,
  properties: {
    adBlockBtnNode: cc.Node,
    adBlockCountLabel: cc.Label,
    refreshFree: cc.Node,
    refreshCoin: cc.Node,
    refreshCoinLabel: cc.Label,
    refreshLv2Node: cc.Node,
    blockRoot: $blockRoot,
    itemRoot: $itemRoot,
    itemPrefabs: [cc.Node],
    item3Preabs: [cc.Node],
    blockPrefabs: [cc.Node],
    adSupPrefab: $prefabInfo,
    setBtnNode: cc.Node,
    lv5btnNode: cc.Node,
    bagBottomUIRoot: cc.Node,
    startBtnNode: cc.Node,
    refreshBtnNode: cc.Node,
    placeBtnNode: cc.Node,
    stashNode: cc.Node,
    hpBar: cc.ProgressBar,
    hpLabel: cc.Label,
    heroJsonFile: cc.JsonAsset,
    buffJsonFile: cc.JsonAsset,
    moneyIconNode: cc.Node,
    bgMusic: cc.AudioClip,
    fingerSpine: sp.Skeleton
  },
  onLoad: function onLoad() {
    this.itemPrefabs.forEach(function (t) {
      return t.active = !1;
    });
    this.blockPrefabs.forEach(function (t) {
      return t.active = !1;
    });
    this.fingerSpine.node.active = !1;
  },
  start: function start() {
    var t = this;
    this.adBlockBtnNode.active = cc.pvz.runtimeData.adBlockCount > 0;
    this.items = [];
    this.attItems = [];
    this.itemPrefabs.forEach(function (e, i) {
      var n = i + 1;

      if (cc.pvz.PlayerData.getToolData(n).pos >= 0) {
        t.items.push(n);

        if (c.some(function (t) {
          return t == n;
        })) {
          t.attItems.push(n);
        }
      }
    });
    cc.pvz.runtimeData.loadJsonData(this.buffJsonFile.json);
    this.blockRoot.scene = this;
    this.itemRoot.scene = this;
    this.logicEveryWave();
    this.refreshLv2Node.active = cc.pvz.runtimeData.lv2Count > 0;

    if (this.refreshLv2Node.active) {
      cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新2级"]);
    }

    this.blockRoot.startLogic();
    this.updateHp();
    this.itemRoot.node.removeAllChildren();

    if (cc.pvz.runtimeData.autoTimes > 0) {
      this.doRefreshLogic(!0);
      cc.pvz.runtimeData.autoTimes--;
      this.saveRuntimeData();
    } else {
      cc.pvz.runtimeData.bagItems.forEach(function (e) {
        if (0 == e.id) {
          var i = t.blockPrefabs[e.id0Type];
          var n = t.addItemByPrefab(i, -1, null);

          if (n.hasAd && !e.hasAd) {
            n.unlockAd();
          }
        } else {
          var o = t.newEquipItem(e.lv, e.id, null);

          if (e.hasAd) {
            o.lockByAd(t.adSupPrefab);
          }
        }
      });
      this.itemRoot.layoutChildren();
    }

    this.blockRoot.resetBlocksPreview();
    this.updateMoney();
    cc.butler.node.on("money", this.updateMoney, this);

    if (1 == cc.pvz.PlayerData.getStageLevel()) {
      this.setBtnNode.active = !1;
      this.blockRoot.stashEnable = !1;

      if (0 == cc.pvz.runtimeData.guide) {
        if (cc.pvz.runtimeData.showGame1st) {
          this.bagBottomUIRoot.active = !1, cc.guideManager.showGuide(0, [{
            hideFinger: !0,
            tip: "【背包】能强化上阵植物的能力。"
          }, {
            hideFinger: !0,
            tip: "将刷新出的【工具】全部放入背包中强化植物!"
          }], function (e) {
            if (e) {
              t.bagBottomUIRoot.active = !0;
              t.startBtnNode.active = !1;
              t.refreshBtnNode.active = !1;
              t.refreshLv2Node.active = !1;
              cc.pvz.runtimeData.guide = 3;
              t.updateMoveFinger();
            }
          }), this.adBlockBtnNode.active = !1;
        } else {
          this.bagBottomUIRoot.active = !1, cc.guideManager.showGuide(0, [{
            hideFinger: !0,
            tip: "欢迎来到卡皮巴拉的世界！"
          }, {
            hideFinger: !0,
            tip: "将刷新出的卡皮巴拉放入游乐场！"
          }], function (e) {
            if (e) {
              cc.pvz.runtimeData.guide = 1;
              t.updateMoveFinger();
            }
          }), this.adBlockBtnNode.active = !1;
        }
      }
    }

    if (this.adBlockBtnNode.active) {
      this.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
      cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
    }
  },
  logicEveryWave: function logicEveryWave() {
    cc.butler.playMusic(this.bgMusic);
    var t = cc.pvz.runtimeData.getBuffValue(13);

    if (t > 0) {
      this.refreshCost = Math.round(15 * (1 - 0.01 * t));
    } else {
      this.refreshCost = 15;
    }

    this.updateRefreshBtns();
  },
  updateRuntimeData: function updateRuntimeData() {
    var t = this;
    cc.pvz.runtimeData.blocks = [];
    this.blockRoot.datas.forEach(function (t, e) {
      if (-1 != t) {
        cc.pvz.runtimeData.blocks.push(e);
      }
    });
    this.blockRoot.boardItemsRoot.children.forEach(function (t) {
      t.getComponent("Item").near10 = !1;
    });
    this.blockRoot.boardItemsRoot.children.forEach(function (e) {
      var i = e.getComponent("Item");

      if (10 == i.id) {
        var n = i.myBlocks[0].i;
        t.blockRoot.getCrossItems(i.id, n, function (t) {
          t.near10 = !0;
        });
      }
    });
    cc.pvz.runtimeData.items = [];
    this.blockRoot.boardItemsRoot.children.forEach(function (t, e) {
      var i = t.getComponent("Item");
      cc.pvz.runtimeData.items.push({
        id: i.id,
        lv: i.lv,
        bs: i.myBlocks.map(function (t) {
          return t.i;
        })
      });
      i.index = e;
    });
    cc.pvz.runtimeData.bagItems = [];

    var e = function e(t) {
      cc.pvz.runtimeData.bagItems.push({
        id: t.id,
        lv: t.lv,
        hasAd: t.hasAd && !t.canUse,
        id0Type: t.id0Type
      });
    };

    this.itemRoot.node.children.forEach(function (t) {
      var i = t.getComponent("Item");
      e(i);
    });
    this.itemRoot.dragingRoot.children.forEach(function (t) {
      var i = t.getComponent("Item");
      e(i);
    });
  },
  saveRuntimeData: function saveRuntimeData() {
    this.updateRuntimeData();
    cc.pvz.runtimeData.saveData();
  },
  updateMoveFinger: function updateMoveFinger(t) {
    if (void 0 === t) {
      t = !1;
    }

    if (0 != this.itemRoot.node.childrenCount) {
      var e;

      if (!t && this.itemRoot.dragingRoot.childrenCount > 0) {
        e = this.itemRoot.dragingRoot.children[0].getComponent("Item");
      } else {
        e = null;
      }

      var i = this.prePosA;

      if (!e) {
        var n = this.itemRoot.node.children.findIndex(function (t) {
          return 0 == t.getComponent("Item").id;
        });

        if (-1 == n) {
          n = 0;
        }

        if ((e = this.itemRoot.node.children[n].getComponent("Item")).node.y > 5) {
          var o = e.node.y;
          e.node.y = 0;
          i = e.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
          e.node.y = o;
        } else {
          i = e.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        }

        this.prePosA = i;
      }

      var s = null;
      var c = this.blockRoot.boardItemsRoot.children.find(function (t) {
        var i = t.getComponent("Item");
        return i.id == e.id && i.lv == e.lv;
      });

      if (c) {
        s = c.convertToWorldSpaceAR(cc.v2(15, -30));
      } else {
        var a;
        var r = 0 == e.id || this.blockRoot.isExtendMode;
        var h;

        if (r) {
          h = this.blockRoot.findPosForBlock(e);
        } else {
          h = this.blockRoot.findBlockForItem(e);
        }

        if (-1 != h) {
          if (r) {
            a = this.blockRoot.poses[h].node.position.add(e.offset);
          } else {
            a = this.blockRoot.blocks[h].node.position.add(e.offset);
          }

          s = this.itemRoot.blockItemsRootNode.convertToWorldSpaceAR(a).add(cc.v2(15, -30));
        } else {
          s = this.blockRoot.node.convertToWorldSpaceAR(cc.v2(270, 0));
        }
      }

      this.showMoveFinger(i, s);
    }
  },
  showMoveFinger: function showMoveFinger(t, e) {
    var i = this;
    var n = this.fingerSpine.node.parent.convertToNodeSpaceAR(t);
    var o = this.fingerSpine.node.parent.convertToNodeSpaceAR(e);
    this.fingerSpine.node.active = !0;
    this.fingerSpine.node.stopAllActions();

    (function t() {
      i.fingerSpine.node.position = n;
      i.fingerSpine.setAnimation(0, "1", !1);
      i.fingerSpine.setCompleteListener(function () {
        i.fingerSpine.node.runAction(cc.sequence(cc.moveTo(0.75, o), cc.callFunc(function () {
          i.fingerSpine.setAnimation(0, "3", !1);
          i.fingerSpine.setCompleteListener(function () {
            if (0 == i.itemRoot.node.childrenCount) {
              t();
            } else {
              i.updateMoveFinger();
            }
          });
        })));
        i.fingerSpine.setAnimation(0, "2", !0);
        i.fingerSpine.setCompleteListener(null);
      });
    })();
  },
  hideMoveFinger: function hideMoveFinger() {
    this.fingerSpine.node.active = !1;
    this.fingerSpine.node.stopAllActions();
  },
  startGuide2: function startGuide2() {
    var t = this;
    this.hideMoveFinger();
    cc.pvz.runtimeData.guide = 2;
    this.bagBottomUIRoot.active = !0;
    this.startBtnNode.active = !1;
    this.refreshLv2Node.active = !1;
    var e = this.refreshBtnNode;
    cc.guideManager.showGuide(0, [{
      tip: "【刷新】获得更多卡皮巴拉",
      focus: e,
      btn: e.name
    }], function (i) {
      if (i) {
        e.y = -1e3;
        cc.pvz.runtimeData.guide = 3;
        setTimeout(function () {
          t.updateMoveFinger();
        });
      }
    });
  },
  startGuide4: function startGuide4() {
    this.hideMoveFinger();
    cc.pvz.runtimeData.guide = 4;
    var t = this.blockRoot.boardItemsRoot.children.find(function (t) {
      return 3 == t.getComponent("Item").id;
    });
    this.refreshBtnNode.y = 90;
    var e = this.startBtnNode;
    e.active = !0;
    cc.guideManager.showGuide(0, [{
      hideFinger: !0,
      tip: "战斗中，【蝙蝠卡皮】会发射子弹攻击敌人",
      focus: cc.find("gezi", t),
      y: -400
    }, {
      tip: "准备就绪，去对抗入侵乐园的怪兽们吧！",
      focus: e,
      btn: e.name
    }], function (t) {
      if (t) {
        cc.pvz.runtimeData.guide = 5;
      }
    });
  },
  startGuide6: function startGuide6() {
    var t = this;
    this.hideMoveFinger();
    this.bagBottomUIRoot.active = !0;
    this.startBtnNode.active = !1;
    this.refreshLv2Node.active = !1;
    this.refreshBtnNode.active = !1;
    cc.guideManager.showGuide(0, [{
      tip: "确认放置位置",
      focus: this.placeBtnNode,
      btn: this.placeBtnNode.name
    }], function (e) {
      if (e) {
        cc.pvz.runtimeData.guide = 7;

        if (0 == t.itemRoot.node.childrenCount) {
          t.itemRoot.scene.startGuide8();
        } else {
          setTimeout(function () {
            t.updateMoveFinger(!0);
          });
        }
      }
    });
  },
  startGuide8: function startGuide8() {
    var t = this;
    this.hideMoveFinger();
    cc.pvz.runtimeData.guide = 8;
    this.blockRoot.stashEnable = !0;
    var e = this.refreshBtnNode;
    e.active = !0;
    e.parent.getComponent(cc.Layout).updateLayout();
    cc.guideManager.showGuide(0, [{
      tip: "使用【刷新】，能获得更多卡皮巴拉",
      focus: e,
      btn: e.name
    }, {
      hideFinger: !0,
      tip: "充分利用游乐场空间，做个背包整理达人吧"
    }], function (e) {
      if (e) {
        cc.pvz.runtimeData.guide = 9;
        t.startBtnNode.active = !0;
        t.refreshLv2Node.active = !0;
        t.adBlockBtnNode.active = !0;
        t.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
      }
    });
  },
  checkStartGame: function checkStartGame() {
    return 0 != this.blockRoot.boardItemsRoot.childrenCount || (cc.popupManager.showToast("上阵卡皮迎战敌人"), !1);
  },
  onClickStart: function onClickStart(t) {
    var e = this;

    if (this.checkStartGame(this.onClickStart)) {
      this.saveRuntimeData();
      this.blockRoot.boardItemsRoot.children.forEach(function (i) {
        i.getComponent("Item").startHeroLogic(e.itemRoot.barPrefab, t);
      });
      cc.pvz.TAUtils.trackLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave);
    }
  },
  onBackFromGame: function onBackFromGame() {
    this.blockRoot.boardItemsRoot.children.forEach(function (t) {
      t.getComponent("Item").stopHeroLogic();
    });
    this.blockRoot.backFromGame();
    this.itemRoot.node.removeAllChildren();
    this.logicEveryWave();
  },
  addItemByPrefab: function addItemByPrefab(t, e, i) {
    var n = cc.instantiate(t);
    n.position = cc.Vec2.ZERO;
    var o = n.getComponent("Item");
    o.initBy(this.itemRoot, e, i);
    n.active = !0;

    if (i) {//
    } else {
      n.parent = this.itemRoot.node;
      this.itemRoot.layoutChildren();
    }

    return o;
  },
  newEquipItem: function newEquipItem(t, e, i) {
    var n;

    if (void 0 === e) {
      e = -1;
    }

    if (void 0 === i) {
      i = null;
    }

    if (-1 == e) {
      e = this.items[cc.math.randomRangeInt(0, this.items.length)];
    }

    if (e > 100) {
      n = this.item3Preabs.find(function (t) {
        return t.getComponent("Item").id == e;
      });
    } else {
      n = this.itemPrefabs.find(function (t) {
        return t.getComponent("Item").id == e;
      });
    }

    return this.addItemByPrefab(n, t, i);
  },
  doRefreshLogic: function doRefreshLogic(t) {
    var e = this;
    var i;

    if (t) {
      i = 3 + cc.pvz.runtimeData.getBuffValue(9);
    } else {
      i = 3;
    }

    this.itemRoot.node.removeAllChildren();
    var n = cc.pvz.runtimeData.wave >= cc.pvz.runtimeData.forceAdWave;

    if (0 == cc.pvz.runtimeData.mode && 1 == cc.player.level) {
      if (0 == cc.pvz.runtimeData.guide) {
        if (cc.pvz.runtimeData.showGame1st) {
          this.newEquipItem(0, 5);
          this.newEquipItem(0, 8);
          this.newEquipItem(0, 3);
        } else {
          this.newEquipItem(0, 5);
          this.newEquipItem(0, 4);
          this.newEquipItem(0, 6);
        }

        return void this.itemRoot.layoutChildren();
      }

      if (3 == cc.pvz.runtimeData.guide) {
        this.newEquipItem(0, 4);
        this.newEquipItem(0, 2);
        this.newEquipItem(0, 3);
        return void this.itemRoot.layoutChildren();
      }

      if (5 == cc.pvz.runtimeData.guide) {
        var o = this.blockPrefabs[1];
        this.addItemByPrefab(o, -1);
        this.newEquipItem(0, 1);
        this.newEquipItem(0, 3);
        this.itemRoot.layoutChildren();
        this.bagBottomUIRoot.active = !1;
        cc.guideManager.showGuide(0, [{
          hideFinger: !0,
          tip: "出现新的格子，赶紧把游乐场空间扩大吧！"
        }], function (t) {
          if (t) {
            cc.pvz.runtimeData.guide = 6;
            e.updateMoveFinger();
          }
        });
        return void (this.adBlockBtnNode.active = !1);
      }

      if (t && 6 == cc.pvz.runtimeData.wave) {
        this.newEquipItem(3, 2).lockByAd(this.adSupPrefab);
        this.newEquipItem(0, 6);
        var c = this.blockPrefabs[3];
        this.addItemByPrefab(c, -1);
        var a = this.itemRoot.getComponent(cc.Layout);
        a.paddingLeft = 100;
        a.paddingRight = 100;
        this.itemRoot.layoutChildren();
        var r = cc.find("guide7", this.node);
        r.active = !0;
        return void cc.guideManager.showGuide(0, [{
          hideFinger: !0,
          focus: r,
          tip: "前方有首领怪物，赶紧上阵强力卡皮巴拉！"
        }], function (t) {
          if (t) {
            r.active = !1;
          }
        });
      }
    }

    var h = 0.87;
    var d = 0.97;
    var u = cc.pvz.runtimeData.getBuffValue(8);

    if (u > 0) {
      h -= 0.01 * u;
      d -= 0.01 * u;
    }

    var p = [];
    this.blockRoot.boardItemsRoot.children.forEach(function (t) {
      var e = t.getComponent("Item");

      if (0 == e.id || 2 != e.lv && 3 != e.lv) {//
      } else {
        p.push(e.id);
      }
    });
    var l = Math.min(0.2, 0.06 + 0.02 * p.length);
    var f = !1;
    var m = !1;
    var v = [-1, -1, -1];

    for (var g = 0; g < i; g++) {
      var b = 0;
      var k = -1;
      var B = -1;

      if (n) {
        b = 1;
        k = cc.math.randomRangeInt(3, this.blockPrefabs.length);
      } else if (!m && Math.random() < l) {
        b = 3;
        B = this.items[cc.math.randomRangeInt(0, this.items.length)];
      } else if (!f) {
        var C = Math.random();

        if (C < h) {
          b = 0;
        } else {
          if (C < d) {
            b = 1;
          } else {
            b = 2;
          }
        }
      }

      if (2 == g && 1 != b && v[0] == v[1]) {
        do {
          B = this.items[cc.math.randomRangeInt(0, this.items.length)];
        } while (B == v[0]);
      }

      if (3 == b) {
        for (; 3 == B;) {
          B = this.items[cc.math.randomRangeInt(0, this.items.length)];
        }
      }

      if (0 == b && v.some(function (t) {
        return s.some(function (e) {
          return e == t;
        });
      })) {
        B = this.attItems[cc.math.randomRangeInt(0, this.attItems.length)];
      }

      switch (b) {
        case 0:
          v[g] = this.newEquipItem(0, B).id;
          break;

        case 1:
          if (-1 == k) {
            k = cc.math.randomRangeInt(0, this.blockPrefabs.length);
          }

          var y = this.blockPrefabs[k];
          v[g] = this.addItemByPrefab(y, -1).id;

          if (k > 2) {
            f = !0;

            if (n) {
              cc.pvz.runtimeData.forceAdWave += 5;
              n = !1;
            }

            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["广告格子"]);
          }

          break;

        case 2:
          v[g] = this.newEquipItem(1, B).id;
          break;

        case 3:
          var R = this.newEquipItem(2, B);
          R.lockByAd(this.adSupPrefab);
          v[g] = R.id;
          m = !0;
      }
    }

    this.itemRoot.layoutChildren();
  },
  onClickWave7Guide: function onClickWave7Guide() {
    cc.guideManager.onStepFinished();
  },
  onClickRefresh: function onClickRefresh() {
    var t = this;

    if (cc.pvz.runtimeData.freeTimes > 0) {
      cc.pvz.runtimeData.freeTimes--;
      this.updateRefreshBtns();
    } else {
      if (cc.pvz.runtimeData.money < this.refreshCost) {
        if (2 == cc.pvz.runtimeData.mode && cc.pvz.runtimeData.buyCoinCount <= 0) {
          return void cc.popupManager.showToast("阳光不足");
        } else {
          return void cc.popupManager.popup("game", "YgbuyUI", "UIGameMoney", {
            scale: !1
          }, function () {
            t.saveRuntimeData();
          });
        }
      }

      cc.pvz.runtimeData.addMoney(-this.refreshCost);
      this.updateMoney();
    }

    this.doRefreshLogic(!1);
    this.saveRuntimeData();
  },
  onClickAd3: function onClickAd3() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["刷新广告格子"], function (e) {
      if (e) {
        var i = cc.math.randomRangeInt(1, 3);
        var n = t.blockPrefabs[i];
        t.addItemByPrefab(n, -1);
        cc.pvz.runtimeData.adBlockCount--;
        t.adBlockBtnNode.active = cc.pvz.runtimeData.adBlockCount > 0;

        if (t.adBlockBtnNode.active) {
          t.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
          cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
        }

        t.saveRuntimeData();
      }
    });
  },
  onClickAdRefresh: function onClickAdRefresh() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["刷新2级"], function (e) {
      if (e) {
        cc.pvz.runtimeData.lv2Count = 0;
        t.refreshLv2Node.active = !1;
        t.doRefreshLogic(!1);
        t.newEquipItem(1);
        t.saveRuntimeData();
      }
    });
  },
  updateRefreshBtns: function updateRefreshBtns() {
    this.refreshFree.active = cc.pvz.runtimeData.freeTimes > 0;
    this.refreshCoin.active = cc.pvz.runtimeData.freeTimes <= 0;
    this.refreshCoinLabel.string = this.refreshCost;

    if (cc.pvz.runtimeData.money < this.refreshCost) {
      this.refreshCoinLabel.node.color = cc.Color.RED;
    } else {
      this.refreshCoinLabel.node.color = cc.Color.WHITE;
    }
  },
  updateMoney: function updateMoney() {
    if (cc.pvz.runtimeData.money < this.refreshCost) {
      this.refreshCoinLabel.node.color = cc.Color.RED;
    } else {
      this.refreshCoinLabel.node.color = cc.Color.WHITE;
    }
  },
  updateHp: function updateHp() {
    var t = this;
    this.blockRoot.boardItemsRoot.children.forEach(function (t) {
      t.getComponent("Item").near6 = !1;
    });
    this.blockRoot.boardItemsRoot.children.forEach(function (e) {
      var i = e.getComponent("Item");

      if (6 == i.id && i.myBlocks.length > 0) {
        var n = i.myBlocks[0].i;
        t.blockRoot.getCrossItems(i.id, n, function (t) {
          t.near6 = !0;
        });
      }
    });
    var e = this.blockRoot.boardItemsRoot.children.reduce(function (t, e) {
      var i = e.getComponent("Item");
      i.updateMaxHp();
      return t + i.maxHp;
    }, 0);
    this.hpLabel.string = Math.round(e);
  },
  onItemChanged: function onItemChanged() {
    this.updateHp();
  },
  showLv5UI: function showLv5UI() {
    cc.popupManager.popup("game", "HechengUI", "UIGameLv5Info", {
      scale: !1
    }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvZ2FtZTEuanMiXSwibmFtZXMiOlsiJGJsb2NrUm9vdCIsInJlcXVpcmUiLCIkaXRlbVJvb3QiLCIkcHJlZmFiSW5mbyIsInMiLCJjIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJhZEJsb2NrQnRuTm9kZSIsIk5vZGUiLCJhZEJsb2NrQ291bnRMYWJlbCIsIkxhYmVsIiwicmVmcmVzaEZyZWUiLCJyZWZyZXNoQ29pbiIsInJlZnJlc2hDb2luTGFiZWwiLCJyZWZyZXNoTHYyTm9kZSIsImJsb2NrUm9vdCIsIml0ZW1Sb290IiwiaXRlbVByZWZhYnMiLCJpdGVtM1ByZWFicyIsImJsb2NrUHJlZmFicyIsImFkU3VwUHJlZmFiIiwic2V0QnRuTm9kZSIsImx2NWJ0bk5vZGUiLCJiYWdCb3R0b21VSVJvb3QiLCJzdGFydEJ0bk5vZGUiLCJyZWZyZXNoQnRuTm9kZSIsInBsYWNlQnRuTm9kZSIsInN0YXNoTm9kZSIsImhwQmFyIiwiUHJvZ3Jlc3NCYXIiLCJocExhYmVsIiwiaGVyb0pzb25GaWxlIiwiSnNvbkFzc2V0IiwiYnVmZkpzb25GaWxlIiwibW9uZXlJY29uTm9kZSIsImJnTXVzaWMiLCJBdWRpb0NsaXAiLCJmaW5nZXJTcGluZSIsInNwIiwiU2tlbGV0b24iLCJvbkxvYWQiLCJmb3JFYWNoIiwidCIsImFjdGl2ZSIsIm5vZGUiLCJzdGFydCIsInB2eiIsInJ1bnRpbWVEYXRhIiwiYWRCbG9ja0NvdW50IiwiaXRlbXMiLCJhdHRJdGVtcyIsImUiLCJpIiwibiIsIlBsYXllckRhdGEiLCJnZXRUb29sRGF0YSIsInBvcyIsInB1c2giLCJzb21lIiwibG9hZEpzb25EYXRhIiwianNvbiIsInNjZW5lIiwibG9naWNFdmVyeVdhdmUiLCJsdjJDb3VudCIsIlRBVXRpbHMiLCJ0cmFja0FkVUlTaG93IiwiR2FtZUNvbmZpZyIsIkFkVHlwZSIsInN0YXJ0TG9naWMiLCJ1cGRhdGVIcCIsInJlbW92ZUFsbENoaWxkcmVuIiwiYXV0b1RpbWVzIiwiZG9SZWZyZXNoTG9naWMiLCJzYXZlUnVudGltZURhdGEiLCJiYWdJdGVtcyIsImlkIiwiaWQwVHlwZSIsImFkZEl0ZW1CeVByZWZhYiIsImhhc0FkIiwidW5sb2NrQWQiLCJvIiwibmV3RXF1aXBJdGVtIiwibHYiLCJsb2NrQnlBZCIsImxheW91dENoaWxkcmVuIiwicmVzZXRCbG9ja3NQcmV2aWV3IiwidXBkYXRlTW9uZXkiLCJidXRsZXIiLCJvbiIsImdldFN0YWdlTGV2ZWwiLCJzdGFzaEVuYWJsZSIsImd1aWRlIiwic2hvd0dhbWUxc3QiLCJndWlkZU1hbmFnZXIiLCJzaG93R3VpZGUiLCJoaWRlRmluZ2VyIiwidGlwIiwidXBkYXRlTW92ZUZpbmdlciIsInN0cmluZyIsInBsYXlNdXNpYyIsImdldEJ1ZmZWYWx1ZSIsInJlZnJlc2hDb3N0IiwiTWF0aCIsInJvdW5kIiwidXBkYXRlUmVmcmVzaEJ0bnMiLCJ1cGRhdGVSdW50aW1lRGF0YSIsImJsb2NrcyIsImRhdGFzIiwiYm9hcmRJdGVtc1Jvb3QiLCJjaGlsZHJlbiIsImdldENvbXBvbmVudCIsIm5lYXIxMCIsIm15QmxvY2tzIiwiZ2V0Q3Jvc3NJdGVtcyIsImJzIiwibWFwIiwiaW5kZXgiLCJjYW5Vc2UiLCJkcmFnaW5nUm9vdCIsInNhdmVEYXRhIiwiY2hpbGRyZW5Db3VudCIsInByZVBvc0EiLCJmaW5kSW5kZXgiLCJ5IiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwiVmVjMiIsIlpFUk8iLCJmaW5kIiwidjIiLCJhIiwiciIsImlzRXh0ZW5kTW9kZSIsImgiLCJmaW5kUG9zRm9yQmxvY2siLCJmaW5kQmxvY2tGb3JJdGVtIiwicG9zZXMiLCJwb3NpdGlvbiIsImFkZCIsIm9mZnNldCIsImJsb2NrSXRlbXNSb290Tm9kZSIsInNob3dNb3ZlRmluZ2VyIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJzdG9wQWxsQWN0aW9ucyIsInNldEFuaW1hdGlvbiIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJydW5BY3Rpb24iLCJzZXF1ZW5jZSIsIm1vdmVUbyIsImNhbGxGdW5jIiwiaGlkZU1vdmVGaW5nZXIiLCJzdGFydEd1aWRlMiIsImZvY3VzIiwiYnRuIiwibmFtZSIsInNldFRpbWVvdXQiLCJzdGFydEd1aWRlNCIsInN0YXJ0R3VpZGU2Iiwic3RhcnRHdWlkZTgiLCJMYXlvdXQiLCJ1cGRhdGVMYXlvdXQiLCJjaGVja1N0YXJ0R2FtZSIsInBvcHVwTWFuYWdlciIsInNob3dUb2FzdCIsIm9uQ2xpY2tTdGFydCIsInN0YXJ0SGVyb0xvZ2ljIiwiYmFyUHJlZmFiIiwidHJhY2tMZXZlbCIsImxldmVsIiwid2F2ZSIsIm9uQmFja0Zyb21HYW1lIiwic3RvcEhlcm9Mb2dpYyIsImJhY2tGcm9tR2FtZSIsImluc3RhbnRpYXRlIiwiaW5pdEJ5IiwibWF0aCIsInJhbmRvbVJhbmdlSW50IiwibGVuZ3RoIiwiZm9yY2VBZFdhdmUiLCJtb2RlIiwicGxheWVyIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJkIiwidSIsInAiLCJsIiwibWluIiwiZiIsIm0iLCJ2IiwiZyIsImIiLCJrIiwiQiIsInJhbmRvbSIsIkMiLCJSIiwib25DbGlja1dhdmU3R3VpZGUiLCJvblN0ZXBGaW5pc2hlZCIsIm9uQ2xpY2tSZWZyZXNoIiwiZnJlZVRpbWVzIiwibW9uZXkiLCJidXlDb2luQ291bnQiLCJwb3B1cCIsInNjYWxlIiwiYWRkTW9uZXkiLCJvbkNsaWNrQWQzIiwiQWRVdGlscyIsInNob3dBZFJld2FyZFZpZGVvIiwib25DbGlja0FkUmVmcmVzaCIsImNvbG9yIiwiQ29sb3IiLCJSRUQiLCJXSElURSIsIm5lYXI2IiwicmVkdWNlIiwidXBkYXRlTWF4SHAiLCJtYXhIcCIsIm9uSXRlbUNoYW5nZWQiLCJzaG93THY1VUkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsVUFBVSxHQUFHQyxPQUFPLENBQUMsYUFBRCxDQUF4Qjs7QUFDQSxJQUFJQyxTQUFTLEdBQUdELE9B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QUMsQ0FBWDtRQUNILENBRkQ7TUFHSDtJQUNKLENBUkQ7SUFTQSxJQUFJcEssQ0FBQyxHQUFHLEtBQUtwQyxTQUFMLENBQWU2RixjQUFmLENBQThCQyxRQUE5QixDQUF1QzJHLE1BQXZDLENBQThDLFVBQVU5SyxDQUFWLEVBQWFTLENBQWIsRUFBZ0I7TUFDbEUsSUFBSUMsQ0FBQyxHQUFHRCxDQUFDLENBQUMyRCxZQUFGLENBQWUsTUFBZixDQUFSO01BQ0ExRCxDQUFDLENBQUNxSyxXQUFGO01BQ0EsT0FBTy9LLENBQUMsR0FBR1UsQ0FBQyxDQUFDc0ssS0FBYjtJQUNILENBSk8sRUFJTCxDQUpLLENBQVI7SUFLQSxLQUFLNUwsT0FBTCxDQUFhb0UsTUFBYixHQUFzQkksSUFBSSxDQUFDQyxLQUFMLENBQVdwRCxDQUFYLENBQXRCO0VBQ0gsQ0F4dkJJO0VBeXZCTHdLLGFBQWEsRUFBRSx5QkFBWTtJQUN2QixLQUFLdEosUUFBTDtFQUNILENBM3ZCSTtFQTR2Qkx1SixTQUFTLEVBQUUscUJBQVk7SUFDbkJ6TixFQUFFLENBQUMrSixZQUFILENBQWdCMEMsS0FBaEIsQ0FDSSxNQURKLEVBRUksV0FGSixFQUdJLGVBSEosRUFJSTtNQUNJQyxLQUFLLEVBQUUsQ0FBQztJQURaLENBSkosRUFPSSxJQVBKO0VBU0g7QUF0d0JJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkYmxvY2tSb290ID0gcmVxdWlyZShcIi4vQmxvY2tSb290XCIpO1xudmFyICRpdGVtUm9vdCA9IHJlcXVpcmUoXCIuL0l0ZW1Sb290XCIpO1xudmFyICRwcmVmYWJJbmZvID0gcmVxdWlyZShcIi4uLy4uL3NjcmlwdHMvUHJlZmFiSW5mb1wiKTtcbnZhciBzID0gWzMsIDYsIDgsIDEwXTtcbnZhciBjID0gWzEsIDIsIDQsIDUsIDcsIDksIDExLCAxMl07XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYWRCbG9ja0J0bk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGFkQmxvY2tDb3VudExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcmVmcmVzaEZyZWU6IGNjLk5vZGUsXG4gICAgICAgIHJlZnJlc2hDb2luOiBjYy5Ob2RlLFxuICAgICAgICByZWZyZXNoQ29pbkxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcmVmcmVzaEx2Mk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGJsb2NrUm9vdDogJGJsb2NrUm9vdCxcbiAgICAgICAgaXRlbVJvb3Q6ICRpdGVtUm9vdCxcbiAgICAgICAgaXRlbVByZWZhYnM6IFtjYy5Ob2RlXSxcbiAgICAgICAgaXRlbTNQcmVhYnM6IFtjYy5Ob2RlXSxcbiAgICAgICAgYmxvY2tQcmVmYWJzOiBbY2MuTm9kZV0sXG4gICAgICAgIGFkU3VwUHJlZmFiOiAkcHJlZmFiSW5mbyxcbiAgICAgICAgc2V0QnRuTm9kZTogY2MuTm9kZSxcbiAgICAgICAgbHY1YnRuTm9kZTogY2MuTm9kZSxcbiAgICAgICAgYmFnQm90dG9tVUlSb290OiBjYy5Ob2RlLFxuICAgICAgICBzdGFydEJ0bk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHJlZnJlc2hCdG5Ob2RlOiBjYy5Ob2RlLFxuICAgICAgICBwbGFjZUJ0bk5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHN0YXNoTm9kZTogY2MuTm9kZSxcbiAgICAgICAgaHBCYXI6IGNjLlByb2dyZXNzQmFyLFxuICAgICAgICBocExhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgaGVyb0pzb25GaWxlOiBjYy5Kc29uQXNzZXQsXG4gICAgICAgIGJ1ZmZKc29uRmlsZTogY2MuSnNvbkFzc2V0LFxuICAgICAgICBtb25leUljb25Ob2RlOiBjYy5Ob2RlLFxuICAgICAgICBiZ011c2ljOiBjYy5BdWRpb0NsaXAsXG4gICAgICAgIGZpbmdlclNwaW5lOiBzcC5Ta2VsZXRvblxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXRlbVByZWZhYnMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuICh0LmFjdGl2ZSA9ICExKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmxvY2tQcmVmYWJzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAodC5hY3RpdmUgPSAhMSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbmdlclNwaW5lLm5vZGUuYWN0aXZlID0gITE7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRCbG9ja0J0bk5vZGUuYWN0aXZlID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmFkQmxvY2tDb3VudCA+IDA7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5hdHRJdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLml0ZW1QcmVmYWJzLmZvckVhY2goZnVuY3Rpb24gKGUsIGkpIHtcbiAgICAgICAgICAgIHZhciBuID0gaSArIDE7XG4gICAgICAgICAgICBpZiAoY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEobikucG9zID49IDApIHtcbiAgICAgICAgICAgICAgICB0Lml0ZW1zLnB1c2gobik7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0ID09IG47XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuYXR0SXRlbXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEubG9hZEpzb25EYXRhKHRoaXMuYnVmZkpzb25GaWxlLmpzb24pO1xuICAgICAgICB0aGlzLmJsb2NrUm9vdC5zY2VuZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvZ2ljRXZlcnlXYXZlKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaEx2Mk5vZGUuYWN0aXZlID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmx2MkNvdW50ID4gMDtcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaEx2Mk5vZGUuYWN0aXZlKSB7XG4gICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja0FkVUlTaG93KGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuWIt+aWsDLnuqdcIl0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmxvY2tSb290LnN0YXJ0TG9naWMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVIcCgpO1xuICAgICAgICB0aGlzLml0ZW1Sb290Lm5vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5hdXRvVGltZXMgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRvUmVmcmVzaExvZ2ljKCEwKTtcbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hdXRvVGltZXMtLTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVJ1bnRpbWVEYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYmFnSXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICgwID09IGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0LmJsb2NrUHJlZmFic1tlLmlkMFR5cGVdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IHQuYWRkSXRlbUJ5UHJlZmFiKGksIC0xLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4uaGFzQWQgJiYgIWUuaGFzQWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4udW5sb2NrQWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gdC5uZXdFcXVpcEl0ZW0oZS5sdiwgZS5pZCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmhhc0FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLmxvY2tCeUFkKHQuYWRTdXBQcmVmYWIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgIHRoaXMudXBkYXRlTW9uZXkoKTtcbiAgICAgICAgY2MuYnV0bGVyLm5vZGUub24oXCJtb25leVwiLCB0aGlzLnVwZGF0ZU1vbmV5LCB0aGlzKTtcbiAgICAgICAgaWYgKDEgPT0gY2MucHZ6LlBsYXllckRhdGEuZ2V0U3RhZ2VMZXZlbCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJ0bk5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICB0aGlzLmJsb2NrUm9vdC5zdGFzaEVuYWJsZSA9ICExO1xuICAgICAgICAgICAgaWYgKDAgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCkge1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5iYWdCb3R0b21VSVJvb3QuYWN0aXZlID0gITEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZ3VpZGVNYW5hZ2VyLnNob3dHdWlkZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IFwi44CQ6IOM5YyF44CR6IO95by65YyW5LiK6Zi15qSN54mp55qE6IO95Yqb44CCXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IFwi5bCG5Yi35paw5Ye655qE44CQ5bel5YW344CR5YWo6YOo5pS+5YWl6IOM5YyF5Lit5by65YyW5qSN54mpIVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LmJhZ0JvdHRvbVVJUm9vdC5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQuc3RhcnRCdG5Ob2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5yZWZyZXNoQnRuTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucmVmcmVzaEx2Mk5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuYWRCbG9ja0J0bk5vZGUuYWN0aXZlID0gITEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJhZ0JvdHRvbVVJUm9vdC5hY3RpdmUgPSAhMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5ndWlkZU1hbmFnZXIuc2hvd0d1aWRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlRmluZ2VyOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogXCLmrKLov47mnaXliLDljaHnmq7lt7Tmi4nnmoTkuJbnlYzvvIFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlRmluZ2VyOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogXCLlsIbliLfmlrDlh7rnmoTljaHnmq7lt7Tmi4nmlL7lhaXmuLjkuZDlnLrvvIFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmFkQmxvY2tCdG5Ob2RlLmFjdGl2ZSA9ICExKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYWRCbG9ja0J0bk5vZGUuYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFkQmxvY2tDb3VudExhYmVsLnN0cmluZyA9IGNjLnB2ei5ydW50aW1lRGF0YS5hZEJsb2NrQ291bnQ7XG4gICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja0FkVUlTaG93KGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuWIt+aWsOW5v+WRiuagvOWtkFwiXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGxvZ2ljRXZlcnlXYXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5wbGF5TXVzaWModGhpcy5iZ011c2ljKTtcbiAgICAgICAgdmFyIHQgPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDEzKTtcbiAgICAgICAgaWYgKHQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb3N0ID0gTWF0aC5yb3VuZCgxNSAqICgxIC0gMC4wMSAqIHQpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvc3QgPSAxNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVJlZnJlc2hCdG5zKCk7XG4gICAgfSxcbiAgICB1cGRhdGVSdW50aW1lRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5ibG9ja3MgPSBbXTtcbiAgICAgICAgdGhpcy5ibG9ja1Jvb3QuZGF0YXMuZm9yRWFjaChmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgaWYgKC0xICE9IHQpIHtcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYmxvY2tzLnB1c2goZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJsb2NrUm9vdC5ib2FyZEl0ZW1zUm9vdC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0LmdldENvbXBvbmVudChcIkl0ZW1cIikubmVhcjEwID0gITE7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJsb2NrUm9vdC5ib2FyZEl0ZW1zUm9vdC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGUuZ2V0Q29tcG9uZW50KFwiSXRlbVwiKTtcbiAgICAgICAgICAgIGlmICgxMCA9PSBpLmlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSBpLm15QmxvY2tzWzBdLmk7XG4gICAgICAgICAgICAgICAgdC5ibG9ja1Jvb3QuZ2V0Q3Jvc3NJdGVtcyhpLmlkLCBuLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICB0Lm5lYXIxMCA9ICEwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLml0ZW1zID0gW107XG4gICAgICAgIHRoaXMuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgICAgIHZhciBpID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLml0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBpLmlkLFxuICAgICAgICAgICAgICAgIGx2OiBpLmx2LFxuICAgICAgICAgICAgICAgIGJzOiBpLm15QmxvY2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGkuaW5kZXggPSBlO1xuICAgICAgICB9KTtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmJhZ0l0ZW1zID0gW107XG4gICAgICAgIHZhciBlID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5iYWdJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdC5pZCxcbiAgICAgICAgICAgICAgICBsdjogdC5sdixcbiAgICAgICAgICAgICAgICBoYXNBZDogdC5oYXNBZCAmJiAhdC5jYW5Vc2UsXG4gICAgICAgICAgICAgICAgaWQwVHlwZTogdC5pZDBUeXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pdGVtUm9vdC5ub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBpID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgZShpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaXRlbVJvb3QuZHJhZ2luZ1Jvb3QuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0LmdldENvbXBvbmVudChcIkl0ZW1cIik7XG4gICAgICAgICAgICBlKGkpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNhdmVSdW50aW1lRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVJ1bnRpbWVEYXRhKCk7XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5zYXZlRGF0YSgpO1xuICAgIH0sXG4gICAgdXBkYXRlTW92ZUZpbmdlcjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gdCkge1xuICAgICAgICAgICAgdCA9ICExO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwICE9IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICB2YXIgZTtcbiAgICAgICAgICAgIGlmICghdCAmJiB0aGlzLml0ZW1Sb290LmRyYWdpbmdSb290LmNoaWxkcmVuQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZSA9IHRoaXMuaXRlbVJvb3QuZHJhZ2luZ1Jvb3QuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50KFwiSXRlbVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMucHJlUG9zQTtcbiAgICAgICAgICAgIGlmICghZSkge1xuICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy5pdGVtUm9vdC5ub2RlLmNoaWxkcmVuLmZpbmRJbmRleChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMCA9PSB0LmdldENvbXBvbmVudChcIkl0ZW1cIikuaWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKC0xID09IG4pIHtcbiAgICAgICAgICAgICAgICAgICAgbiA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoZSA9IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbltuXS5nZXRDb21wb25lbnQoXCJJdGVtXCIpKS5ub2RlLnkgPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gZS5ub2RlLnk7XG4gICAgICAgICAgICAgICAgICAgIGUubm9kZS55ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaSA9IGUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgICAgICAgICAgZS5ub2RlLnkgPSBvO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBlLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJlUG9zQSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcyA9IG51bGw7XG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHQuZ2V0Q29tcG9uZW50KFwiSXRlbVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS5pZCA9PSBlLmlkICYmIGkubHYgPT0gZS5sdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICBzID0gYy5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIoMTUsIC0zMCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYTtcbiAgICAgICAgICAgICAgICB2YXIgciA9IDAgPT0gZS5pZCB8fCB0aGlzLmJsb2NrUm9vdC5pc0V4dGVuZE1vZGU7XG4gICAgICAgICAgICAgICAgdmFyIGg7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgaCA9IHRoaXMuYmxvY2tSb290LmZpbmRQb3NGb3JCbG9jayhlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoID0gdGhpcy5ibG9ja1Jvb3QuZmluZEJsb2NrRm9ySXRlbShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKC0xICE9IGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSB0aGlzLmJsb2NrUm9vdC5wb3Nlc1toXS5ub2RlLnBvc2l0aW9uLmFkZChlLm9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gdGhpcy5ibG9ja1Jvb3QuYmxvY2tzW2hdLm5vZGUucG9zaXRpb24uYWRkKGUub2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzID0gdGhpcy5pdGVtUm9vdC5ibG9ja0l0ZW1zUm9vdE5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGEpLmFkZChjYy52MigxNSwgLTMwKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcyA9IHRoaXMuYmxvY2tSb290Lm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKDI3MCwgMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2hvd01vdmVGaW5nZXIoaSwgcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob3dNb3ZlRmluZ2VyOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIHZhciBuID0gdGhpcy5maW5nZXJTcGluZS5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0KTtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmZpbmdlclNwaW5lLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgICAgICB0aGlzLmZpbmdlclNwaW5lLm5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgIHRoaXMuZmluZ2VyU3BpbmUubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICAoZnVuY3Rpb24gdCgpIHtcbiAgICAgICAgICAgIGkuZmluZ2VyU3BpbmUubm9kZS5wb3NpdGlvbiA9IG47XG4gICAgICAgICAgICBpLmZpbmdlclNwaW5lLnNldEFuaW1hdGlvbigwLCBcIjFcIiwgITEpO1xuICAgICAgICAgICAgaS5maW5nZXJTcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpLmZpbmdlclNwaW5lLm5vZGUucnVuQWN0aW9uKFxuICAgICAgICAgICAgICAgICAgICBjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLm1vdmVUbygwLjc1LCBvKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmZpbmdlclNwaW5lLnNldEFuaW1hdGlvbigwLCBcIjNcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuZmluZ2VyU3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IGkuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaS5maW5nZXJTcGluZS5zZXRBbmltYXRpb24oMCwgXCIyXCIsICEwKTtcbiAgICAgICAgICAgICAgICBpLmZpbmdlclNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICB9LFxuICAgIGhpZGVNb3ZlRmluZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZmluZ2VyU3BpbmUubm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgdGhpcy5maW5nZXJTcGluZS5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgfSxcbiAgICBzdGFydEd1aWRlMjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGlkZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlID0gMjtcbiAgICAgICAgdGhpcy5iYWdCb3R0b21VSVJvb3QuYWN0aXZlID0gITA7XG4gICAgICAgIHRoaXMuc3RhcnRCdG5Ob2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB0aGlzLnJlZnJlc2hMdjJOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB2YXIgZSA9IHRoaXMucmVmcmVzaEJ0bk5vZGU7XG4gICAgICAgIGNjLmd1aWRlTWFuYWdlci5zaG93R3VpZGUoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGlwOiBcIuOAkOWIt+aWsOOAkeiOt+W+l+abtOWkmuWNoeearuW3tOaLiVwiLFxuICAgICAgICAgICAgICAgICAgICBmb2N1czogZSxcbiAgICAgICAgICAgICAgICAgICAgYnRuOiBlLm5hbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICBlLnkgPSAtMWUzO1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgPSAzO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcbiAgICBzdGFydEd1aWRlNDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhpZGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSA9IDQ7XG4gICAgICAgIHZhciB0ID0gdGhpcy5ibG9ja1Jvb3QuYm9hcmRJdGVtc1Jvb3QuY2hpbGRyZW4uZmluZChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIDMgPT0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoQnRuTm9kZS55ID0gOTA7XG4gICAgICAgIHZhciBlID0gdGhpcy5zdGFydEJ0bk5vZGU7XG4gICAgICAgIGUuYWN0aXZlID0gITA7XG4gICAgICAgIGNjLmd1aWRlTWFuYWdlci5zaG93R3VpZGUoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgIHRpcDogXCLmiJjmlpfkuK3vvIzjgJDonZnonaDljaHnmq7jgJHkvJrlj5HlsITlrZDlvLnmlLvlh7vmlYzkurpcIixcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IGNjLmZpbmQoXCJnZXppXCIsIHQpLFxuICAgICAgICAgICAgICAgICAgICB5OiAtNDAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRpcDogXCLlh4blpIflsLHnu6rvvIzljrvlr7nmipflhaXkvrXkuZDlm63nmoTmgKrlhb3ku6zlkKfvvIFcIixcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IGUsXG4gICAgICAgICAgICAgICAgICAgIGJ0bjogZS5uYW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlID0gNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcbiAgICBzdGFydEd1aWRlNjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGlkZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgdGhpcy5iYWdCb3R0b21VSVJvb3QuYWN0aXZlID0gITA7XG4gICAgICAgIHRoaXMuc3RhcnRCdG5Ob2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB0aGlzLnJlZnJlc2hMdjJOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB0aGlzLnJlZnJlc2hCdG5Ob2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBjYy5ndWlkZU1hbmFnZXIuc2hvd0d1aWRlKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRpcDogXCLnoa7orqTmlL7nva7kvY3nva5cIixcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRoaXMucGxhY2VCdG5Ob2RlLFxuICAgICAgICAgICAgICAgICAgICBidG46IHRoaXMucGxhY2VCdG5Ob2RlLm5hbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgPSA3O1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0Lml0ZW1Sb290Lm5vZGUuY2hpbGRyZW5Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlOCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdC51cGRhdGVNb3ZlRmluZ2VyKCEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG4gICAgc3RhcnRHdWlkZTg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmhpZGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSA9IDg7XG4gICAgICAgIHRoaXMuYmxvY2tSb290LnN0YXNoRW5hYmxlID0gITA7XG4gICAgICAgIHZhciBlID0gdGhpcy5yZWZyZXNoQnRuTm9kZTtcbiAgICAgICAgZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgZS5wYXJlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCkudXBkYXRlTGF5b3V0KCk7XG4gICAgICAgIGNjLmd1aWRlTWFuYWdlci5zaG93R3VpZGUoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGlwOiBcIuS9v+eUqOOAkOWIt+aWsOOAke+8jOiDveiOt+W+l+abtOWkmuWNoeearuW3tOaLiVwiLFxuICAgICAgICAgICAgICAgICAgICBmb2N1czogZSxcbiAgICAgICAgICAgICAgICAgICAgYnRuOiBlLm5hbWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZUZpbmdlcjogITAsXG4gICAgICAgICAgICAgICAgICAgIHRpcDogXCLlhYXliIbliKnnlKjmuLjkuZDlnLrnqbrpl7TvvIzlgZrkuKrog4zljIXmlbTnkIbovr7kurrlkKdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSA9IDk7XG4gICAgICAgICAgICAgICAgICAgIHQuc3RhcnRCdG5Ob2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICB0LnJlZnJlc2hMdjJOb2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICB0LmFkQmxvY2tCdG5Ob2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICB0LmFkQmxvY2tDb3VudExhYmVsLnN0cmluZyA9IGNjLnB2ei5ydW50aW1lRGF0YS5hZEJsb2NrQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrQWRVSVNob3coY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5Yi35paw5bm/5ZGK5qC85a2QXCJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcbiAgICBjaGVja1N0YXJ0R2FtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gMCAhPSB0aGlzLmJsb2NrUm9vdC5ib2FyZEl0ZW1zUm9vdC5jaGlsZHJlbkNvdW50IHx8IChjYy5wb3B1cE1hbmFnZXIuc2hvd1RvYXN0KFwi5LiK6Zi15Y2h55qu6L+O5oiY5pWM5Lq6XCIpLCAhMSk7XG4gICAgfSxcbiAgICBvbkNsaWNrU3RhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tTdGFydEdhbWUodGhpcy5vbkNsaWNrU3RhcnQpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVSdW50aW1lRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5ibG9ja1Jvb3QuYm9hcmRJdGVtc1Jvb3QuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGkuZ2V0Q29tcG9uZW50KFwiSXRlbVwiKS5zdGFydEhlcm9Mb2dpYyhlLml0ZW1Sb290LmJhclByZWZhYiwgdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrTGV2ZWwoY2MucHZ6LnJ1bnRpbWVEYXRhLmxldmVsLCBjYy5wdnoucnVudGltZURhdGEud2F2ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQmFja0Zyb21HYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHQuZ2V0Q29tcG9uZW50KFwiSXRlbVwiKS5zdG9wSGVyb0xvZ2ljKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJsb2NrUm9vdC5iYWNrRnJvbUdhbWUoKTtcbiAgICAgICAgdGhpcy5pdGVtUm9vdC5ub2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMubG9naWNFdmVyeVdhdmUoKTtcbiAgICB9LFxuICAgIGFkZEl0ZW1CeVByZWZhYjogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSBjYy5pbnN0YW50aWF0ZSh0KTtcbiAgICAgICAgbi5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgdmFyIG8gPSBuLmdldENvbXBvbmVudChcIkl0ZW1cIik7XG4gICAgICAgIG8uaW5pdEJ5KHRoaXMuaXRlbVJvb3QsIGUsIGkpO1xuICAgICAgICBuLmFjdGl2ZSA9ICEwO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG4ucGFyZW50ID0gdGhpcy5pdGVtUm9vdC5ub2RlO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5sYXlvdXRDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvO1xuICAgIH0sXG4gICAgbmV3RXF1aXBJdGVtOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbjtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gZSkge1xuICAgICAgICAgICAgZSA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2b2lkIDAgPT09IGkpIHtcbiAgICAgICAgICAgIGkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICgtMSA9PSBlKSB7XG4gICAgICAgICAgICBlID0gdGhpcy5pdGVtc1tjYy5tYXRoLnJhbmRvbVJhbmdlSW50KDAsIHRoaXMuaXRlbXMubGVuZ3RoKV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUgPiAxMDApIHtcbiAgICAgICAgICAgIG4gPSB0aGlzLml0ZW0zUHJlYWJzLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpLmlkID09IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG4gPSB0aGlzLml0ZW1QcmVmYWJzLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpLmlkID09IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hZGRJdGVtQnlQcmVmYWIobiwgdCwgaSk7XG4gICAgfSxcbiAgICBkb1JlZnJlc2hMb2dpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIGkgPSAzICsgY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSg5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkgPSAzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbVJvb3Qubm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB2YXIgbiA9IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlID49IGNjLnB2ei5ydW50aW1lRGF0YS5mb3JjZUFkV2F2ZTtcbiAgICAgICAgaWYgKDAgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLm1vZGUgJiYgMSA9PSBjYy5wbGF5ZXIubGV2ZWwpIHtcbiAgICAgICAgICAgIGlmICgwID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdFcXVpcEl0ZW0oMCwgNSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3RXF1aXBJdGVtKDAsIDgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCAzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCA1KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdFcXVpcEl0ZW0oMCwgNCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3RXF1aXBJdGVtKDAsIDYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoMyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCA0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCAyKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCAzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoNSA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IHRoaXMuYmxvY2tQcmVmYWJzWzFdO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSXRlbUJ5UHJlZmFiKG8sIC0xKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0VxdWlwSXRlbSgwLCAzKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWdCb3R0b21VSVJvb3QuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgY2MuZ3VpZGVNYW5hZ2VyLnNob3dHdWlkZShcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVGaW5nZXI6ICEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogXCLlh7rnjrDmlrDnmoTmoLzlrZDvvIzotbbntKfmiormuLjkuZDlnLrnqbrpl7TmianlpKflkKfvvIFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgPSA2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAodGhpcy5hZEJsb2NrQnRuTm9kZS5hY3RpdmUgPSAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodCAmJiA2ID09IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdFcXVpcEl0ZW0oMywgMikubG9ja0J5QWQodGhpcy5hZFN1cFByZWZhYik7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdFcXVpcEl0ZW0oMCwgNik7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmJsb2NrUHJlZmFic1szXTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW1CeVByZWZhYihjLCAtMSk7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSB0aGlzLml0ZW1Sb290LmdldENvbXBvbmVudChjYy5MYXlvdXQpO1xuICAgICAgICAgICAgICAgIGEucGFkZGluZ0xlZnQgPSAxMDA7XG4gICAgICAgICAgICAgICAgYS5wYWRkaW5nUmlnaHQgPSAxMDA7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5sYXlvdXRDaGlsZHJlbigpO1xuICAgICAgICAgICAgICAgIHZhciByID0gY2MuZmluZChcImd1aWRlN1wiLCB0aGlzLm5vZGUpO1xuICAgICAgICAgICAgICAgIHIuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgY2MuZ3VpZGVNYW5hZ2VyLnNob3dHdWlkZShcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVGaW5nZXI6ICEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzOiByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogXCLliY3mlrnmnInpppbpoobmgKrnianvvIzotbbntKfkuIrpmLXlvLrlipvljaHnmq7lt7Tmi4nvvIFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgaCA9IDAuODc7XG4gICAgICAgIHZhciBkID0gMC45NztcbiAgICAgICAgdmFyIHUgPSBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDgpO1xuICAgICAgICBpZiAodSA+IDApIHtcbiAgICAgICAgICAgIGggLT0gMC4wMSAqIHU7XG4gICAgICAgICAgICBkIC09IDAuMDEgKiB1O1xuICAgICAgICB9XG4gICAgICAgIHZhciBwID0gW107XG4gICAgICAgIHRoaXMuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBlID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgaWYgKDAgPT0gZS5pZCB8fCAoMiAhPSBlLmx2ICYmIDMgIT0gZS5sdikpIHtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnB1c2goZS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbCA9IE1hdGgubWluKDAuMiwgMC4wNiArIDAuMDIgKiBwLmxlbmd0aCk7XG4gICAgICAgIHZhciBmID0gITE7XG4gICAgICAgIHZhciBtID0gITE7XG4gICAgICAgIHZhciB2ID0gWy0xLCAtMSwgLTFdO1xuICAgICAgICBmb3IgKHZhciBnID0gMDsgZyA8IGk7IGcrKykge1xuICAgICAgICAgICAgdmFyIGIgPSAwO1xuICAgICAgICAgICAgdmFyIGsgPSAtMTtcbiAgICAgICAgICAgIHZhciBCID0gLTE7XG4gICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgIGIgPSAxO1xuICAgICAgICAgICAgICAgIGsgPSBjYy5tYXRoLnJhbmRvbVJhbmdlSW50KDMsIHRoaXMuYmxvY2tQcmVmYWJzLmxlbmd0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtICYmIE1hdGgucmFuZG9tKCkgPCBsKSB7XG4gICAgICAgICAgICAgICAgYiA9IDM7XG4gICAgICAgICAgICAgICAgQiA9IHRoaXMuaXRlbXNbY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCB0aGlzLml0ZW1zLmxlbmd0aCldO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZikge1xuICAgICAgICAgICAgICAgIHZhciBDID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBpZiAoQyA8IGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYiA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEMgPCBkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKDIgPT0gZyAmJiAxICE9IGIgJiYgdlswXSA9PSB2WzFdKSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBCID0gdGhpcy5pdGVtc1tjYy5tYXRoLnJhbmRvbVJhbmdlSW50KDAsIHRoaXMuaXRlbXMubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoQiA9PSB2WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgzID09IGIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKDsgMyA9PSBCOyApIHtcbiAgICAgICAgICAgICAgICAgICAgQiA9IHRoaXMuaXRlbXNbY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCB0aGlzLml0ZW1zLmxlbmd0aCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAwID09IGIgJiZcbiAgICAgICAgICAgICAgICB2LnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUgPT0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIEIgPSB0aGlzLmF0dEl0ZW1zW2NjLm1hdGgucmFuZG9tUmFuZ2VJbnQoMCwgdGhpcy5hdHRJdGVtcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoYikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdltnXSA9IHRoaXMubmV3RXF1aXBJdGVtKDAsIEIpLmlkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGlmICgtMSA9PSBrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCB0aGlzLmJsb2NrUHJlZmFicy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5ibG9ja1ByZWZhYnNba107XG4gICAgICAgICAgICAgICAgICAgIHZbZ10gPSB0aGlzLmFkZEl0ZW1CeVByZWZhYih5LCAtMSkuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrID4gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZm9yY2VBZFdhdmUgKz0gNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja0FkVUlTaG93KGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuW5v+WRiuagvOWtkFwiXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB2W2ddID0gdGhpcy5uZXdFcXVpcEl0ZW0oMSwgQikuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIFIgPSB0aGlzLm5ld0VxdWlwSXRlbSgyLCBCKTtcbiAgICAgICAgICAgICAgICAgICAgUi5sb2NrQnlBZCh0aGlzLmFkU3VwUHJlZmFiKTtcbiAgICAgICAgICAgICAgICAgICAgdltnXSA9IFIuaWQ7XG4gICAgICAgICAgICAgICAgICAgIG0gPSAhMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgfSxcbiAgICBvbkNsaWNrV2F2ZTdHdWlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5ndWlkZU1hbmFnZXIub25TdGVwRmluaXNoZWQoKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tSZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5mcmVlVGltZXMgPiAwKSB7XG4gICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuZnJlZVRpbWVzLS07XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJlZnJlc2hCdG5zKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2MucHZ6LnJ1bnRpbWVEYXRhLm1vbmV5IDwgdGhpcy5yZWZyZXNoQ29zdCkge1xuICAgICAgICAgICAgICAgIGlmICgyID09IGNjLnB2ei5ydW50aW1lRGF0YS5tb2RlICYmIGNjLnB2ei5ydW50aW1lRGF0YS5idXlDb2luQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBjYy5wb3B1cE1hbmFnZXIuc2hvd1RvYXN0KFwi6Ziz5YWJ5LiN6LazXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2FtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJZZ2J1eVVJXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZU1vbmV5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQuc2F2ZVJ1bnRpbWVEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmFkZE1vbmV5KC10aGlzLnJlZnJlc2hDb3N0KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTW9uZXkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvUmVmcmVzaExvZ2ljKCExKTtcbiAgICAgICAgdGhpcy5zYXZlUnVudGltZURhdGEoKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tBZDM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBjYy5wdnouQWRVdGlscy5zaG93QWRSZXdhcmRWaWRlbyhjYy5wdnouR2FtZUNvbmZpZy5BZFR5cGVbXCLliLfmlrDlub/lkYrmoLzlrZBcIl0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gY2MubWF0aC5yYW5kb21SYW5nZUludCgxLCAzKTtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IHQuYmxvY2tQcmVmYWJzW2ldO1xuICAgICAgICAgICAgICAgIHQuYWRkSXRlbUJ5UHJlZmFiKG4sIC0xKTtcbiAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYWRCbG9ja0NvdW50LS07XG4gICAgICAgICAgICAgICAgdC5hZEJsb2NrQnRuTm9kZS5hY3RpdmUgPSBjYy5wdnoucnVudGltZURhdGEuYWRCbG9ja0NvdW50ID4gMDtcbiAgICAgICAgICAgICAgICBpZiAodC5hZEJsb2NrQnRuTm9kZS5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdC5hZEJsb2NrQ291bnRMYWJlbC5zdHJpbmcgPSBjYy5wdnoucnVudGltZURhdGEuYWRCbG9ja0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja0FkVUlTaG93KGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuWIt+aWsOW5v+WRiuagvOWtkFwiXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHQuc2F2ZVJ1bnRpbWVEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25DbGlja0FkUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGNjLnB2ei5BZFV0aWxzLnNob3dBZFJld2FyZFZpZGVvKGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuWIt+aWsDLnuqdcIl0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5sdjJDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdC5yZWZyZXNoTHYyTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgICAgICB0LmRvUmVmcmVzaExvZ2ljKCExKTtcbiAgICAgICAgICAgICAgICB0Lm5ld0VxdWlwSXRlbSgxKTtcbiAgICAgICAgICAgICAgICB0LnNhdmVSdW50aW1lRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHVwZGF0ZVJlZnJlc2hCdG5zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaEZyZWUuYWN0aXZlID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmZyZWVUaW1lcyA+IDA7XG4gICAgICAgIHRoaXMucmVmcmVzaENvaW4uYWN0aXZlID0gY2MucHZ6LnJ1bnRpbWVEYXRhLmZyZWVUaW1lcyA8PSAwO1xuICAgICAgICB0aGlzLnJlZnJlc2hDb2luTGFiZWwuc3RyaW5nID0gdGhpcy5yZWZyZXNoQ29zdDtcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5tb25leSA8IHRoaXMucmVmcmVzaENvc3QpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvaW5MYWJlbC5ub2RlLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29pbkxhYmVsLm5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTW9uZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNjLnB2ei5ydW50aW1lRGF0YS5tb25leSA8IHRoaXMucmVmcmVzaENvc3QpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvaW5MYWJlbC5ub2RlLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29pbkxhYmVsLm5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSHA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmJsb2NrUm9vdC5ib2FyZEl0ZW1zUm9vdC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0LmdldENvbXBvbmVudChcIkl0ZW1cIikubmVhcjYgPSAhMTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmxvY2tSb290LmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpID0gZS5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgaWYgKDYgPT0gaS5pZCAmJiBpLm15QmxvY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IGkubXlCbG9ja3NbMF0uaTtcbiAgICAgICAgICAgICAgICB0LmJsb2NrUm9vdC5nZXRDcm9zc0l0ZW1zKGkuaWQsIG4sIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQubmVhcjYgPSAhMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlID0gdGhpcy5ibG9ja1Jvb3QuYm9hcmRJdGVtc1Jvb3QuY2hpbGRyZW4ucmVkdWNlKGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGUuZ2V0Q29tcG9uZW50KFwiSXRlbVwiKTtcbiAgICAgICAgICAgIGkudXBkYXRlTWF4SHAoKTtcbiAgICAgICAgICAgIHJldHVybiB0ICsgaS5tYXhIcDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHRoaXMuaHBMYWJlbC5zdHJpbmcgPSBNYXRoLnJvdW5kKGUpO1xuICAgIH0sXG4gICAgb25JdGVtQ2hhbmdlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUhwKCk7XG4gICAgfSxcbiAgICBzaG93THY1VUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICBcIkhlY2hlbmdVSVwiLFxuICAgICAgICAgICAgXCJVSUdhbWVMdjVJbmZvXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1xuICAgICAgICApO1xuICAgIH1cbn0pOyJdfQ==