// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"global.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAME_STATE = exports.STONE = void 0;
exports.STONE = {
  NONE: 0,
  FIRST: 1,
  SECOND: 2,
  WALL: -1
};
exports.GAME_STATE = {
  PENDING: 0,
  WIN: 1,
  DRAW: 2
};
},{}],"gomoku.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function (receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GomokuNarabe_field, _GomokuNarabe_turn, _GomokuNarabe_size;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GomokuNarabe = void 0;
var global_1 = require("./global");
var GomokuNarabe = /** @class */function () {
  function GomokuNarabe(n) {
    _GomokuNarabe_field.set(this, void 0);
    _GomokuNarabe_turn.set(this, void 0);
    _GomokuNarabe_size.set(this, void 0);
    __classPrivateFieldSet(this, _GomokuNarabe_size, n, "f");
    __classPrivateFieldSet(this, _GomokuNarabe_turn, global_1.STONE.FIRST, "f");
    __classPrivateFieldSet(this, _GomokuNarabe_field, new Array(n + 2).fill(null).map(function (_) {
      return new Array(n + 2).fill(global_1.STONE.NONE);
    }), "f");
    for (var i = 0; i < n + 2; i++) {
      __classPrivateFieldGet(this, _GomokuNarabe_field, "f")[i][0] = global_1.STONE.WALL;
      __classPrivateFieldGet(this, _GomokuNarabe_field, "f")[i][n + 1] = global_1.STONE.WALL;
      __classPrivateFieldGet(this, _GomokuNarabe_field, "f")[0][i] = global_1.STONE.WALL;
      __classPrivateFieldGet(this, _GomokuNarabe_field, "f")[n + 1][i] = global_1.STONE.WALL;
    }
  }
  Object.defineProperty(GomokuNarabe.prototype, "field", {
    get: function get() {
      return __classPrivateFieldGet(this, _GomokuNarabe_field, "f").slice(1, -1).map(function (arr) {
        return arr.slice(1, -1);
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(GomokuNarabe.prototype, "turn", {
    get: function get() {
      return __classPrivateFieldGet(this, _GomokuNarabe_turn, "f");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(GomokuNarabe.prototype, "size", {
    get: function get() {
      return __classPrivateFieldGet(this, _GomokuNarabe_size, "f");
    },
    enumerable: false,
    configurable: true
  });
  GomokuNarabe.prototype.getOpponentTurn = function () {
    return this.turn === global_1.STONE.FIRST ? global_1.STONE.SECOND : global_1.STONE.FIRST;
  };
  GomokuNarabe.prototype.putStone = function (row, col) {
    if (__classPrivateFieldGet(this, _GomokuNarabe_field, "f")[row][col] !== global_1.STONE.NONE) {
      return null;
    } else {
      __classPrivateFieldGet(this, _GomokuNarabe_field, "f")[row][col] = __classPrivateFieldGet(this, _GomokuNarabe_turn, "f");
      var state = this.checkGameState(row, col, __classPrivateFieldGet(this, _GomokuNarabe_field, "f"), __classPrivateFieldGet(this, _GomokuNarabe_turn, "f"));
      __classPrivateFieldSet(this, _GomokuNarabe_turn, this.getOpponentTurn(), "f");
      return state;
    }
  };
  GomokuNarabe.prototype.checkGameState = function (r, c, field, turn) {
    if (countStone([0, 1]) + countStone([0, -1]) >= 4) {
      return global_1.GAME_STATE.WIN;
    } else if (countStone([1, 0]) + countStone([-1, 0]) >= 4) {
      return global_1.GAME_STATE.WIN;
    } else if (countStone([1, 1]) + countStone([-1, -1]) >= 4) {
      return global_1.GAME_STATE.WIN;
    } else if (countStone([1, -1]) + countStone([-1, 1]) >= 4) {
      return global_1.GAME_STATE.WIN;
    } else if (field.every(function (arr) {
      return arr.every(function (e) {
        return e !== global_1.STONE.NONE;
      });
    })) {
      return global_1.GAME_STATE.DRAW;
    } else {
      return global_1.GAME_STATE.PENDING;
    }
    //dir方向に同種の石がいくつ連続してあるか数える
    function countStone(dir) {
      var row = r;
      var col = c;
      var count = 0;
      rec();
      function rec() {
        row += dir[0];
        col += dir[1];
        if (field[row][col] !== turn) {
          return;
        }
        count++;
        rec();
      }
      return count;
    }
  };
  //COMの次の一手
  GomokuNarabe.prototype.comNext = function () {
    //boxには空のマスのリストを入れる
    var box = [];
    for (var i_1 = 1; i_1 <= __classPrivateFieldGet(this, _GomokuNarabe_size, "f"); i_1++) {
      for (var j_1 = 1; j_1 <= __classPrivateFieldGet(this, _GomokuNarabe_size, "f"); j_1++) {
        if (__classPrivateFieldGet(this, _GomokuNarabe_field, "f")[i_1][j_1] == global_1.STONE.NONE) {
          box.push([i_1, j_1]);
        }
      }
    }
    for (var _i = 0, box_1 = box; _i < box_1.length; _i++) {
      var elm = box_1[_i];
      var _a = [elm[0], elm[1]],
        i_2 = _a[0],
        j_2 = _a[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_2][j_2] = this.turn;
      if (this.checkGameState(i_2, j_2, field, this.turn) === global_1.GAME_STATE.WIN) {
        return [i_2 - 1, j_2 - 1];
      }
    }
    for (var _b = 0, box_2 = box; _b < box_2.length; _b++) {
      var elm = box_2[_b];
      var _c = [elm[0], elm[1]],
        i_3 = _c[0],
        j_3 = _c[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_3][j_3] = this.getOpponentTurn();
      if (this.checkGameState(i_3, j_3, field, this.getOpponentTurn()) === global_1.GAME_STATE.WIN) {
        return [i_3 - 1, j_3 - 1];
      }
    }
    for (var _d = 0, box_3 = box; _d < box_3.length; _d++) {
      var elm = box_3[_d];
      var _e = [elm[0], elm[1]],
        i_4 = _e[0],
        j_4 = _e[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_4][j_4] = this.turn;
      var gsa = this.getStoneArray(i_4, j_4, field, this.turn);
      var idx = gsa.counts.findIndex(function (e) {
        return e == 3;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 2) {
        return [i_4 - 1, j_4 - 1];
      }
    }
    for (var _f = 0, box_4 = box; _f < box_4.length; _f++) {
      var elm = box_4[_f];
      var _g = [elm[0], elm[1]],
        i_5 = _g[0],
        j_5 = _g[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_5][j_5] = this.turn;
      var gsa = this.getStoneArray(i_5, j_5, field, this.turn);
      var idx = gsa.counts.findIndex(function (e) {
        return e == 3;
      });
      var idx2 = gsa.counts.findIndex(function (e) {
        return e == 2;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 1 && idx2 >= 0 && gsa.noneEnds[idx2] == 2) {
        return [i_5 - 1, j_5 - 1];
      }
    }
    for (var _h = 0, box_5 = box; _h < box_5.length; _h++) {
      var elm = box_5[_h];
      var _j = [elm[0], elm[1]],
        i_6 = _j[0],
        j_6 = _j[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_6][j_6] = this.turn;
      var gsa = this.getStoneArray(i_6, j_6, field, this.turn);
      var idx = gsa.counts.findIndex(function (e) {
        return e == 3;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 1) {
        if (Math.random() < 0.5) {
          continue;
        }
        return [i_6 - 1, j_6 - 1];
      }
    }
    //相手の4連を封じる
    for (var _k = 0, box_6 = box; _k < box_6.length; _k++) {
      var elm = box_6[_k];
      var _l = [elm[0], elm[1]],
        i_7 = _l[0],
        j_7 = _l[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_7][j_7] = this.getOpponentTurn();
      var gsa = this.getStoneArray(i_7, j_7, field, this.getOpponentTurn());
      var idx = gsa.counts.findIndex(function (e) {
        return e == 3;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 2) {
        return [i_7 - 1, j_7 - 1];
      }
    }
    //相手の4-3を封じる
    for (var _m = 0, box_7 = box; _m < box_7.length; _m++) {
      var elm = box_7[_m];
      var _o = [elm[0], elm[1]],
        i_8 = _o[0],
        j_8 = _o[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_8][j_8] = this.getOpponentTurn();
      var gsa = this.getStoneArray(i_8, j_8, field, this.getOpponentTurn());
      var idx = gsa.counts.findIndex(function (e) {
        return e == 3;
      });
      var idx2 = gsa.counts.findIndex(function (e) {
        return e == 2;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 1 && idx2 >= 0 && gsa.noneEnds[idx2] == 2) {
        return [i_8 - 1, j_8 - 1];
      }
    }
    for (var _p = 0, box_8 = box; _p < box_8.length; _p++) {
      var elm = box_8[_p];
      var _q = [elm[0], elm[1]],
        i_9 = _q[0],
        j_9 = _q[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_9][j_9] = this.turn;
      var gsa = this.getStoneArray(i_9, j_9, field, this.turn);
      var idx = gsa.counts.findIndex(function (e) {
        return e == 2;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 2) {
        return [i_9 - 1, j_9 - 1];
      }
    }
    for (var _r = 0, box_9 = box; _r < box_9.length; _r++) {
      var elm = box_9[_r];
      var _s = [elm[0], elm[1]],
        i_10 = _s[0],
        j_10 = _s[1];
      var field = structuredClone(__classPrivateFieldGet(this, _GomokuNarabe_field, "f"));
      field[i_10][j_10] = this.getOpponentTurn();
      var gsa = this.getStoneArray(i_10, j_10, field, this.getOpponentTurn());
      var idx = gsa.counts.findIndex(function (e) {
        return e == 2;
      });
      if (idx >= 0 && gsa.noneEnds[idx] == 2) {
        return [i_10 - 1, j_10 - 1];
      }
    }
    var _loop_1 = function _loop_1(elm) {
      var _v = [elm[0], elm[1]],
        i_11 = _v[0],
        j_11 = _v[1];
      var field = structuredClone(__classPrivateFieldGet(this_1, _GomokuNarabe_field, "f"));
      field[i_11][j_11] = this_1.turn;
      var gsa = this_1.getStoneArray(i_11, j_11, field, this_1.turn);
      var idx2 = gsa.counts.findIndex(function (e) {
        return e == 1;
      });
      var idx3 = gsa.counts.findIndex(function (e, i) {
        return e == 1 && i > idx2;
      });
      if (idx2 >= 0 && gsa.noneEnds[idx2] == 2 && idx3 >= 0 && gsa.noneEnds[idx3] == 2) {
        return {
          value: [i_11 - 1, j_11 - 1]
        };
      }
    };
    var this_1 = this;
    for (var _t = 0, box_10 = box; _t < box_10.length; _t++) {
      var elm = box_10[_t];
      var state_1 = _loop_1(elm);
      if (_typeof(state_1) === "object") return state_1.value;
    }
    var midIndex = Math.floor(box.length / 2);
    var _u = [box[midIndex][0], box[midIndex][1]],
      i = _u[0],
      j = _u[1];
    return [i - 1, j - 1];
  };
  //横方向、縦方向、斜め方向×2　の４方向について同種の石が連続している数およびその両端が空マスである数を計算してリストにして返す。
  GomokuNarabe.prototype.getStoneArray = function (r, c, field, turn) {
    var countBox = [];
    var noneEndBox = [];
    countBox.push(countStone([0, 1]).count + countStone([0, -1]).count);
    noneEndBox.push(countStone([0, 1]).noneEnd + countStone([0, -1]).noneEnd);
    countBox.push(countStone([1, 0]).count + countStone([-1, 0]).count);
    noneEndBox.push(countStone([1, 0]).noneEnd + countStone([-1, 0]).noneEnd);
    countBox.push(countStone([1, 1]).count + countStone([-1, -1]).count);
    noneEndBox.push(countStone([1, 1]).noneEnd + countStone([-1, -1]).noneEnd);
    countBox.push(countStone([1, -1]).count + countStone([-1, 1]).count);
    noneEndBox.push(countStone([1, -1]).noneEnd + countStone([-1, 1]).noneEnd);
    return {
      counts: countBox,
      noneEnds: noneEndBox
    };
    //dir方向に同種の石が連続して何個あるか(count)、さらにその直後が空マスかどうか(空マスのときnoneEndは1)を返す。
    function countStone(dir) {
      var row = r;
      var col = c;
      var count = 0;
      var noneEnd = 0;
      rec();
      function rec() {
        row += dir[0];
        col += dir[1];
        if (field[row][col] !== turn) {
          noneEnd = field[row][col] == global_1.STONE.NONE ? 1 : 0;
          return;
        }
        count++;
        rec();
      }
      return {
        count: count,
        noneEnd: noneEnd
      };
    }
  };
  return GomokuNarabe;
}();
exports.GomokuNarabe = GomokuNarabe;
_GomokuNarabe_field = new WeakMap(), _GomokuNarabe_turn = new WeakMap(), _GomokuNarabe_size = new WeakMap();
},{"./global":"global.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50160" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","gomoku.ts"], null)
//# sourceMappingURL=/gomoku.ce385d33.js.map