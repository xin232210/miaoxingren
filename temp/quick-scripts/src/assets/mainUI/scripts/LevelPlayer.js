"use strict";
cc._RF.push(module, 'c4bd9oIzAdEaJtMfm2nZyRi', 'LevelPlayer');
// mainUI/scripts/LevelPlayer.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    heroSpines: [sp.Skeleton],
    enemySpines: [sp.Skeleton]
  },
  initHeroShow: function initHeroShow() {
    var e = this;
    var t = cc.pvz.PlayerData.getStageLevel();
    var i = new Array(8).fill(-1);

    for (var o = 0; o < cc.pvz.GameConfig.MaxToolCount; o++) {
      var a = o + 1;

      if (cc.pvz.GameConfig.ToolLockLevel[o] < t) {
        var c = cc.player.toolData[a].pos;

        if (-1 != c) {
          i[c] = a;
        }
      }
    }

    var s = function s(t) {
      if (-1 != i[t]) {
        var o = i[t];
        e.heroSpines[t].node.active = !0;
        cc.pvz.utils.useBundleAsset("actors", "character/Characters", sp.SkeletonData, function (o) {
          e.heroSpines[t].skeletonData = o;
          var a = cc.pvz.PlayerData.getToolData(i[t]).lv;
          var c = cc.pvz.utils.getLevelInterval(a);
          e.heroSpines[t].setAnimation(0, "Idle", !0);
        });
      } else {
        e.heroSpines[t].node.active = !1;
      }
    };

    for (var n = 0; n < this.heroSpines.length; n++) {
      s(n);
    }
  },
  initEnemyShow: function initEnemyShow(e) {
    var t = this;
    var i = cc.JsonControl.getLevelJson(e).enemy;

    var o = function o(e) {
      var o = i[e];
      t.enemySpines[e].node.active = !0;
      cc.pvz.utils.useBundleAsset("actors", "Zombie/e" + o, sp.SkeletonData, function (i) {
        t.enemySpines[e].skeletonData = i;
        t.enemySpines[e].setAnimation(0, "Idle", !0);
      });
    };

    for (var a = 0; a < i.length; a++) {
      o(a);
    }
  },
  onTouchEnemy: function onTouchEnemy(e, t) {
    var i = parseInt(t);
    var o = this.enemySpines[i];

    if (o && "Idle" == o.animation) {
      o.setAnimation(0, "Hit", !1);
      o.setCompleteListener(function () {
        o.setAnimation(0, "Idle", !0);
        o.setCompleteListener(null);
      });
    }
  }
});

cc._RF.pop();