"use strict";
cc._RF.push(module, 'c3207NRZlJHrJK97e4aw5/y', 'UIActLevel');
// mainUI/scripts/UIActLevel.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    panel: cc.Node,
    actLevelList: [cc.Node]
  },
  onLoad: function onLoad() {
    cc.UIActLevel = this;
  },
  initBy: function initBy() {
    cc.pvz.utils.fadeInBtn(this.node);
    this.node.active = !0;
    this.panel.scale = Math.min(1.4, this.node.width / 720);
    this.initActItemList();
  },
  initActItemList: function initActItemList() {
    this.actLevelList[0].getComponent("ActLevelItem").initActLevelItem(0);
  },
  onCloseUI: function onCloseUI() {
    this.node.active = !1;
  },
  onClickOther: function onClickOther() {
    cc.popupManager.showToast("即将开启...");
  }
});

cc._RF.pop();