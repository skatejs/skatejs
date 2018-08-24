import { define } from 'skatejs';
import '../../components/layout';
import '../../components/marked';
import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-guides-flowtype';
    render() {
      return this.$`
      <x-layout title="Flowtype">
        <x-marked
          src="${`
            In this section, you'll find out how to use Flowtype to augment your component workflow. To learn more about Flow and how to get started, read more [here](https://flow.org/en/docs/getting-started/).

            ### Auto-defining Skate props using Flow types

            If you're using Flow as your type superset of choice, you may find that you're having to write both Flow types for your props as well as declare Skate props to get the attribute linkage and rerendering when your props change. For example:

            \`\`\`js
            import { props, withComponent } from 'skatejs';

            type Props = {
              name: string
            };

            class MyComponent extends withComponent() {
              props: Props;
              static get props() {
                return {
                  name: props.string
                };
              }
            }
            \`\`\`

            The good news is, that you can reuse your Flow definitions and use the [\`transform-skate-flow-props\`](https://github.com/skatejs/babel-plugin-transform-skate-flow-props) Babel plugin to generate Skate props from them.

            Your code would end up looking like:

            \`\`\`js
            import { props, withComponent } from 'skatejs';

            type Props = {
              name: string
            };

            class MyComponent extends withComponent() {
              props: Props;
            }
            \`\`\`

            To learn more about how to do this, see the [documentation](https://github.com/skatejs/babel-plugin-transform-skate-flow-props) for the Babel plugin.

            ### Sharing types between React and Skate

            If you're using the [React renderer](http://localhost:8080/renderers/with-react) to render your components, and you're using Flow, you may find that you're duplicating your props in your React component and your Skate component.

            The good news is, that you can share these types, so long as the names and types are the same. For more information on this, see the [docs](https://github.com/skatejs/renderer-react#using-flow-to-share-prop-types) for the renderer.
          `}"
        ></x-marked>
      </x-layout>
    `;
    }
  }
);
