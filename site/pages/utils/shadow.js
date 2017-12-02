// @flow
// @jsx h

import { component, h } from '../../utils';
import { Layout } from '../../components/layout';
import { Marked } from '../../components/marked';

export default component(function mixins() {
  return (
    <Layout.is title="emit()">
      <Marked.is
        src={`
          The \`shadow()\` function will create a \`shadowRoot\`, if one does not exist, and return it. Subsequent calls simply return the existing shadow root to prevent errors related to calling \`attachShadow()\` more than once.

          Normally, when you're writing custom elements without any tools, you'd want to attach your root in the \`constructor()\` and then do your rendering work in \`connectedCallback()\`. This is because the \`connectedCallback\` can get called more than once. For example:

          \`\`\`js
          class CustomElement extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
              this.shadowRoot.innerHTML = 'Hello, World!';
            }
          }
          \`\`\`

          If you're using the \`shadow()\` function, you can just put everything into the \`connectedCallback()\`.

          \`\`\`js
          import { shadow } from 'skatejs';

          class CustomElement extends HTMLElement {
            connectedCallback() {
              shadow(this).innerHTML = 'Hello, World!';
            }
          }
          \`\`\`

          > Skate uses this function internally in the \`withRenderer()\` mixin as the default return value from \`renderRoot\`.
        `}
      />
    </Layout.is>
  );
});
