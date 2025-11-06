"use strict";
cc._RF.push(module, '5d7fa5ix3RGmr2YNPNDOpd8', 'Cloud');
// scripts/Cloud.js

"use strict";

var o = "https://yiyouzan.cn/xsapi/rabbit/";
var a = {
  uid: null,
  header: null,
  access: 0,
  isGM: !1,
  needSaveToCloud: 0,
  baseData: "{}",
  login: function login(e) {
    var t = this;

    if (cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.WIN32 || cc.sys.platform == cc.sys.MOBILE_BROWSER) {
      this.access = 100;
      return void e(!0);
    }

    var o = function o(t) {
      if (e) {
        e(t);
      }
    };

    console.log("perpare p8 login");
    P8SDK.login().then(function (e) {
      var a = e.data.openid;
      t.loginSelf(a, o);
    });
  },
  loginSelf: function loginSelf(e, t) {
    var a = this;
    var n = o + (cc.sys.platform == cc.sys.BYTEDANCE_GAME ? "user/bytelogin2" : "/user/p8loginkp");
    wx.request({
      url: n,
      method: "POST",
      data: {
        loginCode: e
      },
      success: function success(e) {
        console.log("login success:", e.data);

        if (e.data["new"]) {
          cc.pvz.TAUtils.uploadRegisterData({
            uid: e.data.uid
          });
        }

        a.uid = e.data.uid;

        if (e.data.name) {
          a.name = e.data.name;
        } else {
          a.name = "玩家" + a.uid;
        }

        a.access = e.data.access;
        a.header = {
          uid: e.data.uid,
          uToken: e.data.token
        };
        a.isGM = e.data.access;
        a.getOnlineData(t);
      },
      fail: function fail() {
        t(!1);
      }
    });
  },
  req: function req(e, t, a, n) {
    wx.request({
      url: o + e,
      method: t ? "POST" : "GET",
      header: this.header,
      data: a,
      success: function success(e) {
        console.log("req success, data:", e.data);
        n(!0, e.data);
      },
      fail: function fail(e) {
        console.log("req fail, errMsg:", e.errMsg);
        n(!1);
      }
    });
  },
  getOnlineData: function getOnlineData(e) {
    var t = this;
    wx.request({
      url: o + "game/infokp",
      method: "GET",
      header: t.header,
      success: function success(o) {
        if (1 == o.data.ok) {
          t.baseData = o.data.baseData;
          e(!0);
        } else {
          e(!1);
        }
      },
      fail: function fail(t) {
        console.log("info errMsg:", t.errMsg);
        e(!1);
      }
    });
  },
  checkUpdatePlayerInfo: function checkUpdatePlayerInfo(e, t) {
    var o = this;

    if (this.uid) {
      this.updatePlayerInfo(e, t);
    } else {
      this.login(function (a) {
        if (a) {
          o.updatePlayerInfo(e, t);
        } else {
          t(!1);
        }
      });
    }
  },
  updatePlayerInfo: function updatePlayerInfo(e, t) {
    console.log("updatePlayerInfo");

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var a = 0;
      var n = !0;

      var i = function i(e) {
        if (e) {//
        } else {
          n = !1;
        }

        if (++a >= 0) {
          t(n);
        }
      };

      var c = JSON.stringify(e);
      wx.request({
        url: o + "game/setbaseinfokp",
        method: "POST",
        header: this.header,
        data: {
          lv: cc.pvz.PlayerData.getAchieveProgress(cc.pvz.GameConfig.MissionType["装备总等级n"]),
          info: c
        },
        success: function success(e) {
          console.log("setbaseinfo success:", e.data);
          i(1 == e.data.ok);

          if (0 == e.data.ok && "not login" == e.data.rsn) {
            wx.showToast({
              title: "登录已失效",
              icon: "success",
              duration: 1500
            });
          }
        },
        fail: function fail(e) {
          console.log("setbaseinfo errMsg:", e.errMsg);
          i(!1);
        }
      });
      this.sendC++;
    } else {
      t(!0);
    }
  },
  setAvatar: function setAvatar(e, t, a) {
    wx.request({
      url: o + "game/authkp",
      method: "POST",
      header: this.header,
      data: {
        name: e,
        avatarUrl: t
      },
      success: function success(e) {
        console.log("authkp success:", e.data);
        a(1 == e.data.ok);
      },
      fail: function fail(e) {
        console.log("authkp fail:", e.errMsg);
        a(!1);
      }
    });
  },
  uploadScore: function uploadScore(e, t, a, n) {
    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
      console.log("update score:", e, ",exInfo:", t, ",exInfo2:", a);
      return void setTimeout(function () {
        n(!0);
      });
    }

    wx.request({
      url: o + "game/updatescorekp",
      method: "POST",
      header: this.header,
      data: {
        score: e,
        exInfo: t,
        exInfo2: a
      },
      success: function success(e) {
        console.log("updatescorekp success:", e.data);
        n(1 == e.data.ok);
      },
      fail: function fail(e) {
        console.log("updatescorekp fail:", e.errMsg);
        n(!1);
      }
    });
  },
  myRank: function myRank(e) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.request({
        url: o + "game/myrankkp",
        method: "GET",
        header: this.header,
        success: function success(t) {
          console.log("myrankkp success:", t.data);
          e(1 == t.data.ok, t.data);
        },
        fail: function fail(t) {
          console.log("myrankkp fail:", t.errMsg);
          e(!1);
        }
      });
    } else {
      setTimeout(function () {
        e(!0, {
          ok: 1,
          rank: 0,
          info: {
            uid: 40303867,
            sector: 2,
            name: "momo",
            avatarUrl: "",
            score: 13,
            exInfo: "",
            isCheat: 0,
            rankLastWeek: 4
          }
        });
      });
    }
  },
  rankList: function rankList(e, t) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.request({
        url: o + "game/ranklistkp",
        method: "POST",
        header: this.header,
        data: {
          fromIdx: e
        },
        success: function success(e) {
          console.log("ranklistkp success:", e.data);
          t(1 == e.data.ok, e.data.ret);
        },
        fail: function fail(e) {
          console.log("ranklistkp fail:", e.errMsg);
          t(!1);
        }
      });
    } else {
      setTimeout(function () {
        t(!0, [{
          rank: 0,
          uInfo: {
            uid: 40000006,
            sector: 2,
            name: "NONAME",
            avatarUrl: "",
            score: 15,
            exInfo: "8",
            isCheat: 0
          }
        }]);
      });
    }
  },
  makeFriend: function makeFriend() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      if (wx.getEnterOptionsSync) {
        var e = wx.getEnterOptionsSync();

        if (e.query && e.query.fromuid) {
          console.log("setrelationkp to", e.query.fromuid);
          this.req("game/setrelationkp", !0, {
            uid2: parseInt(e.query.fromuid)
          }, function (t, o) {
            console.log("setrelationkp to", e.query.fromuid, t, o);
          });
        } else {
          console.log("no query!", e);
        }
      } else {
        console.log("no option func");
      }
    } else {
      console.log("make friend relation.");
    }
  },
  updatePlayerSub: function updatePlayerSub(e) {
    var t = o + "game/subscribekp";

    if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
      tt.request({
        url: t,
        method: "POST",
        header: this.header,
        data: {
          flag: e
        },
        success: function success(e) {
          console.log("subscribe success:", e.data);
        },
        fail: function fail(e) {
          console.log("subscribe fail:", e.errMsg);
        }
      });
    } else {
      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        wx.request({
          url: t,
          method: "POST",
          header: this.header,
          data: {
            flag: e
          },
          success: function success(e) {
            console.log("subscribe success:", e.data);
          },
          fail: function fail(e) {
            console.log("subscribe fail:", e.errMsg);
          }
        });
      }
    }
  }
};

if (cc.pvz) {//
} else {
  cc.pvz = {};
}

cc.pvz.cloud = a;
module.exports = a;

cc._RF.pop();