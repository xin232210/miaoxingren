"use strict";
cc._RF.push(module, '741ceQCQalF7I4qJREFAbhj', 'ColliderProxy');
// game/scripts/ColliderProxy.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    onEnter: cc.Component.EventHandler,
    onStay: cc.Component.EventHandler,
    onExit: cc.Component.EventHandler
  },
  onCollisionEnter: function onCollisionEnter(t, e) {
    if (this.onEnter) {
      this.onEnter.emit([t, e]);
    }
  },
  onCollisionStay: function onCollisionStay(t, e) {
    if (this.onStay) {
      this.onStay.emit([t, e]);
    }
  },
  onCollisionExit: function onCollisionExit(t, e) {
    if (this.onExit) {
      this.onExit.emit([t, e]);
    }
  }
});

cc._RF.pop();