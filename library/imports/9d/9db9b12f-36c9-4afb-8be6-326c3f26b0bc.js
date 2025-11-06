"use strict";
cc._RF.push(module, '9db9bEvNslK+4vmMmw/JrC8', 'EventCollider');
// game/scripts/EventCollider.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    event: "fire",
    collider: cc.Collider
  },
  onLoad: function onLoad() {
    var t = this;
    this.collider.enabled = !1;
    this.spine.setEventListener(function (e, i) {
      if (i.data.name == t.event) {
        cc.pvz.utils.manuallyCheckCollider(t.collider);
      }
    });
  }
});

cc._RF.pop();