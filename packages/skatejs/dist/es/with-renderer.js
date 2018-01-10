var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ('value' in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

import { shadow } from './shadow.js';

export var withRenderer = function withRenderer() {
  var Base =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : HTMLElement;
  return (function(_Base) {
    _inherits(_class2, _Base);

    function _class2() {
      _classCallCheck(this, _class2);

      return _possibleConstructorReturn(
        this,
        (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(
          this,
          arguments
        )
      );
    }

    _createClass(_class2, [
      {
        key: 'renderer',
        value: function renderer(root, html) {
          if (
            _get(
              _class2.prototype.__proto__ ||
                Object.getPrototypeOf(_class2.prototype),
              'renderer',
              this
            )
          ) {
            _get(
              _class2.prototype.__proto__ ||
                Object.getPrototypeOf(_class2.prototype),
              'renderer',
              this
            ).call(this, root, html);
          } else {
            root.innerHTML = html();
          }
        }
      },
      {
        key: 'updated',
        value: function updated() {
          var _get2,
            _this2 = this;

          for (
            var _len = arguments.length, args = Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key];
          }

          _get(
            _class2.prototype.__proto__ ||
              Object.getPrototypeOf(_class2.prototype),
            'updated',
            this
          ) &&
            (_get2 = _get(
              _class2.prototype.__proto__ ||
                Object.getPrototypeOf(_class2.prototype),
              'updated',
              this
            )).call.apply(_get2, [this].concat(args));
          this.rendering && this.rendering();
          this.renderer(this.renderRoot, function() {
            return _this2.render && _this2.render(_this2);
          });
          this.rendered && this.rendered();
        }
      },
      {
        key: 'renderRoot',
        get: function get() {
          return (
            _get(
              _class2.prototype.__proto__ ||
                Object.getPrototypeOf(_class2.prototype),
              'renderRoot',
              this
            ) || shadow(this)
          );
        }
      }
    ]);

    return _class2;
  })(Base);
};
