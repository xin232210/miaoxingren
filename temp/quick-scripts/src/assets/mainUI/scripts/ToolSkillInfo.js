"use strict";
cc._RF.push(module, '8dc36ug6ZtBYKCF9kVMEUzb', 'ToolSkillInfo');
// mainUI/scripts/ToolSkillInfo.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    toolSkillJsonFile: cc.JsonAsset,
    lockPanel: cc.Node,
    iconSprite: cc.Sprite,
    qualitySprite: cc.Sprite,
    descLabel: cc.RichText
  },
  onLoad: function onLoad() {
    this.descLabel.enabled = !1;
  },
  initSkillInfo: function initSkillInfo(e, t, i, o) {
    var a = Math.floor(100 * e + t);
    var c = i;
    var s = this.toolSkillJsonFile.json.find(function (e) {
      return e.id == a;
    });
    var n = s.lock > c || o;
    this.lockPanel.active = n;

    if (n) {
      this.descLabel.string = s.lockdesc;
    } else {
      this.descLabel.string = s.desc;
    }

    this.descLabel.enabled = !0;
    cc.JsonControl.getQualityBgIcon(this.qualitySprite, s.quality);
    cc.JsonControl.getSkillIcon(this.iconSprite, s.icon);
  }
});

cc._RF.pop();