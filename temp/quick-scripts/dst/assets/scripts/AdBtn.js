
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/AdBtn.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '97ad5KR+XZP4aJ98jEr2o7l', 'AdBtn');
// scripts/AdBtn.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    icon: cc.Sprite
  },
  start: function start() {
    cc.butler.node.on("ad", this.onAdTimes, this);
    this.updateIcon();
  },
  onAdTimes: function onAdTimes() {
    this.updateIcon();
  },
  updateIcon: function updateIcon() {
    var e = 10 == cc.player.adTimes;
    cc.pvz.utils.setSpriteFrame(this.icon, "uiImage", e ? "public/ad2" : "public/ad");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0FkQnRuLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaWNvbiIsIlNwcml0ZSIsInN0YXJ0IiwiYnV0bGVyIiwibm9kZSIsIm9uIiwib25BZFRpbWVzIiwidXBkYXRlSWNvbiIsImUiLCJwbGF5ZXIiLCJhZFRpbWVzIiwicHZ6IiwidXRpbHMiLCJzZXRTcHJpdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLElBQUksRUFBRUosRUFBRSxDQUFDSztFQURELENBRlA7RUFLTEMsS0FBSyxFQUFFLGlCQUFZO0lBQ2ZOLEVBQUUsQ0FBQ08sTUFBSCxDQUFVQyxJQUFWLENBQWVDLEVBQWYsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBS0MsU0FBN0IsRUFBd0MsSUFBeEM7SUFDQSxLQUFLQyxVQUFMO0VBQ0gsQ0FSSTtFQVNMRCxTQUFTLEVBQUUscUJBQVk7SUFDbkIsS0FBS0MsVUFBTDtFQUNILENBWEk7RUFZTEEsVUFBVSxFQUFFLHNCQUFZO0lBQ3BCLElBQUlDLENBQUMsR0FBRyxNQUFNWixFQUFFLENBQUNhLE1BQUgsQ0FBVUMsT0FBeEI7SUFDQWQsRUFBRSxDQUFDZSxHQUFILENBQU9DLEtBQVAsQ0FBYUMsY0FBYixDQUE0QixLQUFLYixJQUFqQyxFQUF1QyxTQUF2QyxFQUFrRFEsQ0FBQyxHQUFHLFlBQUgsR0FBa0IsV0FBckU7RUFDSDtBQWZJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpY29uOiBjYy5TcHJpdGVcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5ub2RlLm9uKFwiYWRcIiwgdGhpcy5vbkFkVGltZXMsIHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICB9LFxuICAgIG9uQWRUaW1lczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICB9LFxuICAgIHVwZGF0ZUljb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSAxMCA9PSBjYy5wbGF5ZXIuYWRUaW1lcztcbiAgICAgICAgY2MucHZ6LnV0aWxzLnNldFNwcml0ZUZyYW1lKHRoaXMuaWNvbiwgXCJ1aUltYWdlXCIsIGUgPyBcInB1YmxpYy9hZDJcIiA6IFwicHVibGljL2FkXCIpO1xuICAgIH1cbn0pO1xuIl19