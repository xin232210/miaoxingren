
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/EffectFly.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '06a6bYADh5PIbKe9+Jug5M8', 'EffectFly');
// mainUI/scripts/EffectFly.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    coinSpine: sp.Skeleton,
    effectNodeList: [cc.Sprite]
  },
  initEffect: function initEffect(e, t, i) {
    var o = this;

    if (void 0 === i) {
      i = 1;
    }

    this.coinSpine.node.active = !0;

    if (this.IKBone) {//
    } else {
      this.IKBone = this.coinSpine.findBone("IK");
    }

    var a = this.node.parent.convertToNodeSpaceAR(t);
    this.IKBone.y = a.y;
    this.IKBone.x = a.x;
    var c = cc.JsonControl.getItemJson(e);
    cc.pvz.utils.setSpriteFrames(this.effectNodeList, "uiImage", "item/item" + c.Icon);
    this.coinSpine.setAnimation(0, 1 == i ? "huobi" : "huobi" + i, !1);
    this.coinSpine.setCompleteListener(function () {
      o.node.runAction(cc.removeSelf());
      o.coinSpine.setCompleteListener(null);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9FZmZlY3RGbHkuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjb2luU3BpbmUiLCJzcCIsIlNrZWxldG9uIiwiZWZmZWN0Tm9kZUxpc3QiLCJTcHJpdGUiLCJpbml0RWZmZWN0IiwiZSIsInQiLCJpIiwibyIsIm5vZGUiLCJhY3RpdmUiLCJJS0JvbmUiLCJmaW5kQm9uZSIsImEiLCJwYXJlbnQiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsInkiLCJ4IiwiYyIsIkpzb25Db250cm9sIiwiZ2V0SXRlbUpzb24iLCJwdnoiLCJ1dGlscyIsInNldFNwcml0ZUZyYW1lcyIsIkljb24iLCJzZXRBbmltYXRpb24iLCJzZXRDb21wbGV0ZUxpc3RlbmVyIiwicnVuQWN0aW9uIiwicmVtb3ZlU2VsZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFNBQVMsRUFBRUMsRUFBRSxDQUFDQyxRQUROO0lBRVJDLGNBQWMsRUFBRSxDQUFDUCxFQUFFLENBQUNRLE1BQUo7RUFGUixDQUZQO0VBTUxDLFVBQVUsRUFBRSxvQkFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQjtJQUMzQixJQUFJQyxDQUFDLEdBQUcsSUFBUjs7SUFDQSxJQUFJLEtBQUssQ0FBTCxLQUFXRCxDQUFmLEVBQWtCO01BQ2RBLENBQUMsR0FBRyxDQUFKO0lBQ0g7O0lBQ0QsS0FBS1IsU0FBTCxDQUFlVSxJQUFmLENBQW9CQyxNQUFwQixHQUE2QixDQUFDLENBQTlCOztJQUNBLElBQUksS0FBS0MsTUFBVCxFQUFpQixDQUNiO0lBQ0gsQ0FGRCxNQUVPO01BQ0gsS0FBS0EsTUFBTCxHQUFjLEtBQUtaLFNBQUwsQ0FBZWEsUUFBZixDQUF3QixJQUF4QixDQUFkO0lBQ0g7O0lBQ0QsSUFBSUMsQ0FBQyxHQUFHLEtBQUtKLElBQUwsQ0FBVUssTUFBVixDQUFpQkMsb0JBQWpCLENBQXNDVCxDQUF0QyxDQUFSO0lBQ0EsS0FBS0ssTUFBTCxDQUFZSyxDQUFaLEdBQWdCSCxDQUFDLENBQUNHLENBQWxCO0lBQ0EsS0FBS0wsTUFBTCxDQUFZTSxDQUFaLEdBQWdCSixDQUFDLENBQUNJLENBQWxCO0lBQ0EsSUFBSUMsQ0FBQyxHQUFHdkIsRUFBRSxDQUFDd0IsV0FBSCxDQUFlQyxXQUFmLENBQTJCZixDQUEzQixDQUFSO0lBQ0FWLEVBQUUsQ0FBQzBCLEdBQUgsQ0FBT0MsS0FBUCxDQUFhQyxlQUFiLENBQTZCLEtBQUtyQixjQUFsQyxFQUFrRCxTQUFsRCxFQUE2RCxjQUFjZ0IsQ0FBQyxDQUFDTSxJQUE3RTtJQUNBLEtBQUt6QixTQUFMLENBQWUwQixZQUFmLENBQTRCLENBQTVCLEVBQStCLEtBQUtsQixDQUFMLEdBQVMsT0FBVCxHQUFtQixVQUFVQSxDQUE1RCxFQUErRCxDQUFDLENBQWhFO0lBQ0EsS0FBS1IsU0FBTCxDQUFlMkIsbUJBQWYsQ0FBbUMsWUFBWTtNQUMzQ2xCLENBQUMsQ0FBQ0MsSUFBRixDQUFPa0IsU0FBUCxDQUFpQmhDLEVBQUUsQ0FBQ2lDLFVBQUgsRUFBakI7TUFDQXBCLENBQUMsQ0FBQ1QsU0FBRixDQUFZMkIsbUJBQVosQ0FBZ0MsSUFBaEM7SUFDSCxDQUhEO0VBSUg7QUEzQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGNvaW5TcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIGVmZmVjdE5vZGVMaXN0OiBbY2MuU3ByaXRlXVxuICAgIH0sXG4gICAgaW5pdEVmZmVjdDogZnVuY3Rpb24gKGUsIHQsIGkpIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzO1xuICAgICAgICBpZiAodm9pZCAwID09PSBpKSB7XG4gICAgICAgICAgICBpID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvaW5TcGluZS5ub2RlLmFjdGl2ZSA9ICEwO1xuICAgICAgICBpZiAodGhpcy5JS0JvbmUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLklLQm9uZSA9IHRoaXMuY29pblNwaW5lLmZpbmRCb25lKFwiSUtcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKHQpO1xuICAgICAgICB0aGlzLklLQm9uZS55ID0gYS55O1xuICAgICAgICB0aGlzLklLQm9uZS54ID0gYS54O1xuICAgICAgICB2YXIgYyA9IGNjLkpzb25Db250cm9sLmdldEl0ZW1Kc29uKGUpO1xuICAgICAgICBjYy5wdnoudXRpbHMuc2V0U3ByaXRlRnJhbWVzKHRoaXMuZWZmZWN0Tm9kZUxpc3QsIFwidWlJbWFnZVwiLCBcIml0ZW0vaXRlbVwiICsgYy5JY29uKTtcbiAgICAgICAgdGhpcy5jb2luU3BpbmUuc2V0QW5pbWF0aW9uKDAsIDEgPT0gaSA/IFwiaHVvYmlcIiA6IFwiaHVvYmlcIiArIGksICExKTtcbiAgICAgICAgdGhpcy5jb2luU3BpbmUuc2V0Q29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvLm5vZGUucnVuQWN0aW9uKGNjLnJlbW92ZVNlbGYoKSk7XG4gICAgICAgICAgICBvLmNvaW5TcGluZS5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiJdfQ==