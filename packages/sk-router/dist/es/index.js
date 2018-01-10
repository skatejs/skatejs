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

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

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

// @jsx h

import page from 'page';
import { define, props, withComponent } from 'skatejs';
import { h } from '@skatejs/val';

var Component = (function(_withComponent) {
  _inherits(Component, _withComponent);

  function Component() {
    _classCallCheck(this, Component);

    return _possibleConstructorReturn(
      this,
      (Component.__proto__ || Object.getPrototypeOf(Component)).apply(
        this,
        arguments
      )
    );
  }

  _createClass(Component, [
    {
      key: 'renderer',
      value: function renderer(renderRoot, render) {
        var firstChild = renderRoot.firstChild;

        var dom = render();
        if (firstChild) {
          if (dom) {
            renderRoot.replaceChild(dom, firstChild);
          } else {
            renderRoot.removeChild(firstChild);
          }
        } else if (dom) {
          renderRoot.appendChild(dom);
        }
      }
    }
  ]);

  return Component;
})(withComponent());

export var Link = (function(_Component) {
  _inherits(Link, _Component);

  function Link() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, Link);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret = ((_temp = ((_this2 = _possibleConstructorReturn(
        this,
        (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this2)),
      (_this2.go = function(e) {
        e.preventDefault();
        page.show(_this2.href);
      }),
      _temp)),
      _possibleConstructorReturn(_this2, _ret)
    );
  }

  _createClass(Link, [
    {
      key: 'render',
      value: function render(_ref2) {
        var classNames = _ref2.classNames,
          css = _ref2.css,
          href = _ref2.href;

        return h(
          'a',
          {
            className: classNames.a || '',
            href: href,
            events: { click: this.go }
          },
          h('style', null, css),
          h('slot', null)
        );
      }
    }
  ]);

  return Link;
})(Component);

Link.is = 'sk-link';
Link.props = {
  classNames: props.object,
  css: props.string,
  href: props.string
};
export var Route = (function(_Component2) {
  _inherits(Route, _Component2);

  function Route() {
    _classCallCheck(this, Route);

    return _possibleConstructorReturn(
      this,
      (Route.__proto__ || Object.getPrototypeOf(Route)).apply(this, arguments)
    );
  }

  _createClass(Route, [
    {
      key: 'updated',
      value: function updated() {
        var _this4 = this,
          _get2;

        var PageToRender = this.PageToRender;

        if (PageToRender) {
          if (PageToRender.constructor === Function) {
            PageToRender = new PageToRender();
          }
          if (PageToRender.then) {
            PageToRender.then(function(Page) {
              return (_this4.PageToRender = Page.default || Page);
            });
          }
        }

        for (
          var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2] = arguments[_key2];
        }

        return (_get2 = _get(
          Route.prototype.__proto__ || Object.getPrototypeOf(Route.prototype),
          'updated',
          this
        )).call.apply(_get2, [this].concat(args));
      }
    },
    {
      key: 'render',
      value: function render(_ref3) {
        var PageToRender = _ref3.PageToRender,
          propsToRender = _ref3.propsToRender;

        if (
          PageToRender &&
          PageToRender.prototype &&
          PageToRender.prototype.render
        ) {
          return h(PageToRender, null);
        }
      }
    }
  ]);

  return Route;
})(Component);

Route.is = 'sk-route';
Route.props = {
  page: null,
  PageToRender: null,
  path: props.string,
  propsToRender: props.object
};
export var Router = (function(_Component3) {
  _inherits(Router, _Component3);

  function Router() {
    _classCallCheck(this, Router);

    return _possibleConstructorReturn(
      this,
      (Router.__proto__ || Object.getPrototypeOf(Router)).apply(this, arguments)
    );
  }

  _createClass(Router, [
    {
      key: 'childrenUpdated',
      value: function childrenUpdated() {
        [].concat(_toConsumableArray(this.children)).forEach(function(route) {
          page(route.path, function(ctxt, next) {
            route.propsToRender = ctxt;
            route.PageToRender = route.page;
          });
          page.exit(route.path, function(ctxt, next) {
            route.PageToRender = null;
            next();
          });
        });
        page.start();
      }
    },
    {
      key: 'updated',
      value: function updated() {
        var _get3;

        page(this.options);

        for (
          var _len3 = arguments.length, args = Array(_len3), _key3 = 0;
          _key3 < _len3;
          _key3++
        ) {
          args[_key3] = arguments[_key3];
        }

        return (_get3 = _get(
          Router.prototype.__proto__ || Object.getPrototypeOf(Router.prototype),
          'updated',
          this
        )).call.apply(_get3, [this].concat(args));
      }
    },
    {
      key: 'render',
      value: function render() {
        return h('slot', null);
      }
    }
  ]);

  return Router;
})(Component);

Router.is = 'sk-router';
Router.props = {
  options: props.object
};
[Link, Route, Router].forEach(define);
