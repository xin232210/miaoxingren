"use strict";
cc._RF.push(module, '1f40bhWJZBDaLMYMeNwL7mO', 'UIBuyBlock');
// game/scripts/UIBuyBlock.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    blockRoot: cc.Node
  },
  initBy: function initBy(t) {
    this.item = t;
    var e = cc.instantiate(t.node);
    e.position = cc.Vec2.ZERO;
    e.parent = this.blockRoot;
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["广告格子"], function (e) {
      if (e) {
        t.item.unlockAd();
        cc.popupManager.removePopup(t);
      }
    });
  }
});

cc._RF.pop();