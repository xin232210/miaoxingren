"use strict";
cc._RF.push(module, 'd29ff5k0C9OW5XsgTE8XMoO', 'UIToolSkin');
// mainUI/scripts/UIToolSkin.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skinTipLabl: cc.Label,
    nameLabel: cc.Label,
    spine: sp.Skeleton,
    leftBtn: cc.Node,
    rightBtn: cc.Node
  },
  initBy: function initBy(e) {
    var t = this;
    this.toolId = e;
    this.toolJson = cc.JsonControl.getToolJson(this.toolId);
    this.nameLabel.string = this.toolJson.name;
    this.maxLv = 5;
    var i = cc.pvz.PlayerData.getToolData(this.toolId);
    this.modelIndex = cc.pvz.utils.getLevelInterval(i.lv);
    cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (e) {
      t.spine.skeletonData = e;
      t.showCurPage();
    });
  },
  showCurPage: function showCurPage() {
    this.leftBtn.active = this.modelIndex > 1;
    this.rightBtn.active = this.modelIndex < this.maxLv;
    this.skinTipLabl.string = cc.pvz.GameConfig.ToolSkinTip.replace("$", this.modelIndex);
    this.spine.setAnimation(0, "Idle", !0);
  },
  onClickPage: function onClickPage(e, t) {
    if (parseInt(t) < 0) {
      this.modelIndex--;
    } else {
      this.modelIndex++;
    }

    this.showCurPage();
  },
  onCloseUI: function onCloseUI() {
    cc.popupManager.removePopup(this);
  }
});

cc._RF.pop();