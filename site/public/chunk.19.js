webpackJsonp([19], {
  129: function(e, n, t) {
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
    Object.defineProperty(n, '__esModule', { value: !0 }), (n.default = void 0);
    var a,
      c,
      s,
      p = (function() {
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
      l = (function(e, n) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(n) } })
        );
      })(
        [
          '\n      <x-layout title="Mixins">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ],
        [
          '\n      <x-layout title="Mixins">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ]
      );
    t(27), t(32);
    var d = t(7),
      u = t(24),
      f =
        (0, d.define)(
          ((s = c = (function(e) {
            function n() {
              return (
                o(this, n),
                r(
                  this,
                  (n.__proto__ || Object.getPrototypeOf(n)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return (
              i(n, e),
              p(n, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(
                      l,
                      '\n          As stated previously, the mixin pattern is a way to take several class\n          definitions and compose them into one. It works well for custom elements\n          because every element has a different purpose and it allows you to pick\n          and choose what goes into it. It\'s also what lets you render one\n          component with <x-link href="/renderers/with-preact">Preact</x-link>\n          and maybe another with [LitHTML](/renderers/with-lit-html). Each\n          component is self-contained.\n\n          Skate\'s mixins follow a common component lifecycle specification, which\n          enables it to interop with not only itself, but also other libraries.\n          The specification is described as follows and is what you get if you\n          combine all of the mixins together, or use the [`withComponent`](/mixins/with-component)\n          mixin.\n\n          ```js\n          interface Component {\n            // withChildren\n            childrenUpdated(): void;\n\n            // withContext\n            context: Object;\n\n            // withLifecycle\n            connecting(): void;\n            connected(): void;\n            disconnecting(): void;\n            disconnected(): void;\n\n            // withRenderer\n            rendering(): void;\n            render(props: Object, state: Object): any;\n            rendered(): void;\n            renderer(root: Node, render: Render): void;\n\n            // withUpdate\n            static props: PropTypes;\n            props: Object;\n            state: Object;\n            updating(prevProps: Object, prevState: Object): void;\n            shouldUpdate(prevProps: Object, prevState: Object): boolean;\n            updated(prevProps: Object, prevState: Object): void;\n            triggerUpdate(): void;\n          }\n          ```\n        '
                    );
                  }
                }
              ]),
              n
            );
          })(u.Component)),
          (c.is = 'x-pages-mixins'),
          (a = s))
        ) || a;
    n.default = f;
  }
});
