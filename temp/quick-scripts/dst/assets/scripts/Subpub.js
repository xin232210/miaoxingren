
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Subpub.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6ddb50dvtJBk4vLFdU9liUF', 'Subpub');
// scripts/Subpub.js

"use strict";

var a = function () {
  function e(t) {
    if (void 0 === t) {
      t = {};
    }

    this.idx = 0;
    this.config = {};
    this.idx = e.subPubUniqueIdx++;
    this.config = t;
  }

  e.clearAll = function () {
    e.subPubUniqueIdx = 1;
    e.subRec = {};
  };

  e.prototype.subscribe = function (t, o) {
    if (e.subRec[t]) {//
    } else {
      e.subRec[t] = {};
    }

    e.subRec[t][this.idx] = {
      cb: o
    };
  };

  e.prototype.deSubscribe = function (t) {
    if (e.subRec[t]) {
      delete e.subRec[t][this.idx];
    }
  };

  e.prototype.publish = function (t, o) {
    for (var a in e.subRec[t]) {
      e.subRec[t][a].cb(this.idx, o, this.config);
    }
  };

  e.publishEx = function (t, o) {
    for (var a in void 0 === o && (o = {}), e.subRec[t]) {
      try {
        e.subRec[t][a].cb(-1, o, {});
      } catch (e) {}
    }
  };

  e.subPubUniqueIdx = 1;
  e.subRec = {};
  return e;
}();

exports["default"] = a;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1N1YnB1Yi5qcyJdLCJuYW1lcyI6WyJhIiwiZSIsInQiLCJpZHgiLCJjb25maWciLCJzdWJQdWJVbmlxdWVJZHgiLCJjbGVhckFsbCIsInN1YlJlYyIsInByb3RvdHlwZSIsInN1YnNjcmliZSIsIm8iLCJjYiIsImRlU3Vic2NyaWJlIiwicHVibGlzaCIsInB1Ymxpc2hFeCIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsQ0FBQyxHQUFJLFlBQVk7RUFDakIsU0FBU0MsQ0FBVCxDQUFXQyxDQUFYLEVBQWM7SUFDVixJQUFJLEtBQUssQ0FBTCxLQUFXQSxDQUFmLEVBQWtCO01BQ2RBLENBQUMsR0FBRyxFQUFKO0lBQ0g7O0lBQ0QsS0FBS0MsR0FBTCxHQUFXLENBQVg7SUFDQSxLQUFLQyxNQUFMLEdBQWMsRUFBZDtJQUNBLEtBQUtELEdBQUwsR0FBV0YsQ0FBQyxDQUFDSSxlQUFGLEVBQVg7SUFDQSxLQUFLRCxNQUFMLEdBQWNGLENBQWQ7RUFDSDs7RUFDREQsQ0FBQyxDQUFDSyxRQUFGLEdBQWEsWUFBWTtJQUNyQkwsQ0FBQyxDQUFDSSxlQUFGLEdBQW9CLENBQXBCO0lBQ0FKLENBQUMsQ0FBQ00sTUFBRixHQUFXLEVBQVg7RUFDSCxDQUhEOztFQUlBTixDQUFDLENBQUNPLFNBQUYsQ0FBWUMsU0FBWixHQUF3QixVQUFVUCxDQUFWLEVBQWFRLENBQWIsRUFBZ0I7SUFDcEMsSUFBSVQsQ0FBQyxDQUFDTSxNQUFGLENBQVNMLENBQVQsQ0FBSixFQUFpQixDQUNiO0lBQ0gsQ0FGRCxNQUVPO01BQ0hELENBQUMsQ0FBQ00sTUFBRixDQUFTTCxDQUFULElBQWMsRUFBZDtJQUNIOztJQUNERCxDQUFDLENBQUNNLE1BQUYsQ0FBU0wsQ0FBVCxFQUFZLEtBQUtDLEdBQWpCLElBQXdCO01BQ3BCUSxFQUFFLEVBQUVEO0lBRGdCLENBQXhCO0VBR0gsQ0FURDs7RUFVQVQsQ0FBQyxDQUFDTyxTQUFGLENBQVlJLFdBQVosR0FBMEIsVUFBVVYsQ0FBVixFQUFhO0lBQ25DLElBQUlELENBQUMsQ0FBQ00sTUFBRixDQUFTTCxDQUFULENBQUosRUFBaUI7TUFDYixPQUFPRCxDQUFDLENBQUNNLE1BQUYsQ0FBU0wsQ0FBVCxFQUFZLEtBQUtDLEdBQWpCLENBQVA7SUFDSDtFQUNKLENBSkQ7O0VBS0FGLENBQUMsQ0FBQ08sU0FBRixDQUFZSyxPQUFaLEdBQXNCLFVBQVVYLENBQVYsRUFBYVEsQ0FBYixFQUFnQjtJQUNsQyxLQUFLLElBQUlWLENBQVQsSUFBY0MsQ0FBQyxDQUFDTSxNQUFGLENBQVNMLENBQVQsQ0FBZDtNQUEyQkQsQ0FBQyxDQUFDTSxNQUFGLENBQVNMLENBQVQsRUFBWUYsQ0FBWixFQUFlVyxFQUFmLENBQWtCLEtBQUtSLEdBQXZCLEVBQTRCTyxDQUE1QixFQUErQixLQUFLTixNQUFwQztJQUEzQjtFQUNILENBRkQ7O0VBR0FILENBQUMsQ0FBQ2EsU0FBRixHQUFjLFVBQVVaLENBQVYsRUFBYVEsQ0FBYixFQUFnQjtJQUMxQixLQUFLLElBQUlWLENBQVQsSUFBZSxLQUFLLENBQUwsS0FBV1UsQ0FBWCxLQUFpQkEsQ0FBQyxHQUFHLEVBQXJCLEdBQTBCVCxDQUFDLENBQUNNLE1BQUYsQ0FBU0wsQ0FBVCxDQUF6QztNQUNJLElBQUk7UUFDQUQsQ0FBQyxDQUFDTSxNQUFGLENBQVNMLENBQVQsRUFBWUYsQ0FBWixFQUFlVyxFQUFmLENBQWtCLENBQUMsQ0FBbkIsRUFBc0JELENBQXRCLEVBQXlCLEVBQXpCO01BQ0gsQ0FGRCxDQUVFLE9BQU9ULENBQVAsRUFBVSxDQUFFO0lBSGxCO0VBSUgsQ0FMRDs7RUFNQUEsQ0FBQyxDQUFDSSxlQUFGLEdBQW9CLENBQXBCO0VBQ0FKLENBQUMsQ0FBQ00sTUFBRixHQUFXLEVBQVg7RUFDQSxPQUFPTixDQUFQO0FBQ0gsQ0F6Q08sRUFBUjs7QUEwQ0FjLE9BQU8sV0FBUCxHQUFrQmYsQ0FBbEIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBlKHQpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gdCkge1xuICAgICAgICAgICAgdCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaWR4ID0gMDtcbiAgICAgICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICAgICAgdGhpcy5pZHggPSBlLnN1YlB1YlVuaXF1ZUlkeCsrO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHQ7XG4gICAgfVxuICAgIGUuY2xlYXJBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGUuc3ViUHViVW5pcXVlSWR4ID0gMTtcbiAgICAgICAgZS5zdWJSZWMgPSB7fTtcbiAgICB9O1xuICAgIGUucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICh0LCBvKSB7XG4gICAgICAgIGlmIChlLnN1YlJlY1t0XSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGUuc3ViUmVjW3RdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZS5zdWJSZWNbdF1bdGhpcy5pZHhdID0ge1xuICAgICAgICAgICAgY2I6IG9cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGUucHJvdG90eXBlLmRlU3Vic2NyaWJlID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKGUuc3ViUmVjW3RdKSB7XG4gICAgICAgICAgICBkZWxldGUgZS5zdWJSZWNbdF1bdGhpcy5pZHhdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBlLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24gKHQsIG8pIHtcbiAgICAgICAgZm9yICh2YXIgYSBpbiBlLnN1YlJlY1t0XSkgZS5zdWJSZWNbdF1bYV0uY2IodGhpcy5pZHgsIG8sIHRoaXMuY29uZmlnKTtcbiAgICB9O1xuICAgIGUucHVibGlzaEV4ID0gZnVuY3Rpb24gKHQsIG8pIHtcbiAgICAgICAgZm9yICh2YXIgYSBpbiAodm9pZCAwID09PSBvICYmIChvID0ge30pLCBlLnN1YlJlY1t0XSkpXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGUuc3ViUmVjW3RdW2FdLmNiKC0xLCBvLCB7fSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH07XG4gICAgZS5zdWJQdWJVbmlxdWVJZHggPSAxO1xuICAgIGUuc3ViUmVjID0ge307XG4gICAgcmV0dXJuIGU7XG59KSgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gYTtcbiJdfQ==