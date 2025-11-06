
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/BuffItem.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '57fc8765X5GFb+AjDK/zM1O', 'BuffItem');
// game/scripts/BuffItem.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    qualitySp: cc.Sprite,
    iconSp: cc.Sprite
  },
  initBuffItem: function initBuffItem(t, e, i) {
    this.index = t;
    this.buffJson = e;
    this.callBack = i;
    cc.pvz.utils.setSpriteFrame(this.qualitySp, "uiImage", "item/pz_" + this.buffJson.quality);
    cc.pvz.utils.setSpriteFrame(this.iconSp, "uiImage", "skill/skill" + this.buffJson.icon);
  },
  onClickBuff: function onClickBuff() {
    var t = this.node.parent.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()));

    if (this.callBack) {
      this.callBack(this.index, t, this.buffJson.desc);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvQnVmZkl0ZW0uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJxdWFsaXR5U3AiLCJTcHJpdGUiLCJpY29uU3AiLCJpbml0QnVmZkl0ZW0iLCJ0IiwiZSIsImkiLCJpbmRleCIsImJ1ZmZKc29uIiwiY2FsbEJhY2siLCJwdnoiLCJ1dGlscyIsInNldFNwcml0ZUZyYW1lIiwicXVhbGl0eSIsImljb24iLCJvbkNsaWNrQnVmZiIsIm5vZGUiLCJwYXJlbnQiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsInYyIiwiZGVzYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxNQUROO0lBRVJDLE1BQU0sRUFBRU4sRUFBRSxDQUFDSztFQUZILENBRlA7RUFNTEUsWUFBWSxFQUFFLHNCQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CO0lBQzdCLEtBQUtDLEtBQUwsR0FBYUgsQ0FBYjtJQUNBLEtBQUtJLFFBQUwsR0FBZ0JILENBQWhCO0lBQ0EsS0FBS0ksUUFBTCxHQUFnQkgsQ0FBaEI7SUFDQVYsRUFBRSxDQUFDYyxHQUFILENBQU9DLEtBQVAsQ0FBYUMsY0FBYixDQUE0QixLQUFLWixTQUFqQyxFQUE0QyxTQUE1QyxFQUF1RCxhQUFhLEtBQUtRLFFBQUwsQ0FBY0ssT0FBbEY7SUFDQWpCLEVBQUUsQ0FBQ2MsR0FBSCxDQUFPQyxLQUFQLENBQWFDLGNBQWIsQ0FBNEIsS0FBS1YsTUFBakMsRUFBeUMsU0FBekMsRUFBb0QsZ0JBQWdCLEtBQUtNLFFBQUwsQ0FBY00sSUFBbEY7RUFDSCxDQVpJO0VBYUxDLFdBQVcsRUFBRSx1QkFBWTtJQUNyQixJQUFJWCxDQUFDLEdBQUcsS0FBS1ksSUFBTCxDQUFVQyxNQUFWLENBQWlCQSxNQUFqQixDQUF3QkMsb0JBQXhCLENBQTZDLEtBQUtGLElBQUwsQ0FBVUcscUJBQVYsQ0FBZ0N2QixFQUFFLENBQUN3QixFQUFILEVBQWhDLENBQTdDLENBQVI7O0lBQ0EsSUFBSSxLQUFLWCxRQUFULEVBQW1CO01BQ2YsS0FBS0EsUUFBTCxDQUFjLEtBQUtGLEtBQW5CLEVBQTBCSCxDQUExQixFQUE2QixLQUFLSSxRQUFMLENBQWNhLElBQTNDO0lBQ0g7RUFDSjtBQWxCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcXVhbGl0eVNwOiBjYy5TcHJpdGUsXG4gICAgICAgIGljb25TcDogY2MuU3ByaXRlXG4gICAgfSxcbiAgICBpbml0QnVmZkl0ZW06IGZ1bmN0aW9uICh0LCBlLCBpKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0O1xuICAgICAgICB0aGlzLmJ1ZmZKc29uID0gZTtcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGk7XG4gICAgICAgIGNjLnB2ei51dGlscy5zZXRTcHJpdGVGcmFtZSh0aGlzLnF1YWxpdHlTcCwgXCJ1aUltYWdlXCIsIFwiaXRlbS9wel9cIiArIHRoaXMuYnVmZkpzb24ucXVhbGl0eSk7XG4gICAgICAgIGNjLnB2ei51dGlscy5zZXRTcHJpdGVGcmFtZSh0aGlzLmljb25TcCwgXCJ1aUltYWdlXCIsIFwic2tpbGwvc2tpbGxcIiArIHRoaXMuYnVmZkpzb24uaWNvbik7XG4gICAgfSxcbiAgICBvbkNsaWNrQnVmZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXMubm9kZS5wYXJlbnQucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIoKSkpO1xuICAgICAgICBpZiAodGhpcy5jYWxsQmFjaykge1xuICAgICAgICAgICAgdGhpcy5jYWxsQmFjayh0aGlzLmluZGV4LCB0LCB0aGlzLmJ1ZmZKc29uLmRlc2MpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=