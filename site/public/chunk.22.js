webpackJsonp([22], {
  128: function(e, t, n) {
    'use strict';
    function o(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function r(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function s(e, t) {
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
    var a,
      p,
      i,
      u = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              'value' in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        return function(t, n, o) {
          return n && e(t.prototype, n), o && e(t, o), t;
        };
      })(),
      l = (function(e, t) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
        );
      })(
        [
          '\n      <x-layout title="Flowtype">\n        <x-marked\n          src="',
          '"\n        ></x-marked>\n      </x-layout>\n    '
        ],
        [
          '\n      <x-layout title="Flowtype">\n        <x-marked\n          src="',
          '"\n        ></x-marked>\n      </x-layout>\n    '
        ]
      );
    n(26), n(30);
    var c = n(7),
      f = n(24),
      h =
        (0, c.define)(
          ((i = p = (function(e) {
            function t() {
              return (
                o(this, t),
                r(
                  this,
                  (t.__proto__ || Object.getPrototypeOf(t)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return (
              s(t, e),
              u(t, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(
                      l,
                      "\n            In this section, you'll find out how to use Flowtype to augment your component workflow. To learn more about Flow and how to get started, read more [here](https://flow.org/en/docs/getting-started/).\n\n            ### Auto-defining Skate props using Flow types\n\n            If you're using Flow as your type superset of choice, you may find that you're having to write both Flow types for your props as well as declare Skate props to get the attribute linkage and rerendering when your props change. For example:\n\n            ```js\n            import { props, withComponent } from 'skatejs';\n\n            type Props = {\n              name: string\n            };\n\n            class MyComponent extends withComponent() {\n              props: Props;\n              static props = {\n                name: props.string\n              };\n            }\n            ```\n\n            The good news is, that you can reuse your Flow definitions and use the [`transform-skate-flow-props`](https://github.com/skatejs/babel-plugin-transform-skate-flow-props) Babel plugin to generate Skate props from them.\n\n            Your code would end up looking like:\n\n            ```js\n            import { props, withComponent } from 'skatejs';\n\n            type Props = {\n              name: string\n            };\n\n            class MyComponent extends withComponent() {\n              props: Props;\n            }\n            ```\n\n            To learn more about how to do this, see the [documentation](https://github.com/skatejs/babel-plugin-transform-skate-flow-props) for the Babel plugin.\n\n            ### Sharing types between React and Skate\n\n            If you're using the [React renderer](http://localhost:8080/renderers/with-react) to render your components, and you're using Flow, you may find that you're duplicating your props in your React component and your Skate component.\n\n            The good news is, that you can share these types, so long as the names and types are the same. For more information on this, see the [docs](https://github.com/skatejs/renderer-react#using-flow-to-share-prop-types) for the renderer.\n          "
                    );
                  }
                }
              ]),
              t
            );
          })(f.Component)),
          (p.is = 'x-pages-guides-flowtype'),
          (a = i))
        ) || a;
    t.default = h;
  }
});
