(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './api/create', './api/emit', './api/factory', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/skate', './api/version'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./api/create'), require('./api/emit'), require('./api/factory'), require('./api/fragment'), require('./api/init'), require('./api/properties/index'), require('./api/ready'), require('./api/render'), require('./api/skate'), require('./api/version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.create, global.emit, global.factory, global.fragment, global.init, global.index, global.ready, global.render, global.skate, global.version);
    global.index = mod.exports;
  }
})(this, function (exports, _create, _emit, _factory, _fragment, _init, _index, _ready, _render, _skate, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.version = exports.render = exports.ready = exports.properties = exports.init = exports.fragment = exports.factory = exports.emit = exports.create = undefined;

  var _create2 = _interopRequireDefault(_create);

  var _emit2 = _interopRequireDefault(_emit);

  var _factory2 = _interopRequireDefault(_factory);

  var _fragment2 = _interopRequireDefault(_fragment);

  var _init2 = _interopRequireDefault(_init);

  var _index2 = _interopRequireDefault(_index);

  var _ready2 = _interopRequireDefault(_ready);

  var _render2 = _interopRequireDefault(_render);

  var _skate2 = _interopRequireDefault(_skate);

  var _version2 = _interopRequireDefault(_version);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _skate2.default.create = _create2.default;
  _skate2.default.emit = _emit2.default;
  _skate2.default.factory = _factory2.default;
  _skate2.default.fragment = _fragment2.default;
  _skate2.default.init = _init2.default;
  _skate2.default.properties = _index2.default;
  _skate2.default.ready = _ready2.default;
  _skate2.default.render = _render2.default;
  _skate2.default.version = _version2.default;
  exports.default = _skate2.default;
  exports.create = _create2.default;
  exports.emit = _emit2.default;
  exports.factory = _factory2.default;
  exports.fragment = _fragment2.default;
  exports.init = _init2.default;
  exports.properties = _index2.default;
  exports.ready = _ready2.default;
  exports.render = _render2.default;
  exports.version = _version2.default;
});