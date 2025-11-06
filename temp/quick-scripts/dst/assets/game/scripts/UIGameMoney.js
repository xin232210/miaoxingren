
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/UIGameMoney.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'ea057X0oDxGZKg8kPGNFr9r', 'UIGameMoney');
// game/scripts/UIGameMoney.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    addCount: 30,
    countTipNode: cc.Node,
    countLabel: cc.Label
  },
  initBy: function initBy(t) {
    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["阳光"]);
    this.countTipNode.active = 2 == cc.pvz.runtimeData.mode;

    if (this.countTipNode.active) {
      this.countLabel.string = cc.pvz.runtimeData.buyCoinCount;
    }

    this.cb = t;
  },
  onClickClose: function onClickClose() {
    cc.popupManager.removePopup(this);
  },
  onClickAd: function onClickAd() {
    var t = this;
    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["阳光"], function (e) {
      if (e) {
        if (2 == cc.pvz.runtimeData.mode) {
          cc.pvz.runtimeData.buyCoinCount--;
        }

        cc.pvz.runtimeData.addMoney(t.addCount);

        if (t.cb) {
          t.cb();
        }

        cc.popupManager.removePopup(t);
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvVUlHYW1lTW9uZXkuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJhZGRDb3VudCIsImNvdW50VGlwTm9kZSIsIk5vZGUiLCJjb3VudExhYmVsIiwiTGFiZWwiLCJpbml0QnkiLCJ0IiwicHZ6IiwiVEFVdGlscyIsInRyYWNrQWRVSVNob3ciLCJHYW1lQ29uZmlnIiwiQWRUeXBlIiwiYWN0aXZlIiwicnVudGltZURhdGEiLCJtb2RlIiwic3RyaW5nIiwiYnV5Q29pbkNvdW50IiwiY2IiLCJvbkNsaWNrQ2xvc2UiLCJwb3B1cE1hbmFnZXIiLCJyZW1vdmVQb3B1cCIsIm9uQ2xpY2tBZCIsIkFkVXRpbHMiLCJzaG93QWRSZXdhcmRWaWRlbyIsImUiLCJhZGRNb25leSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFFBQVEsRUFBRSxFQURGO0lBRVJDLFlBQVksRUFBRUwsRUFBRSxDQUFDTSxJQUZUO0lBR1JDLFVBQVUsRUFBRVAsRUFBRSxDQUFDUTtFQUhQLENBRlA7RUFPTEMsTUFBTSxFQUFFLGdCQUFVQyxDQUFWLEVBQWE7SUFDakJWLEVBQUUsQ0FBQ1csR0FBSCxDQUFPQyxPQUFQLENBQWVDLGFBQWYsQ0FBNkJiLEVBQUUsQ0FBQ1csR0FBSCxDQUFPRyxVQUFQLENBQWtCQyxNQUFsQixDQUF5QixJQUF6QixDQUE3QjtJQUNBLEtBQUtWLFlBQUwsQ0FBa0JXLE1BQWxCLEdBQTJCLEtBQUtoQixFQUFFLENBQUNXLEdBQUgsQ0FBT00sV0FBUCxDQUFtQkMsSUFBbkQ7O0lBQ0EsSUFBSSxLQUFLYixZQUFMLENBQWtCVyxNQUF0QixFQUE4QjtNQUMxQixLQUFLVCxVQUFMLENBQWdCWSxNQUFoQixHQUF5Qm5CLEVBQUUsQ0FBQ1csR0FBSCxDQUFPTSxXQUFQLENBQW1CRyxZQUE1QztJQUNIOztJQUNELEtBQUtDLEVBQUwsR0FBVVgsQ0FBVjtFQUNILENBZEk7RUFlTFksWUFBWSxFQUFFLHdCQUFZO0lBQ3RCdEIsRUFBRSxDQUFDdUIsWUFBSCxDQUFnQkMsV0FBaEIsQ0FBNEIsSUFBNUI7RUFDSCxDQWpCSTtFQWtCTEMsU0FBUyxFQUFFLHFCQUFZO0lBQ25CLElBQUlmLENBQUMsR0FBRyxJQUFSO0lBQ0FWLEVBQUUsQ0FBQ1csR0FBSCxDQUFPZSxPQUFQLENBQWVDLGlCQUFmLENBQWlDM0IsRUFBRSxDQUFDVyxHQUFILENBQU9HLFVBQVAsQ0FBa0JDLE1BQWxCLENBQXlCLElBQXpCLENBQWpDLEVBQWlFLFVBQVVhLENBQVYsRUFBYTtNQUMxRSxJQUFJQSxDQUFKLEVBQU87UUFDSCxJQUFJLEtBQUs1QixFQUFFLENBQUNXLEdBQUgsQ0FBT00sV0FBUCxDQUFtQkMsSUFBNUIsRUFBa0M7VUFDOUJsQixFQUFFLENBQUNXLEdBQUgsQ0FBT00sV0FBUCxDQUFtQkcsWUFBbkI7UUFDSDs7UUFDRHBCLEVBQUUsQ0FBQ1csR0FBSCxDQUFPTSxXQUFQLENBQW1CWSxRQUFuQixDQUE0Qm5CLENBQUMsQ0FBQ04sUUFBOUI7O1FBQ0EsSUFBSU0sQ0FBQyxDQUFDVyxFQUFOLEVBQVU7VUFDTlgsQ0FBQyxDQUFDVyxFQUFGO1FBQ0g7O1FBQ0RyQixFQUFFLENBQUN1QixZQUFILENBQWdCQyxXQUFoQixDQUE0QmQsQ0FBNUI7TUFDSDtJQUNKLENBWEQ7RUFZSDtBQWhDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYWRkQ291bnQ6IDMwLFxuICAgICAgICBjb3VudFRpcE5vZGU6IGNjLk5vZGUsXG4gICAgICAgIGNvdW50TGFiZWw6IGNjLkxhYmVsXG4gICAgfSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrQWRVSVNob3coY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi6Ziz5YWJXCJdKTtcbiAgICAgICAgdGhpcy5jb3VudFRpcE5vZGUuYWN0aXZlID0gMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZTtcbiAgICAgICAgaWYgKHRoaXMuY291bnRUaXBOb2RlLmFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5jb3VudExhYmVsLnN0cmluZyA9IGNjLnB2ei5ydW50aW1lRGF0YS5idXlDb2luQ291bnQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYiA9IHQ7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH0sXG4gICAgb25DbGlja0FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgY2MucHZ6LkFkVXRpbHMuc2hvd0FkUmV3YXJkVmlkZW8oY2MucHZ6LkdhbWVDb25maWcuQWRUeXBlW1wi6Ziz5YWJXCJdLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoMiA9PSBjYy5wdnoucnVudGltZURhdGEubW9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5wdnoucnVudGltZURhdGEuYnV5Q29pbkNvdW50LS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLnB2ei5ydW50aW1lRGF0YS5hZGRNb25leSh0LmFkZENvdW50KTtcbiAgICAgICAgICAgICAgICBpZiAodC5jYikge1xuICAgICAgICAgICAgICAgICAgICB0LmNiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iXX0=