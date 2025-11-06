
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/Enemy12.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4a5346YF8NGpovlq5z/Ex8k', 'Enemy12');
// game/scripts/Enemy12.js

"use strict";

var $enemy = require("./Enemy");

cc.Class({
  "extends": $enemy,
  properties: {
    groundNode: cc.Node
  },
  initBy: function initBy(t, e, n, o) {
    $enemy.prototype.initBy.call(this, t, e, n, o);
    this.groundNode.parent = this.scene.ground;
    this.groundNode.position = this.node.position;
  },
  update: function update(t) {
    $enemy.prototype.update.call(this, t);

    if (this.groundNode) {
      this.groundNode.position = this.node.position;
    }
  },
  hurtBy: function hurtBy(t, e) {
    if (this.hp <= 0) {//
    } else {
      $enemy.prototype.hurtBy.call(this, t, e);

      if (this.hp <= 0 && this.groundNode) {
        this.groundNode.parent = null;
        this.groundNode = null;
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvRW5lbXkxMi5qcyJdLCJuYW1lcyI6WyIkZW5lbXkiLCJyZXF1aXJlIiwiY2MiLCJDbGFzcyIsInByb3BlcnRpZXMiLCJncm91bmROb2RlIiwiTm9kZSIsImluaXRCeSIsInQiLCJlIiwibiIsIm8iLCJwcm90b3R5cGUiLCJjYWxsIiwicGFyZW50Iiwic2NlbmUiLCJncm91bmQiLCJwb3NpdGlvbiIsIm5vZGUiLCJ1cGRhdGUiLCJodXJ0QnkiLCJocCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXBCOztBQUNBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNILE1BREo7RUFFTEksVUFBVSxFQUFFO0lBQ1JDLFVBQVUsRUFBRUgsRUFBRSxDQUFDSTtFQURQLENBRlA7RUFLTEMsTUFBTSxFQUFFLGdCQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQjtJQUMxQlgsTUFBTSxDQUFDWSxTQUFQLENBQWlCTCxNQUFqQixDQUF3Qk0sSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUNMLENBQW5DLEVBQXNDQyxDQUF0QyxFQUF5Q0MsQ0FBekMsRUFBNENDLENBQTVDO0lBQ0EsS0FBS04sVUFBTCxDQUFnQlMsTUFBaEIsR0FBeUIsS0FBS0MsS0FBTCxDQUFXQyxNQUFwQztJQUNBLEtBQUtYLFVBQUwsQ0FBZ0JZLFFBQWhCLEdBQTJCLEtBQUtDLElBQUwsQ0FBVUQsUUFBckM7RUFDSCxDQVRJO0VBVUxFLE1BQU0sRUFBRSxnQkFBVVgsQ0FBVixFQUFhO0lBQ2pCUixNQUFNLENBQUNZLFNBQVAsQ0FBaUJPLE1BQWpCLENBQXdCTixJQUF4QixDQUE2QixJQUE3QixFQUFtQ0wsQ0FBbkM7O0lBQ0EsSUFBSSxLQUFLSCxVQUFULEVBQXFCO01BQ2pCLEtBQUtBLFVBQUwsQ0FBZ0JZLFFBQWhCLEdBQTJCLEtBQUtDLElBQUwsQ0FBVUQsUUFBckM7SUFDSDtFQUNKLENBZkk7RUFnQkxHLE1BQU0sRUFBRSxnQkFBVVosQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQ3BCLElBQUksS0FBS1ksRUFBTCxJQUFXLENBQWYsRUFBa0IsQ0FDZDtJQUNILENBRkQsTUFFTztNQUNIckIsTUFBTSxDQUFDWSxTQUFQLENBQWlCUSxNQUFqQixDQUF3QlAsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUNMLENBQW5DLEVBQXNDQyxDQUF0Qzs7TUFDQSxJQUFJLEtBQUtZLEVBQUwsSUFBVyxDQUFYLElBQWdCLEtBQUtoQixVQUF6QixFQUFxQztRQUNqQyxLQUFLQSxVQUFMLENBQWdCUyxNQUFoQixHQUF5QixJQUF6QjtRQUNBLEtBQUtULFVBQUwsR0FBa0IsSUFBbEI7TUFDSDtJQUNKO0VBQ0o7QUExQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyICRlbmVteSA9IHJlcXVpcmUoXCIuL0VuZW15XCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6ICRlbmVteSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyb3VuZE5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKHQsIGUsIG4sIG8pIHtcbiAgICAgICAgJGVuZW15LnByb3RvdHlwZS5pbml0QnkuY2FsbCh0aGlzLCB0LCBlLCBuLCBvKTtcbiAgICAgICAgdGhpcy5ncm91bmROb2RlLnBhcmVudCA9IHRoaXMuc2NlbmUuZ3JvdW5kO1xuICAgICAgICB0aGlzLmdyb3VuZE5vZGUucG9zaXRpb24gPSB0aGlzLm5vZGUucG9zaXRpb247XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICRlbmVteS5wcm90b3R5cGUudXBkYXRlLmNhbGwodGhpcywgdCk7XG4gICAgICAgIGlmICh0aGlzLmdyb3VuZE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kTm9kZS5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaHVydEJ5OiBmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICBpZiAodGhpcy5ocCA8PSAwKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGVuZW15LnByb3RvdHlwZS5odXJ0QnkuY2FsbCh0aGlzLCB0LCBlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhwIDw9IDAgJiYgdGhpcy5ncm91bmROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmROb2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19