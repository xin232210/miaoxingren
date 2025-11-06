
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UISpeed.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '466f1rHpOpOMrU6iIInQpJP', 'UISpeed');
// game/scripts/UISpeed.js

"use strict";

cc.Class({
  "extends": cc.Component,
  initBy: function initBy(t) {
    this.scene = t;
    this.isLookAd = !1;
    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["双倍速度"]);
  },
  onClickShare: function onClickShare() {
    var t = this;

    if (this.isLookAd) {//
    } else {
      this.isLookAd = !0;
      cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["双倍速度"], function (e) {
        t.onAdClose(e);
      });
    }
  },
  onAdClose: function onAdClose(t) {
    this.isLookAd = !1;

    if (t) {
      cc.popupManager.removePopup(this);
      cc.pvz.runtimeData.openSpeed = !0;

      if (1 == cc.pvz.runtimeData.speed) {
        cc.pvz.runtimeData.speed = 2;
      } else {
        cc.pvz.runtimeData.speed = 1;
      }

      this.scene.updateSpeed();
    }
  },
  onClickClose: function onClickClose() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlTcGVlZC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwiaW5pdEJ5IiwidCIsInNjZW5lIiwiaXNMb29rQWQiLCJwdnoiLCJUQVV0aWxzIiwidHJhY2tBZFVJU2hvdyIsIkdhbWVDb25maWciLCJBZFR5cGUiLCJvbkNsaWNrU2hhcmUiLCJBZFV0aWxzIiwic2hvd0FkUmV3YXJkVmlkZW8iLCJlIiwib25BZENsb3NlIiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlUG9wdXAiLCJydW50aW1lRGF0YSIsIm9wZW5TcGVlZCIsInNwZWVkIiwidXBkYXRlU3BlZWQiLCJvbkNsaWNrQ2xvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFhO0lBQ2pCLEtBQUtDLEtBQUwsR0FBYUQsQ0FBYjtJQUNBLEtBQUtFLFFBQUwsR0FBZ0IsQ0FBQyxDQUFqQjtJQUNBTixFQUFFLENBQUNPLEdBQUgsQ0FBT0MsT0FBUCxDQUFlQyxhQUFmLENBQTZCVCxFQUFFLENBQUNPLEdBQUgsQ0FBT0csVUFBUCxDQUFrQkMsTUFBbEIsQ0FBeUIsTUFBekIsQ0FBN0I7RUFDSCxDQU5JO0VBT0xDLFlBQVksRUFBRSx3QkFBWTtJQUN0QixJQUFJUixDQUFDLEdBQUcsSUFBUjs7SUFDQSxJQUFJLEtBQUtFLFFBQVQsRUFBbUIsQ0FDZjtJQUNILENBRkQsTUFFTztNQUNILEtBQUtBLFFBQUwsR0FBZ0IsQ0FBQyxDQUFqQjtNQUNBTixFQUFFLENBQUNPLEdBQUgsQ0FBT00sT0FBUCxDQUFlQyxpQkFBZixDQUFpQ2QsRUFBRSxDQUFDTyxHQUFILENBQU9HLFVBQVAsQ0FBa0JDLE1BQWxCLENBQXlCLE1BQXpCLENBQWpDLEVBQW1FLFVBQVVJLENBQVYsRUFBYTtRQUM1RVgsQ0FBQyxDQUFDWSxTQUFGLENBQVlELENBQVo7TUFDSCxDQUZEO0lBR0g7RUFDSixDQWpCSTtFQWtCTEMsU0FBUyxFQUFFLG1CQUFVWixDQUFWLEVBQWE7SUFDcEIsS0FBS0UsUUFBTCxHQUFnQixDQUFDLENBQWpCOztJQUNBLElBQUlGLENBQUosRUFBTztNQUNISixFQUFFLENBQUNpQixZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtNQUNBbEIsRUFBRSxDQUFDTyxHQUFILENBQU9ZLFdBQVAsQ0FBbUJDLFNBQW5CLEdBQStCLENBQUMsQ0FBaEM7O01BQ0EsSUFBSSxLQUFLcEIsRUFBRSxDQUFDTyxHQUFILENBQU9ZLFdBQVAsQ0FBbUJFLEtBQTVCLEVBQW1DO1FBQy9CckIsRUFBRSxDQUFDTyxHQUFILENBQU9ZLFdBQVAsQ0FBbUJFLEtBQW5CLEdBQTJCLENBQTNCO01BQ0gsQ0FGRCxNQUVPO1FBQ0hyQixFQUFFLENBQUNPLEdBQUgsQ0FBT1ksV0FBUCxDQUFtQkUsS0FBbkIsR0FBMkIsQ0FBM0I7TUFDSDs7TUFDRCxLQUFLaEIsS0FBTCxDQUFXaUIsV0FBWDtJQUNIO0VBQ0osQ0E5Qkk7RUErQkxDLFlBQVksRUFBRSx3QkFBWTtJQUN0QnZCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0g7QUFqQ0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSB0O1xuICAgICAgICB0aGlzLmlzTG9va0FkID0gITE7XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrQWRVSVNob3coY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5Y+M5YCN6YCf5bqmXCJdKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTaGFyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlzTG9va0FkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc0xvb2tBZCA9ICEwO1xuICAgICAgICAgICAgY2MucHZ6LkFkVXRpbHMuc2hvd0FkUmV3YXJkVmlkZW8oY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi5Y+M5YCN6YCf5bqmXCJdLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHQub25BZENsb3NlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQWRDbG9zZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5pc0xvb2tBZCA9ICExO1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLm9wZW5TcGVlZCA9ICEwO1xuICAgICAgICAgICAgaWYgKDEgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkKSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLnNwZWVkID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NlbmUudXBkYXRlU3BlZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9XG59KTtcbiJdfQ==