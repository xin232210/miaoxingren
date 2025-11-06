
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/rank/scripts/UIRankReward.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '833eet/5MNBR65qIt/ctXxr', 'UIRankReward');
// rank/scripts/UIRankReward.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    coinLabel: cc.Label,
    diamondLabel: cc.Label,
    rankLabel: cc.Label,
    boxJsonFile: cc.JsonAsset
  },
  initBy: function initBy(e, t) {
    var n = this.getBoxIDByRank(e);
    var c = this.boxJsonFile.json.find(function (e) {
      return e.ID == n;
    });
    this.coinLabel.string = "x" + c.reward[1];
    this.diamondLabel.string = "x" + c.reward[3];
    this.rankLabel.string = e + 1;
    cc.player.rankWeek = cc.pvz.utils.getStartOfWeek();
    cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], c.reward[1]);
    cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["钻石"], c.reward[3]);
    this.closeCb = t;
  },
  getBoxIDByRank: function getBoxIDByRank(e) {
    var t = e + 1;

    for (var n = 0; n < this.boxJsonFile.json.length; n++) {
      var c = this.boxJsonFile.json[n];

      if (t >= c.rank1 && t <= c.rank2) {
        return c.ID;
      }
    }

    return this.boxJsonFile.json[this.boxJsonFile.json.length - 1].ID;
  },
  onClickClose: function onClickClose() {
    this.closeCb();
    cc.popupManager.showEffectFly(cc.pvz.GameConfig.ItemType["金币"], cc.MainControl.getItemEffectPos(cc.pvz.GameConfig.ItemType["金币"]), 1);
    cc.popupManager.showEffectFly(cc.pvz.GameConfig.ItemType["钻石"], cc.MainControl.getItemEffectPos(cc.pvz.GameConfig.ItemType["钻石"]), 2);
    cc.MainControl.updateItemInfo();
    cc.popupManager.removePopup(this);
  }
});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9yYW5rL3NjcmlwdHMvVUlSYW5rUmV3YXJkLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY29pbkxhYmVsIiwiTGFiZWwiLCJkaWFtb25kTGFiZWwiLCJyYW5rTGFiZWwiLCJib3hKc29uRmlsZSIsIkpzb25Bc3NldCIsImluaXRCeSIsImUiLCJ0IiwibiIsImdldEJveElEQnlSYW5rIiwiYyIsImpzb24iLCJmaW5kIiwiSUQiLCJzdHJpbmciLCJyZXdhcmQiLCJwbGF5ZXIiLCJyYW5rV2VlayIsInB2eiIsInV0aWxzIiwiZ2V0U3RhcnRPZldlZWsiLCJQbGF5ZXJEYXRhIiwiY2hhbmdlSXRlbU51bSIsIkdhbWVDb25maWciLCJJdGVtVHlwZSIsImNsb3NlQ2IiLCJsZW5ndGgiLCJyYW5rMSIsInJhbmsyIiwib25DbGlja0Nsb3NlIiwicG9wdXBNYW5hZ2VyIiwic2hvd0VmZmVjdEZseSIsIk1haW5Db250cm9sIiwiZ2V0SXRlbUVmZmVjdFBvcyIsInVwZGF0ZUl0ZW1JbmZvIiwicmVtb3ZlUG9wdXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssS0FETjtJQUVSQyxZQUFZLEVBQUVOLEVBQUUsQ0FBQ0ssS0FGVDtJQUdSRSxTQUFTLEVBQUVQLEVBQUUsQ0FBQ0ssS0FITjtJQUlSRyxXQUFXLEVBQUVSLEVBQUUsQ0FBQ1M7RUFKUixDQUZQO0VBUUxDLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQ3BCLElBQUlDLENBQUMsR0FBRyxLQUFLQyxjQUFMLENBQW9CSCxDQUFwQixDQUFSO0lBQ0EsSUFBSUksQ0FBQyxHQUFHLEtBQUtQLFdBQUwsQ0FBaUJRLElBQWpCLENBQXNCQyxJQUF0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ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjb2luTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBkaWFtb25kTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICByYW5rTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBib3hKc29uRmlsZTogY2MuSnNvbkFzc2V0XG4gICAgfSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIHZhciBuID0gdGhpcy5nZXRCb3hJREJ5UmFuayhlKTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmJveEpzb25GaWxlLmpzb24uZmluZChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUuSUQgPT0gbjtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29pbkxhYmVsLnN0cmluZyA9IFwieFwiICsgYy5yZXdhcmRbMV07XG4gICAgICAgIHRoaXMuZGlhbW9uZExhYmVsLnN0cmluZyA9IFwieFwiICsgYy5yZXdhcmRbM107XG4gICAgICAgIHRoaXMucmFua0xhYmVsLnN0cmluZyA9IGUgKyAxO1xuICAgICAgICBjYy5wbGF5ZXIucmFua1dlZWsgPSBjYy5wdnoudXRpbHMuZ2V0U3RhcnRPZldlZWsoKTtcbiAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuY2hhbmdlSXRlbU51bShjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumHkeW4gVwiXSwgYy5yZXdhcmRbMV0pO1xuICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5jaGFuZ2VJdGVtTnVtKGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi6ZK755+zXCJdLCBjLnJld2FyZFszXSk7XG4gICAgICAgIHRoaXMuY2xvc2VDYiA9IHQ7XG4gICAgfSxcbiAgICBnZXRCb3hJREJ5UmFuazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBlICsgMTtcbiAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0aGlzLmJveEpzb25GaWxlLmpzb24ubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5ib3hKc29uRmlsZS5qc29uW25dO1xuICAgICAgICAgICAgaWYgKHQgPj0gYy5yYW5rMSAmJiB0IDw9IGMucmFuazIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5JRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib3hKc29uRmlsZS5qc29uW3RoaXMuYm94SnNvbkZpbGUuanNvbi5sZW5ndGggLSAxXS5JRDtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsb3NlQ2IoKTtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnNob3dFZmZlY3RGbHkoXG4gICAgICAgICAgICBjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumHkeW4gVwiXSxcbiAgICAgICAgICAgIGNjLk1haW5Db250cm9sLmdldEl0ZW1FZmZlY3RQb3MoY2MucHZ6LkdhbWVDb25maWcuSXRlbVR5cGVbXCLph5HluIFcIl0pLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBjYy5wb3B1cE1hbmFnZXIuc2hvd0VmZmVjdEZseShcbiAgICAgICAgICAgIGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi6ZK755+zXCJdLFxuICAgICAgICAgICAgY2MuTWFpbkNvbnRyb2wuZ2V0SXRlbUVmZmVjdFBvcyhjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumSu+efs1wiXSksXG4gICAgICAgICAgICAyXG4gICAgICAgICk7XG4gICAgICAgIGNjLk1haW5Db250cm9sLnVwZGF0ZUl0ZW1JbmZvKCk7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9XG59KTtcbiJdfQ==