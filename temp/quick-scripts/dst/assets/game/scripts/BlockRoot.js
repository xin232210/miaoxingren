
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game/scripts/BlockRoot.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd3155iemZ5AcLN3wHulrG+6', 'BlockRoot');
// game/scripts/BlockRoot.js

"use strict";

var $prefabInfo = require("../../scripts/PrefabInfo");

var $block = require("./Block");

cc.Class({
  "extends": cc.Component,
  properties: {
    ui1: cc.Node,
    ui2: cc.Node,
    itemRootNode: cc.Node,
    blockPrefab: $prefabInfo,
    extendModeBg: cc.Node,
    boardsRoot: cc.Node,
    boardItemBgsRoot: cc.Node,
    boardItemsRoot: cc.Node,
    blockSpfs: [cc.SpriteFrame],
    stashEnable: !0,
    stashRoot: cc.Node,
    stashBlock: $block,
    stashRectNode: cc.Node
  },
  onLoad: function onLoad() {
    this.itemRoot = this.itemRootNode.getComponent("ItemRoot");
  },
  onEvents: function onEvents() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
  },
  offEvents: function offEvents() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
  },
  startLogic: function startLogic() {
    var t = this;
    this.datas = new Array(35).fill(-1);
    cc.pvz.runtimeData.blocks.forEach(function (e) {
      t.datas[e] = 0;
    });

    if (113 == cc.pvz.runtimeData.actBuff2) {
      [0, 1, 3, 4, 5, 9, 25, 29, 30, 31, 33, 34].forEach(function (e) {
        t.datas[e] = 1;
      });
    }

    this.blocks = new Array(35).fill(null);
    this.poses = [];
    this.extendModeBg.children.map(function (t) {
      return t;
    }).forEach(function (e, i) {
      if (1 == t.datas[i]) {
        t.poses.push(null);
        return void (e.parent = null);
      }

      var n = e.getComponent("Pos");
      n.setRoot(t);
      n.i = i;
      t.poses.push(n);
    });
    this.toPutArr = [];
    this.createBlocks();
    cc.pvz.runtimeData.items.forEach(function (e) {
      var i = e.bs.map(function (e) {
        return t.blocks[e];
      });
      var n = t.scene.newEquipItem(e.lv, e.id, i);
      n.node.parent = t.boardItemsRoot;
      n.setBgSpParent(!1);
    });
    this.setExtendMode(!1);
    this.onEvents();
  },
  backFromGame: function backFromGame() {
    this.poses.forEach(function (t) {
      if (t) {
        t.setPreview(-1);
      }
    });
    this.blocks.forEach(function (t) {
      if (t) {
        t.setPreview(-1);

        if (t.item) {
          t.item.hideUnderBuffEffect();
        }
      }
    });
    this.setExtendMode(!1);
  },
  onClickBegan: function onClickBegan(t) {
    if (4 != cc.pvz.runtimeData.guide) {
      this.dragBoard = !1;
      this.clickedItem = null;

      if (this.isExtendMode) {
        this.onBoardClickBegan(t);
      } else {
        var e = this.boardsRoot.convertToNodeSpaceAR(t.getLocation());
        var i = Math.floor(e.x / 106 + 0.5);
        var n = 5 * Math.floor(-e.y / 106 + 0.5) + i;

        if (-1 != this.datas[n] && this.blocks[n] && this.blocks[n].item) {
          this.clickedItem = this.blocks[n].item;
          this.clickedItem.pickupFromBoard(t.getLocation());
        }
      }
    } else {
      cc.guideManager.onStepFinished();
    }
  },
  onClickMoved: function onClickMoved(t) {
    if (this.dragBoard) {
      this.onBoardClickMoved(t.getDelta());
    } else {
      if (this.clickedItem) {
        this.clickedItem.onClickMoved(t);
      }
    }
  },
  onClickEnded: function onClickEnded(t) {
    if (this.dragBoard) {
      this.onBoardClickEnded();
    } else {
      if (this.clickedItem) {
        this.clickedItem.onClickEnded(t);
        this.clickedItem = null;
      }
    }
  },
  onBoardClickBegan: function onBoardClickBegan(t) {
    var e = this;
    var i = this.boardsRoot.convertToNodeSpaceAR(t.getLocation());
    var n = Math.floor(i.x / 106 + 0.5);
    var o = 5 * Math.floor(-i.y / 106 + 0.5) + n;

    if (-1 != this.datas[o]) {
      this.dragBoard = !0;
      this.dragBoardMoved = cc.Vec2.ZERO;
      this.poses.forEach(function (t) {
        if (t) {
          t.node.active = !0;
        }
      });
    } else {
      this.toPutArr.forEach(function (i) {
        if (i.myBlocks.some(function (t) {
          return t.i == o;
        })) {
          e.clickedItem = i;
          e.clickedItem.pickupFromBoard(t.getLocation());
        }
      });
    }
  },
  onBoardClickMoved: function onBoardClickMoved(t) {
    var e = this;
    this.boardsRoot.position = this.boardsRoot.position.add(t);
    this.boardItemBgsRoot.position = this.boardItemsRoot.position.add(t);
    this.boardItemsRoot.position = this.boardItemsRoot.position.add(t);
    this.dragBoardMoved.addSelf(t);
    this.poses.forEach(function (t) {
      if (t) {
        t.setPreview(-1);
      }
    });
    var i = [];
    var n = this.getBlocksToPut(i);
    i.forEach(function (t) {
      if (e.poses[t]) {
        e.poses[t].setPreview(n ? 0 : 1);
      }
    });
  },
  onBoardClickEnded: function onBoardClickEnded() {
    var t = this;
    var e = [];
    var i = this.getBlocksToPut(e);
    e.forEach(function (e) {
      t.poses[e].setPreview(-1);
    });

    if (i) {
      var n = Math.floor(this.dragBoardMoved.x / 106 + 0.5);
      var o = Math.floor(-this.dragBoardMoved.y / 106 + 0.5);
      var s = cc.v2(106 * n, 106 * -o);
      var c = 5 * o + n;
      this.datas.fill(-1);
      this.blocks.fill(null);
      e.forEach(function (e) {
        t.datas[e] = 0;
      });
      var a = this.boardsRoot.children.map(function (t) {
        return t;
      });
      a.sort(function (t, e) {
        return t.i - e.i;
      });
      a.forEach(function (e) {
        e.position = e.position.add(s);
        var i = e.getComponent("Block");
        i.i += c;
        t.blocks[i.i] = i;
      });
      this.boardItemBgsRoot.children.forEach(function (t) {
        t.position = t.position.add(s);
      });
      this.boardItemsRoot.children.forEach(function (t) {
        t.position = t.position.add(s);
      });
    }

    this.dragBoard = !1;
    this.boardsRoot.position = cc.Vec2.ZERO;
    this.boardItemBgsRoot.position = cc.Vec2.ZERO;
    this.boardItemsRoot.position = cc.Vec2.ZERO;
    this.poses.forEach(function (e, i) {
      if (e) {
        e.node.active = -1 == t.datas[i];
      }
    });
  },
  onStashClickBegan: function onStashClickBegan() {
    this.dragBoard = !1;
    this.clickedItem = null;
  },
  onStashClickMoved: function onStashClickMoved(t) {
    if (this.dragBoard) {//
    } else {
      if (this.clickedItem) {
        this.clickedItem.onClickMoved(t);
      }
    }
  },
  onStashClickEnded: function onStashClickEnded(t) {
    if (this.dragBoard) {//
    } else {
      if (this.clickedItem) {
        this.clickedItem.onClickEnded(t);
        this.clickedItem = null;
      }
    }
  },
  findPosForBlock: function findPosForBlock(t) {
    var e = this;

    var i = function i() {
      var i = n % 5;
      var o = (n - i) / 5;
      var s = t.xys.map(function (t) {
        return {
          x: Math.floor(i + t.x),
          y: Math.floor(o + t.y)
        };
      });
      var c = [];
      var a = !0;
      s.forEach(function (t) {
        var i = t.x;
        var n = t.y;

        if (!(i < 0 || n < 0 || i > 4 || n > 6)) {
          var o = 5 * n + i;

          if (e.blocks[o]) {
            return void (a = !1);
          } else {
            return c.push(o), -1 == e.datas[o];
          }
        }

        a = !1;
      });

      if (a && !s.every(function (t) {
        return e.testCantPlace(5 * t.y + t.x);
      })) {
        return {
          v: c[0]
        };
      }
    };

    for (var n = 0; n < 35; n++) {
      var o = i();

      if ("object" == typeof o) {
        return o.v;
      }
    }

    return -1;
  },
  findBlockForItem: function findBlockForItem(t) {
    var e = this;

    if (0 == t.id) {
      return this.findPosForBlock(t);
    }

    var i = function i() {
      var i = n % 5;
      var o = (n - i) / 5;
      var s = [];
      var c = !0;
      t.xys.forEach(function (t) {
        var n = Math.floor(i + t.x);
        var a = Math.floor(o + t.y);

        if (!(n < 0 || a < 0 || n > 4 || a > 6)) {
          var r = 5 * a + n;

          if (e.blocks[r]) {
            if (e.blocks[r].item) {
              return void (c = !1);
            } else {
              return s.push(r), 0 == e.datas[r];
            }
          } else {
            return void (c = !1);
          }
        }

        c = !1;
      });

      if (c) {
        return {
          v: s[0]
        };
      }
    };

    for (var n = 0; n < 35; n++) {
      var o = i();

      if ("object" == typeof o) {
        return o.v;
      }
    }

    return -1;
  },
  testItem: function testItem(t, e, i) {
    var n = this;

    if (void 0 === i) {
      i = null;
    }

    var o = [];
    this.blocks.forEach(function (t) {
      if (t) {
        t.setPreview(-1);

        if (t.item) {
          t.item.hideUnderBuffEffect();
        }
      }
    });
    var s = this.boardsRoot.convertToNodeSpaceAR(e);
    var c = s.x / 106 + 0.5;
    var a = -s.y / 106 + 0.5;
    var r = !0;
    t.xys.forEach(function (t) {
      var e = Math.floor(c + t.x);
      var i = Math.floor(a + t.y);

      if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
        var s = 5 * i + e;

        if (n.blocks[s]) {
          return o.push(s), 0 == n.datas[s];
        } else {
          return void (r = !1);
        }
      }

      r = !1;
    });
    o.forEach(function (t) {
      if (i) {
        i.push(n.blocks[t]);
      }

      n.blocks[t].setPreview(r ? 0 : 1);
    });

    if (6 == t.id) {
      var h = Math.floor(c + t.xys[0].x);
      var d = Math.floor(a + t.xys[0].y);
      this.getCrossItems(t.id, 5 * d + h, function (e) {
        e.showUnderBuffEffect(t.id);
      });
    }

    return r;
  },
  testBlock: function testBlock(t, e, i) {
    var n = this;

    if (void 0 === i) {
      i = null;
    }

    var o = this.extendModeBg.convertToNodeSpaceAR(e);
    var s = o.x / 106 + 0.5;
    var c = -o.y / 106 + 0.5;
    var a = [];
    var r = !0;
    t.xys.forEach(function (t) {
      var e = Math.floor(s + t.x);
      var i = Math.floor(c + t.y);

      if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
        var o = 5 * i + e;

        if (n.poses[o]) {
          if (n.blocks[o]) {
            return void (r = !1);
          } else {
            return a.push(o), -1 == n.datas[o];
          }
        } else {
          return void (r = !1);
        }
      }

      r = !1;
    });
    this.poses.forEach(function (t) {
      if (t) {
        t.setPreview(-1);
      }
    });
    a.forEach(function (t) {
      if (i) {
        i.push(n.poses[t]);
      }

      n.poses[t].setPreview(r ? 0 : 1);
    });
    return r;
  },
  getBlocksToPut: function getBlocksToPut(t) {
    var e = this;
    var i = Math.floor(this.dragBoardMoved.x / 106 + 0.5);
    var n = Math.floor(-this.dragBoardMoved.y / 106 + 0.5);
    var o = !0;
    this.datas.forEach(function (s, c) {
      if (0 == s) {
        var a = c % 5;
        var r = a + i;
        var h = (c - a) / 5 + n;

        if (r < 0 || h < 0 || r > 4 || h > 6) {
          o = !1;
        } else {
          var d = 5 * h + r;

          if (e.poses[d]) {
            if (e.hasTryPlace(d)) {
              o = !1;
            } else {
              t.push(d);
            }
          } else {
            o = !1;
          }
        }
      }
    });
    return o;
  },
  debug: function debug() {
    this.blocks.forEach(function (t) {
      if (t && t.item && t.item.myBlocks.every(function (e) {
        return e.i != t.i;
      })) {
        cc.warn("sync 1");
      }
    });
    this.boardItemsRoot.children.forEach(function (t) {
      var e = t.getComponent("Item");

      if (e.myBlocks.length != e.xys.length) {
        cc.warn("sync 2");
      }

      if (e.myBlocks.some(function (t) {
        return t.item != e;
      })) {
        cc.warn("sync 3");
      }

      var i = t.x / 106;
      var n = t.y / 106;
      console.log("(" + i + "," + n + ")");
    });
  },
  getBlockPos: function getBlockPos(t) {
    var e = t % 5;
    var i = (t - e) / 5;
    return cc.v2(106 * e, 106 * -i);
  },
  createBlock: function createBlock(t) {
    var e = this.blockPrefab.addNode(this.getBlockPos(t)).getComponent("Block");
    e.setRoot(this);
    e.i = t;
    this.blocks[t] = e;
    this.poses[t].node.active = !1;
    this.poses[t].item = null;
  },
  createBlocks: function createBlocks() {
    var t = this;
    this.datas.forEach(function (e, i) {
      if (0 == e) {
        t.createBlock(i);
      }
    });
  },
  setExtendMode: function setExtendMode(t) {
    this.extendModeBg.active = t;
    this.ui1.active = !t;
    this.ui2.active = t;

    if (t) {
      if (this.isExtendMode) {//
      } else {
        this.toPutArr.length = 0;
      }
    }

    this.isExtendMode = t;
  },
  resetBlocksPreview: function resetBlocksPreview() {
    this.blocks.forEach(function (t) {
      if (t) {
        t.setPreview(-1);

        if (t.item) {
          t.item.hideUnderBuffEffect();
          t.item.updateLv5Effect();
        }
      }
    });
  },
  resetPosesPreview: function resetPosesPreview() {
    this.poses.forEach(function (t) {
      if (t && t.node.active) {
        t.setPreview(-1);
      }
    });
  },
  tryPlace: function tryPlace(t) {
    if (-1 == this.toPutArr.findIndex(function (e) {
      return e == t;
    })) {
      this.toPutArr.push(t);
    }
  },
  undoTryPlace: function undoTryPlace(t) {
    var e = this.toPutArr.findIndex(function (e) {
      return e == t;
    });

    if (-1 != e) {
      this.toPutArr.splice(e, 1);
    }
  },
  hasTryPlace: function hasTryPlace(t) {
    return this.toPutArr.some(function (e) {
      return e.myBlocks.some(function (e) {
        return e.i == t;
      });
    });
  },
  testCantPlace: function testCantPlace(t) {
    var e = this;
    var i = t % 5;
    var n = (t - i) / 5;
    return [{
      x: 0,
      y: -1
    }, {
      x: 0,
      y: 1
    }, {
      x: -1,
      y: 0
    }, {
      x: 1,
      y: 0
    }].every(function (t) {
      var o = t.x + i;
      var s = t.y + n;

      if (o < 0 || s < 0 || o > 4 || s > 6) {
        return !0;
      }

      var c = 5 * s + o;
      return -1 == e.datas[c];
    });
  },
  onClickPlaceEnd: function onClickPlaceEnd() {
    var t = this;

    var e = function e(_e) {
      for (var i = 0; i < _e.length; i++) {
        var n = _e[i];
        var o = n.myBlocks.map(function (t) {
          return t.i;
        });

        if (!o.every(function (e) {
          return t.testCantPlace(e);
        })) {
          o.forEach(function (e) {
            if (t.blocks[e]) {
              cc.warn("xxx");
            }

            t.datas[e] = 0;
            t.createBlock(e);
          });
          n.removeFromBlock();
          n.node.parent = null;
          return !0;
        }
      }

      return !1;
    };

    var i = [];

    do {
      i = this.toPutArr.map(function (t) {
        return t;
      });
    } while (e(i));

    i.forEach(function (t) {
      t.removeFromBlock();
      t.itemRoot.putdown(t, t.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
    });
    this.setExtendMode(!1);
    this.itemRoot.setCanDrag(!0);
  },
  getCrossItems: function getCrossItems(t, e, i) {
    var n = this;

    if (6 == t) {
      var o = new Set();
      var s = e % 5;
      var c = (e - s) / 5;
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (t) {
        var e = s + t[0];
        var i = c + t[1];

        if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
          var a = 5 * i + e;

          if (n.blocks[a] && n.blocks[a].item) {
            o.add(n.blocks[a].item);
          }
        }
      });
      o.forEach(function (t) {
        i(t);
      });
    }
  },
  isFull: function isFull() {
    return this.blocks.every(function (t) {
      return null == t || null != t.item;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9nYW1lL3NjcmlwdHMvQmxvY2tSb290LmpzIl0sIm5hbWVzIjpbIiRwcmVmYWJJbmZvIiwicmVxdWlyZSIsIiRibG9jayIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwidWkxIiwiTm9kZSIsInVpMiIsIml0ZW1Sb290Tm9kZSIsImJsb2NrUHJlZmFiIiwiZXh0ZW5kTW9kZUJnIiwiYm9hcmRzUm9vdCIsImJvYXJkSXRlbUJnc1Jvb3QiLCJib2FyZEl0ZW1zUm9vdCIsImJsb2NrU3BmcyIsIlNwcml0ZUZyYW1lIiwic3Rhc2hFbmFibGUiLCJzdGFzaFJvb3QiLCJzdGFzaEJsb2NrIiwic3Rhc2hSZWN0Tm9kZSIsIm9uTG9hZCIsIml0ZW1Sb290IiwiZ2V0Q29tcG9uZW50Iiwib25FdmVudHMiLCJub2RlIiwib24iLCJFdmVudFR5cGUiLCJUT1VDSF9TVEFSVCIsIm9uQ2xpY2tCZWdhbiIsIlRPVUNIX01PVkUiLCJvbkNsaWNrTW92ZWQiLCJUT1VDSF9FTkQiLCJvbkNsaWNrRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJvZmZFdmVudHMiLCJvZmYiLCJzdGFydExvZ2ljIiwidCIsImRhdGFzIiwiQXJyYXkiLCJmaWxsIiwicHZ6IiwicnVudGltZURhdGEiLCJibG9ja3MiLCJmb3JFYWNoIiwiZSIsImFjdEJ1ZmYyIiwicG9zZXMiLCJjaGlsZHJlbiIsIm1hcCIsImkiLCJwdXNoIiwicGFyZW50IiwibiIsInNldFJvb3QiLCJ0b1B1dEFyciIsImNyZWF0ZUJsb2NrcyIsIml0ZW1zIiwiYnMiLCJzY2VuZSIsIm5ld0VxdWlwSXRlbSIsImx2IiwiaWQiLCJzZXRCZ1NwUGFyZW50Iiwic2V0RXh0ZW5kTW9kZSIsImJhY2tGcm9tR2FtZSIsInNldFByZXZpZXciLCJpdGVtIiwiaGlkZVVuZGVyQnVmZkVmZmVjdCIsImd1aWRlIiwiZHJhZ0JvYXJkIiwiY2xpY2tlZEl0ZW0iLCJpc0V4dGVuZE1vZGUiLCJvbkJvYXJkQ2xpY2tCZWdhbiIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwiZ2V0TG9jYXRpb24iLCJNYXRoIiwiZmxvb3IiLCJ4IiwieSIsInBpY2t1cEZyb21Cb2FyZCIsImd1aWRlTWFuYWdlciIsIm9uU3RlcEZpbmlzaGVkIiwib25Cb2FyZENsaWNrTW92ZWQiLCJnZXREZWx0YSIsIm9uQm9hcmRDbGlja0VuZGVkIiwibyIsImRyYWdCb2FyZE1vdmVkIiwiVmVjMiIsIlpFUk8iLCJhY3RpdmUiLCJteUJsb2NrcyIsInNvbWUiLCJwb3NpdGlvbiIsImFkZCIsImFkZFNlbGYiLCJnZXRCbG9ja3NUb1B1dCIsInMiLCJ2MiIsImMiLCJhIiwic29ydCIsIm9uU3Rhc2hDbGlja0JlZ2FuIiwib25TdGFzaENsaWNrTW92ZWQiLCJvblN0YXNoQ2xpY2tFbmRlZCIsImZpbmRQb3NGb3JCbG9jayIsInh5cyIsImV2ZXJ5IiwidGVzdENhbnRQbGFjZSIsInYiLCJmaW5kQmxvY2tGb3JJdGVtIiwiciIsInRlc3RJdGVtIiwiaCIsImQiLCJnZXRDcm9zc0l0ZW1zIiwic2hvd1VuZGVyQnVmZkVmZmVjdCIsInRlc3RCbG9jayIsImhhc1RyeVBsYWNlIiwiZGVidWciLCJ3YXJuIiwibGVuZ3RoIiwiY29uc29sZSIsImxvZyIsImdldEJsb2NrUG9zIiwiY3JlYXRlQmxvY2siLCJhZGROb2RlIiwicmVzZXRCbG9ja3NQcmV2aWV3IiwidXBkYXRlTHY1RWZmZWN0IiwicmVzZXRQb3Nlc1ByZXZpZXciLCJ0cnlQbGFjZSIsImZpbmRJbmRleCIsInVuZG9UcnlQbGFjZSIsInNwbGljZSIsIm9uQ2xpY2tQbGFjZUVuZCIsInJlbW92ZUZyb21CbG9jayIsInB1dGRvd24iLCJjb252ZXJ0VG9Xb3JsZFNwYWNlQVIiLCJzZXRDYW5EcmFnIiwiU2V0IiwiaXNGdWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsR0FBR0MsT0FBTyxDQUFDLDBCQUFELENBQXpCOztBQUNBLElBQUlDLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBcEI7O0FBQ0FFLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0VBQ0wsV0FBU0QsRUFBRSxDQUFDRSxTQURQO0VBRUxDLFVBQVUsRUFBRTtJQUNSQyxHQUFHLEVBQUVKLEVBQUUsQ0FBQ0ssSUFEQTtJQUVSQyxHQUFHLEVBQUVOLEVBQUUsQ0FBQ0ssSUFGQTtJQUdSRSxZQUFZLEVBQUVQLEVBQUUsQ0FBQ0ssSUFIVDtJQUlSRyxXQUFXLEVBQUVYLFdBSkw7SUFLUlksWUFBWSxFQUFFVCxFQUFFLENBQUNLLElBTFQ7SUFNUkssVUFBVSxFQUFFVixFQUFFLENBQUNLLElBTlA7SUFPUk0sZ0JBQWdCLEVBQUVYLEVBQUUsQ0FBQ0ssSUFQYjtJQVFSTyxjQUFjLEVBQUVaLEVBQUUsQ0FBQ0ssSUFSWDtJQVNSUSxTQUFTLEVBQUUsQ0FBQ2IsRUFBRSxDQUFDYyxXQUFKLENBVEg7SUFVUkMsV0FBVyxFQUFFLENBQUMsQ0FWTjtJQVdSQyxTQUFTLEVBQUVoQixFQUFFLENBQUNLLElBWE47SUFZUlksVUFBVSxFQUFFbEIsTUFaSjtJQWFSbUIsYUFBYSxFQUFFbEIsRUFBRSxDQUFDSztFQWJWLENBRlA7RUFpQkxjLE1BQU0sRUFBRSxrQkFBWTtJQUNoQixLQUFLQyxRQUFMLEdBQWdCLEtBQUtiLFlBQUwsQ0FBa0JjLFlBQWxCLENBQStCLFVBQS9CLENBQWhCO0VBQ0gsQ0FuQkk7RUFvQkxDLFFBQVEsRUFBRSxvQkFBWTtJQUNsQixLQUFLQyxJQUFMLENBQVVDLEVBQVYsQ0FBYXhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRb0IsU0FBUixDQUFrQkMsV0FBL0IsRUFBNEMsS0FBS0MsWUFBakQsRUFBK0QsSUFBL0Q7SUFDQSxLQUFLSixJQUFMLENBQVVDLEVBQVYsQ0FBYXhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRb0IsU0FBUixDQUFrQkcsVUFBL0IsRUFBMkMsS0FBS0MsWUFBaEQsRUFBOEQsSUFBOUQ7SUFDQSxLQUFLTixJQUFMLENBQVVDLEVBQVYsQ0FBYXhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRb0IsU0FBUixDQUFrQkssU0FBL0IsRUFBMEMsS0FBS0MsWUFBL0MsRUFBNkQsSUFBN0Q7SUFDQSxLQUFLUixJQUFMLENBQVVDLEVBQVYsQ0FBYXhCLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRb0IsU0FBUixDQUFrQk8sWUFBL0IsRUFBNkMsS0FBS0QsWUFBbEQsRUFBZ0UsSUFBaEU7RUFDSCxDQXpCSTtFQTBCTEUsU0FBUyxFQUFFLHFCQUFZO0lBQ25CLEtBQUtWLElBQUwsQ0FBVVcsR0FBVixDQUFjbEMsRUFBRSxDQUFDSyxJQUFILENBQVFvQixTQUFSLENBQWtCQyxXQUFoQyxFQUE2QyxLQUFLQyxZQUFsRCxFQUFnRSxJQUFoRTtJQUNBLEtBQUtKLElBQUwsQ0FBVVcsR0FBVixDQUFjbEMsRUFBRSxDQUFDSyxJQUFILENBQVFvQixTQUFSLENBQWtCRyxVQUFoQyxFQUE0QyxLQUFLQyxZQUFqRCxFQUErRCxJQUEvRDtJQUNBLEtBQUtOLElBQUwsQ0FBVVcsR0FBVixDQUFjbEMsRUFBRSxDQUFDSyxJQUFILENBQVFvQixTQUFSLENBQWtCSyxTQUFoQyxFQUEyQyxLQUFLQyxZQUFoRCxFQUE4RCxJQUE5RDtJQUNBLEtBQUtSLElBQUwsQ0FBVVcsR0FBVixDQUFjbEMsRUFBRSxDQUFDSyxJQUFILENBQVFvQixTQUFSLENBQWtCTyxZQUFoQyxFQUE4QyxLQUFLRCxZQUFuRCxFQUFpRSxJQUFqRTtFQUNILENBL0JJO0VBZ0NMSSxVQUFVLEVBQUUsc0JBQVk7SUFDcEIsSUFBSUMsQ0FBQyxHQUFHLElBQVI7SUFDQSxLQUFLQyxLQUFMLEdBQWEsSUFBSUMsS0FBSixDQUFVLEVBQVYsRUFBY0MsSUFBZCxDQUFtQixDQUFDLENBQXBCLENBQWI7SUFDQXZDLEVBQUUsQ0FBQ3dDLEdBQUgsQ0FBT0MsV0FBUCxDQUFtQkMsTUFBbkIsQ0FBMEJDLE9BQTFCLENBQWtDLFVBQVVDLENBQVYsRUFBYTtNQUMzQ1IsQ0FBQyxDQUFDQyxLQUFGLENBQVFPLENBQVIsSUFBYSxDQUFiO0lBQ0gsQ0FGRDs7SUFHQSxJQUFJLE9BQU81QyxFQUFFLENBQUN3QyxHQUFILENBQU9DLFdBQVAsQ0FBbUJJLFFBQTlCLEVBQXdDO01BQ3BDLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkIsRUFBM0IsRUFBK0IsRUFBL0IsRUFBbUMsRUFBbkMsRUFBdUMsRUFBdkMsRUFBMkNGLE9BQTNDLENBQW1ELFVBQVVDLENBQVYsRUFBYTtRQUM1RFIsQ0FBQyxDQUFDQyxLQUFGLENBQVFPLENBQVIsSUFBYSxDQUFiO01BQ0gsQ0FGRDtJQUdIOztJQUNELEtBQUtGLE1BQUwsR0FBYyxJQUFJSixLQUFKLENBQVUsRUFBVixFQUFjQyxJQUFkLENBQW1CLElBQW5CLENBQWQ7SUFDQSxLQUFLTyxLQUFMLEdBQWEsRUFBYjtJQUNBLEtBQUtyQyxZQUFMLENBQWtCc0MsUUFBbEIsQ0FDS0MsR0FETCxDQUNTLFVBQVVaLENBQVYsRUFBYTtNQUNkLE9BQU9BLENBQVA7SUFDSCxDQUhMLEVBSUtPLE9BSkwsQ0FJYSxVQUFVQyxDQUFWLEVBQWFLLENBQWIsRUFBZ0I7TUFDckIsSUFBSSxLQUFLYixDQUFDLENBQUNDLEtBQUYsQ0FBUVksQ0FBUixDQUFULEVBQXFCO1FBQ2pCYixDQUFDLENBQUNVLEtBQUYsQ0FBUUksSUFBUixDQUFhLElBQWI7UUFDQSxPQUFPLE1BQU1OLENBQUMsQ0FBQ08sTUFBRixHQUFXLElBQWpCLENBQVA7TUFDSDs7TUFDRCxJQUFJQyxDQUFDLEdBQUdSLENBQUMsQ0FBQ3ZCLFlBQUYsQ0FBZSxLQUFmLENBQVI7TUFDQStCLENBQUMsQ0FBQ0MsT0FBRixDQUFVakIsQ0FBVjtNQUNBZ0IsQ0FBQyxDQUFDSCxDQUFGLEdBQU1BLENBQU47TUFDQWIsQ0FBQyxDQUFDVSxLQUFGLENBQVFJLElBQVIsQ0FBYUUsQ0FBYjtJQUNILENBYkw7SUFjQSxLQUFLRSxRQUFMLEdBQWdCLEVBQWhCO0lBQ0EsS0FBS0MsWUFBTDtJQUNBdkQsRUFBRSxDQUFDd0MsR0FBSCxDQUFPQyxXQUFQLENBQW1CZSxLQUFuQixDQUF5QmIsT0FBekIsQ0FBaUMsVUFBVUMsQ0FBVixFQUFhO01BQzFDLElBQUlLLENBQUMsR0FBR0wsQ0FBQyxDQUFDYSxFQUFGLENBQUtULEdBQUwsQ0FBUyxVQUFVSixDQUFWLEVBQWE7UUFDMUIsT0FBT1IsQ0FBQyxDQUFDTSxNQUFGLENBQVNFLENBQVQsQ0FBUDtNQUNILENBRk8sQ0FBUjtNQUdBLElBQUlRLENBQUMsR0FBR2hCLENBQUMsQ0FBQ3NCLEtBQUYsQ0FBUUMsWUFBUixDQUFxQmYsQ0FBQyxDQUFDZ0IsRUFBdkIsRUFBMkJoQixDQUFDLENBQUNpQixFQUE3QixFQUFpQ1osQ0FBakMsQ0FBUjtNQUNBRyxDQUFDLENBQUM3QixJQUFGLENBQU80QixNQUFQLEdBQWdCZixDQUFDLENBQUN4QixjQUFsQjtNQUNBd0MsQ0FBQyxDQUFDVSxhQUFGLENBQWdCLENBQUMsQ0FBakI7SUFDSCxDQVBEO0lBUUEsS0FBS0MsYUFBTCxDQUFtQixDQUFDLENBQXBCO0lBQ0EsS0FBS3pDLFFBQUw7RUFDSCxDQXZFSTtFQXdFTDBDLFlBQVksRUFBRSx3QkFBWTtJQUN0QixLQUFLbEIsS0FBTCxDQUFXSCxPQUFYLENBQW1CLFVBQVVQLENBQVYsRUFBYTtNQUM1QixJQUFJQSxDQUFKLEVBQU87UUFDSEEsQ0FBQyxDQUFDNkIsVUFBRixDQUFhLENBQUMsQ0FBZDtNQUNIO0lBQ0osQ0FKRDtJQUtBLEtBQUt2QixNQUFMLENBQVlDLE9BQVosQ0FBb0IsVUFBVVAsQ0FBVixFQUFhO01BQzdCLElBQUlBLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUM2QixVQUFGLENBQWEsQ0FBQyxDQUFkOztRQUNBLElBQUk3QixDQUFDLENBQUM4QixJQUFOLEVBQVk7VUFDUjlCLENBQUMsQ0FBQzhCLElBQUYsQ0FBT0MsbUJBQVA7UUFDSDtNQUNKO0lBQ0osQ0FQRDtJQVFBLEtBQUtKLGFBQUwsQ0FBbUIsQ0FBQyxDQUFwQjtFQUNILENBdkZJO0VBd0ZMcEMsWUFBWSxFQUFFLHNCQUFVUyxDQUFWLEVBQWE7SUFDdkIsSUFBSSxLQUFLcEMsRUFBRSxDQUFDd0MsR0FBSCxDQUFPQyxXQUFQLENBQW1CMkIsS0FBNUIsRUFBbUM7TUFDL0IsS0FBS0MsU0FBTCxHQUFpQixDQUFDLENBQWxCO01BQ0EsS0FBS0MsV0FBTCxHQUFtQixJQUFuQjs7TUFDQSxJQUFJLEtBQUtDLFlBQVQsRUFBdUI7UUFDbkIsS0FBS0MsaUJBQUwsQ0FBdUJwQyxDQUF2QjtNQUNILENBRkQsTUFFTztRQUNILElBQUlRLENBQUMsR0FBRyxLQUFLbEMsVUFBTCxDQUFnQitELG9CQUFoQixDQUFxQ3JDLENBQUMsQ0FBQ3NDLFdBQUYsRUFBckMsQ0FBUjtRQUNBLElBQUl6QixDQUFDLEdBQUcwQixJQUFJLENBQUNDLEtBQUwsQ0FBV2hDLENBQUMsQ0FBQ2lDLENBQUYsR0FBTSxHQUFOLEdBQVksR0FBdkIsQ0FBUjtRQUNBLElBQUl6QixDQUFDLEdBQUcsSUFBSXVCLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUNoQyxDQUFDLENBQUNrQyxDQUFILEdBQU8sR0FBUCxHQUFhLEdBQXhCLENBQUosR0FBbUM3QixDQUEzQzs7UUFDQSxJQUFJLENBQUMsQ0FBRCxJQUFNLEtBQUtaLEtBQUwsQ0FBV2UsQ0FBWCxDQUFOLElBQXVCLEtBQUtWLE1BQUwsQ0FBWVUsQ0FBWixDQUF2QixJQUF5QyxLQUFLVixNQUFMLENBQVlVLENBQVosRUFBZWMsSUFBNUQsRUFBa0U7VUFDOUQsS0FBS0ksV0FBTCxHQUFtQixLQUFLNUIsTUFBTCxDQUFZVSxDQUFaLEVBQWVjLElBQWxDO1VBQ0EsS0FBS0ksV0FBTCxDQUFpQlMsZUFBakIsQ0FBaUMzQyxDQUFDLENBQUNzQyxXQUFGLEVBQWpDO1FBQ0g7TUFDSjtJQUNKLENBZEQsTUFjTztNQUNIMUUsRUFBRSxDQUFDZ0YsWUFBSCxDQUFnQkMsY0FBaEI7SUFDSDtFQUNKLENBMUdJO0VBMkdMcEQsWUFBWSxFQUFFLHNCQUFVTyxDQUFWLEVBQWE7SUFDdkIsSUFBSSxLQUFLaUMsU0FBVCxFQUFvQjtNQUNoQixLQUFLYSxpQkFBTCxDQUF1QjlDLENBQUMsQ0FBQytDLFFBQUYsRUFBdkI7SUFDSCxDQUZELE1BRU87TUFDSCxJQUFJLEtBQUtiLFdBQVQsRUFBc0I7UUFDbEIsS0FBS0EsV0FBTCxDQUFpQnpDLFlBQWpCLENBQThCTyxDQUE5QjtNQUNIO0lBQ0o7RUFDSixDQW5ISTtFQW9ITEwsWUFBWSxFQUFFLHNCQUFVSyxDQUFWLEVBQWE7SUFDdkIsSUFBSSxLQUFLaUMsU0FBVCxFQUFvQjtNQUNoQixLQUFLZSxpQkFBTDtJQUNILENBRkQsTUFFTztNQUNILElBQUksS0FBS2QsV0FBVCxFQUFzQjtRQUNsQixLQUFLQSxXQUFMLENBQWlCdkMsWUFBakIsQ0FBOEJLLENBQTlCO1FBQ0EsS0FBS2tDLFdBQUwsR0FBbUIsSUFBbkI7TUFDSDtJQUNKO0VBQ0osQ0E3SEk7RUE4SExFLGlCQUFpQixFQUFFLDJCQUFVcEMsQ0FBVixFQUFhO0lBQzVCLElBQUlRLENBQUMsR0FBRyxJQUFSO0lBQ0EsSUFBSUssQ0FBQyxHQUFHLEtBQUt2QyxVQUFMLENBQWdCK0Qsb0JBQWhCLENBQXFDckMsQ0FBQyxDQUFDc0MsV0FBRixFQUFyQyxDQUFSO0lBQ0EsSUFBSXRCLENBQUMsR0FBR3VCLElBQUksQ0FBQ0MsS0FBTCxDQUFXM0IsQ0FBQyxDQUFDNEIsQ0FBRixHQUFNLEdBQU4sR0FBWSxHQUF2QixDQUFSO0lBQ0EsSUFBSVEsQ0FBQyxHQUFHLElBQUlWLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUMzQixDQUFDLENBQUM2QixDQUFILEdBQU8sR0FBUCxHQUFhLEdBQXhCLENBQUosR0FBbUMxQixDQUEzQzs7SUFDQSxJQUFJLENBQUMsQ0FBRCxJQUFNLEtBQUtmLEtBQUwsQ0FBV2dELENBQVgsQ0FBVixFQUF5QjtNQUNyQixLQUFLaEIsU0FBTCxHQUFpQixDQUFDLENBQWxCO01BQ0EsS0FBS2lCLGNBQUwsR0FBc0J0RixFQUFFLENBQUN1RixJQUFILENBQVFDLElBQTlCO01BQ0EsS0FBSzFDLEtBQUwsQ0FBV0gsT0FBWCxDQUFtQixVQUFVUCxDQUFWLEVBQWE7UUFDNUIsSUFBSUEsQ0FBSixFQUFPO1VBQ0hBLENBQUMsQ0FBQ2IsSUFBRixDQUFPa0UsTUFBUCxHQUFnQixDQUFDLENBQWpCO1FBQ0g7TUFDSixDQUpEO0lBS0gsQ0FSRCxNQVFPO01BQ0gsS0FBS25DLFFBQUwsQ0FBY1gsT0FBZCxDQUFzQixVQUFVTSxDQUFWLEVBQWE7UUFDL0IsSUFDSUEsQ0FBQyxDQUFDeUMsUUFBRixDQUFXQyxJQUFYLENBQWdCLFVBQVV2RCxDQUFWLEVBQWE7VUFDekIsT0FBT0EsQ0FBQyxDQUFDYSxDQUFGLElBQU9vQyxDQUFkO1FBQ0gsQ0FGRCxDQURKLEVBSUU7VUFDRXpDLENBQUMsQ0FBQzBCLFdBQUYsR0FBZ0JyQixDQUFoQjtVQUNBTCxDQUFDLENBQUMwQixXQUFGLENBQWNTLGVBQWQsQ0FBOEIzQyxDQUFDLENBQUNzQyxXQUFGLEVBQTlCO1FBQ0g7TUFDSixDQVREO0lBVUg7RUFDSixDQXZKSTtFQXdKTFEsaUJBQWlCLEVBQUUsMkJBQVU5QyxDQUFWLEVBQWE7SUFDNUIsSUFBSVEsQ0FBQyxHQUFHLElBQVI7SUFDQSxLQUFLbEMsVUFBTCxDQUFnQmtGLFFBQWhCLEdBQTJCLEtBQUtsRixVQUFMLENBQWdCa0YsUUFBaEIsQ0FBeUJDLEdBQXpCLENBQTZCekQsQ0FBN0IsQ0FBM0I7SUFDQSxLQUFLekIsZ0JBQUwsQ0FBc0JpRixRQUF0QixHQUFpQyxLQUFLaEYsY0FBTCxDQUFvQmdGLFFBQXBCLENBQTZCQyxHQUE3QixDQUFpQ3pELENBQWpDLENBQWpDO0lBQ0EsS0FBS3hCLGNBQUwsQ0FBb0JnRixRQUFwQixHQUErQixLQUFLaEYsY0FBTCxDQUFvQmdGLFFBQXBCLENBQTZCQyxHQUE3QixDQUFpQ3pELENBQWpDLENBQS9CO0lBQ0EsS0FBS2tELGNBQUwsQ0FBb0JRLE9BQXBCLENBQTRCMUQsQ0FBNUI7SUFDQSxLQUFLVSxLQUFMLENBQVdILE9BQVgsQ0FBbUIsVUFBVVAsQ0FBVixFQUFhO01BQzVCLElBQUlBLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUM2QixVQUFGLENBQWEsQ0FBQyxDQUFkO01BQ0g7SUFDSixDQUpEO0lBS0EsSUFBSWhCLENBQUMsR0FBRyxFQUFSO0lBQ0EsSUFBSUcsQ0FBQyxHQUFHLEtBQUsyQyxjQUFMLENBQW9COUMsQ0FBcEIsQ0FBUjtJQUNBQSxDQUFDLENBQUNOLE9BQUYsQ0FBVSxVQUFVUCxDQUFWLEVBQWE7TUFDbkIsSUFBSVEsQ0FBQyxDQUFDRSxLQUFGLENBQVFWLENBQVIsQ0FBSixFQUFnQjtRQUNaUSxDQUFDLENBQUNFLEtBQUYsQ0FBUVYsQ0FBUixFQUFXNkIsVUFBWCxDQUFzQmIsQ0FBQyxHQUFHLENBQUgsR0FBTyxDQUE5QjtNQUNIO0lBQ0osQ0FKRDtFQUtILENBMUtJO0VBMktMZ0MsaUJBQWlCLEVBQUUsNkJBQVk7SUFDM0IsSUFBSWhELENBQUMsR0FBRyxJQUFSO0lBQ0EsSUFBSVEsQ0FBQyxHQUFHLEVBQVI7SUFDQSxJQUFJSyxDQUFDLEdBQUcsS0FBSzhDLGNBQUwsQ0FBb0JuRCxDQUFwQixDQUFSO0lBQ0FBLENBQUMsQ0FBQ0QsT0FBRixDQUFVLFVBQVVDLENBQVYsRUFBYTtNQUNuQlIsQ0FBQyxDQUFDVSxLQUFGLENBQVFGLENBQVIsRUFBV3FCLFVBQVgsQ0FBc0IsQ0FBQyxDQUF2QjtJQUNILENBRkQ7O0lBR0EsSUFBSWhCLENBQUosRUFBTztNQUNILElBQUlHLENBQUMsR0FBR3VCLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtVLGNBQUwsQ0FBb0JULENBQXBCLEdBQXdCLEdBQXhCLEdBQThCLEdBQXpDLENBQVI7TUFDQSxJQUFJUSxDQUFDLEdBQUdWLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUMsS0FBS1UsY0FBTCxDQUFvQlIsQ0FBckIsR0FBeUIsR0FBekIsR0FBK0IsR0FBMUMsQ0FBUjtNQUNBLElBQUlrQixDQUFDLEdBQUdoRyxFQUFFLENBQUNpRyxFQUFILENBQU0sTUFBTTdDLENBQVosRUFBZSxNQUFNLENBQUNpQyxDQUF0QixDQUFSO01BQ0EsSUFBSWEsQ0FBQyxHQUFHLElBQUliLENBQUosR0FBUWpDLENBQWhCO01BQ0EsS0FBS2YsS0FBTCxDQUFXRSxJQUFYLENBQWdCLENBQUMsQ0FBakI7TUFDQSxLQUFLRyxNQUFMLENBQVlILElBQVosQ0FBaUIsSUFBakI7TUFDQUssQ0FBQyxDQUFDRCxPQUFGLENBQVUsVUFBVUMsQ0FBVixFQUFhO1FBQ25CUixDQUFDLENBQUNDLEtBQUYsQ0FBUU8sQ0FBUixJQUFhLENBQWI7TUFDSCxDQUZEO01BR0EsSUFBSXVELENBQUMsR0FBRyxLQUFLekYsVUFBTCxDQUFnQnFDLFFBQWhCLENBQXlCQyxHQUF6QixDQUE2QixVQUFVWixDQUFWLEVBQWE7UUFDOUMsT0FBT0EsQ0FBUDtNQUNILENBRk8sQ0FBUjtNQUdBK0QsQ0FBQyxDQUFDQyxJQUFGLENBQU8sVUFBVWhFLENBQVYsRUFBYVEsQ0FBYixFQUFnQjtRQUNuQixPQUFPUixDQUFDLENBQUNhLENBQUYsR0FBTUwsQ0FBQyxDQUFDSyxDQUFmO01BQ0gsQ0FGRDtNQUdBa0QsQ0FBQyxDQUFDeEQsT0FBRixDQUFVLFVBQVVDLENBQVYsRUFBYTtRQUNuQkEsQ0FBQyxDQUFDZ0QsUUFBRixHQUFhaEQsQ0FBQyxDQUFDZ0QsUUFBRixDQUFXQyxHQUFYLENBQWVHLENBQWYsQ0FBYjtRQUNBLElBQUkvQyxDQUFDLEdBQUdMLENBQUMsQ0FBQ3ZCLFlBQUYsQ0FBZSxPQUFmLENBQVI7UUFDQTRCLENBQUMsQ0FBQ0EsQ0FBRixJQUFPaUQsQ0FBUDtRQUNBOUQsQ0FBQyxDQUFDTSxNQUFGLENBQVNPLENBQUMsQ0FBQ0EsQ0FBWCxJQUFnQkEsQ0FBaEI7TUFDSCxDQUxEO01BTUEsS0FBS3RDLGdCQUFMLENBQXNCb0MsUUFBdEIsQ0FBK0JKLE9BQS9CLENBQXVDLFVBQVVQLENBQVYsRUFBYTtRQUNoREEsQ0FBQyxDQUFDd0QsUUFBRixHQUFheEQsQ0FBQyxDQUFDd0QsUUFBRixDQUFXQyxHQUFYLENBQWVHLENBQWYsQ0FBYjtNQUNILENBRkQ7TUFHQSxLQUFLcEYsY0FBTCxDQUFvQm1DLFFBQXBCLENBQTZCSixPQUE3QixDQUFxQyxVQUFVUCxDQUFWLEVBQWE7UUFDOUNBLENBQUMsQ0FBQ3dELFFBQUYsR0FBYXhELENBQUMsQ0FBQ3dELFFBQUYsQ0FBV0MsR0FBWCxDQUFlRyxDQUFmLENBQWI7TUFDSCxDQUZEO0lBR0g7O0lBQ0QsS0FBSzNCLFNBQUwsR0FBaUIsQ0FBQyxDQUFsQjtJQUNBLEtBQUszRCxVQUFMLENBQWdCa0YsUUFBaEIsR0FBMkI1RixFQUFFLENBQUN1RixJQUFILENBQVFDLElBQW5DO0lBQ0EsS0FBSzdFLGdCQUFMLENBQXNCaUYsUUFBdEIsR0FBaUM1RixFQUFFLENBQUN1RixJQUFILENBQVFDLElBQXpDO0lBQ0EsS0FBSzVFLGNBQUwsQ0FBb0JnRixRQUFwQixHQUErQjVGLEVBQUUsQ0FBQ3VGLElBQUgsQ0FBUUMsSUFBdkM7SUFDQSxLQUFLMUMsS0FBTCxDQUFXSCxPQUFYLENBQW1CLFVBQVVDLENBQVYsRUFBYUssQ0FBYixFQUFnQjtNQUMvQixJQUFJTCxDQUFKLEVBQU87UUFDSEEsQ0FBQyxDQUFDckIsSUFBRixDQUFPa0UsTUFBUCxHQUFnQixDQUFDLENBQUQsSUFBTXJELENBQUMsQ0FBQ0MsS0FBRixDQUFRWSxDQUFSLENBQXRCO01BQ0g7SUFDSixDQUpEO0VBS0gsQ0F4Tkk7RUF5TkxvRCxpQkFBaUIsRUFBRSw2QkFBWTtJQUMzQixLQUFLaEMsU0FBTCxHQUFpQixDQUFDLENBQWxCO0lBQ0EsS0FBS0MsV0FBTCxHQUFtQixJQUFuQjtFQUNILENBNU5JO0VBNk5MZ0MsaUJBQWlCLEVBQUUsMkJBQVVsRSxDQUFWLEVBQWE7SUFDNUIsSUFBSSxLQUFLaUMsU0FBVCxFQUFvQixDQUNoQjtJQUNILENBRkQsTUFFTztNQUNILElBQUksS0FBS0MsV0FBVCxFQUFzQjtRQUNsQixLQUFLQSxXQUFMLENBQWlCekMsWUFBakIsQ0FBOEJPLENBQTlCO01BQ0g7SUFDSjtFQUNKLENBck9JO0VBc09MbUUsaUJBQWlCLEVBQUUsMkJBQVVuRSxDQUFWLEVBQWE7SUFDNUIsSUFBSSxLQUFLaUMsU0FBVCxFQUFvQixDQUNoQjtJQUNILENBRkQsTUFFTztNQUNILElBQUksS0FBS0MsV0FBVCxFQUFzQjtRQUNsQixLQUFLQSxXQUFMLENBQWlCdkMsWUFBakIsQ0FBOEJLLENBQTlCO1FBQ0EsS0FBS2tDLFdBQUwsR0FBbUIsSUFBbkI7TUFDSDtJQUNKO0VBQ0osQ0EvT0k7RUFnUExrQyxlQUFlLEVBQUUseUJBQVVwRSxDQUFWLEVBQWE7SUFDMUIsSUFBSVEsQ0FBQyxHQUFHLElBQVI7O0lBQ0EsSUFBSUssQ0FBQyxHQUFHLGFBQVk7TUFDaEIsSUFBSUEsQ0FBQyxHQUFHRyxDQUFDLEdBQUcsQ0FBWjtNQUNBLElBQUlpQyxDQUFDLEdBQUcsQ0FBQ2pDLENBQUMsR0FBR0gsQ0FBTCxJQUFVLENBQWxCO01BQ0EsSUFBSStDLENBQUMsR0FBRzVELENBQUMsQ0FBQ3FFLEdBQUYsQ0FBTXpELEdBQU4sQ0FBVSxVQUFVWixDQUFWLEVBQWE7UUFDM0IsT0FBTztVQUNIeUMsQ0FBQyxFQUFFRixJQUFJLENBQUNDLEtBQUwsQ0FBVzNCLENBQUMsR0FBR2IsQ0FBQyxDQUFDeUMsQ0FBakIsQ0FEQTtVQUVIQyxDQUFDLEVBQUVILElBQUksQ0FBQ0MsS0FBTCxDQUFXUyxDQUFDLEdBQUdqRCxDQUFDLENBQUMwQyxDQUFqQjtRQUZBLENBQVA7TUFJSCxDQUxPLENBQVI7TUFNQSxJQUFJb0IsQ0FBQyxHQUFHLEVBQVI7TUFDQSxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxDQUFUO01BQ0FILENBQUMsQ0FBQ3JELE9BQUYsQ0FBVSxVQUFVUCxDQUFWLEVBQWE7UUFDbkIsSUFBSWEsQ0FBQyxHQUFHYixDQUFDLENBQUN5QyxDQUFWO1FBQ0EsSUFBSXpCLENBQUMsR0FBR2hCLENBQUMsQ0FBQzBDLENBQVY7O1FBQ0EsSUFBSSxFQUFFN0IsQ0FBQyxHQUFHLENBQUosSUFBU0csQ0FBQyxHQUFHLENBQWIsSUFBa0JILENBQUMsR0FBRyxDQUF0QixJQUEyQkcsQ0FBQyxHQUFHLENBQWpDLENBQUosRUFBeUM7VUFDckMsSUFBSWlDLENBQUMsR0FBRyxJQUFJakMsQ0FBSixHQUFRSCxDQUFoQjs7VUFDQSxJQUFJTCxDQUFDLENBQUNGLE1BQUYsQ0FBUzJDLENBQVQsQ0FBSixFQUFpQjtZQUNiLE9BQU8sTUFBTWMsQ0FBQyxHQUFHLENBQUMsQ0FBWCxDQUFQO1VBQ0gsQ0FGRCxNQUVPO1lBQ0gsT0FBT0QsQ0FBQyxDQUFDaEQsSUFBRixDQUFPbUMsQ0FBUCxHQUFXLENBQUMsQ0FBRCxJQUFNekMsQ0FBQyxDQUFDUCxLQUFGLENBQVFnRCxDQUFSLENBQXhCO1VBQ0g7UUFDSjs7UUFDRGMsQ0FBQyxHQUFHLENBQUMsQ0FBTDtNQUNILENBWkQ7O01BYUEsSUFDSUEsQ0FBQyxJQUNELENBQUNILENBQUMsQ0FBQ1UsS0FBRixDQUFRLFVBQVV0RSxDQUFWLEVBQWE7UUFDbEIsT0FBT1EsQ0FBQyxDQUFDK0QsYUFBRixDQUFnQixJQUFJdkUsQ0FBQyxDQUFDMEMsQ0FBTixHQUFVMUMsQ0FBQyxDQUFDeUMsQ0FBNUIsQ0FBUDtNQUNILENBRkEsQ0FGTCxFQUtFO1FBQ0UsT0FBTztVQUNIK0IsQ0FBQyxFQUFFVixDQUFDLENBQUMsQ0FBRDtRQURELENBQVA7TUFHSDtJQUNKLENBbENEOztJQW1DQSxLQUFLLElBQUk5QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO01BQ3pCLElBQUlpQyxDQUFDLEdBQUdwQyxDQUFDLEVBQVQ7O01BQ0EsSUFBSSxZQUFZLE9BQU9vQyxDQUF2QixFQUEwQjtRQUN0QixPQUFPQSxDQUFDLENBQUN1QixDQUFUO01BQ0g7SUFDSjs7SUFDRCxPQUFPLENBQUMsQ0FBUjtFQUNILENBNVJJO0VBNlJMQyxnQkFBZ0IsRUFBRSwwQkFBVXpFLENBQVYsRUFBYTtJQUMzQixJQUFJUSxDQUFDLEdBQUcsSUFBUjs7SUFDQSxJQUFJLEtBQUtSLENBQUMsQ0FBQ3lCLEVBQVgsRUFBZTtNQUNYLE9BQU8sS0FBSzJDLGVBQUwsQ0FBcUJwRSxDQUFyQixDQUFQO0lBQ0g7O0lBQ0QsSUFBSWEsQ0FBQyxHQUFHLGFBQVk7TUFDaEIsSUFBSUEsQ0FBQyxHQUFHRyxDQUFDLEdBQUcsQ0FBWjtNQUNBLElBQUlpQyxDQUFDLEdBQUcsQ0FBQ2pDLENBQUMsR0FBR0gsQ0FBTCxJQUFVLENBQWxCO01BQ0EsSUFBSStDLENBQUMsR0FBRyxFQUFSO01BQ0EsSUFBSUUsQ0FBQyxHQUFHLENBQUMsQ0FBVDtNQUNBOUQsQ0FBQyxDQUFDcUUsR0FBRixDQUFNOUQsT0FBTixDQUFjLFVBQVVQLENBQVYsRUFBYTtRQUN2QixJQUFJZ0IsQ0FBQyxHQUFHdUIsSUFBSSxDQUFDQyxLQUFMLENBQVczQixDQUFDLEdBQUdiLENBQUMsQ0FBQ3lDLENBQWpCLENBQVI7UUFDQSxJQUFJc0IsQ0FBQyxHQUFHeEIsSUFBSSxDQUFDQyxLQUFMLENBQVdTLENBQUMsR0FBR2pELENBQUMsQ0FBQzBDLENBQWpCLENBQVI7O1FBQ0EsSUFBSSxFQUFFMUIsQ0FBQyxHQUFHLENBQUosSUFBUytDLENBQUMsR0FBRyxDQUFiLElBQWtCL0MsQ0FBQyxHQUFHLENBQXRCLElBQTJCK0MsQ0FBQyxHQUFHLENBQWpDLENBQUosRUFBeUM7VUFDckMsSUFBSVcsQ0FBQyxHQUFHLElBQUlYLENBQUosR0FBUS9DLENBQWhCOztVQUNBLElBQUlSLENBQUMsQ0FBQ0YsTUFBRixDQUFTb0UsQ0FBVCxDQUFKLEVBQWlCO1lBQ2IsSUFBSWxFLENBQUMsQ0FBQ0YsTUFBRixDQUFTb0UsQ0FBVCxFQUFZNUMsSUFBaEIsRUFBc0I7Y0FDbEIsT0FBTyxNQUFNZ0MsQ0FBQyxHQUFHLENBQUMsQ0FBWCxDQUFQO1lBQ0gsQ0FGRCxNQUVPO2NBQ0gsT0FBT0YsQ0FBQyxDQUFDOUMsSUFBRixDQUFPNEQsQ0FBUCxHQUFXLEtBQUtsRSxDQUFDLENBQUNQLEtBQUYsQ0FBUXlFLENBQVIsQ0FBdkI7WUFDSDtVQUNKLENBTkQsTUFNTztZQUNILE9BQU8sTUFBTVosQ0FBQyxHQUFHLENBQUMsQ0FBWCxDQUFQO1VBQ0g7UUFDSjs7UUFDREEsQ0FBQyxHQUFHLENBQUMsQ0FBTDtNQUNILENBaEJEOztNQWlCQSxJQUFJQSxDQUFKLEVBQU87UUFDSCxPQUFPO1VBQ0hVLENBQUMsRUFBRVosQ0FBQyxDQUFDLENBQUQ7UUFERCxDQUFQO01BR0g7SUFDSixDQTNCRDs7SUE0QkEsS0FBSyxJQUFJNUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtNQUN6QixJQUFJaUMsQ0FBQyxHQUFHcEMsQ0FBQyxFQUFUOztNQUNBLElBQUksWUFBWSxPQUFPb0MsQ0FBdkIsRUFBMEI7UUFDdEIsT0FBT0EsQ0FBQyxDQUFDdUIsQ0FBVDtNQUNIO0lBQ0o7O0lBQ0QsT0FBTyxDQUFDLENBQVI7RUFDSCxDQXJVSTtFQXNVTEcsUUFBUSxFQUFFLGtCQUFVM0UsQ0FBVixFQUFhUSxDQUFiLEVBQWdCSyxDQUFoQixFQUFtQjtJQUN6QixJQUFJRyxDQUFDLEdBQUcsSUFBUjs7SUFDQSxJQUFJLEtBQUssQ0FBTCxLQUFXSCxDQUFmLEVBQWtCO01BQ2RBLENBQUMsR0FBRyxJQUFKO0lBQ0g7O0lBQ0QsSUFBSW9DLENBQUMsR0FBRyxFQUFSO0lBQ0EsS0FBSzNDLE1BQUwsQ0FBWUMsT0FBWixDQUFvQixVQUFVUCxDQUFWLEVBQWE7TUFDN0IsSUFBSUEsQ0FBSixFQUFPO1FBQ0hBLENBQUMsQ0FBQzZCLFVBQUYsQ0FBYSxDQUFDLENBQWQ7O1FBQ0EsSUFBSTdCLENBQUMsQ0FBQzhCLElBQU4sRUFBWTtVQUNSOUIsQ0FBQyxDQUFDOEIsSUFBRixDQUFPQyxtQkFBUDtRQUNIO01BQ0o7SUFDSixDQVBEO0lBUUEsSUFBSTZCLENBQUMsR0FBRyxLQUFLdEYsVUFBTCxDQUFnQitELG9CQUFoQixDQUFxQzdCLENBQXJDLENBQVI7SUFDQSxJQUFJc0QsQ0FBQyxHQUFHRixDQUFDLENBQUNuQixDQUFGLEdBQU0sR0FBTixHQUFZLEdBQXBCO0lBQ0EsSUFBSXNCLENBQUMsR0FBRyxDQUFDSCxDQUFDLENBQUNsQixDQUFILEdBQU8sR0FBUCxHQUFhLEdBQXJCO0lBQ0EsSUFBSWdDLENBQUMsR0FBRyxDQUFDLENBQVQ7SUFDQTFFLENBQUMsQ0FBQ3FFLEdBQUYsQ0FBTTlELE9BQU4sQ0FBYyxVQUFVUCxDQUFWLEVBQWE7TUFDdkIsSUFBSVEsQ0FBQyxHQUFHK0IsSUFBSSxDQUFDQyxLQUFMLENBQVdzQixDQUFDLEdBQUc5RCxDQUFDLENBQUN5QyxDQUFqQixDQUFSO01BQ0EsSUFBSTVCLENBQUMsR0FBRzBCLElBQUksQ0FBQ0MsS0FBTCxDQUFXdUIsQ0FBQyxHQUFHL0QsQ0FBQyxDQUFDMEMsQ0FBakIsQ0FBUjs7TUFDQSxJQUFJLEVBQUVsQyxDQUFDLEdBQUcsQ0FBSixJQUFTSyxDQUFDLEdBQUcsQ0FBYixJQUFrQkwsQ0FBQyxHQUFHLENBQXRCLElBQTJCSyxDQUFDLEdBQUcsQ0FBakMsQ0FBSixFQUF5QztRQUNyQyxJQUFJK0MsQ0FBQyxHQUFHLElBQUkvQyxDQUFKLEdBQVFMLENBQWhCOztRQUNBLElBQUlRLENBQUMsQ0FBQ1YsTUFBRixDQUFTc0QsQ0FBVCxDQUFKLEVBQWlCO1VBQ2IsT0FBT1gsQ0FBQyxDQUFDbkMsSUFBRixDQUFPOEMsQ0FBUCxHQUFXLEtBQUs1QyxDQUFDLENBQUNmLEtBQUYsQ0FBUTJELENBQVIsQ0FBdkI7UUFDSCxDQUZELE1BRU87VUFDSCxPQUFPLE1BQU1jLENBQUMsR0FBRyxDQUFDLENBQVgsQ0FBUDtRQUNIO01BQ0o7O01BQ0RBLENBQUMsR0FBRyxDQUFDLENBQUw7SUFDSCxDQVpEO0lBYUF6QixDQUFDLENBQUMxQyxPQUFGLENBQVUsVUFBVVAsQ0FBVixFQUFhO01BQ25CLElBQUlhLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUNDLElBQUYsQ0FBT0UsQ0FBQyxDQUFDVixNQUFGLENBQVNOLENBQVQsQ0FBUDtNQUNIOztNQUNEZ0IsQ0FBQyxDQUFDVixNQUFGLENBQVNOLENBQVQsRUFBWTZCLFVBQVosQ0FBdUI2QyxDQUFDLEdBQUcsQ0FBSCxHQUFPLENBQS9CO0lBQ0gsQ0FMRDs7SUFNQSxJQUFJLEtBQUsxRSxDQUFDLENBQUN5QixFQUFYLEVBQWU7TUFDWCxJQUFJbUQsQ0FBQyxHQUFHckMsSUFBSSxDQUFDQyxLQUFMLENBQVdzQixDQUFDLEdBQUc5RCxDQUFDLENBQUNxRSxHQUFGLENBQU0sQ0FBTixFQUFTNUIsQ0FBeEIsQ0FBUjtNQUNBLElBQUlvQyxDQUFDLEdBQUd0QyxJQUFJLENBQUNDLEtBQUwsQ0FBV3VCLENBQUMsR0FBRy9ELENBQUMsQ0FBQ3FFLEdBQUYsQ0FBTSxDQUFOLEVBQVMzQixDQUF4QixDQUFSO01BQ0EsS0FBS29DLGFBQUwsQ0FBbUI5RSxDQUFDLENBQUN5QixFQUFyQixFQUF5QixJQUFJb0QsQ0FBSixHQUFRRCxDQUFqQyxFQUFvQyxVQUFVcEUsQ0FBVixFQUFhO1FBQzdDQSxDQUFDLENBQUN1RSxtQkFBRixDQUFzQi9FLENBQUMsQ0FBQ3lCLEVBQXhCO01BQ0gsQ0FGRDtJQUdIOztJQUNELE9BQU9pRCxDQUFQO0VBQ0gsQ0FuWEk7RUFvWExNLFNBQVMsRUFBRSxtQkFBVWhGLENBQVYsRUFBYVEsQ0FBYixFQUFnQkssQ0FBaEIsRUFBbUI7SUFDMUIsSUFBSUcsQ0FBQyxHQUFHLElBQVI7O0lBQ0EsSUFBSSxLQUFLLENBQUwsS0FBV0gsQ0FBZixFQUFrQjtNQUNkQSxDQUFDLEdBQUcsSUFBSjtJQUNIOztJQUNELElBQUlvQyxDQUFDLEdBQUcsS0FBSzVFLFlBQUwsQ0FBa0JnRSxvQkFBbEIsQ0FBdUM3QixDQUF2QyxDQUFSO0lBQ0EsSUFBSW9ELENBQUMsR0FBR1gsQ0FBQyxDQUFDUixDQUFGLEdBQU0sR0FBTixHQUFZLEdBQXBCO0lBQ0EsSUFBSXFCLENBQUMsR0FBRyxDQUFDYixDQUFDLENBQUNQLENBQUgsR0FBTyxHQUFQLEdBQWEsR0FBckI7SUFDQSxJQUFJcUIsQ0FBQyxHQUFHLEVBQVI7SUFDQSxJQUFJVyxDQUFDLEdBQUcsQ0FBQyxDQUFUO0lBQ0ExRSxDQUFDLENBQUNxRSxHQUFGLENBQU05RCxPQUFOLENBQWMsVUFBVVAsQ0FBVixFQUFhO01BQ3ZCLElBQUlRLENBQUMsR0FBRytCLElBQUksQ0FBQ0MsS0FBTCxDQUFXb0IsQ0FBQyxHQUFHNUQsQ0FBQyxDQUFDeUMsQ0FBakIsQ0FBUjtNQUNBLElBQUk1QixDQUFDLEdBQUcwQixJQUFJLENBQUNDLEtBQUwsQ0FBV3NCLENBQUMsR0FBRzlELENBQUMsQ0FBQzBDLENBQWpCLENBQVI7O01BQ0EsSUFBSSxFQUFFbEMsQ0FBQyxHQUFHLENBQUosSUFBU0ssQ0FBQyxHQUFHLENBQWIsSUFBa0JMLENBQUMsR0FBRyxDQUF0QixJQUEyQkssQ0FBQyxHQUFHLENBQWpDLENBQUosRUFBeUM7UUFDckMsSUFBSW9DLENBQUMsR0FBRyxJQUFJcEMsQ0FBSixHQUFRTCxDQUFoQjs7UUFDQSxJQUFJUSxDQUFDLENBQUNOLEtBQUYsQ0FBUXVDLENBQVIsQ0FBSixFQUFnQjtVQUNaLElBQUlqQyxDQUFDLENBQUNWLE1BQUYsQ0FBUzJDLENBQVQsQ0FBSixFQUFpQjtZQUNiLE9BQU8sTUFBTXlCLENBQUMsR0FBRyxDQUFDLENBQVgsQ0FBUDtVQUNILENBRkQsTUFFTztZQUNILE9BQU9YLENBQUMsQ0FBQ2pELElBQUYsQ0FBT21DLENBQVAsR0FBVyxDQUFDLENBQUQsSUFBTWpDLENBQUMsQ0FBQ2YsS0FBRixDQUFRZ0QsQ0FBUixDQUF4QjtVQUNIO1FBQ0osQ0FORCxNQU1PO1VBQ0gsT0FBTyxNQUFNeUIsQ0FBQyxHQUFHLENBQUMsQ0FBWCxDQUFQO1FBQ0g7TUFDSjs7TUFDREEsQ0FBQyxHQUFHLENBQUMsQ0FBTDtJQUNILENBaEJEO0lBaUJBLEtBQUtoRSxLQUFMLENBQVdILE9BQVgsQ0FBbUIsVUFBVVAsQ0FBVixFQUFhO01BQzVCLElBQUlBLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUM2QixVQUFGLENBQWEsQ0FBQyxDQUFkO01BQ0g7SUFDSixDQUpEO0lBS0FrQyxDQUFDLENBQUN4RCxPQUFGLENBQVUsVUFBVVAsQ0FBVixFQUFhO01BQ25CLElBQUlhLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUNDLElBQUYsQ0FBT0UsQ0FBQyxDQUFDTixLQUFGLENBQVFWLENBQVIsQ0FBUDtNQUNIOztNQUNEZ0IsQ0FBQyxDQUFDTixLQUFGLENBQVFWLENBQVIsRUFBVzZCLFVBQVgsQ0FBc0I2QyxDQUFDLEdBQUcsQ0FBSCxHQUFPLENBQTlCO0lBQ0gsQ0FMRDtJQU1BLE9BQU9BLENBQVA7RUFDSCxDQTNaSTtFQTRaTGYsY0FBYyxFQUFFLHdCQUFVM0QsQ0FBVixFQUFhO0lBQ3pCLElBQUlRLENBQUMsR0FBRyxJQUFSO0lBQ0EsSUFBSUssQ0FBQyxHQUFHMEIsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS1UsY0FBTCxDQUFvQlQsQ0FBcEIsR0FBd0IsR0FBeEIsR0FBOEIsR0FBekMsQ0FBUjtJQUNBLElBQUl6QixDQUFDLEdBQUd1QixJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDLEtBQUtVLGNBQUwsQ0FBb0JSLENBQXJCLEdBQXlCLEdBQXpCLEdBQStCLEdBQTFDLENBQVI7SUFDQSxJQUFJTyxDQUFDLEdBQUcsQ0FBQyxDQUFUO0lBQ0EsS0FBS2hELEtBQUwsQ0FBV00sT0FBWCxDQUFtQixVQUFVcUQsQ0FBVixFQUFhRSxDQUFiLEVBQWdCO01BQy9CLElBQUksS0FBS0YsQ0FBVCxFQUFZO1FBQ1IsSUFBSUcsQ0FBQyxHQUFHRCxDQUFDLEdBQUcsQ0FBWjtRQUNBLElBQUlZLENBQUMsR0FBR1gsQ0FBQyxHQUFHbEQsQ0FBWjtRQUNBLElBQUkrRCxDQUFDLEdBQUcsQ0FBQ2QsQ0FBQyxHQUFHQyxDQUFMLElBQVUsQ0FBVixHQUFjL0MsQ0FBdEI7O1FBQ0EsSUFBSTBELENBQUMsR0FBRyxDQUFKLElBQVNFLENBQUMsR0FBRyxDQUFiLElBQWtCRixDQUFDLEdBQUcsQ0FBdEIsSUFBMkJFLENBQUMsR0FBRyxDQUFuQyxFQUFzQztVQUNsQzNCLENBQUMsR0FBRyxDQUFDLENBQUw7UUFDSCxDQUZELE1BRU87VUFDSCxJQUFJNEIsQ0FBQyxHQUFHLElBQUlELENBQUosR0FBUUYsQ0FBaEI7O1VBQ0EsSUFBSWxFLENBQUMsQ0FBQ0UsS0FBRixDQUFRbUUsQ0FBUixDQUFKLEVBQWdCO1lBQ1osSUFBSXJFLENBQUMsQ0FBQ3lFLFdBQUYsQ0FBY0osQ0FBZCxDQUFKLEVBQXNCO2NBQ2xCNUIsQ0FBQyxHQUFHLENBQUMsQ0FBTDtZQUNILENBRkQsTUFFTztjQUNIakQsQ0FBQyxDQUFDYyxJQUFGLENBQU8rRCxDQUFQO1lBQ0g7VUFDSixDQU5ELE1BTU87WUFDSDVCLENBQUMsR0FBRyxDQUFDLENBQUw7VUFDSDtRQUNKO01BQ0o7SUFDSixDQXBCRDtJQXFCQSxPQUFPQSxDQUFQO0VBQ0gsQ0F2Ykk7RUF3YkxpQyxLQUFLLEVBQUUsaUJBQVk7SUFDZixLQUFLNUUsTUFBTCxDQUFZQyxPQUFaLENBQW9CLFVBQVVQLENBQVYsRUFBYTtNQUM3QixJQUNJQSxDQUFDLElBQ0RBLENBQUMsQ0FBQzhCLElBREYsSUFFQTlCLENBQUMsQ0FBQzhCLElBQUYsQ0FBT3dCLFFBQVAsQ0FBZ0JnQixLQUFoQixDQUFzQixVQUFVOUQsQ0FBVixFQUFhO1FBQy9CLE9BQU9BLENBQUMsQ0FBQ0ssQ0FBRixJQUFPYixDQUFDLENBQUNhLENBQWhCO01BQ0gsQ0FGRCxDQUhKLEVBTUU7UUFDRWpELEVBQUUsQ0FBQ3VILElBQUgsQ0FBUSxRQUFSO01BQ0g7SUFDSixDQVZEO0lBV0EsS0FBSzNHLGNBQUwsQ0FBb0JtQyxRQUFwQixDQUE2QkosT0FBN0IsQ0FBcUMsVUFBVVAsQ0FBVixFQUFhO01BQzlDLElBQUlRLENBQUMsR0FBR1IsQ0FBQyxDQUFDZixZQUFGLENBQWUsTUFBZixDQUFSOztNQUNBLElBQUl1QixDQUFDLENBQUM4QyxRQUFGLENBQVc4QixNQUFYLElBQXFCNUUsQ0FBQyxDQUFDNkQsR0FBRixDQUFNZSxNQUEvQixFQUF1QztRQUNuQ3hILEVBQUUsQ0FBQ3VILElBQUgsQ0FBUSxRQUFSO01BQ0g7O01BQ0QsSUFDSTNFLENBQUMsQ0FBQzhDLFFBQUYsQ0FBV0MsSUFBWCxDQUFnQixVQUFVdkQsQ0FBVixFQUFhO1FBQ3pCLE9BQU9BLENBQUMsQ0FBQzhCLElBQUYsSUFBVXRCLENBQWpCO01BQ0gsQ0FGRCxDQURKLEVBSUU7UUFDRTVDLEVBQUUsQ0FBQ3VILElBQUgsQ0FBUSxRQUFSO01BQ0g7O01BQ0QsSUFBSXRFLENBQUMsR0FBR2IsQ0FBQyxDQUFDeUMsQ0FBRixHQUFNLEdBQWQ7TUFDQSxJQUFJekIsQ0FBQyxHQUFHaEIsQ0FBQyxDQUFDMEMsQ0FBRixHQUFNLEdBQWQ7TUFDQTJDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQU16RSxDQUFOLEdBQVUsR0FBVixHQUFnQkcsQ0FBaEIsR0FBb0IsR0FBaEM7SUFDSCxDQWZEO0VBZ0JILENBcGRJO0VBcWRMdUUsV0FBVyxFQUFFLHFCQUFVdkYsQ0FBVixFQUFhO0lBQ3RCLElBQUlRLENBQUMsR0FBR1IsQ0FBQyxHQUFHLENBQVo7SUFDQSxJQUFJYSxDQUFDLEdBQUcsQ0FBQ2IsQ0FBQyxHQUFHUSxDQUFMLElBQVUsQ0FBbEI7SUFDQSxPQUFPNUMsRUFBRSxDQUFDaUcsRUFBSCxDQUFNLE1BQU1yRCxDQUFaLEVBQWUsTUFBTSxDQUFDSyxDQUF0QixDQUFQO0VBQ0gsQ0F6ZEk7RUEwZEwyRSxXQUFXLEVBQUUscUJBQVV4RixDQUFWLEVBQWE7SUFDdEIsSUFBSVEsQ0FBQyxHQUFHLEtBQUtwQyxXQUFMLENBQWlCcUgsT0FBakIsQ0FBeUIsS0FBS0YsV0FBTCxDQUFpQnZGLENBQWpCLENBQXpCLEVBQThDZixZQUE5QyxDQUEyRCxPQUEzRCxDQUFSO0lBQ0F1QixDQUFDLENBQUNTLE9BQUYsQ0FBVSxJQUFWO0lBQ0FULENBQUMsQ0FBQ0ssQ0FBRixHQUFNYixDQUFOO0lBQ0EsS0FBS00sTUFBTCxDQUFZTixDQUFaLElBQWlCUSxDQUFqQjtJQUNBLEtBQUtFLEtBQUwsQ0FBV1YsQ0FBWCxFQUFjYixJQUFkLENBQW1Ca0UsTUFBbkIsR0FBNEIsQ0FBQyxDQUE3QjtJQUNBLEtBQUszQyxLQUFMLENBQVdWLENBQVgsRUFBYzhCLElBQWQsR0FBcUIsSUFBckI7RUFDSCxDQWplSTtFQWtlTFgsWUFBWSxFQUFFLHdCQUFZO0lBQ3RCLElBQUluQixDQUFDLEdBQUcsSUFBUjtJQUNBLEtBQUtDLEtBQUwsQ0FBV00sT0FBWCxDQUFtQixVQUFVQyxDQUFWLEVBQWFLLENBQWIsRUFBZ0I7TUFDL0IsSUFBSSxLQUFLTCxDQUFULEVBQVk7UUFDUlIsQ0FBQyxDQUFDd0YsV0FBRixDQUFjM0UsQ0FBZDtNQUNIO0lBQ0osQ0FKRDtFQUtILENBemVJO0VBMGVMYyxhQUFhLEVBQUUsdUJBQVUzQixDQUFWLEVBQWE7SUFDeEIsS0FBSzNCLFlBQUwsQ0FBa0JnRixNQUFsQixHQUEyQnJELENBQTNCO0lBQ0EsS0FBS2hDLEdBQUwsQ0FBU3FGLE1BQVQsR0FBa0IsQ0FBQ3JELENBQW5CO0lBQ0EsS0FBSzlCLEdBQUwsQ0FBU21GLE1BQVQsR0FBa0JyRCxDQUFsQjs7SUFDQSxJQUFJQSxDQUFKLEVBQU87TUFDSCxJQUFJLEtBQUttQyxZQUFULEVBQXVCLENBQ25CO01BQ0gsQ0FGRCxNQUVPO1FBQ0gsS0FBS2pCLFFBQUwsQ0FBY2tFLE1BQWQsR0FBdUIsQ0FBdkI7TUFDSDtJQUNKOztJQUNELEtBQUtqRCxZQUFMLEdBQW9CbkMsQ0FBcEI7RUFDSCxDQXRmSTtFQXVmTDBGLGtCQUFrQixFQUFFLDhCQUFZO0lBQzVCLEtBQUtwRixNQUFMLENBQVlDLE9BQVosQ0FBb0IsVUFBVVAsQ0FBVixFQUFhO01BQzdCLElBQUlBLENBQUosRUFBTztRQUNIQSxDQUFDLENBQUM2QixVQUFGLENBQWEsQ0FBQyxDQUFkOztRQUNBLElBQUk3QixDQUFDLENBQUM4QixJQUFOLEVBQVk7VUFDUjlCLENBQUMsQ0FBQzhCLElBQUYsQ0FBT0MsbUJBQVA7VUFDQS9CLENBQUMsQ0FBQzhCLElBQUYsQ0FBTzZELGVBQVA7UUFDSDtNQUNKO0lBQ0osQ0FSRDtFQVNILENBamdCSTtFQWtnQkxDLGlCQUFpQixFQUFFLDZCQUFZO0lBQzNCLEtBQUtsRixLQUFMLENBQVdILE9BQVgsQ0FBbUIsVUFBVVAsQ0FBVixFQUFhO01BQzVCLElBQUlBLENBQUMsSUFBSUEsQ0FBQyxDQUFDYixJQUFGLENBQU9rRSxNQUFoQixFQUF3QjtRQUNwQnJELENBQUMsQ0FBQzZCLFVBQUYsQ0FBYSxDQUFDLENBQWQ7TUFDSDtJQUNKLENBSkQ7RUFLSCxDQXhnQkk7RUF5Z0JMZ0UsUUFBUSxFQUFFLGtCQUFVN0YsQ0FBVixFQUFhO0lBQ25CLElBQ0ksQ0FBQyxDQUFELElBQ0EsS0FBS2tCLFFBQUwsQ0FBYzRFLFNBQWQsQ0FBd0IsVUFBVXRGLENBQVYsRUFBYTtNQUNqQyxPQUFPQSxDQUFDLElBQUlSLENBQVo7SUFDSCxDQUZELENBRkosRUFLRTtNQUNFLEtBQUtrQixRQUFMLENBQWNKLElBQWQsQ0FBbUJkLENBQW5CO0lBQ0g7RUFDSixDQWxoQkk7RUFtaEJMK0YsWUFBWSxFQUFFLHNCQUFVL0YsQ0FBVixFQUFhO0lBQ3ZCLElBQUlRLENBQUMsR0FBRyxLQUFLVSxRQUFMLENBQWM0RSxTQUFkLENBQXdCLFVBQVV0RixDQUFWLEVBQWE7TUFDekMsT0FBT0EsQ0FBQyxJQUFJUixDQUFaO0lBQ0gsQ0FGTyxDQUFSOztJQUdBLElBQUksQ0FBQyxDQUFELElBQU1RLENBQVYsRUFBYTtNQUNULEtBQUtVLFFBQUwsQ0FBYzhFLE1BQWQsQ0FBcUJ4RixDQUFyQixFQUF3QixDQUF4QjtJQUNIO0VBQ0osQ0ExaEJJO0VBMmhCTHlFLFdBQVcsRUFBRSxxQkFBVWpGLENBQVYsRUFBYTtJQUN0QixPQUFPLEtBQUtrQixRQUFMLENBQWNxQyxJQUFkLENBQW1CLFVBQVUvQyxDQUFWLEVBQWE7TUFDbkMsT0FBT0EsQ0FBQyxDQUFDOEMsUUFBRixDQUFXQyxJQUFYLENBQWdCLFVBQVUvQyxDQUFWLEVBQWE7UUFDaEMsT0FBT0EsQ0FBQyxDQUFDSyxDQUFGLElBQU9iLENBQWQ7TUFDSCxDQUZNLENBQVA7SUFHSCxDQUpNLENBQVA7RUFLSCxDQWppQkk7RUFraUJMdUUsYUFBYSxFQUFFLHVCQUFVdkUsQ0FBVixFQUFhO0lBQ3hCLElBQUlRLENBQUMsR0FBRyxJQUFSO0lBQ0EsSUFBSUssQ0FBQyxHQUFHYixDQUFDLEdBQUcsQ0FBWjtJQUNBLElBQUlnQixDQUFDLEdBQUcsQ0FBQ2hCLENBQUMsR0FBR2EsQ0FBTCxJQUFVLENBQWxCO0lBQ0EsT0FBTyxDQUNIO01BQ0k0QixDQUFDLEVBQUUsQ0FEUDtNQUVJQyxDQUFDLEVBQUUsQ0FBQztJQUZSLENBREcsRUFLSDtNQUNJRCxDQUFDLEVBQUUsQ0FEUDtNQUVJQyxDQUFDLEVBQUU7SUFGUCxDQUxHLEVBU0g7TUFDSUQsQ0FBQyxFQUFFLENBQUMsQ0FEUjtNQUVJQyxDQUFDLEVBQUU7SUFGUCxDQVRHLEVBYUg7TUFDSUQsQ0FBQyxFQUFFLENBRFA7TUFFSUMsQ0FBQyxFQUFFO0lBRlAsQ0FiRyxFQWlCTDRCLEtBakJLLENBaUJDLFVBQVV0RSxDQUFWLEVBQWE7TUFDakIsSUFBSWlELENBQUMsR0FBR2pELENBQUMsQ0FBQ3lDLENBQUYsR0FBTTVCLENBQWQ7TUFDQSxJQUFJK0MsQ0FBQyxHQUFHNUQsQ0FBQyxDQUFDMEMsQ0FBRixHQUFNMUIsQ0FBZDs7TUFDQSxJQUFJaUMsQ0FBQyxHQUFHLENBQUosSUFBU1csQ0FBQyxHQUFHLENBQWIsSUFBa0JYLENBQUMsR0FBRyxDQUF0QixJQUEyQlcsQ0FBQyxHQUFHLENBQW5DLEVBQXNDO1FBQ2xDLE9BQU8sQ0FBQyxDQUFSO01BQ0g7O01BQ0QsSUFBSUUsQ0FBQyxHQUFHLElBQUlGLENBQUosR0FBUVgsQ0FBaEI7TUFDQSxPQUFPLENBQUMsQ0FBRCxJQUFNekMsQ0FBQyxDQUFDUCxLQUFGLENBQVE2RCxDQUFSLENBQWI7SUFDSCxDQXpCTSxDQUFQO0VBMEJILENBaGtCSTtFQWlrQkxtQyxlQUFlLEVBQUUsMkJBQVk7SUFDekIsSUFBSWpHLENBQUMsR0FBRyxJQUFSOztJQUNBLElBQUlRLENBQUMsR0FBRyxXQUFVQSxFQUFWLEVBQWE7TUFDakIsS0FBSyxJQUFJSyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxFQUFDLENBQUM0RSxNQUF0QixFQUE4QnZFLENBQUMsRUFBL0IsRUFBbUM7UUFDL0IsSUFBSUcsQ0FBQyxHQUFHUixFQUFDLENBQUNLLENBQUQsQ0FBVDtRQUNBLElBQUlvQyxDQUFDLEdBQUdqQyxDQUFDLENBQUNzQyxRQUFGLENBQVcxQyxHQUFYLENBQWUsVUFBVVosQ0FBVixFQUFhO1VBQ2hDLE9BQU9BLENBQUMsQ0FBQ2EsQ0FBVDtRQUNILENBRk8sQ0FBUjs7UUFHQSxJQUNJLENBQUNvQyxDQUFDLENBQUNxQixLQUFGLENBQVEsVUFBVTlELENBQVYsRUFBYTtVQUNsQixPQUFPUixDQUFDLENBQUN1RSxhQUFGLENBQWdCL0QsQ0FBaEIsQ0FBUDtRQUNILENBRkEsQ0FETCxFQUlFO1VBQ0V5QyxDQUFDLENBQUMxQyxPQUFGLENBQVUsVUFBVUMsQ0FBVixFQUFhO1lBQ25CLElBQUlSLENBQUMsQ0FBQ00sTUFBRixDQUFTRSxDQUFULENBQUosRUFBaUI7Y0FDYjVDLEVBQUUsQ0FBQ3VILElBQUgsQ0FBUSxLQUFSO1lBQ0g7O1lBQ0RuRixDQUFDLENBQUNDLEtBQUYsQ0FBUU8sQ0FBUixJQUFhLENBQWI7WUFDQVIsQ0FBQyxDQUFDd0YsV0FBRixDQUFjaEYsQ0FBZDtVQUNILENBTkQ7VUFPQVEsQ0FBQyxDQUFDa0YsZUFBRjtVQUNBbEYsQ0FBQyxDQUFDN0IsSUFBRixDQUFPNEIsTUFBUCxHQUFnQixJQUFoQjtVQUNBLE9BQU8sQ0FBQyxDQUFSO1FBQ0g7TUFDSjs7TUFDRCxPQUFPLENBQUMsQ0FBUjtJQUNILENBeEJEOztJQXlCQSxJQUFJRixDQUFDLEdBQUcsRUFBUjs7SUFDQSxHQUFHO01BQ0NBLENBQUMsR0FBRyxLQUFLSyxRQUFMLENBQWNOLEdBQWQsQ0FBa0IsVUFBVVosQ0FBVixFQUFhO1FBQy9CLE9BQU9BLENBQVA7TUFDSCxDQUZHLENBQUo7SUFHSCxDQUpELFFBSVNRLENBQUMsQ0FBQ0ssQ0FBRCxDQUpWOztJQUtBQSxDQUFDLENBQUNOLE9BQUYsQ0FBVSxVQUFVUCxDQUFWLEVBQWE7TUFDbkJBLENBQUMsQ0FBQ2tHLGVBQUY7TUFDQWxHLENBQUMsQ0FBQ2hCLFFBQUYsQ0FBV21ILE9BQVgsQ0FBbUJuRyxDQUFuQixFQUFzQkEsQ0FBQyxDQUFDYixJQUFGLENBQU9pSCxxQkFBUCxDQUE2QnhJLEVBQUUsQ0FBQ3VGLElBQUgsQ0FBUUMsSUFBckMsQ0FBdEI7SUFDSCxDQUhEO0lBSUEsS0FBS3pCLGFBQUwsQ0FBbUIsQ0FBQyxDQUFwQjtJQUNBLEtBQUszQyxRQUFMLENBQWNxSCxVQUFkLENBQXlCLENBQUMsQ0FBMUI7RUFDSCxDQXhtQkk7RUF5bUJMdkIsYUFBYSxFQUFFLHVCQUFVOUUsQ0FBVixFQUFhUSxDQUFiLEVBQWdCSyxDQUFoQixFQUFtQjtJQUM5QixJQUFJRyxDQUFDLEdBQUcsSUFBUjs7SUFDQSxJQUFJLEtBQUtoQixDQUFULEVBQVk7TUFDUixJQUFJaUQsQ0FBQyxHQUFHLElBQUlxRCxHQUFKLEVBQVI7TUFDQSxJQUFJMUMsQ0FBQyxHQUFHcEQsQ0FBQyxHQUFHLENBQVo7TUFDQSxJQUFJc0QsQ0FBQyxHQUFHLENBQUN0RCxDQUFDLEdBQUdvRCxDQUFMLElBQVUsQ0FBbEI7TUFDQSxDQUNJLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQURKLEVBRUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZKLEVBR0ksQ0FBQyxDQUFELEVBQUksQ0FBQyxDQUFMLENBSEosRUFJSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBSkosRUFLRXJELE9BTEYsQ0FLVSxVQUFVUCxDQUFWLEVBQWE7UUFDbkIsSUFBSVEsQ0FBQyxHQUFHb0QsQ0FBQyxHQUFHNUQsQ0FBQyxDQUFDLENBQUQsQ0FBYjtRQUNBLElBQUlhLENBQUMsR0FBR2lELENBQUMsR0FBRzlELENBQUMsQ0FBQyxDQUFELENBQWI7O1FBQ0EsSUFBSSxFQUFFUSxDQUFDLEdBQUcsQ0FBSixJQUFTSyxDQUFDLEdBQUcsQ0FBYixJQUFrQkwsQ0FBQyxHQUFHLENBQXRCLElBQTJCSyxDQUFDLEdBQUcsQ0FBakMsQ0FBSixFQUF5QztVQUNyQyxJQUFJa0QsQ0FBQyxHQUFHLElBQUlsRCxDQUFKLEdBQVFMLENBQWhCOztVQUNBLElBQUlRLENBQUMsQ0FBQ1YsTUFBRixDQUFTeUQsQ0FBVCxLQUFlL0MsQ0FBQyxDQUFDVixNQUFGLENBQVN5RCxDQUFULEVBQVlqQyxJQUEvQixFQUFxQztZQUNqQ21CLENBQUMsQ0FBQ1EsR0FBRixDQUFNekMsQ0FBQyxDQUFDVixNQUFGLENBQVN5RCxDQUFULEVBQVlqQyxJQUFsQjtVQUNIO1FBQ0o7TUFDSixDQWREO01BZUFtQixDQUFDLENBQUMxQyxPQUFGLENBQVUsVUFBVVAsQ0FBVixFQUFhO1FBQ25CYSxDQUFDLENBQUNiLENBQUQsQ0FBRDtNQUNILENBRkQ7SUFHSDtFQUNKLENBbG9CSTtFQW1vQkx1RyxNQUFNLEVBQUUsa0JBQVk7SUFDaEIsT0FBTyxLQUFLakcsTUFBTCxDQUFZZ0UsS0FBWixDQUFrQixVQUFVdEUsQ0FBVixFQUFhO01BQ2xDLE9BQU8sUUFBUUEsQ0FBUixJQUFhLFFBQVFBLENBQUMsQ0FBQzhCLElBQTlCO0lBQ0gsQ0FGTSxDQUFQO0VBR0g7QUF2b0JJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkcHJlZmFiSW5mbyA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL1ByZWZhYkluZm9cIik7XG52YXIgJGJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdWkxOiBjYy5Ob2RlLFxuICAgICAgICB1aTI6IGNjLk5vZGUsXG4gICAgICAgIGl0ZW1Sb290Tm9kZTogY2MuTm9kZSxcbiAgICAgICAgYmxvY2tQcmVmYWI6ICRwcmVmYWJJbmZvLFxuICAgICAgICBleHRlbmRNb2RlQmc6IGNjLk5vZGUsXG4gICAgICAgIGJvYXJkc1Jvb3Q6IGNjLk5vZGUsXG4gICAgICAgIGJvYXJkSXRlbUJnc1Jvb3Q6IGNjLk5vZGUsXG4gICAgICAgIGJvYXJkSXRlbXNSb290OiBjYy5Ob2RlLFxuICAgICAgICBibG9ja1NwZnM6IFtjYy5TcHJpdGVGcmFtZV0sXG4gICAgICAgIHN0YXNoRW5hYmxlOiAhMCxcbiAgICAgICAgc3Rhc2hSb290OiBjYy5Ob2RlLFxuICAgICAgICBzdGFzaEJsb2NrOiAkYmxvY2ssXG4gICAgICAgIHN0YXNoUmVjdE5vZGU6IGNjLk5vZGVcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLml0ZW1Sb290ID0gdGhpcy5pdGVtUm9vdE5vZGUuZ2V0Q29tcG9uZW50KFwiSXRlbVJvb3RcIik7XG4gICAgfSxcbiAgICBvbkV2ZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25DbGlja0JlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbkNsaWNrRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uQ2xpY2tFbmRlZCwgdGhpcyk7XG4gICAgfSxcbiAgICBvZmZFdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vbkNsaWNrQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25DbGlja01vdmVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25DbGlja0VuZGVkLCB0aGlzKTtcbiAgICB9LFxuICAgIHN0YXJ0TG9naWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGFzID0gbmV3IEFycmF5KDM1KS5maWxsKC0xKTtcbiAgICAgICAgY2MucHZ6LnJ1bnRpbWVEYXRhLmJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB0LmRhdGFzW2VdID0gMDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICgxMTMgPT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmFjdEJ1ZmYyKSB7XG4gICAgICAgICAgICBbMCwgMSwgMywgNCwgNSwgOSwgMjUsIDI5LCAzMCwgMzEsIDMzLCAzNF0uZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHQuZGF0YXNbZV0gPSAxO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ibG9ja3MgPSBuZXcgQXJyYXkoMzUpLmZpbGwobnVsbCk7XG4gICAgICAgIHRoaXMucG9zZXMgPSBbXTtcbiAgICAgICAgdGhpcy5leHRlbmRNb2RlQmcuY2hpbGRyZW5cbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZSwgaSkge1xuICAgICAgICAgICAgICAgIGlmICgxID09IHQuZGF0YXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdC5wb3Nlcy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAoZS5wYXJlbnQgPSBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG4gPSBlLmdldENvbXBvbmVudChcIlBvc1wiKTtcbiAgICAgICAgICAgICAgICBuLnNldFJvb3QodCk7XG4gICAgICAgICAgICAgICAgbi5pID0gaTtcbiAgICAgICAgICAgICAgICB0LnBvc2VzLnB1c2gobik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50b1B1dEFyciA9IFtdO1xuICAgICAgICB0aGlzLmNyZWF0ZUJsb2NrcygpO1xuICAgICAgICBjYy5wdnoucnVudGltZURhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGkgPSBlLmJzLm1hcChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0LmJsb2Nrc1tlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIG4gPSB0LnNjZW5lLm5ld0VxdWlwSXRlbShlLmx2LCBlLmlkLCBpKTtcbiAgICAgICAgICAgIG4ubm9kZS5wYXJlbnQgPSB0LmJvYXJkSXRlbXNSb290O1xuICAgICAgICAgICAgbi5zZXRCZ1NwUGFyZW50KCExKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0RXh0ZW5kTW9kZSghMSk7XG4gICAgICAgIHRoaXMub25FdmVudHMoKTtcbiAgICB9LFxuICAgIGJhY2tGcm9tR2FtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvc2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdC5zZXRQcmV2aWV3KC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdC5zZXRQcmV2aWV3KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAodC5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuaXRlbS5oaWRlVW5kZXJCdWZmRWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXRFeHRlbmRNb2RlKCExKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCZWdhbjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKDQgIT0gY2MucHZ6LnJ1bnRpbWVEYXRhLmd1aWRlKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdCb2FyZCA9ICExO1xuICAgICAgICAgICAgdGhpcy5jbGlja2VkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4dGVuZE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQm9hcmRDbGlja0JlZ2FuKHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMuYm9hcmRzUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0LmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihlLnggLyAxMDYgKyAwLjUpO1xuICAgICAgICAgICAgICAgIHZhciBuID0gNSAqIE1hdGguZmxvb3IoLWUueSAvIDEwNiArIDAuNSkgKyBpO1xuICAgICAgICAgICAgICAgIGlmICgtMSAhPSB0aGlzLmRhdGFzW25dICYmIHRoaXMuYmxvY2tzW25dICYmIHRoaXMuYmxvY2tzW25dLml0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja2VkSXRlbSA9IHRoaXMuYmxvY2tzW25dLml0ZW07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tlZEl0ZW0ucGlja3VwRnJvbUJvYXJkKHQuZ2V0TG9jYXRpb24oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MuZ3VpZGVNYW5hZ2VyLm9uU3RlcEZpbmlzaGVkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xpY2tNb3ZlZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ0JvYXJkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQm9hcmRDbGlja01vdmVkKHQuZ2V0RGVsdGEoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGlja2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tlZEl0ZW0ub25DbGlja01vdmVkKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrRW5kZWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdCb2FyZCkge1xuICAgICAgICAgICAgdGhpcy5vbkJvYXJkQ2xpY2tFbmRlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xpY2tlZEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrZWRJdGVtLm9uQ2xpY2tFbmRlZCh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Cb2FyZENsaWNrQmVnYW46IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdmFyIGkgPSB0aGlzLmJvYXJkc1Jvb3QuY29udmVydFRvTm9kZVNwYWNlQVIodC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKGkueCAvIDEwNiArIDAuNSk7XG4gICAgICAgIHZhciBvID0gNSAqIE1hdGguZmxvb3IoLWkueSAvIDEwNiArIDAuNSkgKyBuO1xuICAgICAgICBpZiAoLTEgIT0gdGhpcy5kYXRhc1tvXSkge1xuICAgICAgICAgICAgdGhpcy5kcmFnQm9hcmQgPSAhMDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0JvYXJkTW92ZWQgPSBjYy5WZWMyLlpFUk87XG4gICAgICAgICAgICB0aGlzLnBvc2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICB0Lm5vZGUuYWN0aXZlID0gITA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvUHV0QXJyLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGkubXlCbG9ja3Muc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQuaSA9PSBvO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBlLmNsaWNrZWRJdGVtID0gaTtcbiAgICAgICAgICAgICAgICAgICAgZS5jbGlja2VkSXRlbS5waWNrdXBGcm9tQm9hcmQodC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Cb2FyZENsaWNrTW92ZWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdGhpcy5ib2FyZHNSb290LnBvc2l0aW9uID0gdGhpcy5ib2FyZHNSb290LnBvc2l0aW9uLmFkZCh0KTtcbiAgICAgICAgdGhpcy5ib2FyZEl0ZW1CZ3NSb290LnBvc2l0aW9uID0gdGhpcy5ib2FyZEl0ZW1zUm9vdC5wb3NpdGlvbi5hZGQodCk7XG4gICAgICAgIHRoaXMuYm9hcmRJdGVtc1Jvb3QucG9zaXRpb24gPSB0aGlzLmJvYXJkSXRlbXNSb290LnBvc2l0aW9uLmFkZCh0KTtcbiAgICAgICAgdGhpcy5kcmFnQm9hcmRNb3ZlZC5hZGRTZWxmKHQpO1xuICAgICAgICB0aGlzLnBvc2VzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgdC5zZXRQcmV2aWV3KC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpID0gW107XG4gICAgICAgIHZhciBuID0gdGhpcy5nZXRCbG9ja3NUb1B1dChpKTtcbiAgICAgICAgaS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoZS5wb3Nlc1t0XSkge1xuICAgICAgICAgICAgICAgIGUucG9zZXNbdF0uc2V0UHJldmlldyhuID8gMCA6IDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uQm9hcmRDbGlja0VuZGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgICAgdmFyIGUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmdldEJsb2Nrc1RvUHV0KGUpO1xuICAgICAgICBlLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHQucG9zZXNbZV0uc2V0UHJldmlldygtMSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKHRoaXMuZHJhZ0JvYXJkTW92ZWQueCAvIDEwNiArIDAuNSk7XG4gICAgICAgICAgICB2YXIgbyA9IE1hdGguZmxvb3IoLXRoaXMuZHJhZ0JvYXJkTW92ZWQueSAvIDEwNiArIDAuNSk7XG4gICAgICAgICAgICB2YXIgcyA9IGNjLnYyKDEwNiAqIG4sIDEwNiAqIC1vKTtcbiAgICAgICAgICAgIHZhciBjID0gNSAqIG8gKyBuO1xuICAgICAgICAgICAgdGhpcy5kYXRhcy5maWxsKC0xKTtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzLmZpbGwobnVsbCk7XG4gICAgICAgICAgICBlLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB0LmRhdGFzW2VdID0gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLmJvYXJkc1Jvb3QuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGEuc29ydChmdW5jdGlvbiAodCwgZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0LmkgLSBlLmk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGEuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucG9zaXRpb24gPSBlLnBvc2l0aW9uLmFkZChzKTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGUuZ2V0Q29tcG9uZW50KFwiQmxvY2tcIik7XG4gICAgICAgICAgICAgICAgaS5pICs9IGM7XG4gICAgICAgICAgICAgICAgdC5ibG9ja3NbaS5pXSA9IGk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRJdGVtQmdzUm9vdC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdC5wb3NpdGlvbiA9IHQucG9zaXRpb24uYWRkKHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICB0LnBvc2l0aW9uID0gdC5wb3NpdGlvbi5hZGQocyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYWdCb2FyZCA9ICExO1xuICAgICAgICB0aGlzLmJvYXJkc1Jvb3QucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87XG4gICAgICAgIHRoaXMuYm9hcmRJdGVtQmdzUm9vdC5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgdGhpcy5ib2FyZEl0ZW1zUm9vdC5wb3NpdGlvbiA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgdGhpcy5wb3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGUubm9kZS5hY3RpdmUgPSAtMSA9PSB0LmRhdGFzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uU3Rhc2hDbGlja0JlZ2FuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZHJhZ0JvYXJkID0gITE7XG4gICAgICAgIHRoaXMuY2xpY2tlZEl0ZW0gPSBudWxsO1xuICAgIH0sXG4gICAgb25TdGFzaENsaWNrTW92ZWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdCb2FyZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsaWNrZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja2VkSXRlbS5vbkNsaWNrTW92ZWQodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3Rhc2hDbGlja0VuZGVkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnQm9hcmQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGlja2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tlZEl0ZW0ub25DbGlja0VuZGVkKHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBmaW5kUG9zRm9yQmxvY2s6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdmFyIGkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IG4gJSA1O1xuICAgICAgICAgICAgdmFyIG8gPSAobiAtIGkpIC8gNTtcbiAgICAgICAgICAgIHZhciBzID0gdC54eXMubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihpICsgdC54KSxcbiAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcihvICsgdC55KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjID0gW107XG4gICAgICAgICAgICB2YXIgYSA9ICEwO1xuICAgICAgICAgICAgcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSB0Lng7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSB0Lnk7XG4gICAgICAgICAgICAgICAgaWYgKCEoaSA8IDAgfHwgbiA8IDAgfHwgaSA+IDQgfHwgbiA+IDYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gNSAqIG4gKyBpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5ibG9ja3Nbb10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIChhID0gITEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMucHVzaChvKSwgLTEgPT0gZS5kYXRhc1tvXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhID0gITE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBhICYmXG4gICAgICAgICAgICAgICAgIXMuZXZlcnkoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudGVzdENhbnRQbGFjZSg1ICogdC55ICsgdC54KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdjogY1swXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgMzU7IG4rKykge1xuICAgICAgICAgICAgdmFyIG8gPSBpKCk7XG4gICAgICAgICAgICBpZiAoXCJvYmplY3RcIiA9PSB0eXBlb2Ygbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLnY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH0sXG4gICAgZmluZEJsb2NrRm9ySXRlbTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICBpZiAoMCA9PSB0LmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kUG9zRm9yQmxvY2sodCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IG4gJSA1O1xuICAgICAgICAgICAgdmFyIG8gPSAobiAtIGkpIC8gNTtcbiAgICAgICAgICAgIHZhciBzID0gW107XG4gICAgICAgICAgICB2YXIgYyA9ICEwO1xuICAgICAgICAgICAgdC54eXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHZhciBuID0gTWF0aC5mbG9vcihpICsgdC54KTtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IE1hdGguZmxvb3IobyArIHQueSk7XG4gICAgICAgICAgICAgICAgaWYgKCEobiA8IDAgfHwgYSA8IDAgfHwgbiA+IDQgfHwgYSA+IDYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByID0gNSAqIGEgKyBuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5ibG9ja3Nbcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmJsb2Nrc1tyXS5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgKGMgPSAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzLnB1c2gociksIDAgPT0gZS5kYXRhc1tyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIChjID0gITEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGMgPSAhMTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2OiBzWzBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCAzNTsgbisrKSB7XG4gICAgICAgICAgICB2YXIgbyA9IGkoKTtcbiAgICAgICAgICAgIGlmIChcIm9iamVjdFwiID09IHR5cGVvZiBvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8udjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSxcbiAgICB0ZXN0SXRlbTogZnVuY3Rpb24gKHQsIGUsIGkpIHtcbiAgICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgICBpZiAodm9pZCAwID09PSBpKSB7XG4gICAgICAgICAgICBpID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbyA9IFtdO1xuICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQuc2V0UHJldmlldygtMSk7XG4gICAgICAgICAgICAgICAgaWYgKHQuaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB0Lml0ZW0uaGlkZVVuZGVyQnVmZkVmZmVjdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzID0gdGhpcy5ib2FyZHNSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKGUpO1xuICAgICAgICB2YXIgYyA9IHMueCAvIDEwNiArIDAuNTtcbiAgICAgICAgdmFyIGEgPSAtcy55IC8gMTA2ICsgMC41O1xuICAgICAgICB2YXIgciA9ICEwO1xuICAgICAgICB0Lnh5cy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgZSA9IE1hdGguZmxvb3IoYyArIHQueCk7XG4gICAgICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoYSArIHQueSk7XG4gICAgICAgICAgICBpZiAoIShlIDwgMCB8fCBpIDwgMCB8fCBlID4gNCB8fCBpID4gNikpIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IDUgKiBpICsgZTtcbiAgICAgICAgICAgICAgICBpZiAobi5ibG9ja3Nbc10pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG8ucHVzaChzKSwgMCA9PSBuLmRhdGFzW3NdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIChyID0gITEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHIgPSAhMTtcbiAgICAgICAgfSk7XG4gICAgICAgIG8uZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICBpLnB1c2gobi5ibG9ja3NbdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbi5ibG9ja3NbdF0uc2V0UHJldmlldyhyID8gMCA6IDEpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKDYgPT0gdC5pZCkge1xuICAgICAgICAgICAgdmFyIGggPSBNYXRoLmZsb29yKGMgKyB0Lnh5c1swXS54KTtcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5mbG9vcihhICsgdC54eXNbMF0ueSk7XG4gICAgICAgICAgICB0aGlzLmdldENyb3NzSXRlbXModC5pZCwgNSAqIGQgKyBoLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuc2hvd1VuZGVyQnVmZkVmZmVjdCh0LmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG4gICAgdGVzdEJsb2NrOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IGkpIHtcbiAgICAgICAgICAgIGkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvID0gdGhpcy5leHRlbmRNb2RlQmcuY29udmVydFRvTm9kZVNwYWNlQVIoZSk7XG4gICAgICAgIHZhciBzID0gby54IC8gMTA2ICsgMC41O1xuICAgICAgICB2YXIgYyA9IC1vLnkgLyAxMDYgKyAwLjU7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIHZhciByID0gITA7XG4gICAgICAgIHQueHlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBlID0gTWF0aC5mbG9vcihzICsgdC54KTtcbiAgICAgICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihjICsgdC55KTtcbiAgICAgICAgICAgIGlmICghKGUgPCAwIHx8IGkgPCAwIHx8IGUgPiA0IHx8IGkgPiA2KSkge1xuICAgICAgICAgICAgICAgIHZhciBvID0gNSAqIGkgKyBlO1xuICAgICAgICAgICAgICAgIGlmIChuLnBvc2VzW29dKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuLmJsb2Nrc1tvXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgKHIgPSAhMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5wdXNoKG8pLCAtMSA9PSBuLmRhdGFzW29dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgKHIgPSAhMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgciA9ICExO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wb3Nlcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQuc2V0UHJldmlldygtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgaS5wdXNoKG4ucG9zZXNbdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbi5wb3Nlc1t0XS5zZXRQcmV2aWV3KHIgPyAwIDogMSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuICAgIGdldEJsb2Nrc1RvUHV0OiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih0aGlzLmRyYWdCb2FyZE1vdmVkLnggLyAxMDYgKyAwLjUpO1xuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoLXRoaXMuZHJhZ0JvYXJkTW92ZWQueSAvIDEwNiArIDAuNSk7XG4gICAgICAgIHZhciBvID0gITA7XG4gICAgICAgIHRoaXMuZGF0YXMuZm9yRWFjaChmdW5jdGlvbiAocywgYykge1xuICAgICAgICAgICAgaWYgKDAgPT0gcykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYyAlIDU7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBhICsgaTtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IChjIC0gYSkgLyA1ICsgbjtcbiAgICAgICAgICAgICAgICBpZiAociA8IDAgfHwgaCA8IDAgfHwgciA+IDQgfHwgaCA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgbyA9ICExO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gNSAqIGggKyByO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5wb3Nlc1tkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaGFzVHJ5UGxhY2UoZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSAhMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvO1xuICAgIH0sXG4gICAgZGVidWc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHQgJiZcbiAgICAgICAgICAgICAgICB0Lml0ZW0gJiZcbiAgICAgICAgICAgICAgICB0Lml0ZW0ubXlCbG9ja3MuZXZlcnkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUuaSAhPSB0Lmk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJzeW5jIDFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJvYXJkSXRlbXNSb290LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBlID0gdC5nZXRDb21wb25lbnQoXCJJdGVtXCIpO1xuICAgICAgICAgICAgaWYgKGUubXlCbG9ja3MubGVuZ3RoICE9IGUueHlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJzeW5jIDJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZS5teUJsb2Nrcy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lml0ZW0gIT0gZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcInN5bmMgM1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gdC54IC8gMTA2O1xuICAgICAgICAgICAgdmFyIG4gPSB0LnkgLyAxMDY7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIihcIiArIGkgKyBcIixcIiArIG4gKyBcIilcIik7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0QmxvY2tQb3M6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdCAlIDU7XG4gICAgICAgIHZhciBpID0gKHQgLSBlKSAvIDU7XG4gICAgICAgIHJldHVybiBjYy52MigxMDYgKiBlLCAxMDYgKiAtaSk7XG4gICAgfSxcbiAgICBjcmVhdGVCbG9jazogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmJsb2NrUHJlZmFiLmFkZE5vZGUodGhpcy5nZXRCbG9ja1Bvcyh0KSkuZ2V0Q29tcG9uZW50KFwiQmxvY2tcIik7XG4gICAgICAgIGUuc2V0Um9vdCh0aGlzKTtcbiAgICAgICAgZS5pID0gdDtcbiAgICAgICAgdGhpcy5ibG9ja3NbdF0gPSBlO1xuICAgICAgICB0aGlzLnBvc2VzW3RdLm5vZGUuYWN0aXZlID0gITE7XG4gICAgICAgIHRoaXMucG9zZXNbdF0uaXRlbSA9IG51bGw7XG4gICAgfSxcbiAgICBjcmVhdGVCbG9ja3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGFzLmZvckVhY2goZnVuY3Rpb24gKGUsIGkpIHtcbiAgICAgICAgICAgIGlmICgwID09IGUpIHtcbiAgICAgICAgICAgICAgICB0LmNyZWF0ZUJsb2NrKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNldEV4dGVuZE1vZGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHRoaXMuZXh0ZW5kTW9kZUJnLmFjdGl2ZSA9IHQ7XG4gICAgICAgIHRoaXMudWkxLmFjdGl2ZSA9ICF0O1xuICAgICAgICB0aGlzLnVpMi5hY3RpdmUgPSB0O1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFeHRlbmRNb2RlKSB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b1B1dEFyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNFeHRlbmRNb2RlID0gdDtcbiAgICB9LFxuICAgIHJlc2V0QmxvY2tzUHJldmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIHQuc2V0UHJldmlldygtMSk7XG4gICAgICAgICAgICAgICAgaWYgKHQuaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB0Lml0ZW0uaGlkZVVuZGVyQnVmZkVmZmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB0Lml0ZW0udXBkYXRlTHY1RWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2V0UG9zZXNQcmV2aWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucG9zZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQgJiYgdC5ub2RlLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHQuc2V0UHJldmlldygtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdHJ5UGxhY2U6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIC0xID09XG4gICAgICAgICAgICB0aGlzLnRvUHV0QXJyLmZpbmRJbmRleChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlID09IHQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMudG9QdXRBcnIucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdW5kb1RyeVBsYWNlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMudG9QdXRBcnIuZmluZEluZGV4KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZSA9PSB0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKC0xICE9IGUpIHtcbiAgICAgICAgICAgIHRoaXMudG9QdXRBcnIuc3BsaWNlKGUsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoYXNUcnlQbGFjZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9QdXRBcnIuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUubXlCbG9ja3Muc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmkgPT0gdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRlc3RDYW50UGxhY2U6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBlID0gdGhpcztcbiAgICAgICAgdmFyIGkgPSB0ICUgNTtcbiAgICAgICAgdmFyIG4gPSAodCAtIGkpIC8gNTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgIHk6IC0xXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgeTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4OiAtMSxcbiAgICAgICAgICAgICAgICB5OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgeTogMFxuICAgICAgICAgICAgfVxuICAgICAgICBdLmV2ZXJ5KGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgbyA9IHQueCArIGk7XG4gICAgICAgICAgICB2YXIgcyA9IHQueSArIG47XG4gICAgICAgICAgICBpZiAobyA8IDAgfHwgcyA8IDAgfHwgbyA+IDQgfHwgcyA+IDYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gITA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYyA9IDUgKiBzICsgbztcbiAgICAgICAgICAgIHJldHVybiAtMSA9PSBlLmRhdGFzW2NdO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tQbGFjZUVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICAgIHZhciBlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBuID0gZVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IG4ubXlCbG9ja3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lmk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhby5ldmVyeShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQudGVzdENhbnRQbGFjZShlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgby5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5ibG9ja3NbZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwieHh4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdC5kYXRhc1tlXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LmNyZWF0ZUJsb2NrKGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbi5yZW1vdmVGcm9tQmxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgbi5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBpID0gW107XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGkgPSB0aGlzLnRvUHV0QXJyLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gd2hpbGUgKGUoaSkpO1xuICAgICAgICBpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHQucmVtb3ZlRnJvbUJsb2NrKCk7XG4gICAgICAgICAgICB0Lml0ZW1Sb290LnB1dGRvd24odCwgdC5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy5WZWMyLlpFUk8pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0RXh0ZW5kTW9kZSghMSk7XG4gICAgICAgIHRoaXMuaXRlbVJvb3Quc2V0Q2FuRHJhZyghMCk7XG4gICAgfSxcbiAgICBnZXRDcm9zc0l0ZW1zOiBmdW5jdGlvbiAodCwgZSwgaSkge1xuICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgIGlmICg2ID09IHQpIHtcbiAgICAgICAgICAgIHZhciBvID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdmFyIHMgPSBlICUgNTtcbiAgICAgICAgICAgIHZhciBjID0gKGUgLSBzKSAvIDU7XG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWy0xLCAwXSxcbiAgICAgICAgICAgICAgICBbMSwgMF0sXG4gICAgICAgICAgICAgICAgWzAsIC0xXSxcbiAgICAgICAgICAgICAgICBbMCwgMV1cbiAgICAgICAgICAgIF0uZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gcyArIHRbMF07XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBjICsgdFsxXTtcbiAgICAgICAgICAgICAgICBpZiAoIShlIDwgMCB8fCBpIDwgMCB8fCBlID4gNCB8fCBpID4gNikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSA1ICogaSArIGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuLmJsb2Nrc1thXSAmJiBuLmJsb2Nrc1thXS5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvLmFkZChuLmJsb2Nrc1thXS5pdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgby5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgaSh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpc0Z1bGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzLmV2ZXJ5KGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbCA9PSB0IHx8IG51bGwgIT0gdC5pdGVtO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiJdfQ==