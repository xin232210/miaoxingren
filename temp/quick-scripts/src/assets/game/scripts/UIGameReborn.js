"use strict";
cc._RF.push(module, '73dc0QM6WhCaKWq62D5pk42', 'UIGameReborn');
// game/scripts/UIGameReborn.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy(t) {
    this.cb = t;
    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["死亡复活"]);
  },
  onClickClose: function onClickClose() {
    this.cb(!1);
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["死亡复活"], function (e) {
      if (e) {
        t.cb(!0);
        cc.popupManager.removePopup(t);
      }
    });
  }
});

cc._RF.pop();