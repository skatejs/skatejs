webpackJsonp([7], {
  149: function(e, t, n) {
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
    function a(e, t) {
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
      c,
      l,
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
      f = (function(e, t) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
        );
      })(
        [
          '\n      ',
          '\n      <x-layout title="Renderer">\n        <p>\n          The <code>withRenderer</code> mixin is what connects view libraries such\n          as <x-link href="/renderers/with-react">React</x-link>,\n          <x-link href="/renderers/with-preact">Preact</x-link> and\n          <x-link href="/renderers/with-lit-html">LitHTML</x-link> to the rest\n          of Skate. It implements a <code>updated</code> method so it can be\n          paired with the <code>withUpdate</code> mixin to automate renders, or\n          you can call it imperatively yourself if not.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n        <p>\n          For more information on how to write renderers, see the\n          <x-link href="/renderers">Renderers</x-link> section.\n        </p>\n      </x-layout>\n    '
        ],
        [
          '\n      ',
          '\n      <x-layout title="Renderer">\n        <p>\n          The <code>withRenderer</code> mixin is what connects view libraries such\n          as <x-link href="/renderers/with-react">React</x-link>,\n          <x-link href="/renderers/with-preact">Preact</x-link> and\n          <x-link href="/renderers/with-lit-html">LitHTML</x-link> to the rest\n          of Skate. It implements a <code>updated</code> method so it can be\n          paired with the <code>withUpdate</code> mixin to automate renders, or\n          you can call it imperatively yourself if not.\n        </p>\n        <x-runnable\n          code="',
          '"\n          html="',
          '"\n        ></x-runnable>\n        <p>\n          For more information on how to write renderers, see the\n          <x-link href="/renderers">Renderers</x-link> section.\n        </p>\n      </x-layout>\n    '
        ]
      );
    n(29), n(26), n(34);
    var d = n(7),
      h = n(24);
    n(150);
    var p = n(151),
      b = r(p),
      w = n(152),
      y = r(w),
      m =
        (0, d.define)(
          ((l = c = (function(e) {
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
              a(t, e),
              s(t, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(f, this.$style, b.default, y.default);
                  }
                }
              ]),
              t
            );
          })(h.Component)),
          (c.is = 'x-pages-mixins-renderer'),
          (u = l))
        ) || u;
    t.default = m;
  },
  150: function(e, t, n) {
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
    var a,
      u,
      c = (function() {
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
      l = n(7),
      s = ((u = a = (function(e) {
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
          c(t, [
            {
              key: 'attributeChangedCallback',
              value: function() {
                this.updated();
              }
            },
            {
              key: 'render',
              value: function() {
                return 'Hello, ' + this.getAttribute('name') + '!';
              }
            }
          ]),
          t
        );
      })((0, l.withRenderer)())),
      (a.observedAttributes = ['name']),
      u);
    customElements.define('with-renderer', s);
  },
  151: function(e, t) {
    e.exports =
      "import { withRenderer } from 'skatejs';\n\nclass WithRenderer extends withRenderer() {\n  static observedAttributes = ['name'];\n  attributeChangedCallback() {\n    this.updated();\n  }\n  render() {\n    return `Hello, ${this.getAttribute('name')}!`;\n  }\n}\n\ncustomElements.define('with-renderer', WithRenderer);\n";
  },
  152: function(e, t) {
    e.exports = '<with-renderer name="Bobbo"></with-renderer>\n';
  }
});
