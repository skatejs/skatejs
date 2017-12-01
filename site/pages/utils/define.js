// @flow
// @jsx h

import { component, h } from '../../utils';
import { Layout } from '../../components/layout';
import { Marked } from '../../components/marked';

export default component(function mixins() {
  return (
    <Layout.is title="define()">
      <Marked.is
        src={`
          The \`define()\` function takes a custom element constructor and defines it using the value of the \`static is\` class property.

          This is very useful both if you like defining your components using that property, or if you're using the \`withUnique()\` mixin. If you're using the mixin, it will automatically define a name if you haven't defined one yet which can be useful in a variety of situations.

          \`\`\`js
          import { define } from 'skatejs';

          define(
            class extends HTMLElement {
              static is = 'my-element';
            }
          );
          \`\`\`

          For more information on how \`withUnique()\` comes up with a unique name, see [its docs](/mixins/with-unique).
        `}
      />
    </Layout.is>
  );
});
