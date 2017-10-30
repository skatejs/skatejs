// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-context';
import codeWithComponent from '!raw-loader!./__samples__/with-context';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-context.html';

export default component(function mixinsWithContext() {
  return (
    <Layout.is title="Context">
      <style>{this.context.style}</style>
      <p>
        The <code>withContext</code> mixin allows you to use{' '}
        <code>context</code> like in React.
      </p>
      <Runnable.is code={codeWithComponent} html={codeWithComponentHtml} />
    </Layout.is>
  );
});
