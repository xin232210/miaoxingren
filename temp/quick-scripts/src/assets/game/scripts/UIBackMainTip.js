"use strict";
cc._RF.push(module, '908acqYridGR4EbhnPE4eGC', 'UIBackMainTip');
// game/scripts/UIBackMainTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy() {},
  onCloseUI: function onCloseUI() {
    cc.popupManager.removePopup(this);
  },
  onClickBackToMain: function onClickBackToMain() {
    cc.popupManager.removeAllPopups();
    cc.pvz.runtimeData.removeData();
    cc.director.loadScene("mainUI");
  }
});

cc._RF.pop();