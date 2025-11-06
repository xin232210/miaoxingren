
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UISet.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6fa40zqGBBAXrWCVB0pXhaH', 'UISet');
// mainUI/scripts/UISet.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    musicBtn: cc.Node,
    soundBtn: cc.Node,
    uidLabel: cc.Label,
    saveNode: cc.Node,
    versionLabel: cc.Label
  },
  initBy: function initBy(e) {
    this.musicBtn.children[0].active = !cc.player.isMMute;
    this.musicBtn.children[1].active = cc.player.isMMute;
    this.soundBtn.children[0].active = !cc.player.isSMute;
    this.soundBtn.children[1].active = cc.player.isSMute;
    this.uidLabel.string = cc.pvz.cloud.uid;
    this.saveNode.active = 0 == e && 1 == cc.player.guide1;
    this.saveNode.parent.getComponent(cc.Layout).updateLayout();

    if (this.versionLabel) {
      this.versionLabel.string = "v" + cc.pvz.GameConst.GAME_VERSION;
    }

    cc.pvz.TAUtils.trackSystemUI(4);
  },
  onSwitchMusic: function onSwitchMusic() {
    cc.butler.setMusicSwitch(!cc.player.isMMute);
    this.musicBtn.children[0].active = !cc.player.isMMute;
    this.musicBtn.children[1].active = cc.player.isMMute;
  },
  onSwitchSound: function onSwitchSound() {
    cc.butler.setSoundSwitch(!cc.player.isSMute);
    this.soundBtn.children[0].active = !cc.player.isSMute;
    this.soundBtn.children[1].active = cc.player.isSMute;
  },
  onClickSave: function onClickSave() {
    if (cc.player.guide1 < 1) {
      cc.popupManager.showToast("完成教学后开启");
    } else {
      if (Date.now() - cc.storageTime2 < 6e4) {
        cc.popupManager.showToast("请于1分钟后再上传");
      } else {
        cc.pvz.PlayerData.saveDataToLocalOnline(function (e) {
          cc.storageTime2 = Date.now();
          cc.popupManager.showToast(e ? "存档成功" : "存档失败");
        });
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVNldC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm11c2ljQnRuIiwiTm9kZSIsInNvdW5kQnRuIiwidWlkTGFiZWwiLCJMYWJlbCIsInNhdmVOb2RlIiwidmVyc2lvbkxhYmVsIiwiaW5pdEJ5IiwiZSIsImNoaWxkcmVuIiwiYWN0aXZlIiwicGxheWVyIiwiaXNNTXV0ZSIsImlzU011dGUiLCJzdHJpbmciLCJwdnoiLCJjbG91ZCIsInVpZCIsImd1aWRlMSIsInBhcmVudCIsImdldENvbXBvbmVudCIsIkxheW91dCIsInVwZGF0ZUxheW91dCIsIkdhbWVDb25zdCIsIkdBTUVfVkVSU0lPTiIsIlRBVXRpbHMiLCJ0cmFja1N5c3RlbVVJIiwib25Td2l0Y2hNdXNpYyIsImJ1dGxlciIsInNldE11c2ljU3dpdGNoIiwib25Td2l0Y2hTb3VuZCIsInNldFNvdW5kU3dpdGNoIiwib25DbGlja1NhdmUiLCJwb3B1cE1hbmFnZXIiLCJzaG93VG9hc3QiLCJEYXRlIiwibm93Iiwic3RvcmFnZVRpbWUyIiwiUGxheWVyRGF0YSIsInNhdmVEYXRhVG9Mb2NhbE9ubGluZSIsIm9uQ2xvc2VVSSIsInJlbW92ZVBvcHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsUUFBUSxFQUFFSixFQUFFLENBQUNLLElBREw7SUFFUkMsUUFBUSxFQUFFTixFQUFFLENBQUNLLElBRkw7SUFHUkUsUUFBUSxFQUFFUCxFQUFFLENBQUNRLEtBSEw7SUFJUkMsUUFBUSxFQUFFVCxFQUFFLENBQUNLLElBSkw7SUFLUkssWUFBWSxFQUFFVixFQUFFLENBQUNRO0VBTFQsQ0FGUDtFQVNMRyxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixLQUFL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Q0FBMEIxQixDQUFDLEdBQUcsTUFBSCxHQUFZLE1BQXZDO1FBQ0gsQ0FIRDtNQUlIO0lBQ0o7RUFDSixDQTdDSTtFQThDTGdDLFNBQVMsRUFBRSxxQkFBWTtJQUNuQjVDLEVBQUUsQ0FBQ3FDLFlBQUgsQ0FBZ0JRLFdBQWhCLENBQTRCLElBQTVCO0VBQ0g7QUFoREksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG11c2ljQnRuOiBjYy5Ob2RlLFxuICAgICAgICBzb3VuZEJ0bjogY2MuTm9kZSxcbiAgICAgICAgdWlkTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBzYXZlTm9kZTogY2MuTm9kZSxcbiAgICAgICAgdmVyc2lvbkxhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLm11c2ljQnRuLmNoaWxkcmVuWzBdLmFjdGl2ZSA9ICFjYy5wbGF5ZXIuaXNNTXV0ZTtcbiAgICAgICAgdGhpcy5tdXNpY0J0bi5jaGlsZHJlblsxXS5hY3RpdmUgPSBjYy5wbGF5ZXIuaXNNTXV0ZTtcbiAgICAgICAgdGhpcy5zb3VuZEJ0bi5jaGlsZHJlblswXS5hY3RpdmUgPSAhY2MucGxheWVyLmlzU011dGU7XG4gICAgICAgIHRoaXMuc291bmRCdG4uY2hpbGRyZW5bMV0uYWN0aXZlID0gY2MucGxheWVyLmlzU011dGU7XG4gICAgICAgIHRoaXMudWlkTGFiZWwuc3RyaW5nID0gY2MucHZ6LmNsb3VkLnVpZDtcbiAgICAgICAgdGhpcy5zYXZlTm9kZS5hY3RpdmUgPSAwID09IGUgJiYgMSA9PSBjYy5wbGF5ZXIuZ3VpZGUxO1xuICAgICAgICB0aGlzLnNhdmVOb2RlLnBhcmVudC5nZXRDb21wb25lbnQoY2MuTGF5b3V0KS51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbkxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb25MYWJlbC5zdHJpbmcgPSBcInZcIiArIGNjLnB2ei5HYW1lQ29uc3QuR0FNRV9WRVJTSU9OO1xuICAgICAgICB9XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrU3lzdGVtVUkoNCk7XG4gICAgfSxcbiAgICBvblN3aXRjaE11c2ljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5zZXRNdXNpY1N3aXRjaCghY2MucGxheWVyLmlzTU11dGUpO1xuICAgICAgICB0aGlzLm11c2ljQnRuLmNoaWxkcmVuWzBdLmFjdGl2ZSA9ICFjYy5wbGF5ZXIuaXNNTXV0ZTtcbiAgICAgICAgdGhpcy5tdXNpY0J0bi5jaGlsZHJlblsxXS5hY3RpdmUgPSBjYy5wbGF5ZXIuaXNNTXV0ZTtcbiAgICB9LFxuICAgIG9uU3dpdGNoU291bmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuYnV0bGVyLnNldFNvdW5kU3dpdGNoKCFjYy5wbGF5ZXIuaXNTTXV0ZSk7XG4gICAgICAgIHRoaXMuc291bmRCdG4uY2hpbGRyZW5bMF0uYWN0aXZlID0gIWNjLnBsYXllci5pc1NNdXRlO1xuICAgICAgICB0aGlzLnNvdW5kQnRuLmNoaWxkcmVuWzFdLmFjdGl2ZSA9IGNjLnBsYXllci5pc1NNdXRlO1xuICAgIH0sXG4gICAgb25DbGlja1NhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci5ndWlkZTEgPCAxKSB7XG4gICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIuc2hvd1RvYXN0KFwi5a6M5oiQ5pWZ5a2m5ZCO5byA5ZCvXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKERhdGUubm93KCkgLSBjYy5zdG9yYWdlVGltZTIgPCA2ZTQpIHtcbiAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIuc2hvd1RvYXN0KFwi6K+35LqOMeWIhumSn+WQjuWGjeS4iuS8oFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuc2F2ZURhdGFUb0xvY2FsT25saW5lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN0b3JhZ2VUaW1lMiA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5zaG93VG9hc3QoZSA/IFwi5a2Y5qGj5oiQ5YqfXCIgOiBcIuWtmOaho+Wksei0pVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZVVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9XG59KTtcbiJdfQ==