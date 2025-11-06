
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Num2.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'c18a6Zw+ixNe57UebjcDx57', 'Num2');
// scripts/Num2.js

"use strict";

var a = cc._decorator;
var n = a.ccclass;
var i = a.property;

var c = function (e) {
  function t() {
    var t = null !== e && e.apply(this, arguments) || this;
    t.label = null;
    t.type = 0;
    t.owner = null;
    return t;
  }

  __extends(t, e);

  t.prototype.initAsHp = function (e) {
    this.type = 0;
    this.owner = e;
    this.changeHpTo();
    this.updateAsHp();
  };

  t.prototype.updateAsHp = function () {
    this.node.setPosition(this.owner.node.position.x, this.owner.node.position.y + this.owner.hpY);
  };

  t.prototype.changeHpTo = function () {
    this.label.string = "" + this.owner.hp;
  };

  t.prototype.init = function () {};

  t.prototype.start = function () {};

  t.prototype.update = function () {
    if (0 === this.type) {
      this.updateAsHp();
    }
  };

  __decorate([i(cc.Label)], t.prototype, "label", void 0);

  return __decorate([n], t);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL051bTIuanMiXSwibmFtZXMiOlsiYSIsImNjIiwiX2RlY29yYXRvciIsIm4iLCJjY2NsYXNzIiwiaSIsInByb3BlcnR5IiwiYyIsImUiLCJ0IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJsYWJlbCIsInR5cGUiLCJvd25lciIsIl9fZXh0ZW5kcyIsInByb3RvdHlwZSIsImluaXRBc0hwIiwiY2hhbmdlSHBUbyIsInVwZGF0ZUFzSHAiLCJub2RlIiwic2V0UG9zaXRpb24iLCJwb3NpdGlvbiIsIngiLCJ5IiwiaHBZIiwic3RyaW5nIiwiaHAiLCJpbml0Iiwic3RhcnQiLCJ1cGRhdGUiLCJfX2RlY29yYXRlIiwiTGFiZWwiLCJDb21wb25lbnQiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLENBQUMsR0FBR0MsRUFBRSxDQUFDQyxVQUFYO0FBQ0EsSUFBSUMsQ0FBQyxHQUFHSCxDQUFDLENBQUNJLE9BQVY7QUFDQSxJQUFJQyxDQUFDLEdBQUdMLENBQUMsQ0FBQ00sUUFBVjs7QUFDQSxJQUFJQyxDQUFDLEdBQUksVUFBVUMsQ0FBVixFQUFhO0VBQ2xCLFNBQVNDLENBQVQsR0FBYTtJQUNULElBQUlBLENBQUMsR0FBSSxTQUFTRCxDQUFULElBQWNBLENBQUMsQ0FBQ0UsS0FBRixDQUFRLElBQVIsRUFBY0MsU0FBZCxDQUFmLElBQTRDLElBQXBEO0lBQ0FGLENBQUMsQ0FBQ0csS0FBRixHQUFVLElBQVY7SUFDQUgsQ0FBQyxDQUFDSSxJQUFGLEdBQVMsQ0FBVDtJQUNBSixDQUFDLENBQUNLLEtBQUYsR0FBVSxJQUFWO0lBQ0EsT0FBT0wsQ0FBUDtFQUNIOztFQUNETSxTQUFTLENBQUNOLENBQUQsRUFBSUQsQ0FBSixDQUFUOztFQUNBQyxDQUFDLENBQUNPLFNBQUYsQ0FBWUMsUUFBWixHQUF1QixVQUFVVCxDQUFWLEVBQWE7SUFDaEMsS0FBS0ssSUFBTCxHQUFZLENBQVo7SUFDQSxLQUFLQyxLQUFMLEdBQWFOLENBQWI7SUFDQSxLQUFLVSxVQUFMO0lBQ0EsS0FBS0MsVUFBTDtFQUNILENBTEQ7O0VBTUFWLENBQUMsQ0FBQ08sU0FBRixDQUFZRyxVQUFaLEdBQXlCLFlBQVk7SUFDakMsS0FBS0MsSUFBTCxDQUFVQyxXQUFWLENBQXNCLEtBQUtQLEtBQUwsQ0FBV00sSUFBWCxDQUFnQkUsUUFBaEIsQ0FBeUJDLENBQS9DLEVBQWtELEtBQUtULEtBQUwsQ0FBV00sSUFBWCxDQUFnQkUsUUFBaEIsQ0FBeUJFLENBQXpCLEdBQTZCLEtBQUtWLEtBQUwsQ0FBV1csR0FBMUY7RUFDSCxDQUZEOztFQUdBaEIsQ0FBQyxDQUFDTyxTQUFGLENBQVlFLFVBQVosR0FBeUIsWUFBWTtJQUNqQyxLQUFLTixLQUFMLENBQVdjLE1BQVgsR0FBb0IsS0FBSyxLQUFLWixLQUFMLENBQVdhLEVBQXBDO0VBQ0gsQ0FGRDs7RUFHQWxCLENBQUMsQ0FBQ08sU0FBRixDQUFZWSxJQUFaLEdBQW1CLFlBQVksQ0FBRSxDQUFqQzs7RUFDQW5CLENBQUMsQ0FBQ08sU0FBRixDQUFZYSxLQUFaLEdBQW9CLFlBQVksQ0FBRSxDQUFsQzs7RUFDQXBCLENBQUMsQ0FBQ08sU0FBRixDQUFZYyxNQUFaLEdBQXFCLFlBQVk7SUFDN0IsSUFBSSxNQUFNLEtBQUtqQixJQUFmLEVBQXFCO01BQ2pCLEtBQUtNLFVBQUw7SUFDSDtFQUNKLENBSkQ7O0VBS0FZLFVBQVUsQ0FBQyxDQUFDMUIsQ0FBQyxDQUFDSixFQUFFLENBQUMrQixLQUFKLENBQUYsQ0FBRCxFQUFnQnZCLENBQUMsQ0FBQ08sU0FBbEIsRUFBNkIsT0FBN0IsRUFBc0MsS0FBSyxDQUEzQyxDQUFWOztFQUNBLE9BQU9lLFVBQVUsQ0FBQyxDQUFDNUIsQ0FBRCxDQUFELEVBQU1NLENBQU4sQ0FBakI7QUFDSCxDQTlCTyxDQThCTFIsRUFBRSxDQUFDZ0MsU0E5QkUsQ0FBUjs7QUErQkFDLE9BQU8sV0FBUCxHQUFrQjNCLENBQWxCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYSA9IGNjLl9kZWNvcmF0b3I7XG52YXIgbiA9IGEuY2NjbGFzcztcbnZhciBpID0gYS5wcm9wZXJ0eTtcbnZhciBjID0gKGZ1bmN0aW9uIChlKSB7XG4gICAgZnVuY3Rpb24gdCgpIHtcbiAgICAgICAgdmFyIHQgPSAobnVsbCAhPT0gZSAmJiBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHx8IHRoaXM7XG4gICAgICAgIHQubGFiZWwgPSBudWxsO1xuICAgICAgICB0LnR5cGUgPSAwO1xuICAgICAgICB0Lm93bmVyID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuICAgIF9fZXh0ZW5kcyh0LCBlKTtcbiAgICB0LnByb3RvdHlwZS5pbml0QXNIcCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IDA7XG4gICAgICAgIHRoaXMub3duZXIgPSBlO1xuICAgICAgICB0aGlzLmNoYW5nZUhwVG8oKTtcbiAgICAgICAgdGhpcy51cGRhdGVBc0hwKCk7XG4gICAgfTtcbiAgICB0LnByb3RvdHlwZS51cGRhdGVBc0hwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUuc2V0UG9zaXRpb24odGhpcy5vd25lci5ub2RlLnBvc2l0aW9uLngsIHRoaXMub3duZXIubm9kZS5wb3NpdGlvbi55ICsgdGhpcy5vd25lci5ocFkpO1xuICAgIH07XG4gICAgdC5wcm90b3R5cGUuY2hhbmdlSHBUbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBcIlwiICsgdGhpcy5vd25lci5ocDtcbiAgICB9O1xuICAgIHQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB0LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIHQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKDAgPT09IHRoaXMudHlwZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBc0hwKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIF9fZGVjb3JhdGUoW2koY2MuTGFiZWwpXSwgdC5wcm90b3R5cGUsIFwibGFiZWxcIiwgdm9pZCAwKTtcbiAgICByZXR1cm4gX19kZWNvcmF0ZShbbl0sIHQpO1xufSkoY2MuQ29tcG9uZW50KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGM7XG4iXX0=