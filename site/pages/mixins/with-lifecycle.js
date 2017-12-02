// @flow
// @jsx h

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-lifecycle';
import codeWithComponent from '!raw-loader!./__samples__/with-lifecycle';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-lifecycle.html';

export default component(function mixinsWithLifecycle() {
  return (
    <Layout.is title="Lifecycle">
      <style>{this.context.style}</style>
      <p>
        The <code>withLifecycle</code> mixin adds sugar around the native
        lifecycle callbacks. It wraps before and after callbacks around them,
        which allows you to add lifecycles without having to remember to call
        super.
      </p>
      <Runnable.is code={codeWithComponent} html={codeWithComponentHtml} />
      <p>
        The example above shows the methods that get called when mounted. When
        unmounted from the DOM, their counterparts are also called:
      </p>
      <ul>
        <li>
          <code>disconnecting()</code>
        </li>
        <li>
          <code>disconnected()</code>
        </li>
      </ul>
    </Layout.is>
  );
});
