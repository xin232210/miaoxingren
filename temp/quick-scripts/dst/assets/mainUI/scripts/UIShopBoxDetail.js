
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIShopBoxDetail.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cecc0YT8vNNeq5CIv0xuI2v', 'UIShopBoxDetail');
// mainUI/scripts/UIShopBoxDetail.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    iconSprite: cc.Sprite,
    tipLabel: cc.Label,
    baseCardNode: cc.Node,
    parentPanel: cc.Node
  },
  initBy: function initBy(e) {
    var t = cc.JsonControl.getItemJson(e);
    var i = cc.pvz.GameConfig["Quality" + t.Quality + "Tools"];
    var o = cc.pvz.PlayerData.getStageLevel();
    cc.pvz.utils.setSpriteFrame(this.iconSprite, "uiImage", "shop/shop" + (e + 15));
    var a = o < cc.pvz.GameConfig.ToolLockLevel[i[0] - 1];
    this.baseCardNode.getComponent("RewardItem").initShopBoxToolItem(i[0], a);
    var c;

    if (a) {
      c = 1;
    } else {
      c = 0;
    }

    for (var s = 1; s < i.length; s++) {
      var n = cc.instantiate(this.baseCardNode);
      n.parent = this.parentPanel;
      var r = o < cc.pvz.GameConfig.ToolLockLevel[i[s] - 1];
      n.getComponent("RewardItem").initShopBoxToolItem(i[s], r);

      if (r) {
        c++;
      }
    }

    var h = 1 / (i.length - c) * 100;
    this.tipLabel.string = h.toFixed(2) + "%";
  },
  onCloseUI: function onCloseUI() {
    cc.popupManager.removePopup(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVNob3BCb3hEZXRhaWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJpY29uU3ByaXRlIiwiU3ByaXRlIiwidGlwTGFiZWwiLCJMYWJlbCIsImJhc2VDYXJkTm9kZSIsIk5vZGUiLCJwYXJlbnRQYW5lbCIsImluaXRCeSIsImUiLCJ0IiwiSnNvbkNvbnRyb2wiLCJnZXRJdGVtSnNvbiIsImkiLCJwdnoiLCJHYW1lQ29uZmlnIiwiUXVhbGl0eSIsIm8iLCJQbGF5ZXJEYXRhIiwiZ2V0U3RhZ2VMZXZlbCIsInV0aWxzIiwic2V0U3ByaXRlRnJhbWUiLCJhIiwiVG9vbExvY2tMZXZlbCIsImdldENvbXBvbmVudCIsImluaXRTaG9wQm94VG9vbEl0ZW0iLCJjIiwicyIsImxlbmd0aCIsIm4iLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsInIiLCJoIiwic3RyaW5nIiwidG9GaXhlZCIsIm9uQ2xvc2VVSSIsInBvcHVwTWFuYWdlciIsInJlbW92ZVBvcHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsVUFBVSxFQUFFSixFQUFFLENBQUNLLE1BRFA7SUFFUkMsUUFBUSxFQUFFTixFQUFFLENBQUNPLEtBRkw7SUFHUkMsWUFBWSxFQUFFUixFQUFFLENBQUNTLElBSFQ7SUFJUkMsV0FBVyxFQUFFVixFQUFFLENBQUNTO0VBSlIsQ0FGUDtFQVFMRSxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixJQUFJQyxDQUFDLEdBQUdiLEVBQUUsQ0FBQ2MsV0FBSCxDQUFlQyxXQUFmLENBQTJCSCxDQUEzQixDQUFSO0lBQ0EsSUFBSUksQ0FBQyxHQUFHaEIsRUFBRSxDQUFDaUIsR0FBSCxDQUFPQyxVQUFQLENBQWtCLFlBQVlMLENBQUMsQ0FBQ00sT0FBZCxHQUF3QixPQUExQyxDQUFSO0lBQ0EsSUFBSUMsQ0FBQyxHQUFHcEIsRUFBRSxDQUFDaUIsR0FBSCxDQUFPSSxVQUFQLENBQWtCQyxhQUFsQixFQUFSO0lBQ0F0QixFQUFFLENBQUNpQixHQUFILENBQU9NLEtBQVAsQ0FBYUMsY0FBYixDQUE0QixLQUFLcEIsVUFBakMsRUFBNkMsU0FBN0MsRUFBd0QsZUFBZVEsQ0FBQyxHQUFHLEVBQW5CLENBQXhEO0lBQ0EsSUFBSWEsQ0FBQyxHQUFHTCxDQUFDLEdBQUdwQixFQUFFLENBQUNpQixHQUFILENBQU9DLFVBQVAsQ0FBa0JRLGFBQWxCLENBQWdDVixDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBdkMsQ0FBWjtJQUNBLEtBQUtSLFlBQUwsQ0FBa0JtQixZQUFsQixDQUErQixZQUEvQixFQUE2Q0MsbUJBQTdDLENBQWlFWixDQUFDLENBQUMsQ0FBRCxDQUFsRSxFQUF1RVMsQ0FBdkU7SUFDQSxJQUFJSSxDQUFKOztJQUNBLElBQUlKLENBQUosRUFBTztNQUNISSxDQUFDLEdBQUcsQ0FBSjtJQUNILENBRkQsTUFFTztNQUNIQSxDQUFDLEdBQUcsQ0FBSjtJQUNIOztJQUNELEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2QsQ0FBQyxDQUFDZSxNQUF0QixFQUE4QkQsQ0FBQyxFQUEvQixFQUFtQztNQUMvQixJQUFJRSxDQUFDLEdBQUdoQyxFQUFFLENBQUNpQyxXQUFILENBQWUsS0FBS3pCLFlBQXBCLENBQVI7TUFDQXdCLENBQUMsQ0FBQ0UsTUFBRixHQUFXLEtBQUt4QixXQUFoQjtNQUNBLElBQUl5QixDQUFDLEdBQUdmLENBQUMsR0FBR3BCLEVBQUUsQ0FBQ2lCLEdBQUgsQ0FBT0MsVUFBUCxDQUFrQlEsYUFBbEIsQ0FBZ0NWLENBQUMsQ0FBQ2MsQ0FBRCxDQUFELEdBQU8sQ0FBdkMsQ0FBWjtNQUNBRSxDQUFDLENBQUNMLFlBQUYsQ0FBZSxZQUFmLEVBQTZCQyxtQkFBN0IsQ0FBaURaLENBQUMsQ0FBQ2MsQ0FBRCxDQUFsRCxFQUF1REssQ0FBdkQ7O01BQ0EsSUFBSUEsQ0FBSixFQUFPO1FBQ0hOLENBQUM7TUFDSjtJQUNKOztJQUNELElBQUlPLENBQUMsR0FBSSxLQUFLcEIsQ0FBQyxDQUFDZSxNQUFGLEdBQVdGLENBQWhCLENBQUQsR0FBdUIsR0FBL0I7SUFDQSxLQUFLdkIsUUFBTCxDQUFjK0IsTUFBZCxHQUF1QkQsQ0FBQyxDQUFDRSxPQUFGLENBQVUsQ0FBVixJQUFlLEdBQXRDO0VBQ0gsQ0FoQ0k7RUFpQ0xDLFNBQVMsRUFBRSxxQkFBWTtJQUNuQnZDLEVBQUUsQ0FBQ3dDLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0g7QUFuQ0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGljb25TcHJpdGU6IGNjLlNwcml0ZSxcbiAgICAgICAgdGlwTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBiYXNlQ2FyZE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHBhcmVudFBhbmVsOiBjYy5Ob2RlXG4gICAgfSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gY2MuSnNvbkNvbnRyb2wuZ2V0SXRlbUpzb24oZSk7XG4gICAgICAgIHZhciBpID0gY2MucHZ6LkdhbWVDb25maWdbXCJRdWFsaXR5XCIgKyB0LlF1YWxpdHkgKyBcIlRvb2xzXCJdO1xuICAgICAgICB2YXIgbyA9IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKTtcbiAgICAgICAgY2MucHZ6LnV0aWxzLnNldFNwcml0ZUZyYW1lKHRoaXMuaWNvblNwcml0ZSwgXCJ1aUltYWdlXCIsIFwic2hvcC9zaG9wXCIgKyAoZSArIDE1KSk7XG4gICAgICAgIHZhciBhID0gbyA8IGNjLnB2ei5HYW1lQ29uZmlnLlRvb2xMb2NrTGV2ZWxbaVswXSAtIDFdO1xuICAgICAgICB0aGlzLmJhc2VDYXJkTm9kZS5nZXRDb21wb25lbnQoXCJSZXdhcmRJdGVtXCIpLmluaXRTaG9wQm94VG9vbEl0ZW0oaVswXSwgYSk7XG4gICAgICAgIHZhciBjO1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgYyA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjID0gMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBzID0gMTsgcyA8IGkubGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgIHZhciBuID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYXNlQ2FyZE5vZGUpO1xuICAgICAgICAgICAgbi5wYXJlbnQgPSB0aGlzLnBhcmVudFBhbmVsO1xuICAgICAgICAgICAgdmFyIHIgPSBvIDwgY2MucHZ6LkdhbWVDb25maWcuVG9vbExvY2tMZXZlbFtpW3NdIC0gMV07XG4gICAgICAgICAgICBuLmdldENvbXBvbmVudChcIlJld2FyZEl0ZW1cIikuaW5pdFNob3BCb3hUb29sSXRlbShpW3NdLCByKTtcbiAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgYysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBoID0gKDEgLyAoaS5sZW5ndGggLSBjKSkgKiAxMDA7XG4gICAgICAgIHRoaXMudGlwTGFiZWwuc3RyaW5nID0gaC50b0ZpeGVkKDIpICsgXCIlXCI7XG4gICAgfSxcbiAgICBvbkNsb3NlVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH1cbn0pO1xuIl19