
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/ColliderProxy.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '741ceQCQalF7I4qJREFAbhj', 'ColliderProxy');
// game/scripts/ColliderProxy.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    onEnter: cc.Component.EventHandler,
    onStay: cc.Component.EventHandler,
    onExit: cc.Component.EventHandler
  },
  onCollisionEnter: function onCollisionEnter(t, e) {
    if (this.onEnter) {
      this.onEnter.emit([t, e]);
    }
  },
  onCollisionStay: function onCollisionStay(t, e) {
    if (this.onStay) {
      this.onStay.emit([t, e]);
    }
  },
  onCollisionExit: function onCollisionExit(t, e) {
    if (this.onExit) {
      this.onExit.emit([t, e]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvQ29sbGlkZXJQcm94eS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm9uRW50ZXIiLCJFdmVudEhhbmRsZXIiLCJvblN0YXkiLCJvbkV4aXQiLCJvbkNvbGxpc2lvbkVudGVyIiwidCIsImUiLCJlbWl0Iiwib25Db2xsaXNpb25TdGF5Iiwib25Db2xsaXNpb25FeGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsT0FBTyxFQUFFSixFQUFFLENBQUNFLFNBQUgsQ0FBYUcsWUFEZDtJQUVSQyxNQUFNLEVBQUVOLEVBQUUsQ0FBQ0UsU0FBSCxDQUFhRyxZQUZiO0lBR1JFLE1BQU0sRUFBRVAsRUFBRSxDQUFDRSxTQUFILENBQWFHO0VBSGIsQ0FGUDtFQU9MRyxnQkFBZ0IsRUFBRSwwQkFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQzlCLElBQUksS0FBS04sT0FBVCxFQUFrQjtNQUNkLEtBQUtBLE9BQUwsQ0FBYU8sSUFBYixDQUFrQixDQUFDRixDQUFELEVBQUlDLENBQUosQ0FBbEI7SUFDSDtFQUNKLENBWEk7RUFZTEUsZUFBZSxFQUFFLHlCQUFVSCxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7SUFDN0IsSUFBSSxLQUFLSixNQUFULEVBQWlCO01BQ2IsS0FBS0EsTUFBTCxDQUFZSyxJQUFaLENBQWlCLENBQUNGLENBQUQsRUFBSUMsQ0FBSixDQUFqQjtJQUNIO0VBQ0osQ0FoQkk7RUFpQkxHLGVBQWUsRUFBRSx5QkFBVUosQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQzdCLElBQUksS0FBS0gsTUFBVCxFQUFpQjtNQUNiLEtBQUtBLE1BQUwsQ0FBWUksSUFBWixDQUFpQixDQUFDRixDQUFELEVBQUlDLENBQUosQ0FBakI7SUFDSDtFQUNKO0FBckJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBvbkVudGVyOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICBvblN0YXk6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgIG9uRXhpdDogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlclxuICAgIH0sXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICAgICAgaWYgKHRoaXMub25FbnRlcikge1xuICAgICAgICAgICAgdGhpcy5vbkVudGVyLmVtaXQoW3QsIGVdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Db2xsaXNpb25TdGF5OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodGhpcy5vblN0YXkpIHtcbiAgICAgICAgICAgIHRoaXMub25TdGF5LmVtaXQoW3QsIGVdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Db2xsaXNpb25FeGl0OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodGhpcy5vbkV4aXQpIHtcbiAgICAgICAgICAgIHRoaXMub25FeGl0LmVtaXQoW3QsIGVdKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19