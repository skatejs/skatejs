webpackJsonp([4], {
  161: function(e, t, n) {
    'use strict';
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function o(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function i(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function l(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var u,
      a,
      f,
      s = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      c = (function(e, t) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
        );
      })(
        [
          '\n      ',
          '\n      <x-layout title="LitHTML renderer">\n        <p>\n          The\n          <a href="https://github.com/skatejs/renderer-lit-html">\n            LitHTML renderer\n          </a>\n          allows you to render using\n          <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"></x-runnable>\n      </x-layout>\n    '
        ],
        [
          '\n      ',
          '\n      <x-layout title="LitHTML renderer">\n        <p>\n          The\n          <a href="https://github.com/skatejs/renderer-lit-html">\n            LitHTML renderer\n          </a>\n          allows you to render using\n          <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"></x-runnable>\n      </x-layout>\n    '
        ]
      );
    n(29), n(27), n(34);
    var p = n(7),
      h = n(24);
    n(162);
    var m = n(163),
      b = r(m),
      y = n(164),
      d = r(y),
      w =
        (0, p.define)(
          ((f = a = (function(e) {
            function t() {
              return (
                o(this, t),
                i(
                  this,
                  (t.__proto__ || Object.getPrototypeOf(t)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return (
              l(t, e),
              s(t, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(c, this.$style, b.default, d.default);
                  }
                }
              ]),
              t
            );
          })(h.Component)),
          (a.is = 'x-pages-renderers-lit-html'),
          (u = f))
        ) || u;
    t.default = w;
  },
  162: function(e, t, n) {
    'use strict';
    function r(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function o(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function i(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    var l,
      u,
      a = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      f = (function(e, t) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
        );
      })(['Hello, ', '!'], ['Hello, ', '!']),
      s = n(7),
      c = n(76),
      p = (function(e) {
        return e && e.__esModule ? e : { default: e };
      })(c),
      h = n(75),
      m = ((u = l = (function(e) {
        function t() {
          return (
            r(this, t),
            o(
              this,
              (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
            )
          );
        }
        return (
          i(t, e),
          a(t, [
            {
              key: 'render',
              value: function(e) {
                var t = e.name;
                return (0, h.html)(f, t);
              }
            }
          ]),
          t
        );
      })((0, s.withComponent)((0, p.default)()))),
      (l.props = { name: s.props.string }),
      u);
    customElements.define('with-lit-html', m);
  },
  163: function(e, t) {
    e.exports =
      "import { props, withComponent } from 'skatejs';\nimport withLitHtml from '@skatejs/renderer-lit-html';\nimport { html } from 'lit-html';\n\nclass WithLitHtml extends withComponent(withLitHtml()) {\n  static props = {\n    name: props.string\n  };\n  render({ name }) {\n    return html`Hello, ${name}!`;\n  }\n}\n\ncustomElements.define('with-lit-html', WithLitHtml);\n";
  },
  164: function(e, t) {
    e.exports = '<with-lit-html name="World"></with-lit-html>\n';
  }
});
