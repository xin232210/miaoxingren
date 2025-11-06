"use strict";
cc._RF.push(module, 'dace2p4R3RLfYgcmFlF+SSd', 'RemoveWhenComplete');
// scripts/RemoveWhenComplete.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    fixedScale: !0
  },
  onLoad: function onLoad() {
    var e = this;
    this.spine.setCompleteListener(function () {
      e.node.parent = null;
    });
  }
});

cc._RF.pop();