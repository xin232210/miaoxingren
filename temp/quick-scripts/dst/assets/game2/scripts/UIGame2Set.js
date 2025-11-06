
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game2/scripts/UIGame2Set.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '08b66uT4qdLoag5NC+L34vy', 'UIGame2Set');
// game2/scripts/UIGame2Set.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    musicBtn: cc.Node,
    soundBtn: cc.Node
  },
  initBy: function initBy(e) {
    this.ui = e;
    this.musicBtn.children[0].active = !cc.player.isMMute;
    this.musicBtn.children[1].active = cc.player.isMMute;
    this.soundBtn.children[0].active = !cc.player.isSMute;
    this.soundBtn.children[1].active = cc.player.isSMute;
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
  onClickQuit: function onClickQuit() {
    cc.director.loadScene("mainUI");
  },
  onCloseUI: function onCloseUI() {
    this.ui.hidePauseMenu();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lMi9zY3JpcHRzL1VJR2FtZTJTZXQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJtdXNpY0J0biIsIk5vZGUiLCJzb3VuZEJ0biIsImluaXRCeSIsImUiLCJ1aSIsImNoaWxkcmVuIiwiYWN0aXZlIiwicGxheWVyIiwiaXNNTXV0ZSIsImlzU011dGUiLCJwdnoiLCJUQVV0aWxzIiwidHJhY2tTeXN0ZW1VSSIsIm9uU3dpdGNoTXVzaWMiLCJidXRsZXIiLCJzZXRNdXNpY1N3aXRjaCIsIm9uU3dpdGNoU291bmQiLCJzZXRTb3VuZFN3aXRjaCIsIm9uQ2xpY2tRdWl0IiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJvbkNsb3NlVUkiLCJoaWRlUGF1c2VNZW51IiwicG9wdXBNYW5hZ2VyIiwicmVtb3ZlUG9wdXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxRQUFRLEVBQUVKLEVBQUUsQ0FBQ0ssSUFETDtJQUVSQyxRQUFRLEVBQUVOLEVBQUUsQ0FBQ0s7RUFGTCxDQUZQO0VBTUxFLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFhO0lBQ2pCLEtBQUtDLEVBQUwsR0FBVUQsQ0FBVjtJQUNBLEtBQUtKLFFBQUwsQ0FBY00sUUFBZCxDQUF1QixDQUF2QixFQUEwQkMsTUFBMUIsR0FBbUMsQ0FBQ1gsRUFBRSxDQUFDWSxNQUFILENBQVVDLE9BQTlDO0lBQ0EsS0FBS1QsUUFBTCxDQUFjTSxRQUFkLENBQXVCLENBQXZCLEVBQTBCQyxNQUExQixHQUFtQ1gsRUFBRSxDQUFDWSxNQUFILENBQVVDLE9BQTdDO0lBQ0EsS0FBS1AsUUFBTCxDQUFjSSxRQUFkLENBQXVCLENBQXZCLEVBQTBCQyxNQUExQixHQUFtQyxDQUFDWCxFQUFFLENBQUNZLE1BQUgsQ0FBVUUsT0FBOUM7SUFDQSxLQUFLUixRQUFMLENBQWNJLFFBQWQsQ0FBdUIsQ0FBdkIsRUFBMEJDLE1BQTFCLEdBQW1DWCxFQUFFLENBQUNZLE1BQUgsQ0FBVUUsT0FBN0M7SUFDQWQsRUFBRSxDQUFDZSxHQUFILENBQU9DLE9BQVAsQ0FBZUMsYUFBZixDQUE2QixDQUE3QjtFQUNILENBYkk7RUFjTEMsYUFBYSxFQUFFLHlCQUFZO0lBQ3ZCbEIsRUFBRSxDQUFDbUIsTUFBSCxDQUFVQyxjQUFWLENBQXlCLENBQUNwQixFQUFFLENBQUNZLE1BQUgsQ0FBVUMsT0FBcEM7SUFDQSxLQUFLVCxRQUFMLENBQWNNLFFBQWQsQ0FBdUIsQ0FBdkIsRUFBMEJDLE1BQTFCLEdBQW1DLENBQUNYLEVBQUUsQ0FBQ1ksTUFBSCxDQUFVQyxPQUE5QztJQUNBLEtBQUtULFFBQUwsQ0FBY00sUUFBZCxDQUF1QixDQUF2QixFQUEwQkMsTUFBMUIsR0FBbUNYLEVBQUUsQ0FBQ1ksTUFBSCxDQUFVQyxPQUE3QztFQUNILENBbEJJO0VBbUJMUSxhQUFhLEVBQUUseUJBQVk7SUFDdkJyQixFQUFFLENBQUNtQixNQUFILENBQVVHLGNBQVYsQ0FBeUIsQ0FBQ3RCLEVBQUUsQ0FBQ1ksTUFBSCxDQUFVRSxPQUFwQztJQUNBLEtBQUtSLFFBQUwsQ0FBY0ksUUFBZCxDQUF1QixDQUF2QixFQUEwQkMsTUFBMUIsR0FBbUMsQ0FBQ1gsRUFBRSxDQUFDWSxNQUFILENBQVVFLE9BQTlDO0lBQ0EsS0FBS1IsUUFBTCxDQUFjSSxRQUFkLENBQXVCLENBQXZCLEVBQTBCQyxNQUExQixHQUFtQ1gsRUFBRSxDQUFDWSxNQUFILENBQVVFLE9BQTdDO0VBQ0gsQ0F2Qkk7RUF3QkxTLFdBQVcsRUFBRSx1QkFBWTtJQUNyQnZCLEVBQUUsQ0FBQ3dCLFFBQUgsQ0FBWUMsU0FBWixDQUFzQixRQUF0QjtFQUNILENBMUJJO0VBMkJMQyxTQUFTLEVBQUUscUJBQVk7SUFDbkIsS0FBS2pCLEVBQUwsQ0FBUWtCLGFBQVI7SUFDQTNCLEVBQUUsQ0FBQzRCLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0VBQ0g7QUE5QkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG11c2ljQnRuOiBjYy5Ob2RlLFxuICAgICAgICBzb3VuZEJ0bjogY2MuTm9kZVxuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLnVpID0gZTtcbiAgICAgICAgdGhpcy5tdXNpY0J0bi5jaGlsZHJlblswXS5hY3RpdmUgPSAhY2MucGxheWVyLmlzTU11dGU7XG4gICAgICAgIHRoaXMubXVzaWNCdG4uY2hpbGRyZW5bMV0uYWN0aXZlID0gY2MucGxheWVyLmlzTU11dGU7XG4gICAgICAgIHRoaXMuc291bmRCdG4uY2hpbGRyZW5bMF0uYWN0aXZlID0gIWNjLnBsYXllci5pc1NNdXRlO1xuICAgICAgICB0aGlzLnNvdW5kQnRuLmNoaWxkcmVuWzFdLmFjdGl2ZSA9IGNjLnBsYXllci5pc1NNdXRlO1xuICAgICAgICBjYy5wdnouVEFVdGlscy50cmFja1N5c3RlbVVJKDQpO1xuICAgIH0sXG4gICAgb25Td2l0Y2hNdXNpYzogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5idXRsZXIuc2V0TXVzaWNTd2l0Y2goIWNjLnBsYXllci5pc01NdXRlKTtcbiAgICAgICAgdGhpcy5tdXNpY0J0bi5jaGlsZHJlblswXS5hY3RpdmUgPSAhY2MucGxheWVyLmlzTU11dGU7XG4gICAgICAgIHRoaXMubXVzaWNCdG4uY2hpbGRyZW5bMV0uYWN0aXZlID0gY2MucGxheWVyLmlzTU11dGU7XG4gICAgfSxcbiAgICBvblN3aXRjaFNvdW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmJ1dGxlci5zZXRTb3VuZFN3aXRjaCghY2MucGxheWVyLmlzU011dGUpO1xuICAgICAgICB0aGlzLnNvdW5kQnRuLmNoaWxkcmVuWzBdLmFjdGl2ZSA9ICFjYy5wbGF5ZXIuaXNTTXV0ZTtcbiAgICAgICAgdGhpcy5zb3VuZEJ0bi5jaGlsZHJlblsxXS5hY3RpdmUgPSBjYy5wbGF5ZXIuaXNTTXV0ZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tRdWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1haW5VSVwiKTtcbiAgICB9LFxuICAgIG9uQ2xvc2VVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVpLmhpZGVQYXVzZU1lbnUoKTtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnJlbW92ZVBvcHVwKHRoaXMpO1xuICAgIH1cbn0pO1xuIl19