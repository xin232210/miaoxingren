"use strict";
cc._RF.push(module, 'a52e5qhqWhJ5obJUHW0sS3o', 'JsonControl');
// scripts/JsonControl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    itemJsonFile: cc.JsonAsset,
    levelMapJsonFile: cc.JsonAsset,
    toolInfoJsonFile: cc.JsonAsset,
    toollvUpJsonFile: cc.JsonAsset,
    levelDataJsonFile: cc.JsonAsset,
    actLevelBoxJsonFile: cc.JsonAsset,
    actLevelBuffJsonFile: cc.JsonAsset,
    actLevelJsonFile: cc.JsonAsset,
    rankLevelJsonFile: cc.JsonAsset,
    dayMissionJsonFile: cc.JsonAsset,
    dayMissionBoxJsonFile: cc.JsonAsset,
    weekMissionJsonFile: cc.JsonAsset,
    weekMissionBoxJsonFile: cc.JsonAsset,
    achieveJsonFile: cc.JsonAsset,
    materialList: {
      "default": [],
      type: [cc.Material],
      tooltip: "灰色材质"
    }
  },
  onLoad: function onLoad() {
    cc.JsonControl = this;
    this.itemJson = this.itemJsonFile.json;
    this.levelMapJson = this.levelMapJsonFile.json;
    this.toolInfoJson = this.toolInfoJsonFile.json;
    this.toolLvUpJson = this.toollvUpJsonFile.json;
    this.levelDataJson = this.levelDataJsonFile.json;
    this.ActLevelBoxJson = this.actLevelBoxJsonFile.json;
    this.ActLevelJson = this.actLevelJsonFile.json;
    this.ActLevelBuffJson = this.actLevelBuffJsonFile.json;
    this.dayMissionJson = this.dayMissionJsonFile.json;
    this.dayMissionBoxJson = this.dayMissionBoxJsonFile.json;
    this.weekMissionJson = this.weekMissionJsonFile.json;
    this.weekMissionBoxJson = this.weekMissionBoxJsonFile.json;
    this.achieveJson = this.achieveJsonFile.json;
  },
  getAllAchieveJson: function getAllAchieveJson() {
    return this.achieveJson;
  },
  getAchieveJson: function getAchieveJson(e) {
    return this.achieveJson.find(function (t) {
      return t.ID == e;
    });
  },
  getAllDayMissionJson: function getAllDayMissionJson() {
    return this.dayMissionJson;
  },
  getDayMissionBoxJson: function getDayMissionBoxJson() {
    return this.dayMissionBoxJson;
  },
  getAllWeekMissionJson: function getAllWeekMissionJson() {
    return this.weekMissionJson;
  },
  getWeekMissionBoxJson: function getWeekMissionBoxJson() {
    return this.weekMissionBoxJson;
  },
  getActBuffJson: function getActBuffJson(e) {
    return this.ActLevelBuffJson.find(function (t) {
      return t.id == e;
    });
  },
  getLevelData: function getLevelData(e) {
    return this.levelDataJson[e - 1];
  },
  getSkillIcon: function getSkillIcon(e, t) {
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "skill/skill" + t);
  },
  getToolLvUpJson: function getToolLvUpJson(e) {
    if (e >= cc.pvz.GameConfig.MaxToolLv) {
      e = cc.pvz.GameConfig.MaxToolLv - 1;
    }

    return this.toolLvUpJson[e - 1];
  },
  getToolJson: function getToolJson(e) {
    return this.toolInfoJson.find(function (t) {
      return t.id == e;
    });
  },
  getToolIcon: function getToolIcon(e, t, o) {
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "plant/wq/zw_" + t + "_" + o);
  },
  getToolSkinIcon: function getToolSkinIcon(e, t, o) {
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "game/wq/wq" + t + "_" + o);
  },
  getToolBgIcon: function getToolBgIcon(e, t) {
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "wqdi/wqdi" + t);
  },
  getQualityCardIcon: function getQualityCardIcon(e, t) {
    var o = "pz" + t;
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "plant/" + o);
  },
  getToolTypeIcon: function getToolTypeIcon(e, t) {
    var o = "lattice" + t;
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "plant/" + o);
  },
  getToolAttriIcon: function getToolAttriIcon(e, t) {
    var o = "attr" + t;
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "plant/" + o);
  },
  getItemJson: function getItemJson(e) {
    return this.itemJson.find(function (t) {
      return t.ItemID == e;
    });
  },
  getItemIcon: function getItemIcon(e, t) {
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "item/item" + t);
  },
  getQualityBgIcon: function getQualityBgIcon(e, t) {
    var o = "pz_" + t;
    cc.pvz.utils.setSpriteFrame(e, "uiImage", "item/" + o);
  },
  getLevelCount: function getLevelCount() {
    return this.levelMapJson.length;
  },
  getLevelJson: function getLevelJson(e) {
    return this.levelMapJson[e - 1];
  },
  setSpriteGray: function setSpriteGray(e, t) {
    e.setMaterial(0, this.materialList[t ? 1 : 0]);
  }
});

cc._RF.pop();