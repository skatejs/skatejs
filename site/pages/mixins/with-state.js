// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-state';
import codeWithState from '!raw-loader!./__samples__/with-state';
import codeWithStateHtml from '!raw-loader!./__samples__/with-state.html';

export default component(function mixinsWithState() {
  return (
    <Layout.is title="State">
      <style>{this.context.style}</style>
      <p>
        The <code>withState</code> mixin enables the idea of internal state,
        much like the idea of state in React and other similar libraries. When
        state is updated, it calls a method on the instance called{' '}
        <code>triggerUpdate</code> if it's defined.
      </p>
      <Runnable.is code={codeWithState} html={codeWithStateHtml} />
    </Layout.is>
  );
});
