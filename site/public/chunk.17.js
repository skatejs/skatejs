webpackJsonp([17], {
  269: function(e, t, n) {
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
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var a,
      s,
      u,
      l = (function() {
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
      c = (function(e, t) {
        return Object.freeze(
          Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
        );
      })(
        [
          '\n      <x-layout title="emit()">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ],
        [
          '\n      <x-layout title="emit()">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ]
      );
    n(26), n(30);
    var f = n(7),
      p = n(24),
      m =
        (0, f.define)(
          ((u = s = (function(e) {
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
              i(t, e),
              l(t, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(
                      c,
                      "\n          The `emit()` function dispatches an event on the specified element with the most common behaviour one will probably want from a DOM event, while still remaining just as customisable as doing it the longer, built-in way. By default it:\n\n          1. Bubbles\n          2. Is cancelable\n          3. Does not propagate through shadow boundaries.\n\n          It's designed to take a lot of the ceremony out of dispatching events. Also, the `CustomEvent` constructor isn't usable as a constructor in environments where custom elements aren't supported, so you'd have to take that into account, too.\n\n          The Skate example is short, sweet and to the point:\n\n          ```js\n          import { emit } from 'skatejs';\n\n          emit(elem, 'myevent', {\n            detail: {}\n          });\n          ```\n\n          > You can leave out `detail` if you don't need it.\n\n          Compare this to the following, longer forms.\n\n          ### Modern browsers\n\n          ```js\n          elem.dispatchEvent(new CustomEvent('myevent', {\n            bubbles: true,\n            cancelable: true,\n            composed: false,\n            detail: {}\n          }));\n          ```\n\n          ### Non-native environments\n\n          ```js\n          const e = document.createEvent('CustomEvent');\n          e.initCustomEvent('myevent', true, true, {});\n          Object.defineProperty(e, 'composed', { value: false });\n          elem.dispatchEvent(e);\n          ```\n        "
                    );
                  }
                }
              ]),
              t
            );
          })(p.Component)),
          (s.is = 'x-pages-utils-emit'),
          (a = u))
        ) || a;
    t.default = m;
  }
});
