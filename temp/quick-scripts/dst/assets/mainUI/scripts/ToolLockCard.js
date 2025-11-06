
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/ToolLockCard.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7df6fkRqbRJh5oFcwYwErmw', 'ToolLockCard');
// mainUI/scripts/ToolLockCard.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    typeSprite: cc.Sprite,
    lockTip: cc.Label
  },
  initToolLockCard: function initToolLockCard(e, t) {
    var i = this;
    this.ui = e;
    this.toolId = t;
    var o = cc.JsonControl.getToolJson(this.toolId);
    this.spine.node.scale = o.scale;
    cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (e) {
      i.spine.skeletonData = e;
      i.spine.setAnimation(0, "stand1", !0);
    });
    cc.JsonControl.getToolTypeIcon(this.typeSprite, o.lattice);
    this.lockTip.string = cc.pvz.GameConfig.ToolLockTip.replace("$", cc.pvz.GameConfig.ToolLockLevel[this.toolId - 1]);
  },
  onClickCard: function onClickCard() {
    cc.popupManager.popup("mainUI", "plantInfo", "UIToolInfo", {
      ad: !1,
      scale: !0
    }, this.ui, this.toolId, !0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9Ub29sTG9ja0NhcmQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzcGluZSIsInNwIiwiU2tlbGV0b24iLCJ0eXBlU3ByaXRlIiwiU3ByaXRlIiwibG9ja1RpcCIsIkxhYmVsIiwiaW5pdFRvb2xMb2NrQ2FyZCIsImUiLCJ0IiwiaSIsInVpIiwidG9vbElkIiwibyIsIkpzb25Db250cm9sIiwiZ2V0VG9vbEpzb24iLCJub2RlIiwic2NhbGUiLCJwdnoiLCJ1dGlscyIsInVzZUJ1bmRsZUFzc2V0IiwiU2tlbGV0b25EYXRhIiwic2tlbGV0b25EYXRhIiwic2V0QW5pbWF0aW9uIiwiZ2V0VG9vbFR5cGVJY29uIiwibGF0dGljZSIsInN0cmluZyIsIkdhbWVDb25maWciLCJUb29sTG9ja1RpcCIsInJlcGxhY2UiLCJUb29sTG9ja0xldmVsIiwib25DbGlja0NhcmQiLCJwb3B1cE1hbmFnZXIiLCJwb3B1cCIsImFkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsS0FBSyxFQUFFQyxFQUFFLENBQUNDLFFBREY7SUFFUkMsVUFBVSxFQUFFUCxFQUFFLENBQUNRLE1BRlA7SUFHUkMsT0FBTyxFQUFFVCxFQUFFLENBQUNVO0VBSEosQ0FGUDtFQU9MQyxnQkFBZ0IsRUFBRSwwQkFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0lBQzlCLElBQUlDLENBQUMsR0FBRyxJQUFSO0lBQ0EsS0FBS0MsRUFBTCxHQUFVSCxDQUFWO0lBQ0EsS0FBS0ksTUFBTCxHQUFjSCxDQUFkO0lBQ0EsSUFBSUksQ0FBQyxHQUFHakIsRUFBRSxDQUFDa0IsV0FBSCxDQUFlQyxXQUFmLENBQTJCLEtBQUtILE1BQWhDLENBQVI7SUFDQSxLQUFLWixLQUFMLENBQVdnQixJQUFYLENBQWdCQyxLQUFoQixHQUF3QkosQ0FBQyxDQUFDSSxLQUExQjtJQUNBckIsRUFBRSxDQUFDc0IsR0FBSCxDQUFPQyxLQUFQLENBQWFDLGNBQWIsQ0FBNEIsUUFBNUIsRUFBc0Msc0JBQXRDLEVBQThEbkIsRUFBRSxDQUFDb0IsWUFBakUsRUFBK0UsVUFBVWIsQ0FBVixFQUFhO01BQ3hGRSxDQUFDLENBQUNWLEtBQUYsQ0FBUXNCLFlBQVIsR0FBdUJkLENBQXZCO01BQ0FFLENBQUMsQ0FBQ1YsS0FBRixDQUFRdUIsWUFBUixDQUFxQixDQUFyQixFQUF3QixRQUF4QixFQUFrQyxDQUFDLENBQW5DO0lBQ0gsQ0FIRDtJQUlBM0IsRUFBRSxDQUFDa0IsV0FBSCxDQUFlVSxlQUFmLENBQStCLEtBQUtyQixVQUFwQyxFQUFnRFUsQ0FBQyxDQUFDWSxPQUFsRDtJQUNBLEtBQUtwQixPQUFMLENBQWFxQixNQUFiLEdBQXNCOUIsRUFBRSxDQUFDc0IsR0FBSCxDQUFPUyxVQUFQLENBQWtCQyxXQUFsQixDQUE4QkMsT0FBOUIsQ0FDbEIsR0FEa0IsRUFFbEJqQyxFQUFFLENBQUNzQixHQUFILENBQU9TLFVBQVAsQ0FBa0JHLGFBQWxCLENBQWdDLEtBQUtsQixNQUFMLEdBQWMsQ0FBOUMsQ0FGa0IsQ0FBdEI7RUFJSCxDQXRCSTtFQXVCTG1CLFdBQVcsRUFBRSx1QkFBWTtJQUNyQm5DLEVBQUUsQ0FBQ29DLFlBQUgsQ0FBZ0JDLEtBQWhCLENBQ0ksUUFESixFQUVJLFdBRkosRUFHSSxZQUhKLEVBSUk7TUFDSUMsRUFBRSxFQUFFLENBQUMsQ0FEVDtNQUVJakIsS0FBSyxFQUFFLENBQUM7SUFGWixDQUpKLEVBUUksS0FBS04sRUFSVCxFQVNJLEtBQUtDLE1BVFQsRUFVSSxDQUFDLENBVkw7RUFZSDtBQXBDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICB0eXBlU3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgICAgIGxvY2tUaXA6IGNjLkxhYmVsXG4gICAgfSxcbiAgICBpbml0VG9vbExvY2tDYXJkOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgaSA9IHRoaXM7XG4gICAgICAgIHRoaXMudWkgPSBlO1xuICAgICAgICB0aGlzLnRvb2xJZCA9IHQ7XG4gICAgICAgIHZhciBvID0gY2MuSnNvbkNvbnRyb2wuZ2V0VG9vbEpzb24odGhpcy50b29sSWQpO1xuICAgICAgICB0aGlzLnNwaW5lLm5vZGUuc2NhbGUgPSBvLnNjYWxlO1xuICAgICAgICBjYy5wdnoudXRpbHMudXNlQnVuZGxlQXNzZXQoXCJhY3RvcnNcIiwgXCJjaGFyYWN0ZXIvQ2hhcmFjdGVyc1wiLCBzcC5Ta2VsZXRvbkRhdGEsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpLnNwaW5lLnNrZWxldG9uRGF0YSA9IGU7XG4gICAgICAgICAgICBpLnNwaW5lLnNldEFuaW1hdGlvbigwLCBcInN0YW5kMVwiLCAhMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYy5Kc29uQ29udHJvbC5nZXRUb29sVHlwZUljb24odGhpcy50eXBlU3ByaXRlLCBvLmxhdHRpY2UpO1xuICAgICAgICB0aGlzLmxvY2tUaXAuc3RyaW5nID0gY2MucHZ6LkdhbWVDb25maWcuVG9vbExvY2tUaXAucmVwbGFjZShcbiAgICAgICAgICAgIFwiJFwiLFxuICAgICAgICAgICAgY2MucHZ6LkdhbWVDb25maWcuVG9vbExvY2tMZXZlbFt0aGlzLnRvb2xJZCAtIDFdXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wb3B1cE1hbmFnZXIucG9wdXAoXG4gICAgICAgICAgICBcIm1haW5VSVwiLFxuICAgICAgICAgICAgXCJwbGFudEluZm9cIixcbiAgICAgICAgICAgIFwiVUlUb29sSW5mb1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkOiAhMSxcbiAgICAgICAgICAgICAgICBzY2FsZTogITBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnVpLFxuICAgICAgICAgICAgdGhpcy50b29sSWQsXG4gICAgICAgICAgICAhMFxuICAgICAgICApO1xuICAgIH1cbn0pOyJdfQ==