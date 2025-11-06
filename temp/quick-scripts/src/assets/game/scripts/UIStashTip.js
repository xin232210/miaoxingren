"use strict";
cc._RF.push(module, '0c5c3NiQZpF45h2kDMgbSQn', 'UIStashTip');
// game/scripts/UIStashTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy(t) {
    this.cb = t;
  },
  onClickClose: function onClickClose() {
    this.cb(!1);
    cc.popupManager.removePopup(this);
  },
  onClickStart: function onClickStart() {
    this.cb(!0);
    cc.popupManager.removePopup(this);
  }
});

cc._RF.pop();