
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UIBuyBlock.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1f40bhWJZBDaLMYMeNwL7mO', 'UIBuyBlock');
// game/scripts/UIBuyBlock.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    blockRoot: cc.Node
  },
  initBy: function initBy(t) {
    this.item = t;
    var e = cc.instantiate(t.node);
    e.position = cc.Vec2.ZERO;
    e.parent = this.blockRoot;
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["广告格子"], function (e) {
      if (e) {
        t.item.unlockAd();
        cc.popupManager.removePopup(t);
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlCdXlCbG9jay5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImJsb2NrUm9vdCIsIk5vZGUiLCJpbml0QnkiLCJ0IiwiaXRlbSIsImUiLCJpbnN0YW50aWF0ZSIsIm5vZGUiLCJwb3NpdGlvbiIsIlZlYzIiLCJaRVJPIiwicGFyZW50Iiwib25DbGlja0Nsb3NlIiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlUG9wdXAiLCJvbkNsaWNrQWQiLCJwdnoiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwidW5sb2NrQWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0s7RUFETixDQUZQO0VBS0xDLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFhO0lBQ2pCLEtBQUtDLElBQUwsR0FBWUQsQ0FBWjtJQUNBLElBQUlFLENBQUMsR0FBR1QsRUFBRSxDQUFDVSxXQUFILENBQWVILENBQUMsQ0FBQ0ksSUFBakIsQ0FBUjtJQUNBRixDQUFDLENBQUNHLFFBQUYsR0FBYVosRUFBRSxDQUFDYSxJQUFILENBQVFDLElBQXJCO0lBQ0FMLENBQUMsQ0FBQ00sTUFBRixHQUFXLEtBQUtYLFNBQWhCO0VBQ0gsQ0FWSTtFQVdMWSxZQUFZLEVBQUUsd0JBQVk7SUFDdEJoQixFQUFFLENBQUNpQixZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtFQUNILENBYkk7RUFjTEMsU0FBUyxFQUFFLHFCQUFZO0lBQ25CLElBQUlaLENBQUMsR0FBRyxJQUFSO0lBQ0FQLEVBQUUsQ0FBQ29CLEdBQUgsQ0FBT0MsT0FBUCxDQUFlQyxpQkFBZixDQUFpQ3RCLEVBQUUsQ0FBQ29CLEdBQUgsQ0FBT0csVUFBUCxDQUFrQkMsTUFBbEIsQ0FBeUIsTUFBekIsQ0FBakMsRUFBbUUsVUFBVWYsQ0FBVixFQUFhO01BQzVFLElBQUlBLENBQUosRUFBTztRQUNIRixDQUFDLENBQUNDLElBQUYsQ0FBT2lCLFFBQVA7UUFDQXpCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCWCxDQUE1QjtNQUNIO0lBQ0osQ0FMRDtFQU1IO0FBdEJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBibG9ja1Jvb3Q6IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5pdGVtID0gdDtcbiAgICAgICAgdmFyIGUgPSBjYy5pbnN0YW50aWF0ZSh0Lm5vZGUpO1xuICAgICAgICBlLnBvc2l0aW9uID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICBlLnBhcmVudCA9IHRoaXMuYmxvY2tSb290O1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tBZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGNjLnB2ei5BZFV0aWxzLnNob3dBZFJld2FyZFZpZGVvKGNjLnB2ei5HYW1lQ29uZmlnLkFkVHlwZVtcIuW5v+WRiuagvOWtkFwiXSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgdC5pdGVtLnVubG9ja0FkKCk7XG4gICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiJdfQ==