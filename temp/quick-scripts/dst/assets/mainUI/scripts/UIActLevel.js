
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/mainUI/scripts/UIActLevel.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'c3207NRZlJHrJK97e4aw5/y', 'UIActLevel');
// mainUI/scripts/UIActLevel.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    panel: cc.Node,
    actLevelList: [cc.Node]
  },
  onLoad: function onLoad() {
    cc.UIActLevel = this;
  },
  initBy: function initBy() {
    cc.pvz.utils.fadeInBtn(this.node);
    this.node.active = !0;
    this.panel.scale = Math.min(1.4, this.node.width / 720);
    this.initActItemList();
  },
  initActItemList: function initActItemList() {
    this.actLevelList[0].getComponent("ActLevelItem").initActLevelItem(0);
  },
  onCloseUI: function onCloseUI() {
    this.node.active = !1;
  },
  onClickOther: function onClickOther() {
    cc.popupManager.showToast("即将开启...");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9tYWluVUkvc2NyaXB0cy9VSUFjdExldmVsLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFuZWwiLCJOb2RlIiwiYWN0TGV2ZWxMaXN0Iiwib25Mb2FkIiwiVUlBY3RMZXZlbCIsImluaXRCeSIsInB2eiIsInV0aWxzIiwiZmFkZUluQnRuIiwibm9kZSIsImFjdGl2ZSIsInNjYWxlIiwiTWF0aCIsIm1pbiIsIndpZHRoIiwiaW5pdEFjdEl0ZW1MaXN0IiwiZ2V0Q29tcG9uZW50IiwiaW5pdEFjdExldmVsSXRlbSIsIm9uQ2xvc2VVSSIsIm9uQ2xpY2tPdGhlciIsInBvcHVwTWFuYWdlciIsInNob3dUb2FzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUosRUFBRSxDQUFDSyxJQURGO0lBRVJDLFlBQVksRUFBRSxDQUFDTixFQUFFLENBQUNLLElBQUo7RUFGTixDQUZQO0VBTUxFLE1BQU0sRUFBRSxrQkFBWTtJQUNoQlAsRUFBRSxDQUFDUSxVQUFILEdBQWdCLElBQWhCO0VBQ0gsQ0FSSTtFQVNMQyxNQUFNLEVBQUUsa0JBQVk7SUFDaEJULEVBQUUsQ0FBQ1UsR0FBSCxDQUFPQyxLQUFQLENBQWFDLFNBQWIsQ0FBdUIsS0FBS0MsSUFBNUI7SUFDQSxLQUFLQSxJQUFMLENBQVVDLE1BQVYsR0FBbUIsQ0FBQyxDQUFwQjtJQUNBLEtBQUtWLEtBQUwsQ0FBV1csS0FBWCxHQUFtQkMsSUFBSSxDQUFDQyxHQUFMLENBQVMsR0FBVCxFQUFjLEtBQUtKLElBQUwsQ0FBVUssS0FBVixHQUFrQixHQUFoQyxDQUFuQjtJQUNBLEtBQUtDLGVBQUw7RUFDSCxDQWRJO0VBZUxBLGVBQWUsRUFBRSwyQkFBWTtJQUN6QixLQUFLYixZQUFMLENBQWtCLENBQWxCLEVBQXFCYyxZQUFyQixDQUFrQyxjQUFsQyxFQUFrREMsZ0JBQWxELENBQW1FLENBQW5FO0VBQ0gsQ0FqQkk7RUFrQkxDLFNBQVMsRUFBRSxxQkFBWTtJQUNuQixLQUFLVCxJQUFMLENBQVVDLE1BQVYsR0FBbUIsQ0FBQyxDQUFwQjtFQUNILENBcEJJO0VBcUJMUyxZQUFZLEVBQUUsd0JBQVk7SUFDdEJ2QixFQUFFLENBQUN3QixZQUFILENBQWdCQyxTQUFoQixDQUEwQixTQUExQjtFQUNIO0FBdkJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBwYW5lbDogY2MuTm9kZSxcbiAgICAgICAgYWN0TGV2ZWxMaXN0OiBbY2MuTm9kZV1cbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5VSUFjdExldmVsID0gdGhpcztcbiAgICB9LFxuICAgIGluaXRCeTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5wdnoudXRpbHMuZmFkZUluQnRuKHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSAhMDtcbiAgICAgICAgdGhpcy5wYW5lbC5zY2FsZSA9IE1hdGgubWluKDEuNCwgdGhpcy5ub2RlLndpZHRoIC8gNzIwKTtcbiAgICAgICAgdGhpcy5pbml0QWN0SXRlbUxpc3QoKTtcbiAgICB9LFxuICAgIGluaXRBY3RJdGVtTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFjdExldmVsTGlzdFswXS5nZXRDb21wb25lbnQoXCJBY3RMZXZlbEl0ZW1cIikuaW5pdEFjdExldmVsSXRlbSgwKTtcbiAgICB9LFxuICAgIG9uQ2xvc2VVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gITE7XG4gICAgfSxcbiAgICBvbkNsaWNrT3RoZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MucG9wdXBNYW5hZ2VyLnNob3dUb2FzdChcIuWNs+WwhuW8gOWQry4uLlwiKTtcbiAgICB9XG59KTtcbiJdfQ==