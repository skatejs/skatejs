import { define } from 'skatejs';
import '../../components/layout';
import '../../components/marked';
import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-utils-link';
    render() {
      return this.$`
      <x-layout title="link()">
        <x-marked src="${`
          The \`link()\` function automatically links any element that has a \`value\` property, using an event, back to your component's state, or any other object.

          For example, if I have an input element that I want to link back to some internal state, I can do so in a couple lines of code. Let's first build out our component, then we'll link it up. We'll use [LitHTML](https://github.com/PolymerLabs/lit-html) for this example.

          \`\`\`js
          import { html } from 'lit-html/lib/lit-extended';
          import { link, withComponent } from 'skatejs';
          import withLitHtml from '@skatejs/renderer-lit-html';

          export default class extends withComponent(withLitHtml()) {
            render({ state }) {
              return html\`
                <input
                  name="email"
                  on-change="\${link(this)}"
                  type="email"
                  value="\${state.email}"
                >
              \`;
            }
          }
          \`\`\`

          If we look at the above example, we'll notice a few things. First, you must pass in the element as the first argument to \`link()\`. This is so that it can update the corresponding identifier you specify as the second argument, if you do. If you don't specify the second argument, it defaults to "state.", which means:

          > Update \`state\` on the element using the name of the input as the key for \`state\`. So: update \`state.email\`.

          The \`link()\` function will update the \`state\` property on the element so that it triggers an update, as opposed to reaching into \`state\` and updating the corresponding key directly.

          ### Using a different name

          If you want to use a different name for your \`state\` key, all you have to do is specify it after the dot separator. For example:

          \`\`\`js
          link(this, 'state.customName');
          \`\`\`

          ### Using a completely different property

          As seen above, if you want a custom name, you've got to specify the \`state\` prefix. So all we need to do if we want to target a different property, or sub property is to do something like:

          \`\`\`js
          link(this, 'someProp');
          link(this, 'props.someProp');
          \`\`\`
        `}"></x-marked>
      </x-layout>
    `;
    }
  }
);
