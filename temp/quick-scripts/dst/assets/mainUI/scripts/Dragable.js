
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/Dragable.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '3adadwr1bRO+KBUksbSlGo6', 'Dragable');
// mainUI/scripts/Dragable.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    dragingRoot: cc.Node,
    onDragBegan: cc.Component.EventHandler,
    onDragMoved: cc.Component.EventHandler,
    onDragEnded: cc.Component.EventHandler
  },
  start: function start() {
    this.initRoot = this.node.parent;
    this.initPos = this.node.position;
    this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
  },
  setNodePos: function setNodePos(e) {
    this.node.position = this.node.parent.convertToNodeSpaceAR(e);
  },
  onClickBegan: function onClickBegan(e) {
    var t = e.getLocation();
    this.node.parent = this.dragingRoot;
    this.setNodePos(t);

    if (this.onDragBegan) {
      this.onDragBegan.emit([this, t]);
    }
  },
  onClickMoved: function onClickMoved(e) {
    var t = e.getLocation();
    this.setNodePos(t);

    if (this.onDragMoved) {
      this.onDragMoved.emit([this, t]);
    }
  },
  onClickEnded: function onClickEnded(e) {
    var t = e.getLocation();
    this.setNodePos(t);

    if (this.onDragEnded) {
      this.onDragEnded.emit([this, t]);
    }

    this.node.parent = this.initRoot;
    this.node.position = this.initPos;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9EcmFnYWJsZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImRyYWdpbmdSb290IiwiTm9kZSIsIm9uRHJhZ0JlZ2FuIiwiRXZlbnRIYW5kbGVyIiwib25EcmFnTW92ZWQiLCJvbkRyYWdFbmRlZCIsInN0YXJ0IiwiaW5pdFJvb3QiLCJub2RlIiwicGFyZW50IiwiaW5pdFBvcyIsInBvc2l0aW9uIiwib24iLCJFdmVudFR5cGUiLCJUT1VDSF9TVEFSVCIsIm9uQ2xpY2tCZWdhbiIsIlRPVUNIX01PVkUiLCJvbkNsaWNrTW92ZWQiLCJUT1VDSF9FTkQiLCJvbkNsaWNrRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJzZXROb2RlUG9zIiwiZSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwidCIsImdldExvY2F0aW9uIiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFdBQVcsRUFBRUosRUFBRSxDQUFDSyxJQURSO0lBRVJDLFdBQVcsRUFBRU4sRUFBRSxDQUFDRSxTQUFILENBQWFLLFlBRmxCO0lBR1JDLFdBQVcsRUFBRVIsRUFBRSxDQUFDRSxTQUFILENBQWFLLFlBSGxCO0lBSVJFLFdBQVcsRUFBRVQsRUFBRSxDQUFDRSxTQUFILENBQWFLO0VBSmxCLENBRlA7RUFRTEcsS0FBSyxFQUFFLGlCQUFZO0lBQ2YsS0FBS0MsUUFBTCxHQUFnQixLQUFLQyxJQUFMLENBQVVDLE1BQTFCO0lBQ0EsS0FBS0MsT0FBTCxHQUFlLEtBQUtGLElBQUwsQ0FBVUcsUUFBekI7SUFDQSxLQUFLSCxJQUFMLENBQVVJLEVBQVYsQ0FBYWhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRWSxTQUFSLENBQWtCQyxXQUEvQixFQUE0QyxLQUFLQyxZQUFqRCxFQUErRCxJQUEvRDtJQUNBLEtBQUtQLElBQUwsQ0FBVUksRUFBVixDQUFhaEIsRUFBRSxDQUFDSyxJQUFILENBQVFZLFNBQVIsQ0FBa0JHLFVBQS9CLEVBQTJDLEtBQUtDLFlBQWhELEVBQThELElBQTlEO0lBQ0EsS0FBS1QsSUFBTCxDQUFVSSxFQUFWLENBQWFoQixFQUFFLENBQUNLLElBQUgsQ0FBUVksU0FBUixDQUFrQkssU0FBL0IsRUFBMEMsS0FBS0MsWUFBL0MsRUFBNkQsSUFBN0Q7SUFDQSxLQUFLWCxJQUFMLENBQVVJLEVBQVYsQ0FBYWhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRWSxTQUFSLENBQWtCTyxZQUEvQixFQUE2QyxLQUFLRCxZQUFsRCxFQUFnRSxJQUFoRTtFQUNILENBZkk7RUFnQkxFLFVBQVUsRUFBRSxvQkFBVUMsQ0FBVixFQUFhO0lBQ3JCLEtBQUtkLElBQUwsQ0FBVUcsUUFBVixHQUFxQixLQUFLSCxJQUFMLENBQVVDLE1BQVYsQ0FBaUJjLG9CQUFqQixDQUFzQ0QsQ0FBdEMsQ0FBckI7RUFDSCxDQWxCSTtFQW1CTFAsWUFBWSxFQUFFLHNCQUFVTyxDQUFWLEVBQWE7SUFDdkIsSUFBSUUsQ0FBQyxHQUFHRixDQUFDLENBQUNHLFdBQUYsRUFBUjtJQUNBLEtBQUtqQixJQUFMLENBQVVDLE1BQVYsR0FBbUIsS0FBS1QsV0FBeEI7SUFDQSxLQUFLcUIsVUFBTCxDQUFnQkcsQ0FBaEI7O0lBQ0EsSUFBSSxLQUFLdEIsV0FBVCxFQUFzQjtNQUNsQixLQUFLQSxXQUFMLENBQWlCd0IsSUFBakIsQ0FBc0IsQ0FBQyxJQUFELEVBQU9GLENBQVAsQ0FBdEI7SUFDSDtFQUNKLENBMUJJO0VBMkJMUCxZQUFZLEVBQUUsc0JBQVVLLENBQVYsRUFBYTtJQUN2QixJQUFJRSxDQUFDLEdBQUdGLENBQUMsQ0FBQ0csV0FBRixFQUFSO0lBQ0EsS0FBS0osVUFBTCxDQUFnQkcsQ0FBaEI7O0lBQ0EsSUFBSSxLQUFLcEIsV0FBVCxFQUFzQjtNQUNsQixLQUFLQSxXQUFMLENBQWlCc0IsSUFBakIsQ0FBc0IsQ0FBQyxJQUFELEVBQU9GLENBQVAsQ0FBdEI7SUFDSDtFQUNKLENBakNJO0VBa0NMTCxZQUFZLEVBQUUsc0JBQVVHLENBQVYsRUFBYTtJQUN2QixJQUFJRSxDQUFDLEdBQUdGLENBQUMsQ0FBQ0csV0FBRixFQUFSO0lBQ0EsS0FBS0osVUFBTCxDQUFnQkcsQ0FBaEI7O0lBQ0EsSUFBSSxLQUFLbkIsV0FBVCxFQUFzQjtNQUNsQixLQUFLQSxXQUFMLENBQWlCcUIsSUFBakIsQ0FBc0IsQ0FBQyxJQUFELEVBQU9GLENBQVAsQ0FBdEI7SUFDSDs7SUFDRCxLQUFLaEIsSUFBTCxDQUFVQyxNQUFWLEdBQW1CLEtBQUtGLFFBQXhCO0lBQ0EsS0FBS0MsSUFBTCxDQUFVRyxRQUFWLEdBQXFCLEtBQUtELE9BQTFCO0VBQ0g7QUExQ0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGRyYWdpbmdSb290OiBjYy5Ob2RlLFxuICAgICAgICBvbkRyYWdCZWdhbjogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgb25EcmFnTW92ZWQ6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgIG9uRHJhZ0VuZGVkOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyXG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRSb290ID0gdGhpcy5ub2RlLnBhcmVudDtcbiAgICAgICAgdGhpcy5pbml0UG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25DbGlja0JlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbkNsaWNrRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzZXROb2RlUG9zOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLm5vZGUucG9zaXRpb24gPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgIH0sXG4gICAgb25DbGlja0JlZ2FuOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IGUuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IHRoaXMuZHJhZ2luZ1Jvb3Q7XG4gICAgICAgIHRoaXMuc2V0Tm9kZVBvcyh0KTtcbiAgICAgICAgaWYgKHRoaXMub25EcmFnQmVnYW4pIHtcbiAgICAgICAgICAgIHRoaXMub25EcmFnQmVnYW4uZW1pdChbdGhpcywgdF0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrTW92ZWQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gZS5nZXRMb2NhdGlvbigpO1xuICAgICAgICB0aGlzLnNldE5vZGVQb3ModCk7XG4gICAgICAgIGlmICh0aGlzLm9uRHJhZ01vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uRHJhZ01vdmVkLmVtaXQoW3RoaXMsIHRdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja0VuZGVkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IGUuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgdGhpcy5zZXROb2RlUG9zKHQpO1xuICAgICAgICBpZiAodGhpcy5vbkRyYWdFbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmRlZC5lbWl0KFt0aGlzLCB0XSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IHRoaXMuaW5pdFJvb3Q7XG4gICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMuaW5pdFBvcztcbiAgICB9XG59KTtcbiJdfQ==