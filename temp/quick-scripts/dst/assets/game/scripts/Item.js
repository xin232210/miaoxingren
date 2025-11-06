
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/Item.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '19e1fvPWshIYLVJzpb6WDTc', 'Item');
// game/scripts/Item.js

"use strict";

var i = ["bai_", "lv_", "lan_", "zi_", "cheng_"];
cc.Class({
  "extends": cc.Component,
  properties: {
    xys: [cc.Vec2],
    offset: cc.Vec2,
    id: 1,
    id0Type: 0,
    lv: 0,
    lvSp: cc.Sprite,
    bgSp: cc.Sprite,
    hasAd: !1,
    adAni: "",
    adSupOffset: cc.Vec2,
    spine: sp.Skeleton,
    righMargin: 53,
    barPos: {
      "default": cc.v2(0, 120)
    },
    attOffset: cc.Vec2
  },
  onLoad: function onLoad() {
    this.enabled = !1;
  },
  setSelfListenEvent: function setSelfListenEvent(t) {
    if (t) {
      this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
      this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
      this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
    } else {
      this.node.off(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
      this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
      this.node.off(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
      this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
    }
  },
  updateLvBlocks: function updateLvBlocks() {
    if (this.bgSp) {
      cc.pvz.utils.setSpriteFrame(this.bgSp, "uiImage", "gezi/" + i[this.lv] + this.json.lattice2);
    }

    if (this.lvSp) {
      cc.pvz.utils.setSpriteFrame(this.lvSp, "uiImage", "item/" + (this.lv + 1));
    }

    if (this.spine) {
      var t = this.cantDrag ? "black_" + (this.lv + 1) : "Idle";
      this.spine.defaultAnimation = t;
      this.spine.setAnimation(0, t, !0);
    }
  },
  lvup: function lvup(t) {
    if (void 0 === t) {
      t = !0;
    }

    this.lv++;
    this.updateLvBlocks();
    this.checkToUpdateMaxHp();

    if (t) {
      this.showLvupEffect();
    }
  },
  showLvupEffect: function showLvupEffect() {
    var t = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    this.itemRoot.scene.hub.showLvupEffect(t);
  },
  initBy: function initBy(t, e, i) {
    var n = this;
    this.itemRoot = t;
    this.json = this.itemRoot.scene.heroJsonFile.json[this.id - 1];
    this.near6 = !1;
    this.lv = e;
    this.updateLvBlocks();

    if (i) {
      i.forEach(function (t) {
        t.put(n);
      });
      this.myBlocks = i;
      var o = i[0].node.position.add(this.offset);
      this.node.position = o;
      this.node.zIndex = -(o.y + this.spine.node.y);
      this.canUse = !0;
    } else {
      this.myBlocks = [];
      this.canUse = !this.hasAd;
      this.setSelfListenEvent(!0);
      this.setBgSpParent(!0);
    }

    this.hero = null;
    this.angerEff = null;
    this.lineIKBones = [];
  },
  getMaxLv: function getMaxLv() {
    if (cc.pvz.PlayerData.getToolData(this.id).lv >= 5) {
      return 4;
    } else {
      return 3;
    }
  },
  showUnderBuffEffect: function showUnderBuffEffect() {
    if (this.buffNode) {
      this.buffNode.active = !0;
    } else {
      var t = this.itemRoot.buffEffect.addNodeTo(this.node, this.spine.position);
      this.buffNode = t;
    }
  },
  hideUnderBuffEffect: function hideUnderBuffEffect() {
    if (this.buffNode) {
      this.buffNode.active = !1;
    }
  },
  updateLv5Effect: function updateLv5Effect() {
    this.lv;
  },
  hideLv5Effect: function hideLv5Effect() {
    if (this.lv5FlagNode) {
      this.lv5FlagNode.active = !1;
    }
  },
  setCanDrag: function setCanDrag(t) {
    if (this.spine) {
      this.spine.setAnimation(0, t ? "Idle" : "black_" + (this.lv + 1), !0);
    } else {
      if (t) {
        this.node.opacity = 255;
      } else {
        this.node.opacity = 100;
      }
    }

    this.cantDrag = !t;
  },
  updatePreviewByPos: function updatePreviewByPos(t, e) {
    if (0 == this.id) {
      return this.itemRoot.blockRoot.testBlock(this, t, e);
    } else {
      return this.itemRoot.blockRoot.testItem(this, t, e);
    }
  },
  lockByAd: function lockByAd(t) {
    var e = t.addNodeTo(this.node);
    e.getComponent(sp.Skeleton).setAnimation(0, this.adAni, !0);
    cc.find("ad", e).position = this.adSupOffset;
    this.hasAd = !0;
    this.canUse = !1;
  },
  unlockAd: function unlockAd() {
    if (this.isValid) {
      var t = cc.find("ad", this.node);

      if (t) {
        t.active = !1;
        this.canUse = !0;
      } else {
        cc.pvz.TAUtils.track("error", {
          message: "unlockAd",
          stack: "noAdNode, id:" + this.id + ",lv:" + this.lv
        });
      }
    }
  },
  pickupFromBoard: function pickupFromBoard(t) {
    if (this.cantDrag) {//
    } else {
      this.hasMoved = !1;
      this.clickWPos = t;
      this.removeFromBlock();
      this.itemRoot.pickupFromBoard(this, t);
      this.updatePreviewByPos(t);
    }
  },
  onClickBegan: function onClickBegan(t) {
    if (!this.cantDrag) {
      var e = t.getLocation();
      this.hasMoved = !1;
      this.clickWPos = e;
      this.itemRoot.pickup(this, e);
      this.updatePreviewByPos(e);
      this.initSameIDLvLine();
    }
  },
  onClickMoved: function onClickMoved(t) {
    if (this.cantDrag) {//
    } else {
      this.hasMoved = !0;
      this.node.position = this.node.parent.convertToNodeSpaceAR(t.getLocation());
      this.updatePreviewByPos(t.getLocation());
      this.updateLineIKBones();
    }
  },
  removeFromBlock: function removeFromBlock() {
    this.myBlocks.forEach(function (t) {
      return t.pick();
    });
    this.myBlocks.length = 0;

    if (0 == this.id) {
      this.itemRoot.blockRoot.undoTryPlace(this);
    } else {
      this.hideUnderBuffEffect();
    }

    this.checkToUpdateMaxHp();
  },
  onClickEnded: function onClickEnded(t) {
    var e = this;

    if (!this.cantDrag) {
      if (this.canUse) {
        var i = [];

        if (this.updatePreviewByPos(t.getLocation(), i)) {
          var n = i[0].node.position.add(this.offset);
          var o = new Set();
          i.forEach(function (t) {
            if (t.item) {
              o.add(t.item);
            }
          });
          var s = !1;

          if (0 != this.id && this.lv < this.getMaxLv() && 1 == o.size) {
            var c = o.values().next().value;

            if (c.id == this.id && c.lv == this.lv && i.every(function (t) {
              return t.item == c;
            })) {
              s = !0;
              c.lvup();
              this.setBgSpParent(!0);
              this.node.parent = null;
              this.itemRoot.blockRoot.resetBlocksPreview();
            }
          }

          if (!s) {
            o.forEach(function (t) {
              if (t != e) {
                t.hideLv5Effect();
                t.removeFromBlock();
                t.itemRoot.putdown(t, t.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
              }
            });
            i.forEach(function (t) {
              t.put(e);
            });
            this.myBlocks = i;

            if (0 == this.id) {
              this.itemRoot.blockRoot.tryPlace(this);
              var a = this.itemRoot.blockItemsRootNode.convertToWorldSpaceAR(n);
              this.node.position = this.node.parent.convertToNodeSpaceAR(a);
            } else {
              if (-1 == i[0].i) {
                this.node.parent = i[0].node;
                this.node.position = cc.Vec2.ZERO;
              } else {
                this.node.parent = this.itemRoot.blockItemsRootNode;
                this.node.position = n;
                this.node.zIndex = -(n.y + this.spine.node.y);
              }
            }

            this.setSelfListenEvent(!1);
            this.checkToUpdateMaxHp();

            if (0 == this.id) {
              this.itemRoot.blockRoot.resetPosesPreview();
              6 == cc.pvz.runtimeData.guide && this.itemRoot.scene.startGuide6();
            } else {
              this.itemRoot.blockRoot.resetBlocksPreview();
            }
          }

          if (1 == cc.pvz.runtimeData.guide) {
            if (0 == this.itemRoot.node.childrenCount) {
              this.itemRoot.scene.startGuide2();
            } else {
              this.itemRoot.scene.updateMoveFinger();
            }
          }

          if (3 == cc.pvz.runtimeData.guide) {
            if (0 == this.itemRoot.node.childrenCount) {
              this.itemRoot.scene.startGuide4();
            } else {
              this.itemRoot.scene.updateMoveFinger();
            }
          }

          if (6 == cc.pvz.runtimeData.guide) {
            if (0 == this.id) {
              this.itemRoot.scene.hideMoveFinger();
            } else {
              this.itemRoot.scene.updateMoveFinger();
            }
          }

          if (7 == cc.pvz.runtimeData.guide) {
            if (0 == this.itemRoot.node.childrenCount) {
              this.itemRoot.scene.startGuide8();
            } else {
              this.itemRoot.scene.updateMoveFinger();
            }
          }
        } else {
          this.hideLv5Effect();
          this.removeFromBlock();
          this.itemRoot.putdown(this, t.getLocation());

          if (0 == this.id) {
            this.itemRoot.blockRoot.resetPosesPreview();
          } else {
            this.itemRoot.blockRoot.resetBlocksPreview();
          }

          1 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
          3 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
          6 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
          7 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
        }

        if (0 != this.id) {
          var r = t.getLocation().sub(this.clickWPos);

          if (Math.abs(r.x) < 16 && Math.abs(r.y) < 16) {
            cc.popupManager.popup("game", "plantInfo2", "UIGameToolInfo", {
              scale: !1
            }, this.id, this.lv);
          }
        }

        this.hideLines();
        this.itemRoot.layoutChildren();
      } else {
        if (cc.pvz.TAUtils.getSwitchAd()) {
          this.hideLines();
          cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["广告格子"], function (i) {
            if (i) {
              e.unlockAd();
              e.onClickEnded(t);
              e.itemRoot.scene.saveRuntimeData();
            } else {
              e.removeFromBlock();
              e.itemRoot.putdown(e, t.getLocation());

              if (0 == e.id) {
                e.itemRoot.blockRoot.resetPosesPreview();
              } else {
                e.itemRoot.blockRoot.resetBlocksPreview();
              }
            }
          });
        } else {
          cc.popupManager.popup("game", "bagbuyUI", "UIBuyBlock", {
            scale: !1
          }, this);
        }
      }
    }
  },
  checkToUpdateMaxHp: function checkToUpdateMaxHp() {
    this.itemRoot.scene.onItemChanged();
  },
  initHeroNodes: function initHeroNodes() {
    var t = this.hero.node.position.add(this.barPos.mul(0.82));

    if (this.barNode) {//
    } else {
      this.barNode = this.barPrefab.addNode(t);
      this.hpBar = cc.find("hp", this.barNode).getComponent(cc.ProgressBar);
      this.cdBar = cc.find("cd", this.barNode).getComponent(cc.ProgressBar);
      this.shieldBar = cc.find("dun", this.barNode).getComponent(cc.ProgressBar);
    }

    this.barNode.active = !0;
    this.barNode.position = t;
    this.hpBar.progress = 1;
    this.shieldBar.progress = 0;
    this.angerEff = null;
    this.lv1 = cc.pvz.PlayerData.getToolData(this.id).lv - 1;
    this.cdMs = 1e3 * this.json.cd;
    this.reloadMs = 1e3 * (Array.isArray(this.json.bulletcd) ? this.json.bulletcd[this.lv1] : this.json.bulletcd);

    if (this.near10 && cc.pvz.runtimeData.hasEnableBuff(1004)) {
      this.cdMs *= 0.8;
    }

    this.hpBar.progress = 1;
    this.shieldBar.progress = 0;
    this.enabled = !0;

    if (3 == this.id || 6 == this.id || 8 == this.id || 10 == this.id) {
      this.inCoolDown = !0;
      this.bulletCount = 0;
      this.cdBar.progress = 0;
      this.startReloadTimer();
    } else {
      this.onReloadReady();
    }
  },
  startHeroLogic: function startHeroLogic(t, e) {
    this.barPrefab = t;
    this.scene = e; // 隐藏格子和等级显示（非新手引导状态）

    if (!cc.pvz.runtimeData.showGame1st) {
      if (this.bgSp && this.bgSp.node) {
        this.bgSp.node.active = false;
      }

      if (this.lvSp && this.lvSp.node) {
        this.lvSp.node.active = false;
      }
    }

    if (6 == this.id) {
      var n = this.myBlocks[0].i;
      this.crossItems = [];
      var self = this;
      this.itemRoot.blockRoot.getCrossItems(this.id, n, function (t) {
        self.crossItems.push(t);
      });
    }
  },
  onReloadReady: function onReloadReady() {
    this.inCoolDown = !1;
    this.cdBar.progress = 1;
    this.reloadT1 = -1;
    this.reloadT2 = -1;
    this.bulletCount = this.json.bullet;

    if (2 == this.id && cc.pvz.runtimeData.hasEnableBuff(203)) {
      this.bulletCount += this.json.bullet / 2;
    }
  },
  onCDReady: function onCDReady() {
    this.inCoolDown = !1;
  },
  stopHeroLogic: function stopHeroLogic() {
    if (this.barNode) {
      this.barNode.parent = null;
      this.barNode = null;
    }

    this.enabled = !1; // 恢复格子和等级显示（非新手引导状态）

    if (!cc.pvz.runtimeData.showGame1st) {
      if (this.bgSp && this.bgSp.node) {
        this.bgSp.node.active = true;
      }

      if (this.lvSp && this.lvSp.node) {
        this.lvSp.node.active = true;
      }
    }

    if (this.hero.hp <= 0) {
      this.hero.reborn();
      this.hero.showBuffEffect("revive", !0);
    } else {
      if (this.hero.hp < this.maxHp) {
        this.hero.showBuffEffect("HP", !0);
      }
    }

    this.hero.setAnimation(0, "Idle", !0, null);
    this.hero.destroy();
    this.hero = null;
  },
  checkToStartReloadTimer: function checkToStartReloadTimer() {
    if (this.bulletCount <= 0) {
      this.startReloadTimer();
    }
  },
  startReloadTimer: function startReloadTimer() {
    var t = this.reloadMs;

    if (this.checkBuff(202)) {
      t /= 2;
    }

    if (this.checkBuff(301)) {
      t *= 0.8;
    }

    if (this.checkBuff(603)) {
      t *= 0.8;
    }

    if (this.checkBuff(801)) {
      t *= 0.8;
    }

    if (this.checkBuff(1003)) {
      t *= 0.8;
    }

    if (this.checkBuff(703)) {
      t *= 0.7;
    }

    if (this.checkBuff(902)) {
      t *= 0.8;
    }

    if (this.checkBuff(1103)) {
      t *= 0.8;
    }

    if (this.checkBuff(1202)) {
      t *= 0.8;
    }

    this.reloadT1 = cc.pvz.time;
    this.reloadT2 = cc.pvz.time + t;
  },
  startAngerMode: function startAngerMode() {
    this.spine.timeScale = 2;

    if (-1 != this.reloadT1) {
      var t = cc.pvz.time - this.reloadT1;
      this.reloadT1 += t / 2;
      this.reloadT2 += t / 2;
    }

    if (this.hero.hp > 0) {
      if (this.angerEff) {
        this.angerEff.node.position = this.hero.node.position;
        this.angerEff.node.active = !0;
      } else {
        var e = this.scene.accBuffPrefab.addNode(this.hero.node.position);
        this.angerEff = e.getComponent(sp.Skeleton);
        this.angerEff.setAnimation(0, "accelerate", !0);
      }
    }
  },
  stopAngerMode: function stopAngerMode() {
    this.spine.timeScale = 1;

    if (-1 != this.reloadT1) {
      var t = cc.pvz.time - this.reloadT1;
      this.reloadT1 -= t;
      this.reloadT2 -= t;
    }

    if (this.angerEff) {
      this.angerEff.node.active = !1;
    }
  },
  update: function update() {
    if (this.hero && this.hero.scene && !this.hero.scene.timePaused && !this.hero.scene.hasEnded && !(this.hasDie || this.hero.hp <= 0)) {
      var t = this.hero.scene.isAngerPressed;

      if (this.inCoolDown) {
        if (-1 != this.reloadT1) {
          var e = cc.pvz.time - this.reloadT1;

          if (t) {
            e *= 2;
          }

          if (this.reloadT1 + e >= this.reloadT2) {
            this.onReloadReady();
          } else {
            this.cdBar.progress = e / (this.reloadT2 - this.reloadT1);
          }
        }
      } else if (this.hero.tryShoot({
        lv: this.lv
      }) && (this.hero.playSound(), this.inCoolDown = !0, t && 1 != this.json.bullet || (this.bulletCount--, this.cdBar.progress = this.bulletCount / this.json.bullet), this.bulletCount > 0)) {
        var i;

        if (t) {
          i = this.cdMs / 2;
        } else {
          i = this.cdMs;
        }

        this.scene.setTimeout(this.onCDReady.bind(this), i);
      }
    }
  },
  getMaxHp: function getMaxHp() {
    var t = cc.pvz.PlayerData.getToolData(this.id).lv;
    var e = this.json.attribute1[t - 1];

    if (this.lv > 0) {
      e *= this.json.fightlvup1[this.lv - 1] / 100;
    }

    e *= 1 + 0.01 * cc.pvz.runtimeData.getBuffValue(1);

    if (this.near6 && cc.pvz.runtimeData.hasEnableBuff(604)) {
      e *= 1.1;
    }

    if (this.checkBuff(402)) {
      e *= 1.3;
    }

    return e;
  },
  updateMaxHp: function updateMaxHp() {
    var t = this.getMaxHp();
    var e = t - this.maxHp;
    this.maxHp = t;

    if (this.hero) {
      this.hero.hp += e;
    }
  },
  updateHp: function updateHp(t) {
    this.hpBar.progress = t;
  },
  updateShield: function updateShield(t) {
    this.shieldBar.progress = t;
    this.scene.updateShield();
  },
  checkBuff: function checkBuff(t) {
    var e = (t - t % 100) / 100;
    return this.id == e && cc.pvz.runtimeData.hasEnableBuff(t);
  },
  initSameIDLvLine: function initSameIDLvLine() {
    var t = this;
    this.setBgSpParent(!0);

    if (0 != this.id && this.lv < this.getMaxLv()) {
      var e = function e(_e) {
        var i = _e.getComponent("Item");

        if (i && i != t && i.id == t.id && i.lv == t.lv) {
          var n = t.itemRoot.linePrefab.addNodeTo(t.node, t.spine.node.position.add(cc.v2(0, 45))).getComponent(sp.Skeleton);
          var o = n.findBone("IK");
          var s = i.spine.node.convertToWorldSpaceAR(cc.v2(0, 45));
          t.lineIKBones.push({
            spine: n,
            IKBone: o,
            wPos: s
          });
        }
      };

      this.lineIKBones.length = 0;
      this.itemRoot.blockItemsRootNode.children.forEach(function (t) {
        return e(t);
      });
      this.itemRoot.node.children.forEach(function (t) {
        return e(t);
      });
      this.updateLineIKBones();
    }
  },
  updateLineIKBones: function updateLineIKBones() {
    if (0 != this.id) {
      this.lineIKBones.forEach(function (t) {
        var e = t.spine.node.convertToNodeSpaceAR(t.wPos);
        t.IKBone.x = e.x;
        t.IKBone.y = e.y;
      });
    }
  },
  hideLines: function hideLines() {
    this.setBgSpParent(!(this.myBlocks.length > 0));

    if (0 != this.id) {
      this.lineIKBones.forEach(function (t) {
        t.spine.node.parent = null;
      });
      this.lineIKBones.length = 0;
    }
  },
  setBgSpParent: function setBgSpParent(t) {
    if (this.bgSp) {
      if (t) {
        if (this.bgSp.node.parent != this.node) {
          this.bgSp.node.zIndex = -1;
          this.bgSp.node.position = cc.Vec2.ZERO;
          this.bgSp.node.parent = this.node;
        }
      } else if (this.node.parent && this.bgSp.node.parent == this.node) {
        var e = this.bgSp.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.bgSp.node.parent = this.itemRoot.blockRoot.boardItemBgsRoot;
        this.bgSp.node.position = this.bgSp.node.parent.convertToNodeSpaceAR(e);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSXRlbS5qcyJdLCJuYW1lcyI6WyJpIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ4eXMiLCJWZWMyIiwib2Zmc2V0IiwiaWQiLCJpZDBUeXBlIiwibHYiLCJsdlNwIiwiU3ByaXRlIiwiYmdTcCIsImhhc0FkIiwiYWRBbmkiLCJhZFN1cE9mZnNldCIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsInJpZ2hNYXJnaW4iLCJiYXJQb3MiLCJ2MiIsImF0dE9mZnNldCIsIm9uTG9hZCIsImVuYWJsZWQiLCJzZXRTZWxmTGlzdGVuRXZlbnQiLCJ0Iiwibm9kZSIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwib25DbGlja0JlZ2FuIiwiVE9VQ0hfTU9WRSIsIm9uQ2xpY2tNb3ZlZCIsIlRPVUNIX0VORCIsIm9uQ2xpY2tFbmRlZCIsIlRPVUNIX0NBTkNFTCIsIm9mZiIsInVwZGF0ZUx2QmxvY2tzIiwicHZ6IiwidXRpbHMiLCJzZXRTcHJpdGVGcmFtZSIsImpzb24iLCJsYXR0aWNlMiIsImNhbnREcmFnIiwiZGVmYXVsdEFuaW1hdGlvbiIsInNldEFuaW1hdGlvbiIsImx2dXAiLCJjaGVja1RvVXBkYXRlTWF4SHAiLCJzaG93THZ1cEVmZmVjdCIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlpFUk8iLCJpdGVtUm9vdCIsInNjZW5lIiwiaHViIiwiaW5pdEJ5IiwiZSIsIm4iLCJoZXJvSnNvbkZpbGUiLCJuZWFyNiIsImZvckVhY2giLCJwdXQiLCJteUJsb2NrcyIsIm8iLCJwb3NpdGlvbiIsImFkZCIsInpJbmRleCIsInkiLCJjYW5Vc2UiLCJzZXRCZ1NwUGFyZW50IiwiaGVybyIsImFuZ2VyRWZmIiwibGluZUlLQm9uZXMiLCJnZXRNYXhMdiIsIlBsYXllckRhdGEiLCJnZXRUb29sRGF0YSIsInNob3dVbmRlckJ1ZmZFZmZlY3QiLCJidWZmTm9kZSIsImFjdGl2ZSIsImJ1ZmZFZmZlY3QiLCJhZGROb2RlVG8iLCJoaWRlVW5kZXJCdWZmRWZmZWN0IiwidXBkYXRlTHY1RWZmZWN0IiwiaGlkZUx2NUVmZmVjdCIsImx2NUZsYWdOb2RlIiwic2V0Q2FuRHJhZyIsIm9wYWNpdHkiLCJ1cGRhdGVQcmV2aWV3QnlQb3MiLCJibG9ja1Jvb3QiLCJ0ZXN0QmxvY2siLCJ0ZXN0SXRlbSIsImxvY2tCeUFkIiwiZ2V0Q29tcG9uZW50IiwiZmluZCIsInVubG9ja0FkIiwiaXNWYWxpZCIsIlRBVXRpbHMiLCJ0cmFjayIsIm1lc3NhZ2UiLCJzdGFjayIsInBpY2t1cEZyb21Cb2FyZCIsImhhc01vdmVkIiwiY2xpY2tXUG9zIiwicmVtb3ZlRnJvbUJsb2NrIiwiZ2V0TG9jYXRpb24iLCJwaWNrdXAiLCJpbml0U2FtZUlETHZMaW5lIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJ1cGRhdGVMaW5lSUtCb25lcyIsInBpY2siLCJsZW5ndGgiLCJ1bmRvVHJ5UGxhY2UiLCJTZXQiLCJpdGVtIiwicyIsInNpemUiLCJjIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIiwiZXZlcnkiLCJyZXNldEJsb2Nrc1ByZXZpZXciLCJwdXRkb3duIiwidHJ5UGxhY2UiLCJhIiwiYmxvY2tJdGVtc1Jvb3ROb2RlIiwicmVzZXRQb3Nlc1ByZXZpZXciLCJydW50aW1lRGF0YSIsImd1aWRlIiwic3RhcnRHdWlkZTYiLCJjaGlsZHJlbkNvdW50Iiwic3RhcnRHdWlkZTIiLCJ1cGRhdGVNb3ZlRmluZ2VyIiwic3RhcnRHdWlkZTQiLCJoaWRlTW92ZUZpbmdlciIsInN0YXJ0R3VpZGU4IiwiciIsInN1YiIsIk1hdGgiLCJhYnMiLCJ4IiwicG9wdXBNYW5hZ2VyIiwicG9wdXAiLCJzY2FsZSIsImhpZGVMaW5lcyIsImxheW91dENoaWxkcmVuIiwiZ2V0U3dpdGNoQWQiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwic2F2ZVJ1bnRpbWVEYXRhIiwib25JdGVtQ2hhbmdlZCIsImluaXRIZXJvTm9kZXMiLCJtdWwiLCJiYXJOb2RlIiwiYmFyUHJlZmFiIiwiYWRkTm9kZSIsImhwQmFyIiwiUHJvZ3Jlc3NCYXIiLCJjZEJhciIsInNoaWVsZEJhciIsInByb2dyZXNzIiwibHYxIiwiY2RNcyIsImNkIiwicmVsb2FkTXMiLCJBcnJheSIsImlzQXJyYXkiLCJidWxsZXRjZCIsIm5lYXIxMCIsImhhc0VuYWJsZUJ1ZmYiLCJpbkNvb2xEb3duIiwiYnVsbGV0Q291bnQiLCJzdGFydFJlbG9hZFRpbWVyIiwib25SZWxvYWRSZWFkeSIsInN0YXJ0SGVyb0xvZ2ljIiwic2hvd0dhbWUxc3QiLCJjcm9zc0l0ZW1zIiwic2VsZiIsImdldENyb3NzSXRlbXMiLCJwdXNoIiwicmVsb2FkVDEiLCJyZWxvYWRUMiIsImJ1bGxldCIsIm9uQ0RSZWFkeSIsInN0b3BIZXJvTG9naWMiLCJocCIsInJlYm9ybiIsInNob3dCdWZmRWZmZWN0IiwibWF4SHAiLCJkZXN0cm95IiwiY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXIiLCJjaGVja0J1ZmYiLCJ0aW1lIiwic3RhcnRBbmdlck1vZGUiLCJ0aW1lU2NhbGUiLCJhY2NCdWZmUHJlZmFiIiwic3RvcEFuZ2VyTW9kZSIsInVwZGF0ZSIsInRpbWVQYXVzZWQiLCJoYXNFbmRlZCIsImhhc0RpZSIsImlzQW5nZXJQcmVzc2VkIiwidHJ5U2hvb3QiLCJwbGF5U291bmQiLCJzZXRUaW1lb3V0IiwiYmluZCIsImdldE1heEhwIiwiYXR0cmlidXRlMSIsImZpZ2h0bHZ1cDEiLCJnZXRCdWZmVmFsdWUiLCJ1cGRhdGVNYXhIcCIsInVwZGF0ZUhwIiwidXBkYXRlU2hpZWxkIiwibGluZVByZWZhYiIsImZpbmRCb25lIiwiSUtCb25lIiwid1BvcyIsImNoaWxkcmVuIiwiYm9hcmRJdGVtQmdzUm9vdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxDQUFDLEdBQUcsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QixL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aUYsTUFBZixDQUFzQkMsb0JBQXRCLENBQTJDcEQsQ0FBM0MsQ0FBMUI7TUFDSDtJQUNKO0VBQ0o7QUFwcEJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpID0gW1wiYmFpX1wiLCBcImx2X1wiLCBcImxhbl9cIiwgXCJ6aV9cIiwgXCJjaGVuZ19cIl07XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgeHlzOiBbY2MuVmVjMl0sXG4gICAgICAgIG9mZnNldDogY2MuVmVjMixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGlkMFR5cGU6IDAsXG4gICAgICAgIGx2OiAwLFxuICAgICAgICBsdlNwOiBjYy5TcHJpdGUsXG4gICAgICAgIGJnU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgaGFzQWQ6ICExLFxuICAgICAgICBhZEFuaTogXCJcIixcbiAgICAgICAgYWRTdXBPZmZzZXQ6IGNjLlZlYzIsXG4gICAgICAgIHNwaW5lOiBzcC5Ta2VsZXRvbixcbiAgICAgICAgcmlnaE1hcmdpbjogNTMsXG4gICAgICAgIGJhclBvczoge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MudjIoMCwgMTIwKVxuICAgICAgICB9LFxuICAgICAgICBhdHRPZmZzZXQ6IGNjLlZlYzJcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSAhMTtcbiAgICB9LFxuICAgIHNldFNlbGZMaXN0ZW5FdmVudDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vbkNsaWNrQmVnYW4sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25DbGlja0JlZ2FuLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vbkNsaWNrTW92ZWQsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUx2QmxvY2tzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJnU3ApIHtcbiAgICAgICAgICAgIGNjLnB2ei51dGlscy5zZXRTcHJpdGVGcmFtZSh0aGlzLmJnU3AsIFwidWlJbWFnZVwiLCBcImdlemkvXCIgKyBpW3RoaXMubHZdICsgdGhpcy5qc29uLmxhdHRpY2UyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sdlNwKSB7XG4gICAgICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWUodGhpcy5sdlNwLCBcInVpSW1hZ2VcIiwgXCJpdGVtL1wiICsgKHRoaXMubHYgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3BpbmUpIHtcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5jYW50RHJhZyA/IChcImJsYWNrX1wiICsgKHRoaXMubHYgKyAxKSkgOiBcIklkbGVcIjtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiA9IHQ7XG4gICAgICAgICAgICB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbigwLCB0LCAhMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGx2dXA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAhMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmx2Kys7XG4gICAgICAgIHRoaXMudXBkYXRlTHZCbG9ja3MoKTtcbiAgICAgICAgdGhpcy5jaGVja1RvVXBkYXRlTWF4SHAoKTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0x2dXBFZmZlY3QoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0x2dXBFZmZlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUuaHViLnNob3dMdnVwRWZmZWN0KHQpO1xuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbVJvb3QgPSB0O1xuICAgICAgICB0aGlzLmpzb24gPSB0aGlzLml0ZW1Sb290LnNjZW5lLmhlcm9Kc29uRmlsZS5qc29uW3RoaXMuaWQgLSAxXTtcbiAgICAgICAgdGhpcy5uZWFyNiA9ICExO1xuICAgICAgICB0aGlzLmx2ID0gZTtcbiAgICAgICAgdGhpcy51cGRhdGVMdkJsb2NrcygpO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdC5wdXQobik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubXlCbG9ja3MgPSBpO1xuICAgICAgICAgICAgdmFyIG8gPSBpWzBdLm5vZGUucG9zaXRpb24uYWRkKHRoaXMub2Zmc2V0KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IG87XG4gICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLShvLnkgKyB0aGlzLnNwaW5lLm5vZGUueSk7XG4gICAgICAgICAgICB0aGlzLmNhblVzZSA9ICEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5teUJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jYW5Vc2UgPSAhdGhpcy5oYXNBZDtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZkxpc3RlbkV2ZW50KCEwKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oZXJvID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmdlckVmZiA9IG51bGw7XG4gICAgICAgIHRoaXMubGluZUlLQm9uZXMgPSBbXTtcbiAgICB9LFxuICAgIGdldE1heEx2OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YSh0aGlzLmlkKS5sdiA+PSA1KSB7XG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93VW5kZXJCdWZmRWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZOb2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLml0ZW1Sb290LmJ1ZmZFZmZlY3QuYWRkTm9kZVRvKHRoaXMubm9kZSwgdGhpcy5zcGluZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZOb2RlID0gdDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZVVuZGVyQnVmZkVmZmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5idWZmTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5idWZmTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTHY1RWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubHY7XG4gICAgfSxcbiAgICBoaWRlTHY1RWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmx2NUZsYWdOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmx2NUZsYWdOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRDYW5EcmFnOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5zcGluZSkge1xuICAgICAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24oMCwgdCA/IFwiSWRsZVwiIDogKFwiYmxhY2tfXCIgKyAodGhpcy5sdiArIDEpKSwgITApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW50RHJhZyA9ICF0O1xuICAgIH0sXG4gICAgdXBkYXRlUHJldmlld0J5UG9zOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QudGVzdEJsb2NrKHRoaXMsIHQsIGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnRlc3RJdGVtKHRoaXMsIHQsIGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2NrQnlBZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0LmFkZE5vZGVUbyh0aGlzLm5vZGUpO1xuICAgICAgICBlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbikuc2V0QW5pbWF0aW9uKDAsIHRoaXMuYWRBbmksICEwKTtcbiAgICAgICAgY2MuZmluZChcImFkXCIsIGUpLnBvc2l0aW9uID0gdGhpcy5hZFN1cE9mZnNldDtcbiAgICAgICAgdGhpcy5oYXNBZCA9ICEwO1xuICAgICAgICB0aGlzLmNhblVzZSA9ICExO1xuICAgIH0sXG4gICAgdW5sb2NrQWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdmFyIHQgPSBjYy5maW5kKFwiYWRcIiwgdGhpcy5ub2RlKTtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhblVzZSA9ICEwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFjayhcImVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJ1bmxvY2tBZFwiLFxuICAgICAgICAgICAgICAgICAgICBzdGFjazogXCJub0FkTm9kZSwgaWQ6XCIgKyB0aGlzLmlkICsgXCIsbHY6XCIgKyB0aGlzLmx2XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBpY2t1cEZyb21Cb2FyZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FudERyYWcpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhc01vdmVkID0gITE7XG4gICAgICAgICAgICB0aGlzLmNsaWNrV1BvcyA9IHQ7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21CbG9jaygpO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5waWNrdXBGcm9tQm9hcmQodGhpcywgdCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByZXZpZXdCeVBvcyh0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja0JlZ2FuOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FudERyYWcpIHtcbiAgICAgICAgICAgIHZhciBlID0gdC5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5oYXNNb3ZlZCA9ICExO1xuICAgICAgICAgICAgdGhpcy5jbGlja1dQb3MgPSBlO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5waWNrdXAodGhpcywgZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByZXZpZXdCeVBvcyhlKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNhbWVJREx2TGluZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrTW92ZWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnREcmFnKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYXNNb3ZlZCA9ICEwO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0LmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmV2aWV3QnlQb3ModC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGluZUlLQm9uZXMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRnJvbUJsb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubXlCbG9ja3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQucGljaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5teUJsb2Nrcy5sZW5ndGggPSAwO1xuICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC51bmRvVHJ5UGxhY2UodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVVbmRlckJ1ZmZFZmZlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrVG9VcGRhdGVNYXhIcCgpO1xuICAgIH0sXG4gICAgb25DbGlja0VuZGVkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5jYW50RHJhZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FuVXNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51cGRhdGVQcmV2aWV3QnlQb3ModC5nZXRMb2NhdGlvbigpLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IGlbMF0ubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5vZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5hZGQodC5pdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzID0gITE7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwICE9IHRoaXMuaWQgJiYgdGhpcy5sdiA8IHRoaXMuZ2V0TWF4THYoKSAmJiAxID09IG8uc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBvLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmlkID09IHRoaXMuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmx2ID09IHRoaXMubHYgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmV2ZXJ5KGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lml0ZW0gPT0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcyA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubHZ1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodCAhPSBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQuaGlkZUx2NUVmZmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnJlbW92ZUZyb21CbG9jaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Lml0ZW1Sb290LnB1dGRvd24odCwgdC5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHV0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm15QmxvY2tzID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC50cnlQbGFjZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IHRoaXMuaXRlbVJvb3QuYmxvY2tJdGVtc1Jvb3ROb2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTEgPT0gaVswXS5pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQgPSBpWzBdLm5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50ID0gdGhpcy5pdGVtUm9vdC5ibG9ja0l0ZW1zUm9vdE5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IG47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS56SW5kZXggPSAtKG4ueSArIHRoaXMuc3BpbmUubm9kZS55KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGZMaXN0ZW5FdmVudCghMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVG9VcGRhdGVNYXhIcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0UG9zZXNQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNiA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlNigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldEJsb2Nrc1ByZXZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoMSA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlMigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoMyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoNiA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLmhpZGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICg3ID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdGhpcy5pdGVtUm9vdC5ub2RlLmNoaWxkcmVuQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnN0YXJ0R3VpZGU4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlTHY1RWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUJsb2NrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QucHV0ZG93bih0aGlzLCB0LmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldFBvc2VzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgMSA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIDMgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlICYmIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICA2ID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSAmJiB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgNyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgwICE9IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSB0LmdldExvY2F0aW9uKCkuc3ViKHRoaXMuY2xpY2tXUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHIueCkgPCAxNiAmJiBNYXRoLmFicyhyLnkpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsYW50SW5mbzJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZVRvb2xJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sdlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVMaW5lcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QubGF5b3V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5UQVV0aWxzLmdldFN3aXRjaEFkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlTGluZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LkFkVXRpbHMuc2hvd0FkUmV3YXJkVmlkZW8oY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5bm/5ZGK5qC85a2QXCJdLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnVubG9ja0FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5vbkNsaWNrRW5kZWQodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pdGVtUm9vdC5zY2VuZS5zYXZlUnVudGltZURhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5yZW1vdmVGcm9tQmxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLml0ZW1Sb290LnB1dGRvd24oZSwgdC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSBlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0UG9zZXNQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFnYnV5VUlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlCdXlCbG9ja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoZWNrVG9VcGRhdGVNYXhIcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLm9uSXRlbUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGluaXRIZXJvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLmhlcm8ubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5iYXJQb3MubXVsKDAuODIpKTtcbiAgICAgICAgaWYgKHRoaXMuYmFyTm9kZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFyTm9kZSA9IHRoaXMuYmFyUHJlZmFiLmFkZE5vZGUodCk7XG4gICAgICAgICAgICB0aGlzLmhwQmFyID0gY2MuZmluZChcImhwXCIsIHRoaXMuYmFyTm9kZSkuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgICAgIHRoaXMuY2RCYXIgPSBjYy5maW5kKFwiY2RcIiwgdGhpcy5iYXJOb2RlKS5nZXRDb21wb25lbnQoY2MuUHJvZ3Jlc3NCYXIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGRCYXIgPSBjYy5maW5kKFwiZHVuXCIsIHRoaXMuYmFyTm9kZSkuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJhck5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgIHRoaXMuYmFyTm9kZS5wb3NpdGlvbiA9IHQ7XG4gICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSAxO1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5wcm9ncmVzcyA9IDA7XG4gICAgICAgIHRoaXMuYW5nZXJFZmYgPSBudWxsO1xuICAgICAgICB0aGlzLmx2MSA9IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKHRoaXMuaWQpLmx2IC0gMTtcbiAgICAgICAgdGhpcy5jZE1zID0gMWUzICogdGhpcy5qc29uLmNkO1xuICAgICAgICB0aGlzLnJlbG9hZE1zID0gMWUzICogKEFycmF5LmlzQXJyYXkodGhpcy5qc29uLmJ1bGxldGNkKSA/IHRoaXMuanNvbi5idWxsZXRjZFt0aGlzLmx2MV0gOiB0aGlzLmpzb24uYnVsbGV0Y2QpO1xuICAgICAgICBpZiAodGhpcy5uZWFyMTAgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTAwNCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2RNcyAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ocEJhci5wcm9ncmVzcyA9IDE7XG4gICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gMDtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gITA7XG4gICAgICAgIGlmICgzID09IHRoaXMuaWQgfHwgNiA9PSB0aGlzLmlkIHx8IDggPT0gdGhpcy5pZCB8fCAxMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmluQ29vbERvd24gPSAhMDtcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0Q291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5jZEJhci5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UmVsb2FkVGltZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25SZWxvYWRSZWFkeSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydEhlcm9Mb2dpYzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdGhpcy5iYXJQcmVmYWIgPSB0O1xuICAgICAgICB0aGlzLnNjZW5lID0gZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOmakOiXj+agvOWtkOWSjOetiee6p+aYvuekuu+8iOmdnuaWsOaJi+W8leWvvOeKtuaAge+8iVxuICAgICAgICBpZiAoIWNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmdTcCAmJiB0aGlzLmJnU3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubHZTcCAmJiB0aGlzLmx2U3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubHZTcC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoNiA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMubXlCbG9ja3NbMF0uaTtcbiAgICAgICAgICAgIHRoaXMuY3Jvc3NJdGVtcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QuZ2V0Q3Jvc3NJdGVtcyh0aGlzLmlkLCBuLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3Jvc3NJdGVtcy5wdXNoKHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uUmVsb2FkUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbkNvb2xEb3duID0gITE7XG4gICAgICAgIHRoaXMuY2RCYXIucHJvZ3Jlc3MgPSAxO1xuICAgICAgICB0aGlzLnJlbG9hZFQxID0gLTE7XG4gICAgICAgIHRoaXMucmVsb2FkVDIgPSAtMTtcbiAgICAgICAgdGhpcy5idWxsZXRDb3VudCA9IHRoaXMuanNvbi5idWxsZXQ7XG4gICAgICAgIGlmICgyID09IHRoaXMuaWQgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMjAzKSkge1xuICAgICAgICAgICAgdGhpcy5idWxsZXRDb3VudCArPSB0aGlzLmpzb24uYnVsbGV0IC8gMjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DRFJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5Db29sRG93biA9ICExO1xuICAgIH0sXG4gICAgc3RvcEhlcm9Mb2dpYzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5iYXJOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJhck5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYmFyTm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgICAgIFxuICAgICAgICAvLyDmgaLlpI3moLzlrZDlkoznrYnnuqfmmL7npLrvvIjpnZ7mlrDmiYvlvJXlr7znirbmgIHvvIlcbiAgICAgICAgaWYgKCFjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJnU3AgJiYgdGhpcy5iZ1NwLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubHZTcCAmJiB0aGlzLmx2U3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubHZTcC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmhlcm8uaHAgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5oZXJvLnJlYm9ybigpO1xuICAgICAgICAgICAgdGhpcy5oZXJvLnNob3dCdWZmRWZmZWN0KFwicmV2aXZlXCIsICEwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm8uaHAgPCB0aGlzLm1heEhwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvLnNob3dCdWZmRWZmZWN0KFwiSFBcIiwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVyby5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgdGhpcy5oZXJvLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5oZXJvID0gbnVsbDtcbiAgICB9LFxuICAgIGNoZWNrVG9TdGFydFJlbG9hZFRpbWVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJ1bGxldENvdW50IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSZWxvYWRUaW1lcigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydFJlbG9hZFRpbWVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5yZWxvYWRNcztcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDIwMikpIHtcbiAgICAgICAgICAgIHQgLz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMzAxKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDYwMykpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig4MDEpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTAwMykpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig3MDMpKSB7XG4gICAgICAgICAgICB0ICo9IDAuNztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoOTAyKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDExMDMpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTIwMikpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVsb2FkVDEgPSBjYy5wdnoudGltZTtcbiAgICAgICAgdGhpcy5yZWxvYWRUMiA9IGNjLnB2ei50aW1lICsgdDtcbiAgICB9LFxuICAgIHN0YXJ0QW5nZXJNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BpbmUudGltZVNjYWxlID0gMjtcbiAgICAgICAgaWYgKC0xICE9IHRoaXMucmVsb2FkVDEpIHtcbiAgICAgICAgICAgIHZhciB0ID0gY2MucHZ6LnRpbWUgLSB0aGlzLnJlbG9hZFQxO1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRUMSArPSB0IC8gMjtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkVDIgKz0gdCAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGVyby5ocCA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFuZ2VyRWZmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmdlckVmZi5ub2RlLnBvc2l0aW9uID0gdGhpcy5oZXJvLm5vZGUucG9zaXRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5hbmdlckVmZi5ub2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMuc2NlbmUuYWNjQnVmZlByZWZhYi5hZGROb2RlKHRoaXMuaGVyby5ub2RlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRWZmID0gZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJFZmYuc2V0QW5pbWF0aW9uKDAsIFwiYWNjZWxlcmF0ZVwiLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0b3BBbmdlck1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGluZS50aW1lU2NhbGUgPSAxO1xuICAgICAgICBpZiAoLTEgIT0gdGhpcy5yZWxvYWRUMSkge1xuICAgICAgICAgICAgdmFyIHQgPSBjYy5wdnoudGltZSAtIHRoaXMucmVsb2FkVDE7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZFQxIC09IHQ7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZFQyIC09IHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYW5nZXJFZmYpIHtcbiAgICAgICAgICAgIHRoaXMuYW5nZXJFZmYubm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaGVybyAmJlxuICAgICAgICAgICAgdGhpcy5oZXJvLnNjZW5lICYmXG4gICAgICAgICAgICAhdGhpcy5oZXJvLnNjZW5lLnRpbWVQYXVzZWQgJiZcbiAgICAgICAgICAgICF0aGlzLmhlcm8uc2NlbmUuaGFzRW5kZWQgJiZcbiAgICAgICAgICAgICEodGhpcy5oYXNEaWUgfHwgdGhpcy5oZXJvLmhwIDw9IDApXG4gICAgICAgICkge1xuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLmhlcm8uc2NlbmUuaXNBbmdlclByZXNzZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5pbkNvb2xEb3duKSB7XG4gICAgICAgICAgICAgICAgaWYgKC0xICE9IHRoaXMucmVsb2FkVDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBjYy5wdnoudGltZSAtIHRoaXMucmVsb2FkVDE7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICo9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVsb2FkVDEgKyBlID49IHRoaXMucmVsb2FkVDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25SZWxvYWRSZWFkeSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZEJhci5wcm9ncmVzcyA9IGUgLyAodGhpcy5yZWxvYWRUMiAtIHRoaXMucmVsb2FkVDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm8udHJ5U2hvb3Qoe1xuICAgICAgICAgICAgICAgICAgICBsdjogdGhpcy5sdlxuICAgICAgICAgICAgICAgIH0pICYmXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVyby5wbGF5U291bmQoKSxcbiAgICAgICAgICAgICAgICAodGhpcy5pbkNvb2xEb3duID0gITApLFxuICAgICAgICAgICAgICAgICh0ICYmIDEgIT0gdGhpcy5qc29uLmJ1bGxldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYnVsbGV0Q291bnQtLSwgKHRoaXMuY2RCYXIucHJvZ3Jlc3MgPSB0aGlzLmJ1bGxldENvdW50IC8gdGhpcy5qc29uLmJ1bGxldCkpLFxuICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0Q291bnQgPiAwKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaSA9IHRoaXMuY2RNcyAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaSA9IHRoaXMuY2RNcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5zZXRUaW1lb3V0KHRoaXMub25DRFJlYWR5LmJpbmQodGhpcyksIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRNYXhIcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKHRoaXMuaWQpLmx2O1xuICAgICAgICB2YXIgZSA9IHRoaXMuanNvbi5hdHRyaWJ1dGUxW3QgLSAxXTtcbiAgICAgICAgaWYgKHRoaXMubHYgPiAwKSB7XG4gICAgICAgICAgICBlICo9IHRoaXMuanNvbi5maWdodGx2dXAxW3RoaXMubHYgLSAxXSAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICBlICo9IDEgKyAwLjAxICogY2MucHZ6LnJ1bnRpbWVEYXRhLmdldEJ1ZmZWYWx1ZSgxKTtcbiAgICAgICAgaWYgKHRoaXMubmVhcjYgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoNjA0KSkge1xuICAgICAgICAgICAgZSAqPSAxLjE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDQwMikpIHtcbiAgICAgICAgICAgIGUgKj0gMS4zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgdXBkYXRlTWF4SHA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLmdldE1heEhwKCk7XG4gICAgICAgIHZhciBlID0gdCAtIHRoaXMubWF4SHA7XG4gICAgICAgIHRoaXMubWF4SHAgPSB0O1xuICAgICAgICBpZiAodGhpcy5oZXJvKSB7XG4gICAgICAgICAgICB0aGlzLmhlcm8uaHAgKz0gZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSHA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSB0O1xuICAgIH0sXG4gICAgdXBkYXRlU2hpZWxkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5wcm9ncmVzcyA9IHQ7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlU2hpZWxkKCk7XG4gICAgfSxcbiAgICBjaGVja0J1ZmY6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gKHQgLSAodCAlIDEwMCkpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcy5pZCA9PSBlICYmIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKHQpO1xuICAgIH0sXG4gICAgaW5pdFNhbWVJREx2TGluZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghMCk7XG4gICAgICAgIGlmICgwICE9IHRoaXMuaWQgJiYgdGhpcy5sdiA8IHRoaXMuZ2V0TWF4THYoKSkge1xuICAgICAgICAgICAgdmFyIGUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZS5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgICAgIGlmIChpICYmIGkgIT0gdCAmJiBpLmlkID09IHQuaWQgJiYgaS5sdiA9PSB0Lmx2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuID0gdC5pdGVtUm9vdC5saW5lUHJlZmFiXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkTm9kZVRvKHQubm9kZSwgdC5zcGluZS5ub2RlLnBvc2l0aW9uLmFkZChjYy52MigwLCA0NSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gbi5maW5kQm9uZShcIklLXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGkuc3BpbmUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIoMCwgNDUpKTtcbiAgICAgICAgICAgICAgICAgICAgdC5saW5lSUtCb25lcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwaW5lOiBuLFxuICAgICAgICAgICAgICAgICAgICAgICAgSUtCb25lOiBvLFxuICAgICAgICAgICAgICAgICAgICAgICAgd1Bvczogc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja0l0ZW1zUm9vdE5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlKHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290Lm5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlKHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxpbmVJS0JvbmVzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUxpbmVJS0JvbmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgwICE9IHRoaXMuaWQpIHtcbiAgICAgICAgICAgIHRoaXMubGluZUlLQm9uZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdC5zcGluZS5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKHQud1Bvcyk7XG4gICAgICAgICAgICAgICAgdC5JS0JvbmUueCA9IGUueDtcbiAgICAgICAgICAgICAgICB0LklLQm9uZS55ID0gZS55O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhpZGVMaW5lczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldEJnU3BQYXJlbnQoISh0aGlzLm15QmxvY2tzLmxlbmd0aCA+IDApKTtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdC5zcGluZS5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubGluZUlLQm9uZXMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QmdTcFBhcmVudDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuYmdTcCkge1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZ1NwLm5vZGUucGFyZW50ICE9IHRoaXMubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS56SW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ1NwLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubm9kZS5wYXJlbnQgJiYgdGhpcy5iZ1NwLm5vZGUucGFyZW50ID09IHRoaXMubm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5iZ1NwLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgICAgICAgICAgICAgdGhpcy5iZ1NwLm5vZGUucGFyZW50ID0gdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QuYm9hcmRJdGVtQmdzUm9vdDtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5wb3NpdGlvbiA9IHRoaXMuYmdTcC5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pOyJdfQ==