
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/SoundManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f8dc6tQzqhD6JGqjoRnr6yk', 'SoundManager');
// scripts/SoundManager.js

"use strict";

var a = cc._decorator;
var n = a.ccclass;
var i = a.property;

var c = function (e) {
  function t() {
    var t = null !== e && e.apply(this, arguments) || this;
    t.soundEffects = [];
    t.bgms = [];
    return t;
  }

  var o;

  __extends(t, e);

  o = t;

  t.prototype.start = function () {
    o.SoundEffects = [];
    o.Bgms = [];

    for (var e = 0; e < this.soundEffects.length; e++) {
      o.SoundEffects.push(this.soundEffects[e]);
    }

    for (e = 0; e < this.bgms.length; e++) {
      o.Bgms.push(this.bgms[e]);
    }

    o.effPlayTime = {};
  };

  t.playBgm = function (e) {
    cc.butler.playMusic(o.Bgms[e]);
  };

  t.playEffect = function (e) {
    if (e) {
      cc.butler.playEffect(o.SoundEffects[e]);
    }
  };

  t.playEffect2 = function (e) {
    if (!o.effPlayTime[e] || Date.now() - o.effPlayTime[e] > 100) {
      cc.butler.playEffect(o.SoundEffects[e]);
      o.effPlayTime[e] = Date.now();
    }
  };

  t.SoundEffects = [];
  t.Bgms = [];
  t.effPlayTime = {};

  __decorate([i(cc.AudioClip)], t.prototype, "soundEffects", void 0);

  __decorate([i(cc.AudioClip)], t.prototype, "bgms", void 0);

  return o = __decorate([n], t);
}(cc.Component);

exports["default"] = c;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJhIiwiY2MiLCJfZGVjb3JhdG9yIiwibiIsImNjY2xhc3MiLCJpIiwicHJvcGVydHkiLCJjIiwiZSIsInQiLCJhcHBseSIsImFyZ3VtZW50cyIsInNvdW5kRWZmZWN0cyIsImJnbXMiLCJvIiwiX19leHRlbmRzIiwicHJvdG90eXBlIiwic3RhcnQiLCJTb3VuZEVmZmVjdHMiLCJCZ21zIiwibGVuZ3RoIiwicHVzaCIsImVmZlBsYXlUaW1lIiwicGxheUJnbSIsImJ1dGxlciIsInBsYXlNdXNpYyIsInBsYXlFZmZlY3QiLCJwbGF5RWZmZWN0MiIsIkRhdGUiLCJub3ciLCJfX2RlY29yYXRlIiwiQXVkaW9DbGlwIiwiQ29tcG9uZW50IiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxDQUFDLEdBQUdDLEVBQUUsQ0FBQ0MsVUFBWDtBQUNBLElBQUlDLENBQUMsR0FBR0gsQ0FBQyxDQUFDSSxPQUFWO0FBQ0EsSUFBSUMsQ0FBQyxHQUFHTCxDQUFDLENBQUNNLFFBQVY7O0FBQ0EsSUFBSUMsQ0FBQyxHQUFJLFVBQVVDLENBQVYsRUFBYTtFQUNsQixTQUFTQyxDQUFULEdBQWE7SUFDVCxJQUFJQSxDQUFDLEdBQUksU0FBU0QsQ0FBVCxJQUFjQSxDQUFDLENBQUNFLEtBQUYsQ0FBUSxJQUFSLEVBQWNDLFNBQWQsQ0FBZixJQUE0QyxJQUFwRDtJQUNBRixDQUFDLENBQUNHLFlBQUYsR0FBaUIsRUFBakI7SUFDQUgsQ0FBQyxDQUFDSSxJQUFGLEdBQVMsRUFBVDtJQUNBLE9BQU9KLENBQVA7RUFDSDs7RUFDRCxJQUFJSyxDQUFKOztFQUNBQyxTQUFTLENBQUNOLENBQUQsRUFBSUQsQ0FBSixDQUFUOztFQUNBTSxDQUFDLEdBQUdMLENBQUo7O0VBQ0FBLENBQUMsQ0FBQ08sU0FBRixDQUFZQyxLQUFaLEdBQW9CLFlBQVk7SUFDNUJILENBQUMsQ0FBQ0ksWUFBRixHQUFpQixFQUFqQjtJQUNBSixDQUFDLENBQUNLLElBQUYsR0FBUyxFQUFUOztJQUNBLEtBQUssSUFBSVgsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLSSxZQUFMLENBQWtCUSxNQUF0QyxFQUE4Q1osQ0FBQyxFQUEvQyxFQUFtRDtNQUMvQ00sQ0FBQyxDQUFDSSxZQUFGLENBQWVHLElBQWYsQ0FBb0IsS0FBS1QsWUFBTCxDQUFrQkosQ0FBbEIsQ0FBcEI7SUFDSDs7SUFDRCxLQUFLQSxDQUFDLEdBQUcsQ0FBVCxFQUFZQSxDQUFDLEdBQUcsS0FBS0ssSUFBTCxDQUFVTyxNQUExQixFQUFrQ1osQ0FBQyxFQUFuQyxFQUF1QztNQUNuQ00sQ0FBQyxDQUFDSyxJQUFGLENBQU9FLElBQVAsQ0FBWSxLQUFLUixJQUFMLENBQVVMLENBQVYsQ0FBWjtJQUNIOztJQUNETSxDQUFDLENBQUNRLFdBQUYsR0FBZ0IsRUFBaEI7RUFDSCxDQVZEOztFQVdBYixDQUFDLENBQUNjLE9BQUYsR0FBWSxVQUFVZixDQUFWLEVBQWE7SUFDckJQLEVBQUUsQ0FBQ3VCLE1BQUgsQ0FBVUMsU0FBVixDQUFvQlgsQ0FBQyxDQUFDSyxJQUFGLENBQU9YLENBQVAsQ0FBcEI7RUFDSCxDQUZEOztFQUdBQyxDQUFDLENBQUNpQixVQUFGLEdBQWUsVUFBVWxCLENBQVYsRUFBYTtJQUN4QixJQUFJQSxDQUFKLEVBQU87TUFDSFAsRUFBRSxDQUFDdUIsTUFBSCxDQUFVRSxVQUFWLENBQXFCWixDQUFDLENBQUNJLFlBQUYsQ0FBZVYsQ0FBZixDQUFyQjtJQUNIO0VBQ0osQ0FKRDs7RUFLQUMsQ0FBQyxDQUFDa0IsV0FBRixHQUFnQixVQUFVbkIsQ0FBVixFQUFhO0lBQ3pCLElBQUksQ0FBQ00sQ0FBQyxDQUFDUSxXQUFGLENBQWNkLENBQWQsQ0FBRCxJQUFxQm9CLElBQUksQ0FBQ0MsR0FBTCxLQUFhZixDQUFDLENBQUNRLFdBQUYsQ0FBY2QsQ0FBZCxDQUFiLEdBQWdDLEdBQXpELEVBQThEO01BQzFEUCxFQUFFLENBQUN1QixNQUFILENBQVVFLFVBQVYsQ0FBcUJaLENBQUMsQ0FBQ0ksWUFBRixDQUFlVixDQUFmLENBQXJCO01BQ0FNLENBQUMsQ0FBQ1EsV0FBRixDQUFjZCxDQUFkLElBQW1Cb0IsSUFBSSxDQUFDQyxHQUFMLEVBQW5CO0lBQ0g7RUFDSixDQUxEOztFQU1BcEIsQ0FBQyxDQUFDUyxZQUFGLEdBQWlCLEVBQWpCO0VBQ0FULENBQUMsQ0FBQ1UsSUFBRixHQUFTLEVBQVQ7RUFDQVYsQ0FBQyxDQUFDYSxXQUFGLEdBQWdCLEVBQWhCOztFQUNBUSxVQUFVLENBQUMsQ0FBQ3pCLENBQUMsQ0FBQ0osRUFBRSxDQUFDOEIsU0FBSixDQUFGLENBQUQsRUFBb0J0QixDQUFDLENBQUNPLFNBQXRCLEVBQWlDLGNBQWpDLEVBQWlELEtBQUssQ0FBdEQsQ0FBVjs7RUFDQWMsVUFBVSxDQUFDLENBQUN6QixDQUFDLENBQUNKLEVBQUUsQ0FBQzhCLFNBQUosQ0FBRixDQUFELEVBQW9CdEIsQ0FBQyxDQUFDTyxTQUF0QixFQUFpQyxNQUFqQyxFQUF5QyxLQUFLLENBQTlDLENBQVY7O0VBQ0EsT0FBUUYsQ0FBQyxHQUFHZ0IsVUFBVSxDQUFDLENBQUMzQixDQUFELENBQUQsRUFBTU0sQ0FBTixDQUF0QjtBQUNILENBekNPLENBeUNMUixFQUFFLENBQUMrQixTQXpDRSxDQUFSOztBQTBDQUMsT0FBTyxXQUFQLEdBQWtCMUIsQ0FBbEIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhID0gY2MuX2RlY29yYXRvcjtcbnZhciBuID0gYS5jY2NsYXNzO1xudmFyIGkgPSBhLnByb3BlcnR5O1xudmFyIGMgPSAoZnVuY3Rpb24gKGUpIHtcbiAgICBmdW5jdGlvbiB0KCkge1xuICAgICAgICB2YXIgdCA9IChudWxsICE9PSBlICYmIGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgfHwgdGhpcztcbiAgICAgICAgdC5zb3VuZEVmZmVjdHMgPSBbXTtcbiAgICAgICAgdC5iZ21zID0gW107XG4gICAgICAgIHJldHVybiB0O1xuICAgIH1cbiAgICB2YXIgbztcbiAgICBfX2V4dGVuZHModCwgZSk7XG4gICAgbyA9IHQ7XG4gICAgdC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uU291bmRFZmZlY3RzID0gW107XG4gICAgICAgIG8uQmdtcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHRoaXMuc291bmRFZmZlY3RzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgICAgICBvLlNvdW5kRWZmZWN0cy5wdXNoKHRoaXMuc291bmRFZmZlY3RzW2VdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGUgPSAwOyBlIDwgdGhpcy5iZ21zLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgICAgICBvLkJnbXMucHVzaCh0aGlzLmJnbXNbZV0pO1xuICAgICAgICB9XG4gICAgICAgIG8uZWZmUGxheVRpbWUgPSB7fTtcbiAgICB9O1xuICAgIHQucGxheUJnbSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNjLmJ1dGxlci5wbGF5TXVzaWMoby5CZ21zW2VdKTtcbiAgICB9O1xuICAgIHQucGxheUVmZmVjdCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBjYy5idXRsZXIucGxheUVmZmVjdChvLlNvdW5kRWZmZWN0c1tlXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHQucGxheUVmZmVjdDIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIW8uZWZmUGxheVRpbWVbZV0gfHwgRGF0ZS5ub3coKSAtIG8uZWZmUGxheVRpbWVbZV0gPiAxMDApIHtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0KG8uU291bmRFZmZlY3RzW2VdKTtcbiAgICAgICAgICAgIG8uZWZmUGxheVRpbWVbZV0gPSBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0LlNvdW5kRWZmZWN0cyA9IFtdO1xuICAgIHQuQmdtcyA9IFtdO1xuICAgIHQuZWZmUGxheVRpbWUgPSB7fTtcbiAgICBfX2RlY29yYXRlKFtpKGNjLkF1ZGlvQ2xpcCldLCB0LnByb3RvdHlwZSwgXCJzb3VuZEVmZmVjdHNcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtpKGNjLkF1ZGlvQ2xpcCldLCB0LnByb3RvdHlwZSwgXCJiZ21zXCIsIHZvaWQgMCk7XG4gICAgcmV0dXJuIChvID0gX19kZWNvcmF0ZShbbl0sIHQpKTtcbn0pKGNjLkNvbXBvbmVudCk7XG5leHBvcnRzLmRlZmF1bHQgPSBjO1xuIl19