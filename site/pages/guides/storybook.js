// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

// $FlowFixMe - decorators
@define
export default class extends Component {
  static is = 'x-pages-guides-storybook';
  render() {
    return this.$`
      <x-layout title="Using Storybook">
        <x-marked
          src="${`
            If you're building UI components, it's likely you want to have a development environment to test different permutations of your components by actually using them. The React ecosystem came up with a fantastic tool called [Storybook](https://storybook.js.org). If you haven't heard of it, you should check it out. However, if you're here, it's likely you have, but you might be wondering how you can use it with web components.

            ### Getting set up

            You'll want to install React (or one of the other supported frameworks) first so that the \`getstorybook\` command works.

            \`\`\`
            npm i react react-dom
            \`\`\`

            Then you can follow their instructions [here](https://storybook.js.org/basics/quick-start-guide/) to set up Storybook.

            ### Boilerplate

            Once you're all set up, you'll end up with a file called \`stories/index.stories.js\`. When you open it you'll probably see a bunch of boilerplate. Blow it all away and replace it with this:

            \`\`\`js
            import React from 'react';
            import { storiesOf } from '@storybook/react';
            \`\`\`

            ### Initial configuration

            Before we start coding in this file, we're going to set up our environment assuming that the browser we're testing in has native support for Custom Elements and Shadow DOM. Since Storybook transpiles everything to ES5 by default, we need to add the [Custom Elements ES5 adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs). To do this, we create a file called [\`.storybook/preview-head.html\`](https://storybook.js.org/configurations/add-custom-head-tags/) and put the following in it:

            \`\`\`html
            <script src="https://unpkg.com/@webcomponents/webcomponentsjs@1.0.22/custom-elements-es5-adapter.js"></script>
            \`\`\`

            This ensures that the adapter is loaded in your UI frame before your application code. If you don't do this, you'll get an error that says something like:

            > Uncaught TypeError: Failed to construct 'HTMLElement': Please use the 'new' operator, this DOM object constructor cannot be called as a function.

            ### Our test component

            Now that our environment is all set up, we can start coding a test component that's pretty simple. The goal here is to show how to set up Storybook, not necessarily build a complex component.

            Before we start writing our component we need to install a few things:

            1. SkateJS - _duh!_
            2. [LitHTML](https://github.com/PolymerLabs/lit-html) - we want to show how to use something besides React, inside of a React dev tool.
            3. The [SkateJS renderer for LitHTML](/renderers/with-lit-html) - just ties LitHTML into Skate.

            \`\`\`js
            npm i skatejs @skatejs/renderer-lit-html lit-html
            \`\`\`

            Once those are installed, we can start writing out component. For the sake of simplicity, we'll just put this in the story file that was created for us. If you were setting up a dev environment for yourself, you'd probably be putting this in a separate directory and importing it.

            \`\`\`js
            import { define, withComponent } from 'skatejs';
            import withLitHtml from '@skatejs/renderer-lit-html';
            import { html } from 'lit-html/lib/lit-extended';

            const Hello = define(
              class extends withComponent(withLitHtml()) {
                render() {
                  return html\`Hello, <strong><slot>World</slot></strong>!\`;
                }
              }
            );
            \`\`\`

            If you're not familiar with how renderers work, see the [docs on renderers](/renderers).

            ### Writing the stories

            Before we write our stories, let's enable a few things in React:

            1. Prefer setting properties (React sets attributes).
            2. Make custom events work.
            3. Make passing the custom element constructor as the JSX element tag name
               just work. Using this along with Skate's [\`define()\`](http://localhost:8080/utils/define) utility makes HMR
               work out of the box.

            To do this, we can use [\`@skatejs/val\`](https://github.com/skatejs/val). First install it:

            \`\`\`
            npm i @skatejs/val
            \`\`\`

            And then all you have to do is import it and patch \`React.createElement\`:

            \`\`\`js
            // @jsx h

            import val from '@skatejs/val';

            const h = val(React.createElement);
            \`\`\`

            This now makes writing our stories easier:

            \`\`\`js
            storiesOf('Hello', module)
              .add('with no name', () => <Hello />)
              .add('with a name', () => <Hello>You</Hello>);
            \`\`\`

            ### Summing up

            Your story file should now look something like:

            \`\`\`js
            // @jsx h

            import React from 'react';
            import { storiesOf } from '@storybook/react';

            import { define, withComponent } from 'skatejs';
            import withLitHtml from '@skatejs/renderer-lit-html';
            import { html } from 'lit-html/lib/lit-extended';

            import val from '@skatejs/val';

            const h = val(React.createElement);

            const Hello = define(
              class extends withComponent(withLitHtml()) {
                render() {
                  return html\`Hello, <strong><slot>World</slot></strong>!\`;
                }
              }
            );

            storiesOf('Hello', module)
              .add('with no name', () => <Hello />)
              .add('with a name', () => <Hello>You</Hello>);
            \`\`\`

            You should now have a fully functional Storybook dev environment that you can use to develop your custom elements.

            From here, you'd probably want to pull the component out into its own file and import it into your story. You'd probably also want to pull the patching of \`React.createElement\` out into it's own module, as well.

            ### Using Storybook without Skate (vanilla custom elements)

            What's interesting about this is you could remove the Skate parts and everything would still just work because all Skate does is make it easier to write a vanilla custom element. Removing Skate and replacing the test component with a vanilla custom element would look something like this:

            \`\`\`js
            // @jsx h

            import React from 'react';
            import { storiesOf } from '@storybook/react';

            import val from '@skatejs/val';

            const h = val(React.createElement);

            class Hello extends HTMLElement {
              constructor() {
                super();
                this.attachShadow({ mode: 'open' });
              }
              connectedCallback() {
                this.shadowRoot.innerHTML = \`Hello, <strong><slot>World</slot></strong>!\`;
              }
            }

            customElements.define('x-hello', Hello);

            storiesOf('Hello', module)
              .add('with no name', () => <Hello />)
              .add('with a name', () => <Hello>You</Hello>);
            \`\`\`

            You lose some possibly important features, such as HMR support because you can only register a custom element with the same name once, and this would try to do it multiple times. However, this goes to show that custom elements are the glue that allows you to share components across frameworks; the DOM is your abstraction layer.
          `}"
        ></x-marked>
      </x-layout>
    `;
  }
}
