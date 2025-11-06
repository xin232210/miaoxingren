
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/ToolCard.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '26cbdZ9zrlPbaULzzRpd2MI', 'ToolCard');
// mainUI/scripts/ToolCard.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    qualitySprite: cc.Sprite,
    typeSprite: cc.Sprite,
    nameLabel: cc.Label,
    levelLabel: cc.Label,
    fragLabel: cc.Label,
    lvProgressBar: cc.ProgressBar,
    maxFragLine: cc.Node,
    lvTipNode: cc.Node,
    fragTipNode: cc.Node
  },
  initToolCardItem: function initToolCardItem(e, t) {
    var i = this;
    this.ui = e;
    this.toolId = t;
    this.stageLevel = cc.pvz.PlayerData.getStageLevel();
    this.toolJson = cc.JsonControl.getToolJson(this.toolId);
    this.nameLabel.string = this.toolJson.name;
    cc.JsonControl.getToolTypeIcon(this.typeSprite, this.toolJson.lattice);
    this.spine.node.scale = this.toolJson.scale;
    cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (e) {
      i.spine.skeletonData = e;
      i.refreshToolSpineShow();
    });
    this.onLvUpRefreshCard(!1);
  },
  refreshToolSpineShow: function refreshToolSpineShow() {
    var e = cc.pvz.PlayerData.getToolData(this.toolId).lv;
    var t = cc.pvz.utils.getLevelInterval(e);
    this.spine.setAnimation(0, "Idle", !0);
  },
  onLvUpRefreshCard: function onLvUpRefreshCard(e) {
    if (void 0 === e) {
      e = !0;
    }

    this.toolData = cc.pvz.PlayerData.getToolData(this.toolId);
    this.toollvJson = cc.JsonControl.getToolLvUpJson(this.toolData.lv);

    if (e) {
      this.refreshToolSpineShow();
    }

    cc.JsonControl.getQualityCardIcon(this.qualitySprite, this.toolJson.quality);
    this.toolJson.quality;
    var t = this.stageLevel <= cc.pvz.GameConfig.ToolLockLevel[this.toolId - 1];

    if (t) {
      this.levelLabel.string = "未解锁";
    } else {
      this.levelLabel.string = "等级" + this.toolData.lv;
    }

    this.isMaxLv = this.toolData.lv >= cc.pvz.GameConfig.MaxToolLv;
    var i = this.toollvJson["sp" + this.toolJson.quality];
    this.isEnoughFrag = this.toolData.c >= i;

    if (this.isMaxLv) {
      this.fragLabel.string = "已满级";
    } else {
      this.fragLabel.string = this.toolData.c + "/" + i;
    }

    this.lvProgressBar.progress = this.toolData.c / i;
    this.lvProgressBar.node.active = !this.isEnoughFrag || !this.isMaxLv;
    this.maxFragLine.active = this.isEnoughFrag || this.isMaxLv;
    this.lvTipNode.active = this.isEnoughFrag && !this.isMaxLv;
    this.fragTipNode.active = !this.isEnoughFrag || this.isMaxLv;
  },
  onClickCard: function onClickCard() {
    this.ui.onClickCard(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9Ub29sQ2FyZC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsInF1YWxpdHlTcHJpdGUiLCJTcHJpdGUiLCJ0eXBlU3ByaXRlIiwibmFtZUxhYmVsIiwiTGFiZWwiLCJsZXZlbExhYmVsIiwiZnJhZ0xhYmVsIiwibHZQcm9ncmVzc0JhciIsIlByb2dyZXNzQmFyIiwibWF4RnJhZ0xpbmUiLCJOb2RlIiwibHZUaXBOb2RlIiwiZnJhZ1RpcE5vZGUiLCJpbml0VG9vbENhcmRJdGVtIiwiZSIsInQiLCJpIiwidWkiLCJ0b29sSWQiLCJzdGFnZUxldmVsIiwicHZ6IiwiUGxheWVyRGF0YSIsImdldFN0YWdlTGV2ZWwiLCJ0b29sSnNvbiIsIkpzb25Db250cm9sIiwiZ2V0VG9vbEpzb24iLCJzdHJpbmciLCJuYW1lIiwiZ2V0VG9vbFR5cGVJY29uIiwibGF0dGljZSIsIm5vZGUiLCJzY2FsZSIsInV0aWxzIiwidXNlQnVuZGxlQXNzZXQiLCJTa2VsZXRvbkRhdGEiLCJza2VsZXRvbkRhdGEiLCJyZWZyZXNoVG9vbFNwaW5lU2hvdyIsIm9uTHZVcFJlZnJlc2hDYXJkIiwiZ2V0VG9vbERhdGEiLCJsdiIsImdldExldmVsSW50ZXJ2YWwiLCJzZXRBbmltYXRpb24iLCJ0b29sRGF0YSIsInRvb2xsdkpzb24iLCJnZXRUb29sTHZVcEpzb24iLCJnZXRRdWFsaXR5Q2FyZEljb24iLCJxdWFsaXR5IiwiR2FtZUNvbmZpZyIsIlRvb2xMb2NrTGV2ZWwiLCJpc01heEx2IiwiTWF4VG9vbEx2IiwiaXNFbm91Z2hGcmFnIiwiYyIsInByb2dyZXNzIiwiYWN0aXZlIiwib25DbGlja0NhcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxD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SCxZQUFMLElBQXFCLEtBQUtGLE9BQXBEO0lBQ0EsS0FBS3RDLFNBQUwsQ0FBZTJDLE1BQWYsR0FBd0IsS0FBS0gsWUFBTCxJQUFxQixDQUFDLEtBQUtGLE9BQW5EO0lBQ0EsS0FBS3JDLFdBQUwsQ0FBaUIwQyxNQUFqQixHQUEwQixDQUFDLEtBQUtILFlBQU4sSUFBc0IsS0FBS0YsT0FBckQ7RUFDSCxDQWhFSTtFQWlFTE0sV0FBVyxFQUFFLHVCQUFZO0lBQ3JCLEtBQUt0QyxFQUFMLENBQVFzQyxXQUFSLENBQW9CLElBQXBCO0VBQ0g7QUFuRUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwaW5lOiBzcC5Ta2VsZXRvbixcbiAgICAgICAgcXVhbGl0eVNwcml0ZTogY2MuU3ByaXRlLFxuICAgICAgICB0eXBlU3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgICAgIG5hbWVMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIGxldmVsTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBmcmFnTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBsdlByb2dyZXNzQmFyOiBjYy5Qcm9ncmVzc0JhcixcbiAgICAgICAgbWF4RnJhZ0xpbmU6IGNjLk5vZGUsXG4gICAgICAgIGx2VGlwTm9kZTogY2MuTm9kZSxcbiAgICAgICAgZnJhZ1RpcE5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRUb29sQ2FyZEl0ZW06IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIHZhciBpID0gdGhpcztcbiAgICAgICAgdGhpcy51aSA9IGU7XG4gICAgICAgIHRoaXMudG9vbElkID0gdDtcbiAgICAgICAgdGhpcy5zdGFnZUxldmVsID0gY2MucHZ6LlBsYXllckRhdGEuZ2V0U3RhZ2VMZXZlbCgpO1xuICAgICAgICB0aGlzLnRvb2xKc29uID0gY2MuSnNvbkNvbnRyb2wuZ2V0VG9vbEpzb24odGhpcy50b29sSWQpO1xuICAgICAgICB0aGlzLm5hbWVMYWJlbC5zdHJpbmcgPSB0aGlzLnRvb2xKc29uLm5hbWU7XG4gICAgICAgIGNjLkpzb25Db250cm9sLmdldFRvb2xUeXBlSWNvbih0aGlzLnR5cGVTcHJpdGUsIHRoaXMudG9vbEpzb24ubGF0dGljZSk7XG4gICAgICAgIHRoaXMuc3BpbmUubm9kZS5zY2FsZSA9IHRoaXMudG9vbEpzb24uc2NhbGU7XG4gICAgICAgIGNjLnB2ei51dGlscy51c2VCdW5kbGVBc3NldChcImFjdG9yc1wiLCBcImNoYXJhY3Rlci9DaGFyYWN0ZXJzXCIsIHNwLlNrZWxldG9uRGF0YSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGkuc3BpbmUuc2tlbGV0b25EYXRhID0gZTtcbiAgICAgICAgICAgIGkucmVmcmVzaFRvb2xTcGluZVNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25MdlVwUmVmcmVzaENhcmQoITEpO1xuICAgIH0sXG4gICAgcmVmcmVzaFRvb2xTcGluZVNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YSh0aGlzLnRvb2xJZCkubHY7XG4gICAgICAgIHZhciB0ID0gY2MucHZ6LnV0aWxzLmdldExldmVsSW50ZXJ2YWwoZSk7XG4gICAgICAgIHRoaXMuc3BpbmUuc2V0QW5pbWF0aW9uKDAsIFwiSWRsZVwiLCAhMCk7XG4gICAgfSxcbiAgICBvbkx2VXBSZWZyZXNoQ2FyZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gZSkge1xuICAgICAgICAgICAgZSA9ICEwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9vbERhdGEgPSBjYy5wdnouUGxheWVyRGF0YS5nZXRUb29sRGF0YSh0aGlzLnRvb2xJZCk7XG4gICAgICAgIHRoaXMudG9vbGx2SnNvbiA9IGNjLkpzb25Db250cm9sLmdldFRvb2xMdlVwSnNvbih0aGlzLnRvb2xEYXRhLmx2KTtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRvb2xTcGluZVNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5Kc29uQ29udHJvbC5nZXRRdWFsaXR5Q2FyZEljb24odGhpcy5xdWFsaXR5U3ByaXRlLCB0aGlzLnRvb2xKc29uLnF1YWxpdHkpO1xuICAgICAgICB0aGlzLnRvb2xKc29uLnF1YWxpdHk7XG4gICAgICAgIHZhciB0ID0gdGhpcy5zdGFnZUxldmVsIDw9IGNjLnB2ei5HYW1lQ29uZmlnLlRvb2xMb2NrTGV2ZWxbdGhpcy50b29sSWQgLSAxXTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRoaXMubGV2ZWxMYWJlbC5zdHJpbmcgPSBcIuacquino+mUgVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sZXZlbExhYmVsLnN0cmluZyA9IFwi562J57qnXCIgKyB0aGlzLnRvb2xEYXRhLmx2O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNNYXhMdiA9IHRoaXMudG9vbERhdGEubHYgPj0gY2MucHZ6LkdhbWVDb25maWcuTWF4VG9vbEx2O1xuICAgICAgICB2YXIgaSA9IHRoaXMudG9vbGx2SnNvbltcInNwXCIgKyB0aGlzLnRvb2xKc29uLnF1YWxpdHldO1xuICAgICAgICB0aGlzLmlzRW5vdWdoRnJhZyA9IHRoaXMudG9vbERhdGEuYyA+PSBpO1xuICAgICAgICBpZiAodGhpcy5pc01heEx2KSB7XG4gICAgICAgICAgICB0aGlzLmZyYWdMYWJlbC5zdHJpbmcgPSBcIuW3sua7oee6p1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFnTGFiZWwuc3RyaW5nID0gdGhpcy50b29sRGF0YS5jICsgXCIvXCIgKyBpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubHZQcm9ncmVzc0Jhci5wcm9ncmVzcyA9IHRoaXMudG9vbERhdGEuYyAvIGk7XG4gICAgICAgIHRoaXMubHZQcm9ncmVzc0Jhci5ub2RlLmFjdGl2ZSA9ICF0aGlzLmlzRW5vdWdoRnJhZyB8fCAhdGhpcy5pc01heEx2O1xuICAgICAgICB0aGlzLm1heEZyYWdMaW5lLmFjdGl2ZSA9IHRoaXMuaXNFbm91Z2hGcmFnIHx8IHRoaXMuaXNNYXhMdjtcbiAgICAgICAgdGhpcy5sdlRpcE5vZGUuYWN0aXZlID0gdGhpcy5pc0Vub3VnaEZyYWcgJiYgIXRoaXMuaXNNYXhMdjtcbiAgICAgICAgdGhpcy5mcmFnVGlwTm9kZS5hY3RpdmUgPSAhdGhpcy5pc0Vub3VnaEZyYWcgfHwgdGhpcy5pc01heEx2O1xuICAgIH0sXG4gICAgb25DbGlja0NhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy51aS5vbkNsaWNrQ2FyZCh0aGlzKTtcbiAgICB9XG59KTsiXX0=