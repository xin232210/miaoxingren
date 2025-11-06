
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/rank/scripts/UIRankUpEffect.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '252e2aY3UFO9ZlBbrR+wKoE', 'UIRankUpEffect');
// rank/scripts/UIRankUpEffect.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    fromLabel: cc.Label,
    toLabel: cc.Label
  },
  initBy: function initBy(e, t) {
    this.fromLabel.string = e;
    this.toLabel.string = t;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9yYW5rL3NjcmlwdHMvVUlSYW5rVXBFZmZlY3QuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJmcm9tTGFiZWwiLCJMYWJlbCIsInRvTGFiZWwiLCJpbml0QnkiLCJlIiwidCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7RUFDTCxXQUFTRCxFQUFFLENBQUNFLFNBRFA7RUFFTEMsVUFBVSxFQUFFO0lBQ1JDLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxLQUROO0lBRVJDLE9BQU8sRUFBRU4sRUFBRSxDQUFDSztFQUZKLENBRlA7RUFNTEUsTUFBTSxFQUFFLGdCQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7SUFDcEIsS0FBS0wsU0FBTCxDQUFlTSxNQUFmLEdBQXdCRixDQUF4QjtJQUNBLEtBQUtGLE9BQUwsQ0FBYUksTUFBYixHQUFzQkQsQ0FBdEI7RUFDSDtBQVRJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBmcm9tTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICB0b0xhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG4gICAgaW5pdEJ5OiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICB0aGlzLmZyb21MYWJlbC5zdHJpbmcgPSBlO1xuICAgICAgICB0aGlzLnRvTGFiZWwuc3RyaW5nID0gdDtcbiAgICB9XG59KTtcbiJdfQ==