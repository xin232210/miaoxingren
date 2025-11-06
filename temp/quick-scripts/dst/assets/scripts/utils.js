
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '16759n/eJRFL4+HP4MKdKZI', 'utils');
// scripts/utils.js

"use strict";

var o = {
  getRGBColor: function getRGBColor(e) {
    var t = new cc.Color();
    t.fromHEX("#" === e[0] ? e.substring(1) : e);
    return t;
  },
  getReminDays: function getReminDays(e, t) {
    var o = Date.now() - t;
    return e - Math.floor(o / 864e5);
  },
  getTodayZeroTimes: function getTodayZeroTimes() {
    var e = Date.now();
    return e - e % 864e5;
  },
  getTodayLastTimes: function getTodayLastTimes() {
    var e = new Date();
    var t = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59);
    return Math.floor((t - e) / 1e3);
  },
  getCurDayInYears: function getCurDayInYears() {
    var e = new Date().getFullYear().toString();
    var t = new Date() - new Date(e) + 288e5;
    return Math.ceil(t / 864e5) + 1;
  },
  getDate: function getDate() {
    var e = new Date();
    return 1e4 * e.getFullYear() + 100 * e.getMonth() + e.getDate();
  },
  getStartOfWeek: function getStartOfWeek() {
    var e = new Date();
    var t = e.getDay();
    var o;

    if (0 == t) {
      o = -6;
    } else {
      o = 1 - t;
    }

    e.setDate(e.getDate() + o);
    e.setHours(0, 0, 0, 0);
    return e.getTime();
  },
  getCurDayInWeek: function getCurDayInWeek() {
    var e = new Date().getDay();

    if (0 == e) {
      return 7;
    } else {
      return e;
    }
  },
  formatItemNum: function formatItemNum(e) {
    var t = e;

    if (t < 1e4) {
      return e;
    }

    var o = parseInt(t / 1e3);
    return (o = (t / 1e3).toFixed((t - 1e3 * o) % 100 == 0 ? 1 : 2)) + "k";
  },
  foramtAttributeNum: function foramtAttributeNum(e) {
    var t = e;

    if (10 * e % 10 == 0) {
      return t.toFixed(0);
    } else {
      return t.toFixed(1);
    }
  },
  randomWeightIndex: function randomWeightIndex(e) {
    var t = 0;
    var o = [0];
    var a = e.length;

    for (var n = 0; n < a; n++) {
      t += e[n];
      o.push(t);
    }

    var i = Math.random() * o[o.length - 1] - 1;
    var c = 0;
    var s = 0;
    var r = 0;

    for (var l = o.length - 1; r < l;) {
      if ((s = o[(c = parseInt((r + l) / 2)) + 1]) < i) {
        r = c + 1;
      } else {
        if (!(s > i)) {
          r = c;
          break;
        }

        l = c;
      }
    }

    return r;
  },
  getZIndex: function getZIndex(e) {
    return e.zIndex;
  },
  checkZIndex: function checkZIndex(e, t) {
    return e.zIndex <= t.zIndex;
  },
  getTargetLength: function getTargetLength(e, t) {
    return e.position.sub(t.position).len();
  },
  _withinTarget: function _withinTarget(e, t) {
    var o = e.getBoundingBox();
    var a = t.convertToWorldSpaceAR(cc.v2());
    var n = e.parent.convertToNodeSpaceAR(a);
    return o.contains(n);
  },
  _withinTargetPlace: function _withinTargetPlace(e, t) {
    var o = e.getBoundingBox();
    var a = t.getLocation();
    var n = e.parent.convertToNodeSpaceAR(a);
    return o.contains(n);
  },
  _withinTargetSun: function _withinTargetSun(e, t) {
    var o = e.getBoundingBox();
    var a = t.getLocation();
    var n = e.parent.convertToNodeSpaceAR(a);
    return o.contains(n);
  },
  getSpineCurrentName: function getSpineCurrentName(e) {
    return e.animation;
  },
  getTargetNodeComponent: function getTargetNodeComponent(e, t) {
    return e.getComponent(t);
  },
  ComputeBulletPosition: function ComputeBulletPosition(e, t) {
    var o = cc.v2(t.worldX, t.worldY);
    return e.convertToWorldSpaceAR(o);
  },
  ComputeDistance: function ComputeDistance(e, t) {
    var o = e.convertToWorldSpaceAR(cc.v2());
    var a = t.convertToWorldSpaceAR(cc.v2());
    return o.sub(a).mag();
  },
  ComputeListSum: function ComputeListSum(e) {
    return e.reduce(function (e, t) {
      return e + t;
    }, 0);
  },
  getRotationRadians: function getRotationRadians(e, t) {
    var o = t.sub(e);
    return Math.atan2(o.y, o.x);
  },
  shuffleArray: function shuffleArray(e) {
    var t;
    var o;

    for (var a = e.length; a;) {
      o = Math.floor(Math.random() * a--);
      t = e[a];
      e[a] = e[o];
      e[o] = t;
    }

    return e;
  },
  compareVersion: function compareVersion(e, t) {
    e = e.split(".");
    t = t.split(".");

    for (var o = Math.max(e.length, t.length); e.length < o;) {
      e.push("0");
    }

    for (; t.length < o;) {
      t.push("0");
    }

    for (var a = 0; a < o; a++) {
      var n = parseInt(e[a]);
      var i = parseInt(t[a]);

      if (n > i) {
        return 1;
      }

      if (n < i) {
        return -1;
      }
    }

    return 0;
  },
  formatCDTime: function formatCDTime(e) {
    var t = "";
    var o = e % 60;

    if (e >= 86400) {
      t += Math.floor(e / 86400) + "天";
      t += Math.floor(e / 3600 % 24) + "小时";
    } else {
      if (e >= 3600) {
        return (t += Math.floor(e / 3600) + "小时") + Math.floor(e / 60 % 60) + "分";
      }

      if (e > 60) {
        return (t += Math.floor(e / 60 % 60) + "分") + Math.floor(o) + "秒";
      }

      if (o > 0) {
        t += Math.floor(o) + "秒";
      }
    }

    return t;
  },
  formatSeconds3: function formatSeconds3(e) {
    var t = Math.floor(e / 3600);
    e -= 3600 * t;
    var o = Math.floor(e / 60);
    var a = e % 60;
    return (t = t.toString().padStart(2, "0")) + ":" + (o = o.toString().padStart(2, "0")) + ":" + a.toString().padStart(2, "0");
  },
  formatSeconds: function formatSeconds(e) {
    var t = e % 60;
    var o = "";

    if (e >= 3600) {
      o += Math.floor(e / 3600) + "小时";
    }

    if (e >= 60) {
      o += Math.floor(e / 60 % 60) + "分";
    }

    if (t > 0) {
      o += Math.floor(t) + "秒";
    }

    return o;
  },
  formatSeconds2: function formatSeconds2(e) {
    var t = e % 60;
    var o = "";

    if (e >= 60) {
      var a = e / 60;
      o += ((a = parseInt(a)) >= 10 ? a : "0" + a) + ":";
    } else {
      o += "00:";
    }

    return o + (t > 0 ? t >= 10 ? t : "0" + t : "00");
  },
  getNodeSelfBoundBox: function getNodeSelfBoundBox(e) {
    var t = e.getBoundingBox();
    t.x = e.convertToWorldSpaceAR(cc.v2()).x - t.width / 2;
    t.y = e.convertToWorldSpaceAR(cc.v2()).y - t.height / 2;
    return t;
  },
  getNodeSelfBoundBox2: function getNodeSelfBoundBox2(e) {
    if (e._parent) {
      e._parent._updateWorldMatrix();

      var t = e.getBoundingBox();

      e._calculWorldMatrix();

      t.transformMat4(t, e._worldMatrix);
      return t;
    }

    return e.getBoundingBox();
  },
  uploadScore: function uploadScore(e) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var t = [];
      var o = {};
      o.key = String("s");
      o.value = String(e);
      t.push(o);
      wx.setUserCloudStorage({
        KVDataList: t,
        success: function success() {},
        fail: function fail() {}
      });
    }
  },
  fadeInBtn: function fadeInBtn(e) {
    e.opacity = 0;
    e.active = !0;
    e.runAction(cc.fadeIn(0.16));
  },
  bindSpine: function bindSpine(e, t, o) {
    var a = e.attachUtil.generateAttachedNodes(t)[0];
    o.parent = a;
  },
  getbindSpine: function getbindSpine(e, t) {
    return e.attachUtil.generateAttachedNodes(t)[0].children[0];
  },
  bindSpines: function bindSpines(e, t) {
    var o = e.attachUtil;
    t.forEach(function (e) {
      var t = o.generateAttachedNodes(e.bone)[0];
      e.node.parent = t;
    });
  },
  sendMsg: function sendMsg(e, t, o, a) {
    if (void 0 === a) {
      a = 5e3;
    }

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      return new Promise(function (n, i) {
        var c = {
          url: e,
          data: t || {},
          method: o,
          success: function success(e) {
            n(e.data);
          },
          fail: function fail(e) {
            i(e);
          },
          timeout: a
        };

        if (t) {
          c.data = t;
        }

        wx.request(c);
      });
    }

    var n = new XMLHttpRequest();
    return new Promise(function (i, c) {
      var s = function s() {
        c("error:xhr status=" + n.status);
        n = null;
      };

      var r = setTimeout(function () {
        console.error("xhr timeout");

        if (n) {
          n.abort();
          s();
        }
      }, a);

      n.onreadystatechange = function () {
        if (4 == n.readyState) {
          if (n.status >= 200 && n.status < 400) {
            (function () {
              var t = n.responseText;

              if (0 == t.length) {
                cc.error("empty response, url:", e), i({});
              } else {
                var o = JSON.parse(t);
                i("object" == typeof o && o ? o : t);
              }

              n = null;
              clearTimeout(r);
            })();
          } else {
            n.status >= 400 && s();
          }
        }
      };

      console.log("xhr start by " + o + " method!url=" + e + ", data=" + t);
      n.open(o, e, !0);

      if ("POST" == o && t) {
        var l = new Blob([JSON.stringify(t)]);
        n.send(l);
      } else {
        n.send();
      }
    });
  },
  setSpriteFrame: function setSpriteFrame(e, t, o) {
    if (e) {
      this.useBundleAsset(t, o, cc.SpriteFrame, function (t) {
        e.spriteFrame = t;
      });
    } else {
      console.warn("sprite is null", t, o);
    }
  },
  setSpriteFrames: function setSpriteFrames(e, t, o) {
    this.useBundleAsset(t, o, cc.SpriteFrame, function (t) {
      e.forEach(function (e) {
        return e.spriteFrame = t;
      });
    });
  },
  useBundleAsset: function useBundleAsset(e, t, o, a) {
    var n = function n(e) {
      var n = e.get(t, o);

      if (n) {
        a(n);
      } else {
        e.load(t, o, function (e, t) {
          if (e) {
            console.warn(e);
          } else {
            a(t);
          }
        });
      }
    };

    var i = cc.assetManager.getBundle(e);

    if (i) {
      n(i);
    } else {
      cc.assetManager.loadBundle(e, function (e, t) {
        if (e) {
          console.warn(e);
        } else {
          n(t);
        }
      });
    }
  },
  releaseAsset: function releaseAsset(e, t, o) {
    var a = cc.assetManager.getBundle(e);

    if (a && a.get(t, o)) {
      a.release(t, o);
    }
  },
  manuallyCheckCollider: function manuallyCheckCollider(e) {
    var t = cc.director.getCollisionManager();
    var o = [];
    var a = t._contacts[0].constructor;
    var n = 0;
    var i = 0;
    var c = t._colliders;
    var s = 0;

    for (var r = c.length; s < r; s++) {
      var l = c[s];

      if (t.shouldCollide(e, l)) {
        o.push(new a(e, l));
      }
    }

    t.initCollider(e);
    t.updateCollider(e);
    var u = [];
    n = 0;

    for (i = o.length; n < i; n++) {
      var p = o[n].updateState();

      if (p !== a.CollisionType.None) {
        u.push([p, o[n]]);
      }
    }

    n = 0;

    for (i = u.length; n < i; n++) {
      var d = u[n];

      t._doCollide(d[0], d[1]);
    }

    return u.length > 0;
  },
  manuallyCheck2Collider: function manuallyCheck2Collider(e, t) {
    var o = cc.director.getCollisionManager();
    var a = o._contacts[0].constructor;
    o.initCollider(e);
    o.initCollider(t);
    o.updateCollider(e);
    o.updateCollider(t);
    return new a(e, t).test();
  },
  updateColliders: function updateColliders(e) {
    var t = cc.director.getCollisionManager();
    var o = 0;

    for (var a = e.length; o < a; o++) {
      var n = e[o];
      t.initCollider(n);
      t.updateCollider(n);
    }
  },
  getCollideWith: function getCollideWith(e, t) {
    var o = cc.director.getCollisionManager();

    if (o._contacts[0]) {//
    } else {
      console.error("s");
    }

    var a = o._contacts[0].constructor;
    o.initCollider(e);
    o.updateCollider(e);
    var n = 0;

    for (var i = t.length; n < i; n++) {
      var c = t[n];
      o.initCollider(c);
      o.updateCollider(c);

      if (new a(e, c).test()) {
        return c;
      }
    }

    return null;
  },
  inRange2: function inRange2(e, t, o) {
    var a = o.x - e.x;
    var n = o.y - e.y;
    return a * a + n * n / 0.49 <= t;
  },
  getRewardItem: function getRewardItem(e, t) {
    var o = new cc.pvz.GameConfig.RewardData();
    o.itemId = e;
    o.count = t;
    o.toolId = -1;
    return o;
  },
  getRewardToolItem: function getRewardToolItem(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    var o = new cc.pvz.GameConfig.RewardData();
    o.itemId = cc.pvz.GameConfig.ItemType["固定碎片"];
    o.count = t;
    o.toolId = e;
    return o;
  },
  onCheckRandomTool: function onCheckRandomTool(e, t, o) {
    if (void 0 === o) {
      o = !0;
    }

    var a = [];
    var n = cc.JsonControl.getItemJson(e.itemId);
    var i = cc.pvz.utils.getOpenToolList(n.Quality, o);

    if (0 == i.length) {
      i.push(7);
    }

    var c = function c() {
      var e = i[cc.math.randomRangeInt(0, i.length)];
      var t = cc.pvz.utils.getRewardToolItem(e, 1);
      var o = a.find(function (t) {
        return t.toolId == e;
      });

      if (o) {
        o.count++;
      } else {
        a.push(t);
      }
    };

    for (var s = 0; s < e.count; s++) {
      c();
    }

    for (var r = 0; r < a.length; r++) {
      t.push(a[r]);
    }
  },
  getOpenToolList: function getOpenToolList(e, t) {
    if (void 0 === t) {
      t = !0;
    }

    var o = cc.pvz.PlayerData.getStageLevel();
    var a = [];
    var n = cc.pvz.GameConfig["Quality" + e + "Tools"];

    if (t) {
      for (var i = 0; i < n.length; i++) {
        var c = n[i];

        if (o > cc.pvz.GameConfig.ToolLockLevel[c - 1]) {
          a.push(c);
        }
      }

      return a;
    }

    return n;
  },
  getLevelInterval: function getLevelInterval(e) {
    var t = [[0, 3], [4, 7], [8, 11], [12, 15], [16, 999]];

    for (var o = 0; o < t.length; o++) {
      if (e >= t[o][0] && e <= t[o][1]) {
        return o + 1;
      }
    }

    return null;
  },
  onChangeCNNUm: function onChangeCNNUm(e) {
    return ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][e - 1];
  },
  spineFromTo: function spineFromTo(e, t, o, a, n) {
    if (void 0 === a) {
      a = !0;
    }

    if (void 0 === n) {
      n = null;
    }

    if (t) {
      e.setAnimation(0, t, !1);
    }

    var i = n;
    e.setCompleteListener(function () {
      e.setAnimation(0, o, a);

      if (i) {
        i();
      }

      e.setCompleteListener(null);
    });
  }
};

if (cc.pvz) {//
} else {
  cc.pvz = {};
}

cc.pvz.utils = o;
module.exports = o;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbIm8iLCJnZXRSR0JDb2xvciIsImUiLCJ0IiwiY2MiLCJDb2xvciIsImZyb21IRVgiLCJzdWJzdHJpbmciLCJnZXRSZW1pbkRheXMiLCJEYXRlIiwibm93IiwiTWF0aCIsImZsb29yIiwiZ2V0VG9kYXlaZXJvVGltZXMiLCJnZXRUb2RheUxhc3RUaW1lcyIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0Q3VyRGF5SW5ZZWFycyIsInRvU3RyaW5nIiwiY2VpbCIsImdldFN0YXJ0T2ZXZWVrIiwiZ2V0RGF5Iiwic2V0RGF0ZSIsInNldEhvdXJzIiwiZ2V0VGltZSIsImdldEN1ckRheUluV2VlayIsImZvcm1hdEl0ZW1OdW0iLCJwYXJzZUludCIsInRvRml4ZWQiLCJmb3JhbXRBdHRyaWJ1dGVOdW0iLCJyYW5kb21XZWlnaHRJbmRleCIsImEiLCJsZW5ndGgiLCJuIiwicHVzaCIsImkiLCJyYW5kb20iLCJjIiwicyIsInIiLCJsIiwiZ2V0WkluZGV4IiwiekluZGV4IiwiY2hlY2taSW5kZXgiLCJnZXRUYXJnZXRMZW5ndGgiLCJwb3NpdGlvbiIsInN1YiIsImxlbiIsIl93aXRoaW5UYXJnZXQiLCJnZXRCb3VuZGluZ0JveCIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsInYyIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJjb250YWlucyIsIl93aXRoaW5UYXJnZXRQbGFjZSIsImdldExvY2F0aW9uIiwiX3dpdGhpblRhcmdldFN1biIsImdldFNwaW5lQ3VycmVudE5hbWUiLCJhbmltYXRpb24iLCJnZXRUYXJnZXROb2RlQ29tcG9uZW50IiwiZ2V0Q29tcG9uZW50IiwiQ29tcHV0ZUJ1bGxldFBvc2l0aW9uIiwid29ybGRYIiwid29ybGRZIiwiQ29tcHV0ZURpc3RhbmNlIiwibWFnIiwiQ29tcHV0ZUxpc3RTdW0iLCJyZWR1Y2UiLCJnZXRSb3RhdGlvblJhZGlhbnMiLCJhdGFuMiIsInkiLCJ4Iiwic2h1ZmZsZUFycmF5IiwiY29tcGFyZVZlcnNpb24iLCJzcGxpdCIsIm1heCIsImZvcm1hdENEVGltZSIsImZvcm1hdFNlY29uZHMzIiwicGFkU3RhcnQiLCJmb3JtYXRTZWNvbmRzIiwiZm9ybWF0U2Vjb25kczIiLCJnZXROb2RlU2VsZkJvdW5kQm94Iiwid2lkdGgiLCJoZWlnaHQiLCJnZXROb2RlU2VsZkJvdW5kQm94MiIsIl9wYXJlbnQiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJfY2FsY3VsV29ybGRNYXRyaXgiLCJ0cmFuc2Zvcm1NYXQ0IiwiX3dvcmxkTWF0cml4IiwidXBsb2FkU2NvcmUiLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FIiwia2V5IiwiU3RyaW5nIiwidmFsdWUiLCJ3eCIsInNldFVzZXJDbG91ZFN0b3JhZ2UiLCJLVkRhdGFMaXN0Iiwic3VjY2VzcyIsImZhaWwiLCJmYWRlSW5CdG4iLCJvcGFjaXR5IiwiYWN0aXZlIiwicnVuQWN0aW9uIiwiZmFkZUluIiwiYmluZFNwaW5lIiwiYXR0YWNoVXRpbCIsImdlbmVyYXRlQXR0YWNoZWROb2RlcyIsImdldGJpbmRTcGluZSIsImNoaWxkcmVuIiwiYmluZFNwaW5lcyIsImZvckVhY2giLCJib25lIiwibm9kZSIsInNlbmRNc2ciLCJQcm9taXNlIiwidXJsIiwiZGF0YSIsIm1ldGhvZCIsInRpbWVvdXQiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJzdGF0dXMiLCJzZXRUaW1lb3V0IiwiY29uc29sZSIsImVycm9yIiwiYWJvcnQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VUZXh0IiwiSlNPTiIsInBhcnNlIiwiY2xlYXJUaW1lb3V0IiwibG9nIiwib3BlbiIsIkJsb2IiLCJzdHJpbmdpZnkiLCJzZW5kIiwic2V0U3ByaXRlRnJhbWUiLCJ1c2VCdW5kbGVBc3NldCIsIlNwcml0ZUZyYW1lIiwic3ByaXRlRnJhbWUiLCJ3YXJuIiwic2V0U3ByaXRlRnJhbWVzIiwiZ2V0IiwibG9hZCIsImFzc2V0TWFuYWdlciIsImdldEJ1bmRsZSIsImxvYWRCdW5kbGUiLCJyZWxlYXNlQXNzZXQiLCJyZWxlYXNlIiwibWFudWFsbHlDaGVja0NvbGxpZGVyIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiX2NvbnRhY3RzIiwiY29uc3RydWN0b3IiLCJfY29sbGlkZXJzIiwic2hvdWxkQ29sbGlkZSIsImluaXRDb2xsaWRlciIsInVwZGF0ZUNvbGxpZGVyIiwidSIsInAiLCJ1cGRhdGVTdGF0ZSIsIkNvbGxpc2lvblR5cGUiLCJOb25lIiwiZCIsIl9kb0NvbGxpZGUiLCJtYW51YWxseUNoZWNrMkNvbGxpZGVyIiwidGVzdCIsInVwZGF0ZUNvbGxpZGVycyIsImdldENvbGxpZGVXaXRoIiwiaW5SYW5nZTIiLCJnZXRSZXdhcmRJdGVtIiwicHZ6IiwiR2FtZUNvbmZpZyIsIlJld2FyZERhdGEiLCJpdGVtSWQiLCJjb3VudCIsInRvb2xJZCIsImdldFJld2FyZFRvb2xJdGVtIiwiSXRlbVR5cGUiLCJvbkNoZWNrUmFuZG9tVG9vbCIsIkpzb25Db250cm9sIiwiZ2V0SXRlbUpzb24iLCJ1dGlscyIsImdldE9wZW5Ub29sTGlzdCIsIlF1YWxpdHkiLCJtYXRoIiwicmFuZG9tUmFuZ2VJbnQiLCJmaW5kIiwiUGxheWVyRGF0YSIsImdldFN0YWdlTGV2ZWwiLCJUb29sTG9ja0xldmVsIiwiZ2V0TGV2ZWxJbnRlcnZhbCIsIm9uQ2hhbmdlQ05OVW0iLCJzcGluZUZyb21UbyIsInNldEFuaW1hdGlvbiIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLENBQUMsR0FBRztFQUNKQyxXQUFXLEVBQUUscUJBQVVDLENBQVYsRUFBYTtJQUN0QixJQUFJQyxDQUFDLEdBQUcsSUFBSUMsRUFBRSxDQUFDQyxLQUFQLEVBQVI7SUFDQUYsQ0FBQyxDQUFDRyxPQUFGLENBQVUs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LENBQUMsQ0FBTDtJQUNIOztJQUNELElBQUksS0FBSyxDQUFMLEtBQVdFLENBQWYsRUFBa0I7TUFDZEEsQ0FBQyxHQUFHLElBQUo7SUFDSDs7SUFDRCxJQUFJL0IsQ0FBSixFQUFPO01BQ0hELENBQUMsQ0FBQ3NNLFlBQUYsQ0FBZSxDQUFmLEVBQWtCck0sQ0FBbEIsRUFBcUIsQ0FBQyxDQUF0QjtJQUNIOztJQUNELElBQUlpQyxDQUFDLEdBQUdGLENBQVI7SUFDQWhDLENBQUMsQ0FBQ3VNLG1CQUFGLENBQXNCLFlBQVk7TUFDOUJ2TSxDQUFDLENBQUNzTSxZQUFGLENBQWUsQ0FBZixFQUFrQnhNLENBQWxCLEVBQXFCZ0MsQ0FBckI7O01BQ0EsSUFBSUksQ0FBSixFQUFPO1FBQ0hBLENBQUM7TUFDSjs7TUFDRGxDLENBQUMsQ0FBQ3VNLG1CQUFGLENBQXNCLElBQXRCO0lBQ0gsQ0FORDtFQU9IO0FBMWpCRyxDQUFSOztBQTRqQkEsSUFBSXJNLEVBQUUsQ0FBQzZLLEdBQVAsRUFBWSxDQUNSO0FBQ0gsQ0FGRCxNQUVPO0VBQ0g3SyxFQUFFLENBQUM2SyxHQUFILEdBQVMsRUFBVDtBQUNIOztBQUNEN0ssRUFBRSxDQUFDNkssR0FBSCxDQUFPVyxLQUFQLEdBQWU1TCxDQUFmO0FBQ0EwTSxNQUFNLENBQUNDLE9BQVAsR0FBaUIzTSxDQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG8gPSB7XG4gICAgZ2V0UkdCQ29sb3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gbmV3IGNjLkNvbG9yKCk7XG4gICAgICAgIHQuZnJvbUhFWChcIiNcIiA9PT0gZVswXSA/IGUuc3Vic3RyaW5nKDEpIDogZSk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG4gICAgZ2V0UmVtaW5EYXlzOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IERhdGUubm93KCkgLSB0O1xuICAgICAgICByZXR1cm4gZSAtIE1hdGguZmxvb3IobyAvIDg2NGU1KTtcbiAgICB9LFxuICAgIGdldFRvZGF5WmVyb1RpbWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIGUgLSAoZSAlIDg2NGU1KTtcbiAgICB9LFxuICAgIGdldFRvZGF5TGFzdFRpbWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHQgPSBuZXcgRGF0ZShlLmdldEZ1bGxZZWFyKCksIGUuZ2V0TW9udGgoKSwgZS5nZXREYXRlKCksIDIzLCA1OSwgNTkpO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigodCAtIGUpIC8gMWUzKTtcbiAgICB9LFxuICAgIGdldEN1ckRheUluWWVhcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcbiAgICAgICAgdmFyIHQgPSBuZXcgRGF0ZSgpIC0gbmV3IERhdGUoZSkgKyAyODhlNTtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh0IC8gODY0ZTUpICsgMTtcbiAgICB9LFxuICAgIGdldERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICByZXR1cm4gMWU0ICogZS5nZXRGdWxsWWVhcigpICsgMTAwICogZS5nZXRNb250aCgpICsgZS5nZXREYXRlKCk7XG4gICAgfSxcbiAgICBnZXRTdGFydE9mV2VlazogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciB0ID0gZS5nZXREYXkoKTtcbiAgICAgICAgdmFyIG87XG4gICAgICAgIGlmICgwID09IHQpIHtcbiAgICAgICAgICAgIG8gPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG8gPSAxIC0gdDtcbiAgICAgICAgfVxuICAgICAgICBlLnNldERhdGUoZS5nZXREYXRlKCkgKyBvKTtcbiAgICAgICAgZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgICAgcmV0dXJuIGUuZ2V0VGltZSgpO1xuICAgIH0sXG4gICAgZ2V0Q3VyRGF5SW5XZWVrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gbmV3IERhdGUoKS5nZXREYXkoKTtcbiAgICAgICAgaWYgKDAgPT0gZSkge1xuICAgICAgICAgICAgcmV0dXJuIDc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZm9ybWF0SXRlbU51bTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBlO1xuICAgICAgICBpZiAodCA8IDFlNCkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBwYXJzZUludCh0IC8gMWUzKTtcbiAgICAgICAgcmV0dXJuIChvID0gKHQgLyAxZTMpLnRvRml4ZWQoKHQgLSAxZTMgKiBvKSAlIDEwMCA9PSAwID8gMSA6IDIpKSArIFwia1wiO1xuICAgIH0sXG4gICAgZm9yYW10QXR0cmlidXRlTnVtOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IGU7XG4gICAgICAgIGlmICgoMTAgKiBlKSAlIDEwID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0LnRvRml4ZWQoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdC50b0ZpeGVkKDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByYW5kb21XZWlnaHRJbmRleDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSAwO1xuICAgICAgICB2YXIgbyA9IFswXTtcbiAgICAgICAgdmFyIGEgPSBlLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBhOyBuKyspIHtcbiAgICAgICAgICAgIHQgKz0gZVtuXTtcbiAgICAgICAgICAgIG8ucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IE1hdGgucmFuZG9tKCkgKiBvW28ubGVuZ3RoIC0gMV0gLSAxO1xuICAgICAgICB2YXIgYyA9IDA7XG4gICAgICAgIHZhciBzID0gMDtcbiAgICAgICAgdmFyIHIgPSAwO1xuICAgICAgICBmb3IgKHZhciBsID0gby5sZW5ndGggLSAxOyByIDwgbDsgKSB7XG4gICAgICAgICAgICBpZiAoKHMgPSBvWyhjID0gcGFyc2VJbnQoKHIgKyBsKSAvIDIpKSArIDFdKSA8IGkpIHtcbiAgICAgICAgICAgICAgICByID0gYyArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghKHMgPiBpKSkge1xuICAgICAgICAgICAgICAgICAgICByID0gYztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGwgPSBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG4gICAgZ2V0WkluZGV4OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gZS56SW5kZXg7XG4gICAgfSxcbiAgICBjaGVja1pJbmRleDogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgcmV0dXJuIGUuekluZGV4IDw9IHQuekluZGV4O1xuICAgIH0sXG4gICAgZ2V0VGFyZ2V0TGVuZ3RoOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICByZXR1cm4gZS5wb3NpdGlvbi5zdWIodC5wb3NpdGlvbikubGVuKCk7XG4gICAgfSxcbiAgICBfd2l0aGluVGFyZ2V0OiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IGUuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgdmFyIGEgPSB0LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigpKTtcbiAgICAgICAgdmFyIG4gPSBlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihhKTtcbiAgICAgICAgcmV0dXJuIG8uY29udGFpbnMobik7XG4gICAgfSxcbiAgICBfd2l0aGluVGFyZ2V0UGxhY2U6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIHZhciBvID0gZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICB2YXIgYSA9IHQuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgdmFyIG4gPSBlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihhKTtcbiAgICAgICAgcmV0dXJuIG8uY29udGFpbnMobik7XG4gICAgfSxcbiAgICBfd2l0aGluVGFyZ2V0U3VuOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IGUuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgdmFyIGEgPSB0LmdldExvY2F0aW9uKCk7XG4gICAgICAgIHZhciBuID0gZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIoYSk7XG4gICAgICAgIHJldHVybiBvLmNvbnRhaW5zKG4pO1xuICAgIH0sXG4gICAgZ2V0U3BpbmVDdXJyZW50TmFtZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUuYW5pbWF0aW9uO1xuICAgIH0sXG4gICAgZ2V0VGFyZ2V0Tm9kZUNvbXBvbmVudDogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgcmV0dXJuIGUuZ2V0Q29tcG9uZW50KHQpO1xuICAgIH0sXG4gICAgQ29tcHV0ZUJ1bGxldFBvc2l0aW9uOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IGNjLnYyKHQud29ybGRYLCB0LndvcmxkWSk7XG4gICAgICAgIHJldHVybiBlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihvKTtcbiAgICB9LFxuICAgIENvbXB1dGVEaXN0YW5jZTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgdmFyIG8gPSBlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigpKTtcbiAgICAgICAgdmFyIGEgPSB0LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigpKTtcbiAgICAgICAgcmV0dXJuIG8uc3ViKGEpLm1hZygpO1xuICAgIH0sXG4gICAgQ29tcHV0ZUxpc3RTdW06IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBlLnJlZHVjZShmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICAgICAgcmV0dXJuIGUgKyB0O1xuICAgICAgICB9LCAwKTtcbiAgICB9LFxuICAgIGdldFJvdGF0aW9uUmFkaWFuczogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgdmFyIG8gPSB0LnN1YihlKTtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIoby55LCBvLngpO1xuICAgIH0sXG4gICAgc2h1ZmZsZUFycmF5OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdDtcbiAgICAgICAgdmFyIG87XG4gICAgICAgIGZvciAodmFyIGEgPSBlLmxlbmd0aDsgYTsgKSB7XG4gICAgICAgICAgICBvID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYS0tKTtcbiAgICAgICAgICAgIHQgPSBlW2FdO1xuICAgICAgICAgICAgZVthXSA9IGVbb107XG4gICAgICAgICAgICBlW29dID0gdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZTtcbiAgICB9LFxuICAgIGNvbXBhcmVWZXJzaW9uOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBlID0gZS5zcGxpdChcIi5cIik7XG4gICAgICAgIHQgPSB0LnNwbGl0KFwiLlwiKTtcbiAgICAgICAgZm9yICh2YXIgbyA9IE1hdGgubWF4KGUubGVuZ3RoLCB0Lmxlbmd0aCk7IGUubGVuZ3RoIDwgbzsgKSB7XG4gICAgICAgICAgICBlLnB1c2goXCIwXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyB0Lmxlbmd0aCA8IG87ICkge1xuICAgICAgICAgICAgdC5wdXNoKFwiMFwiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IG87IGErKykge1xuICAgICAgICAgICAgdmFyIG4gPSBwYXJzZUludChlW2FdKTtcbiAgICAgICAgICAgIHZhciBpID0gcGFyc2VJbnQodFthXSk7XG4gICAgICAgICAgICBpZiAobiA+IGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuIDwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIGZvcm1hdENEVGltZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBcIlwiO1xuICAgICAgICB2YXIgbyA9IGUgJSA2MDtcbiAgICAgICAgaWYgKGUgPj0gODY0MDApIHtcbiAgICAgICAgICAgIHQgKz0gTWF0aC5mbG9vcihlIC8gODY0MDApICsgXCLlpKlcIjtcbiAgICAgICAgICAgIHQgKz0gTWF0aC5mbG9vcigoZSAvIDM2MDApICUgMjQpICsgXCLlsI/ml7ZcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlID49IDM2MDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHQgKz0gTWF0aC5mbG9vcihlIC8gMzYwMCkgKyBcIuWwj+aXtlwiKSArIE1hdGguZmxvb3IoKGUgLyA2MCkgJSA2MCkgKyBcIuWIhlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUgPiA2MCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAodCArPSBNYXRoLmZsb29yKChlIC8gNjApICUgNjApICsgXCLliIZcIikgKyBNYXRoLmZsb29yKG8pICsgXCLnp5JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvID4gMCkge1xuICAgICAgICAgICAgICAgIHQgKz0gTWF0aC5mbG9vcihvKSArIFwi56eSXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfSxcbiAgICBmb3JtYXRTZWNvbmRzMzogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBNYXRoLmZsb29yKGUgLyAzNjAwKTtcbiAgICAgICAgZSAtPSAzNjAwICogdDtcbiAgICAgICAgdmFyIG8gPSBNYXRoLmZsb29yKGUgLyA2MCk7XG4gICAgICAgIHZhciBhID0gZSAlIDYwO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKHQgPSB0LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpKSArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICAobyA9IG8udG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIikpICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIGEudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIilcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGZvcm1hdFNlY29uZHM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gZSAlIDYwO1xuICAgICAgICB2YXIgbyA9IFwiXCI7XG4gICAgICAgIGlmIChlID49IDM2MDApIHtcbiAgICAgICAgICAgIG8gKz0gTWF0aC5mbG9vcihlIC8gMzYwMCkgKyBcIuWwj+aXtlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlID49IDYwKSB7XG4gICAgICAgICAgICBvICs9IE1hdGguZmxvb3IoKGUgLyA2MCkgJSA2MCkgKyBcIuWIhlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgbyArPSBNYXRoLmZsb29yKHQpICsgXCLnp5JcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbztcbiAgICB9LFxuICAgIGZvcm1hdFNlY29uZHMyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IGUgJSA2MDtcbiAgICAgICAgdmFyIG8gPSBcIlwiO1xuICAgICAgICBpZiAoZSA+PSA2MCkge1xuICAgICAgICAgICAgdmFyIGEgPSBlIC8gNjA7XG4gICAgICAgICAgICBvICs9ICgoYSA9IHBhcnNlSW50KGEpKSA+PSAxMCA/IGEgOiBcIjBcIiArIGEpICsgXCI6XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvICs9IFwiMDA6XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG8gKyAodCA+IDAgPyAodCA+PSAxMCA/IHQgOiBcIjBcIiArIHQpIDogXCIwMFwiKTtcbiAgICB9LFxuICAgIGdldE5vZGVTZWxmQm91bmRCb3g6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICB0LnggPSBlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigpKS54IC0gdC53aWR0aCAvIDI7XG4gICAgICAgIHQueSA9IGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKCkpLnkgLSB0LmhlaWdodCAvIDI7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG4gICAgZ2V0Tm9kZVNlbGZCb3VuZEJveDI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIGUuX3BhcmVudC5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgICAgIHZhciB0ID0gZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgZS5fY2FsY3VsV29ybGRNYXRyaXgoKTtcbiAgICAgICAgICAgIHQudHJhbnNmb3JtTWF0NCh0LCBlLl93b3JsZE1hdHJpeCk7XG4gICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgIH0sXG4gICAgdXBsb2FkU2NvcmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XG4gICAgICAgICAgICB2YXIgdCA9IFtdO1xuICAgICAgICAgICAgdmFyIG8gPSB7fTtcbiAgICAgICAgICAgIG8ua2V5ID0gU3RyaW5nKFwic1wiKTtcbiAgICAgICAgICAgIG8udmFsdWUgPSBTdHJpbmcoZSk7XG4gICAgICAgICAgICB0LnB1c2gobyk7XG4gICAgICAgICAgICB3eC5zZXRVc2VyQ2xvdWRTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICBLVkRhdGFMaXN0OiB0LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZmFkZUluQnRuOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLm9wYWNpdHkgPSAwO1xuICAgICAgICBlLmFjdGl2ZSA9ICEwO1xuICAgICAgICBlLnJ1bkFjdGlvbihjYy5mYWRlSW4oMC4xNikpO1xuICAgIH0sXG4gICAgYmluZFNwaW5lOiBmdW5jdGlvbiAoZSwgdCwgbykge1xuICAgICAgICB2YXIgYSA9IGUuYXR0YWNoVXRpbC5nZW5lcmF0ZUF0dGFjaGVkTm9kZXModClbMF07XG4gICAgICAgIG8ucGFyZW50ID0gYTtcbiAgICB9LFxuICAgIGdldGJpbmRTcGluZTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgcmV0dXJuIGUuYXR0YWNoVXRpbC5nZW5lcmF0ZUF0dGFjaGVkTm9kZXModClbMF0uY2hpbGRyZW5bMF07XG4gICAgfSxcbiAgICBiaW5kU3BpbmVzOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IGUuYXR0YWNoVXRpbDtcbiAgICAgICAgdC5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdCA9IG8uZ2VuZXJhdGVBdHRhY2hlZE5vZGVzKGUuYm9uZSlbMF07XG4gICAgICAgICAgICBlLm5vZGUucGFyZW50ID0gdDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZW5kTXNnOiBmdW5jdGlvbiAoZSwgdCwgbywgYSkge1xuICAgICAgICBpZiAodm9pZCAwID09PSBhKSB7XG4gICAgICAgICAgICBhID0gNWUzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKG4sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0IHx8IHt9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IG8sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuKGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpKGUpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiBhXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICBjLmRhdGEgPSB0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KGMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChpLCBjKSB7XG4gICAgICAgICAgICB2YXIgcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjKFwiZXJyb3I6eGhyIHN0YXR1cz1cIiArIG4uc3RhdHVzKTtcbiAgICAgICAgICAgICAgICBuID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ4aHIgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgICAgICBuLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgIHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBhKTtcbiAgICAgICAgICAgIG4ub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICg0ID09IG4ucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobi5zdGF0dXMgPj0gMjAwICYmIG4uc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gbi5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPT0gdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoXCJlbXB0eSByZXNwb25zZSwgdXJsOlwiLCBlKSwgaSh7fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBKU09OLnBhcnNlKHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKFwib2JqZWN0XCIgPT0gdHlwZW9mIG8gJiYgbyA/IG8gOiB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc3RhdHVzID49IDQwMCAmJiBzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4aHIgc3RhcnQgYnkgXCIgKyBvICsgXCIgbWV0aG9kIXVybD1cIiArIGUgKyBcIiwgZGF0YT1cIiArIHQpO1xuICAgICAgICAgICAgbi5vcGVuKG8sIGUsICEwKTtcbiAgICAgICAgICAgIGlmIChcIlBPU1RcIiA9PSBvICYmIHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbCA9IG5ldyBCbG9iKFtKU09OLnN0cmluZ2lmeSh0KV0pO1xuICAgICAgICAgICAgICAgIG4uc2VuZChsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbi5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2V0U3ByaXRlRnJhbWU6IGZ1bmN0aW9uIChlLCB0LCBvKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICB0aGlzLnVzZUJ1bmRsZUFzc2V0KHQsIG8sIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIGUuc3ByaXRlRnJhbWUgPSB0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJzcHJpdGUgaXMgbnVsbFwiLCB0LCBvKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0U3ByaXRlRnJhbWVzOiBmdW5jdGlvbiAoZSwgdCwgbykge1xuICAgICAgICB0aGlzLnVzZUJ1bmRsZUFzc2V0KHQsIG8sIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgZS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChlLnNwcml0ZUZyYW1lID0gdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1c2VCdW5kbGVBc3NldDogZnVuY3Rpb24gKGUsIHQsIG8sIGEpIHtcbiAgICAgICAgdmFyIG4gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIG4gPSBlLmdldCh0LCBvKTtcbiAgICAgICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICAgICAgYShuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS5sb2FkKHQsIG8sIGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhKHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBpID0gY2MuYXNzZXRNYW5hZ2VyLmdldEJ1bmRsZShlKTtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIG4oaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIubG9hZEJ1bmRsZShlLCBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWxlYXNlQXNzZXQ6IGZ1bmN0aW9uIChlLCB0LCBvKSB7XG4gICAgICAgIHZhciBhID0gY2MuYXNzZXRNYW5hZ2VyLmdldEJ1bmRsZShlKTtcbiAgICAgICAgaWYgKGEgJiYgYS5nZXQodCwgbykpIHtcbiAgICAgICAgICAgIGEucmVsZWFzZSh0LCBvKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWFudWFsbHlDaGVja0NvbGxpZGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKTtcbiAgICAgICAgdmFyIG8gPSBbXTtcbiAgICAgICAgdmFyIGEgPSB0Ll9jb250YWN0c1swXS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBjID0gdC5fY29sbGlkZXJzO1xuICAgICAgICB2YXIgcyA9IDA7XG4gICAgICAgIGZvciAodmFyIHIgPSBjLmxlbmd0aDsgcyA8IHI7IHMrKykge1xuICAgICAgICAgICAgdmFyIGwgPSBjW3NdO1xuICAgICAgICAgICAgaWYgKHQuc2hvdWxkQ29sbGlkZShlLCBsKSkge1xuICAgICAgICAgICAgICAgIG8ucHVzaChuZXcgYShlLCBsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdC5pbml0Q29sbGlkZXIoZSk7XG4gICAgICAgIHQudXBkYXRlQ29sbGlkZXIoZSk7XG4gICAgICAgIHZhciB1ID0gW107XG4gICAgICAgIG4gPSAwO1xuICAgICAgICBmb3IgKGkgPSBvLmxlbmd0aDsgbiA8IGk7IG4rKykge1xuICAgICAgICAgICAgdmFyIHAgPSBvW25dLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICBpZiAocCAhPT0gYS5Db2xsaXNpb25UeXBlLk5vbmUpIHtcbiAgICAgICAgICAgICAgICB1LnB1c2goW3AsIG9bbl1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuID0gMDtcbiAgICAgICAgZm9yIChpID0gdS5sZW5ndGg7IG4gPCBpOyBuKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gdVtuXTtcbiAgICAgICAgICAgIHQuX2RvQ29sbGlkZShkWzBdLCBkWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdS5sZW5ndGggPiAwO1xuICAgIH0sXG4gICAgbWFudWFsbHlDaGVjazJDb2xsaWRlcjogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgdmFyIG8gPSBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCk7XG4gICAgICAgIHZhciBhID0gby5fY29udGFjdHNbMF0uY29uc3RydWN0b3I7XG4gICAgICAgIG8uaW5pdENvbGxpZGVyKGUpO1xuICAgICAgICBvLmluaXRDb2xsaWRlcih0KTtcbiAgICAgICAgby51cGRhdGVDb2xsaWRlcihlKTtcbiAgICAgICAgby51cGRhdGVDb2xsaWRlcih0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBhKGUsIHQpLnRlc3QoKTtcbiAgICB9LFxuICAgIHVwZGF0ZUNvbGxpZGVyczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCk7XG4gICAgICAgIHZhciBvID0gMDtcbiAgICAgICAgZm9yICh2YXIgYSA9IGUubGVuZ3RoOyBvIDwgYTsgbysrKSB7XG4gICAgICAgICAgICB2YXIgbiA9IGVbb107XG4gICAgICAgICAgICB0LmluaXRDb2xsaWRlcihuKTtcbiAgICAgICAgICAgIHQudXBkYXRlQ29sbGlkZXIobik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldENvbGxpZGVXaXRoOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB2YXIgbyA9IGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKTtcbiAgICAgICAgaWYgKG8uX2NvbnRhY3RzWzBdKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBvLl9jb250YWN0c1swXS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgby5pbml0Q29sbGlkZXIoZSk7XG4gICAgICAgIG8udXBkYXRlQ29sbGlkZXIoZSk7XG4gICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHQubGVuZ3RoOyBuIDwgaTsgbisrKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHRbbl07XG4gICAgICAgICAgICBvLmluaXRDb2xsaWRlcihjKTtcbiAgICAgICAgICAgIG8udXBkYXRlQ29sbGlkZXIoYyk7XG4gICAgICAgICAgICBpZiAobmV3IGEoZSwgYykudGVzdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBpblJhbmdlMjogZnVuY3Rpb24gKGUsIHQsIG8pIHtcbiAgICAgICAgdmFyIGEgPSBvLnggLSBlLng7XG4gICAgICAgIHZhciBuID0gby55IC0gZS55O1xuICAgICAgICByZXR1cm4gYSAqIGEgKyAobiAqIG4pIC8gMC40OSA8PSB0O1xuICAgIH0sXG4gICAgZ2V0UmV3YXJkSXRlbTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgdmFyIG8gPSBuZXcgY2MucHZ6LkdhbWVDb25maWcuUmV3YXJkRGF0YSgpO1xuICAgICAgICBvLml0ZW1JZCA9IGU7XG4gICAgICAgIG8uY291bnQgPSB0O1xuICAgICAgICBvLnRvb2xJZCA9IC0xO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9LFxuICAgIGdldFJld2FyZFRvb2xJdGVtOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAodm9pZCAwID09PSB0KSB7XG4gICAgICAgICAgICB0ID0gMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbyA9IG5ldyBjYy5wdnouR2FtZUNvbmZpZy5SZXdhcmREYXRhKCk7XG4gICAgICAgIG8uaXRlbUlkID0gY2MucHZ6LkdhbWVDb25maWcuSXRlbVR5cGVbXCLlm7rlrprnoo7niYdcIl07XG4gICAgICAgIG8uY291bnQgPSB0O1xuICAgICAgICBvLnRvb2xJZCA9IGU7XG4gICAgICAgIHJldHVybiBvO1xuICAgIH0sXG4gICAgb25DaGVja1JhbmRvbVRvb2w6IGZ1bmN0aW9uIChlLCB0LCBvKSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IG8pIHtcbiAgICAgICAgICAgIG8gPSAhMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICB2YXIgbiA9IGNjLkpzb25Db250cm9sLmdldEl0ZW1Kc29uKGUuaXRlbUlkKTtcbiAgICAgICAgdmFyIGkgPSBjYy5wdnoudXRpbHMuZ2V0T3BlblRvb2xMaXN0KG4uUXVhbGl0eSwgbyk7XG4gICAgICAgIGlmICgwID09IGkubGVuZ3RoKSB7XG4gICAgICAgICAgICBpLnB1c2goNyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGlbY2MubWF0aC5yYW5kb21SYW5nZUludCgwLCBpLmxlbmd0aCldO1xuICAgICAgICAgICAgdmFyIHQgPSBjYy5wdnoudXRpbHMuZ2V0UmV3YXJkVG9vbEl0ZW0oZSwgMSk7XG4gICAgICAgICAgICB2YXIgbyA9IGEuZmluZChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0LnRvb2xJZCA9PSBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIG8uY291bnQrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGUuY291bnQ7IHMrKykge1xuICAgICAgICAgICAgYygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgYS5sZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgdC5wdXNoKGFbcl0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcGVuVG9vbExpc3Q6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAhMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbyA9IGNjLnB2ei5QbGF5ZXJEYXRhLmdldFN0YWdlTGV2ZWwoKTtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgdmFyIG4gPSBjYy5wdnouR2FtZUNvbmZpZ1tcIlF1YWxpdHlcIiArIGUgKyBcIlRvb2xzXCJdO1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBuW2ldO1xuICAgICAgICAgICAgICAgIGlmIChvID4gY2MucHZ6LkdhbWVDb25maWcuVG9vbExvY2tMZXZlbFtjIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH0sXG4gICAgZ2V0TGV2ZWxJbnRlcnZhbDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSBbXG4gICAgICAgICAgICBbMCwgM10sXG4gICAgICAgICAgICBbNCwgN10sXG4gICAgICAgICAgICBbOCwgMTFdLFxuICAgICAgICAgICAgWzEyLCAxNV0sXG4gICAgICAgICAgICBbMTYsIDk5OV1cbiAgICAgICAgXTtcbiAgICAgICAgZm9yICh2YXIgbyA9IDA7IG8gPCB0Lmxlbmd0aDsgbysrKSB7XG4gICAgICAgICAgICBpZiAoZSA+PSB0W29dWzBdICYmIGUgPD0gdFtvXVsxXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIG9uQ2hhbmdlQ05OVW06IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIiwgXCLljYFcIl1bZSAtIDFdO1xuICAgIH0sXG4gICAgc3BpbmVGcm9tVG86IGZ1bmN0aW9uIChlLCB0LCBvLCBhLCBuKSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IGEpIHtcbiAgICAgICAgICAgIGEgPSAhMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodm9pZCAwID09PSBuKSB7XG4gICAgICAgICAgICBuID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgZS5zZXRBbmltYXRpb24oMCwgdCwgITEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gbjtcbiAgICAgICAgZS5zZXRDb21wbGV0ZUxpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGUuc2V0QW5pbWF0aW9uKDAsIG8sIGEpO1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICBpKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5pZiAoY2MucHZ6KSB7XG4gICAgLy9cbn0gZWxzZSB7XG4gICAgY2MucHZ6ID0ge307XG59XG5jYy5wdnoudXRpbHMgPSBvO1xubW9kdWxlLmV4cG9ydHMgPSBvO1xuIl19