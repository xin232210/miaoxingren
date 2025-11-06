
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/Pos.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'c4626bbnFNOPY4pJvpt4nyB', 'Pos');
// game/scripts/Pos.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    i: 0,
    dashNode: cc.Node
  },
  onLoad: function onLoad() {
    this.bgSp = cc.find("bg", this.node).getComponent(cc.Sprite);
    this.dashNode = cc.find("pos", this.node);
  },
  setRoot: function setRoot(t) {
    this.blockRoot = t;
  },
  setPreview: function setPreview(t) {
    this.bgSp.node.active = -1 != t || this.item;

    if (this.bgSp.node.active) {
      this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
    }
  },
  put: function put(t) {
    this.setPreview(-1);
    this.bgSp.node.active = !1;

    if (this.item) {
      cc.warn("2");
    }

    this.item = t;
  },
  pick: function pick() {
    this.bgSp.node.active = !0;
    this.item = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvUG9zLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaSIsImRhc2hOb2RlIiwiTm9kZSIsIm9uTG9hZCIsImJnU3AiLCJmaW5kIiwibm9kZSIsImdldENvbXBvbmVudCIsIlNwcml0ZSIsInNldFJvb3QiLCJ0IiwiYmxvY2tSb290Iiwic2V0UHJldmlldyIsImFjdGl2ZSIsIml0ZW0iLCJzcHJpdGVGcmFtZSIsImJsb2NrU3BmcyIsInB1dCIsIndhcm4iLCJwaWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsQ0FBQyxFQUFFLENBREs7SUFFUkMsUUFBUSxFQUFFTCxFQUFFLENBQUNNO0VBRkwsQ0FGUDtFQU1MQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsS0FBS0MsSUFBTCxHQUFZUixFQUFFLENBQUNTLElBQUgsQ0FBUSxJQUFSLEVBQWMsS0FBS0MsSUFBbkIsRUFBeUJDLFlBQXpCLENBQXNDWCxFQUFFLENBQUNZLE1BQXpDLENBQVo7SUFDQSxLQUFLUCxRQUFMLEdBQWdCTCxFQUFFLENBQUNTLElBQUgsQ0FBUSxLQUFSLEVBQWUsS0FBS0MsSUFBcEIsQ0FBaEI7RUFDSCxDQVRJO0VBVUxHLE9BQU8sRUFBRSxpQkFBVUMsQ0FBVixFQUFhO0lBQ2xCLEtBQUtDLFNBQUwsR0FBaUJELENBQWpCO0VBQ0gsQ0FaSTtFQWFMRSxVQUFVLEVBQUUsb0JBQVVGLENBQVYsRUFBYTtJQUNyQixLQUFLTixJQUFMLENBQVVFLElBQVYsQ0FBZU8sTUFBZixHQUF3QixDQUFDLENBQUQsSUFBTUgsQ0FBTixJQUFXLEtBQUtJLElBQXhDOztJQUNBLElBQUksS0FBS1YsSUFBTCxDQUFVRSxJQUFWLENBQWVPLE1BQW5CLEVBQTJCO01BQ3ZCLEtBQUtULElBQUwsQ0FBVVcsV0FBVixHQUF3QixLQUFLSixTQUFMLENBQWVLLFNBQWYsQ0FBeUJOLENBQUMsR0FBRyxDQUE3QixDQUF4QjtJQUNIO0VBQ0osQ0FsQkk7RUFtQkxPLEdBQUcsRUFBRSxhQUFVUCxDQUFWLEVBQWE7SUFDZCxLQUFLRSxVQUFMLENBQWdCLENBQUMsQ0FBakI7SUFDQSxLQUFLUixJQUFMLENBQVVFLElBQVYsQ0FBZU8sTUFBZixHQUF3QixDQUFDLENBQXpCOztJQUNBLElBQUksS0FBS0MsSUFBVCxFQUFlO01BQ1hsQixFQUFFLENBQUNzQixJQUFILENBQVEsR0FBUjtJQUNIOztJQUNELEtBQUtKLElBQUwsR0FBWUosQ0FBWjtFQUNILENBMUJJO0VBMkJMUyxJQUFJLEVBQUUsZ0JBQVk7SUFDZCxLQUFLZixJQUFMLENBQVVFLElBQVYsQ0FBZU8sTUFBZixHQUF3QixDQUFDLENBQXpCO0lBQ0EsS0FBS0MsSUFBTCxHQUFZLElBQVo7RUFDSDtBQTlCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaTogMCxcbiAgICAgICAgZGFzaE5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJnU3AgPSBjYy5maW5kKFwiYmdcIiwgdGhpcy5ub2RlKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgdGhpcy5kYXNoTm9kZSA9IGNjLmZpbmQoXCJwb3NcIiwgdGhpcy5ub2RlKTtcbiAgICB9LFxuICAgIHNldFJvb3Q6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuYmxvY2tSb290ID0gdDtcbiAgICB9LFxuICAgIHNldFByZXZpZXc6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuYmdTcC5ub2RlLmFjdGl2ZSA9IC0xICE9IHQgfHwgdGhpcy5pdGVtO1xuICAgICAgICBpZiAodGhpcy5iZ1NwLm5vZGUuYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmJnU3Auc3ByaXRlRnJhbWUgPSB0aGlzLmJsb2NrUm9vdC5ibG9ja1NwZnNbdCArIDFdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2V0UHJldmlldygtMSk7XG4gICAgICAgIHRoaXMuYmdTcC5ub2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBpZiAodGhpcy5pdGVtKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiMlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW0gPSB0O1xuICAgIH0sXG4gICAgcGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJnU3Aubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgdGhpcy5pdGVtID0gbnVsbDtcbiAgICB9XG59KTtcbiJdfQ==