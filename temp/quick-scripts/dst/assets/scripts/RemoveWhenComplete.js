
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/RemoveWhenComplete.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dace2p4R3RLfYgcmFlF+SSd', 'RemoveWhenComplete');
// scripts/RemoveWhenComplete.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    fixedScale: !0
  },
  onLoad: function onLoad() {
    var e = this;
    this.spine.setCompleteListener(function () {
      e.node.parent = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1JlbW92ZVdoZW5Db21wbGV0ZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsImZpeGVkU2NhbGUiLCJvbkxvYWQiLCJlIiwic2V0Q29tcGxldGVMaXN0ZW5lciIsIm5vZGUiLCJwYXJlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxLQUFLLEVBQUVDLEVBQUUsQ0FBQ0MsUUFERjtJQUVSQyxVQUFVLEVBQUUsQ0FBQztFQUZMLENBRlA7RUFNTEMsTUFBTSxFQUFFLGtCQUFZO0lBQ2hCLElBQUlDLENBQUMsR0FBRyxJQUFSO0lBQ0EsS0FBS0wsS0FBTCxDQUFXTSxtQkFBWCxDQUErQixZQUFZO01BQ3ZDRCxDQUFDLENBQUNFLElBQUYsQ0FBT0MsTUFBUCxHQUFnQixJQUFoQjtJQUNILENBRkQ7RUFHSDtBQVhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIGZpeGVkU2NhbGU6ICEwXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICB0aGlzLnNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZS5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl19