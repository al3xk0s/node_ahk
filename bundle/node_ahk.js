"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/node-gyp-build/node-gyp-build.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/node-gyp-build.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os.arch();
    var platform = process.env.npm_config_platform || os.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module2.exports = load;
    function load(dir) {
      return runtimeRequire(load.resolve(dir));
    }
    load.resolve = load.path = function(dir) {
      dir = path.resolve(dir || ".");
      try {
        var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"])
          dir = process.env[name + "_PREBUILD"];
      } catch (err2) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, "build/Release"), matchBuild);
        if (release)
          return release;
        var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
        if (debug)
          return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild)
        return prebuild;
      var nearby = resolve(path.dirname(process.execPath));
      if (nearby)
        return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
        // eslint-disable-line
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve(dir2) {
        var tuples = readdirSync(path.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple)
          return;
        var prebuilds = path.join(dir2, "prebuilds", tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner)
          return path.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs.readdirSync(dir);
      } catch (err2) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2)
        return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2)
        return;
      if (!architectures.length)
        return;
      if (!architectures.every(Boolean))
        return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null)
          return false;
        if (tuple.platform !== platform2)
          return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a, b) {
      return a.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node")
        return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null)
          return false;
        if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
          return false;
        if (tags.abi !== abi2 && !tags.napi)
          return false;
        if (tags.uv && tags.uv !== uv)
          return false;
        if (tags.armv && tags.armv !== armv)
          return false;
        if (tags.libc && tags.libc !== libc)
          return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron)
        return true;
      if (process.env.ELECTRON_RUN_AS_NODE)
        return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// node_modules/node-gyp-build/index.js
var require_node_gyp_build2 = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports2, module2) {
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    if (typeof runtimeRequire.addon === "function") {
      module2.exports = runtimeRequire.addon.bind(runtimeRequire);
    } else {
      module2.exports = require_node_gyp_build();
    }
  }
});

// node_modules/uiohook-napi/dist/index.js
var require_dist = __commonJS({
  "node_modules/uiohook-napi/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.uIOhook = exports2.UiohookKey = exports2.WheelDirection = exports2.EventType = void 0;
    var events_1 = require("events");
    var path_1 = require("path");
    var lib = require_node_gyp_build2()((0, path_1.join)(__dirname, ".."));
    var KeyToggle;
    (function(KeyToggle2) {
      KeyToggle2[KeyToggle2["Tap"] = 0] = "Tap";
      KeyToggle2[KeyToggle2["Down"] = 1] = "Down";
      KeyToggle2[KeyToggle2["Up"] = 2] = "Up";
    })(KeyToggle || (KeyToggle = {}));
    var EventType;
    (function(EventType2) {
      EventType2[EventType2["EVENT_KEY_PRESSED"] = 4] = "EVENT_KEY_PRESSED";
      EventType2[EventType2["EVENT_KEY_RELEASED"] = 5] = "EVENT_KEY_RELEASED";
      EventType2[EventType2["EVENT_MOUSE_CLICKED"] = 6] = "EVENT_MOUSE_CLICKED";
      EventType2[EventType2["EVENT_MOUSE_PRESSED"] = 7] = "EVENT_MOUSE_PRESSED";
      EventType2[EventType2["EVENT_MOUSE_RELEASED"] = 8] = "EVENT_MOUSE_RELEASED";
      EventType2[EventType2["EVENT_MOUSE_MOVED"] = 9] = "EVENT_MOUSE_MOVED";
      EventType2[EventType2["EVENT_MOUSE_WHEEL"] = 11] = "EVENT_MOUSE_WHEEL";
    })(EventType = exports2.EventType || (exports2.EventType = {}));
    var WheelDirection;
    (function(WheelDirection2) {
      WheelDirection2[WheelDirection2["VERTICAL"] = 3] = "VERTICAL";
      WheelDirection2[WheelDirection2["HORIZONTAL"] = 4] = "HORIZONTAL";
    })(WheelDirection = exports2.WheelDirection || (exports2.WheelDirection = {}));
    exports2.UiohookKey = {
      Backspace: 14,
      Tab: 15,
      Enter: 28,
      CapsLock: 58,
      Escape: 1,
      Space: 57,
      PageUp: 3657,
      PageDown: 3665,
      End: 3663,
      Home: 3655,
      ArrowLeft: 57419,
      ArrowUp: 57416,
      ArrowRight: 57421,
      ArrowDown: 57424,
      Insert: 3666,
      Delete: 3667,
      0: 11,
      1: 2,
      2: 3,
      3: 4,
      4: 5,
      5: 6,
      6: 7,
      7: 8,
      8: 9,
      9: 10,
      A: 30,
      B: 48,
      C: 46,
      D: 32,
      E: 18,
      F: 33,
      G: 34,
      H: 35,
      I: 23,
      J: 36,
      K: 37,
      L: 38,
      M: 50,
      N: 49,
      O: 24,
      P: 25,
      Q: 16,
      R: 19,
      S: 31,
      T: 20,
      U: 22,
      V: 47,
      W: 17,
      X: 45,
      Y: 21,
      Z: 44,
      Numpad0: 82,
      Numpad1: 79,
      Numpad2: 80,
      Numpad3: 81,
      Numpad4: 75,
      Numpad5: 76,
      Numpad6: 77,
      Numpad7: 71,
      Numpad8: 72,
      Numpad9: 73,
      NumpadMultiply: 55,
      NumpadAdd: 78,
      NumpadSubtract: 74,
      NumpadDecimal: 83,
      NumpadDivide: 3637,
      NumpadEnd: 60928 | 79,
      NumpadArrowDown: 60928 | 80,
      NumpadPageDown: 60928 | 81,
      NumpadArrowLeft: 60928 | 75,
      NumpadArrowRight: 60928 | 77,
      NumpadHome: 60928 | 71,
      NumpadArrowUp: 60928 | 72,
      NumpadPageUp: 60928 | 73,
      NumpadInsert: 60928 | 82,
      NumpadDelete: 60928 | 83,
      F1: 59,
      F2: 60,
      F3: 61,
      F4: 62,
      F5: 63,
      F6: 64,
      F7: 65,
      F8: 66,
      F9: 67,
      F10: 68,
      F11: 87,
      F12: 88,
      F13: 91,
      F14: 92,
      F15: 93,
      F16: 99,
      F17: 100,
      F18: 101,
      F19: 102,
      F20: 103,
      F21: 104,
      F22: 105,
      F23: 106,
      F24: 107,
      Semicolon: 39,
      Equal: 13,
      Comma: 51,
      Minus: 12,
      Period: 52,
      Slash: 53,
      Backquote: 41,
      BracketLeft: 26,
      Backslash: 43,
      BracketRight: 27,
      Quote: 40,
      Ctrl: 29,
      CtrlRight: 3613,
      Alt: 56,
      AltRight: 3640,
      Shift: 42,
      ShiftRight: 54,
      Meta: 3675,
      MetaRight: 3676,
      NumLock: 69,
      ScrollLock: 70,
      PrintScreen: 3639
    };
    var UiohookNapi = class extends events_1.EventEmitter {
      handler(e) {
        this.emit("input", e);
        switch (e.type) {
          case EventType.EVENT_KEY_PRESSED:
            this.emit("keydown", e);
            break;
          case EventType.EVENT_KEY_RELEASED:
            this.emit("keyup", e);
            break;
          case EventType.EVENT_MOUSE_CLICKED:
            this.emit("click", e);
            break;
          case EventType.EVENT_MOUSE_MOVED:
            this.emit("mousemove", e);
            break;
          case EventType.EVENT_MOUSE_PRESSED:
            this.emit("mousedown", e);
            break;
          case EventType.EVENT_MOUSE_RELEASED:
            this.emit("mouseup", e);
            break;
          case EventType.EVENT_MOUSE_WHEEL:
            this.emit("wheel", e);
            break;
        }
      }
      start() {
        lib.start(this.handler.bind(this));
      }
      stop() {
        lib.stop();
      }
      keyTap(key, modifiers = []) {
        if (!modifiers.length) {
          lib.keyTap(key, KeyToggle.Tap);
          return;
        }
        for (const modKey of modifiers) {
          lib.keyTap(modKey, KeyToggle.Down);
        }
        lib.keyTap(key, KeyToggle.Tap);
        let i = modifiers.length;
        while (i--) {
          lib.keyTap(modifiers[i], KeyToggle.Up);
        }
      }
      keyToggle(key, toggle) {
        lib.keyTap(key, toggle === "down" ? KeyToggle.Down : KeyToggle.Up);
      }
    };
    exports2.uIOhook = new UiohookNapi();
  }
});

// node_modules/suchibot/dist/types.js
var require_types = __commonJS({
  "node_modules/suchibot/dist/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MouseButton = exports2.Key = void 0;
    exports2.Key = {
      BACKSPACE: "BACKSPACE",
      DELETE: "DELETE",
      ENTER: "ENTER",
      TAB: "TAB",
      ESCAPE: "ESCAPE",
      UP: "UP",
      DOWN: "DOWN",
      RIGHT: "RIGHT",
      LEFT: "LEFT",
      HOME: "HOME",
      INSERT: "INSERT",
      END: "END",
      PAGE_UP: "PAGE_UP",
      PAGE_DOWN: "PAGE_DOWN",
      SPACE: "SPACE",
      F1: "F1",
      F2: "F2",
      F3: "F3",
      F4: "F4",
      F5: "F5",
      F6: "F6",
      F7: "F7",
      F8: "F8",
      F9: "F9",
      F10: "F10",
      F11: "F11",
      F12: "F12",
      F13: "F13",
      F14: "F14",
      F15: "F15",
      F16: "F16",
      F17: "F17",
      F18: "F18",
      F19: "F19",
      F20: "F20",
      F21: "F21",
      F22: "F22",
      F23: "F23",
      F24: "F24",
      LEFT_ALT: "LEFT_ALT",
      LEFT_CONTROL: "LEFT_CONTROL",
      LEFT_SHIFT: "LEFT_SHIFT",
      RIGHT_ALT: "RIGHT_ALT",
      RIGHT_CONTROL: "RIGHT_CONTROL",
      RIGHT_SHIFT: "RIGHT_SHIFT",
      LEFT_WINDOWS: "LEFT_SUPER",
      LEFT_COMMAND: "LEFT_SUPER",
      LEFT_META: "LEFT_SUPER",
      LEFT_SUPER: "LEFT_SUPER",
      RIGHT_WINDOWS: "RIGHT_SUPER",
      RIGHT_COMMAND: "RIGHT_SUPER",
      RIGHT_META: "RIGHT_SUPER",
      RIGHT_SUPER: "RIGHT_SUPER",
      PRINT_SCREEN: "PRINT_SCREEN",
      VOLUME_DOWN: "VOLUME_DOWN",
      VOLUME_UP: "VOLUME_UP",
      MUTE: "MUTE",
      PAUSE_BREAK: "PAUSE_BREAK",
      NUMPAD_0: "NUMPAD_0",
      NUMPAD_1: "NUMPAD_1",
      NUMPAD_2: "NUMPAD_2",
      NUMPAD_3: "NUMPAD_3",
      NUMPAD_4: "NUMPAD_4",
      NUMPAD_5: "NUMPAD_5",
      NUMPAD_6: "NUMPAD_6",
      NUMPAD_7: "NUMPAD_7",
      NUMPAD_8: "NUMPAD_8",
      NUMPAD_9: "NUMPAD_9",
      NUMPAD_MULTIPLY: "NUMPAD_MULTIPLY",
      NUMPAD_ADD: "NUMPAD_ADD",
      NUMPAD_SUBTRACT: "NUMPAD_SUBTRACT",
      NUMPAD_DECIMAL: "NUMPAD_DECIMAL",
      NUMPAD_DIVIDE: "NUMPAD_DIVIDE",
      NUMPAD_ENTER: "NUMPAD_ENTER",
      CAPS_LOCK: "CAPS_LOCK",
      NUM_LOCK: "NUM_LOCK",
      SCROLL_LOCK: "SCROLL_LOCK",
      SEMICOLON: "SEMICOLON",
      EQUAL: "EQUAL",
      COMMA: "COMMA",
      MINUS: "MINUS",
      PERIOD: "PERIOD",
      SLASH: "SLASH",
      BACKTICK: "BACKTICK",
      LEFT_BRACKET: "LEFT_BRACKET",
      BACKSLASH: "BACKSLASH",
      RIGHT_BRACKET: "RIGHT_BRACKET",
      QUOTE: "QUOTE",
      A: "A",
      B: "B",
      C: "C",
      D: "D",
      E: "E",
      F: "F",
      G: "G",
      H: "H",
      I: "I",
      J: "J",
      K: "K",
      L: "L",
      M: "M",
      N: "N",
      O: "O",
      P: "P",
      Q: "Q",
      R: "R",
      S: "S",
      T: "T",
      U: "U",
      V: "V",
      W: "W",
      X: "X",
      Y: "Y",
      Z: "Z",
      ZERO: "ZERO",
      ONE: "ONE",
      TWO: "TWO",
      THREE: "THREE",
      FOUR: "FOUR",
      FIVE: "FIVE",
      SIX: "SIX",
      SEVEN: "SEVEN",
      EIGHT: "EIGHT",
      NINE: "NINE",
      ANY: "ANY"
    };
    exports2.MouseButton = {
      LEFT: "LEFT",
      RIGHT: "RIGHT",
      MIDDLE: "MIDDLE",
      MOUSE4: "MOUSE4",
      MOUSE5: "MOUSE5",
      ANY: "ANY"
    };
  }
});

// node_modules/mitt/dist/mitt.mjs
var mitt_exports = {};
__export(mitt_exports, {
  default: () => mitt_default
});
function mitt_default(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i ? i.push(e) : n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e);
    });
  } };
}
var init_mitt = __esm({
  "node_modules/mitt/dist/mitt.mjs"() {
  }
});

// node_modules/suchibot/dist/input/held-keys.js
var require_held_keys = __commonJS({
  "node_modules/suchibot/dist/input/held-keys.js"(exports2) {
    "use strict";
    var __values = exports2 && exports2.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __read = exports2 && exports2.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getModifierKeysState = exports2.isKeyUp = exports2.isKeyDown = exports2.setKeyState = void 0;
    var types_1 = require_types();
    var heldKeys = /* @__PURE__ */ new Map();
    function setKeyState(key, upOrDown) {
      if (key === types_1.Key.ANY) {
        return;
      }
      heldKeys.set(key, upOrDown === "down");
    }
    exports2.setKeyState = setKeyState;
    function isKeyDown(key) {
      var e_1, _a;
      if (key === types_1.Key.ANY) {
        try {
          for (var heldKeys_1 = __values(heldKeys), heldKeys_1_1 = heldKeys_1.next(); !heldKeys_1_1.done; heldKeys_1_1 = heldKeys_1.next()) {
            var _b = __read(heldKeys_1_1.value, 2), _key = _b[0], isDown = _b[1];
            if (isDown) {
              return true;
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (heldKeys_1_1 && !heldKeys_1_1.done && (_a = heldKeys_1.return))
              _a.call(heldKeys_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return false;
      } else {
        return Boolean(heldKeys.get(key));
      }
    }
    exports2.isKeyDown = isKeyDown;
    function isKeyUp(key) {
      var e_2, _a;
      if (key === types_1.Key.ANY) {
        try {
          for (var heldKeys_2 = __values(heldKeys), heldKeys_2_1 = heldKeys_2.next(); !heldKeys_2_1.done; heldKeys_2_1 = heldKeys_2.next()) {
            var _b = __read(heldKeys_2_1.value, 2), _key = _b[0], isDown = _b[1];
            if (!isDown) {
              return true;
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (heldKeys_2_1 && !heldKeys_2_1.done && (_a = heldKeys_2.return))
              _a.call(heldKeys_2);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        return false;
      } else {
        return !heldKeys.get(key);
      }
    }
    exports2.isKeyUp = isKeyUp;
    function getModifierKeysState() {
      var leftAlt = Boolean(heldKeys.get(types_1.Key.LEFT_ALT));
      var leftControl = Boolean(heldKeys.get(types_1.Key.LEFT_CONTROL));
      var leftShift = Boolean(heldKeys.get(types_1.Key.LEFT_SHIFT));
      var leftSuper = Boolean(heldKeys.get(types_1.Key.LEFT_SUPER));
      var rightAlt = Boolean(heldKeys.get(types_1.Key.RIGHT_ALT));
      var rightControl = Boolean(heldKeys.get(types_1.Key.RIGHT_CONTROL));
      var rightShift = Boolean(heldKeys.get(types_1.Key.RIGHT_SHIFT));
      var rightSuper = Boolean(heldKeys.get(types_1.Key.RIGHT_SUPER));
      var alt = leftAlt || rightAlt;
      var control = leftControl || rightControl;
      var shift = leftShift || rightShift;
      var super_ = leftSuper || rightSuper;
      return {
        alt,
        control,
        shift,
        super: super_,
        windows: super_,
        command: super_,
        meta: super_,
        leftAlt,
        leftControl,
        leftShift,
        leftSuper,
        leftWindows: leftSuper,
        leftCommand: leftSuper,
        leftMeta: leftSuper,
        rightAlt,
        rightControl,
        rightShift,
        rightSuper,
        rightWindows: rightSuper,
        rightCommand: rightSuper,
        rightMeta: rightSuper
      };
    }
    exports2.getModifierKeysState = getModifierKeysState;
  }
});

// node_modules/suchibot/dist/input/held-mouse-buttons.js
var require_held_mouse_buttons = __commonJS({
  "node_modules/suchibot/dist/input/held-mouse-buttons.js"(exports2) {
    "use strict";
    var __values = exports2 && exports2.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __read = exports2 && exports2.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getMouseButtonsState = exports2.isButtonUp = exports2.isButtonDown = exports2.setButtonState = void 0;
    var types_1 = require_types();
    var heldButtons = /* @__PURE__ */ new Map();
    function setButtonState(button, upOrDown) {
      if (button === types_1.MouseButton.ANY) {
        return;
      }
      heldButtons.set(button, upOrDown === "down");
    }
    exports2.setButtonState = setButtonState;
    function isButtonDown(button) {
      var e_1, _a;
      if (button === types_1.MouseButton.ANY) {
        try {
          for (var heldButtons_1 = __values(heldButtons), heldButtons_1_1 = heldButtons_1.next(); !heldButtons_1_1.done; heldButtons_1_1 = heldButtons_1.next()) {
            var _b = __read(heldButtons_1_1.value, 2), _key = _b[0], isDown = _b[1];
            if (isDown) {
              return true;
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (heldButtons_1_1 && !heldButtons_1_1.done && (_a = heldButtons_1.return))
              _a.call(heldButtons_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return false;
      } else {
        return Boolean(heldButtons.get(button));
      }
    }
    exports2.isButtonDown = isButtonDown;
    function isButtonUp(button) {
      var e_2, _a;
      if (button === types_1.MouseButton.ANY) {
        try {
          for (var heldButtons_2 = __values(heldButtons), heldButtons_2_1 = heldButtons_2.next(); !heldButtons_2_1.done; heldButtons_2_1 = heldButtons_2.next()) {
            var _b = __read(heldButtons_2_1.value, 2), _key = _b[0], isDown = _b[1];
            if (!isDown) {
              return true;
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (heldButtons_2_1 && !heldButtons_2_1.done && (_a = heldButtons_2.return))
              _a.call(heldButtons_2);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        return false;
      } else {
        return !heldButtons.get(button);
      }
    }
    exports2.isButtonUp = isButtonUp;
    function getMouseButtonsState() {
      var left = Boolean(heldButtons.get(types_1.MouseButton.LEFT));
      var right = Boolean(heldButtons.get(types_1.MouseButton.RIGHT));
      var middle = Boolean(heldButtons.get(types_1.MouseButton.MIDDLE));
      var mouse4 = Boolean(heldButtons.get(types_1.MouseButton.MOUSE4));
      var mouse5 = Boolean(heldButtons.get(types_1.MouseButton.MOUSE5));
      return {
        left,
        right,
        middle,
        mouse4,
        mouse5
      };
    }
    exports2.getMouseButtonsState = getMouseButtonsState;
  }
});

// node_modules/suchibot/dist/input/mouse.js
var require_mouse = __commonJS({
  "node_modules/suchibot/dist/input/mouse.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Mouse = exports2.MouseEvent = exports2.isMouseEvent = void 0;
    var types_1 = require_types();
    var uiohook_napi_1 = require_dist();
    var mitt_1 = __importDefault((init_mitt(), __toCommonJS(mitt_exports)));
    var held_keys_1 = require_held_keys();
    var held_mouse_buttons_1 = require_held_mouse_buttons();
    var IS_MOUSE_EVENT = Symbol("IS_MOUSE_EVENT");
    function isMouseEvent(event) {
      return typeof event === "object" && event != null && event[IS_MOUSE_EVENT];
    }
    exports2.isMouseEvent = isMouseEvent;
    var MouseEvent2 = (
      /** @class */
      /* @__PURE__ */ function() {
        function MouseEvent3(type, button, x, y, modifierKeys, mouseButtons) {
          if (modifierKeys === void 0) {
            modifierKeys = (0, held_keys_1.getModifierKeysState)();
          }
          if (mouseButtons === void 0) {
            mouseButtons = (0, held_mouse_buttons_1.getMouseButtonsState)();
          }
          this.type = type;
          this.button = button;
          this.x = x;
          this.y = y;
          this.modifierKeys = modifierKeys;
          this.mouseButtons = mouseButtons;
          this[IS_MOUSE_EVENT] = true;
        }
        return MouseEvent3;
      }()
    );
    exports2.MouseEvent = MouseEvent2;
    var uioToMouseButtonMap = {
      1: types_1.MouseButton.LEFT,
      2: types_1.MouseButton.MIDDLE,
      3: types_1.MouseButton.RIGHT,
      4: types_1.MouseButton.MOUSE4,
      5: types_1.MouseButton.MOUSE5
    };
    function uioToMouseButton(uioButton) {
      return uioToMouseButtonMap[uioButton] || null;
    }
    var events = (0, mitt_1.default)();
    uiohook_napi_1.uIOhook.on("click", function(event) {
      var button = uioToMouseButton(event.button);
      if (!button) {
        console.warn("WARNING: received click for unsupported mouse button:", event.button);
        return;
      }
      (0, held_mouse_buttons_1.setButtonState)(button, "up");
      var newEvent = new MouseEvent2("click", button, event.x, event.y);
      events.emit("click", newEvent);
    });
    uiohook_napi_1.uIOhook.on("mousedown", function(event) {
      var button = uioToMouseButton(event.button);
      if (!button) {
        console.warn("WARNING: received mousedown for unsupported mouse button:", event.button);
        return;
      }
      (0, held_mouse_buttons_1.setButtonState)(button, "down");
      var newEvent = new MouseEvent2("down", button, event.x, event.y);
      events.emit("mousedown", newEvent);
    });
    uiohook_napi_1.uIOhook.on("mouseup", function(event) {
      var button = uioToMouseButton(event.button);
      if (!button) {
        console.warn("WARNING: received mouseup for unsupported mouse button:", event.button);
        return;
      }
      (0, held_mouse_buttons_1.setButtonState)(button, "up");
      var newEvent = new MouseEvent2("up", button, event.x, event.y);
      events.emit("mouseup", newEvent);
    });
    uiohook_napi_1.uIOhook.on("mousemove", function(event) {
      var newEvent = new MouseEvent2("move", null, event.x, event.y);
      events.emit("mousemove", newEvent);
    });
    exports2.Mouse = {
      onDown: function(button, eventHandler) {
        var callback = function(event) {
          if (String(event.button) === String(button) || String(button) === String(types_1.MouseButton.ANY)) {
            eventHandler(event);
          }
        };
        events.on("mousedown", callback);
        return {
          stop: function() {
            events.off("mousedown", callback);
          }
        };
      },
      onUp: function(button, eventHandler) {
        var callback = function(event) {
          if (String(event.button) === String(button) || String(button) === String(types_1.MouseButton.ANY)) {
            eventHandler(event);
          }
        };
        events.on("mouseup", callback);
        return {
          stop: function() {
            events.off("mouseup", callback);
          }
        };
      },
      onClick: function(button, eventHandler) {
        var callback = function(event) {
          if (String(event.button) === String(button) || String(button) === String(types_1.MouseButton.ANY)) {
            eventHandler(event);
          }
        };
        events.on("click", callback);
        return {
          stop: function() {
            events.off("click", callback);
          }
        };
      },
      onMove: function(eventHandler) {
        var callback = function(event) {
          eventHandler(event);
        };
        events.on("mousemove", callback);
        return {
          stop: function() {
            events.off("mousemove", callback);
          }
        };
      },
      isDown: function(button) {
        return (0, held_mouse_buttons_1.isButtonDown)(button);
      },
      isUp: function(button) {
        return (0, held_mouse_buttons_1.isButtonUp)(button);
      }
    };
  }
});

// node_modules/suchibot/dist/input/keyboard.js
var require_keyboard = __commonJS({
  "node_modules/suchibot/dist/input/keyboard.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Keyboard = exports2.KeyboardEvent = exports2.isKeyboardEvent = void 0;
    var types_1 = require_types();
    var uiohook_napi_1 = require_dist();
    var mitt_1 = __importDefault((init_mitt(), __toCommonJS(mitt_exports)));
    var held_keys_1 = require_held_keys();
    var held_mouse_buttons_1 = require_held_mouse_buttons();
    var IS_KEYBOARD_EVENT = Symbol("IS_KEYBOARD_EVENT");
    function isKeyboardEvent(event) {
      return typeof event === "object" && event != null && event[IS_KEYBOARD_EVENT];
    }
    exports2.isKeyboardEvent = isKeyboardEvent;
    var KeyboardEvent = (
      /** @class */
      /* @__PURE__ */ function() {
        function KeyboardEvent2(type, key, modifierKeys, mouseButtons) {
          if (modifierKeys === void 0) {
            modifierKeys = (0, held_keys_1.getModifierKeysState)();
          }
          if (mouseButtons === void 0) {
            mouseButtons = (0, held_mouse_buttons_1.getMouseButtonsState)();
          }
          this.type = type;
          this.key = key;
          this.modifierKeys = modifierKeys;
          this.mouseButtons = mouseButtons;
          this[IS_KEYBOARD_EVENT] = true;
        }
        return KeyboardEvent2;
      }()
    );
    exports2.KeyboardEvent = KeyboardEvent;
    var uioToKeyMap = (_a = {}, _a[uiohook_napi_1.UiohookKey.Tab] = types_1.Key.TAB, _a[uiohook_napi_1.UiohookKey.Enter] = types_1.Key.ENTER, _a[uiohook_napi_1.UiohookKey.CapsLock] = types_1.Key.CAPS_LOCK, _a[uiohook_napi_1.UiohookKey.Escape] = types_1.Key.ESCAPE, _a[uiohook_napi_1.UiohookKey.Space] = types_1.Key.SPACE, _a[uiohook_napi_1.UiohookKey.PageUp] = types_1.Key.PAGE_UP, _a[uiohook_napi_1.UiohookKey.PageDown] = types_1.Key.PAGE_DOWN, _a[uiohook_napi_1.UiohookKey.End] = types_1.Key.END, _a[uiohook_napi_1.UiohookKey.Home] = types_1.Key.HOME, _a[uiohook_napi_1.UiohookKey.ArrowLeft] = types_1.Key.LEFT, _a[uiohook_napi_1.UiohookKey.ArrowUp] = types_1.Key.UP, _a[uiohook_napi_1.UiohookKey.ArrowRight] = types_1.Key.RIGHT, _a[uiohook_napi_1.UiohookKey.ArrowDown] = types_1.Key.DOWN, _a[uiohook_napi_1.UiohookKey.Insert] = types_1.Key.INSERT, _a[uiohook_napi_1.UiohookKey.Delete] = types_1.Key.DELETE, _a[uiohook_napi_1.UiohookKey[0]] = types_1.Key.ZERO, _a[uiohook_napi_1.UiohookKey[1]] = types_1.Key.ONE, _a[uiohook_napi_1.UiohookKey[2]] = types_1.Key.TWO, _a[uiohook_napi_1.UiohookKey[3]] = types_1.Key.THREE, _a[uiohook_napi_1.UiohookKey[4]] = types_1.Key.FOUR, _a[uiohook_napi_1.UiohookKey[5]] = types_1.Key.FIVE, _a[uiohook_napi_1.UiohookKey[6]] = types_1.Key.SIX, _a[uiohook_napi_1.UiohookKey[7]] = types_1.Key.SEVEN, _a[uiohook_napi_1.UiohookKey[8]] = types_1.Key.EIGHT, _a[uiohook_napi_1.UiohookKey[9]] = types_1.Key.NINE, _a[uiohook_napi_1.UiohookKey.A] = types_1.Key.A, _a[uiohook_napi_1.UiohookKey.B] = types_1.Key.B, _a[uiohook_napi_1.UiohookKey.C] = types_1.Key.C, _a[uiohook_napi_1.UiohookKey.D] = types_1.Key.D, _a[uiohook_napi_1.UiohookKey.E] = types_1.Key.E, _a[uiohook_napi_1.UiohookKey.F] = types_1.Key.F, _a[uiohook_napi_1.UiohookKey.G] = types_1.Key.G, _a[uiohook_napi_1.UiohookKey.H] = types_1.Key.H, _a[uiohook_napi_1.UiohookKey.I] = types_1.Key.I, _a[uiohook_napi_1.UiohookKey.J] = types_1.Key.J, _a[uiohook_napi_1.UiohookKey.K] = types_1.Key.K, _a[uiohook_napi_1.UiohookKey.L] = types_1.Key.L, _a[uiohook_napi_1.UiohookKey.M] = types_1.Key.M, _a[uiohook_napi_1.UiohookKey.N] = types_1.Key.N, _a[uiohook_napi_1.UiohookKey.O] = types_1.Key.O, _a[uiohook_napi_1.UiohookKey.P] = types_1.Key.P, _a[uiohook_napi_1.UiohookKey.Q] = types_1.Key.Q, _a[uiohook_napi_1.UiohookKey.R] = types_1.Key.R, _a[uiohook_napi_1.UiohookKey.S] = types_1.Key.S, _a[uiohook_napi_1.UiohookKey.T] = types_1.Key.T, _a[uiohook_napi_1.UiohookKey.U] = types_1.Key.U, _a[uiohook_napi_1.UiohookKey.V] = types_1.Key.V, _a[uiohook_napi_1.UiohookKey.W] = types_1.Key.W, _a[uiohook_napi_1.UiohookKey.X] = types_1.Key.X, _a[uiohook_napi_1.UiohookKey.Y] = types_1.Key.Y, _a[uiohook_napi_1.UiohookKey.Z] = types_1.Key.Z, _a[uiohook_napi_1.UiohookKey.Numpad0] = types_1.Key.NUMPAD_0, _a[uiohook_napi_1.UiohookKey.Numpad1] = types_1.Key.NUMPAD_1, _a[uiohook_napi_1.UiohookKey.Numpad2] = types_1.Key.NUMPAD_2, _a[uiohook_napi_1.UiohookKey.Numpad3] = types_1.Key.NUMPAD_3, _a[uiohook_napi_1.UiohookKey.Numpad4] = types_1.Key.NUMPAD_4, _a[uiohook_napi_1.UiohookKey.Numpad5] = types_1.Key.NUMPAD_5, _a[uiohook_napi_1.UiohookKey.Numpad6] = types_1.Key.NUMPAD_6, _a[uiohook_napi_1.UiohookKey.Numpad7] = types_1.Key.NUMPAD_7, _a[uiohook_napi_1.UiohookKey.Numpad8] = types_1.Key.NUMPAD_8, _a[uiohook_napi_1.UiohookKey.Numpad9] = types_1.Key.NUMPAD_9, _a[uiohook_napi_1.UiohookKey.NumpadMultiply] = types_1.Key.NUMPAD_MULTIPLY, _a[uiohook_napi_1.UiohookKey.NumpadAdd] = types_1.Key.NUMPAD_ADD, _a[uiohook_napi_1.UiohookKey.NumpadSubtract] = types_1.Key.NUMPAD_SUBTRACT, _a[uiohook_napi_1.UiohookKey.NumpadDecimal] = types_1.Key.NUMPAD_DECIMAL, _a[3612] = types_1.Key.NUMPAD_ENTER, _a[uiohook_napi_1.UiohookKey.NumpadDivide] = types_1.Key.NUMPAD_DIVIDE, _a[uiohook_napi_1.UiohookKey.F1] = types_1.Key.F1, _a[uiohook_napi_1.UiohookKey.F2] = types_1.Key.F2, _a[uiohook_napi_1.UiohookKey.F3] = types_1.Key.F3, _a[uiohook_napi_1.UiohookKey.F4] = types_1.Key.F4, _a[uiohook_napi_1.UiohookKey.F5] = types_1.Key.F5, _a[uiohook_napi_1.UiohookKey.F6] = types_1.Key.F6, _a[uiohook_napi_1.UiohookKey.F7] = types_1.Key.F7, _a[uiohook_napi_1.UiohookKey.F8] = types_1.Key.F8, _a[uiohook_napi_1.UiohookKey.F9] = types_1.Key.F9, _a[uiohook_napi_1.UiohookKey.F10] = types_1.Key.F10, _a[uiohook_napi_1.UiohookKey.F11] = types_1.Key.F11, _a[uiohook_napi_1.UiohookKey.F12] = types_1.Key.F12, _a[uiohook_napi_1.UiohookKey.F13] = types_1.Key.F13, _a[uiohook_napi_1.UiohookKey.F14] = types_1.Key.F14, _a[uiohook_napi_1.UiohookKey.F15] = types_1.Key.F15, _a[uiohook_napi_1.UiohookKey.F16] = types_1.Key.F16, _a[uiohook_napi_1.UiohookKey.F17] = types_1.Key.F17, _a[uiohook_napi_1.UiohookKey.F18] = types_1.Key.F18, _a[uiohook_napi_1.UiohookKey.F19] = types_1.Key.F19, _a[uiohook_napi_1.UiohookKey.F20] = types_1.Key.F20, _a[uiohook_napi_1.UiohookKey.F21] = types_1.Key.F21, _a[uiohook_napi_1.UiohookKey.F22] = types_1.Key.F22, _a[uiohook_napi_1.UiohookKey.F23] = types_1.Key.F23, _a[uiohook_napi_1.UiohookKey.F24] = types_1.Key.F24, _a[uiohook_napi_1.UiohookKey.Semicolon] = types_1.Key.SEMICOLON, _a[uiohook_napi_1.UiohookKey.Equal] = types_1.Key.EQUAL, _a[uiohook_napi_1.UiohookKey.Comma] = types_1.Key.COMMA, _a[uiohook_napi_1.UiohookKey.Minus] = types_1.Key.MINUS, _a[uiohook_napi_1.UiohookKey.Period] = types_1.Key.PERIOD, _a[uiohook_napi_1.UiohookKey.Slash] = types_1.Key.SLASH, _a[uiohook_napi_1.UiohookKey.Backquote] = types_1.Key.BACKTICK, _a[uiohook_napi_1.UiohookKey.BracketLeft] = types_1.Key.LEFT_BRACKET, _a[uiohook_napi_1.UiohookKey.Backslash] = types_1.Key.BACKSLASH, _a[uiohook_napi_1.UiohookKey.BracketRight] = types_1.Key.RIGHT_BRACKET, _a[uiohook_napi_1.UiohookKey.Quote] = types_1.Key.QUOTE, _a[uiohook_napi_1.UiohookKey.Ctrl] = types_1.Key.LEFT_CONTROL, _a[uiohook_napi_1.UiohookKey.Alt] = types_1.Key.LEFT_ALT, _a[uiohook_napi_1.UiohookKey.Shift] = types_1.Key.LEFT_SHIFT, _a[70] = types_1.Key.SCROLL_LOCK, _a[3653] = types_1.Key.PAUSE_BREAK, _a[14] = types_1.Key.BACKSPACE, _a[69] = types_1.Key.NUM_LOCK, _a[54] = types_1.Key.RIGHT_SHIFT, _a[3613] = types_1.Key.RIGHT_CONTROL, _a[3640] = types_1.Key.RIGHT_ALT, _a[3675] = types_1.Key.LEFT_SUPER, _a[3676] = types_1.Key.RIGHT_SUPER, _a[57376] = types_1.Key.MUTE, _a[57390] = types_1.Key.VOLUME_DOWN, _a[57392] = types_1.Key.VOLUME_UP, _a);
    function uioToKey(uioKey) {
      return uioToKeyMap[uioKey] || null;
    }
    var events = (0, mitt_1.default)();
    uiohook_napi_1.uIOhook.on("keydown", function(event) {
      var key = uioToKey(event.keycode);
      if (!key) {
        console.warn("WARNING: received keydown for unsupported keycode:", event.keycode);
        return;
      }
      (0, held_keys_1.setKeyState)(key, "down");
      var newEvent = new KeyboardEvent("down", key);
      events.emit("keydown", newEvent);
    });
    uiohook_napi_1.uIOhook.on("keyup", function(event) {
      var key = uioToKey(event.keycode);
      if (!key) {
        console.warn("WARNING: received keyup for unsupported keycode:", event.keycode);
        return;
      }
      (0, held_keys_1.setKeyState)(key, "up");
      var newEvent = new KeyboardEvent("up", key);
      events.emit("keyup", newEvent);
    });
    exports2.Keyboard = {
      onDown: function(key, eventHandler) {
        var callback = function(event) {
          if (key === types_1.Key.ANY || event.key === key) {
            eventHandler(event);
          }
        };
        events.on("keydown", callback);
        return {
          stop: function() {
            events.off("keydown", callback);
          }
        };
      },
      onUp: function(key, eventHandler) {
        var callback = function(event) {
          if (key === types_1.Key.ANY || event.key === key) {
            eventHandler(event);
          }
        };
        events.on("keyup", callback);
        return {
          stop: function() {
            events.off("keyup", callback);
          }
        };
      },
      isDown: function(key) {
        return (0, held_keys_1.isKeyDown)(key);
      },
      isUp: function(key) {
        return (0, held_keys_1.isKeyUp)(key);
      }
    };
  }
});

// node_modules/suchibot/dist/input/index.js
var require_input = __commonJS({
  "node_modules/suchibot/dist/input/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stopListening = exports2.startListening = exports2.isKeyboardEvent = exports2.KeyboardEvent = exports2.Keyboard = exports2.isMouseEvent = exports2.MouseEvent = exports2.Mouse = void 0;
    var uiohook_napi_1 = require_dist();
    var mouse_1 = require_mouse();
    Object.defineProperty(exports2, "Mouse", { enumerable: true, get: function() {
      return mouse_1.Mouse;
    } });
    Object.defineProperty(exports2, "MouseEvent", { enumerable: true, get: function() {
      return mouse_1.MouseEvent;
    } });
    Object.defineProperty(exports2, "isMouseEvent", { enumerable: true, get: function() {
      return mouse_1.isMouseEvent;
    } });
    var keyboard_1 = require_keyboard();
    Object.defineProperty(exports2, "Keyboard", { enumerable: true, get: function() {
      return keyboard_1.Keyboard;
    } });
    Object.defineProperty(exports2, "KeyboardEvent", { enumerable: true, get: function() {
      return keyboard_1.KeyboardEvent;
    } });
    Object.defineProperty(exports2, "isKeyboardEvent", { enumerable: true, get: function() {
      return keyboard_1.isKeyboardEvent;
    } });
    function startListening() {
      uiohook_napi_1.uIOhook.start();
    }
    exports2.startListening = startListening;
    function stopListening() {
      uiohook_napi_1.uIOhook.stop();
    }
    exports2.stopListening = stopListening;
  }
});

// node_modules/file-uri-to-path/index.js
var require_file_uri_to_path = __commonJS({
  "node_modules/file-uri-to-path/index.js"(exports2, module2) {
    var sep = require("path").sep || "/";
    module2.exports = fileUriToPath;
    function fileUriToPath(uri) {
      if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
        throw new TypeError("must pass in a file:// URI to convert to a file path");
      }
      var rest = decodeURI(uri.substring(7));
      var firstSlash = rest.indexOf("/");
      var host = rest.substring(0, firstSlash);
      var path = rest.substring(firstSlash + 1);
      if ("localhost" == host)
        host = "";
      if (host) {
        host = sep + sep + host;
      }
      path = path.replace(/^(.+)\|/, "$1:");
      if (sep == "\\") {
        path = path.replace(/\//g, "\\");
      }
      if (/^.+\:/.test(path)) {
      } else {
        path = sep + path;
      }
      return host + path;
    }
  }
});

// node_modules/bindings/bindings.js
var require_bindings = __commonJS({
  "node_modules/bindings/bindings.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var fileURLToPath = require_file_uri_to_path();
    var join = path.join;
    var dirname = path.dirname;
    var exists = fs.accessSync && function(path2) {
      try {
        fs.accessSync(path2);
      } catch (e) {
        return false;
      }
      return true;
    } || fs.existsSync || path.existsSync;
    var defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " \u2192 ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts))
          opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports2.getRoot(exports2.getFileName());
      }
      if (path.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      var tries = [], i = 0, l = opts.try.length, n, b, err2;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p) {
            return opts[p] || p;
          })
        );
        tries.push(n);
        try {
          b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b.path = n;
          }
          return b;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err2 = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err2.tries = tries;
      throw err2;
    }
    module2.exports = exports2 = bindings;
    exports2.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath(fileName);
      }
      return fileName;
    };
    exports2.getRoot = function getRoot(file) {
      var dir = dirname(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  }
});

// node_modules/@nut-tree/libnut-win32/permissionCheck.js
var require_permissionCheck = __commonJS({
  "node_modules/@nut-tree/libnut-win32/permissionCheck.js"(exports2, module2) {
    var libnut = require_bindings()("libnut");
    var hasScreenRecordingPermission = false;
    var hasAccessibilityPermission = false;
    try {
      const permissions = require("@nut-tree/node-mac-permissions");
      const wrapWithWarning = (message, nativeFunction) => (...args) => {
        console.warn(message);
        return nativeFunction(...args);
      };
      const askForAccessibility = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasAccessibilityPermission) {
          return nativeFunction;
        }
        const accessibilityStatus = permissions.getAuthStatus("accessibility");
        if (accessibilityStatus === "authorized") {
          hasAccessibilityPermission = true;
          return nativeFunction;
        } else if (accessibilityStatus === "not determined" || accessibilityStatus === "denied") {
          permissions.askForAccessibilityAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to access accessibility features to execute ${functionName}! Please grant requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const askForScreenRecording = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasScreenRecordingPermission) {
          return nativeFunction;
        }
        const screenCaptureStatus = permissions.getAuthStatus("screen");
        if (screenCaptureStatus === "authorized") {
          hasScreenRecordingPermission = true;
          return nativeFunction;
        } else if (screenCaptureStatus === "not determined" || screenCaptureStatus === "denied") {
          permissions.askForScreenCaptureAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to screen recording features to execute ${functionName}! Please grant the requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const accessibilityAccess = [
        "dragMouse",
        "moveMouse",
        "getMousePos",
        "mouseClick",
        "mouseToggle",
        "scrollMouse",
        "keyTap",
        "keyToggle",
        "typeString",
        "getScreenSize",
        "highlight",
        "captureScreen",
        "getWindows",
        "getActiveWindow",
        "getWindowRect",
        "getWindowTitle",
        "focusWindow",
        "resizeWindow"
      ];
      const screenCaptureAccess = [
        "getWindowTitle",
        "captureScreen"
      ];
      for (const functionName of accessibilityAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForAccessibility(originalFunction, functionName)(...args);
      }
      for (const functionName of screenCaptureAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForScreenRecording(originalFunction, functionName)(...args);
      }
    } catch (e) {
      console.warn(`Encountered error establishing macOS permission checks:`, e.message);
      console.warn(`Returning original module.`);
      libnut = require_bindings()("libnut");
    } finally {
      module2.exports = libnut;
    }
  }
});

// node_modules/@nut-tree/libnut-win32/index.js
var require_libnut_win32 = __commonJS({
  "node_modules/@nut-tree/libnut-win32/index.js"(exports2, module2) {
    var libnut;
    if (process.platform === "darwin") {
      libnut = require_permissionCheck();
    } else {
      libnut = require_bindings()("libnut");
    }
    module2.exports = libnut;
    module2.exports.screen = {};
    function bitmap(width, height, byteWidth, bitsPerPixel, bytesPerPixel, image) {
      this.width = width;
      this.height = height;
      this.byteWidth = byteWidth;
      this.bitsPerPixel = bitsPerPixel;
      this.bytesPerPixel = bytesPerPixel;
      this.image = image;
    }
    module2.exports.screen.highlight = function(x, y, width, height, duration, opacity) {
      let highlightOpacity = opacity < 0 ? 0 : opacity;
      highlightOpacity = highlightOpacity > 1 ? 1 : highlightOpacity;
      const highlightDuration = duration < 0 ? 0 : duration;
      libnut.highlight(x, y, width, height, highlightDuration, highlightOpacity);
    };
    module2.exports.screen.capture = function(x, y, width, height) {
      let b;
      if (typeof x !== "undefined" && typeof y !== "undefined" && typeof width !== "undefined" && typeof height !== "undefined") {
        b = libnut.captureScreen(x, y, width, height);
      } else {
        b = libnut.captureScreen();
      }
      return new bitmap(
        b.width,
        b.height,
        b.byteWidth,
        b.bitsPerPixel,
        b.bytesPerPixel,
        b.image
      );
    };
  }
});

// node_modules/@nut-tree/libnut-linux/permissionCheck.js
var require_permissionCheck2 = __commonJS({
  "node_modules/@nut-tree/libnut-linux/permissionCheck.js"(exports2, module2) {
    var libnut = require_bindings()("libnut");
    var hasScreenRecordingPermission = false;
    var hasAccessibilityPermission = false;
    try {
      const permissions = require("@nut-tree/node-mac-permissions");
      const wrapWithWarning = (message, nativeFunction) => (...args) => {
        console.warn(message);
        return nativeFunction(...args);
      };
      const askForAccessibility = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasAccessibilityPermission) {
          return nativeFunction;
        }
        const accessibilityStatus = permissions.getAuthStatus("accessibility");
        if (accessibilityStatus === "authorized") {
          hasAccessibilityPermission = true;
          return nativeFunction;
        } else if (accessibilityStatus === "not determined" || accessibilityStatus === "denied") {
          permissions.askForAccessibilityAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to access accessibility features to execute ${functionName}! Please grant requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const askForScreenRecording = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasScreenRecordingPermission) {
          return nativeFunction;
        }
        const screenCaptureStatus = permissions.getAuthStatus("screen");
        if (screenCaptureStatus === "authorized") {
          hasScreenRecordingPermission = true;
          return nativeFunction;
        } else if (screenCaptureStatus === "not determined" || screenCaptureStatus === "denied") {
          permissions.askForScreenCaptureAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to screen recording features to execute ${functionName}! Please grant the requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const accessibilityAccess = [
        "dragMouse",
        "moveMouse",
        "getMousePos",
        "mouseClick",
        "mouseToggle",
        "scrollMouse",
        "keyTap",
        "keyToggle",
        "typeString",
        "getScreenSize",
        "highlight",
        "captureScreen",
        "getWindows",
        "getActiveWindow",
        "getWindowRect",
        "getWindowTitle",
        "focusWindow",
        "resizeWindow"
      ];
      const screenCaptureAccess = [
        "getWindowTitle",
        "captureScreen"
      ];
      for (const functionName of accessibilityAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForAccessibility(originalFunction, functionName)(...args);
      }
      for (const functionName of screenCaptureAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForScreenRecording(originalFunction, functionName)(...args);
      }
    } catch (e) {
      console.warn(`Encountered error establishing macOS permission checks:`, e.message);
      console.warn(`Returning original module.`);
      libnut = require_bindings()("libnut");
    } finally {
      module2.exports = libnut;
    }
  }
});

// node_modules/@nut-tree/libnut-linux/index.js
var require_libnut_linux = __commonJS({
  "node_modules/@nut-tree/libnut-linux/index.js"(exports2, module2) {
    var libnut;
    if (process.platform === "darwin") {
      libnut = require_permissionCheck2();
    } else {
      libnut = require_bindings()("libnut");
    }
    module2.exports = libnut;
    module2.exports.screen = {};
    function bitmap(width, height, byteWidth, bitsPerPixel, bytesPerPixel, image) {
      this.width = width;
      this.height = height;
      this.byteWidth = byteWidth;
      this.bitsPerPixel = bitsPerPixel;
      this.bytesPerPixel = bytesPerPixel;
      this.image = image;
    }
    module2.exports.screen.highlight = function(x, y, width, height, duration, opacity) {
      let highlightOpacity = opacity < 0 ? 0 : opacity;
      highlightOpacity = highlightOpacity > 1 ? 1 : highlightOpacity;
      const highlightDuration = duration < 0 ? 0 : duration;
      libnut.highlight(x, y, width, height, highlightDuration, highlightOpacity);
    };
    module2.exports.screen.capture = function(x, y, width, height) {
      let b;
      if (typeof x !== "undefined" && typeof y !== "undefined" && typeof width !== "undefined" && typeof height !== "undefined") {
        b = libnut.captureScreen(x, y, width, height);
      } else {
        b = libnut.captureScreen();
      }
      return new bitmap(
        b.width,
        b.height,
        b.byteWidth,
        b.bitsPerPixel,
        b.bytesPerPixel,
        b.image
      );
    };
  }
});

// node_modules/@nut-tree/libnut-darwin/permissionCheck.js
var require_permissionCheck3 = __commonJS({
  "node_modules/@nut-tree/libnut-darwin/permissionCheck.js"(exports2, module2) {
    var libnut = require_bindings()("libnut");
    var hasScreenRecordingPermission = false;
    var hasAccessibilityPermission = false;
    try {
      const permissions = require("@nut-tree/node-mac-permissions");
      const wrapWithWarning = (message, nativeFunction) => (...args) => {
        console.warn(message);
        return nativeFunction(...args);
      };
      const askForAccessibility = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasAccessibilityPermission) {
          return nativeFunction;
        }
        const accessibilityStatus = permissions.getAuthStatus("accessibility");
        if (accessibilityStatus === "authorized") {
          hasAccessibilityPermission = true;
          return nativeFunction;
        } else if (accessibilityStatus === "not determined" || accessibilityStatus === "denied") {
          permissions.askForAccessibilityAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to access accessibility features to execute ${functionName}! Please grant requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const askForScreenRecording = (nativeFunction, functionName) => {
        if (process.platform !== "darwin" || hasScreenRecordingPermission) {
          return nativeFunction;
        }
        const screenCaptureStatus = permissions.getAuthStatus("screen");
        if (screenCaptureStatus === "authorized") {
          hasScreenRecordingPermission = true;
          return nativeFunction;
        } else if (screenCaptureStatus === "not determined" || screenCaptureStatus === "denied") {
          permissions.askForScreenCaptureAccess();
          return wrapWithWarning(`##### WARNING! The application running this script tries to screen recording features to execute ${functionName}! Please grant the requested access and visit https://github.com/nut-tree/nut.js#macos for further information. #####`, nativeFunction);
        }
      };
      const accessibilityAccess = [
        "dragMouse",
        "moveMouse",
        "getMousePos",
        "mouseClick",
        "mouseToggle",
        "scrollMouse",
        "keyTap",
        "keyToggle",
        "typeString",
        "getScreenSize",
        "highlight",
        "captureScreen",
        "getWindows",
        "getActiveWindow",
        "getWindowRect",
        "getWindowTitle",
        "focusWindow",
        "resizeWindow"
      ];
      const screenCaptureAccess = [
        "getWindowTitle",
        "captureScreen"
      ];
      for (const functionName of accessibilityAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForAccessibility(originalFunction, functionName)(...args);
      }
      for (const functionName of screenCaptureAccess) {
        const originalFunction = libnut[functionName];
        libnut[functionName] = (...args) => askForScreenRecording(originalFunction, functionName)(...args);
      }
    } catch (e) {
      console.warn(`Encountered error establishing macOS permission checks:`, e.message);
      console.warn(`Returning original module.`);
      libnut = require_bindings()("libnut");
    } finally {
      module2.exports = libnut;
    }
  }
});

// node_modules/@nut-tree/libnut-darwin/index.js
var require_libnut_darwin = __commonJS({
  "node_modules/@nut-tree/libnut-darwin/index.js"(exports2, module2) {
    var libnut;
    if (process.platform === "darwin") {
      libnut = require_permissionCheck3();
    } else {
      libnut = require_bindings()("libnut");
    }
    module2.exports = libnut;
    module2.exports.screen = {};
    function bitmap(width, height, byteWidth, bitsPerPixel, bytesPerPixel, image) {
      this.width = width;
      this.height = height;
      this.byteWidth = byteWidth;
      this.bitsPerPixel = bitsPerPixel;
      this.bytesPerPixel = bytesPerPixel;
      this.image = image;
    }
    module2.exports.screen.highlight = function(x, y, width, height, duration, opacity) {
      let highlightOpacity = opacity < 0 ? 0 : opacity;
      highlightOpacity = highlightOpacity > 1 ? 1 : highlightOpacity;
      const highlightDuration = duration < 0 ? 0 : duration;
      libnut.highlight(x, y, width, height, highlightDuration, highlightOpacity);
    };
    module2.exports.screen.capture = function(x, y, width, height) {
      let b;
      if (typeof x !== "undefined" && typeof y !== "undefined" && typeof width !== "undefined" && typeof height !== "undefined") {
        b = libnut.captureScreen(x, y, width, height);
      } else {
        b = libnut.captureScreen();
      }
      return new bitmap(
        b.width,
        b.height,
        b.byteWidth,
        b.bitsPerPixel,
        b.bytesPerPixel,
        b.image
      );
    };
  }
});

// node_modules/@nut-tree/libnut/index.js
var require_libnut = __commonJS({
  "node_modules/@nut-tree/libnut/index.js"(exports2, module2) {
    var libnut = (() => {
      switch (process.platform) {
        case "win32":
          return require_libnut_win32();
        case "linux":
          return require_libnut_linux();
        case "darwin":
          return require_libnut_darwin();
      }
    })();
    module2.exports = libnut;
  }
});

// node_modules/a-mimir/index.js
var require_a_mimir = __commonJS({
  "node_modules/a-mimir/index.js"(exports2, module2) {
    var sleep2 = {
      sync: function sleepSync(milliseconds) {
        var sab = new SharedArrayBuffer(4);
        var view = new Int32Array(sab);
        Atomics.wait(view, 0, 0, milliseconds);
      },
      async: function(milliseconds) {
        return new Promise(function(resolve) {
          setTimeout(resolve, milliseconds);
        });
      }
    };
    module2.exports = { sleep: sleep2 };
  }
});

// node_modules/suchibot/dist/output/keyboard.js
var require_keyboard2 = __commonJS({
  "node_modules/suchibot/dist/output/keyboard.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Keyboard = void 0;
    var types_1 = require_types();
    var libnut = __importStar(require_libnut());
    var a_mimir_1 = require_a_mimir();
    var keyToNutMap = {
      BACKSPACE: "backspace",
      DELETE: "delete",
      ENTER: "enter",
      TAB: "tab",
      ESCAPE: "escape",
      UP: "up",
      DOWN: "down",
      RIGHT: "right",
      LEFT: "left",
      HOME: "home",
      END: "end",
      PAGE_UP: "pageup",
      PAGE_DOWN: "pagedown",
      F1: "f1",
      F2: "f2",
      F3: "f3",
      F4: "f4",
      F5: "f5",
      F6: "f6",
      F7: "f7",
      F8: "f8",
      F9: "f9",
      F10: "f10",
      F11: "f11",
      F12: "f12",
      F13: "f13",
      F14: "f14",
      F15: "f15",
      F16: "f16",
      F17: "f17",
      F18: "f18",
      F19: "f19",
      F20: "f20",
      F21: "f21",
      F22: "f22",
      F23: "f23",
      F24: "f24",
      LEFT_ALT: "alt",
      RIGHT_ALT: "alt",
      LEFT_CONTROL: "control",
      RIGHT_CONTROL: "control",
      LEFT_SHIFT: "shift",
      RIGHT_SHIFT: "space",
      SPACE: "space",
      PRINT_SCREEN: "printscreen",
      INSERT: "insert",
      VOLUME_DOWN: "audio_vol_down",
      VOLUME_UP: "audio_vol_up",
      MUTE: "audio_mute",
      NUMPAD_0: "numpad_0",
      NUMPAD_1: "numpad_1",
      NUMPAD_2: "numpad_2",
      NUMPAD_3: "numpad_3",
      NUMPAD_4: "numpad_4",
      NUMPAD_5: "numpad_5",
      NUMPAD_6: "numpad_6",
      NUMPAD_7: "numpad_7",
      NUMPAD_8: "numpad_8",
      NUMPAD_9: "numpad_9",
      A: "a",
      B: "b",
      C: "c",
      D: "d",
      E: "e",
      F: "f",
      G: "g",
      H: "h",
      I: "i",
      J: "j",
      K: "k",
      L: "l",
      M: "m",
      N: "n",
      O: "o",
      P: "p",
      Q: "q",
      R: "r",
      S: "s",
      T: "t",
      U: "u",
      V: "v",
      W: "w",
      X: "x",
      Y: "y",
      Z: "z",
      ZERO: "0",
      ONE: "1",
      TWO: "2",
      THREE: "3",
      FOUR: "4",
      FIVE: "5",
      SIX: "6",
      SEVEN: "7",
      EIGHT: "8",
      NINE: "9",
      ANY: null,
      CAPS_LOCK: null,
      NUMPAD_MULTIPLY: null,
      NUMPAD_ADD: null,
      NUMPAD_SUBTRACT: null,
      NUMPAD_DECIMAL: null,
      NUMPAD_DIVIDE: null,
      NUMPAD_ENTER: "enter",
      SEMICOLON: ";",
      EQUAL: "=",
      COMMA: ",",
      MINUS: "-",
      PERIOD: ".",
      SLASH: "/",
      BACKTICK: "~",
      LEFT_BRACKET: "[",
      BACKSLASH: "\\",
      RIGHT_BRACKET: "]",
      QUOTE: "'",
      SCROLL_LOCK: null,
      PAUSE_BREAK: null,
      NUM_LOCK: null,
      LEFT_COMMAND: "command",
      LEFT_WINDOWS: "command",
      LEFT_SUPER: "command",
      LEFT_META: "command",
      RIGHT_COMMAND: "command",
      RIGHT_WINDOWS: "command",
      RIGHT_SUPER: "command",
      RIGHT_META: "command"
    };
    function keyToNut(key) {
      if (key === types_1.Key.ANY) {
        throw new Error(`The "ANY" key is for input listeners only; it can't be pressed/released`);
      }
      var result = keyToNutMap[key];
      if (result == null) {
        throw new Error("Pressing/releasing key is not yet supported: " + key);
      }
      return result;
    }
    exports2.Keyboard = {
      tap: function(key) {
        var nutKey = keyToNut(key);
        libnut.keyToggle(nutKey, "down");
        a_mimir_1.sleep.sync(10);
        libnut.keyToggle(nutKey, "up");
      },
      hold: function(key) {
        var nutKey = keyToNut(key);
        libnut.keyToggle(nutKey, "down");
      },
      release: function(key) {
        var nutKey = keyToNut(key);
        libnut.keyToggle(nutKey, "up");
      },
      type: function(textToType, delayBetweenKeyPresses) {
        if (delayBetweenKeyPresses === void 0) {
          delayBetweenKeyPresses = 10;
        }
        textToType.split("").forEach(function(char, index, all) {
          libnut.typeString(char);
          if (index != all.length - 1) {
            a_mimir_1.sleep.sync(delayBetweenKeyPresses);
          }
        });
      }
    };
  }
});

// node_modules/suchibot/dist/output/mouse.js
var require_mouse2 = __commonJS({
  "node_modules/suchibot/dist/output/mouse.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Mouse = void 0;
    var types_1 = require_types();
    var libnut = __importStar(require_libnut());
    var a_mimir_1 = require_a_mimir();
    var mouseButtonToNutMap = {
      LEFT: "left",
      RIGHT: "right",
      MIDDLE: "middle",
      MOUSE4: null,
      MOUSE5: null,
      ANY: null
    };
    function mouseButtonToNut(button) {
      if (button === types_1.MouseButton.ANY) {
        throw new Error(`The "ANY" mouse button is for input listeners only; it can't be pressed/released`);
      }
      var result = mouseButtonToNutMap[button];
      if (result == null) {
        throw new Error("Pressing/releasing the following mouse button is not yet supported: " + button);
      }
      return result;
    }
    exports2.Mouse = {
      moveTo: function(x, y) {
        libnut.moveMouse(x, y);
      },
      click: function(button) {
        if (button === void 0) {
          button = types_1.MouseButton.LEFT;
        }
        var nutButton = mouseButtonToNut(button);
        libnut.mouseToggle("down", nutButton);
        a_mimir_1.sleep.sync(4);
        libnut.mouseToggle("up", nutButton);
      },
      doubleClick: function(button) {
        if (button === void 0) {
          button = types_1.MouseButton.LEFT;
        }
        var nutButton = mouseButtonToNut(button);
        libnut.mouseToggle("down", nutButton);
        a_mimir_1.sleep.sync(4);
        libnut.mouseToggle("up", nutButton);
        a_mimir_1.sleep.sync(4);
        libnut.mouseToggle("down", nutButton);
        a_mimir_1.sleep.sync(4);
        libnut.mouseToggle("up", nutButton);
      },
      hold: function(button) {
        if (button === void 0) {
          button = types_1.MouseButton.LEFT;
        }
        var nutButton = mouseButtonToNut(button);
        libnut.mouseToggle("down", nutButton);
      },
      release: function(button) {
        if (button === void 0) {
          button = types_1.MouseButton.LEFT;
        }
        var nutButton = mouseButtonToNut(button);
        libnut.mouseToggle("up", nutButton);
      },
      getPosition: function() {
        return libnut.getMousePos();
      },
      scroll: function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.x, x = _c === void 0 ? 0 : _c, _d = _b.y, y = _d === void 0 ? 0 : _d;
        libnut.scrollMouse(x, y);
      }
    };
  }
});

// node_modules/suchibot/dist/output/index.js
var require_output = __commonJS({
  "node_modules/suchibot/dist/output/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Mouse = exports2.Keyboard = void 0;
    var keyboard_1 = require_keyboard2();
    Object.defineProperty(exports2, "Keyboard", { enumerable: true, get: function() {
      return keyboard_1.Keyboard;
    } });
    var mouse_1 = require_mouse2();
    Object.defineProperty(exports2, "Mouse", { enumerable: true, get: function() {
      return mouse_1.Mouse;
    } });
  }
});

// node_modules/suchibot/dist/recording/event-filters.js
var require_event_filters = __commonJS({
  "node_modules/suchibot/dist/recording/event-filters.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.eventMatchesFilter = exports2.keyboardEventFilter = exports2.mouseEventFilter = void 0;
    var input_1 = require_input();
    var types_1 = require_types();
    function mouseEventFilter(criteria) {
      if (criteria === void 0) {
        criteria = {};
      }
      return __assign({ filterType: "Mouse" }, criteria);
    }
    exports2.mouseEventFilter = mouseEventFilter;
    function keyboardEventFilter(criteria) {
      if (criteria === void 0) {
        criteria = {};
      }
      return __assign({ filterType: "Keyboard" }, criteria);
    }
    exports2.keyboardEventFilter = keyboardEventFilter;
    function mouseEventMatchesFilter(event, filter) {
      var doesMatch = true;
      if (filter.type != null) {
        doesMatch = doesMatch && filter.type === event.type;
      }
      if (filter.button != null && filter.button !== types_1.MouseButton.ANY) {
        doesMatch = doesMatch && filter.button === event.button;
      }
      if (filter.x != null) {
        doesMatch = doesMatch && filter.x === event.x;
      }
      if (filter.y != null) {
        doesMatch = doesMatch && filter.y === event.y;
      }
      return doesMatch;
    }
    function keyboardEventMatchesFilter(event, filter) {
      var doesMatch = true;
      if (filter.type != null) {
        doesMatch = doesMatch && filter.type === event.type;
      }
      if (filter.key != null && filter.key !== types_1.Key.ANY) {
        doesMatch = doesMatch && filter.key === event.key;
      }
      if (doesMatch && filter.modifierKeys != null) {
        for (var key in filter.modifierKeys) {
          if (Object.prototype.hasOwnProperty.call(filter.modifierKeys, key)) {
            doesMatch = doesMatch && event.modifierKeys[key] === filter.modifierKeys[key];
            if (!doesMatch) {
              break;
            }
          }
        }
      }
      return doesMatch;
    }
    function eventMatchesFilter(event, filter) {
      if ((0, input_1.isMouseEvent)(event) && filter.filterType === "Mouse") {
        return mouseEventMatchesFilter(event, filter);
      } else if ((0, input_1.isKeyboardEvent)(event) && filter.filterType === "Keyboard") {
        return keyboardEventMatchesFilter(event, filter);
      } else {
        return false;
      }
    }
    exports2.eventMatchesFilter = eventMatchesFilter;
  }
});

// node_modules/suchibot/dist/recording/tape-data.js
var require_tape_data = __commonJS({
  "node_modules/suchibot/dist/recording/tape-data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TapeData = void 0;
    var input_1 = require_input();
    var TapeData = (
      /** @class */
      function() {
        function TapeData2(actions) {
          this.actions = actions;
        }
        Object.defineProperty(TapeData2.prototype, "length", {
          get: function() {
            var actions = this.actions;
            if (actions.length > 0) {
              var lastAction = actions[actions.length - 1];
              return lastAction.time;
            } else {
              return 0;
            }
          },
          enumerable: false,
          configurable: true
        });
        TapeData2.deserialize = function(data) {
          var actions = data.actions.map(function(serializedAction) {
            var time = serializedAction.time, event = serializedAction.event;
            return {
              time,
              event: event.$kind === "MouseEvent" ? new input_1.MouseEvent(event.type, event.button, event.x, event.y) : new input_1.KeyboardEvent(event.type, event.key)
            };
          });
          return new TapeData2(actions);
        };
        TapeData2.prototype.serialize = function() {
          return {
            $kind: "TapeData",
            actions: this.actions.map(function(action) {
              var time = action.time, event = action.event;
              return {
                $kind: "RecordedAction",
                time,
                event: (0, input_1.isMouseEvent)(event) ? {
                  $kind: "MouseEvent",
                  type: event.type,
                  button: event.button,
                  x: event.x,
                  y: event.y
                } : {
                  $kind: "KeyboardEvent",
                  type: event.type,
                  key: event.key
                }
              };
            })
          };
        };
        return TapeData2;
      }()
    );
    exports2.TapeData = TapeData;
  }
});

// node_modules/kleur/index.js
var require_kleur = __commonJS({
  "node_modules/kleur/index.js"(exports2, module2) {
    "use strict";
    var FORCE_COLOR;
    var NODE_DISABLE_COLORS;
    var NO_COLOR;
    var TERM;
    var isTTY = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
      isTTY = process.stdout && process.stdout.isTTY;
    }
    var $ = {
      enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY),
      // modifiers
      reset: init(0, 0),
      bold: init(1, 22),
      dim: init(2, 22),
      italic: init(3, 23),
      underline: init(4, 24),
      inverse: init(7, 27),
      hidden: init(8, 28),
      strikethrough: init(9, 29),
      // colors
      black: init(30, 39),
      red: init(31, 39),
      green: init(32, 39),
      yellow: init(33, 39),
      blue: init(34, 39),
      magenta: init(35, 39),
      cyan: init(36, 39),
      white: init(37, 39),
      gray: init(90, 39),
      grey: init(90, 39),
      // background colors
      bgBlack: init(40, 49),
      bgRed: init(41, 49),
      bgGreen: init(42, 49),
      bgYellow: init(43, 49),
      bgBlue: init(44, 49),
      bgMagenta: init(45, 49),
      bgCyan: init(46, 49),
      bgWhite: init(47, 49)
    };
    function run(arr, str) {
      let i = 0, tmp, beg = "", end = "";
      for (; i < arr.length; i++) {
        tmp = arr[i];
        beg += tmp.open;
        end += tmp.close;
        if (!!~str.indexOf(tmp.close)) {
          str = str.replace(tmp.rgx, tmp.close + tmp.open);
        }
      }
      return beg + str + end;
    }
    function chain(has, keys) {
      let ctx = { has, keys };
      ctx.reset = $.reset.bind(ctx);
      ctx.bold = $.bold.bind(ctx);
      ctx.dim = $.dim.bind(ctx);
      ctx.italic = $.italic.bind(ctx);
      ctx.underline = $.underline.bind(ctx);
      ctx.inverse = $.inverse.bind(ctx);
      ctx.hidden = $.hidden.bind(ctx);
      ctx.strikethrough = $.strikethrough.bind(ctx);
      ctx.black = $.black.bind(ctx);
      ctx.red = $.red.bind(ctx);
      ctx.green = $.green.bind(ctx);
      ctx.yellow = $.yellow.bind(ctx);
      ctx.blue = $.blue.bind(ctx);
      ctx.magenta = $.magenta.bind(ctx);
      ctx.cyan = $.cyan.bind(ctx);
      ctx.white = $.white.bind(ctx);
      ctx.gray = $.gray.bind(ctx);
      ctx.grey = $.grey.bind(ctx);
      ctx.bgBlack = $.bgBlack.bind(ctx);
      ctx.bgRed = $.bgRed.bind(ctx);
      ctx.bgGreen = $.bgGreen.bind(ctx);
      ctx.bgYellow = $.bgYellow.bind(ctx);
      ctx.bgBlue = $.bgBlue.bind(ctx);
      ctx.bgMagenta = $.bgMagenta.bind(ctx);
      ctx.bgCyan = $.bgCyan.bind(ctx);
      ctx.bgWhite = $.bgWhite.bind(ctx);
      return ctx;
    }
    function init(open, close) {
      let blk = {
        open: `\x1B[${open}m`,
        close: `\x1B[${close}m`,
        rgx: new RegExp(`\\x1b\\[${close}m`, "g")
      };
      return function(txt) {
        if (this !== void 0 && this.has !== void 0) {
          !!~this.has.indexOf(open) || (this.has.push(open), this.keys.push(blk));
          return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
        }
        return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
      };
    }
    module2.exports = $;
  }
});

// node_modules/@suchipi/defer/defer.js
var require_defer = __commonJS({
  "node_modules/@suchipi/defer/defer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Defer = class {
      constructor() {
        this.promise = new Promise((res, rej) => {
          this.resolve = res;
          this.reject = rej;
        });
      }
    };
    exports2.default = Defer;
  }
});

// node_modules/@suchipi/defer/index.js
var require_defer2 = __commonJS({
  "node_modules/@suchipi/defer/index.js"(exports2, module2) {
    var Defer = require_defer().default;
    module2.exports = Defer;
  }
});

// node_modules/pretty-print-error/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/pretty-print-error/dist/index.js"(exports, module) {
    (function(global) {
      function factory() {
        var modules = {
          /* --- src/index.ts --- */
          "src/index.ts": function(exports, _kame_require_, module, __filename, __dirname, _kame_dynamic_import_) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
              value: true
            });
            exports.formatError = formatError;
            function _typeof(obj) {
              "@babel/helpers - typeof";
              return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
                return typeof obj2;
              } : function(obj2) {
                return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              }, _typeof(obj);
            }
            var isNode = false;
            try {
              isNode = process.argv0 != null;
            } catch (err2) {
            }
            var fakeKleur = {
              red: function red(value) {
                return value;
              },
              gray: function gray(value) {
                return value;
              },
              magenta: function magenta(value) {
                return value;
              }
            };
            var autoDetectedKleur = fakeKleur;
            if (isNode) {
              autoDetectedKleur = eval("require")("kleur");
            }
            function formatError(err) {
              var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$color = _ref.color, color = _ref$color === void 0 ? true : _ref$color, _ref$lineFilter = _ref.lineFilter, lineFilter = _ref$lineFilter === void 0 ? function(line) {
                return !/\(node:/.test(line);
              } : _ref$lineFilter;
              var kleur = color ? autoDetectedKleur : fakeKleur;
              var prettyErr = String(err);
              if (_typeof(err) === "object" && err != null && // @ts-ignore
              typeof err.name === "string" && // @ts-ignore
              typeof err.message === "string" && // @ts-ignore
              typeof err.stack === "string") {
                var error = err;
                prettyErr = kleur.red(error.name) + ": " + error.message.replace(new RegExp("^".concat(error.name, "[: ]*")), "") + "\n" + (error.stack || "").split("\n").map(function(line) {
                  return line.trim();
                }).filter(lineFilter).map(function(line) {
                  if (line.startsWith(error.name + ": " + error.message))
                    return null;
                  if (line.startsWith("at")) {
                    return "  " + kleur.gray(line);
                  }
                  return line;
                }).filter(Boolean).join("\n");
              }
              if (_typeof(err) === "object" && err != null) {
                var propNames = Object.getOwnPropertyNames(err).filter(function(name) {
                  return name !== "stack" && name !== "message";
                });
                if (propNames.length > 0) {
                  var props = {};
                  propNames.forEach(function(name) {
                    props[name] = err[name];
                  });
                  var propertiesString;
                  if (isNode) {
                    var util = eval("require")("util");
                    propertiesString = util.inspect(props, {
                      depth: Infinity,
                      colors: color
                    });
                  } else {
                    try {
                      propertiesString = JSON.stringify(props);
                    } catch (err2) {
                      propertiesString = ["{", "  the properties object couldn't be converted to JSON :(", "", "  the error that happened while stringifying it was:", formatError(err2).split("\n").map(function(line) {
                        return "  " + line;
                      }).join("\n"), "}"].join("\n");
                    }
                  }
                  prettyErr += kleur.magenta("\nThe above error also had these properties on it:\n") + propertiesString;
                }
              }
              return prettyErr;
            }
          }
          /* --- end of modules --- */
        };
        var __kame__ = {
          basedir: typeof __dirname === "string" ? __dirname : "",
          cache: {},
          runModule: function runModule(name, isMain) {
            var exports2 = {};
            var module2 = {
              id: name,
              exports: exports2
            };
            __kame__.cache[name] = module2;
            var _kame_require_2 = function require2(id) {
              if (__kame__.cache[id]) {
                return __kame__.cache[id].exports;
              } else {
                __kame__.runModule(id, false);
                return __kame__.cache[id].exports;
              }
            };
            _kame_require_2.cache = __kame__.cache;
            if (isMain) {
              _kame_require_2.main = module2;
            }
            var __filename2 = __kame__.basedir + "/" + name;
            var __dirname2 = __kame__.basedir + "/" + name.split("/").slice(0, -1).join("/");
            __kame__.modules[name](exports2, _kame_require_2, module2, __filename2, __dirname2);
            return module2.exports;
          },
          modules
        };
        return __kame__.runModule("src/index.ts", true);
      }
      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define([], factory);
      } else {
        global["PrettyPrintError"] = factory();
      }
    })(
      typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof exports === "object" ? exports : new Function("return this")()
    );
  }
});

// node_modules/suchibot/dist/recording/tape-player.js
var require_tape_player = __commonJS({
  "node_modules/suchibot/dist/recording/tape-player.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __values = exports2 && exports2.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var _a;
    var _b;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TapePlayer = void 0;
    var kleur_1 = __importDefault(require_kleur());
    var defer_1 = __importDefault(require_defer2());
    var pretty_print_error_1 = require_dist2();
    var input = __importStar(require_input());
    var output = __importStar(require_output());
    var DATA = Symbol("DATA");
    var IS_PLAYING = Symbol("IS_PLAYING");
    var TIMEOUTS = Symbol("TIMEOUTS");
    var PLAYBACK_DEFER = Symbol("PLAYBACK_DEFER");
    var TapePlayer = (
      /** @class */
      function() {
        function TapePlayer2(data) {
          this[_a] = false;
          this[_b] = null;
          this[DATA] = data;
          this[TIMEOUTS] = /* @__PURE__ */ new Set();
        }
        Object.defineProperty(TapePlayer2.prototype, "isPlaying", {
          get: function() {
            return this[IS_PLAYING];
          },
          enumerable: false,
          configurable: true
        });
        TapePlayer2.prototype.play = function() {
          var e_1, _c;
          var _this = this;
          if (this[IS_PLAYING]) {
            throw new Error("Attempted to play a tape that was already playing. This is disallowed.");
          }
          var _loop_1 = function(action2) {
            var event_1 = action2.event, time = action2.time;
            var timeout = setTimeout(function() {
              try {
                _this[TIMEOUTS].delete(timeout);
                if (input.isMouseEvent(event_1)) {
                  switch (event_1.type) {
                    case "click": {
                      break;
                    }
                    case "down": {
                      output.Mouse.hold(event_1.button);
                      break;
                    }
                    case "up": {
                      output.Mouse.release(event_1.button);
                      break;
                    }
                    case "move": {
                      output.Mouse.moveTo(event_1.x, event_1.y);
                      break;
                    }
                  }
                } else if (input.isKeyboardEvent(event_1)) {
                  switch (event_1.type) {
                    case "down": {
                      output.Keyboard.hold(event_1.key);
                      break;
                    }
                    case "up": {
                      output.Keyboard.release(event_1.key);
                      break;
                    }
                  }
                }
              } catch (err2) {
                console.log(kleur_1.default.yellow("An error was thrown while playing back a recorded action:"));
                console.log((0, pretty_print_error_1.formatError)(err2));
                console.log(kleur_1.default.yellow("Playback of future recorded actions will continue despite the error."));
              }
            }, time);
            this_1[TIMEOUTS].add(timeout);
          };
          var this_1 = this;
          try {
            for (var _d = __values(this[DATA].actions), _e = _d.next(); !_e.done; _e = _d.next()) {
              var action = _e.value;
              _loop_1(action);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_e && !_e.done && (_c = _d.return))
                _c.call(_d);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          this[IS_PLAYING] = true;
          var defer = new defer_1.default();
          this[PLAYBACK_DEFER] = defer;
          var afterSleep = function() {
            _this[IS_PLAYING] = false;
            _this[TIMEOUTS] = /* @__PURE__ */ new Set();
          };
          var timeToSleep = (this[DATA].length || 0) + 2;
          var sleepTimeout = setTimeout(defer.resolve, timeToSleep);
          this[TIMEOUTS].add(sleepTimeout);
          return defer.promise.then(afterSleep, afterSleep);
        };
        TapePlayer2.prototype.stop = function() {
          var e_2, _c;
          if (!this[IS_PLAYING]) {
            throw new Error("Attempted to stop playing a tape that wasn't being played. This isn't allowed.");
          }
          try {
            for (var _d = __values(this[TIMEOUTS]), _e = _d.next(); !_e.done; _e = _d.next()) {
              var timeout = _e.value;
              clearTimeout(timeout);
              this[TIMEOUTS].delete(timeout);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_e && !_e.done && (_c = _d.return))
                _c.call(_d);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
          var defer = this[PLAYBACK_DEFER];
          if (defer != null) {
            defer.reject(new Error("Playback cancelled by `stop` call"));
            this[PLAYBACK_DEFER] = null;
          }
          this[IS_PLAYING] = false;
        };
        return TapePlayer2;
      }()
    );
    exports2.TapePlayer = TapePlayer;
    _a = IS_PLAYING, _b = PLAYBACK_DEFER;
  }
});

// node_modules/suchibot/dist/recording/tape-recorder.js
var require_tape_recorder = __commonJS({
  "node_modules/suchibot/dist/recording/tape-recorder.js"(exports2) {
    "use strict";
    var __values = exports2 && exports2.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var _a;
    var _b;
    var _c;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TapeRecorder = void 0;
    var input_1 = require_input();
    var event_filters_1 = require_event_filters();
    var types_1 = require_types();
    var DATA = Symbol("DATA");
    var RECORDING_STARTED_AT = Symbol("RECORDING_STARTED_AT");
    var EVENTS_TO_IGNORE = Symbol("EVENTS_TO_IGNORE");
    var IS_RECORDING = Symbol("IS_RECORDING");
    var PUSH_EVENT = Symbol("PUSH_EVENT");
    var LISTENERS = Symbol("LISTENERS");
    var STOP_LISTENING = Symbol("STOP_LISTENING");
    var TapeRecorder = (
      /** @class */
      function() {
        function TapeRecorder2(data, eventsToIgnore) {
          this[_a] = false;
          this[_b] = -1;
          this[_c] = [];
          this[DATA] = data;
          this[EVENTS_TO_IGNORE] = eventsToIgnore;
        }
        Object.defineProperty(TapeRecorder2.prototype, "isRecording", {
          get: function() {
            return this[IS_RECORDING];
          },
          enumerable: false,
          configurable: true
        });
        TapeRecorder2.prototype.start = function() {
          if (this[IS_RECORDING]) {
            throw new Error("Attempted to start a tape recorder that was already recording. This isn't allowed.");
          }
          this[RECORDING_STARTED_AT] = Date.now();
          var boundPushEvent = this[PUSH_EVENT].bind(this);
          this[LISTENERS] = [
            input_1.Mouse.onClick(types_1.MouseButton.ANY, boundPushEvent),
            input_1.Mouse.onDown(types_1.MouseButton.ANY, boundPushEvent),
            input_1.Mouse.onUp(types_1.MouseButton.ANY, boundPushEvent),
            input_1.Mouse.onMove(boundPushEvent),
            input_1.Keyboard.onDown(types_1.Key.ANY, boundPushEvent),
            input_1.Keyboard.onUp(types_1.Key.ANY, boundPushEvent)
          ];
          this[IS_RECORDING] = true;
        };
        TapeRecorder2.prototype[_a = IS_RECORDING, _b = RECORDING_STARTED_AT, _c = LISTENERS, PUSH_EVENT] = function(event) {
          var e_1, _d;
          var now = Date.now();
          var shouldPush = true;
          try {
            for (var _e = __values(this[EVENTS_TO_IGNORE]), _f = _e.next(); !_f.done; _f = _e.next()) {
              var filter = _f.value;
              shouldPush = shouldPush && !(0, event_filters_1.eventMatchesFilter)(event, filter);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_f && !_f.done && (_d = _e.return))
                _d.call(_e);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          if (shouldPush) {
            this[DATA].actions.push({
              event,
              time: now - this[RECORDING_STARTED_AT]
            });
          }
        };
        TapeRecorder2.prototype[STOP_LISTENING] = function() {
          var e_2, _d;
          try {
            for (var _e = __values(this[LISTENERS]), _f = _e.next(); !_f.done; _f = _e.next()) {
              var listener = _f.value;
              listener.stop();
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_f && !_f.done && (_d = _e.return))
                _d.call(_e);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
          this[LISTENERS] = [];
        };
        TapeRecorder2.prototype.finish = function() {
          if (!this[IS_RECORDING]) {
            throw new Error("Attempted to stop a tape recorder that was already stopped. This isn't allowed.");
          }
          this[STOP_LISTENING]();
          this[IS_RECORDING] = false;
        };
        return TapeRecorder2;
      }()
    );
    exports2.TapeRecorder = TapeRecorder;
  }
});

// node_modules/suchibot/dist/recording/tape.js
var require_tape = __commonJS({
  "node_modules/suchibot/dist/recording/tape.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Tape = void 0;
    var tape_data_1 = require_tape_data();
    var tape_player_1 = require_tape_player();
    var tape_recorder_1 = require_tape_recorder();
    var DATA = Symbol("DATA");
    var CURRENT_STATE = Symbol("CURRENT_STATE");
    var EVENTS_TO_IGNORE = Symbol("EVENTS_TO_IGNORE");
    var RECORDER = Symbol("RECORDER");
    var PLAYER = Symbol("PLAYER");
    var TapeState = {
      RECORDING: "RECORDING",
      PLAYING: "PLAYING",
      IDLE: "IDLE"
    };
    var Tape = (
      /** @class */
      function() {
        function Tape2(eventsToIgnore, data) {
          if (eventsToIgnore === void 0) {
            eventsToIgnore = [];
          }
          if (data === void 0) {
            data = new tape_data_1.TapeData([]);
          }
          this[_a] = TapeState.IDLE;
          this[DATA] = data;
          this[EVENTS_TO_IGNORE] = eventsToIgnore;
          this[RECORDER] = new tape_recorder_1.TapeRecorder(data, eventsToIgnore);
          this[PLAYER] = new tape_player_1.TapePlayer(data);
        }
        Object.defineProperty(Tape2.prototype, "state", {
          get: function() {
            return this[CURRENT_STATE];
          },
          enumerable: false,
          configurable: true
        });
        Tape2.prototype.record = function() {
          if (this[CURRENT_STATE] === TapeState.RECORDING) {
            throw new Error("Attempted to record to a tape that was already being recorded to. This isn't allowed.");
          }
          if (this[CURRENT_STATE] === TapeState.PLAYING) {
            throw new Error("Attempted to record to a tape that was being played. This isn't allowed.");
          }
          this[RECORDER].start();
          this[CURRENT_STATE] = TapeState.RECORDING;
        };
        Tape2.prototype.stopRecording = function() {
          if (this[CURRENT_STATE] !== TapeState.RECORDING) {
            throw new Error("Attempted to stop recording a tape that wasn't being recorded to. This isn't allowed.");
          }
          this[RECORDER].finish();
          this[CURRENT_STATE] = TapeState.IDLE;
        };
        Tape2.prototype.play = function() {
          var _this = this;
          if (this[CURRENT_STATE] === TapeState.PLAYING) {
            throw new Error("Attempted to play a tape that was already being played. This isn't allowed.");
          }
          if (this[CURRENT_STATE] === TapeState.RECORDING) {
            throw new Error("Attempted to play a tape that was being recorded to. This isn't allowed.");
          }
          var promise = this[PLAYER].play();
          this[CURRENT_STATE] = TapeState.PLAYING;
          promise.then(function() {
            _this[CURRENT_STATE] = TapeState.IDLE;
          });
          return promise;
        };
        Tape2.prototype.stopPlaying = function() {
          if (this[CURRENT_STATE] !== TapeState.PLAYING) {
            throw new Error("Attempted to stop playing a tape that wasn't being played. This isn't allowed.");
          }
          this[PLAYER].stop();
          this[CURRENT_STATE] = TapeState.IDLE;
        };
        Tape2.prototype.serialize = function() {
          return {
            $kind: "Tape",
            eventsToIgnore: this[EVENTS_TO_IGNORE],
            data: this[DATA].serialize()
          };
        };
        Tape2.deserialize = function(serialized) {
          return new Tape2(serialized.eventsToIgnore, tape_data_1.TapeData.deserialize(serialized.data));
        };
        var _a;
        _a = CURRENT_STATE;
        Tape2.State = TapeState;
        return Tape2;
      }()
    );
    exports2.Tape = Tape;
  }
});

// node_modules/suchibot/dist/recording/index.js
var require_recording = __commonJS({
  "node_modules/suchibot/dist/recording/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Tape = exports2.mouseEventFilter = exports2.keyboardEventFilter = exports2.eventMatchesFilter = void 0;
    var event_filters_1 = require_event_filters();
    Object.defineProperty(exports2, "eventMatchesFilter", { enumerable: true, get: function() {
      return event_filters_1.eventMatchesFilter;
    } });
    Object.defineProperty(exports2, "keyboardEventFilter", { enumerable: true, get: function() {
      return event_filters_1.keyboardEventFilter;
    } });
    Object.defineProperty(exports2, "mouseEventFilter", { enumerable: true, get: function() {
      return event_filters_1.mouseEventFilter;
    } });
    var tape_1 = require_tape();
    Object.defineProperty(exports2, "Tape", { enumerable: true, get: function() {
      return tape_1.Tape;
    } });
  }
});

// node_modules/suchibot/dist/screen.js
var require_screen = __commonJS({
  "node_modules/suchibot/dist/screen.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Screen = void 0;
    var libnut = __importStar(require_libnut());
    exports2.Screen = {
      getSize: function() {
        return libnut.getScreenSize();
      }
    };
  }
});

// node_modules/suchibot/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/suchibot/dist/index.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Tape = exports2.mouseEventFilter = exports2.keyboardEventFilter = exports2.eventMatchesFilter = exports2.stopListening = exports2.startListening = exports2.Screen = exports2.sleepSync = exports2.sleep = exports2.isMouseEvent = exports2.isKeyboardEvent = exports2.KeyboardEvent = exports2.MouseEvent = exports2.Key = exports2.MouseButton = exports2.Keyboard = exports2.Mouse = void 0;
    var input = __importStar(require_input());
    var output = __importStar(require_output());
    var types_1 = require_types();
    Object.defineProperty(exports2, "Key", { enumerable: true, get: function() {
      return types_1.Key;
    } });
    Object.defineProperty(exports2, "MouseButton", { enumerable: true, get: function() {
      return types_1.MouseButton;
    } });
    var input_1 = require_input();
    Object.defineProperty(exports2, "MouseEvent", { enumerable: true, get: function() {
      return input_1.MouseEvent;
    } });
    Object.defineProperty(exports2, "KeyboardEvent", { enumerable: true, get: function() {
      return input_1.KeyboardEvent;
    } });
    Object.defineProperty(exports2, "isKeyboardEvent", { enumerable: true, get: function() {
      return input_1.isKeyboardEvent;
    } });
    Object.defineProperty(exports2, "isMouseEvent", { enumerable: true, get: function() {
      return input_1.isMouseEvent;
    } });
    Object.defineProperty(exports2, "startListening", { enumerable: true, get: function() {
      return input_1.startListening;
    } });
    Object.defineProperty(exports2, "stopListening", { enumerable: true, get: function() {
      return input_1.stopListening;
    } });
    var recording_1 = require_recording();
    Object.defineProperty(exports2, "Tape", { enumerable: true, get: function() {
      return recording_1.Tape;
    } });
    Object.defineProperty(exports2, "eventMatchesFilter", { enumerable: true, get: function() {
      return recording_1.eventMatchesFilter;
    } });
    Object.defineProperty(exports2, "keyboardEventFilter", { enumerable: true, get: function() {
      return recording_1.keyboardEventFilter;
    } });
    Object.defineProperty(exports2, "mouseEventFilter", { enumerable: true, get: function() {
      return recording_1.mouseEventFilter;
    } });
    var screen_1 = require_screen();
    Object.defineProperty(exports2, "Screen", { enumerable: true, get: function() {
      return screen_1.Screen;
    } });
    var Mouse3 = __assign(__assign({}, output.Mouse), input.Mouse);
    exports2.Mouse = Mouse3;
    var Keyboard2 = __assign(__assign({}, output.Keyboard), input.Keyboard);
    exports2.Keyboard = Keyboard2;
    var a_mimir_1 = require_a_mimir();
    var sleep2 = Object.assign(function(milliseconds) {
      return a_mimir_1.sleep.async(milliseconds);
    }, a_mimir_1.sleep);
    exports2.sleep = sleep2;
    var sleepSync = a_mimir_1.sleep.sync;
    exports2.sleepSync = sleepSync;
  }
});

// node_modules/esbuild/lib/main.js
var require_main = __commonJS({
  "node_modules/esbuild/lib/main.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var node_exports = {};
    __export2(node_exports, {
      analyzeMetafile: () => analyzeMetafile,
      analyzeMetafileSync: () => analyzeMetafileSync,
      build: () => build,
      buildSync: () => buildSync,
      context: () => context,
      default: () => node_default,
      formatMessages: () => formatMessages,
      formatMessagesSync: () => formatMessagesSync,
      initialize: () => initialize,
      stop: () => stop,
      transform: () => transform,
      transformSync: () => transformSync,
      version: () => version
    });
    module2.exports = __toCommonJS2(node_exports);
    function encodePacket(packet) {
      let visit = (value) => {
        if (value === null) {
          bb.write8(0);
        } else if (typeof value === "boolean") {
          bb.write8(1);
          bb.write8(+value);
        } else if (typeof value === "number") {
          bb.write8(2);
          bb.write32(value | 0);
        } else if (typeof value === "string") {
          bb.write8(3);
          bb.write(encodeUTF8(value));
        } else if (value instanceof Uint8Array) {
          bb.write8(4);
          bb.write(value);
        } else if (value instanceof Array) {
          bb.write8(5);
          bb.write32(value.length);
          for (let item of value) {
            visit(item);
          }
        } else {
          let keys = Object.keys(value);
          bb.write8(6);
          bb.write32(keys.length);
          for (let key of keys) {
            bb.write(encodeUTF8(key));
            visit(value[key]);
          }
        }
      };
      let bb = new ByteBuffer();
      bb.write32(0);
      bb.write32(packet.id << 1 | +!packet.isRequest);
      visit(packet.value);
      writeUInt32LE(bb.buf, bb.len - 4, 0);
      return bb.buf.subarray(0, bb.len);
    }
    function decodePacket(bytes) {
      let visit = () => {
        switch (bb.read8()) {
          case 0:
            return null;
          case 1:
            return !!bb.read8();
          case 2:
            return bb.read32();
          case 3:
            return decodeUTF8(bb.read());
          case 4:
            return bb.read();
          case 5: {
            let count = bb.read32();
            let value2 = [];
            for (let i = 0; i < count; i++) {
              value2.push(visit());
            }
            return value2;
          }
          case 6: {
            let count = bb.read32();
            let value2 = {};
            for (let i = 0; i < count; i++) {
              value2[decodeUTF8(bb.read())] = visit();
            }
            return value2;
          }
          default:
            throw new Error("Invalid packet");
        }
      };
      let bb = new ByteBuffer(bytes);
      let id = bb.read32();
      let isRequest = (id & 1) === 0;
      id >>>= 1;
      let value = visit();
      if (bb.ptr !== bytes.length) {
        throw new Error("Invalid packet");
      }
      return { id, isRequest, value };
    }
    var ByteBuffer = class {
      constructor(buf = new Uint8Array(1024)) {
        this.buf = buf;
        this.len = 0;
        this.ptr = 0;
      }
      _write(delta) {
        if (this.len + delta > this.buf.length) {
          let clone = new Uint8Array((this.len + delta) * 2);
          clone.set(this.buf);
          this.buf = clone;
        }
        this.len += delta;
        return this.len - delta;
      }
      write8(value) {
        let offset = this._write(1);
        this.buf[offset] = value;
      }
      write32(value) {
        let offset = this._write(4);
        writeUInt32LE(this.buf, value, offset);
      }
      write(bytes) {
        let offset = this._write(4 + bytes.length);
        writeUInt32LE(this.buf, bytes.length, offset);
        this.buf.set(bytes, offset + 4);
      }
      _read(delta) {
        if (this.ptr + delta > this.buf.length) {
          throw new Error("Invalid packet");
        }
        this.ptr += delta;
        return this.ptr - delta;
      }
      read8() {
        return this.buf[this._read(1)];
      }
      read32() {
        return readUInt32LE(this.buf, this._read(4));
      }
      read() {
        let length = this.read32();
        let bytes = new Uint8Array(length);
        let ptr = this._read(bytes.length);
        bytes.set(this.buf.subarray(ptr, ptr + length));
        return bytes;
      }
    };
    var encodeUTF8;
    var decodeUTF8;
    var encodeInvariant;
    if (typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined") {
      let encoder = new TextEncoder();
      let decoder = new TextDecoder();
      encodeUTF8 = (text) => encoder.encode(text);
      decodeUTF8 = (bytes) => decoder.decode(bytes);
      encodeInvariant = 'new TextEncoder().encode("")';
    } else if (typeof Buffer !== "undefined") {
      encodeUTF8 = (text) => Buffer.from(text);
      decodeUTF8 = (bytes) => {
        let { buffer, byteOffset, byteLength } = bytes;
        return Buffer.from(buffer, byteOffset, byteLength).toString();
      };
      encodeInvariant = 'Buffer.from("")';
    } else {
      throw new Error("No UTF-8 codec found");
    }
    if (!(encodeUTF8("") instanceof Uint8Array))
      throw new Error(`Invariant violation: "${encodeInvariant} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);
    function readUInt32LE(buffer, offset) {
      return buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
    }
    function writeUInt32LE(buffer, value, offset) {
      buffer[offset++] = value;
      buffer[offset++] = value >> 8;
      buffer[offset++] = value >> 16;
      buffer[offset++] = value >> 24;
    }
    var quote = JSON.stringify;
    var buildLogLevelDefault = "warning";
    var transformLogLevelDefault = "silent";
    function validateTarget(target) {
      validateStringValue(target, "target");
      if (target.indexOf(",") >= 0)
        throw new Error(`Invalid target: ${target}`);
      return target;
    }
    var canBeAnything = () => null;
    var mustBeBoolean = (value) => typeof value === "boolean" ? null : "a boolean";
    var mustBeString = (value) => typeof value === "string" ? null : "a string";
    var mustBeRegExp = (value) => value instanceof RegExp ? null : "a RegExp object";
    var mustBeInteger = (value) => typeof value === "number" && value === (value | 0) ? null : "an integer";
    var mustBeFunction = (value) => typeof value === "function" ? null : "a function";
    var mustBeArray = (value) => Array.isArray(value) ? null : "an array";
    var mustBeObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? null : "an object";
    var mustBeEntryPoints = (value) => typeof value === "object" && value !== null ? null : "an array or an object";
    var mustBeWebAssemblyModule = (value) => value instanceof WebAssembly.Module ? null : "a WebAssembly.Module";
    var mustBeObjectOrNull = (value) => typeof value === "object" && !Array.isArray(value) ? null : "an object or null";
    var mustBeStringOrBoolean = (value) => typeof value === "string" || typeof value === "boolean" ? null : "a string or a boolean";
    var mustBeStringOrObject = (value) => typeof value === "string" || typeof value === "object" && value !== null && !Array.isArray(value) ? null : "a string or an object";
    var mustBeStringOrArray = (value) => typeof value === "string" || Array.isArray(value) ? null : "a string or an array";
    var mustBeStringOrUint8Array = (value) => typeof value === "string" || value instanceof Uint8Array ? null : "a string or a Uint8Array";
    var mustBeStringOrURL = (value) => typeof value === "string" || value instanceof URL ? null : "a string or a URL";
    function getFlag(object, keys, key, mustBeFn) {
      let value = object[key];
      keys[key + ""] = true;
      if (value === void 0)
        return void 0;
      let mustBe = mustBeFn(value);
      if (mustBe !== null)
        throw new Error(`${quote(key)} must be ${mustBe}`);
      return value;
    }
    function checkForInvalidFlags(object, keys, where) {
      for (let key in object) {
        if (!(key in keys)) {
          throw new Error(`Invalid option ${where}: ${quote(key)}`);
        }
      }
    }
    function validateInitializeOptions(options) {
      let keys = /* @__PURE__ */ Object.create(null);
      let wasmURL = getFlag(options, keys, "wasmURL", mustBeStringOrURL);
      let wasmModule = getFlag(options, keys, "wasmModule", mustBeWebAssemblyModule);
      let worker = getFlag(options, keys, "worker", mustBeBoolean);
      checkForInvalidFlags(options, keys, "in initialize() call");
      return {
        wasmURL,
        wasmModule,
        worker
      };
    }
    function validateMangleCache(mangleCache) {
      let validated;
      if (mangleCache !== void 0) {
        validated = /* @__PURE__ */ Object.create(null);
        for (let key in mangleCache) {
          let value = mangleCache[key];
          if (typeof value === "string" || value === false) {
            validated[key] = value;
          } else {
            throw new Error(`Expected ${quote(key)} in mangle cache to map to either a string or false`);
          }
        }
      }
      return validated;
    }
    function pushLogFlags(flags, options, keys, isTTY2, logLevelDefault) {
      let color2 = getFlag(options, keys, "color", mustBeBoolean);
      let logLevel = getFlag(options, keys, "logLevel", mustBeString);
      let logLimit = getFlag(options, keys, "logLimit", mustBeInteger);
      if (color2 !== void 0)
        flags.push(`--color=${color2}`);
      else if (isTTY2)
        flags.push(`--color=true`);
      flags.push(`--log-level=${logLevel || logLevelDefault}`);
      flags.push(`--log-limit=${logLimit || 0}`);
    }
    function validateStringValue(value, what, key) {
      if (typeof value !== "string") {
        throw new Error(`Expected value for ${what}${key !== void 0 ? " " + quote(key) : ""} to be a string, got ${typeof value} instead`);
      }
      return value;
    }
    function pushCommonFlags(flags, options, keys) {
      let legalComments = getFlag(options, keys, "legalComments", mustBeString);
      let sourceRoot = getFlag(options, keys, "sourceRoot", mustBeString);
      let sourcesContent = getFlag(options, keys, "sourcesContent", mustBeBoolean);
      let target = getFlag(options, keys, "target", mustBeStringOrArray);
      let format = getFlag(options, keys, "format", mustBeString);
      let globalName = getFlag(options, keys, "globalName", mustBeString);
      let mangleProps = getFlag(options, keys, "mangleProps", mustBeRegExp);
      let reserveProps = getFlag(options, keys, "reserveProps", mustBeRegExp);
      let mangleQuoted = getFlag(options, keys, "mangleQuoted", mustBeBoolean);
      let minify = getFlag(options, keys, "minify", mustBeBoolean);
      let minifySyntax = getFlag(options, keys, "minifySyntax", mustBeBoolean);
      let minifyWhitespace = getFlag(options, keys, "minifyWhitespace", mustBeBoolean);
      let minifyIdentifiers = getFlag(options, keys, "minifyIdentifiers", mustBeBoolean);
      let lineLimit = getFlag(options, keys, "lineLimit", mustBeInteger);
      let drop = getFlag(options, keys, "drop", mustBeArray);
      let dropLabels = getFlag(options, keys, "dropLabels", mustBeArray);
      let charset = getFlag(options, keys, "charset", mustBeString);
      let treeShaking = getFlag(options, keys, "treeShaking", mustBeBoolean);
      let ignoreAnnotations = getFlag(options, keys, "ignoreAnnotations", mustBeBoolean);
      let jsx = getFlag(options, keys, "jsx", mustBeString);
      let jsxFactory = getFlag(options, keys, "jsxFactory", mustBeString);
      let jsxFragment = getFlag(options, keys, "jsxFragment", mustBeString);
      let jsxImportSource = getFlag(options, keys, "jsxImportSource", mustBeString);
      let jsxDev = getFlag(options, keys, "jsxDev", mustBeBoolean);
      let jsxSideEffects = getFlag(options, keys, "jsxSideEffects", mustBeBoolean);
      let define2 = getFlag(options, keys, "define", mustBeObject);
      let logOverride = getFlag(options, keys, "logOverride", mustBeObject);
      let supported = getFlag(options, keys, "supported", mustBeObject);
      let pure = getFlag(options, keys, "pure", mustBeArray);
      let keepNames = getFlag(options, keys, "keepNames", mustBeBoolean);
      let platform = getFlag(options, keys, "platform", mustBeString);
      let tsconfigRaw = getFlag(options, keys, "tsconfigRaw", mustBeStringOrObject);
      if (legalComments)
        flags.push(`--legal-comments=${legalComments}`);
      if (sourceRoot !== void 0)
        flags.push(`--source-root=${sourceRoot}`);
      if (sourcesContent !== void 0)
        flags.push(`--sources-content=${sourcesContent}`);
      if (target) {
        if (Array.isArray(target))
          flags.push(`--target=${Array.from(target).map(validateTarget).join(",")}`);
        else
          flags.push(`--target=${validateTarget(target)}`);
      }
      if (format)
        flags.push(`--format=${format}`);
      if (globalName)
        flags.push(`--global-name=${globalName}`);
      if (platform)
        flags.push(`--platform=${platform}`);
      if (tsconfigRaw)
        flags.push(`--tsconfig-raw=${typeof tsconfigRaw === "string" ? tsconfigRaw : JSON.stringify(tsconfigRaw)}`);
      if (minify)
        flags.push("--minify");
      if (minifySyntax)
        flags.push("--minify-syntax");
      if (minifyWhitespace)
        flags.push("--minify-whitespace");
      if (minifyIdentifiers)
        flags.push("--minify-identifiers");
      if (lineLimit)
        flags.push(`--line-limit=${lineLimit}`);
      if (charset)
        flags.push(`--charset=${charset}`);
      if (treeShaking !== void 0)
        flags.push(`--tree-shaking=${treeShaking}`);
      if (ignoreAnnotations)
        flags.push(`--ignore-annotations`);
      if (drop)
        for (let what of drop)
          flags.push(`--drop:${validateStringValue(what, "drop")}`);
      if (dropLabels)
        flags.push(`--drop-labels=${Array.from(dropLabels).map((what) => validateStringValue(what, "dropLabels")).join(",")}`);
      if (mangleProps)
        flags.push(`--mangle-props=${mangleProps.source}`);
      if (reserveProps)
        flags.push(`--reserve-props=${reserveProps.source}`);
      if (mangleQuoted !== void 0)
        flags.push(`--mangle-quoted=${mangleQuoted}`);
      if (jsx)
        flags.push(`--jsx=${jsx}`);
      if (jsxFactory)
        flags.push(`--jsx-factory=${jsxFactory}`);
      if (jsxFragment)
        flags.push(`--jsx-fragment=${jsxFragment}`);
      if (jsxImportSource)
        flags.push(`--jsx-import-source=${jsxImportSource}`);
      if (jsxDev)
        flags.push(`--jsx-dev`);
      if (jsxSideEffects)
        flags.push(`--jsx-side-effects`);
      if (define2) {
        for (let key in define2) {
          if (key.indexOf("=") >= 0)
            throw new Error(`Invalid define: ${key}`);
          flags.push(`--define:${key}=${validateStringValue(define2[key], "define", key)}`);
        }
      }
      if (logOverride) {
        for (let key in logOverride) {
          if (key.indexOf("=") >= 0)
            throw new Error(`Invalid log override: ${key}`);
          flags.push(`--log-override:${key}=${validateStringValue(logOverride[key], "log override", key)}`);
        }
      }
      if (supported) {
        for (let key in supported) {
          if (key.indexOf("=") >= 0)
            throw new Error(`Invalid supported: ${key}`);
          const value = supported[key];
          if (typeof value !== "boolean")
            throw new Error(`Expected value for supported ${quote(key)} to be a boolean, got ${typeof value} instead`);
          flags.push(`--supported:${key}=${value}`);
        }
      }
      if (pure)
        for (let fn of pure)
          flags.push(`--pure:${validateStringValue(fn, "pure")}`);
      if (keepNames)
        flags.push(`--keep-names`);
    }
    function flagsForBuildOptions(callName, options, isTTY2, logLevelDefault, writeDefault) {
      var _a2;
      let flags = [];
      let entries = [];
      let keys = /* @__PURE__ */ Object.create(null);
      let stdinContents = null;
      let stdinResolveDir = null;
      pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
      pushCommonFlags(flags, options, keys);
      let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
      let bundle = getFlag(options, keys, "bundle", mustBeBoolean);
      let splitting = getFlag(options, keys, "splitting", mustBeBoolean);
      let preserveSymlinks = getFlag(options, keys, "preserveSymlinks", mustBeBoolean);
      let metafile = getFlag(options, keys, "metafile", mustBeBoolean);
      let outfile = getFlag(options, keys, "outfile", mustBeString);
      let outdir = getFlag(options, keys, "outdir", mustBeString);
      let outbase = getFlag(options, keys, "outbase", mustBeString);
      let tsconfig = getFlag(options, keys, "tsconfig", mustBeString);
      let resolveExtensions = getFlag(options, keys, "resolveExtensions", mustBeArray);
      let nodePathsInput = getFlag(options, keys, "nodePaths", mustBeArray);
      let mainFields = getFlag(options, keys, "mainFields", mustBeArray);
      let conditions = getFlag(options, keys, "conditions", mustBeArray);
      let external = getFlag(options, keys, "external", mustBeArray);
      let packages = getFlag(options, keys, "packages", mustBeString);
      let alias = getFlag(options, keys, "alias", mustBeObject);
      let loader = getFlag(options, keys, "loader", mustBeObject);
      let outExtension = getFlag(options, keys, "outExtension", mustBeObject);
      let publicPath = getFlag(options, keys, "publicPath", mustBeString);
      let entryNames = getFlag(options, keys, "entryNames", mustBeString);
      let chunkNames = getFlag(options, keys, "chunkNames", mustBeString);
      let assetNames = getFlag(options, keys, "assetNames", mustBeString);
      let inject = getFlag(options, keys, "inject", mustBeArray);
      let banner = getFlag(options, keys, "banner", mustBeObject);
      let footer = getFlag(options, keys, "footer", mustBeObject);
      let entryPoints = getFlag(options, keys, "entryPoints", mustBeEntryPoints);
      let absWorkingDir = getFlag(options, keys, "absWorkingDir", mustBeString);
      let stdin = getFlag(options, keys, "stdin", mustBeObject);
      let write = (_a2 = getFlag(options, keys, "write", mustBeBoolean)) != null ? _a2 : writeDefault;
      let allowOverwrite = getFlag(options, keys, "allowOverwrite", mustBeBoolean);
      let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
      keys.plugins = true;
      checkForInvalidFlags(options, keys, `in ${callName}() call`);
      if (sourcemap)
        flags.push(`--sourcemap${sourcemap === true ? "" : `=${sourcemap}`}`);
      if (bundle)
        flags.push("--bundle");
      if (allowOverwrite)
        flags.push("--allow-overwrite");
      if (splitting)
        flags.push("--splitting");
      if (preserveSymlinks)
        flags.push("--preserve-symlinks");
      if (metafile)
        flags.push(`--metafile`);
      if (outfile)
        flags.push(`--outfile=${outfile}`);
      if (outdir)
        flags.push(`--outdir=${outdir}`);
      if (outbase)
        flags.push(`--outbase=${outbase}`);
      if (tsconfig)
        flags.push(`--tsconfig=${tsconfig}`);
      if (packages)
        flags.push(`--packages=${packages}`);
      if (resolveExtensions) {
        let values = [];
        for (let value of resolveExtensions) {
          validateStringValue(value, "resolve extension");
          if (value.indexOf(",") >= 0)
            throw new Error(`Invalid resolve extension: ${value}`);
          values.push(value);
        }
        flags.push(`--resolve-extensions=${values.join(",")}`);
      }
      if (publicPath)
        flags.push(`--public-path=${publicPath}`);
      if (entryNames)
        flags.push(`--entry-names=${entryNames}`);
      if (chunkNames)
        flags.push(`--chunk-names=${chunkNames}`);
      if (assetNames)
        flags.push(`--asset-names=${assetNames}`);
      if (mainFields) {
        let values = [];
        for (let value of mainFields) {
          validateStringValue(value, "main field");
          if (value.indexOf(",") >= 0)
            throw new Error(`Invalid main field: ${value}`);
          values.push(value);
        }
        flags.push(`--main-fields=${values.join(",")}`);
      }
      if (conditions) {
        let values = [];
        for (let value of conditions) {
          validateStringValue(value, "condition");
          if (value.indexOf(",") >= 0)
            throw new Error(`Invalid condition: ${value}`);
          values.push(value);
        }
        flags.push(`--conditions=${values.join(",")}`);
      }
      if (external)
        for (let name of external)
          flags.push(`--external:${validateStringValue(name, "external")}`);
      if (alias) {
        for (let old in alias) {
          if (old.indexOf("=") >= 0)
            throw new Error(`Invalid package name in alias: ${old}`);
          flags.push(`--alias:${old}=${validateStringValue(alias[old], "alias", old)}`);
        }
      }
      if (banner) {
        for (let type in banner) {
          if (type.indexOf("=") >= 0)
            throw new Error(`Invalid banner file type: ${type}`);
          flags.push(`--banner:${type}=${validateStringValue(banner[type], "banner", type)}`);
        }
      }
      if (footer) {
        for (let type in footer) {
          if (type.indexOf("=") >= 0)
            throw new Error(`Invalid footer file type: ${type}`);
          flags.push(`--footer:${type}=${validateStringValue(footer[type], "footer", type)}`);
        }
      }
      if (inject)
        for (let path3 of inject)
          flags.push(`--inject:${validateStringValue(path3, "inject")}`);
      if (loader) {
        for (let ext in loader) {
          if (ext.indexOf("=") >= 0)
            throw new Error(`Invalid loader extension: ${ext}`);
          flags.push(`--loader:${ext}=${validateStringValue(loader[ext], "loader", ext)}`);
        }
      }
      if (outExtension) {
        for (let ext in outExtension) {
          if (ext.indexOf("=") >= 0)
            throw new Error(`Invalid out extension: ${ext}`);
          flags.push(`--out-extension:${ext}=${validateStringValue(outExtension[ext], "out extension", ext)}`);
        }
      }
      if (entryPoints) {
        if (Array.isArray(entryPoints)) {
          for (let i = 0, n = entryPoints.length; i < n; i++) {
            let entryPoint = entryPoints[i];
            if (typeof entryPoint === "object" && entryPoint !== null) {
              let entryPointKeys = /* @__PURE__ */ Object.create(null);
              let input = getFlag(entryPoint, entryPointKeys, "in", mustBeString);
              let output = getFlag(entryPoint, entryPointKeys, "out", mustBeString);
              checkForInvalidFlags(entryPoint, entryPointKeys, "in entry point at index " + i);
              if (input === void 0)
                throw new Error('Missing property "in" for entry point at index ' + i);
              if (output === void 0)
                throw new Error('Missing property "out" for entry point at index ' + i);
              entries.push([output, input]);
            } else {
              entries.push(["", validateStringValue(entryPoint, "entry point at index " + i)]);
            }
          }
        } else {
          for (let key in entryPoints) {
            entries.push([key, validateStringValue(entryPoints[key], "entry point", key)]);
          }
        }
      }
      if (stdin) {
        let stdinKeys = /* @__PURE__ */ Object.create(null);
        let contents = getFlag(stdin, stdinKeys, "contents", mustBeStringOrUint8Array);
        let resolveDir = getFlag(stdin, stdinKeys, "resolveDir", mustBeString);
        let sourcefile = getFlag(stdin, stdinKeys, "sourcefile", mustBeString);
        let loader2 = getFlag(stdin, stdinKeys, "loader", mustBeString);
        checkForInvalidFlags(stdin, stdinKeys, 'in "stdin" object');
        if (sourcefile)
          flags.push(`--sourcefile=${sourcefile}`);
        if (loader2)
          flags.push(`--loader=${loader2}`);
        if (resolveDir)
          stdinResolveDir = resolveDir;
        if (typeof contents === "string")
          stdinContents = encodeUTF8(contents);
        else if (contents instanceof Uint8Array)
          stdinContents = contents;
      }
      let nodePaths = [];
      if (nodePathsInput) {
        for (let value of nodePathsInput) {
          value += "";
          nodePaths.push(value);
        }
      }
      return {
        entries,
        flags,
        write,
        stdinContents,
        stdinResolveDir,
        absWorkingDir,
        nodePaths,
        mangleCache: validateMangleCache(mangleCache)
      };
    }
    function flagsForTransformOptions(callName, options, isTTY2, logLevelDefault) {
      let flags = [];
      let keys = /* @__PURE__ */ Object.create(null);
      pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
      pushCommonFlags(flags, options, keys);
      let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
      let sourcefile = getFlag(options, keys, "sourcefile", mustBeString);
      let loader = getFlag(options, keys, "loader", mustBeString);
      let banner = getFlag(options, keys, "banner", mustBeString);
      let footer = getFlag(options, keys, "footer", mustBeString);
      let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
      checkForInvalidFlags(options, keys, `in ${callName}() call`);
      if (sourcemap)
        flags.push(`--sourcemap=${sourcemap === true ? "external" : sourcemap}`);
      if (sourcefile)
        flags.push(`--sourcefile=${sourcefile}`);
      if (loader)
        flags.push(`--loader=${loader}`);
      if (banner)
        flags.push(`--banner=${banner}`);
      if (footer)
        flags.push(`--footer=${footer}`);
      return {
        flags,
        mangleCache: validateMangleCache(mangleCache)
      };
    }
    function createChannel(streamIn) {
      const requestCallbacksByKey = {};
      const closeData = { didClose: false, reason: "" };
      let responseCallbacks = {};
      let nextRequestID = 0;
      let nextBuildKey = 0;
      let stdout = new Uint8Array(16 * 1024);
      let stdoutUsed = 0;
      let readFromStdout = (chunk) => {
        let limit = stdoutUsed + chunk.length;
        if (limit > stdout.length) {
          let swap = new Uint8Array(limit * 2);
          swap.set(stdout);
          stdout = swap;
        }
        stdout.set(chunk, stdoutUsed);
        stdoutUsed += chunk.length;
        let offset = 0;
        while (offset + 4 <= stdoutUsed) {
          let length = readUInt32LE(stdout, offset);
          if (offset + 4 + length > stdoutUsed) {
            break;
          }
          offset += 4;
          handleIncomingPacket(stdout.subarray(offset, offset + length));
          offset += length;
        }
        if (offset > 0) {
          stdout.copyWithin(0, offset, stdoutUsed);
          stdoutUsed -= offset;
        }
      };
      let afterClose = (error2) => {
        closeData.didClose = true;
        if (error2)
          closeData.reason = ": " + (error2.message || error2);
        const text = "The service was stopped" + closeData.reason;
        for (let id in responseCallbacks) {
          responseCallbacks[id](text, null);
        }
        responseCallbacks = {};
      };
      let sendRequest = (refs, value, callback) => {
        if (closeData.didClose)
          return callback("The service is no longer running" + closeData.reason, null);
        let id = nextRequestID++;
        responseCallbacks[id] = (error2, response) => {
          try {
            callback(error2, response);
          } finally {
            if (refs)
              refs.unref();
          }
        };
        if (refs)
          refs.ref();
        streamIn.writeToStdin(encodePacket({ id, isRequest: true, value }));
      };
      let sendResponse = (id, value) => {
        if (closeData.didClose)
          throw new Error("The service is no longer running" + closeData.reason);
        streamIn.writeToStdin(encodePacket({ id, isRequest: false, value }));
      };
      let handleRequest = async (id, request) => {
        try {
          if (request.command === "ping") {
            sendResponse(id, {});
            return;
          }
          if (typeof request.key === "number") {
            const requestCallbacks = requestCallbacksByKey[request.key];
            if (!requestCallbacks) {
              return;
            }
            const callback = requestCallbacks[request.command];
            if (callback) {
              await callback(id, request);
              return;
            }
          }
          throw new Error(`Invalid command: ` + request.command);
        } catch (e) {
          const errors = [extractErrorMessageV8(e, streamIn, null, void 0, "")];
          try {
            sendResponse(id, { errors });
          } catch {
          }
        }
      };
      let isFirstPacket = true;
      let handleIncomingPacket = (bytes) => {
        if (isFirstPacket) {
          isFirstPacket = false;
          let binaryVersion = String.fromCharCode(...bytes);
          if (binaryVersion !== "0.20.2") {
            throw new Error(`Cannot start service: Host version "${"0.20.2"}" does not match binary version ${quote(binaryVersion)}`);
          }
          return;
        }
        let packet = decodePacket(bytes);
        if (packet.isRequest) {
          handleRequest(packet.id, packet.value);
        } else {
          let callback = responseCallbacks[packet.id];
          delete responseCallbacks[packet.id];
          if (packet.value.error)
            callback(packet.value.error, {});
          else
            callback(null, packet.value);
        }
      };
      let buildOrContext = ({ callName, refs, options, isTTY: isTTY2, defaultWD: defaultWD2, callback }) => {
        let refCount = 0;
        const buildKey = nextBuildKey++;
        const requestCallbacks = {};
        const buildRefs = {
          ref() {
            if (++refCount === 1) {
              if (refs)
                refs.ref();
            }
          },
          unref() {
            if (--refCount === 0) {
              delete requestCallbacksByKey[buildKey];
              if (refs)
                refs.unref();
            }
          }
        };
        requestCallbacksByKey[buildKey] = requestCallbacks;
        buildRefs.ref();
        buildOrContextImpl(
          callName,
          buildKey,
          sendRequest,
          sendResponse,
          buildRefs,
          streamIn,
          requestCallbacks,
          options,
          isTTY2,
          defaultWD2,
          (err2, res) => {
            try {
              callback(err2, res);
            } finally {
              buildRefs.unref();
            }
          }
        );
      };
      let transform2 = ({ callName, refs, input, options, isTTY: isTTY2, fs: fs3, callback }) => {
        const details = createObjectStash();
        let start = (inputPath) => {
          try {
            if (typeof input !== "string" && !(input instanceof Uint8Array))
              throw new Error('The input to "transform" must be a string or a Uint8Array');
            let {
              flags,
              mangleCache
            } = flagsForTransformOptions(callName, options, isTTY2, transformLogLevelDefault);
            let request = {
              command: "transform",
              flags,
              inputFS: inputPath !== null,
              input: inputPath !== null ? encodeUTF8(inputPath) : typeof input === "string" ? encodeUTF8(input) : input
            };
            if (mangleCache)
              request.mangleCache = mangleCache;
            sendRequest(refs, request, (error2, response) => {
              if (error2)
                return callback(new Error(error2), null);
              let errors = replaceDetailsInMessages(response.errors, details);
              let warnings = replaceDetailsInMessages(response.warnings, details);
              let outstanding = 1;
              let next = () => {
                if (--outstanding === 0) {
                  let result = {
                    warnings,
                    code: response.code,
                    map: response.map,
                    mangleCache: void 0,
                    legalComments: void 0
                  };
                  if ("legalComments" in response)
                    result.legalComments = response == null ? void 0 : response.legalComments;
                  if (response.mangleCache)
                    result.mangleCache = response == null ? void 0 : response.mangleCache;
                  callback(null, result);
                }
              };
              if (errors.length > 0)
                return callback(failureErrorWithLog("Transform failed", errors, warnings), null);
              if (response.codeFS) {
                outstanding++;
                fs3.readFile(response.code, (err2, contents) => {
                  if (err2 !== null) {
                    callback(err2, null);
                  } else {
                    response.code = contents;
                    next();
                  }
                });
              }
              if (response.mapFS) {
                outstanding++;
                fs3.readFile(response.map, (err2, contents) => {
                  if (err2 !== null) {
                    callback(err2, null);
                  } else {
                    response.map = contents;
                    next();
                  }
                });
              }
              next();
            });
          } catch (e) {
            let flags = [];
            try {
              pushLogFlags(flags, options, {}, isTTY2, transformLogLevelDefault);
            } catch {
            }
            const error2 = extractErrorMessageV8(e, streamIn, details, void 0, "");
            sendRequest(refs, { command: "error", flags, error: error2 }, () => {
              error2.detail = details.load(error2.detail);
              callback(failureErrorWithLog("Transform failed", [error2], []), null);
            });
          }
        };
        if ((typeof input === "string" || input instanceof Uint8Array) && input.length > 1024 * 1024) {
          let next = start;
          start = () => fs3.writeFile(input, next);
        }
        start(null);
      };
      let formatMessages2 = ({ callName, refs, messages, options, callback }) => {
        if (!options)
          throw new Error(`Missing second argument in ${callName}() call`);
        let keys = {};
        let kind = getFlag(options, keys, "kind", mustBeString);
        let color2 = getFlag(options, keys, "color", mustBeBoolean);
        let terminalWidth = getFlag(options, keys, "terminalWidth", mustBeInteger);
        checkForInvalidFlags(options, keys, `in ${callName}() call`);
        if (kind === void 0)
          throw new Error(`Missing "kind" in ${callName}() call`);
        if (kind !== "error" && kind !== "warning")
          throw new Error(`Expected "kind" to be "error" or "warning" in ${callName}() call`);
        let request = {
          command: "format-msgs",
          messages: sanitizeMessages(messages, "messages", null, "", terminalWidth),
          isWarning: kind === "warning"
        };
        if (color2 !== void 0)
          request.color = color2;
        if (terminalWidth !== void 0)
          request.terminalWidth = terminalWidth;
        sendRequest(refs, request, (error2, response) => {
          if (error2)
            return callback(new Error(error2), null);
          callback(null, response.messages);
        });
      };
      let analyzeMetafile2 = ({ callName, refs, metafile, options, callback }) => {
        if (options === void 0)
          options = {};
        let keys = {};
        let color2 = getFlag(options, keys, "color", mustBeBoolean);
        let verbose = getFlag(options, keys, "verbose", mustBeBoolean);
        checkForInvalidFlags(options, keys, `in ${callName}() call`);
        let request = {
          command: "analyze-metafile",
          metafile
        };
        if (color2 !== void 0)
          request.color = color2;
        if (verbose !== void 0)
          request.verbose = verbose;
        sendRequest(refs, request, (error2, response) => {
          if (error2)
            return callback(new Error(error2), null);
          callback(null, response.result);
        });
      };
      return {
        readFromStdout,
        afterClose,
        service: {
          buildOrContext,
          transform: transform2,
          formatMessages: formatMessages2,
          analyzeMetafile: analyzeMetafile2
        }
      };
    }
    function buildOrContextImpl(callName, buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, options, isTTY2, defaultWD2, callback) {
      const details = createObjectStash();
      const isContext = callName === "context";
      const handleError = (e, pluginName) => {
        const flags = [];
        try {
          pushLogFlags(flags, options, {}, isTTY2, buildLogLevelDefault);
        } catch {
        }
        const message = extractErrorMessageV8(e, streamIn, details, void 0, pluginName);
        sendRequest(refs, { command: "error", flags, error: message }, () => {
          message.detail = details.load(message.detail);
          callback(failureErrorWithLog(isContext ? "Context failed" : "Build failed", [message], []), null);
        });
      };
      let plugins;
      if (typeof options === "object") {
        const value = options.plugins;
        if (value !== void 0) {
          if (!Array.isArray(value))
            return handleError(new Error(`"plugins" must be an array`), "");
          plugins = value;
        }
      }
      if (plugins && plugins.length > 0) {
        if (streamIn.isSync)
          return handleError(new Error("Cannot use plugins in synchronous API calls"), "");
        handlePlugins(
          buildKey,
          sendRequest,
          sendResponse,
          refs,
          streamIn,
          requestCallbacks,
          options,
          plugins,
          details
        ).then(
          (result) => {
            if (!result.ok)
              return handleError(result.error, result.pluginName);
            try {
              buildOrContextContinue(result.requestPlugins, result.runOnEndCallbacks, result.scheduleOnDisposeCallbacks);
            } catch (e) {
              handleError(e, "");
            }
          },
          (e) => handleError(e, "")
        );
        return;
      }
      try {
        buildOrContextContinue(null, (result, done) => done([], []), () => {
        });
      } catch (e) {
        handleError(e, "");
      }
      function buildOrContextContinue(requestPlugins, runOnEndCallbacks, scheduleOnDisposeCallbacks) {
        const writeDefault = streamIn.hasFS;
        const {
          entries,
          flags,
          write,
          stdinContents,
          stdinResolveDir,
          absWorkingDir,
          nodePaths,
          mangleCache
        } = flagsForBuildOptions(callName, options, isTTY2, buildLogLevelDefault, writeDefault);
        if (write && !streamIn.hasFS)
          throw new Error(`The "write" option is unavailable in this environment`);
        const request = {
          command: "build",
          key: buildKey,
          entries,
          flags,
          write,
          stdinContents,
          stdinResolveDir,
          absWorkingDir: absWorkingDir || defaultWD2,
          nodePaths,
          context: isContext
        };
        if (requestPlugins)
          request.plugins = requestPlugins;
        if (mangleCache)
          request.mangleCache = mangleCache;
        const buildResponseToResult = (response, callback2) => {
          const result = {
            errors: replaceDetailsInMessages(response.errors, details),
            warnings: replaceDetailsInMessages(response.warnings, details),
            outputFiles: void 0,
            metafile: void 0,
            mangleCache: void 0
          };
          const originalErrors = result.errors.slice();
          const originalWarnings = result.warnings.slice();
          if (response.outputFiles)
            result.outputFiles = response.outputFiles.map(convertOutputFiles);
          if (response.metafile)
            result.metafile = JSON.parse(response.metafile);
          if (response.mangleCache)
            result.mangleCache = response.mangleCache;
          if (response.writeToStdout !== void 0)
            console.log(decodeUTF8(response.writeToStdout).replace(/\n$/, ""));
          runOnEndCallbacks(result, (onEndErrors, onEndWarnings) => {
            if (originalErrors.length > 0 || onEndErrors.length > 0) {
              const error2 = failureErrorWithLog("Build failed", originalErrors.concat(onEndErrors), originalWarnings.concat(onEndWarnings));
              return callback2(error2, null, onEndErrors, onEndWarnings);
            }
            callback2(null, result, onEndErrors, onEndWarnings);
          });
        };
        let latestResultPromise;
        let provideLatestResult;
        if (isContext)
          requestCallbacks["on-end"] = (id, request2) => new Promise((resolve) => {
            buildResponseToResult(request2, (err2, result, onEndErrors, onEndWarnings) => {
              const response = {
                errors: onEndErrors,
                warnings: onEndWarnings
              };
              if (provideLatestResult)
                provideLatestResult(err2, result);
              latestResultPromise = void 0;
              provideLatestResult = void 0;
              sendResponse(id, response);
              resolve();
            });
          });
        sendRequest(refs, request, (error2, response) => {
          if (error2)
            return callback(new Error(error2), null);
          if (!isContext) {
            return buildResponseToResult(response, (err2, res) => {
              scheduleOnDisposeCallbacks();
              return callback(err2, res);
            });
          }
          if (response.errors.length > 0) {
            return callback(failureErrorWithLog("Context failed", response.errors, response.warnings), null);
          }
          let didDispose = false;
          const result = {
            rebuild: () => {
              if (!latestResultPromise)
                latestResultPromise = new Promise((resolve, reject) => {
                  let settlePromise;
                  provideLatestResult = (err2, result2) => {
                    if (!settlePromise)
                      settlePromise = () => err2 ? reject(err2) : resolve(result2);
                  };
                  const triggerAnotherBuild = () => {
                    const request2 = {
                      command: "rebuild",
                      key: buildKey
                    };
                    sendRequest(refs, request2, (error22, response2) => {
                      if (error22) {
                        reject(new Error(error22));
                      } else if (settlePromise) {
                        settlePromise();
                      } else {
                        triggerAnotherBuild();
                      }
                    });
                  };
                  triggerAnotherBuild();
                });
              return latestResultPromise;
            },
            watch: (options2 = {}) => new Promise((resolve, reject) => {
              if (!streamIn.hasFS)
                throw new Error(`Cannot use the "watch" API in this environment`);
              const keys = {};
              checkForInvalidFlags(options2, keys, `in watch() call`);
              const request2 = {
                command: "watch",
                key: buildKey
              };
              sendRequest(refs, request2, (error22) => {
                if (error22)
                  reject(new Error(error22));
                else
                  resolve(void 0);
              });
            }),
            serve: (options2 = {}) => new Promise((resolve, reject) => {
              if (!streamIn.hasFS)
                throw new Error(`Cannot use the "serve" API in this environment`);
              const keys = {};
              const port = getFlag(options2, keys, "port", mustBeInteger);
              const host = getFlag(options2, keys, "host", mustBeString);
              const servedir = getFlag(options2, keys, "servedir", mustBeString);
              const keyfile = getFlag(options2, keys, "keyfile", mustBeString);
              const certfile = getFlag(options2, keys, "certfile", mustBeString);
              const fallback = getFlag(options2, keys, "fallback", mustBeString);
              const onRequest = getFlag(options2, keys, "onRequest", mustBeFunction);
              checkForInvalidFlags(options2, keys, `in serve() call`);
              const request2 = {
                command: "serve",
                key: buildKey,
                onRequest: !!onRequest
              };
              if (port !== void 0)
                request2.port = port;
              if (host !== void 0)
                request2.host = host;
              if (servedir !== void 0)
                request2.servedir = servedir;
              if (keyfile !== void 0)
                request2.keyfile = keyfile;
              if (certfile !== void 0)
                request2.certfile = certfile;
              if (fallback !== void 0)
                request2.fallback = fallback;
              sendRequest(refs, request2, (error22, response2) => {
                if (error22)
                  return reject(new Error(error22));
                if (onRequest) {
                  requestCallbacks["serve-request"] = (id, request3) => {
                    onRequest(request3.args);
                    sendResponse(id, {});
                  };
                }
                resolve(response2);
              });
            }),
            cancel: () => new Promise((resolve) => {
              if (didDispose)
                return resolve();
              const request2 = {
                command: "cancel",
                key: buildKey
              };
              sendRequest(refs, request2, () => {
                resolve();
              });
            }),
            dispose: () => new Promise((resolve) => {
              if (didDispose)
                return resolve();
              didDispose = true;
              const request2 = {
                command: "dispose",
                key: buildKey
              };
              sendRequest(refs, request2, () => {
                resolve();
                scheduleOnDisposeCallbacks();
                refs.unref();
              });
            })
          };
          refs.ref();
          callback(null, result);
        });
      }
    }
    var handlePlugins = async (buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, initialOptions, plugins, details) => {
      let onStartCallbacks = [];
      let onEndCallbacks = [];
      let onResolveCallbacks = {};
      let onLoadCallbacks = {};
      let onDisposeCallbacks = [];
      let nextCallbackID = 0;
      let i = 0;
      let requestPlugins = [];
      let isSetupDone = false;
      plugins = [...plugins];
      for (let item of plugins) {
        let keys = {};
        if (typeof item !== "object")
          throw new Error(`Plugin at index ${i} must be an object`);
        const name = getFlag(item, keys, "name", mustBeString);
        if (typeof name !== "string" || name === "")
          throw new Error(`Plugin at index ${i} is missing a name`);
        try {
          let setup = getFlag(item, keys, "setup", mustBeFunction);
          if (typeof setup !== "function")
            throw new Error(`Plugin is missing a setup function`);
          checkForInvalidFlags(item, keys, `on plugin ${quote(name)}`);
          let plugin = {
            name,
            onStart: false,
            onEnd: false,
            onResolve: [],
            onLoad: []
          };
          i++;
          let resolve = (path3, options = {}) => {
            if (!isSetupDone)
              throw new Error('Cannot call "resolve" before plugin setup has completed');
            if (typeof path3 !== "string")
              throw new Error(`The path to resolve must be a string`);
            let keys2 = /* @__PURE__ */ Object.create(null);
            let pluginName = getFlag(options, keys2, "pluginName", mustBeString);
            let importer = getFlag(options, keys2, "importer", mustBeString);
            let namespace = getFlag(options, keys2, "namespace", mustBeString);
            let resolveDir = getFlag(options, keys2, "resolveDir", mustBeString);
            let kind = getFlag(options, keys2, "kind", mustBeString);
            let pluginData = getFlag(options, keys2, "pluginData", canBeAnything);
            checkForInvalidFlags(options, keys2, "in resolve() call");
            return new Promise((resolve2, reject) => {
              const request = {
                command: "resolve",
                path: path3,
                key: buildKey,
                pluginName: name
              };
              if (pluginName != null)
                request.pluginName = pluginName;
              if (importer != null)
                request.importer = importer;
              if (namespace != null)
                request.namespace = namespace;
              if (resolveDir != null)
                request.resolveDir = resolveDir;
              if (kind != null)
                request.kind = kind;
              else
                throw new Error(`Must specify "kind" when calling "resolve"`);
              if (pluginData != null)
                request.pluginData = details.store(pluginData);
              sendRequest(refs, request, (error2, response) => {
                if (error2 !== null)
                  reject(new Error(error2));
                else
                  resolve2({
                    errors: replaceDetailsInMessages(response.errors, details),
                    warnings: replaceDetailsInMessages(response.warnings, details),
                    path: response.path,
                    external: response.external,
                    sideEffects: response.sideEffects,
                    namespace: response.namespace,
                    suffix: response.suffix,
                    pluginData: details.load(response.pluginData)
                  });
              });
            });
          };
          let promise = setup({
            initialOptions,
            resolve,
            onStart(callback) {
              let registeredText = `This error came from the "onStart" callback registered here:`;
              let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onStart");
              onStartCallbacks.push({ name, callback, note: registeredNote });
              plugin.onStart = true;
            },
            onEnd(callback) {
              let registeredText = `This error came from the "onEnd" callback registered here:`;
              let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onEnd");
              onEndCallbacks.push({ name, callback, note: registeredNote });
              plugin.onEnd = true;
            },
            onResolve(options, callback) {
              let registeredText = `This error came from the "onResolve" callback registered here:`;
              let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onResolve");
              let keys2 = {};
              let filter = getFlag(options, keys2, "filter", mustBeRegExp);
              let namespace = getFlag(options, keys2, "namespace", mustBeString);
              checkForInvalidFlags(options, keys2, `in onResolve() call for plugin ${quote(name)}`);
              if (filter == null)
                throw new Error(`onResolve() call is missing a filter`);
              let id = nextCallbackID++;
              onResolveCallbacks[id] = { name, callback, note: registeredNote };
              plugin.onResolve.push({ id, filter: filter.source, namespace: namespace || "" });
            },
            onLoad(options, callback) {
              let registeredText = `This error came from the "onLoad" callback registered here:`;
              let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onLoad");
              let keys2 = {};
              let filter = getFlag(options, keys2, "filter", mustBeRegExp);
              let namespace = getFlag(options, keys2, "namespace", mustBeString);
              checkForInvalidFlags(options, keys2, `in onLoad() call for plugin ${quote(name)}`);
              if (filter == null)
                throw new Error(`onLoad() call is missing a filter`);
              let id = nextCallbackID++;
              onLoadCallbacks[id] = { name, callback, note: registeredNote };
              plugin.onLoad.push({ id, filter: filter.source, namespace: namespace || "" });
            },
            onDispose(callback) {
              onDisposeCallbacks.push(callback);
            },
            esbuild: streamIn.esbuild
          });
          if (promise)
            await promise;
          requestPlugins.push(plugin);
        } catch (e) {
          return { ok: false, error: e, pluginName: name };
        }
      }
      requestCallbacks["on-start"] = async (id, request) => {
        let response = { errors: [], warnings: [] };
        await Promise.all(onStartCallbacks.map(async ({ name, callback, note }) => {
          try {
            let result = await callback();
            if (result != null) {
              if (typeof result !== "object")
                throw new Error(`Expected onStart() callback in plugin ${quote(name)} to return an object`);
              let keys = {};
              let errors = getFlag(result, keys, "errors", mustBeArray);
              let warnings = getFlag(result, keys, "warnings", mustBeArray);
              checkForInvalidFlags(result, keys, `from onStart() callback in plugin ${quote(name)}`);
              if (errors != null)
                response.errors.push(...sanitizeMessages(errors, "errors", details, name, void 0));
              if (warnings != null)
                response.warnings.push(...sanitizeMessages(warnings, "warnings", details, name, void 0));
            }
          } catch (e) {
            response.errors.push(extractErrorMessageV8(e, streamIn, details, note && note(), name));
          }
        }));
        sendResponse(id, response);
      };
      requestCallbacks["on-resolve"] = async (id, request) => {
        let response = {}, name = "", callback, note;
        for (let id2 of request.ids) {
          try {
            ({ name, callback, note } = onResolveCallbacks[id2]);
            let result = await callback({
              path: request.path,
              importer: request.importer,
              namespace: request.namespace,
              resolveDir: request.resolveDir,
              kind: request.kind,
              pluginData: details.load(request.pluginData)
            });
            if (result != null) {
              if (typeof result !== "object")
                throw new Error(`Expected onResolve() callback in plugin ${quote(name)} to return an object`);
              let keys = {};
              let pluginName = getFlag(result, keys, "pluginName", mustBeString);
              let path3 = getFlag(result, keys, "path", mustBeString);
              let namespace = getFlag(result, keys, "namespace", mustBeString);
              let suffix = getFlag(result, keys, "suffix", mustBeString);
              let external = getFlag(result, keys, "external", mustBeBoolean);
              let sideEffects = getFlag(result, keys, "sideEffects", mustBeBoolean);
              let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
              let errors = getFlag(result, keys, "errors", mustBeArray);
              let warnings = getFlag(result, keys, "warnings", mustBeArray);
              let watchFiles = getFlag(result, keys, "watchFiles", mustBeArray);
              let watchDirs = getFlag(result, keys, "watchDirs", mustBeArray);
              checkForInvalidFlags(result, keys, `from onResolve() callback in plugin ${quote(name)}`);
              response.id = id2;
              if (pluginName != null)
                response.pluginName = pluginName;
              if (path3 != null)
                response.path = path3;
              if (namespace != null)
                response.namespace = namespace;
              if (suffix != null)
                response.suffix = suffix;
              if (external != null)
                response.external = external;
              if (sideEffects != null)
                response.sideEffects = sideEffects;
              if (pluginData != null)
                response.pluginData = details.store(pluginData);
              if (errors != null)
                response.errors = sanitizeMessages(errors, "errors", details, name, void 0);
              if (warnings != null)
                response.warnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
              if (watchFiles != null)
                response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
              if (watchDirs != null)
                response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
              break;
            }
          } catch (e) {
            response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
            break;
          }
        }
        sendResponse(id, response);
      };
      requestCallbacks["on-load"] = async (id, request) => {
        let response = {}, name = "", callback, note;
        for (let id2 of request.ids) {
          try {
            ({ name, callback, note } = onLoadCallbacks[id2]);
            let result = await callback({
              path: request.path,
              namespace: request.namespace,
              suffix: request.suffix,
              pluginData: details.load(request.pluginData),
              with: request.with
            });
            if (result != null) {
              if (typeof result !== "object")
                throw new Error(`Expected onLoad() callback in plugin ${quote(name)} to return an object`);
              let keys = {};
              let pluginName = getFlag(result, keys, "pluginName", mustBeString);
              let contents = getFlag(result, keys, "contents", mustBeStringOrUint8Array);
              let resolveDir = getFlag(result, keys, "resolveDir", mustBeString);
              let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
              let loader = getFlag(result, keys, "loader", mustBeString);
              let errors = getFlag(result, keys, "errors", mustBeArray);
              let warnings = getFlag(result, keys, "warnings", mustBeArray);
              let watchFiles = getFlag(result, keys, "watchFiles", mustBeArray);
              let watchDirs = getFlag(result, keys, "watchDirs", mustBeArray);
              checkForInvalidFlags(result, keys, `from onLoad() callback in plugin ${quote(name)}`);
              response.id = id2;
              if (pluginName != null)
                response.pluginName = pluginName;
              if (contents instanceof Uint8Array)
                response.contents = contents;
              else if (contents != null)
                response.contents = encodeUTF8(contents);
              if (resolveDir != null)
                response.resolveDir = resolveDir;
              if (pluginData != null)
                response.pluginData = details.store(pluginData);
              if (loader != null)
                response.loader = loader;
              if (errors != null)
                response.errors = sanitizeMessages(errors, "errors", details, name, void 0);
              if (warnings != null)
                response.warnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
              if (watchFiles != null)
                response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
              if (watchDirs != null)
                response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
              break;
            }
          } catch (e) {
            response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
            break;
          }
        }
        sendResponse(id, response);
      };
      let runOnEndCallbacks = (result, done) => done([], []);
      if (onEndCallbacks.length > 0) {
        runOnEndCallbacks = (result, done) => {
          (async () => {
            const onEndErrors = [];
            const onEndWarnings = [];
            for (const { name, callback, note } of onEndCallbacks) {
              let newErrors;
              let newWarnings;
              try {
                const value = await callback(result);
                if (value != null) {
                  if (typeof value !== "object")
                    throw new Error(`Expected onEnd() callback in plugin ${quote(name)} to return an object`);
                  let keys = {};
                  let errors = getFlag(value, keys, "errors", mustBeArray);
                  let warnings = getFlag(value, keys, "warnings", mustBeArray);
                  checkForInvalidFlags(value, keys, `from onEnd() callback in plugin ${quote(name)}`);
                  if (errors != null)
                    newErrors = sanitizeMessages(errors, "errors", details, name, void 0);
                  if (warnings != null)
                    newWarnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
                }
              } catch (e) {
                newErrors = [extractErrorMessageV8(e, streamIn, details, note && note(), name)];
              }
              if (newErrors) {
                onEndErrors.push(...newErrors);
                try {
                  result.errors.push(...newErrors);
                } catch {
                }
              }
              if (newWarnings) {
                onEndWarnings.push(...newWarnings);
                try {
                  result.warnings.push(...newWarnings);
                } catch {
                }
              }
            }
            done(onEndErrors, onEndWarnings);
          })();
        };
      }
      let scheduleOnDisposeCallbacks = () => {
        for (const cb of onDisposeCallbacks) {
          setTimeout(() => cb(), 0);
        }
      };
      isSetupDone = true;
      return {
        ok: true,
        requestPlugins,
        runOnEndCallbacks,
        scheduleOnDisposeCallbacks
      };
    };
    function createObjectStash() {
      const map = /* @__PURE__ */ new Map();
      let nextID = 0;
      return {
        load(id) {
          return map.get(id);
        },
        store(value) {
          if (value === void 0)
            return -1;
          const id = nextID++;
          map.set(id, value);
          return id;
        }
      };
    }
    function extractCallerV8(e, streamIn, ident) {
      let note;
      let tried = false;
      return () => {
        if (tried)
          return note;
        tried = true;
        try {
          let lines = (e.stack + "").split("\n");
          lines.splice(1, 1);
          let location = parseStackLinesV8(streamIn, lines, ident);
          if (location) {
            note = { text: e.message, location };
            return note;
          }
        } catch {
        }
      };
    }
    function extractErrorMessageV8(e, streamIn, stash, note, pluginName) {
      let text = "Internal error";
      let location = null;
      try {
        text = (e && e.message || e) + "";
      } catch {
      }
      try {
        location = parseStackLinesV8(streamIn, (e.stack + "").split("\n"), "");
      } catch {
      }
      return { id: "", pluginName, text, location, notes: note ? [note] : [], detail: stash ? stash.store(e) : -1 };
    }
    function parseStackLinesV8(streamIn, lines, ident) {
      let at = "    at ";
      if (streamIn.readFileSync && !lines[0].startsWith(at) && lines[1].startsWith(at)) {
        for (let i = 1; i < lines.length; i++) {
          let line = lines[i];
          if (!line.startsWith(at))
            continue;
          line = line.slice(at.length);
          while (true) {
            let match = /^(?:new |async )?\S+ \((.*)\)$/.exec(line);
            if (match) {
              line = match[1];
              continue;
            }
            match = /^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(line);
            if (match) {
              line = match[1];
              continue;
            }
            match = /^(\S+):(\d+):(\d+)$/.exec(line);
            if (match) {
              let contents;
              try {
                contents = streamIn.readFileSync(match[1], "utf8");
              } catch {
                break;
              }
              let lineText = contents.split(/\r\n|\r|\n|\u2028|\u2029/)[+match[2] - 1] || "";
              let column = +match[3] - 1;
              let length = lineText.slice(column, column + ident.length) === ident ? ident.length : 0;
              return {
                file: match[1],
                namespace: "file",
                line: +match[2],
                column: encodeUTF8(lineText.slice(0, column)).length,
                length: encodeUTF8(lineText.slice(column, column + length)).length,
                lineText: lineText + "\n" + lines.slice(1).join("\n"),
                suggestion: ""
              };
            }
            break;
          }
        }
      }
      return null;
    }
    function failureErrorWithLog(text, errors, warnings) {
      let limit = 5;
      text += errors.length < 1 ? "" : ` with ${errors.length} error${errors.length < 2 ? "" : "s"}:` + errors.slice(0, limit + 1).map((e, i) => {
        if (i === limit)
          return "\n...";
        if (!e.location)
          return `
error: ${e.text}`;
        let { file, line, column } = e.location;
        let pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : "";
        return `
${file}:${line}:${column}: ERROR: ${pluginText}${e.text}`;
      }).join("");
      let error2 = new Error(text);
      for (const [key, value] of [["errors", errors], ["warnings", warnings]]) {
        Object.defineProperty(error2, key, {
          configurable: true,
          enumerable: true,
          get: () => value,
          set: (value2) => Object.defineProperty(error2, key, {
            configurable: true,
            enumerable: true,
            value: value2
          })
        });
      }
      return error2;
    }
    function replaceDetailsInMessages(messages, stash) {
      for (const message of messages) {
        message.detail = stash.load(message.detail);
      }
      return messages;
    }
    function sanitizeLocation(location, where, terminalWidth) {
      if (location == null)
        return null;
      let keys = {};
      let file = getFlag(location, keys, "file", mustBeString);
      let namespace = getFlag(location, keys, "namespace", mustBeString);
      let line = getFlag(location, keys, "line", mustBeInteger);
      let column = getFlag(location, keys, "column", mustBeInteger);
      let length = getFlag(location, keys, "length", mustBeInteger);
      let lineText = getFlag(location, keys, "lineText", mustBeString);
      let suggestion = getFlag(location, keys, "suggestion", mustBeString);
      checkForInvalidFlags(location, keys, where);
      if (lineText) {
        const relevantASCII = lineText.slice(
          0,
          (column && column > 0 ? column : 0) + (length && length > 0 ? length : 0) + (terminalWidth && terminalWidth > 0 ? terminalWidth : 80)
        );
        if (!/[\x7F-\uFFFF]/.test(relevantASCII) && !/\n/.test(lineText)) {
          lineText = relevantASCII;
        }
      }
      return {
        file: file || "",
        namespace: namespace || "",
        line: line || 0,
        column: column || 0,
        length: length || 0,
        lineText: lineText || "",
        suggestion: suggestion || ""
      };
    }
    function sanitizeMessages(messages, property, stash, fallbackPluginName, terminalWidth) {
      let messagesClone = [];
      let index = 0;
      for (const message of messages) {
        let keys = {};
        let id = getFlag(message, keys, "id", mustBeString);
        let pluginName = getFlag(message, keys, "pluginName", mustBeString);
        let text = getFlag(message, keys, "text", mustBeString);
        let location = getFlag(message, keys, "location", mustBeObjectOrNull);
        let notes = getFlag(message, keys, "notes", mustBeArray);
        let detail = getFlag(message, keys, "detail", canBeAnything);
        let where = `in element ${index} of "${property}"`;
        checkForInvalidFlags(message, keys, where);
        let notesClone = [];
        if (notes) {
          for (const note of notes) {
            let noteKeys = {};
            let noteText = getFlag(note, noteKeys, "text", mustBeString);
            let noteLocation = getFlag(note, noteKeys, "location", mustBeObjectOrNull);
            checkForInvalidFlags(note, noteKeys, where);
            notesClone.push({
              text: noteText || "",
              location: sanitizeLocation(noteLocation, where, terminalWidth)
            });
          }
        }
        messagesClone.push({
          id: id || "",
          pluginName: pluginName || fallbackPluginName,
          text: text || "",
          location: sanitizeLocation(location, where, terminalWidth),
          notes: notesClone,
          detail: stash ? stash.store(detail) : -1
        });
        index++;
      }
      return messagesClone;
    }
    function sanitizeStringArray(values, property) {
      const result = [];
      for (const value of values) {
        if (typeof value !== "string")
          throw new Error(`${quote(property)} must be an array of strings`);
        result.push(value);
      }
      return result;
    }
    function convertOutputFiles({ path: path3, contents, hash }) {
      let text = null;
      return {
        path: path3,
        contents,
        hash,
        get text() {
          const binary = this.contents;
          if (text === null || binary !== contents) {
            contents = binary;
            text = decodeUTF8(binary);
          }
          return text;
        }
      };
    }
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    var ESBUILD_BINARY_PATH = process.env.ESBUILD_BINARY_PATH || ESBUILD_BINARY_PATH;
    var isValidBinaryPath = (x) => !!x && x !== "/usr/bin/esbuild";
    var packageDarwin_arm64 = "@esbuild/darwin-arm64";
    var packageDarwin_x64 = "@esbuild/darwin-x64";
    var knownWindowsPackages = {
      "win32 arm64 LE": "@esbuild/win32-arm64",
      "win32 ia32 LE": "@esbuild/win32-ia32",
      "win32 x64 LE": "@esbuild/win32-x64"
    };
    var knownUnixlikePackages = {
      "aix ppc64 BE": "@esbuild/aix-ppc64",
      "android arm64 LE": "@esbuild/android-arm64",
      "darwin arm64 LE": "@esbuild/darwin-arm64",
      "darwin x64 LE": "@esbuild/darwin-x64",
      "freebsd arm64 LE": "@esbuild/freebsd-arm64",
      "freebsd x64 LE": "@esbuild/freebsd-x64",
      "linux arm LE": "@esbuild/linux-arm",
      "linux arm64 LE": "@esbuild/linux-arm64",
      "linux ia32 LE": "@esbuild/linux-ia32",
      "linux mips64el LE": "@esbuild/linux-mips64el",
      "linux ppc64 LE": "@esbuild/linux-ppc64",
      "linux riscv64 LE": "@esbuild/linux-riscv64",
      "linux s390x BE": "@esbuild/linux-s390x",
      "linux x64 LE": "@esbuild/linux-x64",
      "linux loong64 LE": "@esbuild/linux-loong64",
      "netbsd x64 LE": "@esbuild/netbsd-x64",
      "openbsd x64 LE": "@esbuild/openbsd-x64",
      "sunos x64 LE": "@esbuild/sunos-x64"
    };
    var knownWebAssemblyFallbackPackages = {
      "android arm LE": "@esbuild/android-arm",
      "android x64 LE": "@esbuild/android-x64"
    };
    function pkgAndSubpathForCurrentPlatform() {
      let pkg;
      let subpath;
      let isWASM = false;
      let platformKey = `${process.platform} ${os.arch()} ${os.endianness()}`;
      if (platformKey in knownWindowsPackages) {
        pkg = knownWindowsPackages[platformKey];
        subpath = "esbuild.exe";
      } else if (platformKey in knownUnixlikePackages) {
        pkg = knownUnixlikePackages[platformKey];
        subpath = "bin/esbuild";
      } else if (platformKey in knownWebAssemblyFallbackPackages) {
        pkg = knownWebAssemblyFallbackPackages[platformKey];
        subpath = "bin/esbuild";
        isWASM = true;
      } else {
        throw new Error(`Unsupported platform: ${platformKey}`);
      }
      return { pkg, subpath, isWASM };
    }
    function pkgForSomeOtherPlatform() {
      const libMainJS = require.resolve("esbuild");
      const nodeModulesDirectory = path.dirname(path.dirname(path.dirname(libMainJS)));
      if (path.basename(nodeModulesDirectory) === "node_modules") {
        for (const unixKey in knownUnixlikePackages) {
          try {
            const pkg = knownUnixlikePackages[unixKey];
            if (fs.existsSync(path.join(nodeModulesDirectory, pkg)))
              return pkg;
          } catch {
          }
        }
        for (const windowsKey in knownWindowsPackages) {
          try {
            const pkg = knownWindowsPackages[windowsKey];
            if (fs.existsSync(path.join(nodeModulesDirectory, pkg)))
              return pkg;
          } catch {
          }
        }
      }
      return null;
    }
    function downloadedBinPath(pkg, subpath) {
      const esbuildLibDir = path.dirname(require.resolve("esbuild"));
      return path.join(esbuildLibDir, `downloaded-${pkg.replace("/", "-")}-${path.basename(subpath)}`);
    }
    function generateBinPath() {
      if (isValidBinaryPath(ESBUILD_BINARY_PATH)) {
        if (!fs.existsSync(ESBUILD_BINARY_PATH)) {
          console.warn(`[esbuild] Ignoring bad configuration: ESBUILD_BINARY_PATH=${ESBUILD_BINARY_PATH}`);
        } else {
          return { binPath: ESBUILD_BINARY_PATH, isWASM: false };
        }
      }
      const { pkg, subpath, isWASM } = pkgAndSubpathForCurrentPlatform();
      let binPath;
      try {
        binPath = require.resolve(`${pkg}/${subpath}`);
      } catch (e) {
        binPath = downloadedBinPath(pkg, subpath);
        if (!fs.existsSync(binPath)) {
          try {
            require.resolve(pkg);
          } catch {
            const otherPkg = pkgForSomeOtherPlatform();
            if (otherPkg) {
              let suggestions = `
Specifically the "${otherPkg}" package is present but this platform
needs the "${pkg}" package instead. People often get into this
situation by installing esbuild on Windows or macOS and copying "node_modules"
into a Docker image that runs Linux, or by copying "node_modules" between
Windows and WSL environments.

If you are installing with npm, you can try not copying the "node_modules"
directory when you copy the files over, and running "npm ci" or "npm install"
on the destination platform after the copy. Or you could consider using yarn
instead of npm which has built-in support for installing a package on multiple
platforms simultaneously.

If you are installing with yarn, you can try listing both this platform and the
other platform in your ".yarnrc.yml" file using the "supportedArchitectures"
feature: https://yarnpkg.com/configuration/yarnrc/#supportedArchitectures
Keep in mind that this means multiple copies of esbuild will be present.
`;
              if (pkg === packageDarwin_x64 && otherPkg === packageDarwin_arm64 || pkg === packageDarwin_arm64 && otherPkg === packageDarwin_x64) {
                suggestions = `
Specifically the "${otherPkg}" package is present but this platform
needs the "${pkg}" package instead. People often get into this
situation by installing esbuild with npm running inside of Rosetta 2 and then
trying to use it with node running outside of Rosetta 2, or vice versa (Rosetta
2 is Apple's on-the-fly x86_64-to-arm64 translation service).

If you are installing with npm, you can try ensuring that both npm and node are
not running under Rosetta 2 and then reinstalling esbuild. This likely involves
changing how you installed npm and/or node. For example, installing node with
the universal installer here should work: https://nodejs.org/en/download/. Or
you could consider using yarn instead of npm which has built-in support for
installing a package on multiple platforms simultaneously.

If you are installing with yarn, you can try listing both "arm64" and "x64"
in your ".yarnrc.yml" file using the "supportedArchitectures" feature:
https://yarnpkg.com/configuration/yarnrc/#supportedArchitectures
Keep in mind that this means multiple copies of esbuild will be present.
`;
              }
              throw new Error(`
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.
${suggestions}
Another alternative is to use the "esbuild-wasm" package instead, which works
the same way on all platforms. But it comes with a heavy performance cost and
can sometimes be 10x slower than the "esbuild" package, so you may also not
want to do that.
`);
            }
            throw new Error(`The package "${pkg}" could not be found, and is needed by esbuild.

If you are installing esbuild with npm, make sure that you don't specify the
"--no-optional" or "--omit=optional" flags. The "optionalDependencies" feature
of "package.json" is used by esbuild to install the correct binary executable
for your current platform.`);
          }
          throw e;
        }
      }
      if (/\.zip\//.test(binPath)) {
        let pnpapi;
        try {
          pnpapi = require("pnpapi");
        } catch (e) {
        }
        if (pnpapi) {
          const root = pnpapi.getPackageInformation(pnpapi.topLevel).packageLocation;
          const binTargetPath = path.join(
            root,
            "node_modules",
            ".cache",
            "esbuild",
            `pnpapi-${pkg.replace("/", "-")}-${"0.20.2"}-${path.basename(subpath)}`
          );
          if (!fs.existsSync(binTargetPath)) {
            fs.mkdirSync(path.dirname(binTargetPath), { recursive: true });
            fs.copyFileSync(binPath, binTargetPath);
            fs.chmodSync(binTargetPath, 493);
          }
          return { binPath: binTargetPath, isWASM };
        }
      }
      return { binPath, isWASM };
    }
    var child_process = require("child_process");
    var crypto3 = require("crypto");
    var path2 = require("path");
    var fs2 = require("fs");
    var os2 = require("os");
    var tty = require("tty");
    var worker_threads;
    if (process.env.ESBUILD_WORKER_THREADS !== "0") {
      try {
        worker_threads = require("worker_threads");
      } catch {
      }
      let [major, minor] = process.versions.node.split(".");
      if (
        // <v12.17.0 does not work
        +major < 12 || +major === 12 && +minor < 17 || +major === 13 && +minor < 13
      ) {
        worker_threads = void 0;
      }
    }
    var _a;
    var isInternalWorkerThread = ((_a = worker_threads == null ? void 0 : worker_threads.workerData) == null ? void 0 : _a.esbuildVersion) === "0.20.2";
    var esbuildCommandAndArgs = () => {
      if ((!ESBUILD_BINARY_PATH || false) && (path2.basename(__filename) !== "main.js" || path2.basename(__dirname) !== "lib")) {
        throw new Error(
          `The esbuild JavaScript API cannot be bundled. Please mark the "esbuild" package as external so it's not included in the bundle.

More information: The file containing the code for esbuild's JavaScript API (${__filename}) does not appear to be inside the esbuild package on the file system, which usually means that the esbuild package was bundled into another file. This is problematic because the API needs to run a binary executable inside the esbuild package which is located using a relative path from the API code to the executable. If the esbuild package is bundled, the relative path will be incorrect and the executable won't be found.`
        );
      }
      if (false) {
        return ["node", [path2.join(__dirname, "..", "bin", "esbuild")]];
      } else {
        const { binPath, isWASM } = generateBinPath();
        if (isWASM) {
          return ["node", [binPath]];
        } else {
          return [binPath, []];
        }
      }
    };
    var isTTY = () => tty.isatty(2);
    var fsSync = {
      readFile(tempFile, callback) {
        try {
          let contents = fs2.readFileSync(tempFile, "utf8");
          try {
            fs2.unlinkSync(tempFile);
          } catch {
          }
          callback(null, contents);
        } catch (err2) {
          callback(err2, null);
        }
      },
      writeFile(contents, callback) {
        try {
          let tempFile = randomFileName();
          fs2.writeFileSync(tempFile, contents);
          callback(tempFile);
        } catch {
          callback(null);
        }
      }
    };
    var fsAsync = {
      readFile(tempFile, callback) {
        try {
          fs2.readFile(tempFile, "utf8", (err2, contents) => {
            try {
              fs2.unlink(tempFile, () => callback(err2, contents));
            } catch {
              callback(err2, contents);
            }
          });
        } catch (err2) {
          callback(err2, null);
        }
      },
      writeFile(contents, callback) {
        try {
          let tempFile = randomFileName();
          fs2.writeFile(tempFile, contents, (err2) => err2 !== null ? callback(null) : callback(tempFile));
        } catch {
          callback(null);
        }
      }
    };
    var version = "0.20.2";
    var build = (options) => ensureServiceIsRunning().build(options);
    var context = (buildOptions) => ensureServiceIsRunning().context(buildOptions);
    var transform = (input, options) => ensureServiceIsRunning().transform(input, options);
    var formatMessages = (messages, options) => ensureServiceIsRunning().formatMessages(messages, options);
    var analyzeMetafile = (messages, options) => ensureServiceIsRunning().analyzeMetafile(messages, options);
    var buildSync = (options) => {
      if (worker_threads && !isInternalWorkerThread) {
        if (!workerThreadService)
          workerThreadService = startWorkerThreadService(worker_threads);
        return workerThreadService.buildSync(options);
      }
      let result;
      runServiceSync((service) => service.buildOrContext({
        callName: "buildSync",
        refs: null,
        options,
        isTTY: isTTY(),
        defaultWD,
        callback: (err2, res) => {
          if (err2)
            throw err2;
          result = res;
        }
      }));
      return result;
    };
    var transformSync = (input, options) => {
      if (worker_threads && !isInternalWorkerThread) {
        if (!workerThreadService)
          workerThreadService = startWorkerThreadService(worker_threads);
        return workerThreadService.transformSync(input, options);
      }
      let result;
      runServiceSync((service) => service.transform({
        callName: "transformSync",
        refs: null,
        input,
        options: options || {},
        isTTY: isTTY(),
        fs: fsSync,
        callback: (err2, res) => {
          if (err2)
            throw err2;
          result = res;
        }
      }));
      return result;
    };
    var formatMessagesSync = (messages, options) => {
      if (worker_threads && !isInternalWorkerThread) {
        if (!workerThreadService)
          workerThreadService = startWorkerThreadService(worker_threads);
        return workerThreadService.formatMessagesSync(messages, options);
      }
      let result;
      runServiceSync((service) => service.formatMessages({
        callName: "formatMessagesSync",
        refs: null,
        messages,
        options,
        callback: (err2, res) => {
          if (err2)
            throw err2;
          result = res;
        }
      }));
      return result;
    };
    var analyzeMetafileSync = (metafile, options) => {
      if (worker_threads && !isInternalWorkerThread) {
        if (!workerThreadService)
          workerThreadService = startWorkerThreadService(worker_threads);
        return workerThreadService.analyzeMetafileSync(metafile, options);
      }
      let result;
      runServiceSync((service) => service.analyzeMetafile({
        callName: "analyzeMetafileSync",
        refs: null,
        metafile: typeof metafile === "string" ? metafile : JSON.stringify(metafile),
        options,
        callback: (err2, res) => {
          if (err2)
            throw err2;
          result = res;
        }
      }));
      return result;
    };
    var stop = () => {
      if (stopService)
        stopService();
      if (workerThreadService)
        workerThreadService.stop();
      return Promise.resolve();
    };
    var initializeWasCalled = false;
    var initialize = (options) => {
      options = validateInitializeOptions(options || {});
      if (options.wasmURL)
        throw new Error(`The "wasmURL" option only works in the browser`);
      if (options.wasmModule)
        throw new Error(`The "wasmModule" option only works in the browser`);
      if (options.worker)
        throw new Error(`The "worker" option only works in the browser`);
      if (initializeWasCalled)
        throw new Error('Cannot call "initialize" more than once');
      ensureServiceIsRunning();
      initializeWasCalled = true;
      return Promise.resolve();
    };
    var defaultWD = process.cwd();
    var longLivedService;
    var stopService;
    var ensureServiceIsRunning = () => {
      if (longLivedService)
        return longLivedService;
      let [command, args] = esbuildCommandAndArgs();
      let child = child_process.spawn(command, args.concat(`--service=${"0.20.2"}`, "--ping"), {
        windowsHide: true,
        stdio: ["pipe", "pipe", "inherit"],
        cwd: defaultWD
      });
      let { readFromStdout, afterClose, service } = createChannel({
        writeToStdin(bytes) {
          child.stdin.write(bytes, (err2) => {
            if (err2)
              afterClose(err2);
          });
        },
        readFileSync: fs2.readFileSync,
        isSync: false,
        hasFS: true,
        esbuild: node_exports
      });
      child.stdin.on("error", afterClose);
      child.on("error", afterClose);
      const stdin = child.stdin;
      const stdout = child.stdout;
      stdout.on("data", readFromStdout);
      stdout.on("end", afterClose);
      stopService = () => {
        stdin.destroy();
        stdout.destroy();
        child.kill();
        initializeWasCalled = false;
        longLivedService = void 0;
        stopService = void 0;
      };
      let refCount = 0;
      child.unref();
      if (stdin.unref) {
        stdin.unref();
      }
      if (stdout.unref) {
        stdout.unref();
      }
      const refs = {
        ref() {
          if (++refCount === 1)
            child.ref();
        },
        unref() {
          if (--refCount === 0)
            child.unref();
        }
      };
      longLivedService = {
        build: (options) => new Promise((resolve, reject) => {
          service.buildOrContext({
            callName: "build",
            refs,
            options,
            isTTY: isTTY(),
            defaultWD,
            callback: (err2, res) => err2 ? reject(err2) : resolve(res)
          });
        }),
        context: (options) => new Promise((resolve, reject) => service.buildOrContext({
          callName: "context",
          refs,
          options,
          isTTY: isTTY(),
          defaultWD,
          callback: (err2, res) => err2 ? reject(err2) : resolve(res)
        })),
        transform: (input, options) => new Promise((resolve, reject) => service.transform({
          callName: "transform",
          refs,
          input,
          options: options || {},
          isTTY: isTTY(),
          fs: fsAsync,
          callback: (err2, res) => err2 ? reject(err2) : resolve(res)
        })),
        formatMessages: (messages, options) => new Promise((resolve, reject) => service.formatMessages({
          callName: "formatMessages",
          refs,
          messages,
          options,
          callback: (err2, res) => err2 ? reject(err2) : resolve(res)
        })),
        analyzeMetafile: (metafile, options) => new Promise((resolve, reject) => service.analyzeMetafile({
          callName: "analyzeMetafile",
          refs,
          metafile: typeof metafile === "string" ? metafile : JSON.stringify(metafile),
          options,
          callback: (err2, res) => err2 ? reject(err2) : resolve(res)
        }))
      };
      return longLivedService;
    };
    var runServiceSync = (callback) => {
      let [command, args] = esbuildCommandAndArgs();
      let stdin = new Uint8Array();
      let { readFromStdout, afterClose, service } = createChannel({
        writeToStdin(bytes) {
          if (stdin.length !== 0)
            throw new Error("Must run at most one command");
          stdin = bytes;
        },
        isSync: true,
        hasFS: true,
        esbuild: node_exports
      });
      callback(service);
      let stdout = child_process.execFileSync(command, args.concat(`--service=${"0.20.2"}`), {
        cwd: defaultWD,
        windowsHide: true,
        input: stdin,
        // We don't know how large the output could be. If it's too large, the
        // command will fail with ENOBUFS. Reserve 16mb for now since that feels
        // like it should be enough. Also allow overriding this with an environment
        // variable.
        maxBuffer: +process.env.ESBUILD_MAX_BUFFER || 16 * 1024 * 1024
      });
      readFromStdout(stdout);
      afterClose(null);
    };
    var randomFileName = () => {
      return path2.join(os2.tmpdir(), `esbuild-${crypto3.randomBytes(32).toString("hex")}`);
    };
    var workerThreadService = null;
    var startWorkerThreadService = (worker_threads2) => {
      let { port1: mainPort, port2: workerPort } = new worker_threads2.MessageChannel();
      let worker = new worker_threads2.Worker(__filename, {
        workerData: { workerPort, defaultWD, esbuildVersion: "0.20.2" },
        transferList: [workerPort],
        // From node's documentation: https://nodejs.org/api/worker_threads.html
        //
        //   Take care when launching worker threads from preload scripts (scripts loaded
        //   and run using the `-r` command line flag). Unless the `execArgv` option is
        //   explicitly set, new Worker threads automatically inherit the command line flags
        //   from the running process and will preload the same preload scripts as the main
        //   thread. If the preload script unconditionally launches a worker thread, every
        //   thread spawned will spawn another until the application crashes.
        //
        execArgv: []
      });
      let nextID = 0;
      let fakeBuildError = (text) => {
        let error2 = new Error(`Build failed with 1 error:
error: ${text}`);
        let errors = [{ id: "", pluginName: "", text, location: null, notes: [], detail: void 0 }];
        error2.errors = errors;
        error2.warnings = [];
        return error2;
      };
      let validateBuildSyncOptions = (options) => {
        if (!options)
          return;
        let plugins = options.plugins;
        if (plugins && plugins.length > 0)
          throw fakeBuildError(`Cannot use plugins in synchronous API calls`);
      };
      let applyProperties = (object, properties) => {
        for (let key in properties) {
          object[key] = properties[key];
        }
      };
      let runCallSync = (command, args) => {
        let id = nextID++;
        let sharedBuffer = new SharedArrayBuffer(8);
        let sharedBufferView = new Int32Array(sharedBuffer);
        let msg = { sharedBuffer, id, command, args };
        worker.postMessage(msg);
        let status = Atomics.wait(sharedBufferView, 0, 0);
        if (status !== "ok" && status !== "not-equal")
          throw new Error("Internal error: Atomics.wait() failed: " + status);
        let { message: { id: id2, resolve, reject, properties } } = worker_threads2.receiveMessageOnPort(mainPort);
        if (id !== id2)
          throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
        if (reject) {
          applyProperties(reject, properties);
          throw reject;
        }
        return resolve;
      };
      worker.unref();
      return {
        buildSync(options) {
          validateBuildSyncOptions(options);
          return runCallSync("build", [options]);
        },
        transformSync(input, options) {
          return runCallSync("transform", [input, options]);
        },
        formatMessagesSync(messages, options) {
          return runCallSync("formatMessages", [messages, options]);
        },
        analyzeMetafileSync(metafile, options) {
          return runCallSync("analyzeMetafile", [metafile, options]);
        },
        stop() {
          worker.terminate();
          workerThreadService = null;
        }
      };
    };
    var startSyncServiceWorker = () => {
      let workerPort = worker_threads.workerData.workerPort;
      let parentPort = worker_threads.parentPort;
      let extractProperties = (object) => {
        let properties = {};
        if (object && typeof object === "object") {
          for (let key in object) {
            properties[key] = object[key];
          }
        }
        return properties;
      };
      try {
        let service = ensureServiceIsRunning();
        defaultWD = worker_threads.workerData.defaultWD;
        parentPort.on("message", (msg) => {
          (async () => {
            let { sharedBuffer, id, command, args } = msg;
            let sharedBufferView = new Int32Array(sharedBuffer);
            try {
              switch (command) {
                case "build":
                  workerPort.postMessage({ id, resolve: await service.build(args[0]) });
                  break;
                case "transform":
                  workerPort.postMessage({ id, resolve: await service.transform(args[0], args[1]) });
                  break;
                case "formatMessages":
                  workerPort.postMessage({ id, resolve: await service.formatMessages(args[0], args[1]) });
                  break;
                case "analyzeMetafile":
                  workerPort.postMessage({ id, resolve: await service.analyzeMetafile(args[0], args[1]) });
                  break;
                default:
                  throw new Error(`Invalid command: ${command}`);
              }
            } catch (reject) {
              workerPort.postMessage({ id, reject, properties: extractProperties(reject) });
            }
            Atomics.add(sharedBufferView, 0, 1);
            Atomics.notify(sharedBufferView, 0, Infinity);
          })();
        });
      } catch (reject) {
        parentPort.on("message", (msg) => {
          let { sharedBuffer, id } = msg;
          let sharedBufferView = new Int32Array(sharedBuffer);
          workerPort.postMessage({ id, reject, properties: extractProperties(reject) });
          Atomics.add(sharedBufferView, 0, 1);
          Atomics.notify(sharedBufferView, 0, Infinity);
        });
      }
    };
    if (isInternalWorkerThread) {
      startSyncServiceWorker();
    }
    var node_default = node_exports;
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error2) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error2) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error2) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error2) {
        return "[UnexpectedJSONParseError]: " + error2.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream2) {
      const level = supportsColor(stream2, stream2 && stream2.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util2 = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error2) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/esbuild-register/dist/node.js
var require_node2 = __commonJS({
  "node_modules/esbuild-register/dist/node.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __commonJS2 = (callback, module22) => () => {
      if (!module22) {
        module22 = { exports: {} };
        callback(module22.exports, module22);
      }
      return module22.exports;
    };
    var __exportStar = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames2(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc2(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __exportStar(__markAsModule(__defProp2(module22 != null ? __create2(__getProtoOf2(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    var require_base64 = __commonJS2((exports3) => {
      var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      exports3.encode = function(number) {
        if (0 <= number && number < intToCharMap.length) {
          return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
      };
      exports3.decode = function(charCode) {
        var bigA = 65;
        var bigZ = 90;
        var littleA = 97;
        var littleZ = 122;
        var zero = 48;
        var nine = 57;
        var plus = 43;
        var slash = 47;
        var littleOffset = 26;
        var numberOffset = 52;
        if (bigA <= charCode && charCode <= bigZ) {
          return charCode - bigA;
        }
        if (littleA <= charCode && charCode <= littleZ) {
          return charCode - littleA + littleOffset;
        }
        if (zero <= charCode && charCode <= nine) {
          return charCode - zero + numberOffset;
        }
        if (charCode == plus) {
          return 62;
        }
        if (charCode == slash) {
          return 63;
        }
        return -1;
      };
    });
    var require_base64_vlq = __commonJS2((exports3) => {
      var base64 = require_base64();
      var VLQ_BASE_SHIFT = 5;
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
      var VLQ_BASE_MASK = VLQ_BASE - 1;
      var VLQ_CONTINUATION_BIT = VLQ_BASE;
      function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
      }
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
      }
      exports3.encode = function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;
        var vlq = toVLQSigned(aValue);
        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);
        return encoded;
      };
      exports3.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;
        do {
          if (aIndex >= strLen) {
            throw new Error("Expected more digits in base 64 VLQ value.");
          }
          digit = base64.decode(aStr.charCodeAt(aIndex++));
          if (digit === -1) {
            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          }
          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);
        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
      };
    });
    var require_util = __commonJS2((exports3) => {
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      exports3.getArg = getArg;
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        };
      }
      exports3.urlParse = urlParse;
      function urlGenerate(aParsedUrl) {
        var url = "";
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ":";
        }
        url += "//";
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + "@";
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      exports3.urlGenerate = urlGenerate;
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = exports3.isAbsolute(path);
        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === ".") {
            parts.splice(i, 1);
          } else if (part === "..") {
            up++;
          } else if (up > 0) {
            if (part === "") {
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join("/");
        if (path === "") {
          path = isAbsolute ? "/" : ".";
        }
        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }
      exports3.normalize = normalize;
      function join2(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || "/";
        }
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      exports3.join = join2;
      exports3.isAbsolute = function(aPath) {
        return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
      };
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        aRoot = aRoot.replace(/\/$/, "");
        var level = 0;
        while (aPath.indexOf(aRoot + "/") !== 0) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) {
            return aPath;
          }
          aRoot = aRoot.slice(0, index);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }
          ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }
      exports3.relative = relative;
      var supportsNullProto = function() {
        var obj = /* @__PURE__ */ Object.create(null);
        return !("__proto__" in obj);
      }();
      function identity(s) {
        return s;
      }
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return "$" + aStr;
        }
        return aStr;
      }
      exports3.toSetString = supportsNullProto ? identity : toSetString;
      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }
        return aStr;
      }
      exports3.fromSetString = supportsNullProto ? identity : fromSetString;
      function isProtoString(s) {
        if (!s) {
          return false;
        }
        var length = s.length;
        if (length < 9) {
          return false;
        }
        if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
          return false;
        }
        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36) {
            return false;
          }
        }
        return true;
      }
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports3.compareByOriginalPositions = compareByOriginalPositions;
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports3.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }
        if (aStr1 === null) {
          return 1;
        }
        if (aStr2 === null) {
          return -1;
        }
        if (aStr1 > aStr2) {
          return 1;
        }
        return -1;
      }
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports3.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
      function parseSourceMapInput(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
      }
      exports3.parseSourceMapInput = parseSourceMapInput;
      function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
        sourceURL = sourceURL || "";
        if (sourceRoot) {
          if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
            sourceRoot += "/";
          }
          sourceURL = sourceRoot + sourceURL;
        }
        if (sourceMapURL) {
          var parsed = urlParse(sourceMapURL);
          if (!parsed) {
            throw new Error("sourceMapURL could not be parsed");
          }
          if (parsed.path) {
            var index = parsed.path.lastIndexOf("/");
            if (index >= 0) {
              parsed.path = parsed.path.substring(0, index + 1);
            }
          }
          sourceURL = join2(urlGenerate(parsed), sourceURL);
        }
        return normalize(sourceURL);
      }
      exports3.computeSourceURL = computeSourceURL;
    });
    var require_array_set = __commonJS2((exports3) => {
      var util2 = require_util();
      var has = Object.prototype.hasOwnProperty;
      var hasNativeMap = typeof Map !== "undefined";
      function ArraySet() {
        this._array = [];
        this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
      }
      ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      };
      ArraySet.prototype.size = function ArraySet_size() {
        return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
      };
      ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
        var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          if (hasNativeMap) {
            this._set.set(aStr, idx);
          } else {
            this._set[sStr] = idx;
          }
        }
      };
      ArraySet.prototype.has = function ArraySet_has(aStr) {
        if (hasNativeMap) {
          return this._set.has(aStr);
        } else {
          var sStr = util2.toSetString(aStr);
          return has.call(this._set, sStr);
        }
      };
      ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        if (hasNativeMap) {
          var idx = this._set.get(aStr);
          if (idx >= 0) {
            return idx;
          }
        } else {
          var sStr = util2.toSetString(aStr);
          if (has.call(this._set, sStr)) {
            return this._set[sStr];
          }
        }
        throw new Error('"' + aStr + '" is not in the set.');
      };
      ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error("No element indexed by " + aIdx);
      };
      ArraySet.prototype.toArray = function ArraySet_toArray() {
        return this._array.slice();
      };
      exports3.ArraySet = ArraySet;
    });
    var require_mapping_list = __commonJS2((exports3) => {
      var util2 = require_util();
      function generatedPositionAfter(mappingA, mappingB) {
        var lineA = mappingA.generatedLine;
        var lineB = mappingB.generatedLine;
        var columnA = mappingA.generatedColumn;
        var columnB = mappingB.generatedColumn;
        return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
      }
      function MappingList() {
        this._array = [];
        this._sorted = true;
        this._last = { generatedLine: -1, generatedColumn: 0 };
      }
      MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      };
      MappingList.prototype.add = function MappingList_add(aMapping) {
        if (generatedPositionAfter(this._last, aMapping)) {
          this._last = aMapping;
          this._array.push(aMapping);
        } else {
          this._sorted = false;
          this._array.push(aMapping);
        }
      };
      MappingList.prototype.toArray = function MappingList_toArray() {
        if (!this._sorted) {
          this._array.sort(util2.compareByGeneratedPositionsInflated);
          this._sorted = true;
        }
        return this._array;
      };
      exports3.MappingList = MappingList;
    });
    var require_source_map_generator = __commonJS2((exports3) => {
      var base64VLQ = require_base64_vlq();
      var util2 = require_util();
      var ArraySet = require_array_set().ArraySet;
      var MappingList = require_mapping_list().MappingList;
      function SourceMapGenerator(aArgs) {
        if (!aArgs) {
          aArgs = {};
        }
        this._file = util2.getArg(aArgs, "file", null);
        this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
        this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
        this._sources = new ArraySet();
        this._names = new ArraySet();
        this._mappings = new MappingList();
        this._sourcesContents = null;
      }
      SourceMapGenerator.prototype._version = 3;
      SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot;
        var generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot
        });
        aSourceMapConsumer.eachMapping(function(mapping) {
          var newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
          if (mapping.source != null) {
            newMapping.source = mapping.source;
            if (sourceRoot != null) {
              newMapping.source = util2.relative(sourceRoot, newMapping.source);
            }
            newMapping.original = {
              line: mapping.originalLine,
              column: mapping.originalColumn
            };
            if (mapping.name != null) {
              newMapping.name = mapping.name;
            }
          }
          generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          var sourceRelative = sourceFile;
          if (sourceRoot !== null) {
            sourceRelative = util2.relative(sourceRoot, sourceFile);
          }
          if (!generator._sources.has(sourceRelative)) {
            generator._sources.add(sourceRelative);
          }
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            generator.setSourceContent(sourceFile, content);
          }
        });
        return generator;
      };
      SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
        var generated = util2.getArg(aArgs, "generated");
        var original = util2.getArg(aArgs, "original", null);
        var source = util2.getArg(aArgs, "source", null);
        var name = util2.getArg(aArgs, "name", null);
        if (!this._skipValidation) {
          this._validateMapping(generated, original, source, name);
        }
        if (source != null) {
          source = String(source);
          if (!this._sources.has(source)) {
            this._sources.add(source);
          }
        }
        if (name != null) {
          name = String(name);
          if (!this._names.has(name)) {
            this._names.add(name);
          }
        }
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: original != null && original.line,
          originalColumn: original != null && original.column,
          source,
          name
        });
      };
      SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        if (this._sourceRoot != null) {
          source = util2.relative(this._sourceRoot, source);
        }
        if (aSourceContent != null) {
          if (!this._sourcesContents) {
            this._sourcesContents = /* @__PURE__ */ Object.create(null);
          }
          this._sourcesContents[util2.toSetString(source)] = aSourceContent;
        } else if (this._sourcesContents) {
          delete this._sourcesContents[util2.toSetString(source)];
          if (Object.keys(this._sourcesContents).length === 0) {
            this._sourcesContents = null;
          }
        }
      };
      SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        if (aSourceFile == null) {
          if (aSourceMapConsumer.file == null) {
            throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
          }
          sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = this._sourceRoot;
        if (sourceRoot != null) {
          sourceFile = util2.relative(sourceRoot, sourceFile);
        }
        var newSources = new ArraySet();
        var newNames = new ArraySet();
        this._mappings.unsortedForEach(function(mapping) {
          if (mapping.source === sourceFile && mapping.originalLine != null) {
            var original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            if (original.source != null) {
              mapping.source = original.source;
              if (aSourceMapPath != null) {
                mapping.source = util2.join(aSourceMapPath, mapping.source);
              }
              if (sourceRoot != null) {
                mapping.source = util2.relative(sourceRoot, mapping.source);
              }
              mapping.originalLine = original.line;
              mapping.originalColumn = original.column;
              if (original.name != null) {
                mapping.name = original.name;
              }
            }
          }
          var source = mapping.source;
          if (source != null && !newSources.has(source)) {
            newSources.add(source);
          }
          var name = mapping.name;
          if (name != null && !newNames.has(name)) {
            newNames.add(name);
          }
        }, this);
        this._sources = newSources;
        this._names = newNames;
        aSourceMapConsumer.sources.forEach(function(sourceFile2) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
          if (content != null) {
            if (aSourceMapPath != null) {
              sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
            }
            if (sourceRoot != null) {
              sourceFile2 = util2.relative(sourceRoot, sourceFile2);
            }
            this.setSourceContent(sourceFile2, content);
          }
        }, this);
      };
      SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
        if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
          throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
        }
        if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
          return;
        } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
          return;
        } else {
          throw new Error("Invalid mapping: " + JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          }));
        }
      };
      SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
        var previousGeneratedColumn = 0;
        var previousGeneratedLine = 1;
        var previousOriginalColumn = 0;
        var previousOriginalLine = 0;
        var previousName = 0;
        var previousSource = 0;
        var result = "";
        var next;
        var mapping;
        var nameIdx;
        var sourceIdx;
        var mappings = this._mappings.toArray();
        for (var i = 0, len = mappings.length; i < len; i++) {
          mapping = mappings[i];
          next = "";
          if (mapping.generatedLine !== previousGeneratedLine) {
            previousGeneratedColumn = 0;
            while (mapping.generatedLine !== previousGeneratedLine) {
              next += ";";
              previousGeneratedLine++;
            }
          } else {
            if (i > 0) {
              if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                continue;
              }
              next += ",";
            }
          }
          next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
          previousGeneratedColumn = mapping.generatedColumn;
          if (mapping.source != null) {
            sourceIdx = this._sources.indexOf(mapping.source);
            next += base64VLQ.encode(sourceIdx - previousSource);
            previousSource = sourceIdx;
            next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
            previousOriginalLine = mapping.originalLine - 1;
            next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
            previousOriginalColumn = mapping.originalColumn;
            if (mapping.name != null) {
              nameIdx = this._names.indexOf(mapping.name);
              next += base64VLQ.encode(nameIdx - previousName);
              previousName = nameIdx;
            }
          }
          result += next;
        }
        return result;
      };
      SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function(source) {
          if (!this._sourcesContents) {
            return null;
          }
          if (aSourceRoot != null) {
            source = util2.relative(aSourceRoot, source);
          }
          var key = util2.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
        }, this);
      };
      SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
        var map2 = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        if (this._file != null) {
          map2.file = this._file;
        }
        if (this._sourceRoot != null) {
          map2.sourceRoot = this._sourceRoot;
        }
        if (this._sourcesContents) {
          map2.sourcesContent = this._generateSourcesContent(map2.sources, map2.sourceRoot);
        }
        return map2;
      };
      SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
        return JSON.stringify(this.toJSON());
      };
      exports3.SourceMapGenerator = SourceMapGenerator;
    });
    var require_binary_search = __commonJS2((exports3) => {
      exports3.GREATEST_LOWER_BOUND = 1;
      exports3.LEAST_UPPER_BOUND = 2;
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          return mid;
        } else if (cmp > 0) {
          if (aHigh - mid > 1) {
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports3.LEAST_UPPER_BOUND) {
            return aHigh < aHaystack.length ? aHigh : -1;
          } else {
            return mid;
          }
        } else {
          if (mid - aLow > 1) {
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports3.LEAST_UPPER_BOUND) {
            return mid;
          } else {
            return aLow < 0 ? -1 : aLow;
          }
        }
      }
      exports3.search = function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
          return -1;
        }
        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports3.GREATEST_LOWER_BOUND);
        if (index < 0) {
          return -1;
        }
        while (index - 1 >= 0) {
          if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
            break;
          }
          --index;
        }
        return index;
      };
    });
    var require_quick_sort = __commonJS2((exports3) => {
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }
      function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
      }
      function doQuickSort(ary, comparator, p, r) {
        if (p < r) {
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;
          swap(ary, pivotIndex, r);
          var pivot = ary[r];
          for (var j = p; j < r; j++) {
            if (comparator(ary[j], pivot) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }
          swap(ary, i + 1, j);
          var q = i + 1;
          doQuickSort(ary, comparator, p, q - 1);
          doQuickSort(ary, comparator, q + 1, r);
        }
      }
      exports3.quickSort = function(ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
      };
    });
    var require_source_map_consumer = __commonJS2((exports3) => {
      var util2 = require_util();
      var binarySearch = require_binary_search();
      var ArraySet = require_array_set().ArraySet;
      var base64VLQ = require_base64_vlq();
      var quickSort = require_quick_sort().quickSort;
      function SourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util2.parseSourceMapInput(aSourceMap);
        }
        return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
      }
      SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
      };
      SourceMapConsumer.prototype._version = 3;
      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
        configurable: true,
        enumerable: true,
        get: function() {
          if (!this.__generatedMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__generatedMappings;
        }
      });
      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
        configurable: true,
        enumerable: true,
        get: function() {
          if (!this.__originalMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__originalMappings;
        }
      });
      SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
        var c = aStr.charAt(index);
        return c === ";" || c === ",";
      };
      SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
      };
      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;
      SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
      SourceMapConsumer.LEAST_UPPER_BOUND = 2;
      SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        var mappings;
        switch (order) {
          case SourceMapConsumer.GENERATED_ORDER:
            mappings = this._generatedMappings;
            break;
          case SourceMapConsumer.ORIGINAL_ORDER:
            mappings = this._originalMappings;
            break;
          default:
            throw new Error("Unknown order of iteration.");
        }
        var sourceRoot = this.sourceRoot;
        mappings.map(function(mapping) {
          var source = mapping.source === null ? null : this._sources.at(mapping.source);
          source = util2.computeSourceURL(sourceRoot, source, this._sourceMapURL);
          return {
            source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name === null ? null : this._names.at(mapping.name)
          };
        }, this).forEach(aCallback, context);
      };
      SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var line = util2.getArg(aArgs, "line");
        var needle = {
          source: util2.getArg(aArgs, "source"),
          originalLine: line,
          originalColumn: util2.getArg(aArgs, "column", 0)
        };
        needle.source = this._findSourceIndex(needle.source);
        if (needle.source < 0) {
          return [];
        }
        var mappings = [];
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util2.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (aArgs.column === void 0) {
            var originalLine = mapping.originalLine;
            while (mapping && mapping.originalLine === originalLine) {
              mappings.push({
                line: util2.getArg(mapping, "generatedLine", null),
                column: util2.getArg(mapping, "generatedColumn", null),
                lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          } else {
            var originalColumn = mapping.originalColumn;
            while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
              mappings.push({
                line: util2.getArg(mapping, "generatedLine", null),
                column: util2.getArg(mapping, "generatedColumn", null),
                lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          }
        }
        return mappings;
      };
      exports3.SourceMapConsumer = SourceMapConsumer;
      function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util2.parseSourceMapInput(aSourceMap);
        }
        var version = util2.getArg(sourceMap, "version");
        var sources = util2.getArg(sourceMap, "sources");
        var names = util2.getArg(sourceMap, "names", []);
        var sourceRoot = util2.getArg(sourceMap, "sourceRoot", null);
        var sourcesContent = util2.getArg(sourceMap, "sourcesContent", null);
        var mappings = util2.getArg(sourceMap, "mappings");
        var file = util2.getArg(sourceMap, "file", null);
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        if (sourceRoot) {
          sourceRoot = util2.normalize(sourceRoot);
        }
        sources = sources.map(String).map(util2.normalize).map(function(source) {
          return sourceRoot && util2.isAbsolute(sourceRoot) && util2.isAbsolute(source) ? util2.relative(sourceRoot, source) : source;
        });
        this._names = ArraySet.fromArray(names.map(String), true);
        this._sources = ArraySet.fromArray(sources, true);
        this._absoluteSources = this._sources.toArray().map(function(s) {
          return util2.computeSourceURL(sourceRoot, s, aSourceMapURL);
        });
        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this._sourceMapURL = aSourceMapURL;
        this.file = file;
      }
      BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
      BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
        var relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util2.relative(this.sourceRoot, relativeSource);
        }
        if (this._sources.has(relativeSource)) {
          return this._sources.indexOf(relativeSource);
        }
        var i;
        for (i = 0; i < this._absoluteSources.length; ++i) {
          if (this._absoluteSources[i] == aSource) {
            return i;
          }
        }
        return -1;
      };
      BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
        var smc = Object.create(BasicSourceMapConsumer.prototype);
        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;
        smc._sourceMapURL = aSourceMapURL;
        smc._absoluteSources = smc._sources.toArray().map(function(s) {
          return util2.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
        });
        var generatedMappings = aSourceMap._mappings.toArray().slice();
        var destGeneratedMappings = smc.__generatedMappings = [];
        var destOriginalMappings = smc.__originalMappings = [];
        for (var i = 0, length = generatedMappings.length; i < length; i++) {
          var srcMapping = generatedMappings[i];
          var destMapping = new Mapping();
          destMapping.generatedLine = srcMapping.generatedLine;
          destMapping.generatedColumn = srcMapping.generatedColumn;
          if (srcMapping.source) {
            destMapping.source = sources.indexOf(srcMapping.source);
            destMapping.originalLine = srcMapping.originalLine;
            destMapping.originalColumn = srcMapping.originalColumn;
            if (srcMapping.name) {
              destMapping.name = names.indexOf(srcMapping.name);
            }
            destOriginalMappings.push(destMapping);
          }
          destGeneratedMappings.push(destMapping);
        }
        quickSort(smc.__originalMappings, util2.compareByOriginalPositions);
        return smc;
      };
      BasicSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
        get: function() {
          return this._absoluteSources.slice();
        }
      });
      function Mapping() {
        this.generatedLine = 0;
        this.generatedColumn = 0;
        this.source = null;
        this.originalLine = null;
        this.originalColumn = null;
        this.name = null;
      }
      BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var length = aStr.length;
        var index = 0;
        var cachedSegments = {};
        var temp = {};
        var originalMappings = [];
        var generatedMappings = [];
        var mapping, str, segment, end, value;
        while (index < length) {
          if (aStr.charAt(index) === ";") {
            generatedLine++;
            index++;
            previousGeneratedColumn = 0;
          } else if (aStr.charAt(index) === ",") {
            index++;
          } else {
            mapping = new Mapping();
            mapping.generatedLine = generatedLine;
            for (end = index; end < length; end++) {
              if (this._charIsMappingSeparator(aStr, end)) {
                break;
              }
            }
            str = aStr.slice(index, end);
            segment = cachedSegments[str];
            if (segment) {
              index += str.length;
            } else {
              segment = [];
              while (index < end) {
                base64VLQ.decode(aStr, index, temp);
                value = temp.value;
                index = temp.rest;
                segment.push(value);
              }
              if (segment.length === 2) {
                throw new Error("Found a source, but no line and column");
              }
              if (segment.length === 3) {
                throw new Error("Found a source and line, but no column");
              }
              cachedSegments[str] = segment;
            }
            mapping.generatedColumn = previousGeneratedColumn + segment[0];
            previousGeneratedColumn = mapping.generatedColumn;
            if (segment.length > 1) {
              mapping.source = previousSource + segment[1];
              previousSource += segment[1];
              mapping.originalLine = previousOriginalLine + segment[2];
              previousOriginalLine = mapping.originalLine;
              mapping.originalLine += 1;
              mapping.originalColumn = previousOriginalColumn + segment[3];
              previousOriginalColumn = mapping.originalColumn;
              if (segment.length > 4) {
                mapping.name = previousName + segment[4];
                previousName += segment[4];
              }
            }
            generatedMappings.push(mapping);
            if (typeof mapping.originalLine === "number") {
              originalMappings.push(mapping);
            }
          }
        }
        quickSort(generatedMappings, util2.compareByGeneratedPositionsDeflated);
        this.__generatedMappings = generatedMappings;
        quickSort(originalMappings, util2.compareByOriginalPositions);
        this.__originalMappings = originalMappings;
      };
      BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        if (aNeedle[aLineName] <= 0) {
          throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
      };
      BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
        for (var index = 0; index < this._generatedMappings.length; ++index) {
          var mapping = this._generatedMappings[index];
          if (index + 1 < this._generatedMappings.length) {
            var nextMapping = this._generatedMappings[index + 1];
            if (mapping.generatedLine === nextMapping.generatedLine) {
              mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
              continue;
            }
          }
          mapping.lastGeneratedColumn = Infinity;
        }
      };
      BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util2.getArg(aArgs, "line"),
          generatedColumn: util2.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util2.compareByGeneratedPositionsDeflated, util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._generatedMappings[index];
          if (mapping.generatedLine === needle.generatedLine) {
            var source = util2.getArg(mapping, "source", null);
            if (source !== null) {
              source = this._sources.at(source);
              source = util2.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
            }
            var name = util2.getArg(mapping, "name", null);
            if (name !== null) {
              name = this._names.at(name);
            }
            return {
              source,
              line: util2.getArg(mapping, "originalLine", null),
              column: util2.getArg(mapping, "originalColumn", null),
              name
            };
          }
        }
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      };
      BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
        if (!this.sourcesContent) {
          return false;
        }
        return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
          return sc == null;
        });
      };
      BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        if (!this.sourcesContent) {
          return null;
        }
        var index = this._findSourceIndex(aSource);
        if (index >= 0) {
          return this.sourcesContent[index];
        }
        var relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util2.relative(this.sourceRoot, relativeSource);
        }
        var url;
        if (this.sourceRoot != null && (url = util2.urlParse(this.sourceRoot))) {
          var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
          if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }
          if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
            return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + relativeSource + '" is not in the SourceMap.');
        }
      };
      BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
        var source = util2.getArg(aArgs, "source");
        source = this._findSourceIndex(source);
        if (source < 0) {
          return {
            line: null,
            column: null,
            lastColumn: null
          };
        }
        var needle = {
          source,
          originalLine: util2.getArg(aArgs, "line"),
          originalColumn: util2.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util2.compareByOriginalPositions, util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (mapping.source === needle.source) {
            return {
              line: util2.getArg(mapping, "generatedLine", null),
              column: util2.getArg(mapping, "generatedColumn", null),
              lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
            };
          }
        }
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      };
      exports3.BasicSourceMapConsumer = BasicSourceMapConsumer;
      function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util2.parseSourceMapInput(aSourceMap);
        }
        var version = util2.getArg(sourceMap, "version");
        var sections = util2.getArg(sourceMap, "sections");
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        this._sources = new ArraySet();
        this._names = new ArraySet();
        var lastOffset = {
          line: -1,
          column: 0
        };
        this._sections = sections.map(function(s) {
          if (s.url) {
            throw new Error("Support for url field in sections not implemented.");
          }
          var offset = util2.getArg(s, "offset");
          var offsetLine = util2.getArg(offset, "line");
          var offsetColumn = util2.getArg(offset, "column");
          if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
            throw new Error("Section offsets must be ordered and non-overlapping.");
          }
          lastOffset = offset;
          return {
            generatedOffset: {
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1
            },
            consumer: new SourceMapConsumer(util2.getArg(s, "map"), aSourceMapURL)
          };
        });
      }
      IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
      IndexedSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
        get: function() {
          var sources = [];
          for (var i = 0; i < this._sections.length; i++) {
            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
              sources.push(this._sections[i].consumer.sources[j]);
            }
          }
          return sources;
        }
      });
      IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util2.getArg(aArgs, "line"),
          generatedColumn: util2.getArg(aArgs, "column")
        };
        var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
          var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }
          return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
        });
        var section = this._sections[sectionIndex];
        if (!section) {
          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        }
        return section.consumer.originalPositionFor({
          line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
          column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          bias: aArgs.bias
        });
      };
      IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
        return this._sections.every(function(s) {
          return s.consumer.hasContentsOfAllSources();
        });
      };
      IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var content = section.consumer.sourceContentFor(aSource, true);
          if (content) {
            return content;
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      };
      IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          if (section.consumer._findSourceIndex(util2.getArg(aArgs, "source")) === -1) {
            continue;
          }
          var generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            var ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
            };
            return ret;
          }
        }
        return {
          line: null,
          column: null
        };
      };
      IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var sectionMappings = section.consumer._generatedMappings;
          for (var j = 0; j < sectionMappings.length; j++) {
            var mapping = sectionMappings[j];
            var source = section.consumer._sources.at(mapping.source);
            source = util2.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
            this._sources.add(source);
            source = this._sources.indexOf(source);
            var name = null;
            if (mapping.name) {
              name = section.consumer._names.at(mapping.name);
              this._names.add(name);
              name = this._names.indexOf(name);
            }
            var adjustedMapping = {
              source,
              generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
              generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name
            };
            this.__generatedMappings.push(adjustedMapping);
            if (typeof adjustedMapping.originalLine === "number") {
              this.__originalMappings.push(adjustedMapping);
            }
          }
        }
        quickSort(this.__generatedMappings, util2.compareByGeneratedPositionsDeflated);
        quickSort(this.__originalMappings, util2.compareByOriginalPositions);
      };
      exports3.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
    });
    var require_source_node = __commonJS2((exports3) => {
      var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
      var util2 = require_util();
      var REGEX_NEWLINE = /(\r?\n)/;
      var NEWLINE_CODE = 10;
      var isSourceNode = "$$$isSourceNode$$$";
      function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
        this.children = [];
        this.sourceContents = {};
        this.line = aLine == null ? null : aLine;
        this.column = aColumn == null ? null : aColumn;
        this.source = aSource == null ? null : aSource;
        this.name = aName == null ? null : aName;
        this[isSourceNode] = true;
        if (aChunks != null)
          this.add(aChunks);
      }
      SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
        var node = new SourceNode();
        var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
        var remainingLinesIndex = 0;
        var shiftNextLine = function() {
          var lineContents = getNextLine();
          var newLine = getNextLine() || "";
          return lineContents + newLine;
          function getNextLine() {
            return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
          }
        };
        var lastGeneratedLine = 1, lastGeneratedColumn = 0;
        var lastMapping = null;
        aSourceMapConsumer.eachMapping(function(mapping) {
          if (lastMapping !== null) {
            if (lastGeneratedLine < mapping.generatedLine) {
              addMappingWithCode(lastMapping, shiftNextLine());
              lastGeneratedLine++;
              lastGeneratedColumn = 0;
            } else {
              var nextLine = remainingLines[remainingLinesIndex] || "";
              var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
              remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
              addMappingWithCode(lastMapping, code);
              lastMapping = mapping;
              return;
            }
          }
          while (lastGeneratedLine < mapping.generatedLine) {
            node.add(shiftNextLine());
            lastGeneratedLine++;
          }
          if (lastGeneratedColumn < mapping.generatedColumn) {
            var nextLine = remainingLines[remainingLinesIndex] || "";
            node.add(nextLine.substr(0, mapping.generatedColumn));
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
          }
          lastMapping = mapping;
        }, this);
        if (remainingLinesIndex < remainingLines.length) {
          if (lastMapping) {
            addMappingWithCode(lastMapping, shiftNextLine());
          }
          node.add(remainingLines.splice(remainingLinesIndex).join(""));
        }
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aRelativePath != null) {
              sourceFile = util2.join(aRelativePath, sourceFile);
            }
            node.setSourceContent(sourceFile, content);
          }
        });
        return node;
        function addMappingWithCode(mapping, code) {
          if (mapping === null || mapping.source === void 0) {
            node.add(code);
          } else {
            var source = aRelativePath ? util2.join(aRelativePath, mapping.source) : mapping.source;
            node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
          }
        }
      };
      SourceNode.prototype.add = function SourceNode_add(aChunk) {
        if (Array.isArray(aChunk)) {
          aChunk.forEach(function(chunk) {
            this.add(chunk);
          }, this);
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          if (aChunk) {
            this.children.push(aChunk);
          }
        } else {
          throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this;
      };
      SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
        if (Array.isArray(aChunk)) {
          for (var i = aChunk.length - 1; i >= 0; i--) {
            this.prepend(aChunk[i]);
          }
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          this.children.unshift(aChunk);
        } else {
          throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this;
      };
      SourceNode.prototype.walk = function SourceNode_walk(aFn) {
        var chunk;
        for (var i = 0, len = this.children.length; i < len; i++) {
          chunk = this.children[i];
          if (chunk[isSourceNode]) {
            chunk.walk(aFn);
          } else {
            if (chunk !== "") {
              aFn(chunk, {
                source: this.source,
                line: this.line,
                column: this.column,
                name: this.name
              });
            }
          }
        }
      };
      SourceNode.prototype.join = function SourceNode_join(aSep) {
        var newChildren;
        var i;
        var len = this.children.length;
        if (len > 0) {
          newChildren = [];
          for (i = 0; i < len - 1; i++) {
            newChildren.push(this.children[i]);
            newChildren.push(aSep);
          }
          newChildren.push(this.children[i]);
          this.children = newChildren;
        }
        return this;
      };
      SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
        var lastChild = this.children[this.children.length - 1];
        if (lastChild[isSourceNode]) {
          lastChild.replaceRight(aPattern, aReplacement);
        } else if (typeof lastChild === "string") {
          this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
        } else {
          this.children.push("".replace(aPattern, aReplacement));
        }
        return this;
      };
      SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
        this.sourceContents[util2.toSetString(aSourceFile)] = aSourceContent;
      };
      SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
        for (var i = 0, len = this.children.length; i < len; i++) {
          if (this.children[i][isSourceNode]) {
            this.children[i].walkSourceContents(aFn);
          }
        }
        var sources = Object.keys(this.sourceContents);
        for (var i = 0, len = sources.length; i < len; i++) {
          aFn(util2.fromSetString(sources[i]), this.sourceContents[sources[i]]);
        }
      };
      SourceNode.prototype.toString = function SourceNode_toString() {
        var str = "";
        this.walk(function(chunk) {
          str += chunk;
        });
        return str;
      };
      SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
        var generated = {
          code: "",
          line: 1,
          column: 0
        };
        var map2 = new SourceMapGenerator(aArgs);
        var sourceMappingActive = false;
        var lastOriginalSource = null;
        var lastOriginalLine = null;
        var lastOriginalColumn = null;
        var lastOriginalName = null;
        this.walk(function(chunk, original) {
          generated.code += chunk;
          if (original.source !== null && original.line !== null && original.column !== null) {
            if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
              map2.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
            lastOriginalSource = original.source;
            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            lastOriginalName = original.name;
            sourceMappingActive = true;
          } else if (sourceMappingActive) {
            map2.addMapping({
              generated: {
                line: generated.line,
                column: generated.column
              }
            });
            lastOriginalSource = null;
            sourceMappingActive = false;
          }
          for (var idx = 0, length = chunk.length; idx < length; idx++) {
            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
              generated.line++;
              generated.column = 0;
              if (idx + 1 === length) {
                lastOriginalSource = null;
                sourceMappingActive = false;
              } else if (sourceMappingActive) {
                map2.addMapping({
                  source: original.source,
                  original: {
                    line: original.line,
                    column: original.column
                  },
                  generated: {
                    line: generated.line,
                    column: generated.column
                  },
                  name: original.name
                });
              }
            } else {
              generated.column++;
            }
          }
        });
        this.walkSourceContents(function(sourceFile, sourceContent) {
          map2.setSourceContent(sourceFile, sourceContent);
        });
        return { code: generated.code, map: map2 };
      };
      exports3.SourceNode = SourceNode;
    });
    var require_source_map = __commonJS2((exports3) => {
      exports3.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
      exports3.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
      exports3.SourceNode = require_source_node().SourceNode;
    });
    var require_buffer_from = __commonJS2((exports3, module22) => {
      var toString = Object.prototype.toString;
      var isModern = typeof Buffer.alloc === "function" && typeof Buffer.allocUnsafe === "function" && typeof Buffer.from === "function";
      function isArrayBuffer(input) {
        return toString.call(input).slice(8, -1) === "ArrayBuffer";
      }
      function fromArrayBuffer(obj, byteOffset, length) {
        byteOffset >>>= 0;
        var maxLength = obj.byteLength - byteOffset;
        if (maxLength < 0) {
          throw new RangeError("'offset' is out of bounds");
        }
        if (length === void 0) {
          length = maxLength;
        } else {
          length >>>= 0;
          if (length > maxLength) {
            throw new RangeError("'length' is out of bounds");
          }
        }
        return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
      }
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding');
        }
        return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
      }
      function bufferFrom(value, encodingOrOffset, length) {
        if (typeof value === "number") {
          throw new TypeError('"value" argument must not be a number');
        }
        if (isArrayBuffer(value)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        return isModern ? Buffer.from(value) : new Buffer(value);
      }
      module22.exports = bufferFrom;
    });
    var require_source_map_support = __commonJS2((exports3, module22) => {
      var SourceMapConsumer = require_source_map().SourceMapConsumer;
      var path = require("path");
      var fs3;
      try {
        fs3 = require("fs");
        if (!fs3.existsSync || !fs3.readFileSync) {
          fs3 = null;
        }
      } catch (err2) {
      }
      var bufferFrom = require_buffer_from();
      function dynamicRequire(mod, request) {
        return mod.require(request);
      }
      var errorFormatterInstalled = false;
      var uncaughtShimInstalled = false;
      var emptyCacheBetweenOperations = false;
      var environment = "auto";
      var fileContentsCache = {};
      var sourceMapCache = {};
      var reSourceMap = /^data:application\/json[^,]+base64,/;
      var retrieveFileHandlers = [];
      var retrieveMapHandlers = [];
      function isInBrowser() {
        if (environment === "browser")
          return true;
        if (environment === "node")
          return false;
        return typeof window !== "undefined" && typeof XMLHttpRequest === "function" && !(window.require && window.module && window.process && window.process.type === "renderer");
      }
      function hasGlobalProcessEventEmitter() {
        return typeof process === "object" && process !== null && typeof process.on === "function";
      }
      function handlerExec(list) {
        return function(arg) {
          for (var i = 0; i < list.length; i++) {
            var ret = list[i](arg);
            if (ret) {
              return ret;
            }
          }
          return null;
        };
      }
      var retrieveFile = handlerExec(retrieveFileHandlers);
      retrieveFileHandlers.push(function(path2) {
        path2 = path2.trim();
        if (/^file:/.test(path2)) {
          path2 = path2.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
            return drive ? "" : "/";
          });
        }
        if (path2 in fileContentsCache) {
          return fileContentsCache[path2];
        }
        var contents = "";
        try {
          if (!fs3) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path2, false);
            xhr.send(null);
            if (xhr.readyState === 4 && xhr.status === 200) {
              contents = xhr.responseText;
            }
          } else if (fs3.existsSync(path2)) {
            contents = fs3.readFileSync(path2, "utf8");
          }
        } catch (er) {
        }
        return fileContentsCache[path2] = contents;
      });
      function supportRelativeURL(file, url) {
        if (!file)
          return url;
        var dir = path.dirname(file);
        var match = /^\w+:\/\/[^\/]*/.exec(dir);
        var protocol = match ? match[0] : "";
        var startPath = dir.slice(protocol.length);
        if (protocol && /^\/\w\:/.test(startPath)) {
          protocol += "/";
          return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, "/");
        }
        return protocol + path.resolve(dir.slice(protocol.length), url);
      }
      function retrieveSourceMapURL(source) {
        var fileData;
        if (isInBrowser()) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", source, false);
            xhr.send(null);
            fileData = xhr.readyState === 4 ? xhr.responseText : null;
            var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
            if (sourceMapHeader) {
              return sourceMapHeader;
            }
          } catch (e) {
          }
        }
        fileData = retrieveFile(source);
        var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
        var lastMatch, match;
        while (match = re.exec(fileData))
          lastMatch = match;
        if (!lastMatch)
          return null;
        return lastMatch[1];
      }
      var retrieveSourceMap = handlerExec(retrieveMapHandlers);
      retrieveMapHandlers.push(function(source) {
        var sourceMappingURL = retrieveSourceMapURL(source);
        if (!sourceMappingURL)
          return null;
        var sourceMapData;
        if (reSourceMap.test(sourceMappingURL)) {
          var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
          sourceMapData = bufferFrom(rawData, "base64").toString();
          sourceMappingURL = source;
        } else {
          sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
          sourceMapData = retrieveFile(sourceMappingURL);
        }
        if (!sourceMapData) {
          return null;
        }
        return {
          url: sourceMappingURL,
          map: sourceMapData
        };
      });
      function mapSourcePosition(position) {
        var sourceMap = sourceMapCache[position.source];
        if (!sourceMap) {
          var urlAndMap = retrieveSourceMap(position.source);
          if (urlAndMap) {
            sourceMap = sourceMapCache[position.source] = {
              url: urlAndMap.url,
              map: new SourceMapConsumer(urlAndMap.map)
            };
            if (sourceMap.map.sourcesContent) {
              sourceMap.map.sources.forEach(function(source, i) {
                var contents = sourceMap.map.sourcesContent[i];
                if (contents) {
                  var url = supportRelativeURL(sourceMap.url, source);
                  fileContentsCache[url] = contents;
                }
              });
            }
          } else {
            sourceMap = sourceMapCache[position.source] = {
              url: null,
              map: null
            };
          }
        }
        if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === "function") {
          var originalPosition = sourceMap.map.originalPositionFor(position);
          if (originalPosition.source !== null) {
            originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
            return originalPosition;
          }
        }
        return position;
      }
      function mapEvalOrigin(origin) {
        var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
        if (match) {
          var position = mapSourcePosition({
            source: match[2],
            line: +match[3],
            column: match[4] - 1
          });
          return "eval at " + match[1] + " (" + position.source + ":" + position.line + ":" + (position.column + 1) + ")";
        }
        match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
        if (match) {
          return "eval at " + match[1] + " (" + mapEvalOrigin(match[2]) + ")";
        }
        return origin;
      }
      function CallSiteToString() {
        var fileName;
        var fileLocation = "";
        if (this.isNative()) {
          fileLocation = "native";
        } else {
          fileName = this.getScriptNameOrSourceURL();
          if (!fileName && this.isEval()) {
            fileLocation = this.getEvalOrigin();
            fileLocation += ", ";
          }
          if (fileName) {
            fileLocation += fileName;
          } else {
            fileLocation += "<anonymous>";
          }
          var lineNumber = this.getLineNumber();
          if (lineNumber != null) {
            fileLocation += ":" + lineNumber;
            var columnNumber = this.getColumnNumber();
            if (columnNumber) {
              fileLocation += ":" + columnNumber;
            }
          }
        }
        var line = "";
        var functionName = this.getFunctionName();
        var addSuffix = true;
        var isConstructor = this.isConstructor();
        var isMethodCall = !(this.isToplevel() || isConstructor);
        if (isMethodCall) {
          var typeName = this.getTypeName();
          if (typeName === "[object Object]") {
            typeName = "null";
          }
          var methodName = this.getMethodName();
          if (functionName) {
            if (typeName && functionName.indexOf(typeName) != 0) {
              line += typeName + ".";
            }
            line += functionName;
            if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
              line += " [as " + methodName + "]";
            }
          } else {
            line += typeName + "." + (methodName || "<anonymous>");
          }
        } else if (isConstructor) {
          line += "new " + (functionName || "<anonymous>");
        } else if (functionName) {
          line += functionName;
        } else {
          line += fileLocation;
          addSuffix = false;
        }
        if (addSuffix) {
          line += " (" + fileLocation + ")";
        }
        return line;
      }
      function cloneCallSite(frame) {
        var object = {};
        Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
          object[name] = /^(?:is|get)/.test(name) ? function() {
            return frame[name].call(frame);
          } : frame[name];
        });
        object.toString = CallSiteToString;
        return object;
      }
      function wrapCallSite(frame, state) {
        if (state === void 0) {
          state = { nextPosition: null, curPosition: null };
        }
        if (frame.isNative()) {
          state.curPosition = null;
          return frame;
        }
        var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
        if (source) {
          var line = frame.getLineNumber();
          var column = frame.getColumnNumber() - 1;
          var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
          var headerLength = noHeader.test(process.version) ? 0 : 62;
          if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
            column -= headerLength;
          }
          var position = mapSourcePosition({
            source,
            line,
            column
          });
          state.curPosition = position;
          frame = cloneCallSite(frame);
          var originalFunctionName = frame.getFunctionName;
          frame.getFunctionName = function() {
            if (state.nextPosition == null) {
              return originalFunctionName();
            }
            return state.nextPosition.name || originalFunctionName();
          };
          frame.getFileName = function() {
            return position.source;
          };
          frame.getLineNumber = function() {
            return position.line;
          };
          frame.getColumnNumber = function() {
            return position.column + 1;
          };
          frame.getScriptNameOrSourceURL = function() {
            return position.source;
          };
          return frame;
        }
        var origin = frame.isEval() && frame.getEvalOrigin();
        if (origin) {
          origin = mapEvalOrigin(origin);
          frame = cloneCallSite(frame);
          frame.getEvalOrigin = function() {
            return origin;
          };
          return frame;
        }
        return frame;
      }
      function prepareStackTrace(error2, stack) {
        if (emptyCacheBetweenOperations) {
          fileContentsCache = {};
          sourceMapCache = {};
        }
        var name = error2.name || "Error";
        var message = error2.message || "";
        var errorString = name + ": " + message;
        var state = { nextPosition: null, curPosition: null };
        var processedStack = [];
        for (var i = stack.length - 1; i >= 0; i--) {
          processedStack.push("\n    at " + wrapCallSite(stack[i], state));
          state.nextPosition = state.curPosition;
        }
        state.curPosition = state.nextPosition = null;
        return errorString + processedStack.reverse().join("");
      }
      function getErrorSource(error2) {
        var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error2.stack);
        if (match) {
          var source = match[1];
          var line = +match[2];
          var column = +match[3];
          var contents = fileContentsCache[source];
          if (!contents && fs3 && fs3.existsSync(source)) {
            try {
              contents = fs3.readFileSync(source, "utf8");
            } catch (er) {
              contents = "";
            }
          }
          if (contents) {
            var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
            if (code) {
              return source + ":" + line + "\n" + code + "\n" + new Array(column).join(" ") + "^";
            }
          }
        }
        return null;
      }
      function printErrorAndExit(error2) {
        var source = getErrorSource(error2);
        if (process.stderr._handle && process.stderr._handle.setBlocking) {
          process.stderr._handle.setBlocking(true);
        }
        if (source) {
          console.error();
          console.error(source);
        }
        console.error(error2.stack);
        process.exit(1);
      }
      function shimEmitUncaughtException() {
        var origEmit = process.emit;
        process.emit = function(type) {
          if (type === "uncaughtException") {
            var hasStack = arguments[1] && arguments[1].stack;
            var hasListeners = this.listeners(type).length > 0;
            if (hasStack && !hasListeners) {
              return printErrorAndExit(arguments[1]);
            }
          }
          return origEmit.apply(this, arguments);
        };
      }
      var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
      var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);
      exports3.wrapCallSite = wrapCallSite;
      exports3.getErrorSource = getErrorSource;
      exports3.mapSourcePosition = mapSourcePosition;
      exports3.retrieveSourceMap = retrieveSourceMap;
      exports3.install = function(options) {
        options = options || {};
        if (options.environment) {
          environment = options.environment;
          if (["node", "browser", "auto"].indexOf(environment) === -1) {
            throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
          }
        }
        if (options.retrieveFile) {
          if (options.overrideRetrieveFile) {
            retrieveFileHandlers.length = 0;
          }
          retrieveFileHandlers.unshift(options.retrieveFile);
        }
        if (options.retrieveSourceMap) {
          if (options.overrideRetrieveSourceMap) {
            retrieveMapHandlers.length = 0;
          }
          retrieveMapHandlers.unshift(options.retrieveSourceMap);
        }
        if (options.hookRequire && !isInBrowser()) {
          var Module = dynamicRequire(module22, "module");
          var $compile = Module.prototype._compile;
          if (!$compile.__sourceMapSupport) {
            Module.prototype._compile = function(content, filename) {
              fileContentsCache[filename] = content;
              sourceMapCache[filename] = void 0;
              return $compile.call(this, content, filename);
            };
            Module.prototype._compile.__sourceMapSupport = true;
          }
        }
        if (!emptyCacheBetweenOperations) {
          emptyCacheBetweenOperations = "emptyCacheBetweenOperations" in options ? options.emptyCacheBetweenOperations : false;
        }
        if (!errorFormatterInstalled) {
          errorFormatterInstalled = true;
          Error.prepareStackTrace = prepareStackTrace;
        }
        if (!uncaughtShimInstalled) {
          var installHandler = "handleUncaughtExceptions" in options ? options.handleUncaughtExceptions : true;
          try {
            var worker_threads = dynamicRequire(module22, "worker_threads");
            if (worker_threads.isMainThread === false) {
              installHandler = false;
            }
          } catch (e) {
          }
          if (installHandler && hasGlobalProcessEventEmitter()) {
            uncaughtShimInstalled = true;
            shimEmitUncaughtException();
          }
        }
      };
      exports3.resetRetrieveHandlers = function() {
        retrieveFileHandlers.length = 0;
        retrieveMapHandlers.length = 0;
        retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
        retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);
        retrieveSourceMap = handlerExec(retrieveMapHandlers);
        retrieveFile = handlerExec(retrieveFileHandlers);
      };
    });
    var require_node_modules_regexp = __commonJS2((exports3, module22) => {
      "use strict";
      module22.exports = /^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/;
    });
    var require_lib = __commonJS2((exports3, module22) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", {
        value: true
      });
      exports3.addHook = addHook2;
      var _module = _interopRequireDefault(require("module"));
      var _path = _interopRequireDefault(require("path"));
      var _nodeModulesRegexp = _interopRequireDefault(require_node_modules_regexp());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var Module = module22.constructor.length > 1 ? module22.constructor : _module.default;
      var HOOK_RETURNED_NOTHING_ERROR_MESSAGE = "[Pirates] A hook returned a non-string, or nothing at all! This is a violation of intergalactic law!\n--------------------\nIf you have no idea what this means or what Pirates is, let me explain: Pirates is a module that makes is easy to implement require hooks. One of the require hooks you're using uses it. One of these require hooks didn't return anything from it's handler, so we don't know what to do. You might want to debug this.";
      function shouldCompile(filename, exts, matcher, ignoreNodeModules) {
        if (typeof filename !== "string") {
          return false;
        }
        if (exts.indexOf(_path.default.extname(filename)) === -1) {
          return false;
        }
        const resolvedFilename = _path.default.resolve(filename);
        if (ignoreNodeModules && _nodeModulesRegexp.default.test(resolvedFilename)) {
          return false;
        }
        if (matcher && typeof matcher === "function") {
          return !!matcher(resolvedFilename);
        }
        return true;
      }
      function addHook2(hook, opts = {}) {
        let reverted = false;
        const loaders = [];
        const oldLoaders = [];
        let exts;
        const originalJSLoader = Module._extensions[".js"];
        const matcher = opts.matcher || null;
        const ignoreNodeModules = opts.ignoreNodeModules !== false;
        exts = opts.extensions || opts.exts || opts.extension || opts.ext || [".js"];
        if (!Array.isArray(exts)) {
          exts = [exts];
        }
        exts.forEach((ext) => {
          if (typeof ext !== "string") {
            throw new TypeError(`Invalid Extension: ${ext}`);
          }
          const oldLoader = Module._extensions[ext] || originalJSLoader;
          oldLoaders[ext] = oldLoader;
          loaders[ext] = Module._extensions[ext] = function newLoader(mod, filename) {
            let compile;
            if (!reverted) {
              if (shouldCompile(filename, exts, matcher, ignoreNodeModules)) {
                compile = mod._compile;
                mod._compile = function _compile(code) {
                  mod._compile = compile;
                  const newCode = hook(code, filename);
                  if (typeof newCode !== "string") {
                    throw new Error(HOOK_RETURNED_NOTHING_ERROR_MESSAGE);
                  }
                  return mod._compile(newCode, filename);
                };
              }
            }
            oldLoader(mod, filename);
          };
        });
        return function revert() {
          if (reverted)
            return;
          reverted = true;
          exts.forEach((ext) => {
            if (Module._extensions[ext] === loaders[ext]) {
              Module._extensions[ext] = oldLoaders[ext];
            }
          });
        };
      }
    });
    var require_lib2 = __commonJS2((exports3, module22) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", {
        value: true
      });
      exports3.default = void 0;
      var _fs = _interopRequireDefault(require("fs"));
      var _path = _interopRequireDefault(require("path"));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error2) {
          reject(error2);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }
      function _asyncToGenerator(fn) {
        return function() {
          var self2 = this, args = arguments;
          return new Promise(function(resolve, reject) {
            var gen = fn.apply(self2, args);
            function _next(value) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err2) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err2);
            }
            _next(void 0);
          });
        };
      }
      var readFile = (fp) => new Promise((resolve, reject) => {
        _fs.default.readFile(fp, "utf8", (err2, data) => {
          if (err2)
            return reject(err2);
          resolve(data);
        });
      });
      var readFileSync = (fp) => {
        return _fs.default.readFileSync(fp, "utf8");
      };
      var pathExists = (fp) => new Promise((resolve) => {
        _fs.default.access(fp, (err2) => {
          resolve(!err2);
        });
      });
      var pathExistsSync = _fs.default.existsSync;
      var JoyCon2 = class {
        constructor({
          files,
          cwd = process.cwd(),
          stopDir,
          packageKey,
          parseJSON = JSON.parse
        } = {}) {
          this.options = {
            files,
            cwd,
            stopDir,
            packageKey,
            parseJSON
          };
          this.existsCache = /* @__PURE__ */ new Map();
          this.loaders = /* @__PURE__ */ new Set();
          this.packageJsonCache = /* @__PURE__ */ new Map();
        }
        addLoader(loader) {
          this.loaders.add(loader);
          return this;
        }
        removeLoader(name) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = this.loaders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const loader = _step.value;
              if (name && loader.name === name) {
                this.loaders.delete(loader);
              }
            }
          } catch (err2) {
            _didIteratorError = true;
            _iteratorError = err2;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
          return this;
        }
        recusivelyResolve(options) {
          var _this = this;
          return _asyncToGenerator(function* () {
            if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === "node_modules") {
              return null;
            }
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = void 0;
            try {
              for (var _iterator4 = options.files[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                const filename = _step4.value;
                const file = _path.default.resolve(options.cwd, filename);
                const exists = process.env.NODE_ENV !== "test" && _this.existsCache.has(file) ? _this.existsCache.get(file) : yield pathExists(file);
                _this.existsCache.set(file, exists);
                if (exists) {
                  if (!options.packageKey || _path.default.basename(file) !== "package.json") {
                    return file;
                  }
                  const data = require(file);
                  delete require.cache[file];
                  const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);
                  if (hasPackageKey) {
                    _this.packageJsonCache.set(file, data);
                    return file;
                  }
                }
                continue;
              }
            } catch (err2) {
              _didIteratorError4 = true;
              _iteratorError4 = err2;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
            return _this.recusivelyResolve(Object.assign({}, options, {
              cwd: _path.default.dirname(options.cwd)
            }));
          })();
        }
        recusivelyResolveSync(options) {
          if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === "node_modules") {
            return null;
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = options.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              const filename = _step2.value;
              const file = _path.default.resolve(options.cwd, filename);
              const exists = process.env.NODE_ENV !== "test" && this.existsCache.has(file) ? this.existsCache.get(file) : pathExistsSync(file);
              this.existsCache.set(file, exists);
              if (exists) {
                if (!options.packageKey || _path.default.basename(file) !== "package.json") {
                  return file;
                }
                const data = require(file);
                delete require.cache[file];
                const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);
                if (hasPackageKey) {
                  this.packageJsonCache.set(file, data);
                  return file;
                }
              }
              continue;
            }
          } catch (err2) {
            _didIteratorError2 = true;
            _iteratorError2 = err2;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          return this.recusivelyResolveSync(Object.assign({}, options, {
            cwd: _path.default.dirname(options.cwd)
          }));
        }
        resolve(...args) {
          var _this2 = this;
          return _asyncToGenerator(function* () {
            const options = _this2.normalizeOptions(args);
            return _this2.recusivelyResolve(options);
          })();
        }
        resolveSync(...args) {
          const options = this.normalizeOptions(args);
          return this.recusivelyResolveSync(options);
        }
        load(...args) {
          var _this3 = this;
          return _asyncToGenerator(function* () {
            const options = _this3.normalizeOptions(args);
            const filepath = yield _this3.recusivelyResolve(options);
            if (filepath) {
              const loader = _this3.findLoader(filepath);
              if (loader) {
                return {
                  path: filepath,
                  data: yield loader.load(filepath)
                };
              }
              const extname2 = _path.default.extname(filepath).slice(1);
              if (extname2 === "js") {
                delete require.cache[filepath];
                return {
                  path: filepath,
                  data: require(filepath)
                };
              }
              if (extname2 === "json") {
                if (_this3.packageJsonCache.has(filepath)) {
                  return {
                    path: filepath,
                    data: _this3.packageJsonCache.get(filepath)[options.packageKey]
                  };
                }
                const data = _this3.options.parseJSON(yield readFile(filepath));
                return {
                  path: filepath,
                  data
                };
              }
              return {
                path: filepath,
                data: yield readFile(filepath)
              };
            }
            return {};
          })();
        }
        loadSync(...args) {
          const options = this.normalizeOptions(args);
          const filepath = this.recusivelyResolveSync(options);
          if (filepath) {
            const loader = this.findLoader(filepath);
            if (loader) {
              return {
                path: filepath,
                data: loader.loadSync(filepath)
              };
            }
            const extname2 = _path.default.extname(filepath).slice(1);
            if (extname2 === "js") {
              delete require.cache[filepath];
              return {
                path: filepath,
                data: require(filepath)
              };
            }
            if (extname2 === "json") {
              if (this.packageJsonCache.has(filepath)) {
                return {
                  path: filepath,
                  data: this.packageJsonCache.get(filepath)[options.packageKey]
                };
              }
              const data = this.options.parseJSON(readFileSync(filepath));
              return {
                path: filepath,
                data
              };
            }
            return {
              path: filepath,
              data: readFileSync(filepath)
            };
          }
          return {};
        }
        findLoader(filepath) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = void 0;
          try {
            for (var _iterator3 = this.loaders[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              const loader = _step3.value;
              if (loader.test && loader.test.test(filepath)) {
                return loader;
              }
            }
          } catch (err2) {
            _didIteratorError3 = true;
            _iteratorError3 = err2;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          return null;
        }
        clearCache() {
          this.existsCache.clear();
          this.packageJsonCache.clear();
          return this;
        }
        normalizeOptions(args) {
          const options = Object.assign({}, this.options);
          if (Object.prototype.toString.call(args[0]) === "[object Object]") {
            Object.assign(options, args[0]);
          } else {
            if (args[0]) {
              options.files = args[0];
            }
            if (args[1]) {
              options.cwd = args[1];
            }
            if (args[2]) {
              options.stopDir = args[2];
            }
          }
          options.cwd = _path.default.resolve(options.cwd);
          options.stopDir = options.stopDir ? _path.default.resolve(options.stopDir) : _path.default.parse(options.cwd).root;
          if (!options.files || options.files.length === 0) {
            throw new Error("[joycon] files must be an non-empty array!");
          }
          options.__normalized__ = true;
          return options;
        }
      };
      exports3.default = JoyCon2;
      module22.exports = JoyCon2;
      module22.exports.default = JoyCon2;
    });
    var require_filesystem = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.removeExtension = exports3.fileExistsAsync = exports3.readJsonFromDiskAsync = exports3.readJsonFromDiskSync = exports3.fileExistsSync = void 0;
      var fs3 = require("fs");
      function fileExistsSync(path) {
        if (!fs3.existsSync(path)) {
          return false;
        }
        try {
          var stats = fs3.statSync(path);
          return stats.isFile();
        } catch (err2) {
          return false;
        }
      }
      exports3.fileExistsSync = fileExistsSync;
      function readJsonFromDiskSync(packageJsonPath) {
        if (!fs3.existsSync(packageJsonPath)) {
          return void 0;
        }
        return require(packageJsonPath);
      }
      exports3.readJsonFromDiskSync = readJsonFromDiskSync;
      function readJsonFromDiskAsync(path, callback) {
        fs3.readFile(path, "utf8", function(err2, result) {
          if (err2 || !result) {
            return callback();
          }
          var json = JSON.parse(result);
          return callback(void 0, json);
        });
      }
      exports3.readJsonFromDiskAsync = readJsonFromDiskAsync;
      function fileExistsAsync(path2, callback2) {
        fs3.stat(path2, function(err2, stats) {
          if (err2) {
            return callback2(void 0, false);
          }
          callback2(void 0, stats ? stats.isFile() : false);
        });
      }
      exports3.fileExistsAsync = fileExistsAsync;
      function removeExtension(path) {
        return path.substring(0, path.lastIndexOf(".")) || path;
      }
      exports3.removeExtension = removeExtension;
    });
    var require_mapping_entry = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.getAbsoluteMappingEntries = void 0;
      var path = require("path");
      function getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll) {
        var sortedKeys = sortByLongestPrefix(Object.keys(paths));
        var absolutePaths = [];
        for (var _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
          var key = sortedKeys_1[_i];
          absolutePaths.push({
            pattern: key,
            paths: paths[key].map(function(pathToResolve) {
              return path.resolve(absoluteBaseUrl, pathToResolve);
            })
          });
        }
        if (!paths["*"] && addMatchAll) {
          absolutePaths.push({
            pattern: "*",
            paths: ["".concat(absoluteBaseUrl.replace(/\/$/, ""), "/*")]
          });
        }
        return absolutePaths;
      }
      exports3.getAbsoluteMappingEntries = getAbsoluteMappingEntries;
      function sortByLongestPrefix(arr) {
        return arr.concat().sort(function(a, b) {
          return getPrefixLength(b) - getPrefixLength(a);
        });
      }
      function getPrefixLength(pattern) {
        var prefixLength = pattern.indexOf("*");
        return pattern.substr(0, prefixLength).length;
      }
    });
    var require_try_path = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.exhaustiveTypeException = exports3.getStrippedPath = exports3.getPathsToTry = void 0;
      var path = require("path");
      var path_1 = require("path");
      var filesystem_1 = require_filesystem();
      function getPathsToTry(extensions, absolutePathMappings, requestedModule) {
        if (!absolutePathMappings || !requestedModule || requestedModule[0] === ".") {
          return void 0;
        }
        var pathsToTry = [];
        for (var _i = 0, absolutePathMappings_1 = absolutePathMappings; _i < absolutePathMappings_1.length; _i++) {
          var entry = absolutePathMappings_1[_i];
          var starMatch = entry.pattern === requestedModule ? "" : matchStar(entry.pattern, requestedModule);
          if (starMatch !== void 0) {
            var _loop_1 = function(physicalPathPattern2) {
              var physicalPath = physicalPathPattern2.replace("*", starMatch);
              pathsToTry.push({ type: "file", path: physicalPath });
              pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "extension", path: physicalPath + e };
              }));
              pathsToTry.push({
                type: "package",
                path: path.join(physicalPath, "/package.json")
              });
              var indexPath = path.join(physicalPath, "/index");
              pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "index", path: indexPath + e };
              }));
            };
            for (var _a = 0, _b = entry.paths; _a < _b.length; _a++) {
              var physicalPathPattern = _b[_a];
              _loop_1(physicalPathPattern);
            }
          }
        }
        return pathsToTry.length === 0 ? void 0 : pathsToTry;
      }
      exports3.getPathsToTry = getPathsToTry;
      function getStrippedPath(tryPath) {
        return tryPath.type === "index" ? (0, path_1.dirname)(tryPath.path) : tryPath.type === "file" ? tryPath.path : tryPath.type === "extension" ? (0, filesystem_1.removeExtension)(tryPath.path) : tryPath.type === "package" ? tryPath.path : exhaustiveTypeException(tryPath.type);
      }
      exports3.getStrippedPath = getStrippedPath;
      function exhaustiveTypeException(check) {
        throw new Error("Unknown type ".concat(check));
      }
      exports3.exhaustiveTypeException = exhaustiveTypeException;
      function matchStar(pattern, search) {
        if (search.length < pattern.length) {
          return void 0;
        }
        if (pattern === "*") {
          return search;
        }
        var star = pattern.indexOf("*");
        if (star === -1) {
          return void 0;
        }
        var part1 = pattern.substring(0, star);
        var part2 = pattern.substring(star + 1);
        if (search.substr(0, star) !== part1) {
          return void 0;
        }
        if (search.substr(search.length - part2.length) !== part2) {
          return void 0;
        }
        return search.substr(star, search.length - part2.length);
      }
    });
    var require_match_path_sync = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.matchFromAbsolutePaths = exports3.createMatchPath = void 0;
      var path = require("path");
      var Filesystem = require_filesystem();
      var MappingEntry = require_mapping_entry();
      var TryPath = require_try_path();
      function createMatchPath2(absoluteBaseUrl, paths, mainFields, addMatchAll) {
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        if (addMatchAll === void 0) {
          addMatchAll = true;
        }
        var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
        return function(requestedModule, readJson, fileExists, extensions) {
          return matchFromAbsolutePaths(absolutePaths, requestedModule, readJson, fileExists, extensions, mainFields);
        };
      }
      exports3.createMatchPath = createMatchPath2;
      function matchFromAbsolutePaths(absolutePathMappings, requestedModule, readJson, fileExists, extensions, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskSync;
        }
        if (fileExists === void 0) {
          fileExists = Filesystem.fileExistsSync;
        }
        if (extensions === void 0) {
          extensions = Object.keys(require.extensions);
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
        if (!tryPaths) {
          return void 0;
        }
        return findFirstExistingPath(tryPaths, readJson, fileExists, mainFields);
      }
      exports3.matchFromAbsolutePaths = matchFromAbsolutePaths;
      function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExists) {
        for (var index = 0; index < mainFields.length; index++) {
          var mainFieldSelector = mainFields[index];
          var candidateMapping = typeof mainFieldSelector === "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
            return obj[key];
          }, packageJson);
          if (candidateMapping && typeof candidateMapping === "string") {
            var candidateFilePath = path.join(path.dirname(packageJsonPath), candidateMapping);
            if (fileExists(candidateFilePath)) {
              return candidateFilePath;
            }
          }
        }
        return void 0;
      }
      function findFirstExistingPath(tryPaths, readJson, fileExists, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskSync;
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        for (var _i = 0, tryPaths_1 = tryPaths; _i < tryPaths_1.length; _i++) {
          var tryPath = tryPaths_1[_i];
          if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
            if (fileExists(tryPath.path)) {
              return TryPath.getStrippedPath(tryPath);
            }
          } else if (tryPath.type === "package") {
            var packageJson = readJson(tryPath.path);
            if (packageJson) {
              var mainFieldMappedFile = findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists);
              if (mainFieldMappedFile) {
                return mainFieldMappedFile;
              }
            }
          } else {
            TryPath.exhaustiveTypeException(tryPath.type);
          }
        }
        return void 0;
      }
    });
    var require_match_path_async = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.matchFromAbsolutePathsAsync = exports3.createMatchPathAsync = void 0;
      var path = require("path");
      var TryPath = require_try_path();
      var MappingEntry = require_mapping_entry();
      var Filesystem = require_filesystem();
      function createMatchPathAsync(absoluteBaseUrl, paths, mainFields, addMatchAll) {
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        if (addMatchAll === void 0) {
          addMatchAll = true;
        }
        var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
        return function(requestedModule, readJson, fileExists, extensions, callback) {
          return matchFromAbsolutePathsAsync(absolutePaths, requestedModule, readJson, fileExists, extensions, callback, mainFields);
        };
      }
      exports3.createMatchPathAsync = createMatchPathAsync;
      function matchFromAbsolutePathsAsync(absolutePathMappings, requestedModule, readJson, fileExists, extensions, callback, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskAsync;
        }
        if (fileExists === void 0) {
          fileExists = Filesystem.fileExistsAsync;
        }
        if (extensions === void 0) {
          extensions = Object.keys(require.extensions);
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
        if (!tryPaths) {
          return callback();
        }
        findFirstExistingPath(tryPaths, readJson, fileExists, callback, 0, mainFields);
      }
      exports3.matchFromAbsolutePathsAsync = matchFromAbsolutePathsAsync;
      function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index) {
        if (index === void 0) {
          index = 0;
        }
        if (index >= mainFields.length) {
          return doneCallback(void 0, void 0);
        }
        var tryNext = function() {
          return findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index + 1);
        };
        var mainFieldSelector = mainFields[index];
        var mainFieldMapping = typeof mainFieldSelector === "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
          return obj[key];
        }, packageJson);
        if (typeof mainFieldMapping !== "string") {
          return tryNext();
        }
        var mappedFilePath = path.join(path.dirname(packageJsonPath), mainFieldMapping);
        fileExistsAsync(mappedFilePath, function(err2, exists) {
          if (err2) {
            return doneCallback(err2);
          }
          if (exists) {
            return doneCallback(void 0, mappedFilePath);
          }
          return tryNext();
        });
      }
      function findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index, mainFields) {
        if (index === void 0) {
          index = 0;
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPath = tryPaths[index];
        if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
          fileExists(tryPath.path, function(err2, exists) {
            if (err2) {
              return doneCallback(err2);
            }
            if (exists) {
              return doneCallback(void 0, TryPath.getStrippedPath(tryPath));
            }
            if (index === tryPaths.length - 1) {
              return doneCallback();
            }
            return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
          });
        } else if (tryPath.type === "package") {
          readJson(tryPath.path, function(err2, packageJson) {
            if (err2) {
              return doneCallback(err2);
            }
            if (packageJson) {
              return findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists, function(mainFieldErr, mainFieldMappedFile) {
                if (mainFieldErr) {
                  return doneCallback(mainFieldErr);
                }
                if (mainFieldMappedFile) {
                  return doneCallback(void 0, mainFieldMappedFile);
                }
                return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
              });
            }
            return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
          });
        } else {
          TryPath.exhaustiveTypeException(tryPath.type);
        }
      }
    });
    var require_unicode = __commonJS2((exports3, module22) => {
      module22.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
      module22.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
      module22.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
    });
    var require_util2 = __commonJS2((exports3, module22) => {
      var unicode = require_unicode();
      module22.exports = {
        isSpaceSeparator(c) {
          return typeof c === "string" && unicode.Space_Separator.test(c);
        },
        isIdStartChar(c) {
          return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
        },
        isIdContinueChar(c) {
          return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c));
        },
        isDigit(c) {
          return typeof c === "string" && /[0-9]/.test(c);
        },
        isHexDigit(c) {
          return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
        }
      };
    });
    var require_parse = __commonJS2((exports3, module22) => {
      var util2 = require_util2();
      var source;
      var parseState;
      var stack;
      var pos;
      var line;
      var column;
      var token;
      var key;
      var root;
      module22.exports = function parse(text, reviver) {
        source = String(text);
        parseState = "start";
        stack = [];
        pos = 0;
        line = 1;
        column = 0;
        token = void 0;
        key = void 0;
        root = void 0;
        do {
          token = lex();
          parseStates[parseState]();
        } while (token.type !== "eof");
        if (typeof reviver === "function") {
          return internalize({ "": root }, "", reviver);
        }
        return root;
      };
      function internalize(holder, name, reviver) {
        const value = holder[name];
        if (value != null && typeof value === "object") {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              const key2 = String(i);
              const replacement = internalize(value, key2, reviver);
              if (replacement === void 0) {
                delete value[key2];
              } else {
                Object.defineProperty(value, key2, {
                  value: replacement,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }
          } else {
            for (const key2 in value) {
              const replacement = internalize(value, key2, reviver);
              if (replacement === void 0) {
                delete value[key2];
              } else {
                Object.defineProperty(value, key2, {
                  value: replacement,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }
          }
        }
        return reviver.call(holder, name, value);
      }
      var lexState;
      var buffer;
      var doubleQuote;
      var sign;
      var c;
      function lex() {
        lexState = "default";
        buffer = "";
        doubleQuote = false;
        sign = 1;
        for (; ; ) {
          c = peek();
          const token2 = lexStates[lexState]();
          if (token2) {
            return token2;
          }
        }
      }
      function peek() {
        if (source[pos]) {
          return String.fromCodePoint(source.codePointAt(pos));
        }
      }
      function read() {
        const c2 = peek();
        if (c2 === "\n") {
          line++;
          column = 0;
        } else if (c2) {
          column += c2.length;
        } else {
          column++;
        }
        if (c2) {
          pos += c2.length;
        }
        return c2;
      }
      var lexStates = {
        default() {
          switch (c) {
            case "	":
            case "\v":
            case "\f":
            case " ":
            case "\xA0":
            case "\uFEFF":
            case "\n":
            case "\r":
            case "\u2028":
            case "\u2029":
              read();
              return;
            case "/":
              read();
              lexState = "comment";
              return;
            case void 0:
              read();
              return newToken("eof");
          }
          if (util2.isSpaceSeparator(c)) {
            read();
            return;
          }
          return lexStates[parseState]();
        },
        comment() {
          switch (c) {
            case "*":
              read();
              lexState = "multiLineComment";
              return;
            case "/":
              read();
              lexState = "singleLineComment";
              return;
          }
          throw invalidChar(read());
        },
        multiLineComment() {
          switch (c) {
            case "*":
              read();
              lexState = "multiLineCommentAsterisk";
              return;
            case void 0:
              throw invalidChar(read());
          }
          read();
        },
        multiLineCommentAsterisk() {
          switch (c) {
            case "*":
              read();
              return;
            case "/":
              read();
              lexState = "default";
              return;
            case void 0:
              throw invalidChar(read());
          }
          read();
          lexState = "multiLineComment";
        },
        singleLineComment() {
          switch (c) {
            case "\n":
            case "\r":
            case "\u2028":
            case "\u2029":
              read();
              lexState = "default";
              return;
            case void 0:
              read();
              return newToken("eof");
          }
          read();
        },
        value() {
          switch (c) {
            case "{":
            case "[":
              return newToken("punctuator", read());
            case "n":
              read();
              literal("ull");
              return newToken("null", null);
            case "t":
              read();
              literal("rue");
              return newToken("boolean", true);
            case "f":
              read();
              literal("alse");
              return newToken("boolean", false);
            case "-":
            case "+":
              if (read() === "-") {
                sign = -1;
              }
              lexState = "sign";
              return;
            case ".":
              buffer = read();
              lexState = "decimalPointLeading";
              return;
            case "0":
              buffer = read();
              lexState = "zero";
              return;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              buffer = read();
              lexState = "decimalInteger";
              return;
            case "I":
              read();
              literal("nfinity");
              return newToken("numeric", Infinity);
            case "N":
              read();
              literal("aN");
              return newToken("numeric", NaN);
            case '"':
            case "'":
              doubleQuote = read() === '"';
              buffer = "";
              lexState = "string";
              return;
          }
          throw invalidChar(read());
        },
        identifierNameStartEscape() {
          if (c !== "u") {
            throw invalidChar(read());
          }
          read();
          const u = unicodeEscape();
          switch (u) {
            case "$":
            case "_":
              break;
            default:
              if (!util2.isIdStartChar(u)) {
                throw invalidIdentifier();
              }
              break;
          }
          buffer += u;
          lexState = "identifierName";
        },
        identifierName() {
          switch (c) {
            case "$":
            case "_":
            case "\u200C":
            case "\u200D":
              buffer += read();
              return;
            case "\\":
              read();
              lexState = "identifierNameEscape";
              return;
          }
          if (util2.isIdContinueChar(c)) {
            buffer += read();
            return;
          }
          return newToken("identifier", buffer);
        },
        identifierNameEscape() {
          if (c !== "u") {
            throw invalidChar(read());
          }
          read();
          const u = unicodeEscape();
          switch (u) {
            case "$":
            case "_":
            case "\u200C":
            case "\u200D":
              break;
            default:
              if (!util2.isIdContinueChar(u)) {
                throw invalidIdentifier();
              }
              break;
          }
          buffer += u;
          lexState = "identifierName";
        },
        sign() {
          switch (c) {
            case ".":
              buffer = read();
              lexState = "decimalPointLeading";
              return;
            case "0":
              buffer = read();
              lexState = "zero";
              return;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              buffer = read();
              lexState = "decimalInteger";
              return;
            case "I":
              read();
              literal("nfinity");
              return newToken("numeric", sign * Infinity);
            case "N":
              read();
              literal("aN");
              return newToken("numeric", NaN);
          }
          throw invalidChar(read());
        },
        zero() {
          switch (c) {
            case ".":
              buffer += read();
              lexState = "decimalPoint";
              return;
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
            case "x":
            case "X":
              buffer += read();
              lexState = "hexadecimal";
              return;
          }
          return newToken("numeric", sign * 0);
        },
        decimalInteger() {
          switch (c) {
            case ".":
              buffer += read();
              lexState = "decimalPoint";
              return;
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util2.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalPointLeading() {
          if (util2.isDigit(c)) {
            buffer += read();
            lexState = "decimalFraction";
            return;
          }
          throw invalidChar(read());
        },
        decimalPoint() {
          switch (c) {
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util2.isDigit(c)) {
            buffer += read();
            lexState = "decimalFraction";
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalFraction() {
          switch (c) {
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util2.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalExponent() {
          switch (c) {
            case "+":
            case "-":
              buffer += read();
              lexState = "decimalExponentSign";
              return;
          }
          if (util2.isDigit(c)) {
            buffer += read();
            lexState = "decimalExponentInteger";
            return;
          }
          throw invalidChar(read());
        },
        decimalExponentSign() {
          if (util2.isDigit(c)) {
            buffer += read();
            lexState = "decimalExponentInteger";
            return;
          }
          throw invalidChar(read());
        },
        decimalExponentInteger() {
          if (util2.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        hexadecimal() {
          if (util2.isHexDigit(c)) {
            buffer += read();
            lexState = "hexadecimalInteger";
            return;
          }
          throw invalidChar(read());
        },
        hexadecimalInteger() {
          if (util2.isHexDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        string() {
          switch (c) {
            case "\\":
              read();
              buffer += escape();
              return;
            case '"':
              if (doubleQuote) {
                read();
                return newToken("string", buffer);
              }
              buffer += read();
              return;
            case "'":
              if (!doubleQuote) {
                read();
                return newToken("string", buffer);
              }
              buffer += read();
              return;
            case "\n":
            case "\r":
              throw invalidChar(read());
            case "\u2028":
            case "\u2029":
              separatorChar(c);
              break;
            case void 0:
              throw invalidChar(read());
          }
          buffer += read();
        },
        start() {
          switch (c) {
            case "{":
            case "[":
              return newToken("punctuator", read());
          }
          lexState = "value";
        },
        beforePropertyName() {
          switch (c) {
            case "$":
            case "_":
              buffer = read();
              lexState = "identifierName";
              return;
            case "\\":
              read();
              lexState = "identifierNameStartEscape";
              return;
            case "}":
              return newToken("punctuator", read());
            case '"':
            case "'":
              doubleQuote = read() === '"';
              lexState = "string";
              return;
          }
          if (util2.isIdStartChar(c)) {
            buffer += read();
            lexState = "identifierName";
            return;
          }
          throw invalidChar(read());
        },
        afterPropertyName() {
          if (c === ":") {
            return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        beforePropertyValue() {
          lexState = "value";
        },
        afterPropertyValue() {
          switch (c) {
            case ",":
            case "}":
              return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        beforeArrayValue() {
          if (c === "]") {
            return newToken("punctuator", read());
          }
          lexState = "value";
        },
        afterArrayValue() {
          switch (c) {
            case ",":
            case "]":
              return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        end() {
          throw invalidChar(read());
        }
      };
      function newToken(type, value) {
        return {
          type,
          value,
          line,
          column
        };
      }
      function literal(s) {
        for (const c2 of s) {
          const p = peek();
          if (p !== c2) {
            throw invalidChar(read());
          }
          read();
        }
      }
      function escape() {
        const c2 = peek();
        switch (c2) {
          case "b":
            read();
            return "\b";
          case "f":
            read();
            return "\f";
          case "n":
            read();
            return "\n";
          case "r":
            read();
            return "\r";
          case "t":
            read();
            return "	";
          case "v":
            read();
            return "\v";
          case "0":
            read();
            if (util2.isDigit(peek())) {
              throw invalidChar(read());
            }
            return "\0";
          case "x":
            read();
            return hexEscape();
          case "u":
            read();
            return unicodeEscape();
          case "\n":
          case "\u2028":
          case "\u2029":
            read();
            return "";
          case "\r":
            read();
            if (peek() === "\n") {
              read();
            }
            return "";
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            throw invalidChar(read());
          case void 0:
            throw invalidChar(read());
        }
        return read();
      }
      function hexEscape() {
        let buffer2 = "";
        let c2 = peek();
        if (!util2.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        c2 = peek();
        if (!util2.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      function unicodeEscape() {
        let buffer2 = "";
        let count = 4;
        while (count-- > 0) {
          const c2 = peek();
          if (!util2.isHexDigit(c2)) {
            throw invalidChar(read());
          }
          buffer2 += read();
        }
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      var parseStates = {
        start() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          push();
        },
        beforePropertyName() {
          switch (token.type) {
            case "identifier":
            case "string":
              key = token.value;
              parseState = "afterPropertyName";
              return;
            case "punctuator":
              pop();
              return;
            case "eof":
              throw invalidEOF();
          }
        },
        afterPropertyName() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          parseState = "beforePropertyValue";
        },
        beforePropertyValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          push();
        },
        beforeArrayValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          if (token.type === "punctuator" && token.value === "]") {
            pop();
            return;
          }
          push();
        },
        afterPropertyValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          switch (token.value) {
            case ",":
              parseState = "beforePropertyName";
              return;
            case "}":
              pop();
          }
        },
        afterArrayValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          switch (token.value) {
            case ",":
              parseState = "beforeArrayValue";
              return;
            case "]":
              pop();
          }
        },
        end() {
        }
      };
      function push() {
        let value;
        switch (token.type) {
          case "punctuator":
            switch (token.value) {
              case "{":
                value = {};
                break;
              case "[":
                value = [];
                break;
            }
            break;
          case "null":
          case "boolean":
          case "numeric":
          case "string":
            value = token.value;
            break;
        }
        if (root === void 0) {
          root = value;
        } else {
          const parent = stack[stack.length - 1];
          if (Array.isArray(parent)) {
            parent.push(value);
          } else {
            Object.defineProperty(parent, key, {
              value,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
        if (value !== null && typeof value === "object") {
          stack.push(value);
          if (Array.isArray(value)) {
            parseState = "beforeArrayValue";
          } else {
            parseState = "beforePropertyName";
          }
        } else {
          const current = stack[stack.length - 1];
          if (current == null) {
            parseState = "end";
          } else if (Array.isArray(current)) {
            parseState = "afterArrayValue";
          } else {
            parseState = "afterPropertyValue";
          }
        }
      }
      function pop() {
        stack.pop();
        const current = stack[stack.length - 1];
        if (current == null) {
          parseState = "end";
        } else if (Array.isArray(current)) {
          parseState = "afterArrayValue";
        } else {
          parseState = "afterPropertyValue";
        }
      }
      function invalidChar(c2) {
        if (c2 === void 0) {
          return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
        }
        return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
      }
      function invalidEOF() {
        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
      }
      function invalidIdentifier() {
        column -= 5;
        return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
      }
      function separatorChar(c2) {
        console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
      }
      function formatChar(c2) {
        const replacements = {
          "'": "\\'",
          '"': '\\"',
          "\\": "\\\\",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "	": "\\t",
          "\v": "\\v",
          "\0": "\\0",
          "\u2028": "\\u2028",
          "\u2029": "\\u2029"
        };
        if (replacements[c2]) {
          return replacements[c2];
        }
        if (c2 < " ") {
          const hexString = c2.charCodeAt(0).toString(16);
          return "\\x" + ("00" + hexString).substring(hexString.length);
        }
        return c2;
      }
      function syntaxError(message) {
        const err2 = new SyntaxError(message);
        err2.lineNumber = line;
        err2.columnNumber = column;
        return err2;
      }
    });
    var require_stringify = __commonJS2((exports3, module22) => {
      var util2 = require_util2();
      module22.exports = function stringify(value, replacer, space) {
        const stack = [];
        let indent = "";
        let propertyList;
        let replacerFunc;
        let gap = "";
        let quote;
        if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
          space = replacer.space;
          quote = replacer.quote;
          replacer = replacer.replacer;
        }
        if (typeof replacer === "function") {
          replacerFunc = replacer;
        } else if (Array.isArray(replacer)) {
          propertyList = [];
          for (const v of replacer) {
            let item;
            if (typeof v === "string") {
              item = v;
            } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
              item = String(v);
            }
            if (item !== void 0 && propertyList.indexOf(item) < 0) {
              propertyList.push(item);
            }
          }
        }
        if (space instanceof Number) {
          space = Number(space);
        } else if (space instanceof String) {
          space = String(space);
        }
        if (typeof space === "number") {
          if (space > 0) {
            space = Math.min(10, Math.floor(space));
            gap = "          ".substr(0, space);
          }
        } else if (typeof space === "string") {
          gap = space.substr(0, 10);
        }
        return serializeProperty("", { "": value });
        function serializeProperty(key, holder) {
          let value2 = holder[key];
          if (value2 != null) {
            if (typeof value2.toJSON5 === "function") {
              value2 = value2.toJSON5(key);
            } else if (typeof value2.toJSON === "function") {
              value2 = value2.toJSON(key);
            }
          }
          if (replacerFunc) {
            value2 = replacerFunc.call(holder, key, value2);
          }
          if (value2 instanceof Number) {
            value2 = Number(value2);
          } else if (value2 instanceof String) {
            value2 = String(value2);
          } else if (value2 instanceof Boolean) {
            value2 = value2.valueOf();
          }
          switch (value2) {
            case null:
              return "null";
            case true:
              return "true";
            case false:
              return "false";
          }
          if (typeof value2 === "string") {
            return quoteString(value2, false);
          }
          if (typeof value2 === "number") {
            return String(value2);
          }
          if (typeof value2 === "object") {
            return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
          }
          return void 0;
        }
        function quoteString(value2) {
          const quotes = {
            "'": 0.1,
            '"': 0.2
          };
          const replacements = {
            "'": "\\'",
            '"': '\\"',
            "\\": "\\\\",
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "	": "\\t",
            "\v": "\\v",
            "\0": "\\0",
            "\u2028": "\\u2028",
            "\u2029": "\\u2029"
          };
          let product = "";
          for (let i = 0; i < value2.length; i++) {
            const c = value2[i];
            switch (c) {
              case "'":
              case '"':
                quotes[c]++;
                product += c;
                continue;
              case "\0":
                if (util2.isDigit(value2[i + 1])) {
                  product += "\\x00";
                  continue;
                }
            }
            if (replacements[c]) {
              product += replacements[c];
              continue;
            }
            if (c < " ") {
              let hexString = c.charCodeAt(0).toString(16);
              product += "\\x" + ("00" + hexString).substring(hexString.length);
              continue;
            }
            product += c;
          }
          const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
          product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
          return quoteChar + product + quoteChar;
        }
        function serializeObject(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          let stepback = indent;
          indent = indent + gap;
          let keys = propertyList || Object.keys(value2);
          let partial = [];
          for (const key of keys) {
            const propertyString = serializeProperty(key, value2);
            if (propertyString !== void 0) {
              let member = serializeKey(key) + ":";
              if (gap !== "") {
                member += " ";
              }
              member += propertyString;
              partial.push(member);
            }
          }
          let final;
          if (partial.length === 0) {
            final = "{}";
          } else {
            let properties;
            if (gap === "") {
              properties = partial.join(",");
              final = "{" + properties + "}";
            } else {
              let separator = ",\n" + indent;
              properties = partial.join(separator);
              final = "{\n" + indent + properties + ",\n" + stepback + "}";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
        function serializeKey(key) {
          if (key.length === 0) {
            return quoteString(key, true);
          }
          const firstChar = String.fromCodePoint(key.codePointAt(0));
          if (!util2.isIdStartChar(firstChar)) {
            return quoteString(key, true);
          }
          for (let i = firstChar.length; i < key.length; i++) {
            if (!util2.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
              return quoteString(key, true);
            }
          }
          return key;
        }
        function serializeArray(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          let stepback = indent;
          indent = indent + gap;
          let partial = [];
          for (let i = 0; i < value2.length; i++) {
            const propertyString = serializeProperty(String(i), value2);
            partial.push(propertyString !== void 0 ? propertyString : "null");
          }
          let final;
          if (partial.length === 0) {
            final = "[]";
          } else {
            if (gap === "") {
              let properties = partial.join(",");
              final = "[" + properties + "]";
            } else {
              let separator = ",\n" + indent;
              let properties = partial.join(separator);
              final = "[\n" + indent + properties + ",\n" + stepback + "]";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
      };
    });
    var require_lib3 = __commonJS2((exports3, module22) => {
      var parse = require_parse();
      var stringify = require_stringify();
      var JSON5 = {
        parse,
        stringify
      };
      module22.exports = JSON5;
    });
    var require_strip_bom = __commonJS2((exports3, module22) => {
      "use strict";
      module22.exports = (x) => {
        if (typeof x !== "string") {
          throw new TypeError("Expected a string, got " + typeof x);
        }
        if (x.charCodeAt(0) === 65279) {
          return x.slice(1);
        }
        return x;
      };
    });
    var require_tsconfig_loader = __commonJS2((exports3) => {
      "use strict";
      var __assign = exports3 && exports3.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.loadTsconfig = exports3.walkForTsConfig = exports3.tsConfigLoader = void 0;
      var path = require("path");
      var fs3 = require("fs");
      var JSON5 = require_lib3();
      var StripBom = require_strip_bom();
      function tsConfigLoader(_a) {
        var getEnv = _a.getEnv, cwd = _a.cwd, _b = _a.loadSync, loadSync = _b === void 0 ? loadSyncDefault : _b;
        var TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT");
        var TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL");
        var loadResult = loadSync(cwd, TS_NODE_PROJECT, TS_NODE_BASEURL);
        return loadResult;
      }
      exports3.tsConfigLoader = tsConfigLoader;
      function loadSyncDefault(cwd, filename, baseUrl) {
        var configPath = resolveConfigPath(cwd, filename);
        if (!configPath) {
          return {
            tsConfigPath: void 0,
            baseUrl: void 0,
            paths: void 0
          };
        }
        var config = loadTsconfig(configPath);
        return {
          tsConfigPath: configPath,
          baseUrl: baseUrl || config && config.compilerOptions && config.compilerOptions.baseUrl,
          paths: config && config.compilerOptions && config.compilerOptions.paths
        };
      }
      function resolveConfigPath(cwd, filename) {
        if (filename) {
          var absolutePath = fs3.lstatSync(filename).isDirectory() ? path.resolve(filename, "./tsconfig.json") : path.resolve(cwd, filename);
          return absolutePath;
        }
        if (fs3.statSync(cwd).isFile()) {
          return path.resolve(cwd);
        }
        var configAbsolutePath = walkForTsConfig(cwd);
        return configAbsolutePath ? path.resolve(configAbsolutePath) : void 0;
      }
      function walkForTsConfig(directory, readdirSync) {
        if (readdirSync === void 0) {
          readdirSync = fs3.readdirSync;
        }
        var files = readdirSync(directory);
        var filesToCheck = ["tsconfig.json", "jsconfig.json"];
        for (var _i = 0, filesToCheck_1 = filesToCheck; _i < filesToCheck_1.length; _i++) {
          var fileToCheck = filesToCheck_1[_i];
          if (files.indexOf(fileToCheck) !== -1) {
            return path.join(directory, fileToCheck);
          }
        }
        var parentDirectory = path.dirname(directory);
        if (directory === parentDirectory) {
          return void 0;
        }
        return walkForTsConfig(parentDirectory, readdirSync);
      }
      exports3.walkForTsConfig = walkForTsConfig;
      function loadTsconfig(configFilePath, existsSync, readFileSync) {
        if (existsSync === void 0) {
          existsSync = fs3.existsSync;
        }
        if (readFileSync === void 0) {
          readFileSync = function(filename) {
            return fs3.readFileSync(filename, "utf8");
          };
        }
        if (!existsSync(configFilePath)) {
          return void 0;
        }
        var configString = readFileSync(configFilePath);
        var cleanedJson = StripBom(configString);
        var config;
        try {
          config = JSON5.parse(cleanedJson);
        } catch (e) {
          throw new Error("".concat(configFilePath, " is malformed ").concat(e.message));
        }
        var extendedConfig = config.extends;
        if (extendedConfig) {
          var base = void 0;
          if (Array.isArray(extendedConfig)) {
            base = extendedConfig.reduce(function(currBase, extendedConfigElement) {
              return mergeTsconfigs(currBase, loadTsconfigFromExtends(configFilePath, extendedConfigElement, existsSync, readFileSync));
            }, {});
          } else {
            base = loadTsconfigFromExtends(configFilePath, extendedConfig, existsSync, readFileSync);
          }
          return mergeTsconfigs(base, config);
        }
        return config;
      }
      exports3.loadTsconfig = loadTsconfig;
      function loadTsconfigFromExtends(configFilePath, extendedConfigValue, existsSync, readFileSync) {
        var _a;
        if (typeof extendedConfigValue === "string" && extendedConfigValue.indexOf(".json") === -1) {
          extendedConfigValue += ".json";
        }
        var currentDir = path.dirname(configFilePath);
        var extendedConfigPath = path.join(currentDir, extendedConfigValue);
        if (extendedConfigValue.indexOf("/") !== -1 && extendedConfigValue.indexOf(".") !== -1 && !existsSync(extendedConfigPath)) {
          extendedConfigPath = path.join(currentDir, "node_modules", extendedConfigValue);
        }
        var config = loadTsconfig(extendedConfigPath, existsSync, readFileSync) || {};
        if ((_a = config.compilerOptions) === null || _a === void 0 ? void 0 : _a.baseUrl) {
          var extendsDir = path.dirname(extendedConfigValue);
          config.compilerOptions.baseUrl = path.join(extendsDir, config.compilerOptions.baseUrl);
        }
        return config;
      }
      function mergeTsconfigs(base, config) {
        base = base || {};
        config = config || {};
        return __assign(__assign(__assign({}, base), config), { compilerOptions: __assign(__assign({}, base.compilerOptions), config.compilerOptions) });
      }
    });
    var require_config_loader = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.configLoader = exports3.loadConfig = void 0;
      var TsConfigLoader2 = require_tsconfig_loader();
      var path = require("path");
      function loadConfig2(cwd) {
        if (cwd === void 0) {
          cwd = process.cwd();
        }
        return configLoader({ cwd });
      }
      exports3.loadConfig = loadConfig2;
      function configLoader(_a) {
        var cwd = _a.cwd, explicitParams = _a.explicitParams, _b = _a.tsConfigLoader, tsConfigLoader = _b === void 0 ? TsConfigLoader2.tsConfigLoader : _b;
        if (explicitParams) {
          var absoluteBaseUrl = path.isAbsolute(explicitParams.baseUrl) ? explicitParams.baseUrl : path.join(cwd, explicitParams.baseUrl);
          return {
            resultType: "success",
            configFileAbsolutePath: "",
            baseUrl: explicitParams.baseUrl,
            absoluteBaseUrl,
            paths: explicitParams.paths,
            mainFields: explicitParams.mainFields,
            addMatchAll: explicitParams.addMatchAll
          };
        }
        var loadResult = tsConfigLoader({
          cwd,
          getEnv: function(key) {
            return process.env[key];
          }
        });
        if (!loadResult.tsConfigPath) {
          return {
            resultType: "failed",
            message: "Couldn't find tsconfig.json"
          };
        }
        return {
          resultType: "success",
          configFileAbsolutePath: loadResult.tsConfigPath,
          baseUrl: loadResult.baseUrl,
          absoluteBaseUrl: path.resolve(path.dirname(loadResult.tsConfigPath), loadResult.baseUrl || ""),
          paths: loadResult.paths || {},
          addMatchAll: loadResult.baseUrl !== void 0
        };
      }
      exports3.configLoader = configLoader;
    });
    var require_minimist = __commonJS2((exports3, module22) => {
      "use strict";
      function hasKey(obj, keys) {
        var o = obj;
        keys.slice(0, -1).forEach(function(key2) {
          o = o[key2] || {};
        });
        var key = keys[keys.length - 1];
        return key in o;
      }
      function isNumber(x) {
        if (typeof x === "number") {
          return true;
        }
        if (/^0x[0-9a-f]+$/i.test(x)) {
          return true;
        }
        return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
      }
      function isConstructorOrProto(obj, key) {
        return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
      }
      module22.exports = function(args, opts) {
        if (!opts) {
          opts = {};
        }
        var flags = {
          bools: {},
          strings: {},
          unknownFn: null
        };
        if (typeof opts.unknown === "function") {
          flags.unknownFn = opts.unknown;
        }
        if (typeof opts.boolean === "boolean" && opts.boolean) {
          flags.allBools = true;
        } else {
          [].concat(opts.boolean).filter(Boolean).forEach(function(key2) {
            flags.bools[key2] = true;
          });
        }
        var aliases = {};
        function aliasIsBoolean(key2) {
          return aliases[key2].some(function(x) {
            return flags.bools[x];
          });
        }
        Object.keys(opts.alias || {}).forEach(function(key2) {
          aliases[key2] = [].concat(opts.alias[key2]);
          aliases[key2].forEach(function(x) {
            aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
              return x !== y;
            }));
          });
        });
        [].concat(opts.string).filter(Boolean).forEach(function(key2) {
          flags.strings[key2] = true;
          if (aliases[key2]) {
            [].concat(aliases[key2]).forEach(function(k) {
              flags.strings[k] = true;
            });
          }
        });
        var defaults = opts.default || {};
        var argv = { _: [] };
        function argDefined(key2, arg2) {
          return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
        }
        function setKey(obj, keys, value2) {
          var o = obj;
          for (var i2 = 0; i2 < keys.length - 1; i2++) {
            var key2 = keys[i2];
            if (isConstructorOrProto(o, key2)) {
              return;
            }
            if (o[key2] === void 0) {
              o[key2] = {};
            }
            if (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype) {
              o[key2] = {};
            }
            if (o[key2] === Array.prototype) {
              o[key2] = [];
            }
            o = o[key2];
          }
          var lastKey = keys[keys.length - 1];
          if (isConstructorOrProto(o, lastKey)) {
            return;
          }
          if (o === Object.prototype || o === Number.prototype || o === String.prototype) {
            o = {};
          }
          if (o === Array.prototype) {
            o = [];
          }
          if (o[lastKey] === void 0 || flags.bools[lastKey] || typeof o[lastKey] === "boolean") {
            o[lastKey] = value2;
          } else if (Array.isArray(o[lastKey])) {
            o[lastKey].push(value2);
          } else {
            o[lastKey] = [o[lastKey], value2];
          }
        }
        function setArg(key2, val, arg2) {
          if (arg2 && flags.unknownFn && !argDefined(key2, arg2)) {
            if (flags.unknownFn(arg2) === false) {
              return;
            }
          }
          var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
          setKey(argv, key2.split("."), value2);
          (aliases[key2] || []).forEach(function(x) {
            setKey(argv, x.split("."), value2);
          });
        }
        Object.keys(flags.bools).forEach(function(key2) {
          setArg(key2, defaults[key2] === void 0 ? false : defaults[key2]);
        });
        var notFlags = [];
        if (args.indexOf("--") !== -1) {
          notFlags = args.slice(args.indexOf("--") + 1);
          args = args.slice(0, args.indexOf("--"));
        }
        for (var i = 0; i < args.length; i++) {
          var arg = args[i];
          var key;
          var next;
          if (/^--.+=/.test(arg)) {
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
              value = value !== "false";
            }
            setArg(key, value, arg);
          } else if (/^--no-.+/.test(arg)) {
            key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
          } else if (/^--.+/.test(arg)) {
            key = arg.match(/^--(.+)/)[1];
            next = args[i + 1];
            if (next !== void 0 && !/^(-|--)[^-]/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
              setArg(key, next, arg);
              i += 1;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next === "true", arg);
              i += 1;
            } else {
              setArg(key, flags.strings[key] ? "" : true, arg);
            }
          } else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1, -1).split("");
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
              next = arg.slice(j + 2);
              if (next === "-") {
                setArg(letters[j], next, arg);
                continue;
              }
              if (/[A-Za-z]/.test(letters[j]) && next[0] === "=") {
                setArg(letters[j], next.slice(1), arg);
                broken = true;
                break;
              }
              if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                setArg(letters[j], next, arg);
                broken = true;
                break;
              }
              if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                setArg(letters[j], arg.slice(j + 2), arg);
                broken = true;
                break;
              } else {
                setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
              }
            }
            key = arg.slice(-1)[0];
            if (!broken && key !== "-") {
              if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, args[i + 1], arg);
                i += 1;
              } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                setArg(key, args[i + 1] === "true", arg);
                i += 1;
              } else {
                setArg(key, flags.strings[key] ? "" : true, arg);
              }
            }
          } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
              argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
            }
            if (opts.stopEarly) {
              argv._.push.apply(argv._, args.slice(i + 1));
              break;
            }
          }
        }
        Object.keys(defaults).forEach(function(k) {
          if (!hasKey(argv, k.split("."))) {
            setKey(argv, k.split("."), defaults[k]);
            (aliases[k] || []).forEach(function(x) {
              setKey(argv, x.split("."), defaults[k]);
            });
          }
        });
        if (opts["--"]) {
          argv["--"] = notFlags.slice();
        } else {
          notFlags.forEach(function(k) {
            argv._.push(k);
          });
        }
        return argv;
      };
    });
    var require_register = __commonJS2((exports3) => {
      "use strict";
      var __spreadArray = exports3 && exports3.__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.register = void 0;
      var match_path_sync_1 = require_match_path_sync();
      var config_loader_1 = require_config_loader();
      var noOp2 = function() {
        return void 0;
      };
      function getCoreModules(builtinModules2) {
        builtinModules2 = builtinModules2 || [
          "assert",
          "buffer",
          "child_process",
          "cluster",
          "crypto",
          "dgram",
          "dns",
          "domain",
          "events",
          "fs",
          "http",
          "https",
          "net",
          "os",
          "path",
          "punycode",
          "querystring",
          "readline",
          "stream",
          "string_decoder",
          "tls",
          "tty",
          "url",
          "util",
          "v8",
          "vm",
          "zlib"
        ];
        var coreModules = {};
        for (var _i = 0, builtinModules_1 = builtinModules2; _i < builtinModules_1.length; _i++) {
          var module_1 = builtinModules_1[_i];
          coreModules[module_1] = true;
        }
        return coreModules;
      }
      function register2(params) {
        var cwd;
        var explicitParams;
        if (params) {
          cwd = params.cwd;
          if (params.baseUrl || params.paths) {
            explicitParams = params;
          }
        } else {
          var minimist = require_minimist();
          var argv = minimist(process.argv.slice(2), {
            string: ["project"],
            alias: {
              project: ["P"]
            }
          });
          cwd = argv.project;
        }
        var configLoaderResult = (0, config_loader_1.configLoader)({
          cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
          explicitParams
        });
        if (configLoaderResult.resultType === "failed") {
          console.warn("".concat(configLoaderResult.message, ". tsconfig-paths will be skipped"));
          return noOp2;
        }
        var matchPath = (0, match_path_sync_1.createMatchPath)(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll);
        var Module = require("module");
        var originalResolveFilename = Module._resolveFilename;
        var coreModules = getCoreModules(Module.builtinModules);
        Module._resolveFilename = function(request, _parent) {
          var isCoreModule = coreModules.hasOwnProperty(request);
          if (!isCoreModule) {
            var found = matchPath(request);
            if (found) {
              var modifiedArguments = __spreadArray([found], [].slice.call(arguments, 1), true);
              return originalResolveFilename.apply(this, modifiedArguments);
            }
          }
          return originalResolveFilename.apply(this, arguments);
        };
        return function() {
          Module._resolveFilename = originalResolveFilename;
        };
      }
      exports3.register = register2;
    });
    var require_lib4 = __commonJS2((exports3) => {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.loadConfig = exports3.register = exports3.matchFromAbsolutePathsAsync = exports3.createMatchPathAsync = exports3.matchFromAbsolutePaths = exports3.createMatchPath = void 0;
      var match_path_sync_1 = require_match_path_sync();
      Object.defineProperty(exports3, "createMatchPath", { enumerable: true, get: function() {
        return match_path_sync_1.createMatchPath;
      } });
      Object.defineProperty(exports3, "matchFromAbsolutePaths", { enumerable: true, get: function() {
        return match_path_sync_1.matchFromAbsolutePaths;
      } });
      var match_path_async_1 = require_match_path_async();
      Object.defineProperty(exports3, "createMatchPathAsync", { enumerable: true, get: function() {
        return match_path_async_1.createMatchPathAsync;
      } });
      Object.defineProperty(exports3, "matchFromAbsolutePathsAsync", { enumerable: true, get: function() {
        return match_path_async_1.matchFromAbsolutePathsAsync;
      } });
      var register_1 = require_register();
      Object.defineProperty(exports3, "register", { enumerable: true, get: function() {
        return register_1.register;
      } });
      var config_loader_1 = require_config_loader();
      Object.defineProperty(exports3, "loadConfig", { enumerable: true, get: function() {
        return config_loader_1.loadConfig;
      } });
    });
    var import_source_map_support = __toModule(require_source_map_support());
    var import_pirates = __toModule(require_lib());
    var _path2 = require("path");
    var _esbuild = require_main();
    var _fs2 = require("fs");
    var _fs3 = _interopRequireDefault2(_fs2);
    var _module2 = require("module");
    var _module3 = _interopRequireDefault2(_module2);
    var _process = require("process");
    var _process2 = _interopRequireDefault2(_process);
    var import_joycon = __toModule(require_lib2());
    var singleComment = Symbol("singleComment");
    var multiComment = Symbol("multiComment");
    var stripWithoutWhitespace = () => "";
    var stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, " ");
    var isEscaped = (jsonString, quotePosition) => {
      let index = quotePosition - 1;
      let backslashCount = 0;
      while (jsonString[index] === "\\") {
        index -= 1;
        backslashCount += 1;
      }
      return Boolean(backslashCount % 2);
    };
    function stripJsonComments(jsonString, { whitespace = true } = {}) {
      if (typeof jsonString !== "string") {
        throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
      }
      const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
      let isInsideString = false;
      let isInsideComment = false;
      let offset = 0;
      let result = "";
      for (let index = 0; index < jsonString.length; index++) {
        const currentCharacter = jsonString[index];
        const nextCharacter = jsonString[index + 1];
        if (!isInsideComment && currentCharacter === '"') {
          const escaped = isEscaped(jsonString, index);
          if (!escaped) {
            isInsideString = !isInsideString;
          }
        }
        if (isInsideString) {
          continue;
        }
        if (!isInsideComment && currentCharacter + nextCharacter === "//") {
          result += jsonString.slice(offset, index);
          offset = index;
          isInsideComment = singleComment;
          index++;
        } else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
          index++;
          isInsideComment = false;
          result += strip(jsonString, offset, index);
          offset = index;
          continue;
        } else if (isInsideComment === singleComment && currentCharacter === "\n") {
          isInsideComment = false;
          result += strip(jsonString, offset, index);
          offset = index;
        } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
          result += jsonString.slice(offset, index);
          offset = index;
          isInsideComment = multiComment;
          index++;
          continue;
        } else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
          index++;
          isInsideComment = false;
          result += strip(jsonString, offset, index + 1);
          offset = index + 1;
          continue;
        }
      }
      return result + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
    }
    var nodeVersion = (process.versions.node.match(/^(\d+)\.(\d+)/) || []).slice(1).map(Number);
    function removeNodePrefix(code) {
      if (nodeVersion[0] <= 14 && nodeVersion[1] < 18) {
        return code.replace(/([\b\(])require\("node:([^"]+)"\)([\b\)])/g, '$1require("$2")$3');
      }
      return code;
    }
    function jsoncParse(data) {
      try {
        return new Function("return " + stripJsonComments(data).trim())();
      } catch (_) {
        return {};
      }
    }
    var joycon = new import_joycon.default();
    joycon.addLoader({
      test: /\.json$/,
      loadSync: (file) => {
        const content = _fs3.default.readFileSync(file, "utf8");
        return jsoncParse(content);
      }
    });
    var getOptions = (cwd) => {
      var _a, _b, _c, _d;
      const { data, path } = joycon.loadSync(["tsconfig.json", "jsconfig.json"], cwd);
      if (path && data) {
        return {
          jsxFactory: (_a = data.compilerOptions) == null ? void 0 : _a.jsxFactory,
          jsxFragment: (_b = data.compilerOptions) == null ? void 0 : _b.jsxFragmentFactory,
          target: (_d = (_c = data.compilerOptions) == null ? void 0 : _c.target) == null ? void 0 : _d.toLowerCase()
        };
      }
      return {};
    };
    var inferPackageFormat = (cwd, filename) => {
      if (filename.endsWith(".mjs")) {
        return "esm";
      }
      if (filename.endsWith(".cjs")) {
        return "cjs";
      }
      const { data } = joycon.loadSync(["package.json"], cwd);
      return data && data.type === "module" && /\.m?js$/.test(filename) ? "esm" : "cjs";
    };
    var import_tsconfig_paths = __toModule(require_lib4());
    var noOp = () => {
    };
    function registerTsconfigPaths() {
      const configLoaderResult = (0, import_tsconfig_paths.loadConfig)(process.cwd());
      if (configLoaderResult.resultType === "failed") {
        return noOp;
      }
      const matchPath = (0, import_tsconfig_paths.createMatchPath)(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll);
      const Module = require("module");
      const originalResolveFilename = Module._resolveFilename;
      Module._resolveFilename = function(request, _parent) {
        const isCoreModule = _module2.builtinModules.includes(request);
        if (!isCoreModule) {
          const found = matchPath(request);
          if (found) {
            const modifiedArguments = [found, ...[].slice.call(arguments, 1)];
            return originalResolveFilename.apply(this, modifiedArguments);
          }
        }
        return originalResolveFilename.apply(this, arguments);
      };
      return () => {
        Module._resolveFilename = originalResolveFilename;
      };
    }
    var _debug = require_src();
    var _debug2 = _interopRequireDefault2(_debug);
    var debug = _debug2.default.call(void 0, "esbuild-register");
    var IMPORT_META_URL_VARIABLE_NAME = "__esbuild_register_import_meta_url__";
    var map = {};
    function installSourceMapSupport() {
      if (_process2.default.setSourceMapsEnabled) {
        ;
        _process2.default.setSourceMapsEnabled(true);
      } else {
        import_source_map_support.default.install({
          handleUncaughtExceptions: false,
          environment: "node",
          retrieveSourceMap(file) {
            if (map[file]) {
              return {
                url: file,
                map: map[file]
              };
            }
            return null;
          }
        });
      }
    }
    function patchCommonJsLoader(compile) {
      const extensions = _module3.default.Module._extensions;
      const jsHandler = extensions[".js"];
      extensions[".js"] = function(module22, filename) {
        try {
          return jsHandler.call(this, module22, filename);
        } catch (error2) {
          if (error2.code !== "ERR_REQUIRE_ESM") {
            throw error2;
          }
          let content = _fs3.default.readFileSync(filename, "utf8");
          content = compile(content, filename, "cjs");
          module22._compile(content, filename);
        }
      };
      return () => {
        extensions[".js"] = jsHandler;
      };
    }
    var FILE_LOADERS = {
      ".js": "js",
      ".jsx": "jsx",
      ".ts": "ts",
      ".tsx": "tsx",
      ".mjs": "js",
      ".mts": "ts",
      ".cts": "ts"
    };
    var DEFAULT_EXTENSIONS = Object.keys(FILE_LOADERS);
    var getLoader = (filename) => FILE_LOADERS[_path2.extname.call(void 0, filename)];
    function register(esbuildOptions = {}) {
      const {
        extensions = DEFAULT_EXTENSIONS,
        hookIgnoreNodeModules = true,
        hookMatcher,
        ...overrides
      } = esbuildOptions;
      const compile = function compile2(code, filename, format) {
        const define2 = {
          "import.meta.url": IMPORT_META_URL_VARIABLE_NAME,
          ...overrides.define
        };
        const banner = `const ${IMPORT_META_URL_VARIABLE_NAME} = require('url').pathToFileURL(__filename).href;${overrides.banner || ""}`;
        if (code.includes(banner)) {
          return code;
        }
        const dir = _path2.dirname.call(void 0, filename);
        const options = getOptions(dir);
        format = format != null ? format : inferPackageFormat(dir, filename);
        const result = _esbuild.transformSync.call(void 0, code, {
          sourcefile: filename,
          loader: getLoader(filename),
          sourcemap: "both",
          target: options.target,
          jsxFactory: options.jsxFactory,
          jsxFragment: options.jsxFragment,
          format,
          define: define2,
          banner,
          ...overrides
        });
        const js = result.code;
        debug("compiled %s", filename);
        debug("%s", js);
        const warnings = result.warnings;
        if (warnings && warnings.length > 0) {
          for (const warning of warnings) {
            console.log(warning.location);
            console.log(warning.text);
          }
        }
        if (format === "esm")
          return js;
        return removeNodePrefix(js);
      };
      const revert = (0, import_pirates.addHook)(compile, {
        exts: extensions,
        ignoreNodeModules: hookIgnoreNodeModules,
        matcher: hookMatcher
      });
      installSourceMapSupport();
      const unpatchCommonJsLoader = patchCommonJsLoader(compile);
      const unregisterTsconfigPaths = registerTsconfigPaths();
      return {
        unregister() {
          revert();
          unpatchCommonJsLoader();
          unregisterTsconfigPaths();
        }
      };
    }
    exports2.register = register;
  }
});

// node_modules/suchibot/dist/patch-cjs.js
var require_patch_cjs = __commonJS({
  "node_modules/suchibot/dist/patch-cjs.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.patchCjs = void 0;
    var path_1 = __importDefault(require("path"));
    var module_1 = require("module");
    var node_1 = require_node2();
    function patchCjs() {
      var originalResolveFilename = module_1.Module._resolveFilename;
      module_1.Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
        if (request === "suchibot") {
          return path_1.default.resolve(__dirname, "..", "index.js");
        } else {
          return originalResolveFilename(request, parent, isMain, options);
        }
      };
      (0, node_1.register)({
        target: "node".concat(process.version.replace(/^v/i, ""))
      });
    }
    exports2.patchCjs = patchCjs;
  }
});

// node_modules/suchibot/package.json
var require_package = __commonJS({
  "node_modules/suchibot/package.json"(exports2, module2) {
    module2.exports = {
      name: "suchibot",
      version: "1.9.0",
      description: "A cross-platform AutoHotKey-like thing with TypeScript as its scripting language",
      main: "index.js",
      bin: "index.js",
      scripts: {
        build: "rimraf dist && tsc",
        start: "node ./index.js",
        test: "vitest"
      },
      keywords: [
        "macro",
        "automatic",
        "autohotkey",
        "keyboard",
        "mouse",
        "hotkey",
        "hot",
        "auto",
        "automated"
      ],
      author: "Lily Skye <me@suchipi.com>",
      repository: "suchipi/suchibot",
      license: "MIT",
      dependencies: {
        "@nut-tree/libnut": "^2.5.1",
        "@suchipi/defer": "^1.0.0",
        "a-mimir": "^1.0.1",
        "esbuild-register": "^3.4.2",
        kleur: "^4.1.4",
        mitt: "^3.0.0",
        "pretty-print-error": "^1.1.1",
        "uiohook-napi": "^1.5.0"
      },
      devDependencies: {
        "@types/node": "^17.0.8",
        rimraf: "^5.0.1",
        typescript: "^4.5.4",
        vitest: "^0.33.0"
      }
    };
  }
});

// node_modules/suchibot/dist/cli.js
var require_cli = __commonJS({
  "node_modules/suchibot/dist/cli.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.main = void 0;
    var fs_1 = __importDefault(require("fs"));
    var path_1 = __importDefault(require("path"));
    var kleur_1 = __importDefault(require_kleur());
    var pretty_print_error_1 = require_dist2();
    var package_json_1 = __importDefault(require_package());
    function printUsage() {
      console.log("suchibot ".concat(package_json_1.default.version));
      console.log("");
      console.log("Usage:");
      console.log("  suchibot [path to script file]");
      console.log("");
      console.log("If no script file path is specified, the program will attempt to load script.ts or script.js (whichever exists).");
      console.log("");
      console.log("Examples:");
      console.log("  suchibot ./my-script.js");
    }
    function main(suchibot) {
      if (process.argv.includes("-h") || process.argv.includes("--help")) {
        printUsage();
        process.exit(0);
      }
      if (process.argv.includes("-v") || process.argv.includes("--version")) {
        console.log("".concat(package_json_1.default.version));
        process.exit(0);
      }
      var modulePath = process.argv[2];
      var defaultTsPath = path_1.default.resolve(process.cwd(), "./script.ts");
      var defaultJsPath = path_1.default.resolve(process.cwd(), "./script.js");
      if (modulePath == null) {
        if (fs_1.default.existsSync(defaultTsPath)) {
          modulePath = defaultTsPath;
        } else if (fs_1.default.existsSync(defaultJsPath)) {
          modulePath = defaultJsPath;
        } else {
          console.log(kleur_1.default.red("Not sure which file to run. Please either specify a script as the first argument to suchibot, or create a file named ".concat(kleur_1.default.yellow("script.ts"), " or ").concat(kleur_1.default.yellow("script.js"), " in the current folder.")));
          console.log("");
          printUsage();
          process.exit(1);
        }
      }
      if (!path_1.default.isAbsolute(modulePath)) {
        modulePath = path_1.default.resolve(process.cwd(), modulePath);
      }
      if (!fs_1.default.existsSync(modulePath)) {
        console.log("Trying to load non-existent file:", modulePath);
        console.log("");
        printUsage();
        process.exit(1);
      }
      suchibot.startListening();
      console.log(kleur_1.default.green("Now listening for mouse/keyboard events. Press Ctrl+C to exit at any time."));
      process.on("unhandledRejection", function(error2) {
        console.log(kleur_1.default.red("An unhandled Promise rejection occurred:"));
        console.log((0, pretty_print_error_1.formatError)(error2));
      });
      try {
        require(modulePath);
      } catch (err2) {
        console.log(kleur_1.default.red("An error occurred in your script:"));
        console.log((0, pretty_print_error_1.formatError)(err2));
        suchibot.stopListening();
        process.exit(1);
      }
    }
    exports2.main = main;
  }
});

// node_modules/suchibot/index.js
var require_suchibot = __commonJS({
  "node_modules/suchibot/index.js"(exports2, module2) {
    var suchibot = require_dist3();
    module2.exports = suchibot;
    if (module2 === require.main) {
      const { patchCjs } = require_patch_cjs();
      patchCjs();
      const { main } = require_cli();
      Object.assign(globalThis, suchibot);
      main(suchibot);
    }
  }
});

// src/bundle.ts
var bundle_exports = {};
__export(bundle_exports, {
  BoolState: () => BoolState,
  BoolStateCompose: () => BoolStateCompose,
  Cast: () => Cast,
  DisposeWrapper: () => DisposeWrapper,
  Key: () => Key,
  MouseKey: () => MouseKey,
  Observable: () => Observable,
  Queue: () => Queue,
  Rx: () => Rx,
  ScrollDirection: () => ScrollDirection,
  ScrollKey: () => ScrollKey,
  SuchKey: () => SuchKey,
  SuchMouseKey: () => SuchMouseKey,
  combineScriptsWithDoc: () => combineScriptsWithDoc,
  doc: () => doc,
  execScripts: () => execScripts,
  force: () => force,
  getHoldKey: () => getHoldKey,
  getTapKey: () => getTapKey,
  getTickKey: () => getTickKey,
  holdKey: () => holdKey,
  inOfAny: () => inOfAny,
  stream: () => stream,
  tapKey: () => tapKey,
  tickKey: () => tickKey,
  toggleStateByTap: () => toggleStateByTap,
  whileNeed: () => whileNeed,
  whileNeedAsync: () => whileNeedAsync,
  wrapToScriptWithDoc: () => wrapToScriptWithDoc
});
module.exports = __toCommonJS(bundle_exports);

// src/extensions/promiseExtensions.ts
Promise.delayed = function(delayMs, executor) {
  return new Promise((res) => {
    setTimeout(() => {
      if (executor != null)
        return res(executor());
      return res(void 0);
    }, delayMs);
  });
};

// src/extensions/stringExtensions.ts
String.prototype.toTitleCase = function() {
  return this.split(" ").filter((e) => e != null && e !== "").map((e) => e.substring(0, 1).toUpperCase() + e.substring(1)).join(" ");
};

// src/shared/operators/cast.ts
var Cast = (value, match, typeName) => {
  return {
    match,
    typeName,
    cast: () => {
      if (!match(value))
        throw new Error(`Value ${value} is not type ${typeName}`);
      return value;
    },
    tryCast: () => {
      if (!match(value))
        return void 0;
      return value;
    }
  };
};

// src/shared/operators/operators.ts
var force = (value) => {
  if (value == null)
    throw new Error("Value is not exist");
  return value;
};
var inOfAny = (key, value) => {
  try {
    return key in value;
  } catch (e) {
    return false;
  }
};

// src/docScript/doc.ts
var doc = /* @__PURE__ */ (() => {
  const activate = (key) => `activate ${key.toString()}`;
  const tap = (key) => `tap ${key.toString()}`;
  const hold = (key) => `hold ${key.toString()}`;
  const tick = (key) => `tick ${key.toString()}`;
  const holdKey2 = ({ when, then }) => `When ${activate(when)}, then ${hold(then)}`;
  const tapKey2 = ({ when, then }) => `When ${tap(when)}, then ${tap(then)}`;
  const tickKey2 = ({ when, then }) => `When ${activate(when)}, then ${tick(then)}`;
  const isWithDoc = (docs) => inOfAny("doc", docs);
  const toStringArray = (docs) => {
    if (typeof docs === "string")
      return [docs];
    if (Array.isArray(docs))
      return docs.map((e) => toStringArray(e)).reduce((acc, curr) => [...acc, ...curr]);
    if (isWithDoc(docs)) {
      return toStringArray(docs.doc);
    }
    throw Error(`Value ${docs} int't doc`);
  };
  const join = (docs) => toStringArray(docs).map((d) => d).join("\n");
  const print = (docs) => console.log(join(docs));
  return {
    holdKey: holdKey2,
    tapKey: tapKey2,
    tickKey: tickKey2,
    toStringArray,
    join,
    print,
    activate,
    tap,
    tick,
    hold,
    isWithDoc
  };
})();

// node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/uuid/dist/esm-node/native.js
var import_crypto2 = __toESM(require("crypto"));
var native_default = {
  randomUUID: import_crypto2.default.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/shared/rx/observable.ts
var Observable = () => {
  const map = /* @__PURE__ */ new Map();
  return {
    listen: (h) => {
      const id = v4_default();
      map.set(id, h);
      return () => map.delete(id);
    },
    notify: (val) => {
      for (const v of map.values()) {
        v(val);
      }
    },
    dispose: () => map.clear()
  };
};
var DisposeWrapper = () => {
  let disposers = [];
  const addDisposer = (d) => disposers.push(d);
  return {
    addDisposer,
    addDisposers: (ds) => ds.forEach(addDisposer),
    dispose: () => disposers = []
  };
};

// src/shared/rx/rx.ts
var Rx = (initial, {
  comparer = (a, b) => a === b,
  forceUpdate: defaultForce = false
} = {}) => {
  let value = initial;
  const obs = Observable();
  return {
    get value() {
      return value;
    },
    setValue: (newValue, { forceUpdate = defaultForce } = {}) => {
      const oldValue = value;
      value = newValue;
      if (forceUpdate || !comparer(oldValue, newValue))
        return obs.notify(value);
    },
    listen: obs.listen,
    dispose: obs.dispose
  };
};

// src/shared/rx/boolState.ts
var BoolState = (initial = false, options = {}) => {
  let state = Rx(initial, options);
  const toggle = () => state.setValue(!state.value);
  const enable = () => state.setValue(true);
  const disable = () => state.setValue(false);
  return {
    get value() {
      return state.value;
    },
    get isEnabled() {
      return state.value;
    },
    setValue: state.setValue,
    dispose: state.dispose,
    listen: state.listen,
    toggle,
    enable,
    disable
  };
};
var BoolStateCompose = {
  onlyOneActive: (...states) => {
    const disposeWrapper = DisposeWrapper();
    for (let i = 0; i < states.length; i++) {
      const current = states[i];
      const other = [];
      for (let j = 0; j < states.length; j++) {
        if (i != j)
          other.push(states[j]);
      }
      disposeWrapper.addDisposer(
        current.listen((newValue) => newValue && other.forEach((s) => s.disable()))
      );
    }
    return disposeWrapper;
  }
};

// src/docScript/scriptWithDoc.ts
var wrapToScriptWithDoc = (foo, { getDoc }) => {
  return (...args) => {
    const call = () => foo(...args);
    return Object.assign(call, { doc: getDoc(...args) });
  };
};
var combineScriptsWithDoc = (scripts) => {
  const dw = DisposeWrapper();
  const call = () => {
    dw.addDisposers(scripts.map((l) => {
      const res = l();
      if (typeof res === "function")
        return res;
      if (inOfAny("stop", res))
        return res.stop;
      return () => {
      };
    }));
    return {
      stop: () => dw.dispose()
    };
  };
  return Object.assign(call, { doc: doc.toStringArray(scripts) });
};
var execScripts = (scripts) => {
  scripts.forEach((s) => s());
  scripts.forEach((s) => doc.print(s));
};

// src/utils/scripts/holdKey.ts
var holdKey = ({
  when,
  then
}) => {
  return when.onToggleEnabled(() => {
    then.hold();
  }, {
    onDisable: () => {
      then.release();
    }
  });
};
var getHoldKey = wrapToScriptWithDoc(
  holdKey,
  {
    getDoc: (ps) => doc.holdKey(ps)
  }
);

// src/utils/scripts/tapKey.ts
var tapKey = ({
  when,
  then
}) => when.onDown(() => then.tap());
var getTapKey = wrapToScriptWithDoc(
  tapKey,
  {
    getDoc: (ps) => doc.tapKey(ps)
  }
);

// src/utils/scripts/tickKey.ts
var tickKey = ({
  when,
  then,
  delayMs = 50
}) => when.onToggleEnabled((state) => {
  then.tick({ needContinue: () => state.isEnabled, delayMs });
});
var getTickKey = wrapToScriptWithDoc(
  tickKey,
  {
    getDoc: (ps) => doc.tickKey(ps)
  }
);

// src/utils/scripts/toggleStateByTap.ts
var toggleStateByTap = ({
  initial = false,
  key
}) => {
  const state = BoolState(initial);
  key.onDown(() => state.toggle());
  return state;
};

// src/utils/scripts/whileNeed.ts
var import_suchibot = __toESM(require_suchibot());
var _delay = 100;
var whileNeed = async ({
  needContinue,
  execute,
  delayMs = _delay
}) => {
  let i = 1;
  while (needContinue(i)) {
    execute();
    await (0, import_suchibot.sleep)(delayMs);
    i++;
  }
};
var whileNeedAsync = async ({
  needContinue,
  execute,
  delayMs = _delay
}) => {
  let i = 1;
  while (needContinue(i)) {
    await execute();
    await (0, import_suchibot.sleep)(delayMs);
    i++;
  }
};

// src/keys/key.ts
var _commonKeyExt = (tap) => {
  const getTimesPredicate = (times) => (c) => c < times + 1;
  const tick = async (props2) => whileNeed({ ...props2, execute: tap });
  const tickTimes = ({ times, delayMs }) => tick({ needContinue: getTimesPredicate(times), delayMs });
  return {
    tick,
    tickTimes
  };
};

// src/utils/suchibot.ts
var import_suchibot2 = __toESM(require_suchibot());
var SuchKey = (() => {
  const keys = { ...import_suchibot2.Key };
  delete keys.PAGE_UP;
  delete keys.NUM_LOCK;
  return keys;
})();
var SuchMouseKey = import_suchibot2.MouseButton;

// src/keys/physicalKey.ts
var import_suchibot4 = __toESM(require_suchibot());
var _physicalKeyExt = ({
  onDown,
  hold,
  release
}) => {
  return {
    onToggleEnabled: (handler, { initialEnabled = false, onDisable } = {}) => {
      const state = BoolState(initialEnabled);
      return onDown((m) => {
        state.toggle();
        if (state.isEnabled)
          return handler(state, m);
        if (onDisable != null)
          return onDisable(state, m);
      });
    },
    holdTimed: async (time) => {
      hold();
      await Promise.delayed(time);
      release();
    }
  };
};
var PhysicalKeyboardKey = (key) => {
  const tap = () => import_suchibot4.Keyboard.tap(key);
  const onDown = (h) => import_suchibot4.Keyboard.onDown(key, (ev) => h(ev.modifierKeys));
  const hold = () => import_suchibot4.Keyboard.hold(key);
  const release = () => import_suchibot4.Keyboard.release(key);
  return {
    isDown: () => {
      return import_suchibot4.Keyboard.isDown(key);
    },
    isUp: () => {
      return import_suchibot4.Keyboard.isUp(key);
    },
    onDown,
    onUp: (h) => import_suchibot4.Keyboard.onUp(key, (ev) => h(ev.modifierKeys)),
    tap,
    hold,
    release,
    get value() {
      return key;
    },
    ..._commonKeyExt(tap),
    ..._physicalKeyExt({ hold, release, onDown }),
    type: "keyboard",
    toString: () => `${key}`
  };
};
var PhysicalMouseKey = (key) => {
  const tap = () => import_suchibot4.Mouse.click(key);
  const onDown = (h) => import_suchibot4.Mouse.onDown(key, (ev) => h(ev.modifierKeys));
  const hold = () => import_suchibot4.Mouse.hold(key);
  const release = () => import_suchibot4.Mouse.release(key);
  return {
    isDown: () => {
      return import_suchibot4.Mouse.isDown(key);
    },
    isUp: () => {
      return import_suchibot4.Mouse.isUp(key);
    },
    onDown,
    onUp: (h) => import_suchibot4.Mouse.onUp(key, (ev) => h(ev.modifierKeys)),
    tap,
    hold,
    release,
    get value() {
      return key;
    },
    onClick: (h) => import_suchibot4.Mouse.onClick(key, h),
    doubleClick: () => import_suchibot4.Mouse.doubleClick(key),
    ..._commonKeyExt(tap),
    ..._physicalKeyExt({ hold, release, onDown }),
    type: "mouse",
    toString: () => `${key} (mouse)`
  };
};

// src/keys/scrollAsKey.ts
var import_suchibot5 = __toESM(require_suchibot());
var ScrollDirection = /* @__PURE__ */ ((ScrollDirection2) => {
  ScrollDirection2[ScrollDirection2["up"] = 1] = "up";
  ScrollDirection2[ScrollDirection2["down"] = -1] = "down";
  return ScrollDirection2;
})(ScrollDirection || {});
var _defaultStep = 100;
var ScrollAsKey = ({ step = _defaultStep, direction }) => {
  const obs = Observable();
  const tap = () => {
    import_suchibot5.Mouse.scroll({ y: step * direction });
    obs.notify();
  };
  return {
    step,
    direction,
    tap,
    ..._commonKeyExt(tap),
    toString: () => `${ScrollDirection[direction]} (scroll)`
  };
};
var ScrollDownAsKey = (step = _defaultStep) => {
  return ScrollAsKey({ step, direction: -1 /* down */ });
};
var ScrollUpAsKey = (step = _defaultStep) => {
  return ScrollAsKey({ step, direction: 1 /* up */ });
};

// src/keys/keys.ts
var Key = (() => {
  const keys = {};
  Object.entries(SuchKey).forEach(([k, v]) => keys[k] = PhysicalKeyboardKey(v));
  return keys;
})();
var MouseKey = (() => {
  const keys = {};
  Object.entries(SuchMouseKey).forEach(([k, v]) => keys[k] = PhysicalMouseKey(v));
  return keys;
})();
var ScrollKey = {
  UP: ScrollUpAsKey,
  DOWN: ScrollDownAsKey
};

// src/shared/stream.ts
var stream = (source) => {
  const getSource = typeof source !== "function" ? () => source : source;
  return {
    forEach(executor) {
      let i = 0;
      for (const v of getSource()) {
        executor(v, i);
        i++;
      }
      return this;
    },
    map: (mapper) => stream(function* gen() {
      let i = 0;
      for (const v of getSource()) {
        yield mapper(v, i);
        i++;
      }
    }),
    filter: (predicate) => stream(function* gen() {
      let i = 0;
      for (const v of getSource()) {
        if (predicate(v, i))
          yield v;
        i++;
      }
    }),
    get count() {
      let i = 0;
      for (const v of getSource()) {
        i++;
      }
      ;
      return i;
    },
    toArray: () => {
      const result = [];
      for (const v of getSource()) {
        result.push(v);
      }
      return result;
    },
    get first() {
      return force(this.firstOrNull);
    },
    get last() {
      return force(this.lastOrNull);
    },
    get firstOrNull() {
      for (const v of getSource()) {
        return v;
      }
      return void 0;
    },
    get lastOrNull() {
      let last = void 0;
      for (const v of getSource()) {
        last = v;
      }
      return last;
    }
  };
};

// src/shared/queue.ts
var Queue = class _Queue {
  static from(values) {
    const instance = new _Queue();
    for (const v of values) {
      instance.push(v);
    }
    return instance;
  }
  pop() {
    if (this.isEmpty)
      return;
    const current = this._head;
    this._head = current?.next;
    if (this._head == null)
      this._tail = void 0;
    return current?.value;
  }
  *popAll() {
    let element = void 0;
    while (true) {
      element = this.pop();
      if (element == null)
        return;
      yield element;
    }
  }
  push(value) {
    const newTail = { value };
    if (this.isEmpty) {
      this._tail = newTail;
      this._head = this._tail;
      return;
    }
    this._tail.next = newTail;
    this._tail = newTail;
  }
  get isEmpty() {
    return this._head == null || this._tail == null;
  }
  get canPop() {
    return !this.isEmpty;
  }
  get length() {
    if (this.isEmpty)
      return 0;
    return stream(this.toArray()).count;
  }
  *toArray() {
    let current = this._head;
    while (current != null) {
      yield current.value;
      current = current.next;
    }
  }
  stream() {
    return stream(this.toArray());
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BoolState,
  BoolStateCompose,
  Cast,
  DisposeWrapper,
  Key,
  MouseKey,
  Observable,
  Queue,
  Rx,
  ScrollDirection,
  ScrollKey,
  SuchKey,
  SuchMouseKey,
  combineScriptsWithDoc,
  doc,
  execScripts,
  force,
  getHoldKey,
  getTapKey,
  getTickKey,
  holdKey,
  inOfAny,
  stream,
  tapKey,
  tickKey,
  toggleStateByTap,
  whileNeed,
  whileNeedAsync,
  wrapToScriptWithDoc
});
