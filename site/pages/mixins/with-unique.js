// @flow
// @jsx h

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-unique';
import codeWithUnique from '!raw-loader!./__samples__/with-unique';
import codeWithUniqueHtml from '!raw-loader!./__samples__/with-unique.html';

export default component(function mixinsWithUnique() {
  return (
    <Layout.is title="Unique">
      <style>{this.context.style}</style>
      <p>
        The <code>withUnique</code> mixin allows you to define custom elements
        without having to specify a name. It defines a static <code>is</code>{' '}
        property that will return a unique name for the element.
      </p>
      <Runnable.is code={codeWithUnique} html={codeWithUniqueHtml} />
    </Layout.is>
  );
});
