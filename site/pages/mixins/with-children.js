// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-children';
import codeWithChildren from '!raw-loader!./__samples__/with-children';
import codeWithChildrenHtml from '!raw-loader!./__samples__/with-children.html';

export default component(function mixinsWithChildren() {
  return (
    <Layout.is title="Children">
      <style>{this.context.style}</style>
      <p>
        The <code>withChildren</code> mixin allows you to react to changes to
        your component's <code>children</code> by implementing a{' '}
        <code>childrenDidUpdate</code> lifecycle method.
      </p>
      <Runnable.is code={codeWithChildren} html={codeWithChildrenHtml} />
    </Layout.is>
  );
});
