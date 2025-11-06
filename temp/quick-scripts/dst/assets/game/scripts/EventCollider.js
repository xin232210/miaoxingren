
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/EventCollider.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9db9bEvNslK+4vmMmw/JrC8', 'EventCollider');
// game/scripts/EventCollider.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spine: sp.Skeleton,
    event: "fire",
    collider: cc.Collider
  },
  onLoad: function onLoad() {
    var t = this;
    this.collider.enabled = !1;
    this.spine.setEventListener(function (e, i) {
      if (i.data.name == t.event) {
        cc.pvz.utils.manuallyCheckCollider(t.collider);
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvRXZlbnRDb2xsaWRlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNwaW5lIiwic3AiLCJTa2VsZXRvbiIsImV2ZW50IiwiY29sbGlkZXIiLCJDb2xsaWRlciIsIm9uTG9hZCIsInQiLCJlbmFibGVkIiwic2V0RXZlbnRMaXN0ZW5lciIsImUiLCJpIiwiZGF0YSIsIm5hbWUiLCJwdnoiLCJ1dGlscyIsIm1hbnVhbGx5Q2hlY2tDb2xsaWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLEtBQUssRUFBRUMsRUFBRSxDQUFDQyxRQURGO0lBRVJDLEtBQUssRUFBRSxNQUZDO0lBR1JDLFFBQVEsRUFBRVIsRUFBRSxDQUFDUztFQUhMLENBRlA7RUFPTEMsTUFBTSxFQUFFLGtCQUFZO0lBQ2hCLElBQUlDLENBQUMsR0FBRyxJQUFSO0lBQ0EsS0FBS0gsUUFBTCxDQUFjSSxPQUFkLEdBQXdCLENBQUMsQ0FBekI7SUFDQSxLQUFLUixLQUFMLENBQVdTLGdCQUFYLENBQTRCLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtNQUN4QyxJQUFJQSxDQUFDLENBQUNDLElBQUYsQ0FBT0MsSUFBUCxJQUFlTixDQUFDLENBQUNKLEtBQXJCLEVBQTRCO1FBQ3hCUCxFQUFFLENBQUNrQixHQUFILENBQU9DLEtBQVAsQ0FBYUMscUJBQWIsQ0FBbUNULENBQUMsQ0FBQ0gsUUFBckM7TUFDSDtJQUNKLENBSkQ7RUFLSDtBQWZJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzcGluZTogc3AuU2tlbGV0b24sXG4gICAgICAgIGV2ZW50OiBcImZpcmVcIixcbiAgICAgICAgY29sbGlkZXI6IGNjLkNvbGxpZGVyXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbGxpZGVyLmVuYWJsZWQgPSAhMTtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRFdmVudExpc3RlbmVyKGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICAgICAgICBpZiAoaS5kYXRhLm5hbWUgPT0gdC5ldmVudCkge1xuICAgICAgICAgICAgICAgIGNjLnB2ei51dGlscy5tYW51YWxseUNoZWNrQ29sbGlkZXIodC5jb2xsaWRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl19