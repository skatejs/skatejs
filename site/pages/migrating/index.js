// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

@define
export default class extends Component {
  static is = 'x-pages-migrating';
  render() {
    return this.$`
      <x-layout title="Migrating between major versions">
        <x-marked src="${`
          This is a guide for migrating between major versions.

          ## 4.x to 5.x

          ### Component base class

          \`\`\`js
          - import { h, Component, define } from 'skatejs';
          + import { withComponent } from 'skatejs';
          + import { h } from 'preact';
          + import withPreact from '@skatejs/renderer-preact';

          + const Component = withComponent(withPreact());

            class Hello extends Component {
              static is = 'x-hello';
              render() {
                return <div>Hello <slot/></div>;
              }
            }

            define(MyElement);
          \`\`\`

          ### Props API

          ___The ability to use a static getter for props is now back in 5.1!___

          - In 5.0, you must explicitly set the static props property.
          - The ability to use a getter has been restored in 5.1.

          \`\`\`js
            class Hello extends Component {
              // This doesn't work in 5.0, but does in 5.1.
          -   static get props() {
          -     return {
          -       who: prop.string()
          -     }
          -   }

              // You can do this in both 5.0 and 5.1.
          +   static props = {
          +     who: props.string
          +   };
            }
          \`\`\`


          #### Configuring component props

          \`\`\`js
          - import { define, Component, prop } from 'skatejs';
          + import { withComponent, props } from 'skatejs';
            import { h } from 'preact';
            import withPreact from '@skatejs/renderer-preact';

            const Component = withComponent(withPreact());

            class Hello extends Component {
              static is = 'x-hello';
              static props = {
          -     who: prop.string()
          +     who: props.string
              };
              render() {
                return <div>Hello {this.who}</div>;
              }
            }

            define(MyElement);
          \`\`\`

          #### Overriding pre-defined props

          Built-in props used to be exposed as functions that would mix in whatever object you gave it. Now, it's just an object and if you want to merge objects, you can use the built-in object spread operator, or \`Object.assign()\`.

          \`\`\`js
          - import { define, Component, prop } from 'skatejs';
          + import { withComponent, props } from 'skatejs';
            import { h } from 'preact';
            import withPreact from '@skatejs/renderer-preact';

            const Component = withComponent(withPreact())

            class Hello extends Component {
              static is = 'x-hello';
              static props = {
          -     who: prop.string({ attributes:true })
          +     who: { ...props.string, ...{ attributes: true } }
              };
              render() {
                return <div>Hello {this.who}</div>;
              }
            }

            define(MyElement);
          \`\`\`

          > Built-in props still reflect to attributes like before, but only one-way. If an attribute is set, it will set the linked property. However, if the property is set, it will _not_ set the linked attribute. This prevents unwanted mutations to the DOM and keeps the performance bar high.

          #### Props configuration

          \`\`\`js
            type PropTypeAttributeIdentifier = boolean | string;
            type PropTypeAttribute =
              | PropTypeAttributeIdentifier
              | {
                  source?: PropTypeAttributeIdentifier,
                  target?: PropTypeAttributeIdentifier
                };
            type PropOptions = {
              attribute?: PropTypeAttribute,
              coerce?: Function,
              default?: any,
              deserialize?: (val: string) => mixed,
              serialize?: (val: mixed) => null | string
          -   get?: <R>(elem: El, data: { name: string; internalValue: T; }) => R;
          -   set?: (elem: El, data: { name: string; newValue: T | null | undefined; oldValue: T | null | undefined; }) => void;
          -   initial?: T | null | undefined | ((elem: El, data: { name: string; }) => T | null | undefined);
            }
          \`\`\`

          #### Change / get props

          \`\`\`js
          - import { withComponent, props, prop } from 'skatejs';
          + import { withComponent, props } from 'skatejs';
            import { h } from 'preact';
            import withPreact from '@skatejs/renderer-preact';

            const Component = withComponent(withPreact());

            class Hello extends Component {
              static is = 'x-hello';
              static props = {
                myArray: props.array,
                myBoolean: props.boolean
              };

              // Some internal property.
              someNonPublicApiProp = 'Who are you?';

              _changeProps() {
          -     props(this, { myBoolean: true });
          +     this.props = { myBoolean: true };

                // Implementation detail -> props on the instance is getter / setter.
                // Or just directly.
                this.myBoolean = true

          -     console.log( props(this) ) // { myArray: [], myBoolean: true }
          +     console.log( this.props ) // { myArray: [], myBoolean: true }

          -     props( this, {myArray: ['hello']} )
          +     this.props = { myArray: ['hello'] }

                // Or just directly.
                this.myArray = ['hello'];

          -     console.log(props(this)) // { myArray: ['hello'], myBoolean: true }
          +     console.log(this.props) // { myArray: ['hello'], myBoolean: true }

                // this will not trigger re-render
                this.someNonPublicApiProp = 'Im David'
              }
              render() {
                return <div>Hello {this.myBoolean}</div>;
              }
            }

            define(MyElement);
          \`\`\`

          ### Return array of VNodes with Preact as renderer

          \`\`\`js
          - import { Component, define, h } from 'skatejs';
          + import { define, withComponent } from 'skatejs';
          + import { h } from 'preact';
          + import withPreact from '@skatejs/renderer-preact';

          + const Component = withComponent(withPreact());

            class MyElement extends Component {
              static is = 'x-hello';
              render() {
          -     return [
          -       <div>Hello <slot/></div>,
          -       <div>Yo what's up?</div>
          -     ];
          +     return <div>
          +       <div>Hello <slot/></div>
          +       <div>Yo what's up?</div>
          +     </div>;
              }
            }

            define(MyElement);
          \`\`\`

          > If you decide to use the [LitHTML renderer](/renderers/with-lit-html) you can return a fragment of nodes by simply omitting a wrapper.
        `}"></x-marked>
      </x-layout>
    `;
  }
}
