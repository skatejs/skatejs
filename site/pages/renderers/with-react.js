// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

import './__samples__/with-react';
import codeWithReact from '!raw-loader!./__samples__/with-react';
import codeWithReactHtml from '!raw-loader!./__samples__/with-react.html';

export default component(function mixins() {
  return (
    <Layout.is title="React renderer">
      <style>{this.context.style}</style>
      <p>
        The{' '}
        <a href="https://github.com/skatejs/renderer-react">React renderer</a>{' '}
        allows you to render using <a href="https://reactjs.org/">React</a>.
      </p>
      <Runnable.is code={codeWithReact} html={codeWithReactHtml} />
    </Layout.is>
  );
});
