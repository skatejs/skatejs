var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

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

import React from 'react';
import { render } from 'react-dom';
import { withRenderer } from 'skatejs';

var withReact = function withReact() {
  var Base =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : HTMLElement;
  return (function(_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(
        this,
        (_class.__proto__ || Object.getPrototypeOf(_class)).apply(
          this,
          arguments
        )
      );
    }

    _createClass(_class, [
      {
        key: 'renderer',
        value: function renderer(root, call) {
          render(call(), root);
        }
      },
      {
        key: 'props',
        get: function get() {
          // We override props so that we can satisfy most use
          // cases for children by using a slot.
          return _extends(
            {},
            _get(
              _class.prototype.__proto__ ||
                Object.getPrototypeOf(_class.prototype),
              'props',
              this
            ),
            { children: React.createElement('slot', null) }
          );
        }
      }
    ]);

    return _class;
  })(Base);
};

export default withReact;

export var wrap = function wrap(Component) {
  return (function(_withReact) {
    _inherits(_class2, _withReact);

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
        key: 'render',
        value: function render() {
          return React.createElement(Component, this.props);
        }
      }
    ]);

    return _class2;
  })(withReact());
};
