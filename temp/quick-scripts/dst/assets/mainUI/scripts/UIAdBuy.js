
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIAdBuy.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1a6bcfK2GBBq4FP+OT4vxBc', 'UIAdBuy');
// mainUI/scripts/UIAdBuy.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    rewardItem: cc.Node,
    nameLabel: cc.Label,
    descLabel: cc.Label
  },
  initBy: function initBy(e, t) {
    if (void 0 === t) {
      t = null;
    }

    this.isLookAd = !1;
    this.rewardData = e;
    this.callBack = t;
    this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
    this.itemId = this.rewardData.itemId;
    this.toolId = this.rewardData.toolId;

    if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
      var i = cc.JsonControl.getToolJson(this.toolId);
      this.nameLabel.string = i.name;
      this.descLabel.string = i.desc;
    } else {
      var o = cc.JsonControl.getItemJson(this.itemId);
      this.nameLabel.string = o.Name;
      this.descLabel.string = o.Info;
    }

    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["道具不足"]);
  },
  onClickBuy: function onClickBuy() {
    var e = this;

    if (this.isLookAd) {//
    } else {
      this.isLookAd = !0;
      cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["道具不足"], function (t) {
        e.onAdClose(t);
      });
    }
  },
  onAdClose: function onAdClose(e) {
    this.isLookAd = !1;

    if (e) {
      if (2 == this.itemId || 3 == this.itemId) {
        cc.pvz.PlayerData.updateAdBuyBankTimes(2 == this.itemId ? 0 : 1);
      } else {
        cc.pvz.PlayerData.updateAdBuyToolTimes(this.toolId);
      }

      cc.popupManager.popup("mainUI", "getrewardUI", "UIReward", {
        ad: !1,
        scale: !1
      }, [this.rewardData], cc.pvz.GameConfig.UIFromType["道具不足"], this.callBack);
      cc.popupManager.removePopup(this);
    }
  },
  onCloseUI: function onCloseUI() {
    if (this.isLookAd) {//
    } else {
      cc.popupManager.removePopup(this);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSUFkQnV5LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicmV3YXJkSXRlbSIsIk5vZGUiLCJuYW1lTGFiZWwiLCJMYWJlbCIsImRlc2NMYWJlbCIsImluaXRCeSIsImUiLCJ0IiwiaXNMb29rQWQiLCJyZXdhcmREYXRhIiwiY2FsbEJhY2siLCJnZXRDb21wb25lbnQiLCJpbml0UmV3YXJkSXRlbSIsIml0ZW1JZCIsInRvb2xJZCIsInB2eiIsIkdhbWVDb25maWciLCJJdGVtVHlwZSIsImkiLCJKc29uQ29udHJvbCIsImdldFRvb2xKc29uIiwic3RyaW5nIiwibmFtZSIsImRlc2MiLCJvIiwiZ2V0SXRlbUpzb24iLCJOYW1lIiwiSW5mbyIsIlRBVXRpbHMiLCJ0cmFja0FkVUlTaG93IiwiQWRUeXBlIiwib25DbGlja0J1eSIsIkFkVXRpbHMiLCJzaG93QWRSZXdhcmRWaWRlbyIsIm9uQWRDbG9zZSIsIlBsYXllckRhdGEiLCJ1cGRhdGVBZEJ1eUJhbmtUaW1lcyIsInVwZGF0ZUFkQnV5VG9vbFRpbWVzIiwicG9wdXBNYW5hZ2VyIiwicG9wdXAiLCJhZCIsInNjYWxlIiwiVUlGcm9tVHlwZSIsInJlbW92ZVBvcHVwIiwib25DbG9zZVVJIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsVUFBVSxFQUFFSixFQUFFLENBQUNLLElBRFA7SUFFUkMsU0FBUyxFQUFFTixFQUFFLENBQUNPLEtBRk47SUFHUkMsU0FBUyxFQUFFUixFQUFFLENBQUNPO0VBSE4sQ0FGUDtFQU9MRSxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtJQUNwQixJQUFJLEtBQUssQ0FBTCxLQUFXQSxDQUFmLEVBQWtCO01BQ2RBLENBQUMs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Q0FBQzBDLFlBQUgsQ0FBZ0JLLFdBQWhCLENBQTRCLElBQTVCO0lBQ0g7RUFDSixDQTdESTtFQThETEMsU0FBUyxFQUFFLHFCQUFZO0lBQ25CLElBQUksS0FBS3BDLFFBQVQsRUFBbUIsQ0FDZjtJQUNILENBRkQsTUFFTztNQUNIWixFQUFFLENBQUMwQyxZQUFILENBQWdCSyxXQUFoQixDQUE0QixJQUE1QjtJQUNIO0VBQ0o7QUFwRUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJld2FyZEl0ZW06IGNjLk5vZGUsXG4gICAgICAgIG5hbWVMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIGRlc2NMYWJlbDogY2MuTGFiZWxcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gdCkge1xuICAgICAgICAgICAgdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0xvb2tBZCA9ICExO1xuICAgICAgICB0aGlzLnJld2FyZERhdGEgPSBlO1xuICAgICAgICB0aGlzLmNhbGxCYWNrID0gdDtcbiAgICAgICAgdGhpcy5yZXdhcmRJdGVtLmdldENvbXBvbmVudChcIlJld2FyZEl0ZW1cIikuaW5pdFJld2FyZEl0ZW0odGhpcy5yZXdhcmREYXRhLCAhMSk7XG4gICAgICAgIHRoaXMuaXRlbUlkID0gdGhpcy5yZXdhcmREYXRhLml0ZW1JZDtcbiAgICAgICAgdGhpcy50b29sSWQgPSB0aGlzLnJld2FyZERhdGEudG9vbElkO1xuICAgICAgICBpZiAodGhpcy5pdGVtSWQgPT09IGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi5Zu65a6a56KO54mHXCJdKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGNjLkpzb25Db250cm9sLmdldFRvb2xKc29uKHRoaXMudG9vbElkKTtcbiAgICAgICAgICAgIHRoaXMubmFtZUxhYmVsLnN0cmluZyA9IGkubmFtZTtcbiAgICAgICAgICAgIHRoaXMuZGVzY0xhYmVsLnN0cmluZyA9IGkuZGVzYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvID0gY2MuSnNvbkNvbnRyb2wuZ2V0SXRlbUpzb24odGhpcy5pdGVtSWQpO1xuICAgICAgICAgICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gby5OYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXNjTGFiZWwuc3RyaW5nID0gby5JbmZvO1xuICAgICAgICB9XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrQWRVSVNob3coY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi6YGT5YW35LiN6LazXCJdKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCdXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pc0xvb2tBZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNMb29rQWQgPSAhMDtcbiAgICAgICAgICAgIGNjLnB2ei5BZFV0aWxzLnNob3dBZFJld2FyZFZpZGVvKGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIumBk+WFt+S4jei2s1wiXSwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICBlLm9uQWRDbG9zZSh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkFkQ2xvc2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMuaXNMb29rQWQgPSAhMTtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIGlmICgyID09IHRoaXMuaXRlbUlkIHx8IDMgPT0gdGhpcy5pdGVtSWQpIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS51cGRhdGVBZEJ1eUJhbmtUaW1lcygyID09IHRoaXMuaXRlbUlkID8gMCA6IDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS51cGRhdGVBZEJ1eVRvb2xUaW1lcyh0aGlzLnRvb2xJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICAgICAgXCJtYWluVUlcIixcbiAgICAgICAgICAgICAgICBcImdldHJld2FyZFVJXCIsXG4gICAgICAgICAgICAgICAgXCJVSVJld2FyZFwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYWQ6ICExLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogITFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFt0aGlzLnJld2FyZERhdGFdLFxuICAgICAgICAgICAgICAgIGNjLnB2ei5HYW1lQ29uZmlnLlVJRnJvbVR5cGVbXCLpgZPlhbfkuI3otrNcIl0sXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFja1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZVVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTG9va0FkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=