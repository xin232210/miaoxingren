
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/Block.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '00faatx11FNLqqpay0AO1Mg', 'Block');
// game/scripts/Block.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    iLabel: cc.Label
  },
  onLoad: function onLoad() {
    var t = cc.find("bg", this.node);

    if (t) {
      this.bgSp = t.getComponent(cc.Sprite);
    } else {
      this.bgSp = null;
    }
  },
  setRoot: function setRoot(t) {
    this.blockRoot = t;
  },
  setPreview: function setPreview(t) {
    this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
    this.bgSp.node.active = -1 != t || !this.item;
  },
  put: function put(t) {
    this.setPreview(-1);
    this.bgSp.node.active = !1;

    if (this.item) {
      cc.warn("1");
    }

    this.item = t;
  },
  pick: function pick() {
    this.bgSp.node.active = !0;
    this.bgSp.node.opacity = 125;
    this.item = null;
  },
  update: function update() {
    if (this.iLabel) {
      this.iLabel.string = this.i;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvQmxvY2suanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJpTGFiZWwiLCJMYWJlbCIsIm9uTG9hZCIsInQiLCJmaW5kIiwibm9kZSIsImJnU3AiLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJzZXRSb290IiwiYmxvY2tSb290Iiwic2V0UHJldmlldyIsInNwcml0ZUZyYW1lIiwiYmxvY2tTcGZzIiwiYWN0aXZlIiwiaXRlbSIsInB1dCIsIndhcm4iLCJwaWNrIiwib3BhY2l0eSIsInVwZGF0ZSIsInN0cmluZyIsImkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxNQUFNLEVBQUVKLEVBQUUsQ0FBQ0s7RUFESCxDQUZQO0VBS0xDLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixJQUFJQyxDQUFDLEdBQUdQLEVBQUUsQ0FBQ1EsSUFBSCxDQUFRLElBQVIsRUFBYyxLQUFLQyxJQUFuQixDQUFSOztJQUNBLElBQUlGLENBQUosRUFBTztNQUNILEtBQUtHLElBQUwsR0FBWUgsQ0FBQyxDQUFDSSxZQUFGLENBQWVYLEVBQUUsQ0FBQ1ksTUFBbEIsQ0FBWjtJQUNILENBRkQsTUFFTztNQUNILEtBQUtGLElBQUwsR0FBWSxJQUFaO0lBQ0g7RUFDSixDQVpJO0VBYUxHLE9BQU8sRUFBRSxpQkFBVU4sQ0FBVixFQUFhO0lBQ2xCLEtBQUtPLFNBQUwsR0FBaUJQLENBQWpCO0VBQ0gsQ0FmSTtFQWdCTFEsVUFBVSxFQUFFLG9CQUFVUixDQUFWLEVBQWE7SUFDckIsS0FBS0csSUFBTCxDQUFVTSxXQUFWLEdBQXdCLEtBQUtGLFNBQUwsQ0FBZUcsU0FBZixDQUF5QlYsQ0FBQyxHQUFHLENBQTdCLENBQXhCO0lBQ0EsS0FBS0csSUFBTCxDQUFVRCxJQUFWLENBQWVTLE1BQWYsR0FBd0IsQ0FBQyxDQUFELElBQU1YLENBQU4sSUFBVyxDQUFDLEtBQUtZLElBQXpDO0VBQ0gsQ0FuQkk7RUFvQkxDLEdBQUcsRUFBRSxhQUFVYixDQUFWLEVBQWE7SUFDZCxLQUFLUSxVQUFMLENBQWdCLENBQUMsQ0FBakI7SUFDQSxLQUFLTCxJQUFMLENBQVVELElBQVYsQ0FBZVMsTUFBZixHQUF3QixDQUFDLENBQXpCOztJQUNBLElBQUksS0FBS0MsSUFBVCxFQUFlO01BQ1huQixFQUFFLENBQUNxQixJQUFILENBQVEsR0FBUjtJQUNIOztJQUNELEtBQUtGLElBQUwsR0FBWVosQ0FBWjtFQUNILENBM0JJO0VBNEJMZSxJQUFJLEVBQUUsZ0JBQVk7SUFDZCxLQUFLWixJQUFMLENBQVVELElBQVYsQ0FBZVMsTUFBZixHQUF3QixDQUFDLENBQXpCO0lBQ0EsS0FBS1IsSUFBTCxDQUFVRCxJQUFWLENBQWVjLE9BQWYsR0FBeUIsR0FBekI7SUFDQSxLQUFLSixJQUFMLEdBQVksSUFBWjtFQUNILENBaENJO0VBaUNMSyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsSUFBSSxLQUFLcEIsTUFBVCxFQUFpQjtNQUNiLEtBQUtBLE1BQUwsQ0FBWXFCLE1BQVosR0FBcUIsS0FBS0MsQ0FBMUI7SUFDSDtFQUNKO0FBckNJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpTGFiZWw6IGNjLkxhYmVsXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSBjYy5maW5kKFwiYmdcIiwgdGhpcy5ub2RlKTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMuYmdTcCA9IHQuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJnU3AgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRSb290OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmJsb2NrUm9vdCA9IHQ7XG4gICAgfSxcbiAgICBzZXRQcmV2aWV3OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLmJnU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmJsb2NrUm9vdC5ibG9ja1NwZnNbdCArIDFdO1xuICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSAtMSAhPSB0IHx8ICF0aGlzLml0ZW07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2V0UHJldmlldygtMSk7XG4gICAgICAgIHRoaXMuYmdTcC5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBpZiAodGhpcy5pdGVtKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiMVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW0gPSB0O1xuICAgIH0sXG4gICAgcGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgdGhpcy5iZ1NwLm5vZGUub3BhY2l0eSA9IDEyNTtcbiAgICAgICAgdGhpcy5pdGVtID0gbnVsbDtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pTGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMuaUxhYmVsLnN0cmluZyA9IHRoaXMuaTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19