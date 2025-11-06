"use strict";
cc._RF.push(module, '4a5346YF8NGpovlq5z/Ex8k', 'Enemy12');
// game/scripts/Enemy12.js

"use strict";

var $enemy = require("./Enemy");

cc.Class({
  "extends": $enemy,
  properties: {
    groundNode: cc.Node
  },
  initBy: function initBy(t, e, n, o) {
    $enemy.prototype.initBy.call(this, t, e, n, o);
    this.groundNode.parent = this.scene.ground;
    this.groundNode.position = this.node.position;
  },
  update: function update(t) {
    $enemy.prototype.update.call(this, t);

    if (this.groundNode) {
      this.groundNode.position = this.node.position;
    }
  },
  hurtBy: function hurtBy(t, e) {
    if (this.hp <= 0) {//
    } else {
      $enemy.prototype.hurtBy.call(this, t, e);

      if (this.hp <= 0 && this.groundNode) {
        this.groundNode.parent = null;
        this.groundNode = null;
      }
    }
  }
});

cc._RF.pop();