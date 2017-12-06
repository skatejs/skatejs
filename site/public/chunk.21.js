webpackJsonp([21], {
  129: function(n, e, t) {
    'use strict';
    function r(n, e) {
      if (!(n instanceof e))
        throw new TypeError('Cannot call a class as a function');
    }
    function o(n, e) {
      if (!n)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !e || ('object' != typeof e && 'function' != typeof e) ? n : e;
    }
    function i(n, e) {
      if ('function' != typeof e && null !== e)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof e
        );
      (n.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        e &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(n, e)
            : (n.__proto__ = e));
    }
    Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = void 0);
    var s,
      p,
      a,
      l = (function() {
        function n(n, e) {
          for (var t = 0; t < e.length; t++) {
            var r = e[t];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(n, r.key, r);
          }
        }
        return function(e, t, r) {
          return t && n(e.prototype, t), r && n(e, r), e;
        };
      })(),
      m = (function(n, e) {
        return Object.freeze(
          Object.defineProperties(n, { raw: { value: Object.freeze(e) } })
        );
      })(
        [
          '\n      <x-layout title="Migrating between major versions">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ],
        [
          '\n      <x-layout title="Migrating between major versions">\n        <x-marked src="',
          '"></x-marked>\n      </x-layout>\n    '
        ]
      );
    t(26), t(30);
    var u = t(7),
      c = t(22),
      d =
        (0, u.define)(
          ((a = p = (function(n) {
            function e() {
              return (
                r(this, e),
                o(
                  this,
                  (e.__proto__ || Object.getPrototypeOf(e)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return (
              i(e, n),
              l(e, [
                {
                  key: 'render',
                  value: function() {
                    return this.$(
                      m,
                      "\n          This is a guide for migrating between major versions.\n\n          ## 4.x to 5.x\n\n          ### Component base class\n\n          ```js\n          - import { h, Component, define } from 'skatejs';\n          + import { withComponent } from 'skatejs';\n          + import { h } from 'preact';\n          + import withPreact from '@skatejs/renderer-preact';\n\n          + const Component = withComponent(withPreact());\n\n            class Hello extends Component {\n              static is = 'x-hello';\n              render() {\n                return <div>Hello <slot/></div>;\n              }\n            }\n\n            define(MyElement);\n          ```\n\n          ### Props API\n\n          **NOTE: ES language changes.**\n\n          - If you used getters before for defining props or is, that won't work anymore.\n          - You have to provide just static class properties for `props`. We're working on possibly brining this back.\n          - The `is` static property can still be specified as a getter.\n\n          ```js\n            class Hello extends Component {\n              static is = 'x-hello';\n          -   static get props() {\n          -    return {\n          -      who: prop.string()\n          -     }\n          -   }\n          +   static props = {\n          +     who: props.string\n          +   };\n            }\n          ```\n\n\n          #### Configuring component props\n\n          ```js\n          - import { define, Component, prop } from 'skatejs';\n          + import { withComponent, props } from 'skatejs';\n            import { h } from 'preact';\n            import withPreact from '@skatejs/renderer-preact';\n\n            const Component = withComponent(withPreact());\n\n            class Hello extends Component {\n              static is = 'x-hello';\n              static props = {\n          -     who: prop.string()\n          +     who: props.string\n              };\n              render() {\n                return <div>Hello {this.who}</div>;\n              }\n            }\n\n            define(MyElement);\n          ```\n\n          #### Overriding pre-defined props\n\n          ```js\n          - import { define, Component, prop } from 'skatejs';\n          + import { withComponent, props } from 'skatejs';\n            import { h } from 'preact';\n            import withPreact from '@skatejs/renderer-preact';\n\n            const Component = withComponent(withPreact())\n\n            class Hello extends Component {\n              static is = 'x-hello';\n              static props = {\n          -     who: prop.string({ attributes:true })\n          +     who: { ...props.string, attributes: true }\n              };\n              render() {\n                return <div>Hello {this.who}</div>;\n              }\n            }\n\n            define(MyElement);\n          ```\n\n          > Built-in props still reflect to attributes like before, but only one-way. If an attribute is set, it will set the linked property. However, if the property is set, it will _not_ set the linked attribute. This prevents unwanted mutations to the DOM and keeps the performance bar high.\n\n          #### Props configuration\n\n          ```js\n            type PropTypeAttributeIdentifier = boolean | string;\n            type PropTypeAttribute =\n              | PropTypeAttributeIdentifier\n              | {\n                  source?: PropTypeAttributeIdentifier,\n                  target?: PropTypeAttributeIdentifier\n                };\n            type PropOptions = {\n              attribute?: PropTypeAttribute,\n              coerce?: Function,\n              default?: any,\n              deserialize?: (val: string) => mixed,\n              serialize?: (val: mixed) => null | string\n          -   get?: <R>(elem: El, data: { name: string; internalValue: T; }) => R;\n          -   set?: (elem: El, data: { name: string; newValue: T | null | undefined; oldValue: T | null | undefined; }) => void;\n          -   initial?: T | null | undefined | ((elem: El, data: { name: string; }) => T | null | undefined);\n            }\n          ```\n\n          #### Change / get props\n\n          ```js\n          - import { withComponent, props, prop } from 'skatejs';\n          + import { withComponent, props } from 'skatejs';\n            import { h } from 'preact';\n            import withPreact from '@skatejs/renderer-preact';\n\n            const Component = withComponent(withPreact());\n\n            class Hello extends Component {\n              static is = 'x-hello';\n              static props = {\n                myArray: props.array,\n                myBoolean: props.boolean\n              };\n\n              // Some internal property.\n              someNonPublicApiProp = 'Who are you?';\n\n              _changeProps() {\n          -     props(this, { myBoolean: true });\n          +     this.props = { myBoolean: true };\n\n                // Implementation detail -> props on the instance is getter / setter.\n                // Or just directly.\n                this.myBoolean = true\n\n          -     console.log( props(this) ) // { myArray: [], myBoolean: true }\n          +     console.log( this.props ) // { myArray: [], myBoolean: true }\n\n          -     props( this, {myArray: ['hello']} )\n          +     this.props = { myArray: ['hello'] }\n\n                // Or just directly.\n                this.myArray = ['hello'];\n\n          -     console.log(props(this)) // { myArray: ['hello'], myBoolean: true }\n          +     console.log(this.props) // { myArray: ['hello'], myBoolean: true }\n\n                // this will not trigger re-render\n                this.someNonPublicApiProp = 'Im David'\n              }\n              render() {\n                return <div>Hello {this.myBoolean}</div>;\n              }\n            }\n\n            define(MyElement);\n          ```\n\n          ### Return array of VNodes with Preact as renderer\n\n          ```js\n          - import { Component, define, h } from 'skatejs';\n          + import { define, withComponent } from 'skatejs';\n          + import { h } from 'preact';\n          + import withPreact from '@skatejs/renderer-preact';\n\n          + const Component = withComponent(withPreact());\n\n            class MyElement extends Component {\n              static is = 'x-hello';\n              render() {\n          -     return [\n          -       <div>Hello <slot/></div>,\n          -       <div>Yo what's up?</div>\n          -     ];\n          +     return <div>\n          +       <div>Hello <slot/></div>\n          +       <div>Yo what's up?</div>\n          +     </div>;\n              }\n            }\n\n            define(MyElement);\n          ```\n\n          > If you decide to use the [LitHTML renderer](/renderers/with-lit-html) you can return a fragment of nodes by simply omitting a wrapper.\n        "
                    );
                  }
                }
              ]),
              e
            );
          })(c.Component)),
          (p.is = 'x-pages-migrating'),
          (s = a))
        ) || s;
    e.default = d;
  }
});
