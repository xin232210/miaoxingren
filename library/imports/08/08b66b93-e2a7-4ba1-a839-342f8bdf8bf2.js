"use strict";
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