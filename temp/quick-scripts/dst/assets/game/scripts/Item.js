
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

    this.hero.setAnimation(0, "Idle", !0, null); // 【关键修复】在销毁Hero之前，将spine节点移回到Item节点下
    // 使用更安全的方式，不依赖可能已经失效的节点

    if (this.hero.characterSpine && this.hero.characterSpine.node && this.node && this.node.isValid) {
      try {
        console.log("[Item stopHeroLogic] 将spine移回Item节点，ID:" + this.id); // 保存spine当前的active状态

        var spineActive = this.hero.characterSpine.node.active; // 直接将spine移回Item节点，使用原始位置（如果有保存的话）

        this.hero.characterSpine.node.removeFromParent(false);
        this.hero.characterSpine.node.parent = this.node; // 恢复到保存在Item上的spine初始位置

        if (this.spineInitialPos) {
          this.hero.characterSpine.node.position = this.spineInitialPos.clone();
          console.log("[Item stopHeroLogic] 恢复spine到初始位置 - ID:" + this.id + ", x:" + this.spineInitialPos.x + ", y:" + this.spineInitialPos.y);
        } else if (this.hero.characterSpineInitialPos) {
          // 回退方案1：使用Hero保存的character spine初始位置
          this.hero.characterSpine.node.position = this.hero.characterSpineInitialPos.clone();
          console.log("[Item stopHeroLogic] 使用Hero保存的character spine初始位置:", this.hero.characterSpineInitialPos);
        } else if (this.hero.itemSpineInitialPos) {
          // 回退方案2：使用plant spine的初始位置
          this.hero.characterSpine.node.position = this.hero.itemSpineInitialPos.clone();
          console.log("[Item stopHeroLogic] 使用plant spine初始位置:", this.hero.itemSpineInitialPos);
        } else {
          // 最后回退：使用(0,0)
          this.hero.characterSpine.node.position = cc.Vec2.ZERO;
          console.log("[Item stopHeroLogic] spine位置设为(0,0)");
        } // 确保spine可见


        this.hero.characterSpine.node.active = true;
        console.log("[Item stopHeroLogic] spine移回完成，ID:" + this.id);
      } catch (e) {
        console.error("[Item stopHeroLogic] 移动spine失败，ID:" + this.id + ", 错误:", e);
      }
    } else {
      console.log("[Item stopHeroLogic] 无法移动spine，ID:" + this.id + ", characterSpine:" + !!this.hero.characterSpine + ", spine.node:" + !!(this.hero.characterSpine && this.hero.characterSpine.node) + ", Item.node有效:" + !!(this.node && this.node.isValid));
    } // 保存Hero节点引用


    var heroNode = this.hero.node; // 销毁Hero组件

    this.hero.destroy();
    this.hero = null; // 【关键修复】销毁Hero节点

    if (heroNode && heroNode.isValid) {
      console.log("[Item stopHeroLogic] 销毁Hero节点，ID:" + this.id);
      heroNode.destroy();
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvSXRlbS5qcyJdLCJuYW1lcyI6WyJpIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ4eXMiLCJWZWMyIiwib2Zmc2V0IiwiaWQiLCJpZDBUeXBlIiwibHYiLCJsdlNwIiwiU3ByaXRlIiwiYmdTcCIsImhhc0FkIiwiYWRBbmkiLCJhZFN1cE9mZnNldCIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsInJpZ2hNYXJnaW4iLCJiYXJQb3MiLCJ2MiIsImF0dE9mZnNldCIsIm9uTG9hZCIsImVuYWJsZWQiLCJzZXRTZWxmTGlzdGVuRXZlbnQiLCJ0Iiwibm9kZSIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwib25DbGlja0JlZ2FuIiwiVE9VQ0hfTU9WRSIsIm9uQ2xpY2tNb3ZlZCIsIlRPVUNIX0VORCIsIm9uQ2xpY2tFbmRlZCIsIlRPVUNIX0NBTkNFTCIsIm9mZiIsInVwZGF0ZUx2QmxvY2tzIiwicHZ6IiwidXRpbHMiLCJzZXRTcHJpdGVGcmFtZSIsImpzb24iLCJsYXR0aWNlMiIsImNhbnREcmFnIiwiZGVmYXVsdEFuaW1hdGlvbiIsInNldEFuaW1hdGlvbiIsImx2dXAiLCJjaGVja1RvVXBkYXRlTWF4SHAiLCJzaG93THZ1cEVmZmVjdCIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIlpFUk8iLCJpdGVtUm9vdCIsInNjZW5lIiwiaHViIiwiaW5pdEJ5IiwiZSIsIm4iLCJoZXJvSnNvbkZpbGUiLCJuZWFyNiIsImZvckVhY2giLCJwdXQiLCJteUJsb2NrcyIsIm8iLCJwb3NpdGlvbiIsImFkZCIsInpJbmRleCIsInkiLCJjYW5Vc2UiLCJzZXRCZ1NwUGFyZW50IiwiaGVybyIsImFuZ2VyRWZmIiwibGluZUlLQm9uZXMiLCJnZXRNYXhMdiIsIlBsYXllckRhdGEiLCJnZXRUb29sRGF0YSIsInNob3dVbmRlckJ1ZmZFZmZlY3QiLCJidWZmTm9kZSIsImFjdGl2ZSIsImJ1ZmZFZmZlY3QiLCJhZGROb2RlVG8iLCJoaWRlVW5kZXJCdWZmRWZmZWN0IiwidXBkYXRlTHY1RWZmZWN0IiwiaGlkZUx2NUVmZmVjdCIsImx2NUZsYWdOb2RlIiwic2V0Q2FuRHJhZyIsIm9wYWNpdHkiLCJ1cGRhdGVQcmV2aWV3QnlQb3MiLCJibG9ja1Jvb3QiLCJ0ZXN0QmxvY2siLCJ0ZXN0SXRlbSIsImxvY2tCeUFkIiwiZ2V0Q29tcG9uZW50IiwiZmluZCIsInVubG9ja0FkIiwiaXNWYWxpZCIsIlRBVXRpbHMiLCJ0cmFjayIsIm1lc3NhZ2UiLCJzdGFjayIsInBpY2t1cEZyb21Cb2FyZCIsImhhc01vdmVkIiwiY2xpY2tXUG9zIiwicmVtb3ZlRnJvbUJsb2NrIiwiZ2V0TG9jYXRpb24iLCJwaWNrdXAiLCJpbml0U2FtZUlETHZMaW5lIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJ1cGRhdGVMaW5lSUtCb25lcyIsInBpY2siLCJsZW5ndGgiLCJ1bmRvVHJ5UGxhY2UiLCJTZXQiLCJpdGVtIiwicyIsInNpemUiLCJjIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIiwiZXZlcnkiLCJyZXNldEJsb2Nrc1ByZXZpZXciLCJwdXRkb3duIiwidHJ5UGxhY2UiLCJhIiwiYmxvY2tJdGVtc1Jvb3ROb2RlIiwicmVzZXRQb3Nlc1ByZXZpZXciLCJydW50aW1lRGF0YSIsImd1aWRlIiwic3RhcnRHdWlkZTYiLCJjaGlsZHJlbkNvdW50Iiwic3RhcnRHdWlkZTIiLCJ1cGRhdGVNb3ZlRmluZ2VyIiwic3RhcnRHdWlkZTQiLCJoaWRlTW92ZUZpbmdlciIsInN0YXJ0R3VpZGU4IiwiciIsInN1YiIsIk1hdGgiLCJhYnMiLCJ4IiwicG9wdXBNYW5hZ2VyIiwicG9wdXAiLCJzY2FsZSIsImhpZGVMaW5lcyIsImxheW91dENoaWxkcmVuIiwiZ2V0U3dpdGNoQWQiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwic2F2ZVJ1bnRpbWVEYXRhIiwib25JdGVtQ2hhbmdlZCIsImluaXRIZXJvTm9kZXMiLCJtdWwiLCJiYXJOb2RlIiwiYmFyUHJlZmFiIiwiYWRkTm9kZSIsImhwQmFyIiwiUHJvZ3Jlc3NCYXIiLCJjZEJhciIsInNoaWVsZEJhciIsInByb2dyZXNzIiwibHYxIiwiY2RNcyIsImNkIiwicmVsb2FkTXMiLCJBcnJheSIsImlzQXJyYXkiLCJidWxsZXRjZCIsIm5lYXIxMCIsImhhc0VuYWJsZUJ1ZmYiLCJpbkNvb2xEb3duIiwiYnVsbGV0Q291bnQiLCJzdGFydFJlbG9hZFRpbWVyIiwib25SZWxvYWRSZWFkeSIsInN0YXJ0SGVyb0xvZ2ljIiwic2hvd0dhbWUxc3QiLCJjcm9zc0l0ZW1zIiwic2VsZiIsImdldENyb3NzSXRlbXMiLCJwdXNoIiwicmVsb2FkVDEiLCJyZWxvYWRUMiIsImJ1bGxldCIsIm9uQ0RSZWFkeSIsInN0b3BIZXJvTG9naWMiLCJocCIsInJlYm9ybiIsInNob3dCdWZmRWZmZWN0IiwibWF4SHAiLCJjaGFyYWN0ZXJTcGluZSIsImNvbnNvbGUiLCJsb2ciLCJzcGluZUFjdGl2ZSIsInJlbW92ZUZyb21QYXJlbnQiLCJzcGluZUluaXRpYWxQb3MiLCJjbG9uZSIsImNoYXJhY3RlclNwaW5lSW5pdGlhbFBvcyIsIml0ZW1TcGluZUluaXRpYWxQb3MiLCJlcnJvciIsImhlcm9Ob2RlIiwiZGVzdHJveSIsImNoZWNrVG9TdGFydFJlbG9hZFRpbWVyIiwiY2hlY2tCdWZmIiwidGltZSIsInN0YXJ0QW5nZXJNb2RlIiwidGltZVNjYWxlIiwiYWNjQnVmZlByZWZhYiIsInN0b3BBbmdlck1vZGUiLCJ1cGRhdGUiLCJ0aW1lUGF1c2VkIiwiaGFzRW5kZWQiLCJoYXNEaWUiLCJpc0FuZ2VyUHJlc3NlZCIsInRyeVNob290IiwicGxheVNvdW5kIiwic2V0VGltZW91dCIsImJpbmQiLCJnZXRNYXhIcCIsImF0dHJpYnV0ZTEiLCJmaWdodGx2dXAxIiwiZ2V0QnVmZlZhbHVlIiwidXBkYXRlTWF4SHAiLCJ1cGRhdGVIcCIsInVwZGF0ZVNoaWVsZCIsImxpbmVQcmVmYWIiLCJmaW5kQm9uZSIsIklLQm9uZSIsIndQb3MiLCJjaGlsZHJlbiIsImJvYXJkSXRlbUJnc1Jvb3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsQ0FBQyxHQUFHLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsUUFBL0IsQ0FBUjtBQUNBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsR0FBRyxFQUFFLENBQUNKLEVBQUUsQ0FBQ0ssSUFBSixDQURHO0lBRVJDLE1BQU0sRUFBRU4sRUFBRSxDQUFDSyxJQUZIO0lBR1JFLEVBQUUsRUFBRSxDQUhJO0lBSVJDLE9BQU8sRUFBRSxDQUpEO0lBS1JDLEVBQUUsRUFBRSxDQUxJO0lBTVJDLElBQUksRUFBRVYsRUFBRSxDQUFDVyxNQU5EO0lBT1JDLElBQUksRUFBRVosRUFBRSxDQUFDVyxNQVBEO0lBUVJFLEtBQUssRUFBRSxDQUFDLENBUkE7SUFTUkMsS0FBSyxFQUFFLEVBVEM7SUFVUkMsV0FBVyxFQUFFZixFQUFFLENBQUNLLElBVlI7SUFXUlcsS0FBSyxFQUFFQyxFQUFFLENBQUNDLFFBWEY7SUFZUkMsVUFBVSxFQUFFLEVBWko7SUFhUkMsTUFBTSxFQUFFO01BQ0osV0FBU3BCLEVBQUUsQ0FBQ3FCLEVBQUgsQ0FBTSxDQUFOLEVBQVMsR0FBVDtJQURMLENBYkE7SUFnQlJDLFNBQVMsRUFBRXRCLEVBQUUsQ0FBQ0s7RUFoQk4sQ0FGUDtFQW9CTGtCLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixLQUFLQyxPQUFMLEdBQWUsQ0FBQyxDQUFoQjtFQUNILENBdEJJO0VBdUJMQyxrQkFBa0IsRUFBRSw0QkFBVUMsQ0FBVixFQUFhO0lBQzdCLElBQUlBLENBQUosRUFBTztNQUNILEtBQUtDLElBQUwsQ0FBVUMsRUFBVixDQUFhNUIsRUFBRSxDQUFDNkIsSUFBSCxDQUFRQyxTQUFSLENBQWtC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Q0FBQ0ssSUFBSCxDQUFRK0MsSUFBbEM7VUFDQSxLQUFLeEMsSUFBTCxDQUFVZSxJQUFWLENBQWVpRixNQUFmLEdBQXdCLEtBQUtqRixJQUE3QjtRQUNIO01BQ0osQ0FORCxNQU1PLElBQUksS0FBS0EsSUFBTCxDQUFVaUYsTUFBVixJQUFvQixLQUFLaEcsSUFBTCxDQUFVZSxJQUFWLENBQWVpRixNQUFmLElBQXlCLEtBQUtqRixJQUF0RCxFQUE0RDtRQUMvRCxJQUFJOEIsQ0FBQyxHQUFHLEtBQUs3QyxJQUFMLENBQVVlLElBQVYsQ0FBZXdCLHFCQUFmLENBQXFDbkQsRUFBRSxDQUFDSyxJQUFILENBQVErQyxJQUE3QyxDQUFSO1FBQ0EsS0FBS3hDLElBQUwsQ0FBVWUsSUFBVixDQUFlaUYsTUFBZixHQUF3QixLQUFLdkQsUUFBTCxDQUFjb0MsU0FBZCxDQUF3QmdKLGdCQUFoRDtRQUNBLEtBQUs3TixJQUFMLENBQVVlLElBQVYsQ0FBZXNDLFFBQWYsR0FBMEIsS0FBS3JELElBQUwsQ0FBVWUsSUFBVixDQUFlaUYsTUFBZixDQUFzQkMsb0JBQXRCLENBQTJDcEQsQ0FBM0MsQ0FBMUI7TUFDSDtJQUNKO0VBQ0o7QUEzc0JJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpID0gW1wiYmFpX1wiLCBcImx2X1wiLCBcImxhbl9cIiwgXCJ6aV9cIiwgXCJjaGVuZ19cIl07XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgeHlzOiBbY2MuVmVjMl0sXG4gICAgICAgIG9mZnNldDogY2MuVmVjMixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGlkMFR5cGU6IDAsXG4gICAgICAgIGx2OiAwLFxuICAgICAgICBsdlNwOiBjYy5TcHJpdGUsXG4gICAgICAgIGJnU3A6IGNjLlNwcml0ZSxcbiAgICAgICAgaGFzQWQ6ICExLFxuICAgICAgICBhZEFuaTogXCJcIixcbiAgICAgICAgYWRTdXBPZmZzZXQ6IGNjLlZlYzIsXG4gICAgICAgIHNwaW5lOiBzcC5Ta2VsZXRvbixcbiAgICAgICAgcmlnaE1hcmdpbjogNTMsXG4gICAgICAgIGJhclBvczoge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MudjIoMCwgMTIwKVxuICAgICAgICB9LFxuICAgICAgICBhdHRPZmZzZXQ6IGNjLlZlYzJcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSAhMTtcbiAgICB9LFxuICAgIHNldFNlbGZMaXN0ZW5FdmVudDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vbkNsaWNrQmVnYW4sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25DbGlja0JlZ2FuLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vbkNsaWNrTW92ZWQsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUx2QmxvY2tzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJnU3ApIHtcbiAgICAgICAgICAgIGNjLnB2ei51dGlscy5zZXRTcHJpdGVGcmFtZSh0aGlzLmJnU3AsIFwidWlJbWFnZVwiLCBcImdlemkvXCIgKyBpW3RoaXMubHZdICsgdGhpcy5qc29uLmxhdHRpY2UyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sdlNwKSB7XG4gICAgICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWUodGhpcy5sdlNwLCBcInVpSW1hZ2VcIiwgXCJpdGVtL1wiICsgKHRoaXMubHYgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3BpbmUpIHtcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy5jYW50RHJhZyA/IChcImJsYWNrX1wiICsgKHRoaXMubHYgKyAxKSkgOiBcIklkbGVcIjtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUuZGVmYXVsdEFuaW1hdGlvbiA9IHQ7XG4gICAgICAgICAgICB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbigwLCB0LCAhMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGx2dXA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAhMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmx2Kys7XG4gICAgICAgIHRoaXMudXBkYXRlTHZCbG9ja3MoKTtcbiAgICAgICAgdGhpcy5jaGVja1RvVXBkYXRlTWF4SHAoKTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0x2dXBFZmZlY3QoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0x2dXBFZmZlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLlZlYzIuWkVSTyk7XG4gICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUuaHViLnNob3dMdnVwRWZmZWN0KHQpO1xuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbVJvb3QgPSB0O1xuICAgICAgICB0aGlzLmpzb24gPSB0aGlzLml0ZW1Sb290LnNjZW5lLmhlcm9Kc29uRmlsZS5qc29uW3RoaXMuaWQgLSAxXTtcbiAgICAgICAgdGhpcy5uZWFyNiA9ICExO1xuICAgICAgICB0aGlzLmx2ID0gZTtcbiAgICAgICAgdGhpcy51cGRhdGVMdkJsb2NrcygpO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdC5wdXQobik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubXlCbG9ja3MgPSBpO1xuICAgICAgICAgICAgdmFyIG8gPSBpWzBdLm5vZGUucG9zaXRpb24uYWRkKHRoaXMub2Zmc2V0KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IG87XG4gICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gLShvLnkgKyB0aGlzLnNwaW5lLm5vZGUueSk7XG4gICAgICAgICAgICB0aGlzLmNhblVzZSA9ICEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5teUJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jYW5Vc2UgPSAhdGhpcy5oYXNBZDtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZkxpc3RlbkV2ZW50KCEwKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oZXJvID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmdlckVmZiA9IG51bGw7XG4gICAgICAgIHRoaXMubGluZUlLQm9uZXMgPSBbXTtcbiAgICB9LFxuICAgIGdldE1heEx2OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YSh0aGlzLmlkKS5sdiA+PSA1KSB7XG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93VW5kZXJCdWZmRWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZOb2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLml0ZW1Sb290LmJ1ZmZFZmZlY3QuYWRkTm9kZVRvKHRoaXMubm9kZSwgdGhpcy5zcGluZS5wb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZOb2RlID0gdDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZVVuZGVyQnVmZkVmZmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5idWZmTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5idWZmTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTHY1RWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubHY7XG4gICAgfSxcbiAgICBoaWRlTHY1RWZmZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmx2NUZsYWdOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmx2NUZsYWdOb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRDYW5EcmFnOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5zcGluZSkge1xuICAgICAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24oMCwgdCA/IFwiSWRsZVwiIDogKFwiYmxhY2tfXCIgKyAodGhpcy5sdiArIDEpKSwgITApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW50RHJhZyA9ICF0O1xuICAgIH0sXG4gICAgdXBkYXRlUHJldmlld0J5UG9zOiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QudGVzdEJsb2NrKHRoaXMsIHQsIGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnRlc3RJdGVtKHRoaXMsIHQsIGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2NrQnlBZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0LmFkZE5vZGVUbyh0aGlzLm5vZGUpO1xuICAgICAgICBlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbikuc2V0QW5pbWF0aW9uKDAsIHRoaXMuYWRBbmksICEwKTtcbiAgICAgICAgY2MuZmluZChcImFkXCIsIGUpLnBvc2l0aW9uID0gdGhpcy5hZFN1cE9mZnNldDtcbiAgICAgICAgdGhpcy5oYXNBZCA9ICEwO1xuICAgICAgICB0aGlzLmNhblVzZSA9ICExO1xuICAgIH0sXG4gICAgdW5sb2NrQWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdmFyIHQgPSBjYy5maW5kKFwiYWRcIiwgdGhpcy5ub2RlKTtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdC5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhblVzZSA9ICEwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouVEFVdGlscy50cmFjayhcImVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJ1bmxvY2tBZFwiLFxuICAgICAgICAgICAgICAgICAgICBzdGFjazogXCJub0FkTm9kZSwgaWQ6XCIgKyB0aGlzLmlkICsgXCIsbHY6XCIgKyB0aGlzLmx2XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBpY2t1cEZyb21Cb2FyZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FudERyYWcpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhc01vdmVkID0gITE7XG4gICAgICAgICAgICB0aGlzLmNsaWNrV1BvcyA9IHQ7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21CbG9jaygpO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5waWNrdXBGcm9tQm9hcmQodGhpcywgdCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByZXZpZXdCeVBvcyh0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja0JlZ2FuOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FudERyYWcpIHtcbiAgICAgICAgICAgIHZhciBlID0gdC5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5oYXNNb3ZlZCA9ICExO1xuICAgICAgICAgICAgdGhpcy5jbGlja1dQb3MgPSBlO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5waWNrdXAodGhpcywgZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByZXZpZXdCeVBvcyhlKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNhbWVJREx2TGluZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrTW92ZWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnREcmFnKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYXNNb3ZlZCA9ICEwO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0LmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmV2aWV3QnlQb3ModC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGluZUlLQm9uZXMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRnJvbUJsb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubXlCbG9ja3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQucGljaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5teUJsb2Nrcy5sZW5ndGggPSAwO1xuICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC51bmRvVHJ5UGxhY2UodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVVbmRlckJ1ZmZFZmZlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrVG9VcGRhdGVNYXhIcCgpO1xuICAgIH0sXG4gICAgb25DbGlja0VuZGVkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5jYW50RHJhZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FuVXNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51cGRhdGVQcmV2aWV3QnlQb3ModC5nZXRMb2NhdGlvbigpLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IGlbMF0ubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5vZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5hZGQodC5pdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzID0gITE7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwICE9IHRoaXMuaWQgJiYgdGhpcy5sdiA8IHRoaXMuZ2V0TWF4THYoKSAmJiAxID09IG8uc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBvLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmlkID09IHRoaXMuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmx2ID09IHRoaXMubHYgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmV2ZXJ5KGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lml0ZW0gPT0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcyA9ICEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubHZ1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodCAhPSBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQuaGlkZUx2NUVmZmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnJlbW92ZUZyb21CbG9jaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Lml0ZW1Sb290LnB1dGRvd24odCwgdC5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHV0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm15QmxvY2tzID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC50cnlQbGFjZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IHRoaXMuaXRlbVJvb3QuYmxvY2tJdGVtc1Jvb3ROb2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTEgPT0gaVswXS5pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQgPSBpWzBdLm5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50ID0gdGhpcy5pdGVtUm9vdC5ibG9ja0l0ZW1zUm9vdE5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IG47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS56SW5kZXggPSAtKG4ueSArIHRoaXMuc3BpbmUubm9kZS55KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGZMaXN0ZW5FdmVudCghMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVG9VcGRhdGVNYXhIcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0UG9zZXNQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNiA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlNigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldEJsb2Nrc1ByZXZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoMSA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlMigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoMyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5zY2VuZS5zdGFydEd1aWRlNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoNiA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwID09IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLmhpZGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICg3ID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdGhpcy5pdGVtUm9vdC5ub2RlLmNoaWxkcmVuQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLnN0YXJ0R3VpZGU4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlTHY1RWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUJsb2NrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QucHV0ZG93bih0aGlzLCB0LmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5yZXNldFBvc2VzUHJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgMSA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIDMgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlICYmIHRoaXMuaXRlbVJvb3Quc2NlbmUudXBkYXRlTW92ZUZpbmdlcigpO1xuICAgICAgICAgICAgICAgICAgICA2ID09IGNjLnB2ei5ydW50aW1lRGF0YS5ndWlkZSAmJiB0aGlzLml0ZW1Sb290LnNjZW5lLnVwZGF0ZU1vdmVGaW5nZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgNyA9PSBjYy5wdnoucnVudGltZURhdGEuZ3VpZGUgJiYgdGhpcy5pdGVtUm9vdC5zY2VuZS51cGRhdGVNb3ZlRmluZ2VyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgwICE9IHRoaXMuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSB0LmdldExvY2F0aW9uKCkuc3ViKHRoaXMuY2xpY2tXUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHIueCkgPCAxNiAmJiBNYXRoLmFicyhyLnkpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5wb3B1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsYW50SW5mbzJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVJR2FtZVRvb2xJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sdlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVMaW5lcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVJvb3QubGF5b3V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnB2ei5UQVV0aWxzLmdldFN3aXRjaEFkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlTGluZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgY2MucHZ6LkFkVXRpbHMuc2hvd0FkUmV3YXJkVmlkZW8oY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5bm/5ZGK5qC85a2QXCJdLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnVubG9ja0FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5vbkNsaWNrRW5kZWQodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pdGVtUm9vdC5zY2VuZS5zYXZlUnVudGltZURhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5yZW1vdmVGcm9tQmxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLml0ZW1Sb290LnB1dGRvd24oZSwgdC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PSBlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaXRlbVJvb3QuYmxvY2tSb290LnJlc2V0UG9zZXNQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pdGVtUm9vdC5ibG9ja1Jvb3QucmVzZXRCbG9ja3NQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFnYnV5VUlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlCdXlCbG9ja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoZWNrVG9VcGRhdGVNYXhIcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLml0ZW1Sb290LnNjZW5lLm9uSXRlbUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGluaXRIZXJvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLmhlcm8ubm9kZS5wb3NpdGlvbi5hZGQodGhpcy5iYXJQb3MubXVsKDAuODIpKTtcbiAgICAgICAgaWYgKHRoaXMuYmFyTm9kZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFyTm9kZSA9IHRoaXMuYmFyUHJlZmFiLmFkZE5vZGUodCk7XG4gICAgICAgICAgICB0aGlzLmhwQmFyID0gY2MuZmluZChcImhwXCIsIHRoaXMuYmFyTm9kZSkuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgICAgIHRoaXMuY2RCYXIgPSBjYy5maW5kKFwiY2RcIiwgdGhpcy5iYXJOb2RlKS5nZXRDb21wb25lbnQoY2MuUHJvZ3Jlc3NCYXIpO1xuICAgICAgICAgICAgdGhpcy5zaGllbGRCYXIgPSBjYy5maW5kKFwiZHVuXCIsIHRoaXMuYmFyTm9kZSkuZ2V0Q29tcG9uZW50KGNjLlByb2dyZXNzQmFyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJhck5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgIHRoaXMuYmFyTm9kZS5wb3NpdGlvbiA9IHQ7XG4gICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSAxO1xuICAgICAgICB0aGlzLnNoaWVsZEJhci5wcm9ncmVzcyA9IDA7XG4gICAgICAgIHRoaXMuYW5nZXJFZmYgPSBudWxsO1xuICAgICAgICB0aGlzLmx2MSA9IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFRvb2xEYXRhKHRoaXMuaWQpLmx2IC0gMTtcbiAgICAgICAgdGhpcy5jZE1zID0gMWUzICogdGhpcy5qc29uLmNkO1xuICAgICAgICB0aGlzLnJlbG9hZE1zID0gMWUzICogKEFycmF5LmlzQXJyYXkodGhpcy5qc29uLmJ1bGxldGNkKSA/IHRoaXMuanNvbi5idWxsZXRjZFt0aGlzLmx2MV0gOiB0aGlzLmpzb24uYnVsbGV0Y2QpO1xuICAgICAgICBpZiAodGhpcy5uZWFyMTAgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMTAwNCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2RNcyAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ocEJhci5wcm9ncmVzcyA9IDE7XG4gICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gMDtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gITA7XG4gICAgICAgIGlmICgzID09IHRoaXMuaWQgfHwgNiA9PSB0aGlzLmlkIHx8IDggPT0gdGhpcy5pZCB8fCAxMCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmluQ29vbERvd24gPSAhMDtcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0Q291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5jZEJhci5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UmVsb2FkVGltZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25SZWxvYWRSZWFkeSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydEhlcm9Mb2dpYzogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgdGhpcy5iYXJQcmVmYWIgPSB0O1xuICAgICAgICB0aGlzLnNjZW5lID0gZTtcbiAgICAgICAgXG4gICAgICAgIC8vIOmakOiXj+agvOWtkOWSjOetiee6p+aYvuekuu+8iOmdnuaWsOaJi+W8leWvvOeKtuaAge+8iVxuICAgICAgICBpZiAoIWNjLnB2ei5ydW50aW1lRGF0YS5zaG93R2FtZTFzdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmdTcCAmJiB0aGlzLmJnU3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubHZTcCAmJiB0aGlzLmx2U3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubHZTcC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoNiA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMubXlCbG9ja3NbMF0uaTtcbiAgICAgICAgICAgIHRoaXMuY3Jvc3NJdGVtcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5pdGVtUm9vdC5ibG9ja1Jvb3QuZ2V0Q3Jvc3NJdGVtcyh0aGlzLmlkLCBuLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3Jvc3NJdGVtcy5wdXNoKHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uUmVsb2FkUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbkNvb2xEb3duID0gITE7XG4gICAgICAgIHRoaXMuY2RCYXIucHJvZ3Jlc3MgPSAxO1xuICAgICAgICB0aGlzLnJlbG9hZFQxID0gLTE7XG4gICAgICAgIHRoaXMucmVsb2FkVDIgPSAtMTtcbiAgICAgICAgdGhpcy5idWxsZXRDb3VudCA9IHRoaXMuanNvbi5idWxsZXQ7XG4gICAgICAgIGlmICgyID09IHRoaXMuaWQgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYoMjAzKSkge1xuICAgICAgICAgICAgdGhpcy5idWxsZXRDb3VudCArPSB0aGlzLmpzb24uYnVsbGV0IC8gMjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DRFJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5Db29sRG93biA9ICExO1xuICAgIH0sXG4gICAgc3RvcEhlcm9Mb2dpYzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5iYXJOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJhck5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYmFyTm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVkID0gITE7XG4gICAgICAgIFxuICAgICAgICAvLyDmgaLlpI3moLzlrZDlkoznrYnnuqfmmL7npLrvvIjpnZ7mlrDmiYvlvJXlr7znirbmgIHvvIlcbiAgICAgICAgaWYgKCFjYy5wdnoucnVudGltZURhdGEuc2hvd0dhbWUxc3QpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJnU3AgJiYgdGhpcy5iZ1NwLm5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubHZTcCAmJiB0aGlzLmx2U3Aubm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubHZTcC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmhlcm8uaHAgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5oZXJvLnJlYm9ybigpO1xuICAgICAgICAgICAgdGhpcy5oZXJvLnNob3dCdWZmRWZmZWN0KFwicmV2aXZlXCIsICEwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm8uaHAgPCB0aGlzLm1heEhwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvLnNob3dCdWZmRWZmZWN0KFwiSFBcIiwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVyby5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwLCBudWxsKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOOAkOWFs+mUruS/ruWkjeOAkeWcqOmUgOavgUhlcm/kuYvliY3vvIzlsIZzcGluZeiKgueCueenu+WbnuWIsEl0ZW3oioLngrnkuItcbiAgICAgICAgLy8g5L2/55So5pu05a6J5YWo55qE5pa55byP77yM5LiN5L6d6LWW5Y+v6IO95bey57uP5aSx5pWI55qE6IqC54K5XG4gICAgICAgIGlmICh0aGlzLmhlcm8uY2hhcmFjdGVyU3BpbmUgJiYgdGhpcy5oZXJvLmNoYXJhY3RlclNwaW5lLm5vZGUgJiYgdGhpcy5ub2RlICYmIHRoaXMubm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0l0ZW0gc3RvcEhlcm9Mb2dpY10g5bCGc3BpbmXnp7vlm55JdGVt6IqC54K577yMSUQ6XCIgKyB0aGlzLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDkv53lrZhzcGluZeW9k+WJjeeahGFjdGl2ZeeKtuaAgVxuICAgICAgICAgICAgICAgIHZhciBzcGluZUFjdGl2ZSA9IHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZS5ub2RlLmFjdGl2ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDnm7TmjqXlsIZzcGluZeenu+Wbnkl0ZW3oioLngrnvvIzkvb/nlKjljp/lp4vkvY3nva7vvIjlpoLmnpzmnInkv53lrZjnmoTor53vvIlcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm8uY2hhcmFjdGVyU3BpbmUubm9kZS5yZW1vdmVGcm9tUGFyZW50KGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm8uY2hhcmFjdGVyU3BpbmUubm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5oGi5aSN5Yiw5L+d5a2Y5ZyoSXRlbeS4iueahHNwaW5l5Yid5aeL5L2N572uXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3BpbmVJbml0aWFsUG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5zcGluZUluaXRpYWxQb3MuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSXRlbSBzdG9wSGVyb0xvZ2ljXSDmgaLlpI1zcGluZeWIsOWIneWni+S9jee9riAtIElEOlwiICsgdGhpcy5pZCArIFwiLCB4OlwiICsgdGhpcy5zcGluZUluaXRpYWxQb3MueCArIFwiLCB5OlwiICsgdGhpcy5zcGluZUluaXRpYWxQb3MueSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhlcm8uY2hhcmFjdGVyU3BpbmVJbml0aWFsUG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWbnumAgOaWueahiDHvvJrkvb/nlKhIZXJv5L+d5a2Y55qEY2hhcmFjdGVyIHNwaW5l5Yid5aeL5L2N572uXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5oZXJvLmNoYXJhY3RlclNwaW5lSW5pdGlhbFBvcy5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltJdGVtIHN0b3BIZXJvTG9naWNdIOS9v+eUqEhlcm/kv53lrZjnmoRjaGFyYWN0ZXIgc3BpbmXliJ3lp4vkvY3nva46XCIsIHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZUluaXRpYWxQb3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZXJvLml0ZW1TcGluZUluaXRpYWxQb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Zue6YCA5pa55qGIMu+8muS9v+eUqHBsYW50IHNwaW5l55qE5Yid5aeL5L2N572uXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZS5ub2RlLnBvc2l0aW9uID0gdGhpcy5oZXJvLml0ZW1TcGluZUluaXRpYWxQb3MuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSXRlbSBzdG9wSGVyb0xvZ2ljXSDkvb/nlKhwbGFudCBzcGluZeWIneWni+S9jee9rjpcIiwgdGhpcy5oZXJvLml0ZW1TcGluZUluaXRpYWxQb3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOacgOWQjuWbnumAgO+8muS9v+eUqCgwLDApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZS5ub2RlLnBvc2l0aW9uID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltJdGVtIHN0b3BIZXJvTG9naWNdIHNwaW5l5L2N572u6K6+5Li6KDAsMClcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOehruS/nXNwaW5l5Y+v6KeBXG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvLmNoYXJhY3RlclNwaW5lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltJdGVtIHN0b3BIZXJvTG9naWNdIHNwaW5l56e75Zue5a6M5oiQ77yMSUQ6XCIgKyB0aGlzLmlkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0l0ZW0gc3RvcEhlcm9Mb2dpY10g56e75Yqoc3BpbmXlpLHotKXvvIxJRDpcIiArIHRoaXMuaWQgKyBcIiwg6ZSZ6K+vOlwiLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0l0ZW0gc3RvcEhlcm9Mb2dpY10g5peg5rOV56e75Yqoc3BpbmXvvIxJRDpcIiArIHRoaXMuaWQgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiLCBjaGFyYWN0ZXJTcGluZTpcIiArICEhdGhpcy5oZXJvLmNoYXJhY3RlclNwaW5lICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiwgc3BpbmUubm9kZTpcIiArICEhKHRoaXMuaGVyby5jaGFyYWN0ZXJTcGluZSAmJiB0aGlzLmhlcm8uY2hhcmFjdGVyU3BpbmUubm9kZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIsIEl0ZW0ubm9kZeacieaViDpcIiArICEhKHRoaXMubm9kZSAmJiB0aGlzLm5vZGUuaXNWYWxpZCkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDkv53lrZhIZXJv6IqC54K55byV55SoXG4gICAgICAgIHZhciBoZXJvTm9kZSA9IHRoaXMuaGVyby5ub2RlO1xuICAgICAgICBcbiAgICAgICAgLy8g6ZSA5q+BSGVyb+e7hOS7tlxuICAgICAgICB0aGlzLmhlcm8uZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmhlcm8gPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgLy8g44CQ5YWz6ZSu5L+u5aSN44CR6ZSA5q+BSGVyb+iKgueCuVxuICAgICAgICBpZiAoaGVyb05vZGUgJiYgaGVyb05vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbSXRlbSBzdG9wSGVyb0xvZ2ljXSDplIDmr4FIZXJv6IqC54K577yMSUQ6XCIgKyB0aGlzLmlkKTtcbiAgICAgICAgICAgIGhlcm9Ob2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tUb1N0YXJ0UmVsb2FkVGltZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnVsbGV0Q291bnQgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFJlbG9hZFRpbWVyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0YXJ0UmVsb2FkVGltZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLnJlbG9hZE1zO1xuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMjAyKSkge1xuICAgICAgICAgICAgdCAvPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigzMDEpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNjAzKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDgwMSkpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMDAzKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tCdWZmKDcwMykpIHtcbiAgICAgICAgICAgIHQgKj0gMC43O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZig5MDIpKSB7XG4gICAgICAgICAgICB0ICo9IDAuODtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoMTEwMykpIHtcbiAgICAgICAgICAgIHQgKj0gMC44O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQnVmZigxMjAyKSkge1xuICAgICAgICAgICAgdCAqPSAwLjg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWxvYWRUMSA9IGNjLnB2ei50aW1lO1xuICAgICAgICB0aGlzLnJlbG9hZFQyID0gY2MucHZ6LnRpbWUgKyB0O1xuICAgIH0sXG4gICAgc3RhcnRBbmdlck1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zcGluZS50aW1lU2NhbGUgPSAyO1xuICAgICAgICBpZiAoLTEgIT0gdGhpcy5yZWxvYWRUMSkge1xuICAgICAgICAgICAgdmFyIHQgPSBjYy5wdnoudGltZSAtIHRoaXMucmVsb2FkVDE7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZFQxICs9IHQgLyAyO1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRUMiArPSB0IC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oZXJvLmhwID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYW5nZXJFZmYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRWZmLm5vZGUucG9zaXRpb24gPSB0aGlzLmhlcm8ubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VyRWZmLm5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5zY2VuZS5hY2NCdWZmUHJlZmFiLmFkZE5vZGUodGhpcy5oZXJvLm5vZGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nZXJFZmYgPSBlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmdlckVmZi5zZXRBbmltYXRpb24oMCwgXCJhY2NlbGVyYXRlXCIsICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RvcEFuZ2VyTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNwaW5lLnRpbWVTY2FsZSA9IDE7XG4gICAgICAgIGlmICgtMSAhPSB0aGlzLnJlbG9hZFQxKSB7XG4gICAgICAgICAgICB2YXIgdCA9IGNjLnB2ei50aW1lIC0gdGhpcy5yZWxvYWRUMTtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkVDEgLT0gdDtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkVDIgLT0gdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmdlckVmZikge1xuICAgICAgICAgICAgdGhpcy5hbmdlckVmZi5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5oZXJvICYmXG4gICAgICAgICAgICB0aGlzLmhlcm8uc2NlbmUgJiZcbiAgICAgICAgICAgICF0aGlzLmhlcm8uc2NlbmUudGltZVBhdXNlZCAmJlxuICAgICAgICAgICAgIXRoaXMuaGVyby5zY2VuZS5oYXNFbmRlZCAmJlxuICAgICAgICAgICAgISh0aGlzLmhhc0RpZSB8fCB0aGlzLmhlcm8uaHAgPD0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRoaXMuaGVyby5zY2VuZS5pc0FuZ2VyUHJlc3NlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmluQ29vbERvd24pIHtcbiAgICAgICAgICAgICAgICBpZiAoLTEgIT0gdGhpcy5yZWxvYWRUMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNjLnB2ei50aW1lIC0gdGhpcy5yZWxvYWRUMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKj0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWxvYWRUMSArIGUgPj0gdGhpcy5yZWxvYWRUMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJlbG9hZFJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNkQmFyLnByb2dyZXNzID0gZSAvICh0aGlzLnJlbG9hZFQyIC0gdGhpcy5yZWxvYWRUMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuaGVyby50cnlTaG9vdCh7XG4gICAgICAgICAgICAgICAgICAgIGx2OiB0aGlzLmx2XG4gICAgICAgICAgICAgICAgfSkgJiZcbiAgICAgICAgICAgICAgICAodGhpcy5oZXJvLnBsYXlTb3VuZCgpLFxuICAgICAgICAgICAgICAgICh0aGlzLmluQ29vbERvd24gPSAhMCksXG4gICAgICAgICAgICAgICAgKHQgJiYgMSAhPSB0aGlzLmpzb24uYnVsbGV0KSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5idWxsZXRDb3VudC0tLCAodGhpcy5jZEJhci5wcm9ncmVzcyA9IHRoaXMuYnVsbGV0Q291bnQgLyB0aGlzLmpzb24uYnVsbGV0KSksXG4gICAgICAgICAgICAgICAgdGhpcy5idWxsZXRDb3VudCA+IDApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICBpID0gdGhpcy5jZE1zIC8gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpID0gdGhpcy5jZE1zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLnNldFRpbWVvdXQodGhpcy5vbkNEUmVhZHkuYmluZCh0aGlzKSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldE1heEhwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEodGhpcy5pZCkubHY7XG4gICAgICAgIHZhciBlID0gdGhpcy5qc29uLmF0dHJpYnV0ZTFbdCAtIDFdO1xuICAgICAgICBpZiAodGhpcy5sdiA+IDApIHtcbiAgICAgICAgICAgIGUgKj0gdGhpcy5qc29uLmZpZ2h0bHZ1cDFbdGhpcy5sdiAtIDFdIC8gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGUgKj0gMSArIDAuMDEgKiBjYy5wdnoucnVudGltZURhdGEuZ2V0QnVmZlZhbHVlKDEpO1xuICAgICAgICBpZiAodGhpcy5uZWFyNiAmJiBjYy5wdnoucnVudGltZURhdGEuaGFzRW5hYmxlQnVmZig2MDQpKSB7XG4gICAgICAgICAgICBlICo9IDEuMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0J1ZmYoNDAyKSkge1xuICAgICAgICAgICAgZSAqPSAxLjM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICB1cGRhdGVNYXhIcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXMuZ2V0TWF4SHAoKTtcbiAgICAgICAgdmFyIGUgPSB0IC0gdGhpcy5tYXhIcDtcbiAgICAgICAgdGhpcy5tYXhIcCA9IHQ7XG4gICAgICAgIGlmICh0aGlzLmhlcm8pIHtcbiAgICAgICAgICAgIHRoaXMuaGVyby5ocCArPSBlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVIcDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5ocEJhci5wcm9ncmVzcyA9IHQ7XG4gICAgfSxcbiAgICB1cGRhdGVTaGllbGQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2hpZWxkQmFyLnByb2dyZXNzID0gdDtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGVTaGllbGQoKTtcbiAgICB9LFxuICAgIGNoZWNrQnVmZjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSAodCAtICh0ICUgMTAwKSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzLmlkID09IGUgJiYgY2MucHZ6LnJ1bnRpbWVEYXRhLmhhc0VuYWJsZUJ1ZmYodCk7XG4gICAgfSxcbiAgICBpbml0U2FtZUlETHZMaW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXRCZ1NwUGFyZW50KCEwKTtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5pZCAmJiB0aGlzLmx2IDwgdGhpcy5nZXRNYXhMdigpKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBlLmdldENvbXBvbmVudChcIkl0ZW1cIik7XG4gICAgICAgICAgICAgICAgaWYgKGkgJiYgaSAhPSB0ICYmIGkuaWQgPT0gdC5pZCAmJiBpLmx2ID09IHQubHYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSB0Lml0ZW1Sb290LmxpbmVQcmVmYWJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGROb2RlVG8odC5ub2RlLCB0LnNwaW5lLm5vZGUucG9zaXRpb24uYWRkKGNjLnYyKDAsIDQ1KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBuLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzID0gaS5zcGluZS5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigwLCA0NSkpO1xuICAgICAgICAgICAgICAgICAgICB0LmxpbmVJS0JvbmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BpbmU6IG4sXG4gICAgICAgICAgICAgICAgICAgICAgICBJS0JvbmU6IG8sXG4gICAgICAgICAgICAgICAgICAgICAgICB3UG9zOiBzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmxpbmVJS0JvbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLml0ZW1Sb290LmJsb2NrSXRlbXNSb290Tm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuaXRlbVJvb3Qubm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGluZUlLQm9uZXMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlTGluZUlLQm9uZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgIT0gdGhpcy5pZCkge1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0LnNwaW5lLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIodC53UG9zKTtcbiAgICAgICAgICAgICAgICB0LklLQm9uZS54ID0gZS54O1xuICAgICAgICAgICAgICAgIHQuSUtCb25lLnkgPSBlLnk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGlkZUxpbmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0QmdTcFBhcmVudCghKHRoaXMubXlCbG9ja3MubGVuZ3RoID4gMCkpO1xuICAgICAgICBpZiAoMCAhPSB0aGlzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVJS0JvbmVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICB0LnNwaW5lLm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5saW5lSUtCb25lcy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRCZ1NwUGFyZW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5iZ1NwKSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJnU3Aubm9kZS5wYXJlbnQgIT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLnpJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ1NwLm5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2RlLnBhcmVudCAmJiB0aGlzLmJnU3Aubm9kZS5wYXJlbnQgPT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzLmJnU3Aubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MuVmVjMi5aRVJPKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJnU3Aubm9kZS5wYXJlbnQgPSB0aGlzLml0ZW1Sb290LmJsb2NrUm9vdC5ib2FyZEl0ZW1CZ3NSb290O1xuICAgICAgICAgICAgICAgIHRoaXMuYmdTcC5ub2RlLnBvc2l0aW9uID0gdGhpcy5iZ1NwLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7Il19