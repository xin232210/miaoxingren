"use strict";
cc._RF.push(module, '00faatx11FNLqqpay0AO1Mg', 'Block');
// game/scripts/Block.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    iLabel: cc.Label
  },
  onLoad: function onLoad() {
    var t = cc.find("bg", this.node);

    if (t) {
      this.bgSp = t.getComponent(cc.Sprite);
    } else {
      this.bgSp = null;
    }
  },
  setRoot: function setRoot(t) {
    this.blockRoot = t;
  },
  setPreview: function setPreview(t) {
    this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
    this.bgSp.node.active = -1 != t || !this.item;
  },
  put: function put(t) {
    this.setPreview(-1);
    this.bgSp.node.active = !1;

    if (this.item) {
      cc.warn("1");
    }

    this.item = t;
  },
  pick: function pick() {
    this.bgSp.node.active = !0;
    this.bgSp.node.opacity = 125;
    this.item = null;
  },
  update: function update() {
    if (this.iLabel) {
      this.iLabel.string = this.i;
    }
  }
});

cc._RF.pop();