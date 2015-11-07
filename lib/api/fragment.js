// src/api/fragment.js
(typeof window === 'undefined' ? global : window).__ef86f48ff9050407fed1e142d9fe2629 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "./init": __3add36046399fead5a83243849207ed7
  };
  var define = function defineReplacementWrapper(generatedModuleName) {
    return function defineReplacement(name, deps, func) {
      var root = (typeof window === 'undefined' ? global : window);
      var defineGlobal = root.define;
      var rval;
      var type;
  
      func = [func, deps, name].filter(function (cur) {
        return typeof cur === 'function';
      })[0];
      deps = [deps, name, []].filter(Array.isArray)[0];
      rval = func.apply(null, deps.map(function (value) {
        return defineDependencies[value];
      }));
      type = typeof rval;
  
      // Support existing AMD libs.
      if (typeof defineGlobal === 'function') {
        // Almond always expects a name so resolve one (#29).
        defineGlobal(typeof name === 'string' ? name : generatedModuleName, deps, func);
      }
  
      // Some processors like Babel don't check to make sure that the module value
      // is not a primitive before calling Object.defineProperty() on it. We ensure
      // it is an instance so that it can.
      if (type === 'string') {
        rval = String(rval);
      } else if (type === 'number') {
        rval = Number(rval);
      } else if (type === 'boolean') {
        rval = Boolean(rval);
      }
  
      // Reset the exports to the defined module. This is how we convert AMD to
      // CommonJS and ensures both can either co-exist, or be used separately. We
      // only set it if it is not defined because there is no object representation
      // of undefined, thus calling Object.defineProperty() on it would fail.
      if (rval !== undefined) {
        exports = module.exports = rval;
      }
    };
  }("__ef86f48ff9050407fed1e142d9fe2629");
  define.amd = true;
  
  (function (global, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.fragment = mod.exports;
    }
  })(this, function (exports) {
  
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports['default'] = fragment;
  
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { 'default': obj };
    }
  
    var _init = __3add36046399fead5a83243849207ed7;
  
    var _init2 = _interopRequireDefault(_init);
  
    var Node = window.Node;
    var NodeList = window.NodeList;
  
    var slice = Array.prototype.slice;
    var specialMap = {
      caption: 'table',
      dd: 'dl',
      dt: 'dl',
      li: 'ul',
      tbody: 'table',
      td: 'tr',
      thead: 'table',
      tr: 'tbody'
    };
  
    function resolveParent(tag, html) {
      var container = document.createElement('div');
      var levels = 0;
      var parentTag = specialMap[tag];
  
      while (parentTag) {
        html = '<' + parentTag + '>' + html + '</' + parentTag + '>';
        ++levels;
        parentTag = specialMap[parentTag];
      }
  
      container.innerHTML = html;
  
      var parent = container;
      for (var a = 0; a < levels; a++) {
        parent = parent.firstElementChild;
      }
      return parent;
    }
  
    function resolveTag(html) {
      var tag = html.match(/^<([^\s>]+)/);
      return tag && tag[1];
    }
  
    function resolveHtml(html) {
      return resolveParent(resolveTag(html), html);
    }
  
    function fragment() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return args.reduce(function (frag, node) {
        if (typeof node === 'string') {
          node = fragment.apply(null, slice.call(resolveHtml(node).childNodes));
        } else if (node instanceof NodeList || Array.isArray(node)) {
          node = fragment.apply(null, slice.call(node));
        } else if (node instanceof Node) {
          (0, _init2['default'])(node);
        }
  
        if (node) {
          frag.appendChild(node);
        }
  
        return frag;
      }, document.createDocumentFragment());
    }
  
    module.exports = exports['default'];
  });
  
  return module.exports;
}).call(this);