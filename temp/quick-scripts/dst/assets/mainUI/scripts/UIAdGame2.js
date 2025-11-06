
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIAdGame2.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4c669kOTrxK/LplQeLeAMd8', 'UIAdGame2');
// mainUI/scripts/UIAdGame2.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    timeLabel: cc.Label
  },
  initBy: function initBy(e) {
    this.ui = e;
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var e = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["无尽火力"], function (t) {
      if (t) {
        e.ui.enterGame2();
        cc.popupManager.removePopup(e);
      }
    });
  },
  update: function update() {
    var e = (cc.player.game2t || -1) + 18e5 - Date.now();
    this.timeLabel.string = cc.pvz.utils.formatSeconds2(Math.floor(e / 1e3));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSUFkR2FtZTIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ0aW1lTGFiZWwiLCJMYWJlbCIsImluaXRCeSIsImUiLCJ1aSIsIm9uQ2xpY2tDbG9zZSIsInBvcHVwTWFuYWdlciIsInJlbW92ZVBvcHVwIiwib25DbGlja0FkIiwicHZ6IiwiQWRVdGlscyIsInNob3dBZFJld2FyZFZpZGVvIiwiR2FtZUNvbmZpZyIsIkFkVHlwZSIsInQiLCJlbnRlckdhbWUyIiwidXBkYXRlIiwicGxheWVyIiwiZ2FtZTJ0IiwiRGF0ZSIsIm5vdyIsInN0cmluZyIsInV0aWxzIiwiZm9ybWF0U2Vjb25kczIiLCJNYXRoIiwiZmxvb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0s7RUFETixDQUZQO0VBS0xDLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFhO0lBQ2pCLEtBQUtDLEVBQUwsR0FBVUQsQ0FBVjtFQUNILENBUEk7RUFRTEUsWUFBWSxFQUFFLHdCQUFZO0lBQ3RCVCxFQUFFLENBQUNVLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0gsQ0FWSTtFQVdMQyxTQUFTLEVBQUUscUJBQVk7SUFDbkIsSUFBSUwsQ0FBQyxHQUFHLElBQVI7SUFDQVAsRUFBRSxDQUFDYSxHQUFILENBQU9DLE9BQVAsQ0FBZUMsaUJBQWYsQ0FBaUNmLEVBQUUsQ0FBQ2EsR0FBSCxDQUFPRyxVQUFQLENBQWtCQyxNQUFsQixDQUF5QixNQUF6QixDQUFqQyxFQUFtRSxVQUFVQyxDQUFWLEVBQWE7TUFDNUUsSUFBSUEsQ0FBSixFQUFPO1FBQ0hYLENBQUMsQ0FBQ0MsRUFBRixDQUFLVyxVQUFMO1FBQ0FuQixFQUFFLENBQUNVLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCSixDQUE1QjtNQUNIO0lBQ0osQ0FMRDtFQU1ILENBbkJJO0VBb0JMYSxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsSUFBSWIsQ0FBQyxHQUFHLENBQUNQLEVBQUUsQ0FBQ3FCLE1BQUgsQ0FBVUMsTUFBVixJQUFvQixDQUFDLENBQXRCLElBQTJCLElBQTNCLEdBQWtDQyxJQUFJLENBQUNDLEdBQUwsRUFBMUM7SUFDQSxLQUFLcEIsU0FBTCxDQUFlcUIsTUFBZixHQUF3QnpCLEVBQUUsQ0FBQ2EsR0FBSCxDQUFPYSxLQUFQLENBQWFDLGNBQWIsQ0FBNEJDLElBQUksQ0FBQ0MsS0FBTCxDQUFXdEIsQ0FBQyxHQUFHLEdBQWYsQ0FBNUIsQ0FBeEI7RUFDSDtBQXZCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGltZUxhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLnVpID0gZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlUG9wdXAodGhpcyk7XG4gICAgfSxcbiAgICBvbkNsaWNrQWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBjYy5wdnouQWRVdGlscy5zaG93QWRSZXdhcmRWaWRlbyhjYy5wdnouR2FtZUNvbmZpZy5BZFR5cGVbXCLml6DlsL3ngavliptcIl0sIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGUudWkuZW50ZXJHYW1lMigpO1xuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSAoY2MucGxheWVyLmdhbWUydCB8fCAtMSkgKyAxOGU1IC0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy50aW1lTGFiZWwuc3RyaW5nID0gY2MucHZ6LnV0aWxzLmZvcm1hdFNlY29uZHMyKE1hdGguZmxvb3IoZSAvIDFlMykpO1xuICAgIH1cbn0pO1xuIl19