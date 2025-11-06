
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/PlayerData.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7398erhmudN35OfMQ/PJA65', 'PlayerData');
// scripts/PlayerData.js

"use strict";

cc.ToolItem = cc.Class({
  name: "ToolItem",
  properties: {
    lv: cc.Integer,
    c: cc.Integer
  }
});
var o = {
  newData: function newData() {
    var e = {
      dataVersion: 1,
      t: -1,
      isMMute: !1,
      isSMute: !1,
      itemData: {},
      power: 20,
      powerDate: -1,
      powerBuyDate: -1,
      powerBuyTimes: [5, 3],
      toolData: {},
      gameDate: -1,
      level: 1,
      levelWave: 0,
      sweepTimes: 5,
      levelBoxData: {},
      actLevelDate: -1,
      actLevelData: {
        level: 0,
        times: 3,
        score: 0,
        buffList: [-1, -1],
        boxStatus: [0, 0, 0, 0]
      },
      shopDate: -1,
      isNewShop: !0,
      shopDailyData: {},
      shopTimesData: [20, 1, 7],
      shopBoxData: {
        lv: 1,
        exp: 0,
        date: [-1, -1]
      },
      isShare: !1,
      shareDate: -1,
      shareTimes: 10,
      adBuffDate: -1,
      adBuffTimes: [10, 3],
      adBuyData: {
        bank: [3, 3],
        toolBuy: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        actTimes: 1
      },
      guide1: 0,
      signDate: -1,
      signData: {
        signDay: 1,
        isReward: !1
      },
      dayMissionDate: -1,
      dayMissionData: {},
      dayBoxData: {},
      weekMissionDate: -1,
      weekMissionData: {},
      weekBoxData: {},
      achievePro: {},
      achieveData: {},
      adTimes: 0
    };
    e.regTime = Date.now();
    e.free3b = 1;
    e.rankCount = 2;
    cc.player = e;
  },
  postLoadData: function postLoadData() {
    if (cc.player.dataVersion < 1) {
      cc.player.dataVersion = 1;
      this.saveData(!0);
    }
  },
  initPlayerData: function initPlayerData() {
    var e = cc.sys.localStorage.getItem("kapipack1");

    if (e) {
      cc.player = JSON.parse(e);
      cc.pvz.TAUtils.trackLogin(!1);
    } else {
      console.log("New Player initPlayer");
      this.newData();
      console.log("初始化 背包");
      this.initBaseToolData();
      this.initBaseItemData();
      cc.pvz.cloud.needSaveToCloud = 0;
      cc.pvz.TAUtils.trackLogin(!0);
    }

    this.postLoadData();
  },
  saveData: function saveData() {
    if (cc.player) {
      cc.sys.localStorage.setItem("kapipack1", JSON.stringify(cc.player));
    }
  },
  clearData: function clearData() {
    cc.sys.localStorage.removeItem("kapipack1");
  },
  onDataChanged: function onDataChanged() {
    this.saveData();
    cc.pvz.cloud.needSaveToCloud++;
  },
  saveDataToLocalOnlineCore: function saveDataToLocalOnlineCore(e) {
    var t = this;
    var o = Date.now();
    var a = JSON.parse(JSON.stringify(cc.player));
    a.t = o;
    cc.pvz.cloud.checkUpdatePlayerInfo(a, function (a) {
      if (e) {
        cc.player.t = o;
        t.saveData();
        e(a);
      }
    });
    cc.storageTime = Date.now();
  },
  saveDataToLocalOnline: function saveDataToLocalOnline(e) {
    var t = this;
    this.saveDataToLocalOnlineCore(e);

    if (cc.storageTimeId) {
      clearTimeout(cc.storageTimeId);
      cc.storageTimeId = null;
    }

    cc.storageTimeId = setTimeout(function () {
      t.saveDataToLocalOnlineCore();
    }, 3e5);
  },
  getZeroOClock: function getZeroOClock(e) {
    var t = new Date(e);
    var o = t.getFullYear();
    var a = t.getMonth();
    var n = t.getDate();
    return new Date(o, a, n).getTime();
  },
  hasPastOneDay: function hasPastOneDay() {
    return this.getZeroOClock(Date.now()) - this.getZeroOClock(cc.player.regTime) > 0;
  },
  initBaseItemData: function initBaseItemData() {
    var e = [2, 3];
    var t = [500, 0];

    for (var o = 0; o < e.length; o++) {
      this.changeItemNum(e[o], t[o]);
    }
  },
  changeItemNum: function changeItemNum(e, t) {
    if (cc.player.itemData.hasOwnProperty(e)) {
      cc.player.itemData[e] += t;
    } else {
      cc.player.itemData[e] = t;
    }

    if (e == cc.pvz.GameConfig.ItemType["金币"] && t > 0) {
      this.addMissionProgress(cc.pvz.GameConfig.MissionType["累计获得金币"], t);
    } else {
      if (e == cc.pvz.GameConfig.ItemType["钻石"] && t < 0) {
        this.addMissionProgress(cc.pvz.GameConfig.MissionType["累计消耗钻石"], Math.abs(t));
      }
    }

    this.onDataChanged();
  },
  setItemNum: function setItemNum(e, t) {
    cc.player.itemData[e] = t;
  },
  getItemNum: function getItemNum(e) {
    if (cc.player.itemData.hasOwnProperty(e)) {
      return cc.player.itemData[e];
    } else {
      return 0;
    }
  },
  isItemEnough: function isItemEnough(e, t) {
    return !!cc.player.itemData.hasOwnProperty(e) && cc.player.itemData[e] >= t;
  },
  initBaseToolData: function initBaseToolData() {
    cc.player.toolData = {};

    for (var e = 0; e < cc.pvz.GameConfig.MaxToolCount; e++) {
      var t = e + 1;
      var o;

      if (1 == t) {
        o = 5;
      } else {
        o = 0;
      }

      var a;

      if (e < 6) {
        a = e;
      } else {
        a = -1;
      }

      cc.player.toolData[t] = {
        lv: 1,
        c: o,
        pos: a
      };
    }

    this.saveData();
  },
  getToolData: function getToolData(e) {
    if (cc.player.toolData.hasOwnProperty(e)) {//
    } else {
      cc.player.toolData[e] = {
        lv: 1,
        c: 0,
        pos: -1
      };
      this.onDataChanged();
    }

    return cc.player.toolData[e];
  },
  updateToolLv: function updateToolLv(e, t) {
    if (cc.player.toolData.hasOwnProperty(e)) {
      cc.player.toolData[e].lv += t;
      this.onDataChanged();
    } else {
      console.log("道具不存在", e);
    }
  },
  updateToolFragCount: function updateToolFragCount(e, t) {
    if (cc.player.toolData.hasOwnProperty(e)) {
      cc.player.toolData[e].c += t;
      this.onDataChanged();
    } else {
      console.log("道具不存在", e);
    }
  },
  isEnoughArrayTool: function isEnoughArrayTool() {
    var e = 6;

    if (cc.player.level > cc.pvz.GameConfig.ArrayPlaceOpLv[1]) {
      e = 8;
    } else {
      if (cc.player.level > cc.pvz.GameConfig.ArrayPlaceOpLv[0]) {
        e = 7;
      }
    }

    var t = 0;

    for (var o = 0; o < cc.pvz.GameConfig.MaxToolCount; o++) {
      if (-1 != cc.player.toolData[o + 1].pos) {
        t++;
      }
    }

    return t >= e;
  },
  checkAndResetPowetBuy: function checkAndResetPowetBuy() {
    var e = new Date().getDate();

    if (e != cc.player.powerBuyDate) {
      cc.player.powerBuyDate = e;
      cc.player.powerBuyTimes = [5, 3];
      this.onDataChanged();
    }
  },
  getPowerBuyTimes: function getPowerBuyTimes(e) {
    if (void 0 === e) {
      e = !1;
    }

    return cc.player.powerBuyTimes[e ? 0 : 1];
  },
  updatePowerBuyTimes: function updatePowerBuyTimes(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    cc.player.powerBuyTimes[e ? 0 : 1] -= t;
    this.onDataChanged();
  },
  isHaveBuyPowerTimes: function isHaveBuyPowerTimes() {
    return cc.player.powerBuyTimes[0] + cc.player.powerBuyTimes[1] > 0;
  },
  usePlayerPower: function usePlayerPower(e) {
    cc.player.power += e;

    if (this.isMaxPower()) {//
    } else {
      cc.player.powerDate = Date.now() + 1e3 * cc.pvz.GameConfig.CdPowerTime;
    }

    this.onDataChanged();
  },
  addPower: function addPower(e, t) {
    if (void 0 === t) {
      t = !1;
    }

    cc.player.power += e;

    if (this.isMaxPower()) {
      if (t) {
        cc.player.power = cc.player.power;
      } else {
        cc.player.power = this.getMaxPower();
      }

      cc.player.powerDate = -1;
    } else {
      cc.player.powerDate = Date.now() + 1e3 * cc.pvz.GameConfig.CdPowerTime;
    }

    this.onDataChanged();
  },
  isMaxPower: function isMaxPower() {
    return cc.player.power >= this.getMaxPower();
  },
  getMaxPower: function getMaxPower() {
    return cc.pvz.GameConfig.MaxPower;
  },
  getPower: function getPower() {
    return cc.player.power;
  },
  getPowerDate: function getPowerDate() {
    return cc.player.powerDate;
  },
  updatePowerDate: function updatePowerDate() {
    cc.player.powerDate = Date.now();
    this.onDataChanged();
  },
  checkAndResetActLevel: function checkAndResetActLevel() {
    var e = new Date().getDate();

    if (e != cc.player.actLevelDate) {
      cc.player.actLevelDate = e;
      cc.player.actLevelData.times = 3;
      cc.player.actLevelData.score = 0;
      cc.player.actLevelData.buffList = [-1, -1];
      cc.player.actLevelData.boxStatus = [0, 0, 0, 0];

      if (cc.player.actLevelData.level < 2) {
        cc.player.actLevelData.level++;
      } else {
        cc.player.actLevelData.level = 1;
      }

      this.onDataChanged();
    }
  },
  getActLevelData: function getActLevelData() {
    return cc.player.actLevelData;
  },
  updateActLevelTimes: function updateActLevelTimes() {
    cc.player.actLevelData.times--;
    this.onDataChanged();
  },
  updateActLevelScore: function updateActLevelScore(e) {
    cc.player.actLevelData.score += e;
    this.onDataChanged();
  },
  updateActLevelBuff: function updateActLevelBuff(e, t) {
    cc.player.actLevelData.buffList[e - 1] = t;
    this.onDataChanged();
  },
  updateActLevelBoxStatus: function updateActLevelBoxStatus(e) {
    cc.player.actLevelData.boxStatus[e - 1] = 1;
    this.onDataChanged();
  },
  checkAndResetGameDate: function checkAndResetGameDate() {
    var e = new Date().getDate();

    if (e != cc.player.gameDate) {
      cc.player.gameDate = e;
      cc.player.sweepTimes = 5;
      cc.player.adTimes = 0;
      cc.player.rankCount = 2;
      this.onDataChanged();
    }
  },
  getSweepTimes: function getSweepTimes() {
    return cc.player.sweepTimes;
  },
  updateSweepTimes: function updateSweepTimes() {
    cc.player.sweepTimes--;
    this.onDataChanged();
  },
  updateStageLevel: function updateStageLevel(e) {
    if (void 0 === e) {
      e = 1;
    }

    if (cc.player.level < cc.pvz.GameConfig.MaxLevel) {
      cc.player.level += e;
    }

    cc.player.levelWave = 0;
    cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通过主线章节n"], cc.player.level - 1);
    this.onDataChanged();
    cc.pvz.TAUtils.uploadLvUpData();
  },
  getStageLevel: function getStageLevel() {
    return cc.player.level;
  },
  getMaxLevelWave: function getMaxLevelWave() {
    return cc.player.levelWave;
  },
  updateMaxLevelWave: function updateMaxLevelWave(e) {
    if (cc.player.levelWave < e) {
      cc.player.levelWave = e;
      this.onDataChanged();
    }
  },
  getLevelBoxData: function getLevelBoxData(e) {
    if (cc.player.levelBoxData.hasOwnProperty(e)) {//
    } else {
      cc.player.levelBoxData[e] = [0, 0, 0];
      this.onDataChanged();
    }

    return cc.player.levelBoxData[e];
  },
  updateLevelBoxData: function updateLevelBoxData(e, t) {
    if (cc.player.levelBoxData.hasOwnProperty(e)) {//
    } else {
      cc.player.levelBoxData[e] = [0, 0, 0];
    }

    cc.player.levelBoxData[e][t - 1] = 1;
    this.onDataChanged();
  },
  checkAndResetShop: function checkAndResetShop() {
    var e = new Date().getDate();

    if (e != cc.player.shopDate) {
      cc.player.shopDate = e;
      cc.player.shopDailyData = {};
      cc.player.shopTimesData = [20, 1, 7];
      cc.player.isNewShop = !0;
      this.onDataChanged();
    }
  },
  updateShopTimes: function updateShopTimes(e) {
    cc.player.shopTimesData[e]--;
    this.onDataChanged();
  },
  getShopTimes: function getShopTimes(e) {
    return cc.player.shopTimesData[e];
  },
  isNewShopStatus: function isNewShopStatus() {
    return cc.player.isNewShop;
  },
  changeShopStatus: function changeShopStatus() {
    cc.player.isNewShop = !1;
    this.onDataChanged();
  },
  addShopData: function addShopData(e, t) {
    if (cc.player.shopDailyData.hasOwnProperty(e)) {
      console.log(" Error Add Shop Data :", e);
    } else {
      cc.player.shopDailyData[e] = t;
      this.onDataChanged();
    }
  },
  setShopData: function setShopData(e, t) {
    cc.player.shopDailyData[e] = t;
    this.onDataChanged();
  },
  getShopData: function getShopData(e) {
    if (cc.player.shopDailyData.hasOwnProperty(e)) {//
    } else {
      cc.player.shopDailyData[e] = null;
    }

    return cc.player.shopDailyData[e];
  },
  updateShopDataBuy: function updateShopDataBuy(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    if (cc.player.shopDailyData.hasOwnProperty(e)) {
      cc.player.shopDailyData[e].buyTimes -= t;
      this.onDataChanged();
    } else {
      console.log(" Error Add Shop Data :", e);
    }
  },
  getShopBoxData: function getShopBoxData() {
    return cc.player.shopBoxData;
  },
  updateShopBoxDate: function updateShopBoxDate(e, t) {
    cc.player.shopBoxData.date[e - 1] = t;
    this.onDataChanged();
  },
  updateShopBoxExp: function updateShopBoxExp(e) {
    if (cc.player.shopBoxData.lv < 10) {
      cc.player.shopBoxData.exp += e;
      this.onDataChanged();
    }
  },
  updateShopBoxlV: function updateShopBoxlV(e, t) {
    cc.player.shopBoxData.exp = t;

    if (cc.player.shopBoxData.lv < 10) {
      cc.player.shopBoxData.lv += e;
    }

    this.onDataChanged();
  },
  checkAndResetShare: function checkAndResetShare() {
    var e = new Date().getDate();

    if (e != cc.player.shareDate) {
      cc.player.shareDate = e;
      cc.player.isShare = !1;
      cc.player.shareTimes = 10;
      this.onDataChanged();
    }
  },
  getShareTimes: function getShareTimes() {
    return cc.player.shareTimes;
  },
  updateShareTimes: function updateShareTimes() {
    cc.player.shareTimes--;
    this.onDataChanged();
  },
  finishShare: function finishShare() {
    cc.player.isShare = !0;
    this.onDataChanged();
  },
  checkAndResetAdData: function checkAndResetAdData() {
    var e = new Date().getDate();

    if (e != cc.player.adBuffDate) {
      cc.player.adBuffDate = e;
      cc.player.adBuffTimes = [10, 3];
      cc.player.adBuyData = {
        bank: [3, 3],
        toolBuy: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        actTimes: 1
      };
      this.onDataChanged();
    }
  },
  isHaveMoreActTimes: function isHaveMoreActTimes() {
    return 1 == cc.player.adBuyData.actTimes;
  },
  updateAdActTimes: function updateAdActTimes() {
    cc.player.adBuyData.actTimes = 0;
    this.onDataChanged();
  },
  isHaveAdBuyBankTimes: function isHaveAdBuyBankTimes(e) {
    return cc.player.adBuyData.bank[e] > 0;
  },
  isHaveAdBuyToolTimes: function isHaveAdBuyToolTimes(e) {
    return 1 == cc.player.adBuyData.toolBuy[e - 1];
  },
  updateAdBuyBankTimes: function updateAdBuyBankTimes(e) {
    cc.player.adBuyData.bank[e]--;
    this.onDataChanged();
  },
  updateAdBuyToolTimes: function updateAdBuyToolTimes(e) {
    cc.player.adBuyData.toolBuy[e - 1] = 0;
    this.onDataChanged();
  },
  getAdBuyData: function getAdBuyData() {
    return cc.player.adBuyData;
  },
  getAdBuffTimes: function getAdBuffTimes(e) {
    return cc.player.adBuffTimes[e];
  },
  updateAdBuffTimes: function updateAdBuffTimes(e) {
    cc.player.adBuffTimes[e]--;
    this.onDataChanged();
  },
  finishSignReward: function finishSignReward() {
    cc.player.signData.isReward = !0;
    this.onDataChanged();
  },
  getSignData: function getSignData() {
    return cc.player.signData;
  },
  checkAndResetSign: function checkAndResetSign() {
    var e = new Date().getDate();

    if (e != cc.player.signDate) {
      cc.player.signDate = e;

      if (cc.player.signData.isReward) {
        cc.player.signData.signDay++;
      }

      cc.player.signData.isReward = !1;
      this.onDataChanged();
    }
  },
  checkAndResetDayMission: function checkAndResetDayMission() {
    var e = new Date().getDate();

    if (e != cc.player.dayMissionDate) {
      cc.player.dayMissionDate = e;
      cc.player.dayMissionData = {};
      cc.player.dayBoxData = {};
      this.setItemNum(cc.pvz.GameConfig.ItemType["日常任务积分"], 0);
      this.addDayMissionProgress(cc.pvz.GameConfig.MissionType["登录1次"]);
      this.onDataChanged();
    }
  },
  getDayBoxData: function getDayBoxData(e) {
    if (cc.player.dayBoxData[e]) {//
    } else {
      cc.player.dayBoxData[e] = {
        isReward: !1
      };
      this.onDataChanged();
    }

    return cc.player.dayBoxData[e];
  },
  finishDayBoxReward: function finishDayBoxReward(e) {
    if (cc.player.dayBoxData[e]) {
      cc.player.dayBoxData[e].isReward = !0;
      this.onDataChanged();
    }
  },
  getDayMissionData: function getDayMissionData(e) {
    if (cc.player.dayMissionData[e]) {//
    } else {
      cc.player.dayMissionData[e] = {
        pro: 0,
        isReward: !1
      };
      this.onDataChanged();
    }

    return cc.player.dayMissionData[e];
  },
  addDayMissionProgress: function addDayMissionProgress(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    this.checkAndResetDayMission();

    if (cc.player.dayMissionData[e]) {//
    } else {
      cc.player.dayMissionData[e] = {
        pro: 0,
        isReward: !1
      };
    }

    if (cc.player.dayMissionData[e].isReward) {//
    } else {
      cc.player.dayMissionData[e].pro += t;
    }
  },
  finishDayMission: function finishDayMission(e) {
    if (cc.player.dayMissionData[e]) {
      cc.player.dayMissionData[e].isReward = !0;
      this.onDataChanged();
    }
  },
  getWeekBoxData: function getWeekBoxData(e) {
    if (cc.player.weekBoxData[e]) {//
    } else {
      cc.player.weekBoxData[e] = {
        isReward: !1
      };
      this.onDataChanged();
    }

    return cc.player.weekBoxData[e];
  },
  finishWeekBoxReward: function finishWeekBoxReward(e) {
    if (cc.player.weekBoxData[e]) {
      cc.player.weekBoxData[e].isReward = !0;
      this.onDataChanged();
    }
  },
  checkAndResetWeekMission: function checkAndResetWeekMission() {
    var e = cc.pvz.utils.getCurDayInWeek();

    if (e != cc.player.weekMissionDate) {
      cc.player.weekMissionDate = e;

      if (1 == e) {
        cc.player.weekMissionData = {};
        cc.player.weekBoxData = {};
        this.setItemNum(cc.pvz.GameConfig.ItemType["周常任务积分"], 0);
      }

      this.onDataChanged();
    }
  },
  getWeekMissionData: function getWeekMissionData(e) {
    if (cc.player.weekMissionData[e]) {//
    } else {
      cc.player.weekMissionData[e] = {
        pro: 0,
        isReward: !1
      };
      this.onDataChanged();
    }

    return cc.player.weekMissionData[e];
  },
  addWeekMissionProgress: function addWeekMissionProgress(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    this.checkAndResetWeekMission();

    if (cc.player.weekMissionData[e]) {//
    } else {
      cc.player.weekMissionData[e] = {
        pro: 0,
        isReward: !1
      };
    }

    if (cc.player.weekMissionData[e].isReward) {//
    } else {
      cc.player.weekMissionData[e].pro += t;
    }
  },
  finishWeekMission: function finishWeekMission(e) {
    if (cc.player.weekMissionData[e]) {
      cc.player.weekMissionData[e].isReward = !0;
      this.onDataChanged();
    }
  },
  getAchieveData: function getAchieveData(e) {
    if (cc.player.achieveData[e]) {//
    } else {
      cc.player.achieveData[e] = {
        lv: 1,
        end: !1
      };
      this.onDataChanged();
    }

    return cc.player.achieveData[e];
  },
  updateAchieveData: function updateAchieveData(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    if (cc.player.achieveData[e]) {//
    } else {
      cc.player.achieveData[e] = {
        lv: 1,
        end: !1
      };
    }

    cc.player.achieveData[e].lv += t;
    var o = 100 * e + cc.player.achieveData[e].lv;

    if (cc.JsonControl.getAchieveJson(o)) {//
    } else {
      cc.player.achieveData[e].lv -= t;
      cc.player.achieveData[e].end = !0;
    }

    this.onDataChanged();
  },
  getAchieveProgress: function getAchieveProgress(e) {
    if (cc.player.achievePro.hasOwnProperty(e)) {//
    } else {
      cc.player.achievePro[e] = 0;
      this.saveData();
    }

    return cc.player.achievePro[e];
  },
  addAchieveProgress: function addAchieveProgress(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    if (cc.player.achievePro.hasOwnProperty(e)) {//
    } else {
      cc.player.achievePro[e] = 0;
    }

    switch (e) {
      case cc.pvz.GameConfig.MissionType["通过主线章节n"]:
        if (t > cc.player.achievePro[e]) {
          cc.player.achievePro[e] = t;
        }

        break;

      case cc.pvz.GameConfig.MissionType["装备最高等级达到n"]:
        var o = cc.player.achievePro[e],
            a = this.getToolMaxLv();

        if (o < a) {
          cc.player.achievePro[e] = a;
        }

        break;

      case cc.pvz.GameConfig.MissionType["装备总等级n"]:
        var n = cc.player.achievePro[e],
            i = this.getToolAllLv();

        if (n < i) {
          cc.player.achievePro[e] = i;
        }

        break;

      default:
        cc.player.achievePro[e] += t;
    }
  },
  getToolMaxLv: function getToolMaxLv() {
    var e = 0;

    for (var t in cc.player.toolData) {
      var o = cc.player.toolData[t];

      if (e <= o.lv) {
        e = o.lv;
      }
    }

    return e;
  },
  getToolAllLv: function getToolAllLv() {
    var e = 0;

    for (var t in cc.player.toolData) {
      e += cc.player.toolData[t].lv;
    }

    return e;
  },
  addMissionProgress: function addMissionProgress(e, t) {
    if (void 0 === t) {
      t = 1;
    }

    switch (e) {
      case cc.pvz.GameConfig.MissionType["挑战主线章节1次"]:
      case cc.pvz.GameConfig.MissionType["升级任意装备1次"]:
        cc.pvz.PlayerData.addDayMissionProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["每日商店购买n次物品"]:
      case cc.pvz.GameConfig.MissionType["高级宝箱抽取装备n次"]:
        cc.pvz.PlayerData.addDayMissionProgress(e, t);
        cc.pvz.PlayerData.addWeekMissionProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["扫荡关卡n次"]:
      case cc.pvz.GameConfig.MissionType["参与无尽挑战赛N次"]:
      case cc.pvz.GameConfig.MissionType["参与挑战关卡n次"]:
        cc.pvz.PlayerData.addDayMissionProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["购买体力n次"]:
        cc.pvz.PlayerData.addDayMissionProgress(e, t);
        cc.pvz.PlayerData.addAchieveProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["观看广告n次"]:
        cc.pvz.PlayerData.addDayMissionProgress(e, t);
        cc.pvz.PlayerData.addWeekMissionProgress(e, t);
        cc.pvz.PlayerData.addAchieveProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["通关主线副本n次"]:
        cc.pvz.PlayerData.addWeekMissionProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["击败僵尸n个"]:
      case cc.pvz.GameConfig.MissionType["击败首领n个"]:
        cc.pvz.PlayerData.addWeekMissionProgress(e, t);
        cc.pvz.PlayerData.addAchieveProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["通关挑战关卡n次"]:
        cc.pvz.PlayerData.addWeekMissionProgress(e, t);
        break;

      case cc.pvz.GameConfig.MissionType["通过主线章节n"]:
      case cc.pvz.GameConfig.MissionType["装备最高等级达到n"]:
      case cc.pvz.GameConfig.MissionType["装备总等级n"]:
      case cc.pvz.GameConfig.MissionType["累计获得金币"]:
      case cc.pvz.GameConfig.MissionType["累计消耗钻石"]:
        cc.pvz.PlayerData.addAchieveProgress(e, t);
    }

    this.onDataChanged();
  },
  onCheckOldPlayerMission: function onCheckOldPlayerMission() {
    cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通过主线章节n"], cc.player.level - 1);
    cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备总等级n"]);
    cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备最高等级达到n"]);
  },
  hasFundGet: function hasFundGet() {
    return !1;
  },
  setFundGetted: function setFundGetted() {}
};

if (cc.pvz) {//
} else {
  cc.pvz = {};
}

cc.pvz.PlayerData = o;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1BsYXllckRhdGEuanMiXSwibmFtZXMiOlsiY2MiLCJUb29sSXRlbSIsIkNsYXNzIiwibmFtZSIsInByb3BlcnRpZXMiLCJsdiIsIkludGVnZXIiLCJjIiwibyIsIm5ld0RhdGEiLCJlIiwiZGF0YVZlcnNpb24iLCJ0IiwiaXNNTXV0ZSIsImlzU011dGUiLCJpdGVtRGF0YSIsInBvd2VyIiwicG93ZXJEYXRlIiwicG93ZXJCdXlEYXRlIiwicG93ZXJCdXlUaW1lcyIsInRvb2xEYXRhIiwiZ2FtZURhdGUiLCJsZXZlbCIsImxldmVsV2F2ZSIsInN3ZWVwVGltZXMiLCJsZXZlbEJveERhdGEiLCJhY3RMZXZlbERhdGUiLCJhY3RMZXZlbERhdGEiLCJ0aW1lcyIsInNjb3JlIiwiYnVmZkxpc3QiLCJib3hTdGF0dXMiLCJzaG9wRGF0ZSIsImlzTmV3U2hvcCIsInNob3BEYWlseURhdGEiLCJzaG9wVGltZXNEYXRhIiwic2hvcEJveERhdGEiLCJleHAiLCJkYXRlIiwiaXNTaGFyZSIsInNoYXJlRGF0ZSIsInNoYXJlVGltZXMiLCJhZEJ1ZmZEYXRlIiwiYWRCdWZmVGltZXMiLCJhZEJ1eURhdGEiLCJiYW5rIiwidG9vbEJ1eSIsImFjdFRpbWVzIiwiZ3VpZGUxIiwic2lnbkRhdGUiLCJzaWduRGF0YSIsInNpZ25EYXkiLCJpc1Jld2FyZCIsImRheU1pc3Npb25EYXRlIiwiZGF5TWlzc2lvbkRhdGEiLCJkYXlCb3hEYXRhIiwid2Vla01pc3Npb25EYXRlIiwid2Vla01pc3Npb25EYXRhIiwid2Vla0JveERhdGEiLCJhY2hpZXZlUHJvIiwiYWNoaWV2ZURhdGEiLCJhZFRpbWVzIiwicmVnVGltZSIsIkRhdGUiLCJub3ciLCJmcmVlM2IiLCJyYW5rQ291bnQiLCJwbGF5ZXIiLCJwb3N0TG9hZERhdGEiLCJzYXZlRGF0YSIsImluaXRQbGF5ZXJEYXRhIiwic3lzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsInB2eiIsIlRBVXRpbHMiLCJ0cmFja0xvZ2luIiwiY29uc29sZSIsImxvZyIsImluaXRCYXNlVG9vbERhdGEiLCJpbml0QmFzZUl0ZW1EYXRhIiwiY2xvdWQiLCJuZWVkU2F2ZVRvQ2xvdWQiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiY2xlYXJEYXRhIiwicmVtb3ZlSXRlbSIsIm9uRGF0YUNoYW5nZWQiLCJzYXZlRGF0YVRvTG9jYWxPbmxpbmVDb3JlIiwiYSIsImNoZWNrVXBkYXRlUGxheWVySW5mbyIsInN0b3JhZ2VUaW1lIiwic2F2ZURhdGFUb0xvY2FsT25saW5lIiwic3RvcmFnZVRpbWVJZCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJnZXRaZXJvT0Nsb2NrIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsIm4iLCJnZXREYXRlIiwiZ2V0VGltZSIsImhhc1Bhc3RPbmVEYXkiLCJsZW5ndGgiLCJjaGFuZ2VJdGVtTnVtIiwiaGFzT3duUHJvcGVydHkiLCJHYW1lQ29uZmlnIiwiSXRlbVR5cGUiLCJhZGRNaXNzaW9uUHJvZ3Jlc3MiLCJNaXNzaW9uVHlwZSIsIk1hdGgiLCJhYnMiLCJzZXRJdGVtTnVtIiwiZ2V0SXRlbU51bSIsImlzSXRlbUVub3VnaCIsIk1heFRvb2xDb3VudCIsInBvcyIsImdldFRvb2xEYXRhIiwidXBkYXRlVG9vbEx2IiwidXBkYXRlVG9vbEZyYWdDb3VudCIsImlzRW5vdWdoQXJyYXlUb29sIiwiQXJyYXlQbGFjZU9wTHYiLCJjaGVja0FuZFJlc2V0UG93ZXRCdXkiLCJnZXRQb3dlckJ1eVRpbWVzIiwidXBkYXRlUG93ZXJCdXlUaW1lcyIsImlzSGF2ZUJ1eVBvd2VyVGltZXMiLCJ1c2VQbGF5ZXJQb3dlciIsImlzTWF4UG93ZXIiLCJDZFBvd2VyVGltZSIsImFkZFBvd2VyIiwiZ2V0TWF4UG93ZXIiLCJNYXhQb3dlciIsImdldFBvd2VyIiwiZ2V0UG93ZXJEYXRlIiwidXBkYXRlUG93ZXJEYXRlIiwiY2hlY2tBbmRSZXNldEFjdExldmVsIiwiZ2V0QWN0TGV2ZWxEYXRhIiwidXBkYXRlQWN0TGV2ZWxUaW1lcyIsInVwZGF0ZUFjdExldmVsU2NvcmUiLCJ1cGRhdGVBY3RMZXZlbEJ1ZmYiLCJ1cGRhdGVBY3RMZXZlbEJveFN0YXR1cyIsImNoZWNrQW5kUmVzZXRHYW1lRGF0ZSIsImdldFN3ZWVwVGltZXMiLCJ1cGRhdGVTd2VlcFRpbWVzIiwidXBkYXRlU3RhZ2VMZXZlbCIsIk1heExldmVsIiwiUGxheWVyRGF0YSIsInVwbG9hZEx2VXBEYXRhIiwiZ2V0U3RhZ2VMZXZlbCIsImdldE1heExldmVsV2F2ZSIsInVwZGF0ZU1heExldmVsV2F2ZSIsImdldExldmVsQm94RGF0YSIsInVwZGF0ZUxldmVsQm94RGF0YSIsImNoZWNrQW5kUmVzZXRTaG9wIiwidXBkYXRlU2hvcFRpbWVzIiwiZ2V0U2hvcFRpbWVzIiwiaXNOZXdTaG9wU3RhdHVzIiwiY2hhbmdlU2hvcFN0YXR1cyIsImFkZFNob3BEYXRhIiwic2V0U2hvcERhdGEiLCJnZXRTaG9wRGF0YSIsInVwZGF0ZVNob3BEYXRhQnV5IiwiYnV5VGltZXMiLCJnZXRTaG9wQm94RGF0YSIsInVwZGF0ZVNob3BCb3hEYXRlIiwidXBkYXRlU2hvcEJveEV4cCIsInVwZGF0ZVNob3BCb3hsViIsImNoZWNrQW5kUmVzZXRTaGFyZSIsImdldFNoYXJlVGltZXMiLCJ1cGRhdGVTaGFyZVRpbWVzIiwiZmluaXNoU2hhcmUiLCJjaGVja0FuZFJlc2V0QWREYXRhIiwiaXNIYXZlTW9yZUFjdFRpbWVzIiwidXBkYXRlQWRBY3RUaW1lcyIsImlzSGF2ZUFkQnV5QmFua1RpbWVzIiwiaXNIYXZlQWRCdXlUb29sVGltZXMiLCJ1cGRhdGVBZEJ1eUJhbmtUaW1lcyIsInVwZGF0ZUFkQnV5VG9vbFRpbWVzIiwiZ2V0QWRCdXlEYXRhIiwiZ2V0QWRCdWZmVGltZXMiLCJ1cGRhdGVBZEJ1ZmZUaW1lcyIsImZpbmlzaFNpZ25SZXdhcmQiLCJnZXRTaWduRGF0YSIsImNoZWNrQW5kUmVzZXRTaWduIiwiY2hlY2tBbmRSZXNldERheU1pc3Npb24iLCJhZGREYXlNaXNzaW9uUHJvZ3Jlc3MiLCJnZXREYXlCb3hEYXRhIiwiZmluaXNoRGF5Qm94UmV3YXJkIiwiZ2V0RGF5TWlzc2lvbkRhdGEiLCJwcm8iLCJmaW5pc2hEYXlNaXNzaW9uIiwiZ2V0V2Vla0JveERhdGEiLCJmaW5pc2hXZWVrQm94UmV3YXJkIiwiY2hlY2tBbmRSZXNldFdlZWtNaXNzaW9uIiwidXRpbHMiLCJnZXRDdXJEYXlJbldlZWsiLCJnZXRXZWVrTWlzc2lvbkRhdGEiLCJhZGRXZWVrTWlzc2lvblByb2dyZXNzIiwiZmluaXNoV2Vla01pc3Npb24iLCJnZXRBY2hpZXZlRGF0YSIsImVuZCIsInVwZGF0ZUFjaGlldmVEYXRhIiwiSnNvbkNvbnRyb2wiLCJnZXRBY2hpZXZlSnNvbiIsImdldEFjaGlldmVQcm9ncmVzcyIsImFkZEFjaGlldmVQcm9ncmVzcyIsImdldFRvb2xNYXhMdiIsImkiLCJnZXRUb29sQWxsTHYiLCJvbkNoZWNrT2xkUGxheWVyTWlzc2lvbiIsImhhc0Z1bmRHZXQiLCJzZXRGdW5kR2V0dGVkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxRQUFILEdBQWNELEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0VBQ25CQyxJQUFJLEVBQUUsVUFEYTtFQUVuQkMsVUFBVSxFQUFFO0lBQ1JDLEVBQUUsRUFBRUwsRUFBRSxDQUFDTSxPQURDO0lBRVJDLENBQUMsRUFBRVAsRUFBRSxDQUFDTTtFQUZFO0FBRk8sQ0FBVCxDQUFkO0FBT0EsSUFBSUUsQ0FBQyxHQUFHO0VBQ0pDLE9BQU8sRUFBRSxtQkFBWTtJQUNqQixJQUFJQyxDQUFDLEdBQUc7TUFDSkMsV0FBVyxFQUFFLENBRFQ7TUFFSkMsQ0FBQyxFQUFFLENBQUMsQ0FGQTtNQUdKQyxPQUFPLEVBQUUsQ0FBQyxDQUhOO01BSUpDLE9BQU8sRUFBRSxDQUFDLENBSk47TUFLSkMsUUFBUSxFQUFFLEVBTE47TUFNSkMsS0FBSyxFQUFFLEVBTkg7TUFPSkMs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QXhDO0lBeENSOztJQTBDQSxLQUFLNkUsYUFBTDtFQUNILENBMXpCRztFQTJ6QkowSCx1QkFBdUIsRUFBRSxtQ0FBWTtJQUNqQ25OLEVBQUUsQ0FBQzRFLEdBQUgsQ0FBT3dFLFVBQVAsQ0FBa0J0QyxrQkFBbEIsQ0FBcUM5RyxFQUFFLENBQUM0RSxHQUFILENBQU9nQyxVQUFQLENBQWtCRyxXQUFsQixDQUE4QixTQUE5QixDQUFyQyxFQUErRS9HLEVBQUUsQ0FBQ21FLE1BQUgsQ0FBVTdDLEtBQVYsR0FBa0IsQ0FBakc7SUFDQXRCLEVBQUUsQ0FBQzRFLEdBQUgsQ0FBT3dFLFVBQVAsQ0FBa0J0QyxrQkFBbEIsQ0FBcUM5RyxFQUFFLENBQUM0RSxHQUFILENBQU9nQyxVQUFQLENBQWtCRyxXQUFsQixDQUE4QixRQUE5QixDQUFyQztJQUNBL0csRUFBRSxDQUFDNEUsR0FBSCxDQUFPd0UsVUFBUCxDQUFrQnRDLGtCQUFsQixDQUFxQzlHLEVBQUUsQ0FBQzRFLEdBQUgsQ0FBT2dDLFVBQVAsQ0FBa0JHLFdBQWxCLENBQThCLFdBQTlCLENBQXJDO0VBQ0gsQ0EvekJHO0VBZzBCSnFHLFVBQVUsRUFBRSxzQkFBWTtJQUNwQixPQUFPLENBQUMsQ0FBUjtFQUNILENBbDBCRztFQW0wQkpDLGFBQWEsRUFBRSx5QkFBWSxDQUFFO0FBbjBCekIsQ0FBUjs7QUFxMEJBLElBQUlyTixFQUFFLENBQUM0RSxHQUFQLEVBQVksQ0FDUjtBQUNILENBRkQsTUFFTztFQUNINUUsRUFBRSxDQUFDNEUsR0FBSCxHQUFTLEVBQVQ7QUFDSDs7QUFDRDVFLEVBQUUsQ0FBQzRFLEdBQUgsQ0FBT3dFLFVBQVAsR0FBb0I1SSxDQUFwQjtBQUNBOE0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCL00sQ0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLlRvb2xJdGVtID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6IFwiVG9vbEl0ZW1cIixcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGx2OiBjYy5JbnRlZ2VyLFxuICAgICAgICBjOiBjYy5JbnRlZ2VyXG4gICAgfVxufSk7XG52YXIgbyA9IHtcbiAgICBuZXdEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0ge1xuICAgICAgICAgICAgZGF0YVZlcnNpb246IDEsXG4gICAgICAgICAgICB0OiAtMSxcbiAgICAgICAgICAgIGlzTU11dGU6ICExLFxuICAgICAgICAgICAgaXNTTXV0ZTogITEsXG4gICAgICAgICAgICBpdGVtRGF0YToge30sXG4gICAgICAgICAgICBwb3dlcjogMjAsXG4gICAgICAgICAgICBwb3dlckRhdGU6IC0xLFxuICAgICAgICAgICAgcG93ZXJCdXlEYXRlOiAtMSxcbiAgICAgICAgICAgIHBvd2VyQnV5VGltZXM6IFs1LCAzXSxcbiAgICAgICAgICAgIHRvb2xEYXRhOiB7fSxcbiAgICAgICAgICAgIGdhbWVEYXRlOiAtMSxcbiAgICAgICAgICAgIGxldmVsOiAxLFxuICAgICAgICAgICAgbGV2ZWxXYXZlOiAwLFxuICAgICAgICAgICAgc3dlZXBUaW1lczogNSxcbiAgICAgICAgICAgIGxldmVsQm94RGF0YToge30sXG4gICAgICAgICAgICBhY3RMZXZlbERhdGU6IC0xLFxuICAgICAgICAgICAgYWN0TGV2ZWxEYXRhOiB7XG4gICAgICAgICAgICAgICAgbGV2ZWw6IDAsXG4gICAgICAgICAgICAgICAgdGltZXM6IDMsXG4gICAgICAgICAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgICAgICAgICAgYnVmZkxpc3Q6IFstMSwgLTFdLFxuICAgICAgICAgICAgICAgIGJveFN0YXR1czogWzAsIDAsIDAsIDBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvcERhdGU6IC0xLFxuICAgICAgICAgICAgaXNOZXdTaG9wOiAhMCxcbiAgICAgICAgICAgIHNob3BEYWlseURhdGE6IHt9LFxuICAgICAgICAgICAgc2hvcFRpbWVzRGF0YTogWzIwLCAxLCA3XSxcbiAgICAgICAgICAgIHNob3BCb3hEYXRhOiB7XG4gICAgICAgICAgICAgICAgbHY6IDEsXG4gICAgICAgICAgICAgICAgZXhwOiAwLFxuICAgICAgICAgICAgICAgIGRhdGU6IFstMSwgLTFdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNTaGFyZTogITEsXG4gICAgICAgICAgICBzaGFyZURhdGU6IC0xLFxuICAgICAgICAgICAgc2hhcmVUaW1lczogMTAsXG4gICAgICAgICAgICBhZEJ1ZmZEYXRlOiAtMSxcbiAgICAgICAgICAgIGFkQnVmZlRpbWVzOiBbMTAsIDNdLFxuICAgICAgICAgICAgYWRCdXlEYXRhOiB7XG4gICAgICAgICAgICAgICAgYmFuazogWzMsIDNdLFxuICAgICAgICAgICAgICAgIHRvb2xCdXk6IFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcbiAgICAgICAgICAgICAgICBhY3RUaW1lczogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGd1aWRlMTogMCxcbiAgICAgICAgICAgIHNpZ25EYXRlOiAtMSxcbiAgICAgICAgICAgIHNpZ25EYXRhOiB7XG4gICAgICAgICAgICAgICAgc2lnbkRheTogMSxcbiAgICAgICAgICAgICAgICBpc1Jld2FyZDogITFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXlNaXNzaW9uRGF0ZTogLTEsXG4gICAgICAgICAgICBkYXlNaXNzaW9uRGF0YToge30sXG4gICAgICAgICAgICBkYXlCb3hEYXRhOiB7fSxcbiAgICAgICAgICAgIHdlZWtNaXNzaW9uRGF0ZTogLTEsXG4gICAgICAgICAgICB3ZWVrTWlzc2lvbkRhdGE6IHt9LFxuICAgICAgICAgICAgd2Vla0JveERhdGE6IHt9LFxuICAgICAgICAgICAgYWNoaWV2ZVBybzoge30sXG4gICAgICAgICAgICBhY2hpZXZlRGF0YToge30sXG4gICAgICAgICAgICBhZFRpbWVzOiAwXG4gICAgICAgIH07XG4gICAgICAgIGUucmVnVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIGUuZnJlZTNiID0gMTtcbiAgICAgICAgZS5yYW5rQ291bnQgPSAyO1xuICAgICAgICBjYy5wbGF5ZXIgPSBlO1xuICAgIH0sXG4gICAgcG9zdExvYWREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuZGF0YVZlcnNpb24gPCAxKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuZGF0YVZlcnNpb24gPSAxO1xuICAgICAgICAgICAgdGhpcy5zYXZlRGF0YSghMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXRQbGF5ZXJEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwia2FwaXBhY2sxXCIpO1xuICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgY2MucGxheWVyID0gSlNPTi5wYXJzZShlKTtcbiAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrTG9naW4oITEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXcgUGxheWVyIGluaXRQbGF5ZXJcIik7XG4gICAgICAgICAgICB0aGlzLm5ld0RhdGEoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Yid5aeL5YyWIOiDjOWMhVwiKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEJhc2VUb29sRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0QmFzZUl0ZW1EYXRhKCk7XG4gICAgICAgICAgICBjYy5wdnouY2xvdWQubmVlZFNhdmVUb0Nsb3VkID0gMDtcbiAgICAgICAgICAgIGNjLnB2ei5UQVV0aWxzLnRyYWNrTG9naW4oITApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9zdExvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzYXZlRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2MucGxheWVyKSB7XG4gICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJrYXBpcGFjazFcIiwgSlNPTi5zdHJpbmdpZnkoY2MucGxheWVyKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJrYXBpcGFjazFcIik7XG4gICAgfSxcbiAgICBvbkRhdGFDaGFuZ2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEoKTtcbiAgICAgICAgY2MucHZ6LmNsb3VkLm5lZWRTYXZlVG9DbG91ZCsrO1xuICAgIH0sXG4gICAgc2F2ZURhdGFUb0xvY2FsT25saW5lQ29yZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjYy5wbGF5ZXIpKTtcbiAgICAgICAgYS50ID0gbztcbiAgICAgICAgY2MucHZ6LmNsb3VkLmNoZWNrVXBkYXRlUGxheWVySW5mbyhhLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBjYy5wbGF5ZXIudCA9IG87XG4gICAgICAgICAgICAgICAgdC5zYXZlRGF0YSgpO1xuICAgICAgICAgICAgICAgIGUoYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjYy5zdG9yYWdlVGltZSA9IERhdGUubm93KCk7XG4gICAgfSxcbiAgICBzYXZlRGF0YVRvTG9jYWxPbmxpbmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdGhpcy5zYXZlRGF0YVRvTG9jYWxPbmxpbmVDb3JlKGUpO1xuICAgICAgICBpZiAoY2Muc3RvcmFnZVRpbWVJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGNjLnN0b3JhZ2VUaW1lSWQpO1xuICAgICAgICAgICAgY2Muc3RvcmFnZVRpbWVJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2Muc3RvcmFnZVRpbWVJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdC5zYXZlRGF0YVRvTG9jYWxPbmxpbmVDb3JlKCk7XG4gICAgICAgIH0sIDNlNSk7XG4gICAgfSxcbiAgICBnZXRaZXJvT0Nsb2NrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdCA9IG5ldyBEYXRlKGUpO1xuICAgICAgICB2YXIgbyA9IHQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIGEgPSB0LmdldE1vbnRoKCk7XG4gICAgICAgIHZhciBuID0gdC5nZXREYXRlKCk7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShvLCBhLCBuKS5nZXRUaW1lKCk7XG4gICAgfSxcbiAgICBoYXNQYXN0T25lRGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFplcm9PQ2xvY2soRGF0ZS5ub3coKSkgLSB0aGlzLmdldFplcm9PQ2xvY2soY2MucGxheWVyLnJlZ1RpbWUpID4gMDtcbiAgICB9LFxuICAgIGluaXRCYXNlSXRlbURhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBbMiwgM107XG4gICAgICAgIHZhciB0ID0gWzUwMCwgMF07XG4gICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgZS5sZW5ndGg7IG8rKykge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VJdGVtTnVtKGVbb10sIHRbb10pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VJdGVtTnVtOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAoY2MucGxheWVyLml0ZW1EYXRhLmhhc093blByb3BlcnR5KGUpKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuaXRlbURhdGFbZV0gKz0gdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5pdGVtRGF0YVtlXSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUgPT0gY2MucHZ6LkdhbWVDb25maWcuSXRlbVR5cGVbXCLph5HluIFcIl0gJiYgdCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTWlzc2lvblByb2dyZXNzKGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi57Sv6K6h6I635b6X6YeR5biBXCJdLCB0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlID09IGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi6ZK755+zXCJdICYmIHQgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRNaXNzaW9uUHJvZ3Jlc3MoY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLntK/orqHmtojogJfpkrvnn7NcIl0sIE1hdGguYWJzKHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIHNldEl0ZW1OdW06IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGNjLnBsYXllci5pdGVtRGF0YVtlXSA9IHQ7XG4gICAgfSxcbiAgICBnZXRJdGVtTnVtOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLml0ZW1EYXRhLmhhc093blByb3BlcnR5KGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gY2MucGxheWVyLml0ZW1EYXRhW2VdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGlzSXRlbUVub3VnaDogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgcmV0dXJuICEhY2MucGxheWVyLml0ZW1EYXRhLmhhc093blByb3BlcnR5KGUpICYmIGNjLnBsYXllci5pdGVtRGF0YVtlXSA+PSB0O1xuICAgIH0sXG4gICAgaW5pdEJhc2VUb29sRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wbGF5ZXIudG9vbERhdGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBjYy5wdnouR2FtZUNvbmZpZy5NYXhUb29sQ291bnQ7IGUrKykge1xuICAgICAgICAgICAgdmFyIHQgPSBlICsgMTtcbiAgICAgICAgICAgIHZhciBvO1xuICAgICAgICAgICAgaWYgKDEgPT0gdCkge1xuICAgICAgICAgICAgICAgIG8gPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhO1xuICAgICAgICAgICAgaWYgKGUgPCA2KSB7XG4gICAgICAgICAgICAgICAgYSA9IGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGEgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLnBsYXllci50b29sRGF0YVt0XSA9IHtcbiAgICAgICAgICAgICAgICBsdjogMSxcbiAgICAgICAgICAgICAgICBjOiBvLFxuICAgICAgICAgICAgICAgIHBvczogYVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNhdmVEYXRhKCk7XG4gICAgfSxcbiAgICBnZXRUb29sRGF0YTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci50b29sRGF0YS5oYXNPd25Qcm9wZXJ0eShlKSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci50b29sRGF0YVtlXSA9IHtcbiAgICAgICAgICAgICAgICBsdjogMSxcbiAgICAgICAgICAgICAgICBjOiAwLFxuICAgICAgICAgICAgICAgIHBvczogLTFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2MucGxheWVyLnRvb2xEYXRhW2VdO1xuICAgIH0sXG4gICAgdXBkYXRlVG9vbEx2OiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAoY2MucGxheWVyLnRvb2xEYXRhLmhhc093blByb3BlcnR5KGUpKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIudG9vbERhdGFbZV0ubHYgKz0gdDtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLpgZPlhbfkuI3lrZjlnKhcIiwgZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVRvb2xGcmFnQ291bnQ6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIudG9vbERhdGEuaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci50b29sRGF0YVtlXS5jICs9IHQ7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi6YGT5YW35LiN5a2Y5ZyoXCIsIGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpc0Vub3VnaEFycmF5VG9vbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IDY7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIubGV2ZWwgPiBjYy5wdnouR2FtZUNvbmZpZy5BcnJheVBsYWNlT3BMdlsxXSkge1xuICAgICAgICAgICAgZSA9IDg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2MucGxheWVyLmxldmVsID4gY2MucHZ6LkdhbWVDb25maWcuQXJyYXlQbGFjZU9wTHZbMF0pIHtcbiAgICAgICAgICAgICAgICBlID0gNztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IDA7XG4gICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgY2MucHZ6LkdhbWVDb25maWcuTWF4VG9vbENvdW50OyBvKyspIHtcbiAgICAgICAgICAgIGlmICgtMSAhPSBjYy5wbGF5ZXIudG9vbERhdGFbbyArIDFdLnBvcykge1xuICAgICAgICAgICAgICAgIHQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdCA+PSBlO1xuICAgIH0sXG4gICAgY2hlY2tBbmRSZXNldFBvd2V0QnV5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gbmV3IERhdGUoKS5nZXREYXRlKCk7XG4gICAgICAgIGlmIChlICE9IGNjLnBsYXllci5wb3dlckJ1eURhdGUpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5wb3dlckJ1eURhdGUgPSBlO1xuICAgICAgICAgICAgY2MucGxheWVyLnBvd2VyQnV5VGltZXMgPSBbNSwgM107XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UG93ZXJCdXlUaW1lczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gZSkge1xuICAgICAgICAgICAgZSA9ICExO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIucG93ZXJCdXlUaW1lc1tlID8gMCA6IDFdO1xuICAgIH0sXG4gICAgdXBkYXRlUG93ZXJCdXlUaW1lczogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gdCkge1xuICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgY2MucGxheWVyLnBvd2VyQnV5VGltZXNbZSA/IDAgOiAxXSAtPSB0O1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGlzSGF2ZUJ1eVBvd2VyVGltZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5wb3dlckJ1eVRpbWVzWzBdICsgY2MucGxheWVyLnBvd2VyQnV5VGltZXNbMV0gPiAwO1xuICAgIH0sXG4gICAgdXNlUGxheWVyUG93ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNjLnBsYXllci5wb3dlciArPSBlO1xuICAgICAgICBpZiAodGhpcy5pc01heFBvd2VyKCkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIucG93ZXJEYXRlID0gRGF0ZS5ub3coKSArIDFlMyAqIGNjLnB2ei5HYW1lQ29uZmlnLkNkUG93ZXJUaW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgYWRkUG93ZXI6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICBjYy5wbGF5ZXIucG93ZXIgKz0gZTtcbiAgICAgICAgaWYgKHRoaXMuaXNNYXhQb3dlcigpKSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGNjLnBsYXllci5wb3dlciA9IGNjLnBsYXllci5wb3dlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucGxheWVyLnBvd2VyID0gdGhpcy5nZXRNYXhQb3dlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucGxheWVyLnBvd2VyRGF0ZSA9IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucGxheWVyLnBvd2VyRGF0ZSA9IERhdGUubm93KCkgKyAxZTMgKiBjYy5wdnouR2FtZUNvbmZpZy5DZFBvd2VyVGltZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGlzTWF4UG93ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5wb3dlciA+PSB0aGlzLmdldE1heFBvd2VyKCk7XG4gICAgfSxcbiAgICBnZXRNYXhQb3dlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MucHZ6LkdhbWVDb25maWcuTWF4UG93ZXI7XG4gICAgfSxcbiAgICBnZXRQb3dlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MucGxheWVyLnBvd2VyO1xuICAgIH0sXG4gICAgZ2V0UG93ZXJEYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIucG93ZXJEYXRlO1xuICAgIH0sXG4gICAgdXBkYXRlUG93ZXJEYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBsYXllci5wb3dlckRhdGUgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGNoZWNrQW5kUmVzZXRBY3RMZXZlbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpO1xuICAgICAgICBpZiAoZSAhPSBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRlKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRlID0gZTtcbiAgICAgICAgICAgIGNjLnBsYXllci5hY3RMZXZlbERhdGEudGltZXMgPSAzO1xuICAgICAgICAgICAgY2MucGxheWVyLmFjdExldmVsRGF0YS5zY29yZSA9IDA7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhLmJ1ZmZMaXN0ID0gWy0xLCAtMV07XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhLmJveFN0YXR1cyA9IFswLCAwLCAwLCAwXTtcbiAgICAgICAgICAgIGlmIChjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhLmxldmVsIDwgMikge1xuICAgICAgICAgICAgICAgIGNjLnBsYXllci5hY3RMZXZlbERhdGEubGV2ZWwrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MucGxheWVyLmFjdExldmVsRGF0YS5sZXZlbCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QWN0TGV2ZWxEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhO1xuICAgIH0sXG4gICAgdXBkYXRlQWN0TGV2ZWxUaW1lczogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhLnRpbWVzLS07XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgdXBkYXRlQWN0TGV2ZWxTY29yZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY2MucGxheWVyLmFjdExldmVsRGF0YS5zY29yZSArPSBlO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIHVwZGF0ZUFjdExldmVsQnVmZjogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgY2MucGxheWVyLmFjdExldmVsRGF0YS5idWZmTGlzdFtlIC0gMV0gPSB0O1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIHVwZGF0ZUFjdExldmVsQm94U3RhdHVzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjYy5wbGF5ZXIuYWN0TGV2ZWxEYXRhLmJveFN0YXR1c1tlIC0gMV0gPSAxO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGNoZWNrQW5kUmVzZXRHYW1lRGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpO1xuICAgICAgICBpZiAoZSAhPSBjYy5wbGF5ZXIuZ2FtZURhdGUpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5nYW1lRGF0ZSA9IGU7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc3dlZXBUaW1lcyA9IDU7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWRUaW1lcyA9IDA7XG4gICAgICAgICAgICBjYy5wbGF5ZXIucmFua0NvdW50ID0gMjtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRTd2VlcFRpbWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuc3dlZXBUaW1lcztcbiAgICB9LFxuICAgIHVwZGF0ZVN3ZWVwVGltZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucGxheWVyLnN3ZWVwVGltZXMtLTtcbiAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgfSxcbiAgICB1cGRhdGVTdGFnZUxldmVsOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodm9pZCAwID09PSBlKSB7XG4gICAgICAgICAgICBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2MucGxheWVyLmxldmVsIDwgY2MucHZ6LkdhbWVDb25maWcuTWF4TGV2ZWwpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5sZXZlbCArPSBlO1xuICAgICAgICB9XG4gICAgICAgIGNjLnBsYXllci5sZXZlbFdhdmUgPSAwO1xuICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRNaXNzaW9uUHJvZ3Jlc3MoY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLpgJrov4fkuLvnur/nq6DoioJuXCJdLCBjYy5wbGF5ZXIubGV2ZWwgLSAxKTtcbiAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIGNjLnB2ei5UQVV0aWxzLnVwbG9hZEx2VXBEYXRhKCk7XG4gICAgfSxcbiAgICBnZXRTdGFnZUxldmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIubGV2ZWw7XG4gICAgfSxcbiAgICBnZXRNYXhMZXZlbFdhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5sZXZlbFdhdmU7XG4gICAgfSxcbiAgICB1cGRhdGVNYXhMZXZlbFdhdmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIubGV2ZWxXYXZlIDwgZSkge1xuICAgICAgICAgICAgY2MucGxheWVyLmxldmVsV2F2ZSA9IGU7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TGV2ZWxCb3hEYXRhOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLmxldmVsQm94RGF0YS5oYXNPd25Qcm9wZXJ0eShlKSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5sZXZlbEJveERhdGFbZV0gPSBbMCwgMCwgMF07XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2MucGxheWVyLmxldmVsQm94RGF0YVtlXTtcbiAgICB9LFxuICAgIHVwZGF0ZUxldmVsQm94RGF0YTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci5sZXZlbEJveERhdGEuaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIubGV2ZWxCb3hEYXRhW2VdID0gWzAsIDAsIDBdO1xuICAgICAgICB9XG4gICAgICAgIGNjLnBsYXllci5sZXZlbEJveERhdGFbZV1bdCAtIDFdID0gMTtcbiAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgfSxcbiAgICBjaGVja0FuZFJlc2V0U2hvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpO1xuICAgICAgICBpZiAoZSAhPSBjYy5wbGF5ZXIuc2hvcERhdGUpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5zaG9wRGF0ZSA9IGU7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hvcERhaWx5RGF0YSA9IHt9O1xuICAgICAgICAgICAgY2MucGxheWVyLnNob3BUaW1lc0RhdGEgPSBbMjAsIDEsIDddO1xuICAgICAgICAgICAgY2MucGxheWVyLmlzTmV3U2hvcCA9ICEwO1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVNob3BUaW1lczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY2MucGxheWVyLnNob3BUaW1lc0RhdGFbZV0tLTtcbiAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgfSxcbiAgICBnZXRTaG9wVGltZXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuc2hvcFRpbWVzRGF0YVtlXTtcbiAgICB9LFxuICAgIGlzTmV3U2hvcFN0YXR1czogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MucGxheWVyLmlzTmV3U2hvcDtcbiAgICB9LFxuICAgIGNoYW5nZVNob3BTdGF0dXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucGxheWVyLmlzTmV3U2hvcCA9ICExO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGFkZFNob3BEYXRhOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAoY2MucGxheWVyLnNob3BEYWlseURhdGEuaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIEVycm9yIEFkZCBTaG9wIERhdGEgOlwiLCBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5zaG9wRGFpbHlEYXRhW2VdID0gdDtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRTaG9wRGF0YTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgY2MucGxheWVyLnNob3BEYWlseURhdGFbZV0gPSB0O1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGdldFNob3BEYXRhOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLnNob3BEYWlseURhdGEuaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hvcERhaWx5RGF0YVtlXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5zaG9wRGFpbHlEYXRhW2VdO1xuICAgIH0sXG4gICAgdXBkYXRlU2hvcERhdGFCdXk6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuc2hvcERhaWx5RGF0YS5oYXNPd25Qcm9wZXJ0eShlKSkge1xuICAgICAgICAgICAgY2MucGxheWVyLnNob3BEYWlseURhdGFbZV0uYnV5VGltZXMgLT0gdDtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgRXJyb3IgQWRkIFNob3AgRGF0YSA6XCIsIGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRTaG9wQm94RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MucGxheWVyLnNob3BCb3hEYXRhO1xuICAgIH0sXG4gICAgdXBkYXRlU2hvcEJveERhdGU6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGNjLnBsYXllci5zaG9wQm94RGF0YS5kYXRlW2UgLSAxXSA9IHQ7XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgdXBkYXRlU2hvcEJveEV4cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci5zaG9wQm94RGF0YS5sdiA8IDEwKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hvcEJveERhdGEuZXhwICs9IGU7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlU2hvcEJveGxWOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBjYy5wbGF5ZXIuc2hvcEJveERhdGEuZXhwID0gdDtcbiAgICAgICAgaWYgKGNjLnBsYXllci5zaG9wQm94RGF0YS5sdiA8IDEwKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hvcEJveERhdGEubHYgKz0gZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGNoZWNrQW5kUmVzZXRTaGFyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpO1xuICAgICAgICBpZiAoZSAhPSBjYy5wbGF5ZXIuc2hhcmVEYXRlKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hhcmVEYXRlID0gZTtcbiAgICAgICAgICAgIGNjLnBsYXllci5pc1NoYXJlID0gITE7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuc2hhcmVUaW1lcyA9IDEwO1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFNoYXJlVGltZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5zaGFyZVRpbWVzO1xuICAgIH0sXG4gICAgdXBkYXRlU2hhcmVUaW1lczogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wbGF5ZXIuc2hhcmVUaW1lcy0tO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGZpbmlzaFNoYXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnBsYXllci5pc1NoYXJlID0gITA7XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgY2hlY2tBbmRSZXNldEFkRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpO1xuICAgICAgICBpZiAoZSAhPSBjYy5wbGF5ZXIuYWRCdWZmRGF0ZSkge1xuICAgICAgICAgICAgY2MucGxheWVyLmFkQnVmZkRhdGUgPSBlO1xuICAgICAgICAgICAgY2MucGxheWVyLmFkQnVmZlRpbWVzID0gWzEwLCAzXTtcbiAgICAgICAgICAgIGNjLnBsYXllci5hZEJ1eURhdGEgPSB7XG4gICAgICAgICAgICAgICAgYmFuazogWzMsIDNdLFxuICAgICAgICAgICAgICAgIHRvb2xCdXk6IFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcbiAgICAgICAgICAgICAgICBhY3RUaW1lczogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpc0hhdmVNb3JlQWN0VGltZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDEgPT0gY2MucGxheWVyLmFkQnV5RGF0YS5hY3RUaW1lcztcbiAgICB9LFxuICAgIHVwZGF0ZUFkQWN0VGltZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucGxheWVyLmFkQnV5RGF0YS5hY3RUaW1lcyA9IDA7XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgaXNIYXZlQWRCdXlCYW5rVGltZXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuYWRCdXlEYXRhLmJhbmtbZV0gPiAwO1xuICAgIH0sXG4gICAgaXNIYXZlQWRCdXlUb29sVGltZXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiAxID09IGNjLnBsYXllci5hZEJ1eURhdGEudG9vbEJ1eVtlIC0gMV07XG4gICAgfSxcbiAgICB1cGRhdGVBZEJ1eUJhbmtUaW1lczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY2MucGxheWVyLmFkQnV5RGF0YS5iYW5rW2VdLS07XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgdXBkYXRlQWRCdXlUb29sVGltZXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNjLnBsYXllci5hZEJ1eURhdGEudG9vbEJ1eVtlIC0gMV0gPSAwO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGdldEFkQnV5RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MucGxheWVyLmFkQnV5RGF0YTtcbiAgICB9LFxuICAgIGdldEFkQnVmZlRpbWVzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gY2MucGxheWVyLmFkQnVmZlRpbWVzW2VdO1xuICAgIH0sXG4gICAgdXBkYXRlQWRCdWZmVGltZXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNjLnBsYXllci5hZEJ1ZmZUaW1lc1tlXS0tO1xuICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICB9LFxuICAgIGZpbmlzaFNpZ25SZXdhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucGxheWVyLnNpZ25EYXRhLmlzUmV3YXJkID0gITA7XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgZ2V0U2lnbkRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5zaWduRGF0YTtcbiAgICB9LFxuICAgIGNoZWNrQW5kUmVzZXRTaWduOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gbmV3IERhdGUoKS5nZXREYXRlKCk7XG4gICAgICAgIGlmIChlICE9IGNjLnBsYXllci5zaWduRGF0ZSkge1xuICAgICAgICAgICAgY2MucGxheWVyLnNpZ25EYXRlID0gZTtcbiAgICAgICAgICAgIGlmIChjYy5wbGF5ZXIuc2lnbkRhdGEuaXNSZXdhcmQpIHtcbiAgICAgICAgICAgICAgICBjYy5wbGF5ZXIuc2lnbkRhdGEuc2lnbkRheSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MucGxheWVyLnNpZ25EYXRhLmlzUmV3YXJkID0gITE7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tBbmRSZXNldERheU1pc3Npb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRGF0ZSgpLmdldERhdGUoKTtcbiAgICAgICAgaWYgKGUgIT0gY2MucGxheWVyLmRheU1pc3Npb25EYXRlKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGUgPSBlO1xuICAgICAgICAgICAgY2MucGxheWVyLmRheU1pc3Npb25EYXRhID0ge307XG4gICAgICAgICAgICBjYy5wbGF5ZXIuZGF5Qm94RGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zZXRJdGVtTnVtKGNjLnB2ei5HYW1lQ29uZmlnLkl0ZW1UeXBlW1wi5pel5bi45Lu75Yqh56ev5YiGXCJdLCAwKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRGF5TWlzc2lvblByb2dyZXNzKGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi55m75b2VMeasoVwiXSk7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RGF5Qm94RGF0YTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci5kYXlCb3hEYXRhW2VdKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucGxheWVyLmRheUJveERhdGFbZV0gPSB7XG4gICAgICAgICAgICAgICAgaXNSZXdhcmQ6ICExXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5kYXlCb3hEYXRhW2VdO1xuICAgIH0sXG4gICAgZmluaXNoRGF5Qm94UmV3YXJkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLmRheUJveERhdGFbZV0pIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5kYXlCb3hEYXRhW2VdLmlzUmV3YXJkID0gITA7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RGF5TWlzc2lvbkRhdGE6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV0pIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV0gPSB7XG4gICAgICAgICAgICAgICAgcHJvOiAwLFxuICAgICAgICAgICAgICAgIGlzUmV3YXJkOiAhMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV07XG4gICAgfSxcbiAgICBhZGREYXlNaXNzaW9uUHJvZ3Jlc3M6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tBbmRSZXNldERheU1pc3Npb24oKTtcbiAgICAgICAgaWYgKGNjLnBsYXllci5kYXlNaXNzaW9uRGF0YVtlXSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5kYXlNaXNzaW9uRGF0YVtlXSA9IHtcbiAgICAgICAgICAgICAgICBwcm86IDAsXG4gICAgICAgICAgICAgICAgaXNSZXdhcmQ6ICExXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV0uaXNSZXdhcmQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV0ucHJvICs9IHQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbmlzaERheU1pc3Npb246IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuZGF5TWlzc2lvbkRhdGFbZV0pIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5kYXlNaXNzaW9uRGF0YVtlXS5pc1Jld2FyZCA9ICEwO1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFdlZWtCb3hEYXRhOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLndlZWtCb3hEYXRhW2VdKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucGxheWVyLndlZWtCb3hEYXRhW2VdID0ge1xuICAgICAgICAgICAgICAgIGlzUmV3YXJkOiAhMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIud2Vla0JveERhdGFbZV07XG4gICAgfSxcbiAgICBmaW5pc2hXZWVrQm94UmV3YXJkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLndlZWtCb3hEYXRhW2VdKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIud2Vla0JveERhdGFbZV0uaXNSZXdhcmQgPSAhMDtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja0FuZFJlc2V0V2Vla01pc3Npb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBjYy5wdnoudXRpbHMuZ2V0Q3VyRGF5SW5XZWVrKCk7XG4gICAgICAgIGlmIChlICE9IGNjLnBsYXllci53ZWVrTWlzc2lvbkRhdGUpIHtcbiAgICAgICAgICAgIGNjLnBsYXllci53ZWVrTWlzc2lvbkRhdGUgPSBlO1xuICAgICAgICAgICAgaWYgKDEgPT0gZSkge1xuICAgICAgICAgICAgICAgIGNjLnBsYXllci53ZWVrTWlzc2lvbkRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICBjYy5wbGF5ZXIud2Vla0JveERhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEl0ZW1OdW0oY2MucHZ6LkdhbWVDb25maWcuSXRlbVR5cGVbXCLlkajluLjku7vliqHnp6/liIZcIl0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFdlZWtNaXNzaW9uRGF0YTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGNjLnBsYXllci53ZWVrTWlzc2lvbkRhdGFbZV0pIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIud2Vla01pc3Npb25EYXRhW2VdID0ge1xuICAgICAgICAgICAgICAgIHBybzogMCxcbiAgICAgICAgICAgICAgICBpc1Jld2FyZDogITFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2MucGxheWVyLndlZWtNaXNzaW9uRGF0YVtlXTtcbiAgICB9LFxuICAgIGFkZFdlZWtNaXNzaW9uUHJvZ3Jlc3M6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IHQpIHtcbiAgICAgICAgICAgIHQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tBbmRSZXNldFdlZWtNaXNzaW9uKCk7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIud2Vla01pc3Npb25EYXRhW2VdKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucGxheWVyLndlZWtNaXNzaW9uRGF0YVtlXSA9IHtcbiAgICAgICAgICAgICAgICBwcm86IDAsXG4gICAgICAgICAgICAgICAgaXNSZXdhcmQ6ICExXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYy5wbGF5ZXIud2Vla01pc3Npb25EYXRhW2VdLmlzUmV3YXJkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MucGxheWVyLndlZWtNaXNzaW9uRGF0YVtlXS5wcm8gKz0gdDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZmluaXNoV2Vla01pc3Npb246IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIud2Vla01pc3Npb25EYXRhW2VdKSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIud2Vla01pc3Npb25EYXRhW2VdLmlzUmV3YXJkID0gITA7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QWNoaWV2ZURhdGE6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjYy5wbGF5ZXIuYWNoaWV2ZURhdGFbZV0pIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWNoaWV2ZURhdGFbZV0gPSB7XG4gICAgICAgICAgICAgICAgbHY6IDEsXG4gICAgICAgICAgICAgICAgZW5kOiAhMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5wbGF5ZXIuYWNoaWV2ZURhdGFbZV07XG4gICAgfSxcbiAgICB1cGRhdGVBY2hpZXZlRGF0YTogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gdCkge1xuICAgICAgICAgICAgdCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNjLnBsYXllci5hY2hpZXZlRGF0YVtlXSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5hY2hpZXZlRGF0YVtlXSA9IHtcbiAgICAgICAgICAgICAgICBsdjogMSxcbiAgICAgICAgICAgICAgICBlbmQ6ICExXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNjLnBsYXllci5hY2hpZXZlRGF0YVtlXS5sdiArPSB0O1xuICAgICAgICB2YXIgbyA9IDEwMCAqIGUgKyBjYy5wbGF5ZXIuYWNoaWV2ZURhdGFbZV0ubHY7XG4gICAgICAgIGlmIChjYy5Kc29uQ29udHJvbC5nZXRBY2hpZXZlSnNvbihvKSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnBsYXllci5hY2hpZXZlRGF0YVtlXS5sdiAtPSB0O1xuICAgICAgICAgICAgY2MucGxheWVyLmFjaGlldmVEYXRhW2VdLmVuZCA9ICEwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgZ2V0QWNoaWV2ZVByb2dyZXNzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoY2MucGxheWVyLmFjaGlldmVQcm8uaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWNoaWV2ZVByb1tlXSA9IDA7XG4gICAgICAgICAgICB0aGlzLnNhdmVEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnBsYXllci5hY2hpZXZlUHJvW2VdO1xuICAgIH0sXG4gICAgYWRkQWNoaWV2ZVByb2dyZXNzOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAodm9pZCAwID09PSB0KSB7XG4gICAgICAgICAgICB0ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2MucGxheWVyLmFjaGlldmVQcm8uaGFzT3duUHJvcGVydHkoZSkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5wbGF5ZXIuYWNoaWV2ZVByb1tlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6YCa6L+H5Li757q/56ug6IqCblwiXTpcbiAgICAgICAgICAgICAgICBpZiAodCA+IGNjLnBsYXllci5hY2hpZXZlUHJvW2VdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnBsYXllci5hY2hpZXZlUHJvW2VdID0gdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6KOF5aSH5pyA6auY562J57qn6L6+5YiwblwiXTpcbiAgICAgICAgICAgICAgICB2YXIgbyA9IGNjLnBsYXllci5hY2hpZXZlUHJvW2VdLFxuICAgICAgICAgICAgICAgICAgICBhID0gdGhpcy5nZXRUb29sTWF4THYoKTtcbiAgICAgICAgICAgICAgICBpZiAobyA8IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MucGxheWVyLmFjaGlldmVQcm9bZV0gPSBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLoo4XlpIfmgLvnrYnnuqduXCJdOlxuICAgICAgICAgICAgICAgIHZhciBuID0gY2MucGxheWVyLmFjaGlldmVQcm9bZV0sXG4gICAgICAgICAgICAgICAgICAgIGkgPSB0aGlzLmdldFRvb2xBbGxMdigpO1xuICAgICAgICAgICAgICAgIGlmIChuIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5wbGF5ZXIuYWNoaWV2ZVByb1tlXSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYy5wbGF5ZXIuYWNoaWV2ZVByb1tlXSArPSB0O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRUb29sTWF4THY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICBmb3IgKHZhciB0IGluIGNjLnBsYXllci50b29sRGF0YSkge1xuICAgICAgICAgICAgdmFyIG8gPSBjYy5wbGF5ZXIudG9vbERhdGFbdF07XG4gICAgICAgICAgICBpZiAoZSA8PSBvLmx2KSB7XG4gICAgICAgICAgICAgICAgZSA9IG8ubHY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBnZXRUb29sQWxsTHY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSAwO1xuICAgICAgICBmb3IgKHZhciB0IGluIGNjLnBsYXllci50b29sRGF0YSkgZSArPSBjYy5wbGF5ZXIudG9vbERhdGFbdF0ubHY7XG4gICAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgYWRkTWlzc2lvblByb2dyZXNzOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICBpZiAodm9pZCAwID09PSB0KSB7XG4gICAgICAgICAgICB0ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLmjJHmiJjkuLvnur/nq6DoioIx5qyhXCJdOlxuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWNh+e6p+S7u+aEj+ijheWkhzHmrKFcIl06XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkRGF5TWlzc2lvblByb2dyZXNzKGUsIHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuavj+aXpeWVhuW6l+i0reS5sG7mrKHnianlk4FcIl06XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6auY57qn5a6d566x5oq95Y+W6KOF5aSHbuasoVwiXTpcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGREYXlNaXNzaW9uUHJvZ3Jlc3MoZSwgdCk7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkV2Vla01pc3Npb25Qcm9ncmVzcyhlLCB0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLmiavojaHlhbPljaFu5qyhXCJdOlxuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWPguS4juaXoOWwveaMkeaImOi1m07mrKFcIl06XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi5Y+C5LiO5oyR5oiY5YWz5Y2hbuasoVwiXTpcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGREYXlNaXNzaW9uUHJvZ3Jlc3MoZSwgdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6LSt5Lmw5L2T5YqbbuasoVwiXTpcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGREYXlNaXNzaW9uUHJvZ3Jlc3MoZSwgdCk7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkQWNoaWV2ZVByb2dyZXNzKGUsIHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuingueci+W5v+WRim7mrKFcIl06XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkRGF5TWlzc2lvblByb2dyZXNzKGUsIHQpO1xuICAgICAgICAgICAgICAgIGNjLnB2ei5QbGF5ZXJEYXRhLmFkZFdlZWtNaXNzaW9uUHJvZ3Jlc3MoZSwgdCk7XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkQWNoaWV2ZVByb2dyZXNzKGUsIHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIumAmuWFs+S4u+e6v+WJr+acrG7mrKFcIl06XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkV2Vla01pc3Npb25Qcm9ncmVzcyhlLCB0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLlh7votKXlg7XlsLhu5LiqXCJdOlxuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuWHu+i0pemmlumihm7kuKpcIl06XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkV2Vla01pc3Npb25Qcm9ncmVzcyhlLCB0KTtcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRBY2hpZXZlUHJvZ3Jlc3MoZSwgdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6YCa5YWz5oyR5oiY5YWz5Y2hbuasoVwiXTpcbiAgICAgICAgICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRXZWVrTWlzc2lvblByb2dyZXNzKGUsIHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIumAmui/h+S4u+e6v+eroOiKgm5cIl06XG4gICAgICAgICAgICBjYXNlIGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6KOF5aSH5pyA6auY562J57qn6L6+5YiwblwiXTpcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLoo4XlpIfmgLvnrYnnuqduXCJdOlxuICAgICAgICAgICAgY2FzZSBjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIue0r+iuoeiOt+W+l+mHkeW4gVwiXTpcbiAgICAgICAgICAgIGNhc2UgY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLntK/orqHmtojogJfpkrvnn7NcIl06XG4gICAgICAgICAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkQWNoaWV2ZVByb2dyZXNzKGUsIHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlZCgpO1xuICAgIH0sXG4gICAgb25DaGVja09sZFBsYXllck1pc3Npb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucHZ6LlBsYXllckRhdGEuYWRkTWlzc2lvblByb2dyZXNzKGNjLnB2ei5HYW1lQ29uZmlnLk1pc3Npb25UeXBlW1wi6YCa6L+H5Li757q/56ug6IqCblwiXSwgY2MucGxheWVyLmxldmVsIC0gMSk7XG4gICAgICAgIGNjLnB2ei5QbGF5ZXJEYXRhLmFkZE1pc3Npb25Qcm9ncmVzcyhjYy5wdnouR2FtZUNvbmZpZy5NaXNzaW9uVHlwZVtcIuijheWkh+aAu+etiee6p25cIl0pO1xuICAgICAgICBjYy5wdnouUGxheWVyRGF0YS5hZGRNaXNzaW9uUHJvZ3Jlc3MoY2MucHZ6LkdhbWVDb25maWcuTWlzc2lvblR5cGVbXCLoo4XlpIfmnIDpq5jnrYnnuqfovr7liLBuXCJdKTtcbiAgICB9LFxuICAgIGhhc0Z1bmRHZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0sXG4gICAgc2V0RnVuZEdldHRlZDogZnVuY3Rpb24gKCkge31cbn07XG5pZiAoY2MucHZ6KSB7XG4gICAgLy9cbn0gZWxzZSB7XG4gICAgY2MucHZ6ID0ge307XG59XG5jYy5wdnouUGxheWVyRGF0YSA9IG87XG5tb2R1bGUuZXhwb3J0cyA9IG87XG4iXX0=