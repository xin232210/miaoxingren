
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game2/scripts/UIGame2End.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2ad791CoPtD1Y//lwt6772W', 'UIGame2End');
// game2/scripts/UIGame2End.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    waveLabel: cc.Label,
    bgSpine: sp.Skeleton,
    tiSpine: sp.Skeleton,
    onAniEndedNodes: [cc.Node],
    coinNode: cc.Node
  },
  initBy: function initBy(e) {
    var i = this;
    this.isWin = e;

    if (e) {
      this.waveLabel.string = cc.pvz.runtimeData.wave + 1;
    } else {
      this.waveLabel.string = cc.pvz.runtimeData.wave - 1;
    }

    this.onAniEndedNodes.forEach(function (e) {
      return e.active = !1;
    });
    this.coinNode.active = !1;
    this.bgSpine.setAnimation(0, "", !1);

    if (e) {
      cc.pvz.utils.spineFromTo(this.bgSpine, "shengli1_2", "shengli2_2");
      cc.pvz.utils.spineFromTo(this.tiSpine, "shengli1_1", "shengli2_1", !0, function () {
        i.coinNode.active = !0;
        i.onAniEndedNodes.forEach(function (e) {
          return e.active = !0;
        });
      });
    } else {
      cc.pvz.utils.spineFromTo(this.bgSpine, "shibai1_2", "shibai2_2");
      cc.pvz.utils.spineFromTo(this.tiSpine, "shibai1_1", "shibai2_1", !0, function () {
        i.onAniEndedNodes.forEach(function (e) {
          return e.active = !0;
        });
      });
    }
  },
  onClickClose: function onClickClose() {
    if (this.isWin) {
      cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], 200);
      cc.butler.playEffectAsync("game", "sound/getCoin");
    }

    cc.popupManager.removeAllPopups();
    cc.director.loadScene("mainUI");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lMi9zY3JpcHRzL1VJR2FtZTJFbmQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ3YXZlTGFiZWwiLCJMYWJlbCIsImJnU3BpbmUiLCJzcCIsIlNrZWxldG9uIiwidGlTcGluZSIsIm9uQW5pRW5kZWROb2RlcyIsIk5vZGUiLCJjb2luTm9kZSIsImluaXRCeSIsImUiLCJpIiwiaXNXaW4iLCJzdHJpbmciLCJwdnoiLCJydW50aW1lRGF0YSIsIndhdmUiLCJmb3JFYWNoIiwiYWN0aXZlIiwic2V0QW5pbWF0aW9uIiwidXRpbHMiLCJzcGluZUZyb21UbyIsIm9uQ2xpY2tDbG9zZSIsIlBsYXllckRhdGEiLCJjaGFuZ2VJdGVtTnVtIiwiR2FtZUNvbmZpZyIsIkl0ZW1UeXBlIiwiYnV0bGVyIiwicGxheUVmZmVjdEFzeW5jIiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlQWxsUG9wdXBzIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssS0FETjtJQUVSQyxPQUFPLEVBQUVDLEVBQUUsQ0FBQ0MsUUFGSjtJQUdSQyxPQUFPLEVBQUVGLEVBQUUsQ0FBQ0MsUUFISjtJQUlSRSxlQUFlLEVBQUUsQ0FBQ1YsRUFBRSxDQUFDVyxJQUFKLENBSlQ7SUFLUkMsUUFBUSxFQUFFWixFQUFFLENBQUNXO0VBTEwsQ0FGUDtFQVNMRSxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtJQUNqQixJQUFJQyxDQUFDLEdBQUcsSUFBUjtJQUNBLEtBQUtDLEtBQUwsR0FBYUYsQ0FBYjs7SUFDQSxJQUFJQSxDQUFKLEVBQU87TUFDSCxLQUFLVixTQUFMLENBQWVhLE1BQWYsR0FBd0JqQixFQUFFLENBQUNrQixHQUFILENBQU9DLFdBQVAsQ0FBbUJDLElBQW5CLEdBQTBCLENBQWxEO0lBQ0gsQ0FGRCxNQUVPO01BQ0gsS0FBS2hCLFNBQUwsQ0FBZWEsTUFBZixHQUF3QmpCLEVBQUUsQ0FBQ2tCLEdBQUgsQ0FBT0MsV0FBUCxDQUFtQkMsSUFBbkIsR0FBMEIsQ0FBbEQ7SUFDSDs7SUFDRCxLQUFLVixlQUFMLENBQXFCVyxPQUFyQixDQUE2QixVQUFVUCxDQUFWLEVBQWE7TUFDdEMsT0FBUUEsQ0FBQyxDQUFDUSxNQUFGLEdBQVcsQ0FBQyxDQUFwQjtJQUNILENBRkQ7SUFHQSxLQUFLVixRQUFMLENBQWNVLE1BQWQsR0FBdUIsQ0FBQyxDQUF4QjtJQUNBLEtBQUtoQixPQUFMLENBQWFpQixZQUFiLENBQTBCLENBQTFCLEVBQTZCLEVBQTdCLEVBQWlDLENBQUMsQ0FBbEM7O0lBQ0EsSUFBSVQsQ0FBSixFQUFPO01BQ0hkLEVBQUUsQ0FBQ2tCLEdBQUgsQ0FBT00sS0FBUCxDQUFhQyxXQUFiLENBQXlCLEtBQUtuQixPQUE5QixFQUF1QyxZQUF2QyxFQUFxRCxZQUFyRDtNQUNBTixFQUFFLENBQUNrQixHQUFILENBQU9NLEtBQVAsQ0FBYUMsV0FBYixDQUF5QixLQUFLaEIsT0FBOUIsRUFBdUMsWUFBdkMsRUFBcUQsWUFBckQsRUFBbUUsQ0FBQyxDQUFwRSxFQUF1RSxZQUFZO1FBQy9FTSxDQUFDLENBQUNILFFBQUYsQ0FBV1UsTUFBWCxHQUFvQixDQUFDLENBQXJCO1FBQ0FQLENBQUMsQ0FBQ0wsZUFBRixDQUFrQlcsT0FBbEIsQ0FBMEIsVUFBVVAsQ0FBVixFQUFhO1VBQ25DLE9BQVFBLENBQUMsQ0FBQ1EsTUFBRixHQUFXLENBQUMsQ0FBcEI7UUFDSCxDQUZEO01BR0gsQ0FMRDtJQU1ILENBUkQsTUFRTztNQUNIdEIsRUFBRSxDQUFDa0IsR0FBSCxDQUFPTSxLQUFQLENBQWFDLFdBQWIsQ0FBeUIsS0FBS25CLE9BQTlCLEVBQXVDLFdBQXZDLEVBQW9ELFdBQXBEO01BQ0FOLEVBQUUsQ0FBQ2tCLEdBQUgsQ0FBT00sS0FBUCxDQUFhQyxXQUFiLENBQXlCLEtBQUtoQixPQUE5QixFQUF1QyxXQUF2QyxFQUFvRCxXQUFwRCxFQUFpRSxDQUFDLENBQWxFLEVBQXFFLFlBQVk7UUFDN0VNLENBQUMsQ0FBQ0wsZUFBRixDQUFrQlcsT0FBbEIsQ0FBMEIsVUFBVVAsQ0FBVixFQUFhO1VBQ25DLE9BQVFBLENBQUMsQ0FBQ1EsTUFBRixHQUFXLENBQUMsQ0FBcEI7UUFDSCxDQUZEO01BR0gsQ0FKRDtJQUtIO0VBQ0osQ0F0Q0k7RUF1Q0xJLFlBQVksRUFBRSx3QkFBWTtJQUN0QixJQUFJLEtBQUtWLEtBQVQsRUFBZ0I7TUFDWmhCLEVBQUUsQ0FBQ2tCLEdBQUgsQ0FBT1MsVUFBUCxDQUFrQkMsYUFBbEIsQ0FBZ0M1QixFQUFFLENBQUNrQixHQUFILENBQU9XLFVBQVAsQ0FBa0JDLFFBQWxCLENBQTJCLElBQTNCLENBQWhDLEVBQWtFLEdBQWxFO01BQ0E5QixFQUFFLENBQUMrQixNQUFILENBQVVDLGVBQVYsQ0FBMEIsTUFBMUIsRUFBa0MsZUFBbEM7SUFDSDs7SUFDRGhDLEVBQUUsQ0FBQ2lDLFlBQUgsQ0FBZ0JDLGVBQWhCO0lBQ0FsQyxFQUFFLENBQUNtQyxRQUFILENBQVlDLFNBQVosQ0FBc0IsUUFBdEI7RUFDSDtBQTlDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgd2F2ZUxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgYmdTcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIHRpU3BpbmU6IHNwLlNrZWxldG9uLFxuICAgICAgICBvbkFuaUVuZGVkTm9kZXM6IFtjYy5Ob2RlXSxcbiAgICAgICAgY29pbk5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzO1xuICAgICAgICB0aGlzLmlzV2luID0gZTtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMud2F2ZUxhYmVsLnN0cmluZyA9IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2F2ZUxhYmVsLnN0cmluZyA9IGNjLnB2ei5ydW50aW1lRGF0YS53YXZlIC0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uQW5pRW5kZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gKGUuYWN0aXZlID0gITEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb2luTm9kZS5hY3RpdmUgPSAhMTtcbiAgICAgICAgdGhpcy5iZ1NwaW5lLnNldEFuaW1hdGlvbigwLCBcIlwiLCAhMSk7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBjYy5wdnoudXRpbHMuc3BpbmVGcm9tVG8odGhpcy5iZ1NwaW5lLCBcInNoZW5nbGkxXzJcIiwgXCJzaGVuZ2xpMl8yXCIpO1xuICAgICAgICAgICAgY2MucHZ6LnV0aWxzLnNwaW5lRnJvbVRvKHRoaXMudGlTcGluZSwgXCJzaGVuZ2xpMV8xXCIsIFwic2hlbmdsaTJfMVwiLCAhMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGkuY29pbk5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgaS5vbkFuaUVuZGVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGUuYWN0aXZlID0gITApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wdnoudXRpbHMuc3BpbmVGcm9tVG8odGhpcy5iZ1NwaW5lLCBcInNoaWJhaTFfMlwiLCBcInNoaWJhaTJfMlwiKTtcbiAgICAgICAgICAgIGNjLnB2ei51dGlscy5zcGluZUZyb21Ubyh0aGlzLnRpU3BpbmUsIFwic2hpYmFpMV8xXCIsIFwic2hpYmFpMl8xXCIsICEwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaS5vbkFuaUVuZGVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGUuYWN0aXZlID0gITApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1dpbikge1xuICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuY2hhbmdlSXRlbU51bShjYy5wdnouR2FtZUNvbmZpZy5JdGVtVHlwZVtcIumHkeW4gVwiXSwgMjAwKTtcbiAgICAgICAgICAgIGNjLmJ1dGxlci5wbGF5RWZmZWN0QXN5bmMoXCJnYW1lXCIsIFwic291bmQvZ2V0Q29pblwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5wb3B1cE1hbmFnZXIucmVtb3ZlQWxsUG9wdXBzKCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1haW5VSVwiKTtcbiAgICB9XG59KTtcbiJdfQ==