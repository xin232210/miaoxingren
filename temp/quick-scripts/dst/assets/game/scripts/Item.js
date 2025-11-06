
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
    if (this.hero && !this.hero.scene.timePaused && !this.hero.scene.hasEnded && !(this.hasDie || this.hero.hp <= 0)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSXRlbS5qcyJdLCJuYW1lcyI6WyJpIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ4eXMiLCJWZWMyIiwib2Zmc2V0IiwiaWQiLCJpZDBUeXBlIiwibHYiLCJsdlNwIiwiU3ByaXRlIiwiYmdTcCIsImhhc0FkIiwiYWRBbmkiLCJhZFN1cE9mZnNldCIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsInJpZ2hNYXJnaW4iLCJiYXJQb3MiLCJ2MiIsImF0dE9mZnNldCIsIm9uTG9hZCIsImVuYWJsZWQiLCJzZXRTZWxmTGlzdGVuRXZlbnQiLCJ0Iiwibm9kZSIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwib25DbGlja0JlZ2FuIiwiVE9VQ0hfTU9WRSIsIm9uQ2xpY2tNb3ZlZCIsIlRPVUNIX0VORCIsIm9uQ2xpY2tFbmRlZCIsIlRPVUNIX0NBTkNFTCIsIm9mZiIsInVwZGF0ZUx2QmxvY2tzIiwicHZ6IiwidXRpbHMiLCJzZXRTcHJpdGVGcmFtZSIsImpzb24iLCJsYXR0aWNlMiIsImNhbnREcmFnIiwiZGVmYXVsdEFuaW1hdGlvbiIsInNldEFuaW1hdGlvbiIsImx2dXAiLCJjaGVja1RvVXBkYXRlTWF4SHAiLCJzaG93THZ1cEVmZmVjdCIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlpFUk8iLCJpdGVtUm9vdCIsInNjZW5lIiwiaHViIiwiaW5pdEJ5IiwiZSIsIm4iLCJoZXJvSnNvbkZpbGUiLCJuZWFyNiIsImZvckVhY2giLCJwdXQiLCJteUJsb2NrcyIsIm8iLCJwb3NpdGlvbiIsImFkZCIsInpJbmRleCIsInkiLCJjYW5Vc2UiLCJzZXRCZ1NwUGFyZW50IiwiaGVybyIsImFuZ2VyRWZmIiwibGluZUlLQm9uZXMiLCJnZXRNYXhMdiIsIlBsYXllckRhdGEiLCJnZXRUb29sRGF0YSIsInNob3dVbmRlckJ1ZmZFZmZlY3QiLCJidWZmTm9kZSIsImFjdGl2ZSIsImJ1ZmZFZmZlY3QiLCJhZGROb2RlVG8iLCJoaWRlVW5kZXJCdWZmRWZmZWN0IiwidXBkYXRlTHY1RWZmZWN0IiwiaGlkZUx2NUVmZmVjdCIsImx2NUZsYWdOb2RlIiwic2V0Q2FuRHJhZyIsIm9wYWNpdHkiLCJ1cGRhdGVQcmV2aWV3QnlQb3MiLCJibG9ja1Jvb3QiLCJ0ZXN0QmxvY2siLCJ0ZXN0SXRlbSIsImxvY2tCeUFkIiwiZ2V0Q29tcG9uZW50IiwiZmluZCIsInVubG9ja0FkIiwiaXNWYWxpZCIsIlRBVXRpbHMiLCJ0cmFjayIsIm1lc3NhZ2UiLCJzdGFjayIsInBpY2t1cEZyb21Cb2FyZCIsImhhc01vdmVkIiwiY2xpY2tXUG9zIiwicmVtb3ZlRnJvbUJsb2NrIiwiZ2V0TG9jYXRpb24iLCJwaWNrdXAiLCJpbml0U2FtZUlETHZMaW5lIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJ1cGRhdGVMaW5lSUtCb25lcyIsInBpY2siLCJsZW5ndGgiLCJ1bmRvVHJ5UGxhY2UiLCJTZXQiLCJpdGVtIiwicyIsInNpemUiLCJjIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIiwiZXZlcnkiLCJyZXNldEJsb2Nrc1ByZXZpZXciLCJwdXRkb3duIiwidHJ5UGxhY2UiLCJhIiwiYmxvY2tJdGVtc1Jvb3ROb2RlIiwicmVzZXRQb3Nlc1ByZXZpZXciLCJydW50aW1lRGF0YSIsImd1aWRlIiwic3RhcnRHdWlkZTYiLCJjaGlsZHJlbkNvdW50Iiwic3RhcnRHdWlkZTIiLCJ1cGRhdGVNb3ZlRmluZ2VyIiwic3RhcnRHdWlkZTQiLCJoaWRlTW92ZUZpbmdlciIsInN0YXJ0R3VpZGU4IiwiciIsInN1YiIsIk1hdGgiLCJhYnMiLCJ4IiwicG9wdXBNYW5hZ2VyIiwicG9wdXAiLCJzY2FsZSIsImhpZGVMaW5lcyIsImxheW91dENoaWxkcmVuIiwiZ2V0U3dpdGNoQWQiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwic2F2ZVJ1bnRpbWVEYXRhIiwib25JdGVtQ2hhbmdlZCIsImluaXRIZXJvTm9kZXMiLCJtdWwiLCJiYXJOb2RlIiwiYmFyUHJlZmFiIiwiYWRkTm9kZSIsImhwQmFyIiwiUHJvZ3Jlc3NCYXIiLCJjZEJhciIsInNoaWVsZEJhciIsInByb2dyZXNzIiwibHYxIiwiY2RNcyIsImNkIiwicmVsb2FkTXMiLCJBcnJheSIsImlzQXJyYXkiLCJidWxsZXRjZCIsIm5lYXIxMCIsImhhc0VuYWJsZUJ1ZmYiLCJpbkNvb2xEb3duIiwiYnVsbGV0Q291bnQiLCJzdGFydFJlbG9hZFRpbWVyIiwib25SZWxvYWRSZWFkeSIsInN0YXJ0SGVyb0xvZ2ljIiwic2hvd0dhbWUxc3QiLCJjcm9zc0l0ZW1zIiwic2VsZiIsImdldENyb3NzSXRlbXMiLCJwdXNoIiwicmVsb2FkVDEiLCJyZWxvYWRUMiIsImJ1bGxldCIsIm9uQ0RSZWFkeSIsInN0b3BIZXJvTG9naWMiLCJocCIsInJlYm9ybiIsInNob3dCdWZmRWZmZWN0IiwibWF4SHAiLCJkZXN0cm95IiwiY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXIiLCJjaGVja0J1ZmYiLCJ0aW1lIiwic3RhcnRBbmdlck1vZGUiLCJ0aW1lU2NhbGUiLCJhY2NCdWZmUHJlZmFiIiwic3RvcEFuZ2VyTW9kZSIsInVwZGF0ZSIsInRpbWVQYXVzZWQiLCJoYXNFbmRlZCIsImhhc0RpZSIsImlzQW5nZXJQcmVzc2VkIiwidHJ5U2hvb3QiLCJwbGF5U291bmQiLCJzZXRUaW1lb3V0IiwiYmluZCIsImdldE1heEhwIiwiYXR0cmlidXRlMSIsImZpZ2h0bHZ1cDEiLCJnZXRCdWZmVmFsdWUiLCJ1cGRhdGVNYXhIcCIsInVwZGF0ZUhwIiwidXBkYXRlU2hpZWxkIiwibGluZVByZWZhYiIsImZpbmRCb25lIiwiSUtCb25lIiwid1BvcyIsImNoaWxkcmVuIiwiYm9hcmRJdGVtQmdzUm9vdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxDQUFDLEdBQUcsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QixL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LENBQTNDLENBQTFCO01BQ0g7SUFDSjtFQUNKO0FBbnBCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaSA9IFtcImJhaV9cIiwgXCJsdl9cIiwgXCJsYW5fXCIsIFwiemlfXCIsIFwiY2hlbmdfXCJdO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHh5czogW2NjLlZlYzJdLFxuICAgICAgICBvZmZzZXQ6IGNjLlZlYzIsXG4gICAgICAgIGlkOiAxLFxuICAgICAgICBpZDBUeXBlOiAwLFxuICAgICAgICBsdjogMCxcbiAgICAgICAgbHZTcDogY2MuU3ByaXRlLFxuICAgICAgICBiZ1NwOiBjYy5TcHJpdGUsXG4gICAgICAgIGhhc0FkOiAhMSxcbiAgICAgICAgYWRBbmk6IFwiXCIsXG4gICAgICAgIGFkU3VwT2Zmc2V0OiBjYy5WZWMyLFxuICAgICAgICBzcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIHJpZ2hNYXJnaW46IDUzLFxuICAgICAgICBiYXJQb3M6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLnYyKDAsIDEyMClcbiAgICAgICAgfSxcbiAgICAgICAgYXR0T2Zmc2V0OiBjYy5WZWMyXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgfSxcbiAgICBzZXRTZWxmTGlzdGVuRXZlbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25DbGlja0JlZ2FuLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uQ2xpY2tNb3ZlZCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uQ2xpY2tCZWdhbiwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5vbkNsaWNrRW5kZWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVMdkJsb2NrczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5iZ1NwKSB7XG4gICAgICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWUodGhpcy5iZ1NwLCBcInVpSW1hZ2VcIiwgXCJnZXppL1wiICsgaVt0aGlzLmx2XSArIHRoaXMuanNvbi5sYXR0aWNlMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubHZTcCkge1xuICAgICAgICAgICAgY2MucHZ6LnV0aWxzLnNldFNwcml0ZUZyYW1lKHRoaXMubHZTcCwgXCJ1aUltYWdlXCIsIFwiaXRlbS9cIiArICh0aGlzLmx2ICsgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNwaW5lKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMuY2FudERyYWcgPyAoXCJibGFja19cIiArICh0aGlzLmx2ICsgMSkpIDogXCJJZGxlXCI7XG4gICAgICAgICAgICB0aGlzLnNwaW5lLmRlZmF1bHRBbmltYXRpb24gPSB0O1xuICAgICAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24oMCwgdCwgITApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBsdnVwOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodm9pZCAwID09PSB0KSB7XG4gICAgICAgICAgICB0ID0gITA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sdisrO1xuICAgICAgICB0aGlzLnVwZGF0ZUx2QmxvY2tzKCk7XG4gICAgICAgIHRoaXMuY2hlY2tUb1VwZGF0ZU1heEhwKCk7XG4gICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICB0aGlzLnNob3dMdnVwRWZmZWN0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob3dMdnVwRWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pO1xuICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLmh1Yi5zaG93THZ1cEVmZmVjdCh0KTtcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1Sb290ID0gdDtcbiAgICAgICAgdGhpcy5qc29uID0gdGhpcy5pdGVtUm9vdC5zY2VuZS5oZXJvSnNvbkZpbGUuanNvblt0aGlzLmlkIC0gMV07XG4gICAgICAgIHRoaXMubmVhcjYgPSAhMTtcbiAgICAgICAgdGhpcy5sdiA9IGU7XG4gICAgICAgIHRoaXMudXBkYXRlTHZCbG9ja3MoKTtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIGkuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHQucHV0KG4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm15QmxvY2tzID0gaTtcbiAgICAgICAgICAgIHZhciBvID0gaVswXS5ub2RlLnBvc2l0aW9uLmFkZCh0aGlzLm9mZnNldCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSBvO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnpJbmRleCA9IC0oby55ICsgdGhpcy5zcGluZS5ub2RlLnkpO1xuICAgICAgICAgICAgdGhpcy5jYW5Vc2UgPSAhMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXlCbG9ja3MgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2FuVXNlID0gIXRoaXMuaGFzQWQ7XG4gICAgICAgICAgICB0aGlzLnNldFNlbGZMaXN0ZW5FdmVudCghMCk7XG4gICAgICAgICAgICB0aGlzLnNldEJnU3BQYXJlbnQoITApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVybyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5nZXJFZmYgPSBudWxsO1xuICAgICAgICB0aGlzLmxpbmVJS0JvbmVzID0gW107XG4gICAgfSxcbiAgICBnZXRNYXhMdjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEodGhpcy5pZCkubHYgPj0gNSkge1xuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd1VuZGVyQnVmZkVmZmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5idWZmTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5idWZmTm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5pdGVtUm9vdC5idWZmRWZmZWN0LmFkZE5vZGVUbyh0aGlzLm5vZGUsIHRoaXMuc3BpbmUucG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5idWZmTm9kZSA9IHQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhpZGVVbmRlckJ1ZmZFZmZlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnVmZk5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZk5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUx2NUVmZmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmx2O1xuICAgIH0sXG4gICAgaGlkZUx2NUVmZmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5sdjVGbGFnTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5sdjVGbGFnTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0Q2FuRHJhZzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUuc2V0QW5pbWF0aW9uKDAsIHQgPyBcIklkbGVcIiA6IChcImJsYWNrX1wiICsgKHRoaXMubHYgKyAxKSksICEwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FudERyYWcgPSAhdDtcbiAgICB9LFxuICAgIHVwZGF0ZVByZXZpZXdCeVBvczogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKDAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnRlc3RCbG9jayh0aGlzLCB0LCBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC50ZXN0SXRlbSh0aGlzLCB0LCBlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9ja0J5QWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdC5hZGROb2RlVG8odGhpcy5ub2RlKTtcbiAgICAgICAgZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pLnNldEFuaW1hdGlvbigwLCB0aGlzLmFkQW5pLCAhMCk7XG4gICAgICAgIGNjLmZpbmQoXCJhZFwiLCBlKS5wb3NpdGlvbiA9IHRoaXMuYWRTdXBPZmZzZXQ7XG4gICAgICAgIHRoaXMuaGFzQWQgPSAhMDtcbiAgICAgICAgdGhpcy5jYW5Vc2UgPSAhMTtcbiAgICB9LFxuICAgIHVubG9ja0FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHZhciB0ID0gY2MuZmluZChcImFkXCIsIHRoaXMubm9kZSk7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQuYWN0aXZlID0gITE7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5Vc2UgPSAhMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlRBVXRpbHMudHJhY2soXCJlcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwidW5sb2NrQWRcIixcbiAgICAgICAgICAgICAgICAgICAgc3RhY2s6IFwibm9BZE5vZGUsIGlkOlwiICsgdGhpcy5pZCArIFwiLGx2OlwiICsgdGhpcy5sdlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBwaWNrdXBGcm9tQm9hcmQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnREcmFnKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYXNNb3ZlZCA9ICExO1xuICAgICAgICAgICAgdGhpcy5jbGlja1dQb3MgPSB0O1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tQmxvY2soKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QucGlja3VwRnJvbUJvYXJkKHRoaXMsIHQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmV2aWV3QnlQb3ModCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xpY2tCZWdhbjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhbnREcmFnKSB7XG4gICAgICAgICAgICB2YXIgZSA9IHQuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuaGFzTW92ZWQgPSAhMTtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tXUG9zID0gZTtcbiAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QucGlja3VwKHRoaXMsIGUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmV2aWV3QnlQb3MoZSk7XG4gICAgICAgICAgICB0aGlzLmluaXRTYW1lSURMdkxpbmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja01vdmVkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5jYW50RHJhZykge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzTW92ZWQgPSAhMDtcbiAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIodC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJldmlld0J5UG9zKHQuZ2V0TG9jYXRpb24oKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxpbmVJS0JvbmVzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUZyb21CbG9jazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm15QmxvY2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LnBpY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubXlCbG9ja3MubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKDAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QudW5kb1RyeVBsYWNlKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oaWRlVW5kZXJCdWZmRWZmZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja1RvVXBkYXRlTWF4SHAoKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tFbmRlZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuY2FudERyYWcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhblVzZSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXBkYXRlUHJldmlld0J5UG9zKHQuZ2V0TG9jYXRpb24oKSwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBpWzBdLm5vZGUucG9zaXRpb24uYWRkKHRoaXMub2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIGkuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uYWRkKHQuaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9ICExO1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCAhPSB0aGlzLmlkICYmIHRoaXMubHYgPCB0aGlzLmdldE1heEx2KCkgJiYgMSA9PSBvLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gby52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5pZCA9PSB0aGlzLmlkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5sdiA9PSB0aGlzLmx2ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5ldmVyeShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5pdGVtID09IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmx2dXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEJnU3BQYXJlbnQoITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0QmxvY2tzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgby5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgIT0gZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LmhpZGVMdjVFZmZlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5yZW1vdmVGcm9tQmxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5pdGVtUm9vdC5wdXRkb3duKHQsIHQubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1dChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5teUJsb2NrcyA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QudHJ5UGxhY2UodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSB0aGlzLml0ZW1Sb290LmJsb2NrSXRlbXNSb290Tm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIobik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0xID09IGlbMF0uaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50ID0gaVswXS5ub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IHRoaXMuaXRlbVJvb3QuYmxvY2tJdGVtc1Jvb3ROb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLShuLnkgKyB0aGlzLnNwaW5lLm5vZGUueSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxmTGlzdGVuRXZlbnQoITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1RvVXBkYXRlTWF4SHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldFBvc2VzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDYgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlICYmIHRoaXMuaXRlbVJvb3Quc2NlbmUuc3RhcnRHdWlkZTYoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLml0ZW1Sb290Lm5vZGUuY2hpbGRyZW5Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUuc3RhcnRHdWlkZTIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKDMgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLml0ZW1Sb290Lm5vZGUuY2hpbGRyZW5Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUuc3RhcnRHdWlkZTQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKDYgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5oaWRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoNyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlOCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUx2NUVmZmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21CbG9jaygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnB1dGRvd24odGhpcywgdC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRQb3Nlc1ByZXZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0QmxvY2tzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDEgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlICYmIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAzID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSAmJiB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgNiA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIDcgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlICYmIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoMCAhPSB0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByID0gdC5nZXRMb2NhdGlvbigpLnN1Yih0aGlzLmNsaWNrV1Bvcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhyLngpIDwgMTYgJiYgTWF0aC5hYnMoci55KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbGFudEluZm8yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVSUdhbWVUb29sSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubHZcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTGluZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmxheW91dENoaWxkcmVuKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjYy5wdnouVEFVdGlscy5nZXRTd2l0Y2hBZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUxpbmVzKCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnB2ei5BZFV0aWxzLnNob3dBZFJld2FyZFZpZGVvKGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuW5v+WRiuagvOWtkFwiXSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS51bmxvY2tBZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUub25DbGlja0VuZGVkKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaXRlbVJvb3Quc2NlbmUuc2F2ZVJ1bnRpbWVEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucmVtb3ZlRnJvbUJsb2NrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pdGVtUm9vdC5wdXRkb3duKGUsIHQuZ2V0TG9jYXRpb24oKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldFBvc2VzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0QmxvY2tzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJhZ2J1eVVJXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVJQnV5QmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja1RvVXBkYXRlTWF4SHA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5vbkl0ZW1DaGFuZ2VkKCk7XG4gICAgfSxcbiAgICBpbml0SGVyb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5oZXJvLm5vZGUucG9zaXRpb24uYWRkKHRoaXMuYmFyUG9zLm11bCgwLjgyKSk7XG4gICAgICAgIGlmICh0aGlzLmJhck5vZGUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhck5vZGUgPSB0aGlzLmJhclByZWZhYi5hZGROb2RlKHQpO1xuICAgICAgICAgICAgdGhpcy5ocEJhciA9IGNjLmZpbmQoXCJocFwiLCB0aGlzLmJhck5vZGUpLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0Jhcik7XG4gICAgICAgICAgICB0aGlzLmNkQmFyID0gY2MuZmluZChcImNkXCIsIHRoaXMuYmFyTm9kZSkuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgICAgIHRoaXMuc2hpZWxkQmFyID0gY2MuZmluZChcImR1blwiLCB0aGlzLmJhck5vZGUpLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0Jhcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iYXJOb2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICB0aGlzLmJhck5vZGUucG9zaXRpb24gPSB0O1xuICAgICAgICB0aGlzLmhwQmFyLnByb2dyZXNzID0gMTtcbiAgICAgICAgdGhpcy5zaGllbGRCYXIucHJvZ3Jlc3MgPSAwO1xuICAgICAgICB0aGlzLmFuZ2VyRWZmID0gbnVsbDtcbiAgICAgICAgdGhpcy5sdjEgPSBjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YSh0aGlzLmlkKS5sdiAtIDE7XG4gICAgICAgIHRoaXMuY2RNcyA9IDFlMyAqIHRoaXMuanNvbi5jZDtcbiAgICAgICAgdGhpcy5yZWxvYWRNcyA9IDFlMyAqIChBcnJheS5pc0FycmF5KHRoaXMuanNvbi5idWxsZXRjZCkgPyB0aGlzLmpzb24uYnVsbGV0Y2RbdGhpcy5sdjFdIDogdGhpcy5qc29uLmJ1bGxldGNkKTtcbiAgICAgICAgaWYgKHRoaXMubmVhcjEwICYmIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDEwMDQpKSB7XG4gICAgICAgICAgICB0aGlzLmNkTXMgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSAxO1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5wcm9ncmVzcyA9IDA7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9ICEwO1xuICAgICAgICBpZiAoMyA9PSB0aGlzLmlkIHx8IDYgPT0gdGhpcy5pZCB8fCA4ID09IHRoaXMuaWQgfHwgMTAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdGhpcy5pbkNvb2xEb3duID0gITA7XG4gICAgICAgICAgICB0aGlzLmJ1bGxldENvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuY2RCYXIucHJvZ3Jlc3MgPSAwO1xuICAgICAgICAgICAgdGhpcy5zdGFydFJlbG9hZFRpbWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uUmVsb2FkUmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RhcnRIZXJvTG9naWM6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgICAgIHRoaXMuYmFyUHJlZmFiID0gdDtcbiAgICAgICAgdGhpcy5zY2VuZSA9IGU7XG4gICAgICAgIFxuICAgICAgICAvLyDpmpDol4/moLzlrZDlkoznrYnnuqfmmL7npLrvvIjpnZ7mlrDmiYvlvJXlr7znirbmgIHvvIlcbiAgICAgICAgaWYgKCFjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJnU3AgJiYgdGhpcy5iZ1NwLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmx2U3AgJiYgdGhpcy5sdlNwLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmx2U3Aubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKDYgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLm15QmxvY2tzWzBdLmk7XG4gICAgICAgICAgICB0aGlzLmNyb3NzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LmdldENyb3NzSXRlbXModGhpcy5pZCwgbiwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNyb3NzSXRlbXMucHVzaCh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJlbG9hZFJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5Db29sRG93biA9ICExO1xuICAgICAgICB0aGlzLmNkQmFyLnByb2dyZXNzID0gMTtcbiAgICAgICAgdGhpcy5yZWxvYWRUMSA9IC0xO1xuICAgICAgICB0aGlzLnJlbG9hZFQyID0gLTE7XG4gICAgICAgIHRoaXMuYnVsbGV0Q291bnQgPSB0aGlzLmpzb24uYnVsbGV0O1xuICAgICAgICBpZiAoMiA9PSB0aGlzLmlkICYmIGNjLnB2ei5ydW50aW1lRGF0YS5oYXNFbmFibGVCdWZmKDIwMykpIHtcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0Q291bnQgKz0gdGhpcy5qc29uLmJ1bGxldCAvIDI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ0RSZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluQ29vbERvd24gPSAhMTtcbiAgICB9LFxuICAgIHN0b3BIZXJvTG9naWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFyTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5iYXJOb2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmJhck5vZGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9ICExO1xuICAgICAgICBcbiAgICAgICAgLy8g5oGi5aSN5qC85a2Q5ZKM562J57qn5pi+56S677yI6Z2e5paw5omL5byV5a+854q25oCB77yJXG4gICAgICAgIGlmICghY2MucHZ6LnJ1bnRpbWVEYXRhLnNob3dHYW1lMXN0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iZ1NwICYmIHRoaXMuYmdTcC5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZ1NwLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmx2U3AgJiYgdGhpcy5sdlNwLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmx2U3Aubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5oZXJvLmhwIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuaGVyby5yZWJvcm4oKTtcbiAgICAgICAgICAgIHRoaXMuaGVyby5zaG93QnVmZkVmZmVjdChcInJldml2ZVwiLCAhMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5oZXJvLmhwIDwgdGhpcy5tYXhIcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVyby5zaG93QnVmZkVmZmVjdChcIkhQXCIsICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlcm8uc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCwgbnVsbCk7XG4gICAgICAgIHRoaXMuaGVyby5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuaGVybyA9IG51bGw7XG4gICAgfSxcbiAgICBjaGVja1RvU3RhcnRSZWxvYWRUaW1lcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5idWxsZXRDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UmVsb2FkVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RhcnRSZWxvYWRUaW1lcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXMucmVsb2FkTXM7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigyMDIpKSB7XG4gICAgICAgICAgICB0IC89IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDMwMSkpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig2MDMpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoODAxKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEwMDMpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNzAzKSkge1xuICAgICAgICAgICAgdCAqPSAwLjc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDkwMikpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMTAzKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDEyMDIpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbG9hZFQxID0gY2MucHZ6LnRpbWU7XG4gICAgICAgIHRoaXMucmVsb2FkVDIgPSBjYy5wdnoudGltZSArIHQ7XG4gICAgfSxcbiAgICBzdGFydEFuZ2VyTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwaW5lLnRpbWVTY2FsZSA9IDI7XG4gICAgICAgIGlmICgtMSAhPSB0aGlzLnJlbG9hZFQxKSB7XG4gICAgICAgICAgICB2YXIgdCA9IGNjLnB2ei50aW1lIC0gdGhpcy5yZWxvYWRUMTtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkVDEgKz0gdCAvIDI7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZFQyICs9IHQgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhlcm8uaHAgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbmdlckVmZikge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJFZmYubm9kZS5wb3NpdGlvbiA9IHRoaXMuaGVyby5ub2RlLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJFZmYubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzLnNjZW5lLmFjY0J1ZmZQcmVmYWIuYWRkTm9kZSh0aGlzLmhlcm8ubm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmdlckVmZiA9IGUuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRWZmLnNldEFuaW1hdGlvbigwLCBcImFjY2VsZXJhdGVcIiwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzdG9wQW5nZXJNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3BpbmUudGltZVNjYWxlID0gMTtcbiAgICAgICAgaWYgKC0xICE9IHRoaXMucmVsb2FkVDEpIHtcbiAgICAgICAgICAgIHZhciB0ID0gY2MucHZ6LnRpbWUgLSB0aGlzLnJlbG9hZFQxO1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRUMSAtPSB0O1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRUMiAtPSB0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFuZ2VyRWZmKSB7XG4gICAgICAgICAgICB0aGlzLmFuZ2VyRWZmLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmhlcm8gJiZcbiAgICAgICAgICAgICF0aGlzLmhlcm8uc2NlbmUudGltZVBhdXNlZCAmJlxuICAgICAgICAgICAgIXRoaXMuaGVyby5zY2VuZS5oYXNFbmRlZCAmJlxuICAgICAgICAgICAgISh0aGlzLmhhc0RpZSB8fCB0aGlzLmhlcm8uaHAgPD0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMuaGVyby5zY2VuZS5pc0FuZ2VyUHJlc3NlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmluQ29vbERvd24pIHtcbiAgICAgICAgICAgICAgICBpZiAoLTEgIT0gdGhpcy5yZWxvYWRUMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNjLnB2ei50aW1lIC0gdGhpcy5yZWxvYWRUMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKj0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWxvYWRUMSArIGUgPj0gdGhpcy5yZWxvYWRUMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJlbG9hZFJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNkQmFyLnByb2dyZXNzID0gZSAvICh0aGlzLnJlbG9hZFQyIC0gdGhpcy5yZWxvYWRUMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuaGVyby50cnlTaG9vdCh7XG4gICAgICAgICAgICAgICAgICAgIGx2OiB0aGlzLmx2XG4gICAgICAgICAgICAgICAgfSkgJiZcbiAgICAgICAgICAgICAgICAodGhpcy5oZXJvLnBsYXlTb3VuZCgpLFxuICAgICAgICAgICAgICAgICh0aGlzLmluQ29vbERvd24gPSAhMCksXG4gICAgICAgICAgICAgICAgKHQgJiYgMSAhPSB0aGlzLmpzb24uYnVsbGV0KSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5idWxsZXRDb3VudC0tLCAodGhpcy5jZEJhci5wcm9ncmVzcyA9IHRoaXMuYnVsbGV0Q291bnQgLyB0aGlzLmpzb24uYnVsbGV0KSksXG4gICAgICAgICAgICAgICAgdGhpcy5idWxsZXRDb3VudCA+IDApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICBpID0gdGhpcy5jZE1zIC8gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpID0gdGhpcy5jZE1zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLnNldFRpbWVvdXQodGhpcy5vbkNEUmVhZHkuYmluZCh0aGlzKSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldE1heEhwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEodGhpcy5pZCkubHY7XG4gICAgICAgIHZhciBlID0gdGhpcy5qc29uLmF0dHJpYnV0ZTFbdCAtIDFdO1xuICAgICAgICBpZiAodGhpcy5sdiA+IDApIHtcbiAgICAgICAgICAgIGUgKj0gdGhpcy5qc29uLmZpZ2h0bHZ1cDFbdGhpcy5sdiAtIDFdIC8gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGUgKj0gMSArIDAuMDEgKiBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDEpO1xuICAgICAgICBpZiAodGhpcy5uZWFyNiAmJiBjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig2MDQpKSB7XG4gICAgICAgICAgICBlICo9IDEuMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAyKSkge1xuICAgICAgICAgICAgZSAqPSAxLjM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICB1cGRhdGVNYXhIcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXMuZ2V0TWF4SHAoKTtcbiAgICAgICAgdmFyIGUgPSB0IC0gdGhpcy5tYXhIcDtcbiAgICAgICAgdGhpcy5tYXhIcCA9IHQ7XG4gICAgICAgIGlmICh0aGlzLmhlcm8pIHtcbiAgICAgICAgICAgIHRoaXMuaGVyby5ocCArPSBlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocEJhci5wcm9ncmVzcyA9IHQ7XG4gICAgfSxcbiAgICB1cGRhdGVTaGllbGQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gdDtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVTaGllbGQoKTtcbiAgICB9LFxuICAgIGNoZWNrQnVmZjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSAodCAtICh0ICUgMTAwKSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzLmlkID09IGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYodCk7XG4gICAgfSxcbiAgICBpbml0U2FtZUlETHZMaW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXRCZ1NwUGFyZW50KCEwKTtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5pZCAmJiB0aGlzLmx2IDwgdGhpcy5nZXRNYXhMdigpKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBlLmdldENvbXBvbmVudChcIkl0ZW1cIik7XG4gICAgICAgICAgICAgICAgaWYgKGkgJiYgaSAhPSB0ICYmIGkuaWQgPT0gdC5pZCAmJiBpLmx2ID09IHQubHYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSB0Lml0ZW1Sb290LmxpbmVQcmVmYWJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGROb2RlVG8odC5ub2RlLCB0LnNwaW5lLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIDQ1KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBuLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzID0gaS5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigwLCA0NSkpO1xuICAgICAgICAgICAgICAgICAgICB0LmxpbmVJS0JvbmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BpbmU6IG4sXG4gICAgICAgICAgICAgICAgICAgICAgICBJS0JvbmU6IG8sXG4gICAgICAgICAgICAgICAgICAgICAgICB3UG9zOiBzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmxpbmVJS0JvbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrSXRlbXNSb290Tm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGluZUlLQm9uZXMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTGluZUlLQm9uZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0LnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIodC53UG9zKTtcbiAgICAgICAgICAgICAgICB0LklLQm9uZS54ID0gZS54O1xuICAgICAgICAgICAgICAgIHQuSUtCb25lLnkgPSBlLnk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZUxpbmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghKHRoaXMubXlCbG9ja3MubGVuZ3RoID4gMCkpO1xuICAgICAgICBpZiAoMCAhPSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVJS0JvbmVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICB0LnNwaW5lLm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRCZ1NwUGFyZW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5iZ1NwKSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJnU3Aubm9kZS5wYXJlbnQgIT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLnpJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ1NwLm5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2RlLnBhcmVudCAmJiB0aGlzLmJnU3Aubm9kZS5wYXJlbnQgPT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzLmJnU3Aubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5wYXJlbnQgPSB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5ib2FyZEl0ZW1CZ3NSb290O1xuICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLnBvc2l0aW9uID0gdGhpcy5iZ1NwLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7Il19