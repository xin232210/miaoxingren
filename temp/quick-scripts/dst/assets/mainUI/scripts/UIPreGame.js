
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIPreGame.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6fccaRU2dJAkaIbqN8QNWjH', 'UIPreGame');
// mainUI/scripts/UIPreGame.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lvLabel: cc.Label
  },
  initBy: function initBy(e) {
    this.closeCb = e;
  },
  onClickStart: function onClickStart() {
    cc.popupManager.removePopup(this);
    cc.pvz.runtimeData.initByPreData();
    cc.director.loadScene("game1");
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
    cc.pvz.runtimeData.removeData();

    if (this.closeCb) {
      this.closeCb();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVByZUdhbWUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsdkxhYmVsIiwiTGFiZWwiLCJpbml0QnkiLCJlIiwiY2xvc2VDYiIsIm9uQ2xpY2tTdGFydCIsInBvcHVwTWFuYWdlciIsInJlbW92ZVBvcHVwIiwicHZ6IiwicnVudGltZURhdGEiLCJpbml0QnlQcmVEYXRhIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJvbkNsaWNrQ2xvc2UiLCJyZW1vdmVEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsT0FBTyxFQUFFSixFQUFFLENBQUNLO0VBREosQ0FGUDtFQUtMQyxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixLQUFLQyxPQUFMLEdBQWVELENBQWY7RUFDSCxDQVBJO0VBUUxFLFlBQVksRUFBRSx3QkFBWTtJQUN0QlQsRUFBRSxDQUFDVSxZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtJQUNBWCxFQUFFLENBQUNZLEdBQUgsQ0FBT0MsV0FBUCxDQUFtQkMsYUFBbkI7SUFDQWQsRUFBRSxDQUFDZSxRQUFILENBQVlDLFNBQVosQ0FBc0IsT0FBdEI7RUFDSCxDQVpJO0VBYUxDLFlBQVksRUFBRSx3QkFBWTtJQUN0QmpCLEVBQUUsQ0FBQ1UsWUFBSCxDQUFnQkMsV0FBaEIsQ0FBNEIsSUFBNUI7SUFDQVgsRUFBRSxDQUFDWSxHQUFILENBQU9DLFdBQVAsQ0FBbUJLLFVBQW5COztJQUNBLElBQUksS0FBS1YsT0FBVCxFQUFrQjtNQUNkLEtBQUtBLE9BQUw7SUFDSDtFQUNKO0FBbkJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsdkxhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLmNsb3NlQ2IgPSBlO1xuICAgIH0sXG4gICAgb25DbGlja1N0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmluaXRCeVByZURhdGEoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiZ2FtZTFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEucmVtb3ZlRGF0YSgpO1xuICAgICAgICBpZiAodGhpcy5jbG9zZUNiKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlQ2IoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19