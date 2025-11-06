
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UIStashTip.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0c5c3NiQZpF45h2kDMgbSQn', 'UIStashTip');
// game/scripts/UIStashTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  initBy: function initBy(t) {
    this.cb = t;
  },
  onClickClose: function onClickClose() {
    this.cb(!1);
    cc.popupManager.removePopup(this);
  },
  onClickStart: function onClickStart() {
    this.cb(!0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlTdGFzaFRpcC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImluaXRCeSIsInQiLCJjYiIsIm9uQ2xpY2tDbG9zZSIsInBvcHVwTWFuYWdlciIsInJlbW92ZVBvcHVwIiwib25DbGlja1N0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUUsRUFGUDtFQUdMQyxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixLQUFLQyxFQUFMLEdBQVVELENBQVY7RUFDSCxDQUxJO0VBTUxFLFlBQVksRUFBRSx3QkFBWTtJQUN0QixLQUFLRCxFQUFMLENBQVEsQ0FBQyxDQUFUO0lBQ0FOLEVBQUUsQ0FBQ1EsWUFBSCxDQUFnQkMsV0FBaEIsQ0FBNEIsSUFBNUI7RUFDSCxDQVRJO0VBVUxDLFlBQVksRUFBRSx3QkFBWTtJQUN0QixLQUFLSixFQUFMLENBQVEsQ0FBQyxDQUFUO0lBQ0FOLEVBQUUsQ0FBQ1EsWUFBSCxDQUFnQkMsV0FBaEIsQ0FBNEIsSUFBNUI7RUFDSDtBQWJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge30sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmNiID0gdDtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNiKCExKTtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH0sXG4gICAgb25DbGlja1N0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2IoITApO1xuICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlUG9wdXAodGhpcyk7XG4gICAgfVxufSk7XG4iXX0=