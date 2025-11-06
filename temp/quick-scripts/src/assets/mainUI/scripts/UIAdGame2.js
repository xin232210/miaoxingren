"use strict";
cc._RF.push(module, '4c669kOTrxK/LplQeLeAMd8', 'UIAdGame2');
// mainUI/scripts/UIAdGame2.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    timeLabel: cc.Label
  },
  initBy: function initBy(e) {
    this.ui = e;
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var e = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["无尽火力"], function (t) {
      if (t) {
        e.ui.enterGame2();
        cc.popupManager.removePopup(e);
      }
    });
  },
  update: function update() {
    var e = (cc.player.game2t || -1) + 18e5 - Date.now();
    this.timeLabel.string = cc.pvz.utils.formatSeconds2(Math.floor(e / 1e3));
  }
});

cc._RF.pop();