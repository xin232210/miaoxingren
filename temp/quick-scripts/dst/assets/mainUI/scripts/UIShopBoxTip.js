
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIShopBoxTip.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '3183bAXT1JNroKcDHSBCUvR', 'UIShopBoxTip');
// mainUI/scripts/UIShopBoxTip.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    leftBtn: cc.Node,
    rightBtn: cc.Node,
    leftClose: cc.Node,
    rightClose: cc.Node,
    lvLabel: cc.Label,
    boxPanel1: cc.Node,
    boxPanel2: cc.Node,
    boxLabels1: [cc.Label],
    boxLabels2: [cc.Label]
  },
  initBy: function initBy(e, t) {
    this.boxLv = e;
    this.shopBoxJson = t;
    this.MaxBoxLv = this.shopBoxJson.length;
    this.lvLabel.string = "Lv." + this.boxLv;
    this.leftClose.active = 1 == this.boxLv;
    this.rightClose.active = this.boxLv == this.MaxBoxLv;
    this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
    this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
    this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
  },
  onClickPage: function onClickPage(e, t) {
    if (parseInt(t) < 0) {
      if (1 == this.boxLv) {
        return;
      }

      this.boxLv--;
    } else {
      if (this.boxLv == this.MaxBoxLv) {
        return;
      }

      this.boxLv++;
    }

    this.lvLabel.string = "Lv." + this.boxLv;
    this.leftClose.active = 1 == this.boxLv;
    this.rightClose.active = this.boxLv == this.MaxBoxLv;
    this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
    this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
    this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSVNob3BCb3hUaXAuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsZWZ0QnRuIiwiTm9kZSIsInJpZ2h0QnRuIiwibGVmdENsb3NlIiwicmlnaHRDbG9zZSIsImx2TGFiZWwiLCJMYWJlbCIsImJveFBhbmVsMSIsImJveFBhbmVsMiIsImJveExhYmVsczEiLCJib3hMYWJlbHMyIiwiaW5pdEJ5IiwiZSIsInQiLCJib3hMdiIsInNob3BCb3hKc29uIiwiTWF4Qm94THYiLCJsZW5ndGgiLCJzdHJpbmciLCJhY3RpdmUiLCJib3hMdkpzb24iLCJvbkJveFJld2FyZFNob3ciLCJvbkNsaWNrUGFnZSIsInBhcnNlSW50IiwiaSIsIm8iLCJhIiwiTWF0aCIsImZsb29yIiwiYyIsInMiLCJjaGlsZHJlbkNvdW50IiwiY2hpbGRyZW4iLCJvbkNsb3NlVUkiLCJwb3B1cE1hbmFnZXIiLCJyZW1vdmVQb3B1cCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLE9BQU8sRUFBRUosRUFBRSxDQUFDSyxJQURKO0lBRVJDLFFBQVEsRUFBRU4sRUFBRSxDQUFDSyxJQUZMO0lBR1JFLFNBQVMsRUFBRVAsRUFBRSxDQUFDSyxJQUhOO0lBSVJHLFVBQVUsRUFBRVIsRUFBRSxDQUFDSyxJQUpQO0lBS1JJLE9BQU8sRUFBRVQsRUFBRSxDQUFDVSxLQUxKO0lBTVJDLFNBQVMsRUFBRVgsRUFBRSxDQUFDSyxJQU5OO0lBT1JPLFNBQVMsRUFBRVosRUFBRSxDQUFDSyxJQVBOO0lBUVJRLFVBQVUsRUFBRSxDQUFDYixFQUFFLENBQUNVLEtBQUosQ0FSSjtJQVNSSSxVQUFVLEVBQUUsQ0FBQ2QsRUFBRSxDQUFDVSxLQUFKO0VBVEosQ0FGUDtFQWFMSyxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtJQUNwQixLQUFLQyxLQUFMLEdBQWFGLENBQWI7SUFDQSxLQUFLRyxXQUFMLEdBQW1CRixDQUFuQjtJQUNBLEtBQUtHLFFBQUwsR0FBZ0IsS0FBS0QsV0FBTCxDQUFpQkUsTUFBakM7SUFDQSxLQUFLWixPQUFMLENBQWFhLE1BQWIsR0FBc0IsUUFBUSxLQUFLSixLQUFuQztJQUNBLEtBQUtYLFNBQUwsQ0FBZWdCLE1BQWYsR0FBd0IsS0FBSyxLQUFLTCxLQUFsQztJQUNBLEtBQUtWLFVBQUwsQ0FBZ0JlLE1BQWhCLEdBQXlCLEtBQUtMLEtBQUwsSUFBYyxLQUFLRSxRQUE1QztJQUNBLEtBQUtJLFNBQUwsR0FBaUIsS0FBS0wsV0FBTCxDQUFpQixLQUFLRCxLQUFMLEdBQWEsQ0FBOUIsQ0FBakI7SUFDQSxLQUFLTyxlQUFMLENBQXFCLENBQXJCLEVBQXdCLEtBQUtkLFNBQTdCLEVBQXdDLEtBQUtFLFVBQTdDO0lBQ0EsS0FBS1ksZUFBTCxDQUFxQixDQUFyQixFQUF3QixLQUFLYixTQUE3QixFQUF3QyxLQUFLRSxVQUE3QztFQUNILENBdkJJO0VBd0JMWSxXQUFXLEVBQUUscUJBQVVWLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtJQUN6QixJQUFJVSxRQUFRLENBQUNWLENBQUQsQ0FBUixHQUFjLENBQWxCLEVBQXFCO01BQ2pCLElBQUksS0FBSyxLQUFLQyxLQUFkLEVBQXFCO1FBQ2pCO01BQ0g7O01BQ0QsS0FBS0EsS0FBTDtJQUNILENBTEQsTUFLTztNQUNILElBQUksS0FBS0EsS0FBTCxJQUFjLEtBQUtFLFFBQXZCLEVBQWlDO1FBQzdCO01BQ0g7O01BQ0QsS0FBS0YsS0FBTDtJQUNIOztJQUNELEtBQUtULE9BQUwsQ0FBYWEsTUFBYixHQUFzQixRQUFRLEtBQUtKLEtBQW5DO0lBQ0EsS0FBS1gsU0FBTCxDQUFlZ0IsTUFBZixHQUF3QixLQUFLLEtBQUtMLEtBQWxDO0lBQ0EsS0FBS1YsVUFBTCxDQUFnQmUsTUFBaEIsR0FBeUIsS0FBS0wsS0FBTCxJQUFjLEtBQUtFLFFBQTVDO0lBQ0EsS0FBS0ksU0FBTCxHQUFpQixLQUFLTCxXQUFMLENBQWlCLEtBQUtELEtBQUwsR0FBYSxDQUE5QixDQUFqQjtJQUNBLEtBQUtPLGVBQUwsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBS2QsU0FBN0IsRUFBd0MsS0FBS0UsVUFBN0M7SUFDQSxLQUFLWSxlQUFMLENBQXFCLENBQXJCLEVBQXdCLEtBQUtiLFNBQTdCLEVBQXdDLEtBQUtFLFVBQTdDO0VBQ0gsQ0ExQ0k7RUEyQ0xXLGVBQWUsRUFBRSx5QkFBVVQsQ0FBVixFQUFhQyxDQUFiLEVBQWdCVyxDQUFoQixFQUFtQjtJQUNoQyxJQUFJQyxDQUFDLEdBQUcsS0FBS0wsU0FBTCxDQUFlLFNBQVNSLENBQXhCLENBQVI7SUFDQSxJQUFJYyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxDQUFDLENBQUNSLE1BQUYsR0FBVyxDQUF0QixDQUFSO0lBQ0EsSUFBSVksQ0FBQyxHQUFHLENBQVI7O0lBQ0EsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHakIsQ0FBQyxDQUFDa0IsYUFBdEIsRUFBcUNELENBQUMsRUFBdEMsRUFBMEM7TUFDdEMsSUFBSUEsQ0FBQyxHQUFHSixDQUFSLEVBQVc7UUFDTmIsQ0FBQyxDQUFDbUIsUUFBRixDQUFXRixDQUFYLEVBQWNYLE1BQWQsR0FBdUIsQ0FBQyxDQUF6QixFQUE4QkssQ0FBQyxDQUFDTSxDQUFELENBQUQsQ0FBS1osTUFBTCxHQUFjLE1BQU1PLENBQUMsQ0FBQ0ksQ0FBQyxHQUFHLENBQUwsQ0FBbkQ7TUFDSCxDQUZELE1BRU87UUFDSGhCLENBQUMsQ0FBQ21CLFFBQUYsQ0FBV0YsQ0FBWCxFQUFjWCxNQUFkLEdBQXVCLENBQUMsQ0FBeEI7TUFDSDs7TUFDRFUsQ0FBQyxJQUFJLENBQUw7SUFDSDtFQUNKLENBdkRJO0VBd0RMSSxTQUFTLEVBQUUscUJBQVk7SUFDbkJyQyxFQUFFLENBQUNzQyxZQUFILENBQWdCQyxXQUFoQixDQUE0QixJQUE1QjtFQUNIO0FBMURJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsZWZ0QnRuOiBjYy5Ob2RlLFxuICAgICAgICByaWdodEJ0bjogY2MuTm9kZSxcbiAgICAgICAgbGVmdENsb3NlOiBjYy5Ob2RlLFxuICAgICAgICByaWdodENsb3NlOiBjYy5Ob2RlLFxuICAgICAgICBsdkxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgYm94UGFuZWwxOiBjYy5Ob2RlLFxuICAgICAgICBib3hQYW5lbDI6IGNjLk5vZGUsXG4gICAgICAgIGJveExhYmVsczE6IFtjYy5MYWJlbF0sXG4gICAgICAgIGJveExhYmVsczI6IFtjYy5MYWJlbF1cbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgdGhpcy5ib3hMdiA9IGU7XG4gICAgICAgIHRoaXMuc2hvcEJveEpzb24gPSB0O1xuICAgICAgICB0aGlzLk1heEJveEx2ID0gdGhpcy5zaG9wQm94SnNvbi5sZW5ndGg7XG4gICAgICAgIHRoaXMubHZMYWJlbC5zdHJpbmcgPSBcIkx2LlwiICsgdGhpcy5ib3hMdjtcbiAgICAgICAgdGhpcy5sZWZ0Q2xvc2UuYWN0aXZlID0gMSA9PSB0aGlzLmJveEx2O1xuICAgICAgICB0aGlzLnJpZ2h0Q2xvc2UuYWN0aXZlID0gdGhpcy5ib3hMdiA9PSB0aGlzLk1heEJveEx2O1xuICAgICAgICB0aGlzLmJveEx2SnNvbiA9IHRoaXMuc2hvcEJveEpzb25bdGhpcy5ib3hMdiAtIDFdO1xuICAgICAgICB0aGlzLm9uQm94UmV3YXJkU2hvdygxLCB0aGlzLmJveFBhbmVsMSwgdGhpcy5ib3hMYWJlbHMxKTtcbiAgICAgICAgdGhpcy5vbkJveFJld2FyZFNob3coMiwgdGhpcy5ib3hQYW5lbDIsIHRoaXMuYm94TGFiZWxzMik7XG4gICAgfSxcbiAgICBvbkNsaWNrUGFnZTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgaWYgKHBhcnNlSW50KHQpIDwgMCkge1xuICAgICAgICAgICAgaWYgKDEgPT0gdGhpcy5ib3hMdikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYm94THYtLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJveEx2ID09IHRoaXMuTWF4Qm94THYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJveEx2Kys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sdkxhYmVsLnN0cmluZyA9IFwiTHYuXCIgKyB0aGlzLmJveEx2O1xuICAgICAgICB0aGlzLmxlZnRDbG9zZS5hY3RpdmUgPSAxID09IHRoaXMuYm94THY7XG4gICAgICAgIHRoaXMucmlnaHRDbG9zZS5hY3RpdmUgPSB0aGlzLmJveEx2ID09IHRoaXMuTWF4Qm94THY7XG4gICAgICAgIHRoaXMuYm94THZKc29uID0gdGhpcy5zaG9wQm94SnNvblt0aGlzLmJveEx2IC0gMV07XG4gICAgICAgIHRoaXMub25Cb3hSZXdhcmRTaG93KDEsIHRoaXMuYm94UGFuZWwxLCB0aGlzLmJveExhYmVsczEpO1xuICAgICAgICB0aGlzLm9uQm94UmV3YXJkU2hvdygyLCB0aGlzLmJveFBhbmVsMiwgdGhpcy5ib3hMYWJlbHMyKTtcbiAgICB9LFxuICAgIG9uQm94UmV3YXJkU2hvdzogZnVuY3Rpb24gKGUsIHQsIGkpIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmJveEx2SnNvbltcInNob3dcIiArIGVdO1xuICAgICAgICB2YXIgYSA9IE1hdGguZmxvb3Ioby5sZW5ndGggLyAyKTtcbiAgICAgICAgdmFyIGMgPSAwO1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHQuY2hpbGRyZW5Db3VudDsgcysrKSB7XG4gICAgICAgICAgICBpZiAocyA8IGEpIHtcbiAgICAgICAgICAgICAgICAodC5jaGlsZHJlbltzXS5hY3RpdmUgPSAhMCksIChpW3NdLnN0cmluZyA9IFwiK1wiICsgb1tjICsgMV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0LmNoaWxkcmVuW3NdLmFjdGl2ZSA9ICExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyArPSAyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH1cbn0pO1xuIl19