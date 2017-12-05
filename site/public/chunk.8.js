webpackJsonp([8], {
  146: function(e, n, t) {
    'use strict';
    function o(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function c(e, n) {
      if (!(e instanceof n))
        throw new TypeError('Cannot call a class as a function');
    }
    function i(e, n) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !n || ('object' != typeof n && 'function' != typeof n) ? e : n;
    }
    function r(e, n) {
      if ('function' != typeof n && null !== n)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof n
        );
      (e.prototype = Object.create(n && n.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        n &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, n)
            : (e.__proto__ = n));
    }
    Object.defineProperty(n, '__esModule', { value: !0 }), (n.default = void 0);
    var l,
      a,
      u,
      s = (function() {
        function e(e, n) {
          for (var t = 0; t < n.length; t++) {
            var o = n[t];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              'value' in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        return function(n, t, o) {
          return t && e(n.prototype, t), o && e(n, o), n;
        };
      })(),
      f = (function(e, n) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(n) } })
        );
      })(
        [
          '\n      ',
          '\n      <x-layout title="Lifecycle">\n        <p>\n          The <code>withLifecycle</code> mixin adds sugar around the native\n          lifecycle callbacks. It wraps before and after callbacks around them,\n          which allows you to add lifecycles without having to remember to call\n          super.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n        <p>\n          The example above shows the methods that get called when mounted. When\n          unmounted from the DOM, their counterparts are also called:\n        </p>\n        <ul>\n          <li>\n            <code>disconnecting()</code>\n          </li>\n          <li>\n            <code>disconnected()</code>\n          </li>\n        </ul>\n      </x-layout>\n    '
        ],
        [
          '\n      ',
          '\n      <x-layout title="Lifecycle">\n        <p>\n          The <code>withLifecycle</code> mixin adds sugar around the native\n          lifecycle callbacks. It wraps before and after callbacks around them,\n          which allows you to add lifecycles without having to remember to call\n          super.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n        <p>\n          The example above shows the methods that get called when mounted. When\n          unmounted from the DOM, their counterparts are also called:\n        </p>\n        <ul>\n          <li>\n            <code>disconnecting()</code>\n          </li>\n          <li>\n            <code>disconnected()</code>\n          </li>\n        </ul>\n      </x-layout>\n    '
        ]
      );
    t(29), t(26);
    var h = t(7),
      d = t(22);
    t(147);
    var p = t(148),
      y = o(p),
      b = t(149),
      w = o(b),
      m =
        (0, h.define)(
          ((u = a = (function(e) {
            function n() {
              return (
                c(this, n),
                i(
                  this,
                  (n.__proto__ || Object.getPrototypeOf(n)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return (
              r(n, e),
              s(n, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(f, this.$style, y.default, w.default);
                  }
                }
              ]),
              n
            );
          })(d.Component)),
          (a.is = 'x-pages-mixins-lifecycle'),
          (l = u))
        ) || l;
    n.default = m;
  },
  147: function(e, n, t) {
    'use strict';
    function o(e, n) {
      if (!(e instanceof n))
        throw new TypeError('Cannot call a class as a function');
    }
    function c(e, n) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !n || ('object' != typeof n && 'function' != typeof n) ? e : n;
    }
    function i(e, n) {
      if ('function' != typeof n && null !== n)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof n
        );
      (e.prototype = Object.create(n && n.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        n &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, n)
            : (e.__proto__ = n));
    }
    var r = (function() {
        function e(e, n) {
          for (var t = 0; t < n.length; t++) {
            var o = n[t];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              'value' in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        return function(n, t, o) {
          return t && e(n.prototype, t), o && e(n, o), n;
        };
      })(),
      l = t(7),
      a = (function(e) {
        function n() {
          return (
            o(this, n),
            c(
              this,
              (n.__proto__ || Object.getPrototypeOf(n)).apply(this, arguments)
            )
          );
        }
        return (
          i(n, e),
          r(n, [
            {
              key: 'connectedCallback',
              value: function() {
                this._isConnected = !0;
              }
            }
          ]),
          n
        );
      })(HTMLElement),
      u = (function(e) {
        function n() {
          return (
            o(this, n),
            c(
              this,
              (n.__proto__ || Object.getPrototypeOf(n)).apply(this, arguments)
            )
          );
        }
        return (
          i(n, e),
          r(n, [
            {
              key: 'connecting',
              value: function() {
                this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
              }
            },
            {
              key: 'connected',
              value: function() {
                this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
              }
            }
          ]),
          n
        );
      })((0, l.withLifecycle)(a));
    customElements.define('with-lifecycle', u);
  },
  148: function(e, n) {
    e.exports =
      "import { withLifecycle } from 'skatejs';\n\nclass Base extends HTMLElement {\n  connectedCallback() {\n    this._isConnected = true;\n  }\n}\n\nclass WithLifecycle extends withLifecycle(Base) {\n  connecting() {\n    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';\n  }\n  connected() {\n    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';\n  }\n}\n\ncustomElements.define('with-lifecycle', WithLifecycle);\n";
  },
  149: function(e, n) {
    e.exports = '<with-lifecycle></with-lifecycle>\n';
  }
});
