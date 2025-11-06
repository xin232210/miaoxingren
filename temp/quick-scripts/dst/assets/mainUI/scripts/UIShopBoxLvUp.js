
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIShopBoxLvUp.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b99570aZpZAmqdpHWmdafyF', 'UIShopBoxLvUp');
// mainUI/scripts/UIShopBoxLvUp.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lvLabel: cc.Label,
    boxPanel1: cc.Node,
    boxPanel2: cc.Node,
    boxLabels1: [cc.Label],
    boxLabels2: [cc.Label],
    closeBtn: cc.Node
  },
  initBy: function initBy(e, t) {
    var i = this;
    this.closeBtn.active = !1;
    this.boxLv = e;
    this.shopBoxJson = t;
    this.lvLabel.string = "" + this.boxLv;
    this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
    this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
    this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
    this.scheduleOnce(function () {
      cc.pvz.utils.fadeInBtn(i.closeBtn);
    }, 1);
  },
  onBoxRewardShow: function onBoxRewardShow(e, t, i) {
    var o = this.boxLvJson["show" + e];
    var a = Math.floor(o.length / 2);
    var c = 0;

    for (var s = 0; s < t.childrenCount; s++) {
      if (s < a) {
        t.children[s].active = !0, i[s].string = "+" + o[c + 1];
      } else {
        t.children[s].active = !1;
      }

      c += 2;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVNob3BCb3hMdlVwLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibHZMYWJlbCIsIkxhYmVsIiwiYm94UGFuZWwxIiwiTm9kZSIsImJveFBhbmVsMiIsImJveExhYmVsczEiLCJib3hMYWJlbHMyIiwiY2xvc2VCdG4iLCJpbml0QnkiLCJlIiwidCIsImkiLCJhY3RpdmUiLCJib3hMdiIsInNob3BCb3hKc29uIiwic3RyaW5nIiwiYm94THZKc29uIiwib25Cb3hSZXdhcmRTaG93Iiwic2NoZWR1bGVPbmNlIiwicHZ6IiwidXRpbHMiLCJmYWRlSW5CdG4iLCJvIiwiYSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsImMiLCJzIiwiY2hpbGRyZW5Db3VudCIsImNoaWxkcmVuIiwib25DbG9zZVVJIiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlUG9wdXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxPQUFPLEVBQUVKLEVBQUUsQ0FBQ0ssS0FESjtJQUVSQyxTQUFTLEVBQUVOLEVBQUUsQ0FBQ08sSUFGTjtJQUdSQyxTQUFTLEVBQUVSLEVBQUUsQ0FBQ08sSUFITjtJQUlSRSxVQUFVLEVBQUUsQ0FBQ1QsRUFBRSxDQUFDSyxLQUFKLENBSko7SUFLUkssVUFBVSxFQUFFLENBQUNWLEVBQUUsQ0FBQ0ssS0FBSixDQUxKO0lBTVJNLFFBQVEsRUFBRVgsRUFBRSxDQUFDTztFQU5MLENBRlA7RUFVTEssTUFBTSxFQUFFLGdCQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7SUFDcEIsSUFBSUMsQ0FBQyxHQUFHLElBQVI7SUFDQSxLQUFLSixRQUFMLENBQWNLLE1BQWQsR0FBdUIsQ0FBQyxDQUF4QjtJQUNBLEtBQUtDLEtBQUwsR0FBYUosQ0FBYjtJQUNBLEtBQUtLLFdBQUwsR0FBbUJKLENBQW5CO0lBQ0EsS0FBS1YsT0FBTCxDQUFhZSxNQUFiLEdBQXNCLEtBQUssS0FBS0YsS0FBaEM7SUFDQSxLQUFLRyxTQUFMLEdBQWlCLEtBQUtGLFdBQUwsQ0FBaUIsS0FBS0QsS0FBTCxHQUFhLENBQTlCLENBQWpCO0lBQ0EsS0FBS0ksZUFBTCxDQUFxQixDQUFyQixFQUF3QixLQUFLZixTQUE3QixFQUF3QyxLQUFLRyxVQUE3QztJQUNBLEtBQUtZLGVBQUwsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBS2IsU0FBN0IsRUFBd0MsS0FBS0UsVUFBN0M7SUFDQSxLQUFLWSxZQUFMLENBQWtCLFlBQVk7TUFDMUJ0QixFQUFFLENBQUN1QixHQUFILENBQU9DLEtBQVAsQ0FBYUMsU0FBYixDQUF1QlYsQ0FBQyxDQUFDSixRQUF6QjtJQUNILENBRkQsRUFFRyxDQUZIO0VBR0gsQ0F0Qkk7RUF1QkxVLGVBQWUsRUFBRSx5QkFBVVIsQ0FBVixFQUFhQyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQjtJQUNoQyxJQUFJVyxDQUFDLEdBQUcsS0FBS04sU0FBTCxDQUFlLFNBQVNQLENBQXhCLENBQVI7SUFDQSxJQUFJYyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxDQUFDLENBQUNJLE1BQUYsR0FBVyxDQUF0QixDQUFSO0lBQ0EsSUFBSUMsQ0FBQyxHQUFHLENBQVI7O0lBQ0EsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEIsQ0FBQyxDQUFDbUIsYUFBdEIsRUFBcUNELENBQUMsRUFBdEMsRUFBMEM7TUFDdEMsSUFBSUEsQ0FBQyxHQUFHTCxDQUFSLEVBQVc7UUFDTmIsQ0FBQyxDQUFDb0IsUUFBRixDQUFXRixDQUFYLEVBQWNoQixNQUFkLEdBQXVCLENBQUMsQ0FBekIsRUFBOEJELENBQUMsQ0FBQ2lCLENBQUQsQ0FBRCxDQUFLYixNQUFMLEdBQWMsTUFBTU8sQ0FBQyxDQUFDSyxDQUFDLEdBQUcsQ0FBTCxDQUFuRDtNQUNILENBRkQsTUFFTztRQUNIakIsQ0FBQyxDQUFDb0IsUUFBRixDQUFXRixDQUFYLEVBQWNoQixNQUFkLEdBQXVCLENBQUMsQ0FBeEI7TUFDSDs7TUFDRGUsQ0FBQyxJQUFJLENBQUw7SUFDSDtFQUNKLENBbkNJO0VBb0NMSSxTQUFTLEVBQUUscUJBQVk7SUFDbkJuQyxFQUFFLENBQUNvQyxZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtFQUNIO0FBdENJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsdkxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgYm94UGFuZWwxOiBjYy5Ob2RlLFxuICAgICAgICBib3hQYW5lbDI6IGNjLk5vZGUsXG4gICAgICAgIGJveExhYmVsczE6IFtjYy5MYWJlbF0sXG4gICAgICAgIGJveExhYmVsczI6IFtjYy5MYWJlbF0sXG4gICAgICAgIGNsb3NlQnRuOiBjYy5Ob2RlXG4gICAgfSxcbiAgICBpbml0Qnk6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIHZhciBpID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9zZUJ0bi5hY3RpdmUgPSAhMTtcbiAgICAgICAgdGhpcy5ib3hMdiA9IGU7XG4gICAgICAgIHRoaXMuc2hvcEJveEpzb24gPSB0O1xuICAgICAgICB0aGlzLmx2TGFiZWwuc3RyaW5nID0gXCJcIiArIHRoaXMuYm94THY7XG4gICAgICAgIHRoaXMuYm94THZKc29uID0gdGhpcy5zaG9wQm94SnNvblt0aGlzLmJveEx2IC0gMV07XG4gICAgICAgIHRoaXMub25Cb3hSZXdhcmRTaG93KDEsIHRoaXMuYm94UGFuZWwxLCB0aGlzLmJveExhYmVsczEpO1xuICAgICAgICB0aGlzLm9uQm94UmV3YXJkU2hvdygyLCB0aGlzLmJveFBhbmVsMiwgdGhpcy5ib3hMYWJlbHMyKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2MucHZ6LnV0aWxzLmZhZGVJbkJ0bihpLmNsb3NlQnRuKTtcbiAgICAgICAgfSwgMSk7XG4gICAgfSxcbiAgICBvbkJveFJld2FyZFNob3c6IGZ1bmN0aW9uIChlLCB0LCBpKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5ib3hMdkpzb25bXCJzaG93XCIgKyBlXTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLmZsb29yKG8ubGVuZ3RoIC8gMik7XG4gICAgICAgIHZhciBjID0gMDtcbiAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCB0LmNoaWxkcmVuQ291bnQ7IHMrKykge1xuICAgICAgICAgICAgaWYgKHMgPCBhKSB7XG4gICAgICAgICAgICAgICAgKHQuY2hpbGRyZW5bc10uYWN0aXZlID0gITApLCAoaVtzXS5zdHJpbmcgPSBcIitcIiArIG9bYyArIDFdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdC5jaGlsZHJlbltzXS5hY3RpdmUgPSAhMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgKz0gMjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZVVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBvcHVwTWFuYWdlci5yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICB9XG59KTtcbiJdfQ==