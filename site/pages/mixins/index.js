// @flow

import { component, h } from '../../utils';
import { Code } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

export default component(function mixins() {
  return (
    <Layout.is title="Mixins">
      <style>{this.context.style}</style>
      <p>
        As stated previously, the mixin pattern is a way to take several class
        definitions and compose them into one. It works well for custom elements
        because every element has a different purpose and it allows you to pick
        and choose what goes into it. It's also what lets you render one
        component with <Link.is href="/renderers/with-preact">Preact</Link.is>{' '}
        and maybe another with{' '}
        <Link.is href="/renderers/with-lit-html">LitHTML</Link.is>. Each
        component is self-contained.
      </p>
      <p>
        Skate's mixins follow a common component lifecycle specification, which
        enables it to interop with not only itself, but also other libraries.
        The specification is described as follows and is what you get if you
        combine all of the mixins together, or use the{' '}
        <code>
          <Link.is href="/mixins/with-component">withComponent</Link.is>
        </code>{' '}
        mixin.
      </p>
      <Code.is
        code={`
          interface Component {
            // withChildren
            childrenUpdated(): void;

            // withContext
            context: Object;

            // withLifecycle
            connecting(): void;
            connected(): void;
            disconnecting(): void;
            disconnected(): void;

            // withRenderer
            rendering(): void;
            render(props: Object, state: Object): any;
            rendered(): void;
            renderer(root: Node, render: Render): void;

            // withUpdate
            static props: PropTypes;
            props: Object;
            state: Object;
            updating(prevProps: Object, prevState: Object): void;
            shouldUpdate(prevProps: Object, prevState: Object): boolean;
            updated(prevProps: Object, prevState: Object): void;
            triggerUpdate(): void;

            // withUnique
            static is: string;
          }
        `}
      />
    </Layout.is>
  );
});
