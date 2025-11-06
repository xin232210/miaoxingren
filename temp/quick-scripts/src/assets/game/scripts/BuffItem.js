"use strict";
cc._RF.push(module, '57fc8765X5GFb+AjDK/zM1O', 'BuffItem');
// game/scripts/BuffItem.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    qualitySp: cc.Sprite,
    iconSp: cc.Sprite
  },
  initBuffItem: function initBuffItem(t, e, i) {
    this.index = t;
    this.buffJson = e;
    this.callBack = i;
    cc.pvz.utils.setSpriteFrame(this.qualitySp, "uiImage", "item/pz_" + this.buffJson.quality);
    cc.pvz.utils.setSpriteFrame(this.iconSp, "uiImage", "skill/skill" + this.buffJson.icon);
  },
  onClickBuff: function onClickBuff() {
    var t = this.node.parent.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()));

    if (this.callBack) {
      this.callBack(this.index, t, this.buffJson.desc);
    }
  }
});

cc._RF.pop();