"use strict";
cc._RF.push(module, '252e2aY3UFO9ZlBbrR+wKoE', 'UIRankUpEffect');
// rank/scripts/UIRankUpEffect.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    fromLabel: cc.Label,
    toLabel: cc.Label
  },
  initBy: function initBy(e, t) {
    this.fromLabel.string = e;
    this.toLabel.string = t;
  }
});

cc._RF.pop();