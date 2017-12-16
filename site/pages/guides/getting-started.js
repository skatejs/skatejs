// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

@define
export default class extends Component {
  static is = 'x-pages-guides-getting-started';
  render() {
    return this.$`
      <x-layout title="Getting started">
        <x-marked
          src="${`
            At its core, Skate is about creating
            [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/). Skate
            provides a series of
            [mixin functions](/mixins)
            that enable you to control what your component can do.

            For instance, Skate's main mixin, \`withComponent\`, is just a composition of all
            of Skate's other mixin behaviours:

            * \`withChildren\` -- the generated element will react to changes to its child
              elements.
            * \`withContext\` -- the element will inherit context from components up the tree,
              like in React.
            * \`withLifecycle\` -- the element can use added sugar on top of the built-in
              lifecycle callbacks.
            * \`withRenderer\` -- the element can generate its own DOM and output it to a
              \`renderRoot\` (a \`ShadowRoot\` node by default).
            * \`withUpdate\` -- the generated element will react to changes on their props or
              HTML attributes.

            Calling \`withComponent()\` gives you a Custom Element class constructor, which
            you can then extend to define your own elements.

            Every mixin accepts an optional \`Element\` constructor as its only parameter,
            which allows you to extend virtually any element type in HTML!

            ### Rendering an element

            As an example, let's create a simple greeting component...

            \`\`\`html
            <x-hello>Bob</x-hello>
            \`\`\`

            ...such that when this element is rendered, the end-user will see \`Hello, Bob!\`.

            We can define a Skate component that renders the contents of our Custom Element:

            \`\`\`js
            import { withComponent } from 'skatejs';

            const Component = withComponent();

            class GreetingComponent extends Component {
              render() {
                return 'Hello, <slot></slot>!';
              }
            }

            customElements.define('x-hello', GreetingComponent);
            \`\`\`

            > It's worth noting that while \`withRenderer()\` provides a very basic renderer that
            sets \`innerHTML\` using the return value of \`render()\`, it's not intended for complex
            usage. If you need events / props / efficient updates, you should use something
            like \`@skatejs/renderer-preact\`.

            When this element is rendered, the DOM will look something like the following:

            \`\`\`html
            <x-hello>
              #shadow-root
                Hello, <slot></slot>!
              Bob
            </x-hello>
            \`\`\`

            This is the utility that web components provide when using Custom Elements and
            the Shadow DOM.

            Skate also allows **turning off Shadow DOM** if you don't wanna use it for
            various particular reasons. You can turn it off via \`get renderRoot()\` override:

            > NOTE: by turning off Shadow DOM you cannot use <slot/> content projection
            > anymore by default, further tweaks needs to be applied

            \`\`\`js
            import { withComponent, props } from 'skatejs';

            // define base class without Shadow DOM
            const NoShadowComponent = class extends withComponent() {
              // you need to return where you want to render your content, in our case we wanna render directly to our custom element children
              get renderRoot() {
                return this;
              }
            };

            // use custom NoShadowComponent as a base class
            class GreetingComponent extends NoShadowComponent {
              static props = {
                name: props.string
              };
              render({ name }) {
                return \`Hello, ${name}!\`;
              }
            }

            customElements.define('x-hello', GreetingComponent);
            \`\`\`

            Now when you write:

            \`\`\`html
            <x-hello name="Bob"></x-hello>
            \`\`\`

            When this element is rendered, the DOM will look something like the following:

            \`\`\`html
            <x-hello>
              Hello, Bob!
            </x-hello>
            \`\`\`

            ### Watching element properties and attributes

            We can create a Skate component that watches for HTML attribute changes on
            itself:

            \`\`\`js
            import { props, withComponent } from 'skatejs';

            const Component = withComponent();

            class GreetingComponent extends Component {
              static props = {
                name: props.string
              };
              render({ name }) {
                return \`Hello, ${name}!\`;
              }
            }

            customElements.define('x-hello', GreetingComponent);
            \`\`\`

            The resulting HTML when the element is rendered would look like this:

            \`\`\`html
            <x-hello name="Bob">
              #shadow-root
                Hello, Bob!
            </x-hello>
            \`\`\`

            Now, whenever the \`name\` property or attribute on the greeting component
            changes, the component will re-render.

            ### Making your own mixins

            In the previous examples, each component implements \`render\` method which
            returns a string. This is default "renderer" behaviour provided by Skate. You
            can define custom renderer as well by re-defining \`renderer\` all the time for
            every component or rather we can write a mixin and take advantage of prototype
            inheritance:

            > NOTE: the \`with\` prefix is not mandatory, just a common practice for naming
            > HOCs and Mixins

            \`\`\`js
            import { props, withComponent } from 'skatejs';

            const withDangerouslyNaiveRenderer = (Base = HTMLElement) => {
              return class extends Base {
                renderer(renderRoot, render) {
                  renderRoot.innerHtml = '';
                  renderRoot.appendChild(render());
                }
              };
            };

            const Component = withComponent(withDangerouslyNaiveRenderer());

            class GreetingComponent extends Component {
              static props = {
                name: props.string
              };
              render({ name }) {
                const el = document.createElement('span');
                el.innerHTML = \`Hello, ${name}!\`;
                return el;
              }
            }

            customElements.define('x-hello', GreetingComponent);
            \`\`\`

            ### Rendering using other front-end libraries

            Skate provides default renderer by setting return string of \`render\` method to
            your component root ( ShadowRoot by default ) via \`innerHTML\`. Besides that it
            allows you to hook to the renderer ( by defining custom renderer ), which gives
            you options to support just about every modern component-based front-end library
            &mdash; React, Preact, Vue... just provide a \`render\` to stamp out your
            component's HTML, a \`renderer\` to update the DOM with your HTML, and then it's
            all the same to Skate!

            The Skate team have provided a few renderers for popular front-end libraries;
            check the [Installing](#installing-skate) section.

            #### Using Skate with Preact

            Instead of writing our own \`renderer\`, we could use a library like
            [Preact](https://preactjs.com/) to do the work for us. Skate provides a
            ready-made renderer for Preact; here's how we would update our previous greeting
            component to use it:

            \`\`\`js
            /** @jsx h */

            import { props, withComponent } from 'skatejs';
            import withRenderer from '@skatejs/renderer-preact';
            import { h } from 'preact';

            const Component = withComponent(withRenderer());

            customElements.define(
              'x-hello',
              class extends Component {
                static props = {
                  name: props.string
                };
                render({ name }) {
                  return <span>Hello, {name}!</span>;
                }
              }
            );
            \`\`\`

            Now that the greeting component is rendered via Preact, when it renders, it only
            changes the part of the DOM that requires updating.
          `}"
        ></x-marked>
      </x-layout>
    `;
  }
}
