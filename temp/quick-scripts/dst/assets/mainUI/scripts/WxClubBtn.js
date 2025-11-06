
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/WxClubBtn.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a1950quHwdEz7m80YGWSKH3', 'WxClubBtn');
// mainUI/scripts/WxClubBtn.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    url: ""
  },
  onLoad: function onLoad() {
    var e = this;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      setTimeout(function () {
        e.createBtn();
      });
    }
  },
  createBtn: function createBtn() {
    if (cc.popupManager.nonePopupUI()) {
      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        if (this.clubBtn) {
          this.setVisible(!0);
        } else {
          var e;

          if (wx.getWindowInfo) {
            e = wx.getWindowInfo();
          } else {
            e = wx.getSystemInfoSync();
          }

          var t = cc.view.getViewportRect();
          var i = this.node.getBoundingBoxToWorld();
          var o = cc.view.getScaleX();
          i.x += t.x / o;
          i.y += t.y / o;
          var a = cc.view.getDevicePixelRatio();
          var c = o / a;
          var s = cc.view.getScaleY() / a;
          var n = {
            type: "image",
            image: this.url,
            style: {
              left: i.x * c,
              top: e.windowHeight - (i.y + i.height) * s,
              width: i.width * c,
              height: i.height * s
            }
          };
          this.clubBtn = wx.createGameClubButton(n);
          this.clubBtn.show();
        }
      } else {
        console.log("createBtn");
      }
    }
  },
  setVisible: function setVisible(e) {
    if (e) {
      if (this.clubBtn) {
        this.clubBtn.show();
      } else {
        this.createBtn();
      }
    } else {
      if (this.clubBtn) {
        this.clubBtn.hide();
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9XeENsdWJCdG4uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ1cmwiLCJvbkxvYWQiLCJlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInNldFRpbWVvdXQiLCJjcmVhdGVCdG4iLCJwb3B1cE1hbmFnZXIiLCJub25lUG9wdXBVSSIsImNsdWJCdG4iLCJzZXRWaXNpYmxlIiwid3giLCJnZXRXaW5kb3dJbmZvIiwiZ2V0U3lzdGVtSW5mb1N5bmMiLCJ0IiwidmlldyIsImdldFZpZXdwb3J0UmVjdCIsImkiLCJub2RlIiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwibyIsImdldFNjYWxlWCIsIngiLCJ5IiwiYSIsImdldERldmljZVBpeGVsUmF0aW8iLCJjIiwicyIsImdldFNjYWxlWSIsIm4iLCJ0eXBlIiwiaW1hZ2UiLCJzdHlsZSIsImxlZnQiLCJ0b3AiLCJ3aW5kb3dIZWlnaHQiLCJoZWlnaHQiLCJ3aWR0aCIsImNyZWF0ZUdhbWVDbHViQnV0dG9uIiwic2hvdyIsImNvbnNvbGUiLCJsb2ciLCJoaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztFQUNMLFdBQVNELEVBQUUsQ0FBQ0UsU0FEUDtFQUVMQyxVQUFVLEVBQUU7SUFDUkMsR0FBRyxFQUFFO0VBREcsQ0FGUDtFQUtMQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsSUFBSUMsQ0FBQyxHQUFHLElBQVI7O0lBQ0EsSUFBSU4sRUFBRSxDQUFDTyxHQUFILENBQU9DLFFBQVAsSUFBbUJSLEVBQUUsQ0FBQ08sR0FBSCxDQUFPRSxXQUE5QixFQUEyQztNQUN2Q0MsVUFBVSxDQUFDLFlBQVk7UUFDbkJKLENBQUMsQ0FBQ0ssU0FBRjtNQUNILENBRlMsQ0FBVjtJQUdIO0VBQ0osQ0FaSTtFQWFMQSxTQUFTLEVBQUUscUJBQVk7SUFDbkIsSUFBSVgsRUFBRSxDQUFDWSxZQUFILENBQWdCQyxXQUFoQixFQUFKLEVBQW1DO01BQy9CLElBQUliLEVBQUUsQ0FBQ08sR0FBSCxDQUFPQyxRQUFQLElBQW1CUixFQUFFLENBQUNPLEdBQUgsQ0FBT0UsV0FBOUIsRUFBMkM7UUFDdkMsSUFBSSxLQUFLSyxPQUFULEVBQWtCO1VBQ2QsS0FBS0MsVUFBTCxDQUFnQixDQUFDLENBQWpCO1FBQ0gsQ0FGRCxNQUVPO1VBQ0gsSUFBSVQsQ0FBSjs7VUFDQSxJQUFJVSxFQUFFLENBQUNDLGFBQVAsRUFBc0I7WUFDbEJYLENBQUMsR0FBR1UsRUFBRSxDQUFDQyxhQUFILEVBQUo7VUFDSCxDQUZELE1BRU87WUFDSFgsQ0FBQyxHQUFHVSxFQUFFLENBQUNFLGlCQUFILEVBQUo7VUFDSDs7VUFDRCxJQUFJQyxDQUFDLEdBQUduQixFQUFFLENBQUNvQixJQUFILENBQVFDLGVBQVIsRUFBUjtVQUNBLElBQUlDLENBQUMsR0FBRyxLQUFLQyxJQUFMLENBQVVDLHFCQUFWLEVBQVI7VUFDQSxJQUFJQyxDQUFDLEdBQUd6QixFQUFFLENBQUNvQixJQUFILENBQVFNLFNBQVIsRUFBUjtVQUNBSixDQUFDLENBQUNLLENBQUYsSUFBT1IsQ0FBQyxDQUFDUSxDQUFGLEdBQU1GLENBQWI7VUFDQUgsQ0FBQyxDQUFDTSxDQUFGLElBQU9ULENBQUMsQ0FBQ1MsQ0FBRixHQUFNSCxDQUFiO1VBQ0EsSUFBSUksQ0FBQyxHQUFHN0IsRUFBRSxDQUFDb0IsSUFBSCxDQUFRVSxtQkFBUixFQUFSO1VBQ0EsSUFBSUMsQ0FBQyxHQUFHTixDQUFDLEdBQUdJLENBQVo7VUFDQSxJQUFJRyxDQUFDLEdBQUdoQyxFQUFFLENBQUNvQixJQUFILENBQVFhLFNBQVIsS0FBc0JKLENBQTlCO1VBQ0EsSUFBSUssQ0FBQyxHQUFHO1lBQ0pDLElBQUksRUFBRSxPQURGO1lBRUpDLEtBQUssRUFBRSxLQUFLaEMsR0FGUjtZQUdKaUMsS0FBSyxFQUFFO2NBQ0hDLElBQUksRUFBRWhCLENBQUMsQ0FBQ0ssQ0FBRixHQUFNSSxDQURUO2NBRUhRLEdBQUcsRUFBRWpDLENBQUMsQ0FBQ2tDLFlBQUYsR0FBaUIsQ0FBQ2xCLENBQUMsQ0FBQ00sQ0FBRixHQUFNTixDQUFDLENBQUNtQixNQUFULElBQW1CVCxDQUZ0QztjQUdIVSxLQUFLLEVBQUVwQixDQUFDLENBQUNvQixLQUFGLEdBQVVYLENBSGQ7Y0FJSFUsTUFBTSxFQUFFbkIsQ0FBQyxDQUFDbUIsTUFBRixHQUFXVDtZQUpoQjtVQUhILENBQVI7VUFVQSxLQUFLbEIsT0FBTCxHQUFlRSxFQUFFLENBQUMyQixvQkFBSCxDQUF3QlQsQ0FBeEIsQ0FBZjtVQUNBLEtBQUtwQixPQUFMLENBQWE4QixJQUFiO1FBQ0g7TUFDSixDQS9CRCxNQStCTztRQUNIQyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaO01BQ0g7SUFDSjtFQUNKLENBbERJO0VBbURML0IsVUFBVSxFQUFFLG9CQUFVVCxDQUFWLEVBQWE7SUFDckIsSUFBSUEsQ0FBSixFQUFPO01BQ0gsSUFBSSxLQUFLUSxPQUFULEVBQWtCO1FBQ2QsS0FBS0EsT0FBTCxDQUFhOEIsSUFBYjtNQUNILENBRkQsTUFFTztRQUNILEtBQUtqQyxTQUFMO01BQ0g7SUFDSixDQU5ELE1BTU87TUFDSCxJQUFJLEtBQUtHLE9BQVQsRUFBa0I7UUFDZCxLQUFLQSxPQUFMLENBQWFpQyxJQUFiO01BQ0g7SUFDSjtFQUNKO0FBL0RJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB1cmw6IFwiXCJcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlLmNyZWF0ZUJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNyZWF0ZUJ0bjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2MucG9wdXBNYW5hZ2VyLm5vbmVQb3B1cFVJKCkpIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2x1YkJ0bikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZpc2libGUoITApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAod3guZ2V0V2luZG93SW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IHd4LmdldFdpbmRvd0luZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gY2Mudmlldy5nZXRWaWV3cG9ydFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gY2Mudmlldy5nZXRTY2FsZVgoKTtcbiAgICAgICAgICAgICAgICAgICAgaS54ICs9IHQueCAvIG87XG4gICAgICAgICAgICAgICAgICAgIGkueSArPSB0LnkgLyBvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IGNjLnZpZXcuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IG8gLyBhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGNjLnZpZXcuZ2V0U2NhbGVZKCkgLyBhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiB0aGlzLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaS54ICogYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGUud2luZG93SGVpZ2h0IC0gKGkueSArIGkuaGVpZ2h0KSAqIHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGkud2lkdGggKiBjLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogaS5oZWlnaHQgKiBzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2x1YkJ0biA9IHd4LmNyZWF0ZUdhbWVDbHViQnV0dG9uKG4pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsdWJCdG4uc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVCdG5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFZpc2libGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbHViQnRuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbHViQnRuLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCdG4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsdWJCdG4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsdWJCdG4uaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=