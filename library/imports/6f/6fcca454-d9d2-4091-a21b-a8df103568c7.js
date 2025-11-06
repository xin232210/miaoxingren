"use strict";
cc._RF.push(module, '6fccaRU2dJAkaIbqN8QNWjH', 'UIPreGame');
// mainUI/scripts/UIPreGame.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lvLabel: cc.Label
  },
  initBy: function initBy(e) {
    this.closeCb = e;
  },
  onClickStart: function onClickStart() {
    cc.popupManager.removePopup(this);
    cc.pvz.runtimeData.initByPreData();
    cc.director.loadScene("game1");
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
    cc.pvz.runtimeData.removeData();

    if (this.closeCb) {
      this.closeCb();
    }
  }
});

cc._RF.pop();