"use strict";
cc._RF.push(module, '97ad5KR+XZP4aJ98jEr2o7l', 'AdBtn');
// scripts/AdBtn.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    icon: cc.Sprite
  },
  start: function start() {
    cc.butler.node.on("ad", this.onAdTimes, this);
    this.updateIcon();
  },
  onAdTimes: function onAdTimes() {
    this.updateIcon();
  },
  updateIcon: function updateIcon() {
    var e = 10 == cc.player.adTimes;
    cc.pvz.utils.setSpriteFrame(this.icon, "uiImage", e ? "public/ad2" : "public/ad");
  }
});

cc._RF.pop();