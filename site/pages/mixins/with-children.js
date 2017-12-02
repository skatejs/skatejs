// @flow
// @jsx h

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-children/1';
import codeWithChildren from '!raw-loader!./__samples__/with-children/1';
import codeWithChildrenHtml from '!raw-loader!./__samples__/with-children/1.html';

import './__samples__/with-children/2';
import codeWithChildren2 from '!raw-loader!./__samples__/with-children/2';
import codeWithChildrenHtml2 from '!raw-loader!./__samples__/with-children/2.html';

export default component(function mixinsWithChildren() {
  return (
    <Layout.is title="Children">
      <style>{this.context.style}</style>
      <p>
        The <code>withChildren</code> mixin allows you to react to changes to
        your component's <code>children</code> by implementing a{' '}
        <code>childrenUpdated</code> lifecycle method.
      </p>
      <Runnable.is code={codeWithChildren} html={codeWithChildrenHtml} />
      <h3>
        Integrating with <code>props</code>
      </h3>
      <p>
        If you use the <code>withChildren()</code> mixin with the{' '}
        <code>withUpdate</code> mixin and define a <code>children</code> prop,
        it will override the built in children prop so that it can trigger an
        update with the new child list. The overridden <code>children</code>{' '}
        props still returns the same value it normally would if it weren't
        overridden.
      </p>
      <Runnable.is code={codeWithChildren2} html={codeWithChildrenHtml2} />
    </Layout.is>
  );
});
