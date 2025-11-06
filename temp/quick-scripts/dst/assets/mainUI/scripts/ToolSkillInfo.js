
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/ToolSkillInfo.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8dc36ug6ZtBYKCF9kVMEUzb', 'ToolSkillInfo');
// mainUI/scripts/ToolSkillInfo.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    toolSkillJsonFile: cc.JsonAsset,
    lockPanel: cc.Node,
    iconSprite: cc.Sprite,
    qualitySprite: cc.Sprite,
    descLabel: cc.RichText
  },
  onLoad: function onLoad() {
    this.descLabel.enabled = !1;
  },
  initSkillInfo: function initSkillInfo(e, t, i, o) {
    var a = Math.floor(100 * e + t);
    var c = i;
    var s = this.toolSkillJsonFile.json.find(function (e) {
      return e.id == a;
    });
    var n = s.lock > c || o;
    this.lockPanel.active = n;

    if (n) {
      this.descLabel.string = s.lockdesc;
    } else {
      this.descLabel.string = s.desc;
    }

    this.descLabel.enabled = !0;
    cc.JsonControl.getQualityBgIcon(this.qualitySprite, s.quality);
    cc.JsonControl.getSkillIcon(this.iconSprite, s.icon);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9Ub29sU2tpbGxJbmZvLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwidG9vbFNraWxsSnNvbkZpbGUiLCJKc29uQXNzZXQiLCJsb2NrUGFuZWwiLCJOb2RlIiwiaWNvblNwcml0ZSIsIlNwcml0ZSIsInF1YWxpdHlTcHJpdGUiLCJkZXNjTGFiZWwiLCJSaWNoVGV4dCIsIm9uTG9hZCIsImVuYWJsZWQiLCJpbml0U2tpbGxJbmZvIiwiZSIsInQiLCJpIiwibyIsImEiLCJNYXRoIiwiZmxvb3IiLCJjIiwicyIsImpzb24iLCJmaW5kIiwiaWQiLCJuIiwibG9jayIsImFjdGl2ZSIsInN0cmluZyIsImxvY2tkZXNjIiwiZGVzYyIsIkpzb25Db250cm9sIiwiZ2V0UXVhbGl0eUJnSWNvbiIsInF1YWxpdHkiLCJnZXRTa2lsbEljb24iLCJpY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsaUJBQWlCLEVBQUVKLEVBQUUsQ0FBQ0ssU0FEZDtJQUVSQyxTQUFTLEVBQUVOLEVBQUUsQ0FBQ08sSUFGTjtJQUdSQyxVQUFVLEVBQUVSLEVBQUUsQ0FBQ1MsTUFIUDtJQUlSQyxhQUFhLEVBQUVWLEVBQUUsQ0FBQ1MsTUFKVjtJQUtSRSxTQUFTLEVBQUVYLEVBQUUsQ0FBQ1k7RUFMTixDQUZQO0VBU0xDLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixLQUFLRixTQUFMLENBQWVHLE9BQWYsR0FBeUIsQ0FBQyxDQUExQjtFQUNILENBWEk7RUFZTEMsYUFBYSxFQUFFLHVCQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQjtJQUNqQyxJQUFJQyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLE1BQU1OLENBQU4sR0FBVUMsQ0FBckIsQ0FBUjtJQUNBLElBQUlNLENBQUMsR0FBR0wsQ0FBUjtJQUNBLElBQUlNLENBQUMsR0FBRyxLQUFLcEIsaUJBQUwsQ0FBdUJxQixJQUF2QixDQUE0QkMsSUFBNUIsQ0FBaUMsVUFBVVYsQ0FBVixFQUFhO01BQ2xELE9BQU9BLENBQUMsQ0FBQ1csRUFBRixJQUFRUCxDQUFmO0lBQ0gsQ0FGTyxDQUFSO0lBR0EsSUFBSVEsQ0FBQyxHQUFHSixDQUFDLENBQUNLLElBQUYsR0FBU04sQ0FBVCxJQUFjSixDQUF0QjtJQUNBLEtBQUtiLFNBQUwsQ0FBZXdCLE1BQWYsR0FBd0JGLENBQXhCOztJQUNBLElBQUlBLENBQUosRUFBTztNQUNILEtBQUtqQixTQUFMLENBQWVvQixNQUFmLEdBQXdCUCxDQUFDLENBQUNRLFFBQTFCO0lBQ0gsQ0FGRCxNQUVPO01BQ0gsS0FBS3JCLFNBQUwsQ0FBZW9CLE1BQWYsR0FBd0JQLENBQUMsQ0FBQ1MsSUFBMUI7SUFDSDs7SUFDRCxLQUFLdEIsU0FBTCxDQUFlRyxPQUFmLEdBQXlCLENBQUMsQ0FBMUI7SUFDQWQsRUFBRSxDQUFDa0MsV0FBSCxDQUFlQyxnQkFBZixDQUFnQyxLQUFLekIsYUFBckMsRUFBb0RjLENBQUMsQ0FBQ1ksT0FBdEQ7SUFDQXBDLEVBQUUsQ0FBQ2tDLFdBQUgsQ0FBZUcsWUFBZixDQUE0QixLQUFLN0IsVUFBakMsRUFBNkNnQixDQUFDLENBQUNjLElBQS9DO0VBQ0g7QUE1QkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRvb2xTa2lsbEpzb25GaWxlOiBjYy5Kc29uQXNzZXQsXG4gICAgICAgIGxvY2tQYW5lbDogY2MuTm9kZSxcbiAgICAgICAgaWNvblNwcml0ZTogY2MuU3ByaXRlLFxuICAgICAgICBxdWFsaXR5U3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgICAgIGRlc2NMYWJlbDogY2MuUmljaFRleHRcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRlc2NMYWJlbC5lbmFibGVkID0gITE7XG4gICAgfSxcbiAgICBpbml0U2tpbGxJbmZvOiBmdW5jdGlvbiAoZSwgdCwgaSwgbykge1xuICAgICAgICB2YXIgYSA9IE1hdGguZmxvb3IoMTAwICogZSArIHQpO1xuICAgICAgICB2YXIgYyA9IGk7XG4gICAgICAgIHZhciBzID0gdGhpcy50b29sU2tpbGxKc29uRmlsZS5qc29uLmZpbmQoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmlkID09IGE7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbiA9IHMubG9jayA+IGMgfHwgbztcbiAgICAgICAgdGhpcy5sb2NrUGFuZWwuYWN0aXZlID0gbjtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVzY0xhYmVsLnN0cmluZyA9IHMubG9ja2Rlc2M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlc2NMYWJlbC5zdHJpbmcgPSBzLmRlc2M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXNjTGFiZWwuZW5hYmxlZCA9ICEwO1xuICAgICAgICBjYy5Kc29uQ29udHJvbC5nZXRRdWFsaXR5QmdJY29uKHRoaXMucXVhbGl0eVNwcml0ZSwgcy5xdWFsaXR5KTtcbiAgICAgICAgY2MuSnNvbkNvbnRyb2wuZ2V0U2tpbGxJY29uKHRoaXMuaWNvblNwcml0ZSwgcy5pY29uKTtcbiAgICB9XG59KTtcbiJdfQ==