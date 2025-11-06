
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/ContentAdapter.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '5bef7annw9LvoYqXEHEylmf', 'ContentAdapter');
// scripts/ContentAdapter.js

"use strict";

cc.Class({
  "extends": cc.Component,
  onLoad: function onLoad() {
    var e = Math.min(cc.view.getCanvasSize().width / this.node.width, cc.view.getCanvasSize().height / this.node.height);
    var t = this.node.width * e;
    var o = this.node.height * e;
    this.node.width = this.node.width * (cc.view.getCanvasSize().width / t);
    this.node.height = this.node.height * (cc.view.getCanvasSize().height / o);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0NvbnRlbnRBZGFwdGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJvbkxvYWQiLCJlIiwiTWF0aCIsIm1pbiIsInZpZXciLCJnZXRDYW52YXNTaXplIiwid2lkdGgiLCJub2RlIiwiaGVpZ2h0IiwidCIsIm8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixJQUFJQyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUNKTixFQUFFLENBQUNPLElBQUgsQ0FBUUMsYUFBUixHQUF3QkMsS0FBeEIsR0FBZ0MsS0FBS0MsSUFBTCxDQUFVRCxLQUR0QyxFQUVKVCxFQUFFLENBQUNPLElBQUgsQ0FBUUMsYUFBUixHQUF3QkcsTUFBeEIsR0FBaUMsS0FBS0QsSUFBTCxDQUFVQyxNQUZ2QyxDQUFSO0lBSUEsSUFBSUMsQ0FBQyxHQUFHLEtBQUtGLElBQUwsQ0FBVUQsS0FBVixHQUFrQkwsQ0FBMUI7SUFDQSxJQUFJUyxDQUFDLEdBQUcsS0FBS0gsSUFBTCxDQUFVQyxNQUFWLEdBQW1CUCxDQUEzQjtJQUNBLEtBQUtNLElBQUwsQ0FBVUQsS0FBVixHQUFrQixLQUFLQyxJQUFMLENBQVVELEtBQVYsSUFBbUJULEVBQUUsQ0FBQ08sSUFBSCxDQUFRQyxhQUFSLEdBQXdCQyxLQUF4QixHQUFnQ0csQ0FBbkQsQ0FBbEI7SUFDQSxLQUFLRixJQUFMLENBQVVDLE1BQVYsR0FBbUIsS0FBS0QsSUFBTCxDQUFVQyxNQUFWLElBQW9CWCxFQUFFLENBQUNPLElBQUgsQ0FBUUMsYUFBUixHQUF3QkcsTUFBeEIsR0FBaUNFLENBQXJELENBQW5CO0VBQ0g7QUFYSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IE1hdGgubWluKFxuICAgICAgICAgICAgY2Mudmlldy5nZXRDYW52YXNTaXplKCkud2lkdGggLyB0aGlzLm5vZGUud2lkdGgsXG4gICAgICAgICAgICBjYy52aWV3LmdldENhbnZhc1NpemUoKS5oZWlnaHQgLyB0aGlzLm5vZGUuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHZhciB0ID0gdGhpcy5ub2RlLndpZHRoICogZTtcbiAgICAgICAgdmFyIG8gPSB0aGlzLm5vZGUuaGVpZ2h0ICogZTtcbiAgICAgICAgdGhpcy5ub2RlLndpZHRoID0gdGhpcy5ub2RlLndpZHRoICogKGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLndpZHRoIC8gdCk7XG4gICAgICAgIHRoaXMubm9kZS5oZWlnaHQgPSB0aGlzLm5vZGUuaGVpZ2h0ICogKGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLmhlaWdodCAvIG8pO1xuICAgIH1cbn0pO1xuIl19