'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Tags = require('language-tags');

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var DESCRIPTIONS_JOINER = '/';
var NOT_DEFINED_PLACEHOLDER = '- not defined -';
var LOADING_TAG_PLACEHOLDER = {
  tag: 'loading',
  descriptions: ['Loading data...']
};
exports.GroupedFilterSymbols = void 0;
(function (GroupedFilterSymbols) {
  GroupedFilterSymbols["Digits"] = "0-9";
  GroupedFilterSymbols["SpecialCharacters"] = "#";
})(exports.GroupedFilterSymbols || (exports.GroupedFilterSymbols = {}));

var sortSiteTextFn = function sortSiteTextFn(d1, d2) {
  if (d1.siteTextlikeString && d2.siteTextlikeString && d1.siteTextlikeString.toLowerCase() > d2.siteTextlikeString.toLowerCase()) {
    return 1;
  }
  if (d1.siteTextlikeString && d2.siteTextlikeString && d1.siteTextlikeString.toLowerCase() < d2.siteTextlikeString.toLowerCase()) {
    return -1;
  }
  return 0;
};
var sortTagInfosFn = function sortTagInfosFn(t1, t2) {
  if (t1.descriptions && t1.descriptions[0] === NOT_DEFINED_PLACEHOLDER) {
    return -1;
  }
  if (t2.descriptions && t2.descriptions[0] === NOT_DEFINED_PLACEHOLDER) {
    return 1;
  }
  if (t1.descriptions && t2.descriptions && t1.descriptions[0] > t2.descriptions[0]) {
    return 1;
  }
  if (t1.descriptions && t2.descriptions && t1.descriptions[0] < t2.descriptions[0]) {
    return -1;
  }
  return 0;
};

// X_LANG_TAGS is an array of private (x-...) subtags; they are used as additional language tags to represent languages
// that are not present in the `language-tags` npm package (which refers to the IANA registry).
// List of main language tags we get from the `language-tags` library will be extended with these x- tags.
var X_LANG_TAGS = [{
  tag: 'x-senga',
  descriptions: ['Senga']
}, {
  tag: 'x-fungwe',
  descriptions: ['Fungwe']
}, {
  tag: 'x-tambo',
  descriptions: ['Tambo']
}, {
  tag: 'x-wandya',
  descriptions: ['Wandya']
}, {
  tag: 'x-lungu',
  descriptions: ['Lungu']
}, {
  tag: 'x-chikunda',
  descriptions: ['Chikunda']
}, {
  tag: 'x-kabdende',
  descriptions: ['Kabdende']
}, {
  tag: 'x-shila',
  descriptions: ['Shila']
}, {
  tag: 'x-mwenyi',
  descriptions: ['Mwenyi']
}, {
  tag: 'x-liuwa',
  descriptions: ['Liuwa']
}, {
  tag: 'x-Seabo',
  descriptions: ['Seabo']
}];
var TagTypes;
(function (TagTypes) {
  TagTypes["LANGUAGE"] = "language";
  TagTypes["REGION"] = "region";
  TagTypes["DIALECT"] = "variant";
})(TagTypes || (TagTypes = {}));
var xTag2langInfo = function xTag2langInfo(tagGiven) {
  var foundXtagIndex = X_LANG_TAGS.findIndex(function (xTag) {
    return xTag.tag === tagGiven;
  });
  if (foundXtagIndex >= 0) {
    return {
      lang: X_LANG_TAGS[foundXtagIndex]
    };
  } else return undefined;
};
var tag2langInfo = function tag2langInfo(tagGiven) {
  if (xTag2langInfo(tagGiven)) return xTag2langInfo(tagGiven);
  var complexTag = Tags(tagGiven);
  var lang = complexTag.find(TagTypes.LANGUAGE);
  var region = complexTag.find(TagTypes.REGION);
  var dialect = complexTag.find(TagTypes.DIALECT);
  var langInfo = {
    lang: {
      tag: (lang == null ? void 0 : lang.format()) || '',
      descriptions: lang == null ? void 0 : lang.descriptions()
    }
  };
  if (region) {
    langInfo.region = {
      tag: region.format(),
      descriptions: region.descriptions()
    };
  }
  if (dialect) {
    langInfo.dialect = {
      tag: dialect.format(),
      descriptions: dialect.descriptions()
    };
  }
  return langInfo;
};
var langInfo2tag = function langInfo2tag(langInfo) {
  if (!langInfo) return undefined;
  var lang = langInfo.lang,
    region = langInfo.region,
    dialect = langInfo.dialect;
  var langTag = lang.tag;
  var xTag = X_LANG_TAGS.find(function (xt) {
    return xt.tag === langTag;
  });
  if (xTag) return xTag.tag;
  (region == null ? void 0 : region.tag) && (langTag += '-' + (region == null ? void 0 : region.tag));
  (dialect == null ? void 0 : dialect.tag) && (langTag += '-' + (dialect == null ? void 0 : dialect.tag));
  return Tags(langTag).format();
};
var langInfo2langInput = function langInfo2langInput(langInfo) {
  var _langInfo$dialect, _langInfo$region;
  return {
    language_code: langInfo.lang.tag,
    dialect_code: ((_langInfo$dialect = langInfo.dialect) == null ? void 0 : _langInfo$dialect.tag) || null,
    geo_code: ((_langInfo$region = langInfo.region) == null ? void 0 : _langInfo$region.tag) || null
  };
};
var langInfo2String = function langInfo2String(langInfo) {
  var _langInfo$lang$descri, _langInfo$region2, _langInfo$dialect2;
  var xTag = X_LANG_TAGS.find(function (xt) {
    return xt.tag === (langInfo == null ? void 0 : langInfo.lang.tag);
  });
  if (xTag) {
    var _xTag$descriptions;
    return ((_xTag$descriptions = xTag.descriptions) == null ? void 0 : _xTag$descriptions.join(DESCRIPTIONS_JOINER)) || xTag.tag;
  }
  var res = langInfo == null || (_langInfo$lang$descri = langInfo.lang.descriptions) == null ? void 0 : _langInfo$lang$descri.join(DESCRIPTIONS_JOINER);
  if (!res) return '';
  if (langInfo != null && (_langInfo$region2 = langInfo.region) != null && _langInfo$region2.descriptions) {
    var _langInfo$region3;
    res += ' ' + ((_langInfo$region3 = langInfo.region) == null ? void 0 : _langInfo$region3.descriptions.join(DESCRIPTIONS_JOINER));
  }
  if (langInfo != null && (_langInfo$dialect2 = langInfo.dialect) != null && _langInfo$dialect2.descriptions) {
    var _langInfo$dialect3;
    res += ', dialect:' + (langInfo == null || (_langInfo$dialect3 = langInfo.dialect) == null ? void 0 : _langInfo$dialect3.descriptions.join(DESCRIPTIONS_JOINER));
  }
  return res;
};
var subTags2LangInfo = function subTags2LangInfo(_ref) {
  var lang = _ref.lang,
    region = _ref.region,
    dialect = _ref.dialect;
  if (xTag2langInfo(lang)) return xTag2langInfo(lang);
  var langTag = lang;
  region && (langTag += '-' + region);
  dialect && (langTag += '-' + dialect);
  langTag = Tags(langTag).format();
  return tag2langInfo(langTag);
};
var compareLangInfo = function compareLangInfo(a, b) {
  var _a$dialect, _b$dialect, _a$region, _b$region;
  if (a === b) return true; // case both null or both undefined
  if (!a || !b) return false; // case one of them null or undefined
  if (a.lang.tag !== b.lang.tag) {
    return false;
  }
  if (((_a$dialect = a.dialect) == null ? void 0 : _a$dialect.tag) !== ((_b$dialect = b.dialect) == null ? void 0 : _b$dialect.tag)) {
    return false;
  }
  if (((_a$region = a.region) == null ? void 0 : _a$region.tag) !== ((_b$region = b.region) == null ? void 0 : _b$region.tag)) {
    return false;
  }
  return true;
};
var TagSpecialDescriptions;
(function (TagSpecialDescriptions) {
  TagSpecialDescriptions["PRIVATE_USE"] = "Private use";
})(TagSpecialDescriptions || (TagSpecialDescriptions = {}));
// make it async to test and prepare for possible language library change to async
var getLangsRegistry = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(enabledTags) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            var allTags = Tags.search(/.*/);
            var langs = [].concat(X_LANG_TAGS);
            var dialects = [{
              tag: null,
              descriptions: [NOT_DEFINED_PLACEHOLDER]
            }];
            var regions = [{
              tag: null,
              descriptions: [NOT_DEFINED_PLACEHOLDER]
            }];
            for (var _iterator = _createForOfIteratorHelperLoose(allTags), _step; !(_step = _iterator()).done;) {
              var currTag = _step.value;
              if (enabledTags && !enabledTags.includes(currTag.format())) {
                continue;
              }
              if (currTag.deprecated() || currTag.descriptions().includes(TagSpecialDescriptions.PRIVATE_USE)) {
                continue;
              }
              if (currTag.type() === TagTypes.LANGUAGE) {
                langs.push({
                  tag: currTag.format(),
                  descriptions: currTag.descriptions()
                });
              }
              if (currTag.type() === TagTypes.REGION) {
                regions.push({
                  tag: currTag.format(),
                  descriptions: currTag.descriptions()
                });
              }
              if (currTag.type() === TagTypes.DIALECT) {
                dialects.push({
                  tag: currTag.format(),
                  descriptions: currTag.descriptions()
                });
              }
            }
            langs.sort(sortTagInfosFn);
            dialects.sort(sortTagInfosFn);
            regions.sort(sortTagInfosFn);
            resolve({
              langs: langs,
              dialects: dialects,
              regions: regions
            });
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getLangsRegistry(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var subTags2Tag = function subTags2Tag(_ref3) {
  var lang = _ref3.lang,
    region = _ref3.region,
    dialect = _ref3.dialect;
  if (X_LANG_TAGS.find(function (xt) {
    return xt.tag === lang;
  })) return lang;
  var langTag = lang;
  region && (langTag += '-' + region);
  dialect && (langTag += '-' + dialect);
  return Tags(langTag).format();
};
var languageInput2tag = function languageInput2tag(languageInput) {
  return subTags2Tag({
    lang: languageInput.language_code,
    dialect: languageInput.dialect_code || undefined,
    region: languageInput.geo_code || undefined
  });
};

exports.DESCRIPTIONS_JOINER = DESCRIPTIONS_JOINER;
exports.LOADING_TAG_PLACEHOLDER = LOADING_TAG_PLACEHOLDER;
exports.NOT_DEFINED_PLACEHOLDER = NOT_DEFINED_PLACEHOLDER;
exports.X_LANG_TAGS = X_LANG_TAGS;
exports.compareLangInfo = compareLangInfo;
exports.getLangsRegistry = getLangsRegistry;
exports.langInfo2String = langInfo2String;
exports.langInfo2langInput = langInfo2langInput;
exports.langInfo2tag = langInfo2tag;
exports.languageInput2tag = languageInput2tag;
exports.sortSiteTextFn = sortSiteTextFn;
exports.sortTagInfosFn = sortTagInfosFn;
exports.subTags2LangInfo = subTags2LangInfo;
exports.subTags2Tag = subTags2Tag;
exports.tag2langInfo = tag2langInfo;
exports.xTag2langInfo = xTag2langInfo;
//# sourceMappingURL=utils.cjs.development.js.map
