
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIShare.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0c413O0xYdARItY6r0cRWvp', 'UIShare');
// mainUI/scripts/UIShare.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnSprite: cc.Sprite,
    gettedNode: cc.Node
  },
  initBy: function initBy() {
    cc.pvz.PlayerData.checkAndResetShare();
    var e = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["金币"], 2e3);
    var t = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["钻石"], 25);
    var i = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["随机蓝色碎片"], 6);
    this.rewardList = [e, t, i];
    this.gettedNode.active = cc.player.isShare;
  },
  onClickShare: function onClickShare() {
    var e = this;

    if (cc.player.isShare) {
      cc.pvz.TAUtils.share(-1, function () {
        cc.popupManager.showToast("分享成功");
      });
    } else {
      cc.pvz.TAUtils.share(0, function (t) {
        if (t) {
          if (cc.player.isShare) {//
          } else {
            cc.pvz.PlayerData.finishShare();
            cc.popupManager.popup("mainUI", "getrewardUI", "UIReward", {
              ad: !0,
              scale: !1
            }, e.rewardList, cc.pvz.GameConfig.UIFromType["分享奖励"], function () {
              cc.MainControl.updateItemInfo();
              cc.RedControl.refreshAllRedTip();
              cc.popupManager.removePopup(e);
            });
          }
        }
      });
    }
  },
  onCloseUI: function onCloseUI() {
    cc.MainControl.updateItemInfo();
    cc.RedControl.refreshAllRedTip();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVNoYXJlLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiYnRuU3ByaXRlIiwiU3ByaXRlIiwiZ2V0dGVkTm9kZSIsIk5vZGUiLCJpbml0QnkiLCJwdnoiLCJQbGF5ZXJEYXRhIiwiY2hlY2tBbmRSZXNldFNoYXJlIiwiZSIsInV0aWxzIiwiZ2V0UmV3YXJkSXRlbSIsIkdhbWVDb25maWciLCJJdGVtVHlwZSIsInQiLCJpIiwicmV3YXJkTGlzdCIsImFjdGl2ZSIsInBsYXllciIsImlzU2hhcmUiLCJvbkNsaWNrU2hhcmUiLCJUQVV0aWxzIiwic2hhcmUiLCJwb3B1cE1hbmFnZXIiLCJzaG93VG9hc3QiLCJmaW5pc2hTaGFyZSIsInBvcHVwIiwiYWQiLCJzY2FsZSIsIlVJRnJvbVR5cGUiLCJNYWluQ29udHJvbCIsInVwZGF0ZUl0ZW1JbmZvIiwiUmVkQ29udHJvbCIsInJlZnJlc2hBbGxSZWRUaXAiLCJyZW1vdmVQb3B1cCIsIm9uQ2xvc2VVSSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxNQUROO0lBRVJDLFVBQVUsRUFBRU4sRUFBRSxDQUFDTztFQUZQLENBRlA7RUFNTEMsTUFBTSxFQUFFLGtCQUFZO0lBQ2hCUixFQUFFLENBQUNTLEdBQUgsQ0FBT0MsVUFBUCxDQUFrQkMsa0JBQWxCO0lBQ0EsSUFBSUMsQ0FBQyxHQUFHWixFQUFFLENBQUNTLEdBQUgsQ0FBT0ksS0FBUCxDQUFhQyxhQUFiLENBQTJCZCxFQUFFLENBQUNTLEdBQUgsQ0FBT00sVUFBUCxDQUFrQkMsUUFBbEIsQ0FBMkIsSUFBM0IsQ0FBM0IsRUFBNkQsR0FBN0QsQ0FBUjtJQUNBLElBQUlDLENBQUMsR0FBR2pCLEVBQUUsQ0FBQ1MsR0FBSCxDQUFPSSxLQUFQLENBQWFDLGFBQWIsQ0FBMkJkLEVBQUUsQ0FBQ1MsR0FBSCxDQUFPTSxVQUFQLENBQWtCQyxRQUFsQixDQUEyQixJQUEzQixDQUEzQixFQUE2RCxFQUE3RCxDQUFSO0lBQ0EsSUFBSUUsQ0FBQyxHQUFHbEIsRUFBRSxDQUFDUyxHQUFILENBQU9JLEtBQVAsQ0FBYUMsYUFBYixDQUEyQmQsRUFBRSxDQUFDUyxHQUFILENBQU9NLFVBQVAsQ0FBa0JDLFFBQWxCLENBQTJCLFFBQTNCLENBQTNCLEVBQWlFLENBQWpFLENBQVI7SUFDQSxLQUFLRyxVQUFMLEdBQWtCLENBQUNQLENBQUQsRUFBSUssQ0FBSixFQUFPQyxDQUFQLENBQWxCO0lBQ0EsS0FBS1osVUFBTCxDQUFnQmMsTUFBaEIsR0FBeUJwQixFQUFFLENBQUNxQixNQUFILENBQVVDLE9BQW5DO0VBQ0gsQ0FiSTtFQWNMQyxZQUFZLEVBQUUsd0JBQVk7SUFDdEIsSUFBSVgsQ0FBQyxHQUFHLElBQVI7O0lBQ0EsSUFBSVosRUFBRSxDQUFDcUIsTUFBSCxDQUFVQyxPQUFkLEVBQXVCO01BQ25CdEIsRUFBRSxDQUFDUyxHQUFILENBQU9lLE9BQVAsQ0FBZUMsS0FBZixDQUFxQixDQUFDLENBQXRCLEVBQXlCLFlBQVk7UUFDakN6QixFQUFFLENBQUMwQixZQUFILENBQWdCQyxTQUFoQixDQUEwQixNQUExQjtNQUNILENBRkQ7SUFHSCxDQUpELE1BSU87TUFDSDNCLEVBQUUsQ0FBQ1MsR0FBSCxDQUFPZSxPQUFQLENBQWVDLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0IsVUFBVVIsQ0FBVixFQUFhO1FBQ2pDLElBQUlBLENBQUosRUFBTztVQUNILElBQUlqQixFQUFFLENBQUNxQixNQUFILENBQVVDLE9BQWQsRUFBdUIsQ0FDbkI7VUFDSCxDQUZELE1BRU87WUFDSHRCLEVBQUUsQ0FBQ1MsR0FBSCxDQUFPQyxVQUFQLENBQWtCa0IsV0FBbEI7WUFDQTVCLEVBQUUsQ0FBQzBCLFlBQUgsQ0FBZ0JHLEtBQWhCLENBQ0ksUUFESixFQUVJLGFBRkosRUFHSSxVQUhKLEVBSUk7Y0FDSUMsRUFBRSxFQUFFLENBQUMsQ0FEVDtjQUVJQyxLQUFLLEVBQUUsQ0FBQztZQUZaLENBSkosRUFRSW5CLENBQUMsQ0FBQ08sVUFSTixFQVNJbkIsRUFBRSxDQUFDUyxHQUFILENBQU9NLFVBQVAsQ0FBa0JpQixVQUFsQixDQUE2QixNQUE3QixDQVRKLEVBVUksWUFBWTtjQUNSaEMsRUFBRSxDQUFDaUMsV0FBSCxDQUFlQyxjQUFmO2NBQ0FsQyxFQUFFLENBQUNtQyxVQUFILENBQWNDLGdCQUFkO2NBQ0FwQyxFQUFFLENBQUMwQixZQUFILENBQWdCVyxXQUFoQixDQUE0QnpCLENBQTVCO1lBQ0gsQ0FkTDtVQWdCSDtRQUNKO01BQ0osQ0F4QkQ7SUF5Qkg7RUFDSixDQS9DSTtFQWdETDBCLFNBQVMsRUFBRSxxQkFBWTtJQUNuQnRDLEVBQUUsQ0FBQ2lDLFdBQUgsQ0FBZUMsY0FBZjtJQUNBbEMsRUFBRSxDQUFDbUMsVUFBSCxDQUFjQyxnQkFBZDtJQUNBcEMsRUFBRSxDQUFDMEIsWUFBSCxDQUFnQlcsV0FBaEIsQ0FBNEIsSUFBNUI7RUFDSDtBQXBESSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYnRuU3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgICAgIGdldHRlZE5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5jaGVja0FuZFJlc2V0U2hhcmUoKTtcbiAgICAgICAgdmFyIGUgPSBjYy5wdnoudXRpbHMuZ2V0UmV3YXJkSXRlbShjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumHkeW4gVwiXSwgMmUzKTtcbiAgICAgICAgdmFyIHQgPSBjYy5wdnoudXRpbHMuZ2V0UmV3YXJkSXRlbShjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumSu+efs1wiXSwgMjUpO1xuICAgICAgICB2YXIgaSA9IGNjLnB2ei51dGlscy5nZXRSZXdhcmRJdGVtKGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi6ZqP5py66JOd6Imy56KO54mHXCJdLCA2KTtcbiAgICAgICAgdGhpcy5yZXdhcmRMaXN0ID0gW2UsIHQsIGldO1xuICAgICAgICB0aGlzLmdldHRlZE5vZGUuYWN0aXZlID0gY2MucGxheWVyLmlzU2hhcmU7XG4gICAgfSxcbiAgICBvbkNsaWNrU2hhcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBpZiAoY2MucGxheWVyLmlzU2hhcmUpIHtcbiAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnNoYXJlKC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnNob3dUb2FzdChcIuWIhuS6q+aIkOWKn1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucHZ6LlRBVXRpbHMuc2hhcmUoMCwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2MucGxheWVyLmlzU2hhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5maW5pc2hTaGFyZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnBvcHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWFpblVJXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnZXRyZXdhcmRVSVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVUlSZXdhcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6ICExXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnJld2FyZExpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucHZ6LkdhbWVDb25maWcuVUlGcm9tVHlwZVtcIuWIhuS6q+WlluWKsVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLk1haW5Db250cm9sLnVwZGF0ZUl0ZW1JbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLlJlZENvbnRyb2wucmVmcmVzaEFsbFJlZFRpcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlUG9wdXAoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuTWFpbkNvbnRyb2wudXBkYXRlSXRlbUluZm8oKTtcbiAgICAgICAgY2MuUmVkQ29udHJvbC5yZWZyZXNoQWxsUmVkVGlwKCk7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9XG59KTtcbiJdfQ==