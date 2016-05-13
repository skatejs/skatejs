(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'incremental-dom', '../data'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('incremental-dom'), require('../data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.incrementalDom, global.data);
    global.vdom = mod.exports;
  }
})(this, function (exports, _incrementalDom, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wbr = exports.video = exports.ul = exports.u = exports.track = exports.tr = exports.title = exports.time = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.template = exports.td = exports.tbody = exports.table = exports.sup = exports.summary = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.slot = exports.shadow = exports.select = exports.section = exports.script = exports.samp = exports.s = exports.ruby = exports.rtc = exports.rt = exports.rp = exports.q = exports.progress = exports.pre = exports.picture = exports.param = exports.p = exports.output = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.noframes = exports.noembed = exports.nobr = exports.nav = exports.multicol = exports.meter = exports.meta = exports.menuitem = exports.menu = exports.marquee = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.keygen = exports.kbd = exports.ins = exports.input = exports.img = exports.image = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.font = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.element = exports.dt = exports.dl = exports.div = exports.dialog = exports.dfn = exports.details = exports.del = exports.dd = exports.datalist = exports.data = exports.content = exports.command = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bgsound = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.IncrementalDOM = exports.text = undefined;
  exports.default = create;

  var IncrementalDOM = _interopRequireWildcard(_incrementalDom);

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var applyProp = IncrementalDOM.applyProp;
  var attr = IncrementalDOM.attr;
  var attributes = IncrementalDOM.attributes;
  var elementClose = IncrementalDOM.elementClose;
  var elementOpen = IncrementalDOM.elementOpen;
  var elementOpenEnd = IncrementalDOM.elementOpenEnd;
  var elementOpenStart = IncrementalDOM.elementOpenStart;
  var skip = IncrementalDOM.skip;
  var symbols = IncrementalDOM.symbols;
  var text = IncrementalDOM.text;

  if (typeof process === 'undefined') {
    process = {
      env: {
        NODE_ENV: 'production'
      }
    };
  }

  var applyDefault = attributes[symbols.default];
  var factories = {};

  attributes.key = attributes.skip = attributes.statics = function () {};

  attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

  attributes[symbols.default] = function (elem, name, value) {
    if (value === false) {
      return;
    }

    if (name in elem) {
      return applyProp(elem, name, value);
    }

    if (name.indexOf('on') === 0) {
      return applyEvent(elem, name.substring(2), name, value);
    }

    var dataName = elem.tagName + '.' + name;

    if (_data2.default.applyProp[dataName]) {
      return applyProp(elem, name, value);
    }

    applyDefault(elem, name, value);
  };

  function applyEvent(elem, ename, name, value) {
    var events = elem.__events;

    if (!events) {
      events = elem.__events = {};
    }

    var eFunc = events[ename];

    if (eFunc) {
      elem.removeEventListener(ename, eFunc);
    }

    if (value) {
      elem.addEventListener(ename, events[ename] = function (e) {
        if (this === e.target) {
          value.call(this, e);
        }
      });
    }
  }

  function bind(tname) {
    if (typeof tname === 'function') {
      tname = tname.id || tname.name;
    }

    return factories[tname] = function (attrs, chren) {
      if (attrs && (typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) === 'object') {
        elementOpenStart(tname, attrs.key, attrs.statics);

        for (var _a in attrs) {
          attr(_a, attrs[_a]);
        }

        elementOpenEnd();
      } else {
        elementOpen(tname);
        chren = attrs;
        attrs = {};
      }

      if (attrs.skip) {
        skip();
      } else {
        var chrenType = typeof chren === 'undefined' ? 'undefined' : _typeof(chren);

        if (chrenType === 'function') {
          chren();
        } else if (chrenType === 'string' || chrenType === 'number') {
          text(chren);
        }
      }

      return elementClose(tname);
    };
  }

  function create(tname, attrs, chren) {
    return (factories[tname] || bind(tname))(attrs, chren);
  }

  exports.

  // Export the Incremental DOM text() function directly as we don't need to do
  // any special processing for it.
  text = text;
  exports.

  // We export IncrementalDOM in its entirety because we want the user to be able
  // to user our configured version while still being able to use various other
  // templating languages and techniques that compile down to it.
  IncrementalDOM = IncrementalDOM;
  var a = exports.a = bind('a');
  var abbr = exports.abbr = bind('abbr');
  var address = exports.address = bind('address');
  var area = exports.area = bind('area');
  var article = exports.article = bind('article');
  var aside = exports.aside = bind('aside');
  var audio = exports.audio = bind('audio');
  var b = exports.b = bind('b');
  var base = exports.base = bind('base');
  var bdi = exports.bdi = bind('bdi');
  var bdo = exports.bdo = bind('bdo');
  var bgsound = exports.bgsound = bind('bgsound');
  var blockquote = exports.blockquote = bind('blockquote');
  var body = exports.body = bind('body');
  var br = exports.br = bind('br');
  var button = exports.button = bind('button');
  var canvas = exports.canvas = bind('canvas');
  var caption = exports.caption = bind('caption');
  var cite = exports.cite = bind('cite');
  var code = exports.code = bind('code');
  var col = exports.col = bind('col');
  var colgroup = exports.colgroup = bind('colgroup');
  var command = exports.command = bind('command');
  var content = exports.content = bind('content');
  var data = exports.data = bind('data');
  var datalist = exports.datalist = bind('datalist');
  var dd = exports.dd = bind('dd');
  var del = exports.del = bind('del');
  var details = exports.details = bind('details');
  var dfn = exports.dfn = bind('dfn');
  var dialog = exports.dialog = bind('dialog');
  var div = exports.div = bind('div');
  var dl = exports.dl = bind('dl');
  var dt = exports.dt = bind('dt');
  var element = exports.element = bind('element');
  var em = exports.em = bind('em');
  var embed = exports.embed = bind('embed');
  var fieldset = exports.fieldset = bind('fieldset');
  var figcaption = exports.figcaption = bind('figcaption');
  var figure = exports.figure = bind('figure');
  var font = exports.font = bind('font');
  var footer = exports.footer = bind('footer');
  var form = exports.form = bind('form');
  var h1 = exports.h1 = bind('h1');
  var h2 = exports.h2 = bind('h2');
  var h3 = exports.h3 = bind('h3');
  var h4 = exports.h4 = bind('h4');
  var h5 = exports.h5 = bind('h5');
  var h6 = exports.h6 = bind('h6');
  var head = exports.head = bind('head');
  var header = exports.header = bind('header');
  var hgroup = exports.hgroup = bind('hgroup');
  var hr = exports.hr = bind('hr');
  var html = exports.html = bind('html');
  var i = exports.i = bind('i');
  var iframe = exports.iframe = bind('iframe');
  var image = exports.image = bind('image');
  var img = exports.img = bind('img');
  var input = exports.input = bind('input');
  var ins = exports.ins = bind('ins');
  var kbd = exports.kbd = bind('kbd');
  var keygen = exports.keygen = bind('keygen');
  var label = exports.label = bind('label');
  var legend = exports.legend = bind('legend');
  var li = exports.li = bind('li');
  var link = exports.link = bind('link');
  var main = exports.main = bind('main');
  var map = exports.map = bind('map');
  var mark = exports.mark = bind('mark');
  var marquee = exports.marquee = bind('marquee');
  var menu = exports.menu = bind('menu');
  var menuitem = exports.menuitem = bind('menuitem');
  var meta = exports.meta = bind('meta');
  var meter = exports.meter = bind('meter');
  var multicol = exports.multicol = bind('multicol');
  var nav = exports.nav = bind('nav');
  var nobr = exports.nobr = bind('nobr');
  var noembed = exports.noembed = bind('noembed');
  var noframes = exports.noframes = bind('noframes');
  var noscript = exports.noscript = bind('noscript');
  var object = exports.object = bind('object');
  var ol = exports.ol = bind('ol');
  var optgroup = exports.optgroup = bind('optgroup');
  var option = exports.option = bind('option');
  var output = exports.output = bind('output');
  var p = exports.p = bind('p');
  var param = exports.param = bind('param');
  var picture = exports.picture = bind('picture');
  var pre = exports.pre = bind('pre');
  var progress = exports.progress = bind('progress');
  var q = exports.q = bind('q');
  var rp = exports.rp = bind('rp');
  var rt = exports.rt = bind('rt');
  var rtc = exports.rtc = bind('rtc');
  var ruby = exports.ruby = bind('ruby');
  var s = exports.s = bind('s');
  var samp = exports.samp = bind('samp');
  var script = exports.script = bind('script');
  var section = exports.section = bind('section');
  var select = exports.select = bind('select');
  var shadow = exports.shadow = bind('shadow');
  var slot = exports.slot = bind('slot');
  var small = exports.small = bind('small');
  var source = exports.source = bind('source');
  var span = exports.span = bind('span');
  var strong = exports.strong = bind('strong');
  var style = exports.style = bind('style');
  var sub = exports.sub = bind('sub');
  var summary = exports.summary = bind('summary');
  var sup = exports.sup = bind('sup');
  var table = exports.table = bind('table');
  var tbody = exports.tbody = bind('tbody');
  var td = exports.td = bind('td');
  var template = exports.template = bind('template');
  var textarea = exports.textarea = bind('textarea');
  var tfoot = exports.tfoot = bind('tfoot');
  var th = exports.th = bind('th');
  var thead = exports.thead = bind('thead');
  var time = exports.time = bind('time');
  var title = exports.title = bind('title');
  var tr = exports.tr = bind('tr');
  var track = exports.track = bind('track');
  var u = exports.u = bind('u');
  var ul = exports.ul = bind('ul');
  var video = exports.video = bind('video');
  var wbr = exports.wbr = bind('wbr');
});