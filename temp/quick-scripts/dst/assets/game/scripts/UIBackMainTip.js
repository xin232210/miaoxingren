
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UIBackMainTip.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '908acqYridGR4EbhnPE4eGC', 'UIBackMainTip');
// game/scripts/UIBackMainTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy() {},
  onCloseUI: function onCloseUI() {
    cc.popupManager.removePopup(this);
  },
  onClickBackToMain: function onClickBackToMain() {
    cc.popupManager.removeAllPopups();
    cc.pvz.runtimeData.removeData();
    cc.director.loadScene("mainUI");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlCYWNrTWFpblRpcC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImluaXRCeSIsIm9uQ2xvc2VVSSIsInBvcHVwTWFuYWdlciIsInJlbW92ZVBvcHVwIiwib25DbGlja0JhY2tUb01haW4iLCJyZW1vdmVBbGxQb3B1cHMiLCJwdnoiLCJydW50aW1lRGF0YSIsInJlbW92ZURhdGEiLCJkaXJlY3RvciIsImxvYWRTY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFLEVBRlA7RUFHTEMsTUFBTSxFQUFFLGtCQUFZLENBQUUsQ0FIakI7RUFJTEMsU0FBUyxFQUFFLHFCQUFZO0lBQ25CTCxFQUFFLENBQUNNLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0gsQ0FOSTtFQU9MQyxpQkFBaUIsRUFBRSw2QkFBWTtJQUMzQlIsRUFBRSxDQUFDTSxZQUFILENBQWdCRyxlQUFoQjtJQUNBVCxFQUFFLENBQUNVLEdBQUgsQ0FBT0MsV0FBUCxDQUFtQkMsVUFBbkI7SUFDQVosRUFBRSxDQUFDYSxRQUFILENBQVlDLFNBQVosQ0FBc0IsUUFBdEI7RUFDSDtBQVhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge30sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoKSB7fSxcbiAgICBvbkNsb3NlVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH0sXG4gICAgb25DbGlja0JhY2tUb01haW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZUFsbFBvcHVwcygpO1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEucmVtb3ZlRGF0YSgpO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYWluVUlcIik7XG4gICAgfVxufSk7XG4iXX0=