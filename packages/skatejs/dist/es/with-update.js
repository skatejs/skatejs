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

import { empty, keys, sym } from './util/index.js';

import {
  normalisePropertyDefinition,
  syncAttributeToProperty,
  syncPropertyToAttribute
} from './util/with-update.js';

function defineProps(constructor) {
  if (constructor.hasOwnProperty('_propsNormalised')) return;
  var props = constructor.props;

  keys(props).forEach(function(name) {
    var func = props[name];
    if (typeof func !== 'function') func = prop(func);
    func({ constructor: constructor }, name);
  });
}

function delay(fn) {
  if (window.Promise) {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

export function prop(definition) {
  var propertyDefinition = definition || {};

  // Allows decorators, or imperative definitions.
  var func = function func(_ref, name) {
    var constructor = _ref.constructor;

    var normalised = normalisePropertyDefinition(name, propertyDefinition);
    var _value = sym(name);

    // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
    // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.
    if (!constructor.hasOwnProperty('_propsNormalised')) {
      constructor._propsNormalised = {};
    }

    // Cache the value so we can reference when syncing the attribute to the property.
    constructor._propsNormalised[name] = normalised;

    if (normalised.attribute.source) {
      constructor._observedAttributes.push(normalised.attribute.source);
    }

    Object.defineProperty(constructor.prototype, name, {
      configurable: true,
      get: function get() {
        var val = this[_value];
        return val == null ? normalised.default : val;
      },
      set: function set(val) {
        this[_value] = normalised.coerce(val);
        syncPropertyToAttribute(
          this,
          normalised.attribute.target,
          normalised.serialize,
          val
        );
        this.triggerUpdate();
      }
    });
  };

  // Allows easy extension of pre-defined props { ...prop(), ...{} }.
  Object.keys(propertyDefinition).forEach(function(key) {
    return (func[key] = propertyDefinition[key]);
  });

  return func;
}

export var withUpdate = function withUpdate() {
  var _class, _temp2;

  var Base =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : HTMLElement;
  return (
    (_temp2 = _class = (function(_Base) {
      _inherits(_class, _Base);

      function _class() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, _class);

        for (
          var _len = arguments.length, args = Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key];
        }

        return (
          (_ret = ((_temp = ((_this = _possibleConstructorReturn(
            this,
            (_ref2 =
              _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(
              _ref2,
              [this].concat(args)
            )
          )),
          _this)),
          (_this._prevProps = {}),
          (_this._prevState = {}),
          (_this._state = {}),
          _temp)),
          _possibleConstructorReturn(_this, _ret)
        );
      }

      _createClass(
        _class,
        [
          {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(name, oldValue, newValue) {
              if (
                _get(
                  _class.prototype.__proto__ ||
                    Object.getPrototypeOf(_class.prototype),
                  'attributeChangedCallback',
                  this
                )
              ) {
                _get(
                  _class.prototype.__proto__ ||
                    Object.getPrototypeOf(_class.prototype),
                  'attributeChangedCallback',
                  this
                ).call(this, name, oldValue, newValue);
              }
              syncAttributeToProperty(this, name, newValue);
            }
          },
          {
            key: 'connectedCallback',
            value: function connectedCallback() {
              if (
                _get(
                  _class.prototype.__proto__ ||
                    Object.getPrototypeOf(_class.prototype),
                  'connectedCallback',
                  this
                )
              ) {
                _get(
                  _class.prototype.__proto__ ||
                    Object.getPrototypeOf(_class.prototype),
                  'connectedCallback',
                  this
                ).call(this);
              }
              this.triggerUpdate();
            }
          },
          {
            key: 'shouldUpdate',
            value: function shouldUpdate() {
              return true;
            }
          },
          {
            key: 'triggerUpdate',
            value: function triggerUpdate() {
              var _this2 = this;

              if (this._updating) {
                return;
              }
              this._updating = true;
              delay(function() {
                var _prevProps = _this2._prevProps,
                  _prevState = _this2._prevState;

                if (_this2.updating) {
                  _this2.updating(_prevProps, _prevState);
                }
                if (
                  _this2.updated &&
                  _this2.shouldUpdate(_prevProps, _prevState)
                ) {
                  _this2.updated(_prevProps, _prevState);
                }
                _this2._prevProps = _this2.props;
                _this2._prevState = _this2.state;
                _this2._updating = false;
              });
            }
          },
          {
            key: 'props',
            get: function get() {
              var _this3 = this;

              return keys(this.constructor.props).reduce(function(prev, curr) {
                prev[curr] = _this3[curr];
                return prev;
              }, {});
            },
            set: function set(props) {
              var _this4 = this;

              var ctorProps = this.constructor.props;
              keys(props).forEach(function(k) {
                return k in ctorProps && (_this4[k] = props[k]);
              });
            }
          },
          {
            key: 'state',
            get: function get() {
              return this._state;
            },
            set: function set(state) {
              this._state = state;
              this.triggerUpdate();
            }
          }
        ],
        [
          {
            key: 'observedAttributes',
            get: function get() {
              // We have to define props here because observedAttributes are retrieved
              // only once when the custom element is defined. If we did this only in
              // the constructor, then props would not link to attributes.
              defineProps(this);
              return this._observedAttributes;
            }
          },
          {
            key: 'props',
            get: function get() {
              return this._props;
            },
            set: function set(props) {
              this._props = props;
            }
          }
        ]
      );

      return _class;
    })(Base)),
    (_class._observedAttributes = []),
    _temp2
  );
};

var parse = JSON.parse,
  stringify = JSON.stringify;

var attribute = Object.freeze({ source: true });
var zeroOrNumber = function zeroOrNumber(val) {
  return empty(val) ? 0 : Number(val);
};

var any = prop({
  attribute: attribute
});

var array = prop({
  attribute: attribute,
  coerce: function coerce(val) {
    return Array.isArray(val) ? val : empty(val) ? null : [val];
  },
  default: Object.freeze([]),
  deserialize: parse,
  serialize: stringify
});

var boolean = prop({
  attribute: attribute,
  coerce: Boolean,
  default: false,
  deserialize: function deserialize(val) {
    return !empty(val);
  },
  serialize: function serialize(val) {
    return val ? '' : null;
  }
});

var number = prop({
  attribute: attribute,
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: function serialize(val) {
    return empty(val) ? null : String(Number(val));
  }
});

var object = prop({
  attribute: attribute,
  default: Object.freeze({}),
  deserialize: parse,
  serialize: stringify
});

var string = prop({
  attribute: attribute,
  default: '',
  coerce: String,
  serialize: function serialize(val) {
    return empty(val) ? null : String(val);
  }
});

export var props = {
  any: any,
  array: array,
  boolean: boolean,
  number: number,
  object: object,
  string: string
};
