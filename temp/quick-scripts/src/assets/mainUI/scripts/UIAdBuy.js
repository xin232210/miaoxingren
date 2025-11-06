"use strict";
cc._RF.push(module, '1a6bcfK2GBBq4FP+OT4vxBc', 'UIAdBuy');
// mainUI/scripts/UIAdBuy.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    rewardItem: cc.Node,
    nameLabel: cc.Label,
    descLabel: cc.Label
  },
  initBy: function initBy(e, t) {
    if (void 0 === t) {
      t = null;
    }

    this.isLookAd = !1;
    this.rewardData = e;
    this.callBack = t;
    this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
    this.itemId = this.rewardData.itemId;
    this.toolId = this.rewardData.toolId;

    if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
      var i = cc.JsonControl.getToolJson(this.toolId);
      this.nameLabel.string = i.name;
      this.descLabel.string = i.desc;
    } else {
      var o = cc.JsonControl.getItemJson(this.itemId);
      this.nameLabel.string = o.Name;
      this.descLabel.string = o.Info;
    }

    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["道具不足"]);
  },
  onClickBuy: function onClickBuy() {
    var e = this;

    if (this.isLookAd) {//
    } else {
      this.isLookAd = !0;
      cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["道具不足"], function (t) {
        e.onAdClose(t);
      });
    }
  },
  onAdClose: function onAdClose(e) {
    this.isLookAd = !1;

    if (e) {
      if (2 == this.itemId || 3 == this.itemId) {
        cc.pvz.PlayerData.updateAdBuyBankTimes(2 == this.itemId ? 0 : 1);
      } else {
        cc.pvz.PlayerData.updateAdBuyToolTimes(this.toolId);
      }

      cc.popupManager.popup("mainUI", "getrewardUI", "UIReward", {
        ad: !1,
        scale: !1
      }, [this.rewardData], cc.pvz.GameConfig.UIFromType["道具不足"], this.callBack);
      cc.popupManager.removePopup(this);
    }
  },
  onCloseUI: function onCloseUI() {
    if (this.isLookAd) {//
    } else {
      cc.popupManager.removePopup(this);
    }
  }
});

cc._RF.pop();