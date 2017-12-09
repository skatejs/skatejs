webpackJsonp([10], {
  142: function(e, n, t) {
    'use strict';
    function o(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function r(e, n) {
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
    function u(e, n) {
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
    var a,
      s,
      c,
      l = (function() {
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
      p = (function(e, n) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(n) } })
        );
      })(
        [
          '\n      ',
          '\n      <x-layout title="Component">\n        <p>\n          The <code>withComponent</code> mixin combines all of Skate\'s mixins into\n          a single one for easy use. It\'s likely that this will be the most common\n          mixin you\'ll pair with renderers when authoring components, unless you\n          prefer to be selective about exactly which mixins you piece together.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n      </x-layout>\n    '
        ],
        [
          '\n      ',
          '\n      <x-layout title="Component">\n        <p>\n          The <code>withComponent</code> mixin combines all of Skate\'s mixins into\n          a single one for easy use. It\'s likely that this will be the most common\n          mixin you\'ll pair with renderers when authoring components, unless you\n          prefer to be selective about exactly which mixins you piece together.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n      </x-layout>\n    '
        ]
      );
    t(29), t(26);
    var f = t(7),
      h = t(22);
    t(143);
    var m = t(144),
      b = o(m),
      y = t(145),
      w = o(y),
      d =
        (0, f.define)(
          ((c = s = (function(e) {
            function n() {
              return (
                r(this, n),
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
              u(n, e),
              l(n, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(p, this.$style, b.default, w.default);
                  }
                }
              ]),
              n
            );
          })(h.Component)),
          (s.is = 'x-pages-mixins-component'),
          (a = c))
        ) || a;
    n.default = d;
  },
  143: function(e, n, t) {
    'use strict';
    function o(e, n) {
      if (!(e instanceof n))
        throw new TypeError('Cannot call a class as a function');
    }
    function r(e, n) {
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
    var u,
      a,
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
      c = t(7),
      l = ((a = u = (function(e) {
        function n() {
          return (
            o(this, n),
            r(
              this,
              (n.__proto__ || Object.getPrototypeOf(n)).apply(this, arguments)
            )
          );
        }
        return (
          i(n, e),
          s(n, [
            {
              key: 'render',
              value: function(e) {
                e.name;
                return 'Hello, ' + this.name + '!';
              }
            }
          ]),
          n
        );
      })((0, c.withComponent)())),
      (u.props = { name: c.props.string }),
      a);
    customElements.define('with-component', l);
  },
  144: function(e, n) {
    e.exports =
      "import { props, withComponent } from 'skatejs';\n\nclass WithComponent extends withComponent() {\n  static props = {\n    name: props.string\n  };\n  render({ name }) {\n    return `Hello, ${this.name}!`;\n  }\n}\n\ncustomElements.define('with-component', WithComponent);\n";
  },
  145: function(e, n) {
    e.exports = '<with-component name="Bobbo"></with-component>\n';
  }
});
