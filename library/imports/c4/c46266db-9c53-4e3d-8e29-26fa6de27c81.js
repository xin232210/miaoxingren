"use strict";
cc._RF.push(module, 'c4626bbnFNOPY4pJvpt4nyB', 'Pos');
// game/scripts/Pos.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    i: 0,
    dashNode: cc.Node
  },
  onLoad: function onLoad() {
    this.bgSp = cc.find("bg", this.node).getComponent(cc.Sprite);
    this.dashNode = cc.find("pos", this.node);
  },
  setRoot: function setRoot(t) {
    this.blockRoot = t;
  },
  setPreview: function setPreview(t) {
    this.bgSp.node.active = -1 != t || this.item;

    if (this.bgSp.node.active) {
      this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
    }
  },
  put: function put(t) {
    this.setPreview(-1);
    this.bgSp.node.active = !1;

    if (this.item) {
      cc.warn("2");
    }

    this.item = t;
  },
  pick: function pick() {
    this.bgSp.node.active = !0;
    this.item = null;
  }
});

cc._RF.pop();