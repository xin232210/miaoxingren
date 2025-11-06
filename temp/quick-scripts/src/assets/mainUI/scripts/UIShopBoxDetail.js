"use strict";
cc._RF.push(module, 'cecc0YT8vNNeq5CIv0xuI2v', 'UIShopBoxDetail');
// mainUI/scripts/UIShopBoxDetail.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    iconSprite: cc.Sprite,
    tipLabel: cc.Label,
    baseCardNode: cc.Node,
    parentPanel: cc.Node
  },
  initBy: function initBy(e) {
    var t = cc.JsonControl.getItemJson(e);
    var i = cc.pvz.GameConfig["Quality" + t.Quality + "Tools"];
    var o = cc.pvz.PlayerData.getStageLevel();
    cc.pvz.utils.setSpriteFrame(this.iconSprite, "uiImage", "shop/shop" + (e + 15));
    var a = o < cc.pvz.GameConfig.ToolLockLevel[i[0] - 1];
    this.baseCardNode.getComponent("RewardItem").initShopBoxToolItem(i[0], a);
    var c;

    if (a) {
      c = 1;
    } else {
      c = 0;
    }

    for (var s = 1; s < i.length; s++) {
      var n = cc.instantiate(this.baseCardNode);
      n.parent = this.parentPanel;
      var r = o < cc.pvz.GameConfig.ToolLockLevel[i[s] - 1];
      n.getComponent("RewardItem").initShopBoxToolItem(i[s], r);

      if (r) {
        c++;
      }
    }

    var h = 1 / (i.length - c) * 100;
    this.tipLabel.string = h.toFixed(2) + "%";
  },
  onCloseUI: function onCloseUI() {
    cc.popupManager.removePopup(this);
  }
});

cc._RF.pop();