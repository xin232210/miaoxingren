"use strict";
cc._RF.push(module, '91286xsaANBJa1IVDzihybZ', 'UIRankTip');
// rank/scripts/UIRankTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  }
});

cc._RF.pop();