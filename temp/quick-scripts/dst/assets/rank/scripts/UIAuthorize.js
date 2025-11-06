
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/rank/scripts/UIAuthorize.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '859412P85BAzItu5YiMYV68', 'UIAuthorize');
// rank/scripts/UIAuthorize.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    uidLabel: cc.Label,
    root1: cc.Node,
    root2: cc.Node,
    rewardNode: cc.Node,
    wxNode: cc.Node
  },
  initBy: function initBy(e) {
    var t = this;
    this.onCloseCB = e;
    this.preAuth = cc.player.auth;
    this.uidLabel.string = cc.pvz.cloud.uid;
    this.root1.active = !1;
    this.root2.active = !1;
    this.rewardNode.active = 1 != cc.player.auth;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.getSetting({
        success: function success(e) {
          if (!0 === e.authSetting["scope.userInfo"]) {
            t.root2.active = !0;
          } else {
            t.root1.active = !0;
          }
        }
      });
    } else {
      this.root1.active = this.rewardNode.active;
      this.root2.active = !this.rewardNode.active;
    }
  },
  onClickClose: function onClickClose() {
    this.wxNode.destroy();
    cc.popupManager.removePopup(this);

    if (this.onCloseCB) {
      this.onCloseCB(1 != this.preAuth && 1 == cc.player.auth);
    }
  },
  onAuthorizeSucc: function onAuthorizeSucc() {
    this.root1.active = !1;
    this.root2.active = !0;
    this.rewardNode.active = !1;

    if (1 != cc.player.auth) {
      cc.player.auth = 1;
      var e = cc.pvz.GameConfig.ItemType["钻石"];
      cc.pvz.PlayerData.changeItemNum(e, 100);
      cc.popupManager.showEffectFly(e, cc.MainControl.getItemEffectPos(e), cc.math.randomRangeInt(1, 4));
      cc.MainControl.updateItemInfo();
    }
  },
  onWxAuthorize: function onWxAuthorize(e) {
    var t = this;
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(e);

    if (e.userInfo && e.userInfo.avatarUrl && e.userInfo.nickName) {
      cc.pvz.cloud.setAvatar(e.userInfo.nickName, e.userInfo.avatarUrl, function (e) {
        if (e) {
          t.onAuthorizeSucc();
        } else {
          cc.popupManager.showToast("授权失败,稍后再试");
        }
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9yYW5rL3NjcmlwdHMvVUlBdXRob3JpemUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ1aWRMYWJlbCIsIkxhYmVsIiwicm9vdDEiLCJOb2RlIiwicm9vdDIiLCJyZXdhcmROb2RlIiwid3hOb2RlIiwiaW5pdEJ5IiwiZSIsInQiLCJvbkNsb3NlQ0IiLCJwcmVBdXRoIiwicGxheWVyIiwiYXV0aCIsInN0cmluZyIsInB2eiIsImNsb3VkIiwidWlkIiwiYWN0aXZlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInd4IiwiZ2V0U2V0dGluZyIsInN1Y2Nlc3MiLCJhdXRoU2V0dGluZyIsIm9uQ2xpY2tDbG9zZSIsImRlc3Ryb3kiLCJwb3B1cE1hbmFnZXIiLCJyZW1vdmVQb3B1cCIsIm9uQXV0aG9yaXplU3VjYyIsIkdhbWVDb25maWciLCJJdGVtVHlwZSIsIlBsYXllckRhdGEiLCJjaGFuZ2VJdGVtTnVtIiwic2hvd0VmZmVjdEZseSIsIk1haW5Db250cm9sIiwiZ2V0SXRlbUVmZmVjdFBvcyIsIm1hdGgiLCJyYW5kb21SYW5nZUludCIsInVwZGF0ZUl0ZW1JbmZvIiwib25XeEF1dGhvcml6ZSIsImNvbnNvbGUiLCJsb2ciLCJ1c2VySW5mbyIsImF2YXRhclVybCIsIm5pY2tOYW1lIiwic2V0QXZhdGFyIiwic2hvd1RvYXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsUUFBUSxFQUFFSixFQUFFLENBQUNLLEtBREw7SUFFUkMsS0FBSyxFQUFFTixFQUFFLENBQUNPLElBRkY7SUFHUkMsS0FBSyxFQUFFUixFQUFFLENBQUNPLElBSEY7SUFJUkUsVUFBVSxFQUFFVCxFQUFFLENBQUNPLElBSlA7SUFLUkcsTUFBTSxFQUFFVixFQUFFLENB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QUlDLENBQUMsR0FBRyxJQUFSO0lBQ0FpQyxPQUFPLENBQUNDLEdBQVIsQ0FBWSwyQkFBWjtJQUNBRCxPQUFPLENBQUNDLEdBQVIsQ0FBWW5DLENBQVo7O0lBQ0EsSUFBSUEsQ0FBQyxDQUFDb0MsUUFBRixJQUFjcEMsQ0FBQyxDQUFDb0MsUUFBRixDQUFXQyxTQUF6QixJQUFzQ3JDLENBQUMsQ0FBQ29DLFFBQUYsQ0FBV0UsUUFBckQsRUFBK0Q7TUFDM0RsRCxFQUFFLENBQUNtQixHQUFILENBQU9DLEtBQVAsQ0FBYStCLFNBQWIsQ0FBdUJ2QyxDQUFDLENBQUNvQyxRQUFGLENBQVdFLFFBQWxDLEVBQTRDdEMsQ0FBQyxDQUFDb0MsUUFBRixDQUFXQyxTQUF2RCxFQUFrRSxVQUFVckMsQ0FBVixFQUFhO1FBQzNFLElBQUlBLENBQUosRUFBTztVQUNIQyxDQUFDLENBQUNxQixlQUFGO1FBQ0gsQ0FGRCxNQUVPO1VBQ0hsQyxFQUFFLENBQUNnQyxZQUFILENBQWdCb0IsU0FBaEIsQ0FBMEIsV0FBMUI7UUFDSDtNQUNKLENBTkQ7SUFPSDtFQUNKO0FBaEVJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB1aWRMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIHJvb3QxOiBjYy5Ob2RlLFxuICAgICAgICByb290MjogY2MuTm9kZSxcbiAgICAgICAgcmV3YXJkTm9kZTogY2MuTm9kZSxcbiAgICAgICAgd3hOb2RlOiBjYy5Ob2RlXG4gICAgfSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkNsb3NlQ0IgPSBlO1xuICAgICAgICB0aGlzLnByZUF1dGggPSBjYy5wbGF5ZXIuYXV0aDtcbiAgICAgICAgdGhpcy51aWRMYWJlbC5zdHJpbmcgPSBjYy5wdnouY2xvdWQudWlkO1xuICAgICAgICB0aGlzLnJvb3QxLmFjdGl2ZSA9ICExO1xuICAgICAgICB0aGlzLnJvb3QyLmFjdGl2ZSA9ICExO1xuICAgICAgICB0aGlzLnJld2FyZE5vZGUuYWN0aXZlID0gMSAhPSBjYy5wbGF5ZXIuYXV0aDtcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcbiAgICAgICAgICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghMCA9PT0gZS5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJJbmZvXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnJvb3QyLmFjdGl2ZSA9ICEwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5yb290MS5hY3RpdmUgPSAhMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb290MS5hY3RpdmUgPSB0aGlzLnJld2FyZE5vZGUuYWN0aXZlO1xuICAgICAgICAgICAgdGhpcy5yb290Mi5hY3RpdmUgPSAhdGhpcy5yZXdhcmROb2RlLmFjdGl2ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMud3hOb2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5vbkNsb3NlQ0IpIHtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZUNCKDEgIT0gdGhpcy5wcmVBdXRoICYmIDEgPT0gY2MucGxheWVyLmF1dGgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkF1dGhvcml6ZVN1Y2M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yb290MS5hY3RpdmUgPSAhMTtcbiAgICAgICAgdGhpcy5yb290Mi5hY3RpdmUgPSAhMDtcbiAgICAgICAgdGhpcy5yZXdhcmROb2RlLmFjdGl2ZSA9ICExO1xuICAgICAgICBpZiAoMSAhPSBjYy5wbGF5ZXIuYXV0aCkge1xuICAgICAgICAgICAgY2MucGxheWVyLmF1dGggPSAxO1xuICAgICAgICAgICAgdmFyIGUgPSBjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumSu+efs1wiXTtcbiAgICAgICAgICAgIGNjLnB2ei5QbGF5ZXJEYXRhLmNoYW5nZUl0ZW1OdW0oZSwgMTAwKTtcbiAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5zaG93RWZmZWN0Rmx5KGUsIGNjLk1haW5Db250cm9sLmdldEl0ZW1FZmZlY3RQb3MoZSksIGNjLm1hdGgucmFuZG9tUmFuZ2VJbnQoMSwgNCkpO1xuICAgICAgICAgICAgY2MuTWFpbkNvbnRyb2wudXBkYXRlSXRlbUluZm8oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25XeEF1dGhvcml6ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyhcInh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZiAoZS51c2VySW5mbyAmJiBlLnVzZXJJbmZvLmF2YXRhclVybCAmJiBlLnVzZXJJbmZvLm5pY2tOYW1lKSB7XG4gICAgICAgICAgICBjYy5wdnouY2xvdWQuc2V0QXZhdGFyKGUudXNlckluZm8ubmlja05hbWUsIGUudXNlckluZm8uYXZhdGFyVXJsLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHQub25BdXRob3JpemVTdWNjKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnNob3dUb2FzdChcIuaOiOadg+Wksei0pSznqI3lkI7lho3or5VcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdfQ==