
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/DieEff2.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f867bPLNXFBP6DGSwTrk17o', 'DieEff2');
// scripts/DieEff2.js

"use strict";

var $tool = require("./Tool");

var $pool = require("./Pool");

var i = cc._decorator;
var c = i.ccclass;
var s = i.property;

var r = function (e) {
  function t() {
    var t = null !== e && e.apply(this, arguments) || this;
    t.bodySpine = null;
    return t;
  }

  __extends(t, e);

  t.prototype.init = function () {
    this.bodySpine.setAnimation(0, "die" + $tool["default"].randomInt(1, 3), !1);
  };

  t.prototype.start = function () {
    var e = this;
    this.bodySpine.setCompleteListener(function () {
      e.node.parent.getComponent($pool["default"]).destroyPoolItem(e.node);
    });
  };

  __decorate([s(sp.Skeleton)], t.prototype, "bodySpine", void 0);

  return __decorate([c], t);
}(cc.Component);

exports["default"] = r;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0RpZUVmZjIuanMiXSwibmFtZXMiOlsiJHRvb2wiLCJyZXF1aXJlIiwiJHBvb2wiLCJpIiwiY2MiLCJfZGVjb3JhdG9yIiwiYyIsImNjY2xhc3MiLCJzIiwicHJvcGVydHkiLCJyIiwiZSIsInQiLCJhcHBseSIsImFyZ3VtZW50cyIsImJvZHlTcGluZSIsIl9fZXh0ZW5kcyIsInByb3RvdHlwZSIsImluaXQiLCJzZXRBbmltYXRpb24iLCJyYW5kb21JbnQiLCJzdGFydCIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJub2RlIiwicGFyZW50IiwiZ2V0Q29tcG9uZW50IiwiZGVzdHJveVBvb2xJdGVtIiwiX19kZWNvcmF0ZSIsInNwIiwiU2tlbGV0b24iLCJDb21wb25lbnQiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLEtBQUssR0FBR0MsT0FBTyxDQUFDLFFBQUQsQ0FBbkI7O0FBQ0EsSUFBSUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsUUFBRCxDQUFuQjs7QUFDQSxJQUFJRSxDQUFDLEdBQUdDLEVBQUUsQ0FBQ0MsVUFBWDtBQUNBLElBQUlDLENBQUMsR0FBR0gsQ0FBQyxDQUFDSSxPQUFWO0FBQ0EsSUFBSUMsQ0FBQyxHQUFHTCxDQUFDLENBQUNNLFFBQVY7O0FBQ0EsSUFBSUMsQ0FBQyxHQUFJLFVBQVVDLENBQVYsRUFBYTtFQUNsQixTQUFTQyxDQUFULEdBQWE7SUFDVCxJQUFJQSxDQUFDLEdBQUksU0FBU0QsQ0FBVCxJQUFjQSxDQUFDLENBQUNFLEtBQUYsQ0FBUSxJQUFSLEVBQWNDLFNBQWQsQ0FBZixJQUE0QyxJQUFwRDtJQUNBRixDQUFDLENBQUNHLFNBQUYsR0FBYyxJQUFkO0lBQ0EsT0FBT0gsQ0FBUDtFQUNIOztFQUNESSxTQUFTLENBQUNKLENBQUQsRUFBSUQsQ0FBSixDQUFUOztFQUNBQyxDQUFDLENBQUNLLFNBQUYsQ0FBWUMsSUFBWixHQUFtQixZQUFZO0lBQzNCLEtBQUtILFNBQUwsQ0FBZUksWUFBZixDQUE0QixDQUE1QixFQUErQixRQUFRbkIsS0FBSyxXQUFMLENBQWNvQixTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLENBQXZDLEVBQXNFLENBQUMsQ0FBdkU7RUFDSCxDQUZEOztFQUdBUixDQUFDLENBQUNLLFNBQUYsQ0FBWUksS0FBWixHQUFvQixZQUFZO0lBQzVCLElBQUlWLENBQUMsR0FBRyxJQUFSO0lBQ0EsS0FBS0ksU0FBTCxDQUFlTyxtQkFBZixDQUFtQyxZQUFZO01BQzNDWCxDQUFDLENBQUNZLElBQUYsQ0FBT0MsTUFBUCxDQUFjQyxZQUFkLENBQTJCdkIsS0FBSyxXQUFoQyxFQUEwQ3dCLGVBQTFDLENBQTBEZixDQUFDLENBQUNZLElBQTVEO0lBQ0gsQ0FGRDtFQUdILENBTEQ7O0VBTUFJLFVBQVUsQ0FBQyxDQUFDbkIsQ0FBQyxDQUFDb0IsRUFBRSxDQUFDQyxRQUFKLENBQUYsQ0FBRCxFQUFtQmpCLENBQUMsQ0FBQ0ssU0FBckIsRUFBZ0MsV0FBaEMsRUFBNkMsS0FBSyxDQUFsRCxDQUFWOztFQUNBLE9BQU9VLFVBQVUsQ0FBQyxDQUFDckIsQ0FBRCxDQUFELEVBQU1NLENBQU4sQ0FBakI7QUFDSCxDQWxCTyxDQWtCTFIsRUFBRSxDQUFDMEIsU0FsQkUsQ0FBUjs7QUFtQkFDLE9BQU8sV0FBUCxHQUFrQnJCLENBQWxCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJHRvb2wgPSByZXF1aXJlKFwiLi9Ub29sXCIpO1xudmFyICRwb29sID0gcmVxdWlyZShcIi4vUG9vbFwiKTtcbnZhciBpID0gY2MuX2RlY29yYXRvcjtcbnZhciBjID0gaS5jY2NsYXNzO1xudmFyIHMgPSBpLnByb3BlcnR5O1xudmFyIHIgPSAoZnVuY3Rpb24gKGUpIHtcbiAgICBmdW5jdGlvbiB0KCkge1xuICAgICAgICB2YXIgdCA9IChudWxsICE9PSBlICYmIGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgfHwgdGhpcztcbiAgICAgICAgdC5ib2R5U3BpbmUgPSBudWxsO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9XG4gICAgX19leHRlbmRzKHQsIGUpO1xuICAgIHQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYm9keVNwaW5lLnNldEFuaW1hdGlvbigwLCBcImRpZVwiICsgJHRvb2wuZGVmYXVsdC5yYW5kb21JbnQoMSwgMyksICExKTtcbiAgICB9O1xuICAgIHQucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuYm9keVNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZS5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoJHBvb2wuZGVmYXVsdCkuZGVzdHJveVBvb2xJdGVtKGUubm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgX19kZWNvcmF0ZShbcyhzcC5Ta2VsZXRvbildLCB0LnByb3RvdHlwZSwgXCJib2R5U3BpbmVcIiwgdm9pZCAwKTtcbiAgICByZXR1cm4gX19kZWNvcmF0ZShbY10sIHQpO1xufSkoY2MuQ29tcG9uZW50KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHI7XG4iXX0=