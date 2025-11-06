
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/AutoScale.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '863dallCn5L1ITZ5Vr7oggX', 'AutoScale');
// scripts/AutoScale.js

"use strict";

cc.Class({
  "extends": cc.Component,
  onLoad: function onLoad() {
    this.initBy(this.usingInitSize ? this.w : this.node.width, this.usingInitSize ? this.h : this.node.height);
  },
  setNodeSize: function setNodeSize(e, t) {
    this.usingInitSize = !0;
    this.w = e;
    this.h = t;
  },
  initBy: function initBy(e, t) {
    var o = Math.min(cc.view.getCanvasSize().width / e, cc.view.getCanvasSize().height / t);
    var a = e * o;
    var n = t * o;
    this.node.scale = Math.max(cc.view.getCanvasSize().width / a, cc.view.getCanvasSize().height / n);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0F1dG9TY2FsZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50Iiwib25Mb2FkIiwiaW5pdEJ5IiwidXNpbmdJbml0U2l6ZSIsInciLCJub2RlIiwid2lkdGgiLCJoIiwiaGVpZ2h0Iiwic2V0Tm9kZVNpemUiLCJlIiwidCIsIm8iLCJNYXRoIiwibWluIiwidmlldyIsImdldENhbnZhc1NpemUiLCJhIiwibiIsInNjYWxlIiwibWF4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsS0FBS0MsTUFBTCxDQUFZLEtBQUtDLGFBQUwsR0FBcUIsS0FBS0MsQ0FBMUIsR0FBOEIsS0FBS0MsSUFBTCxDQUFVQyxLQUFwRCxFQUEyRCxLQUFLSCxhQUFMLEdBQXFCLEtBQUtJLENBQTFCLEdBQThCLEtBQUtGLElBQUwsQ0FBVUcsTUFBbkc7RUFDSCxDQUpJO0VBS0xDLFdBQVcsRUFBRSxxQkFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQ3pCLEtBQUtSLGFBQUwsR0FBcUIsQ0FBQyxDQUF0QjtJQUNBLEtBQUtDLENBQUwsR0FBU00sQ0FBVDtJQUNBLEtBQUtILENBQUwsR0FBU0ksQ0FBVDtFQUNILENBVEk7RUFVTFQsTUFBTSxFQUFFLGdCQUFVUSxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7SUFDcEIsSUFBSUMsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBU2hCLEVBQUUsQ0FBQ2lCLElBQUgsQ0FBUUMsYUFBUixHQUF3QlYsS0FBeEIsR0FBZ0NJLENBQXpDLEVBQTRDWixFQUFFLENBQUNpQixJQUFILENBQVFDLGFBQVIsR0FBd0JSLE1BQXhCLEdBQWlDRyxDQUE3RSxDQUFSO0lBQ0EsSUFBSU0sQ0FBQyxHQUFHUCxDQUFDLEdBQUdFLENBQVo7SUFDQSxJQUFJTSxDQUFDLEdBQUdQLENBQUMsR0FBR0MsQ0FBWjtJQUNBLEtBQUtQLElBQUwsQ0FBVWMsS0FBVixHQUFrQk4sSUFBSSxDQUFDTyxHQUFMLENBQVN0QixFQUFFLENBQUNpQixJQUFILENBQVFDLGFBQVIsR0FBd0JWLEtBQXhCLEdBQWdDVyxDQUF6QyxFQUE0Q25CLEVBQUUsQ0FBQ2lCLElBQUgsQ0FBUUMsYUFBUixHQUF3QlIsTUFBeEIsR0FBaUNVLENBQTdFLENBQWxCO0VBQ0g7QUFmSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRCeSh0aGlzLnVzaW5nSW5pdFNpemUgPyB0aGlzLncgOiB0aGlzLm5vZGUud2lkdGgsIHRoaXMudXNpbmdJbml0U2l6ZSA/IHRoaXMuaCA6IHRoaXMubm9kZS5oZWlnaHQpO1xuICAgIH0sXG4gICAgc2V0Tm9kZVNpemU6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIHRoaXMudXNpbmdJbml0U2l6ZSA9ICEwO1xuICAgICAgICB0aGlzLncgPSBlO1xuICAgICAgICB0aGlzLmggPSB0O1xuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IE1hdGgubWluKGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLndpZHRoIC8gZSwgY2Mudmlldy5nZXRDYW52YXNTaXplKCkuaGVpZ2h0IC8gdCk7XG4gICAgICAgIHZhciBhID0gZSAqIG87XG4gICAgICAgIHZhciBuID0gdCAqIG87XG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IE1hdGgubWF4KGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLndpZHRoIC8gYSwgY2Mudmlldy5nZXRDYW52YXNTaXplKCkuaGVpZ2h0IC8gbik7XG4gICAgfVxufSk7XG4iXX0=