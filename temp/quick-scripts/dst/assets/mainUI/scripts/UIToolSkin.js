
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIToolSkin.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd29ff5k0C9OW5XsgTE8XMoO', 'UIToolSkin');
// mainUI/scripts/UIToolSkin.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skinTipLabl: cc.Label,
    nameLabel: cc.Label,
    spine: sp.Skeleton,
    leftBtn: cc.Node,
    rightBtn: cc.Node
  },
  initBy: function initBy(e) {
    var t = this;
    this.toolId = e;
    this.toolJson = cc.JsonControl.getToolJson(this.toolId);
    this.nameLabel.string = this.toolJson.name;
    this.maxLv = 5;
    var i = cc.pvz.PlayerData.getToolData(this.toolId);
    this.modelIndex = cc.pvz.utils.getLevelInterval(i.lv);
    cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (e) {
      t.spine.skeletonData = e;
      t.showCurPage();
    });
  },
  showCurPage: function showCurPage() {
    this.leftBtn.active = this.modelIndex > 1;
    this.rightBtn.active = this.modelIndex < this.maxLv;
    this.skinTipLabl.string = cc.pvz.GameConfig.ToolSkinTip.replace("$", this.modelIndex);
    this.spine.setAnimation(0, "Idle", !0);
  },
  onClickPage: function onClickPage(e, t) {
    if (parseInt(t) < 0) {
      this.modelIndex--;
    } else {
      this.modelIndex++;
    }

    this.showCurPage();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVRvb2xTa2luLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic2tpblRpcExhYmwiLCJMYWJlbCIsIm5hbWVMYWJlbCIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsImxlZnRCdG4iLCJOb2RlIiwicmlnaHRCdG4iLCJpbml0QnkiLCJlIiwidCIsInRvb2xJZCIsInRvb2xKc29uIiwiSnNvbkNvbnRyb2wiLCJnZXRUb29sSnNvbiIsInN0cmluZyIsIm5hbWUiLCJtYXhMdiIsImkiLCJwdnoiLCJQbGF5ZXJEYXRhIiwiZ2V0VG9vbERhdGEiLCJtb2RlbEluZGV4IiwidXRpbHMiLCJnZXRMZXZlbEludGVydmFsIiwibHYiLCJ1c2VCdW5kbGVBc3NldCIsIlNrZWxldG9uRGF0YSIsInNrZWxldG9uRGF0YSIsInNob3dDdXJQYWdlIiwiYWN0aXZlIiwiR2FtZUNvbmZpZyIsIlRvb2xTa2luVGlwIiwicmVwbGFjZSIsInNldEFuaW1hdGlvbiIsIm9uQ2xpY2tQYWdlIiwicGFyc2VJbnQiLCJvbkNsb3NlVUkiLCJwb3B1cE1hbmFnZXIiLCJyZW1vdmVQb3B1cCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFdBQVcsRUFBRUosRUFBRSxDQUFDSyxLQURSO0lBRVJDLFNBQVMsRUFBRU4sRUFBRSxDQUFDSyxLQUZOO0lBR1JFLEtBQUssRUFBRUMsRUFBRSxDQUFDQyxRQUhGO0lBSVJDLE9BQU8sRUFBRVYsRUFBRSxDQUFDVyxJQUpKO0lBS1JDLFFBQVEsRUFBRVosRUFBRSxDQUFDVztFQUxMLENBRlA7RUFTTEUsTUFBTSxFQUFFLGdCQUFVQyxDQUFWLEVBQWE7SUFDakIsSUFBSUMsQ0FBQyxHQUFHLElBQVI7SUFDQSxLQUFLQyxNQUFMLEdBQWNGLENBQWQ7SUFDQSxLQUFLRyxRQUFMLEdBQWdCakIsRUFBRSxDQUFDa0IsV0FBSCxDQUFlQyxXQUFmLENBQTJCLEtBQUtILE1BQWhDLENBQWhCO0lBQ0EsS0FBS1YsU0FBTCxDQUFlYyxNQUFmLEdBQXdCLEtBQUtILFFBQUwsQ0FBY0ksSUFBdEM7SUFDQSxLQUFLQyxLQUFMLEdBQWEsQ0FBYjtJQUNBLElBQUlDLENBQUMsR0FBR3ZCLEVBQUUsQ0FBQ3dCLEdBQUgsQ0FBT0MsVUFBUCxDQUFrQkMsV0FBbEIsQ0FBOEIsS0FBS1YsTUFBbkMsQ0FBUjtJQUNBLEtBQUtXLFVBQUwsR0FBa0IzQixFQUFFLENBQUN3QixHQUFILENBQU9JLEtBQVAsQ0FBYUMsZ0JBQWIsQ0FBOEJOLENBQUMsQ0FBQ08sRUFBaEMsQ0FBbEI7SUFDQTlCLEVBQUUsQ0FBQ3dCLEdBQUgsQ0FBT0ksS0FBUCxDQUFhRyxjQUFiLENBQTRCLFFBQTVCLEVBQXNDLHNCQUF0QyxFQUE4RHZCLEVBQUUsQ0FBQ3dCLFlBQWpFLEVBQStFLFVBQVVsQixDQUFWLEVBQWE7TUFDeEZDLENBQUMsQ0FBQ1IsS0FBRixDQUFRMEIsWUFBUixHQUF1Qm5CLENBQXZCO01BQ0FDLENBQUMsQ0FBQ21CLFdBQUY7SUFDSCxDQUhEO0VBSUgsQ0FyQkk7RUFzQkxBLFdBQVcsRUFBRSx1QkFBWTtJQUNyQixLQUFLeEIsT0FBTCxDQUFheUIsTUFBYixHQUFzQixLQUFLUixVQUFMLEdBQWtCLENBQXhDO0lBQ0EsS0FBS2YsUUFBTCxDQUFjdUIsTUFBZCxHQUF1QixLQUFLUixVQUFMLEdBQWtCLEtBQUtMLEtBQTlDO0lBQ0EsS0FBS2xCLFdBQUwsQ0FBaUJnQixNQUFqQixHQUEwQnBCLEVBQUUsQ0FBQ3dCLEdBQUgsQ0FBT1ksVUFBUCxDQUFrQkMsV0FBbEIsQ0FBOEJDLE9BQTlCLENBQXNDLEdBQXRDLEVBQTJDLEtBQUtYLFVBQWhELENBQTFCO0lBQ0EsS0FBS3BCLEtBQUwsQ0FBV2dDLFlBQVgsQ0FBd0IsQ0FBeEIsRUFBMkIsTUFBM0IsRUFBbUMsQ0FBQyxDQUFwQztFQUNILENBM0JJO0VBNEJMQyxXQUFXLEVBQUUscUJBQVUxQixDQUFWLEVBQWFDLENBQWIsRUFBZ0I7SUFDekIsSUFBSTBCLFFBQVEsQ0FBQzFCLENBQUQsQ0FBUixHQUFjLENBQWxCLEVBQXFCO01BQ2pCLEtBQUtZLFVBQUw7SUFDSCxDQUZELE1BRU87TUFDSCxLQUFLQSxVQUFMO0lBQ0g7O0lBQ0QsS0FBS08sV0FBTDtFQUNILENBbkNJO0VBb0NMUSxTQUFTLEVBQUUscUJBQVk7SUFDbkIxQyxFQUFFLENBQUMyQyxZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtFQUNIO0FBdENJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBza2luVGlwTGFibDogY2MuTGFiZWwsXG4gICAgICAgIG5hbWVMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIHNwaW5lOiBzcC5Ta2VsZXRvbixcbiAgICAgICAgbGVmdEJ0bjogY2MuTm9kZSxcbiAgICAgICAgcmlnaHRCdG46IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLnRvb2xJZCA9IGU7XG4gICAgICAgIHRoaXMudG9vbEpzb24gPSBjYy5Kc29uQ29udHJvbC5nZXRUb29sSnNvbih0aGlzLnRvb2xJZCk7XG4gICAgICAgIHRoaXMubmFtZUxhYmVsLnN0cmluZyA9IHRoaXMudG9vbEpzb24ubmFtZTtcbiAgICAgICAgdGhpcy5tYXhMdiA9IDU7XG4gICAgICAgIHZhciBpID0gY2MucHZ6LlBsYXllckRhdGEuZ2V0VG9vbERhdGEodGhpcy50b29sSWQpO1xuICAgICAgICB0aGlzLm1vZGVsSW5kZXggPSBjYy5wdnoudXRpbHMuZ2V0TGV2ZWxJbnRlcnZhbChpLmx2KTtcbiAgICAgICAgY2MucHZ6LnV0aWxzLnVzZUJ1bmRsZUFzc2V0KFwiYWN0b3JzXCIsIFwiY2hhcmFjdGVyL0NoYXJhY3RlcnNcIiwgc3AuU2tlbGV0b25EYXRhLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdC5zcGluZS5za2VsZXRvbkRhdGEgPSBlO1xuICAgICAgICAgICAgdC5zaG93Q3VyUGFnZSgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dDdXJQYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGVmdEJ0bi5hY3RpdmUgPSB0aGlzLm1vZGVsSW5kZXggPiAxO1xuICAgICAgICB0aGlzLnJpZ2h0QnRuLmFjdGl2ZSA9IHRoaXMubW9kZWxJbmRleCA8IHRoaXMubWF4THY7XG4gICAgICAgIHRoaXMuc2tpblRpcExhYmwuc3RyaW5nID0gY2MucHZ6LkdhbWVDb25maWcuVG9vbFNraW5UaXAucmVwbGFjZShcIiRcIiwgdGhpcy5tb2RlbEluZGV4KTtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24oMCwgXCJJZGxlXCIsICEwKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tQYWdlOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAocGFyc2VJbnQodCkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsSW5kZXgtLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWxJbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd0N1clBhZ2UoKTtcbiAgICB9LFxuICAgIG9uQ2xvc2VVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlUG9wdXAodGhpcyk7XG4gICAgfVxufSk7Il19