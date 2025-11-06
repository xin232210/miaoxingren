"use strict";
cc._RF.push(module, '863dallCn5L1ITZ5Vr7oggX', 'AutoScale');
// scripts/AutoScale.js

"use strict";

cc.Class({
  "extends": cc.Component,
  onLoad: function onLoad() {
    this.initBy(this.usingInitSize ? this.w : this.node.width, this.usingInitSize ? this.h : this.node.height);
  },
  setNodeSize: function setNodeSize(e, t) {
    this.usingInitSize = !0;
    this.w = e;
    this.h = t;
  },
  initBy: function initBy(e, t) {
    var o = Math.min(cc.view.getCanvasSize().width / e, cc.view.getCanvasSize().height / t);
    var a = e * o;
    var n = t * o;
    this.node.scale = Math.max(cc.view.getCanvasSize().width / a, cc.view.getCanvasSize().height / n);
  }
});

cc._RF.pop();