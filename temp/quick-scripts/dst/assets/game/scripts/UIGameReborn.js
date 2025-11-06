
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UIGameReborn.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '73dc0QM6WhCaKWq62D5pk42', 'UIGameReborn');
// game/scripts/UIGameReborn.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy(t) {
    this.cb = t;
    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["死亡复活"]);
  },
  onClickClose: function onClickClose() {
    this.cb(!1);
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["死亡复活"], function (e) {
      if (e) {
        t.cb(!0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlHYW1lUmVib3JuLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaW5pdEJ5IiwidCIsImNiIiwicHZ6IiwiVEFVdGlscyIsInRyYWNrQWRVSVNob3ciLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwib25DbGlja0Nsb3NlIiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlUG9wdXAiLCJvbkNsaWNrQWQiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUUsRUFGUDtFQUdMQyxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixLQUFLQyxFQUFMLEdBQVVELENBQVY7SUFDQUwsRUFBRSxDQUFDTyxHQUFILENBQU9DLE9BQVAsQ0FBZUMsYUFBZixDQUE2QlQsRUFBRSxDQUFDTyxHQUFILENBQU9HLFVBQVAsQ0FBa0JDLE1BQWxCLENBQXlCLE1BQXpCLENBQTdCO0VBQ0gsQ0FOSTtFQU9MQyxZQUFZLEVBQUUsd0JBQVk7SUFDdEIsS0FBS04sRUFBTCxDQUFRLENBQUMsQ0FBVDtJQUNBTixFQUFFLENBQUNhLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0gsQ0FWSTtFQVdMQyxTQUFTLEVBQUUscUJBQVk7SUFDbkIsSUFBSVYsQ0FBQyxHQUFHLElBQVI7SUFDQUwsRUFBRSxDQUFDTyxHQUFILENBQU9TLE9BQVAsQ0FBZUMsaUJBQWYsQ0FBaUNqQixFQUFFLENBQUNPLEdBQUgsQ0FBT0csVUFBUCxDQUFrQkMsTUFBbEIsQ0FBeUIsTUFBekIsQ0FBakMsRUFBbUUsVUFBVU8sQ0FBVixFQUFhO01BQzVFLElBQUlBLENBQUosRUFBTztRQUNIYixDQUFDLENBQUNDLEVBQUYsQ0FBSyxDQUFDLENBQU47UUFDQU4sRUFBRSxDQUFDYSxZQUFILENBQWdCQyxXQUFoQixDQUE0QlQsQ0FBNUI7TUFDSDtJQUNKLENBTEQ7RUFNSDtBQW5CSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHt9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5jYiA9IHQ7XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrQWRVSVNob3coY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5q275Lqh5aSN5rS7XCJdKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNiKCExKTtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH0sXG4gICAgb25DbGlja0FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgY2MucHZ6LkFkVXRpbHMuc2hvd0FkUmV3YXJkVmlkZW8oY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5q275Lqh5aSN5rS7XCJdLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICB0LmNiKCEwKTtcbiAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlUG9wdXAodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl19