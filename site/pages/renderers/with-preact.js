// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

import './__samples__/with-preact';
import codeWithPreact from '!raw-loader!./__samples__/with-preact';
import codeWithPreactHtml from '!raw-loader!./__samples__/with-preact.html';

export default component(function mixins() {
  return (
    <Layout.is title="Preact renderer">
      <style>{this.context.style}</style>
      <p>
        The{' '}
        <a href="https://github.com/skatejs/renderer-preact">Preact renderer</a>{' '}
        allows you to render using{' '}
        <a href="https://github.com/developit/preact">Preact</a>.
      </p>
      <Runnable.is code={codeWithPreact} html={codeWithPreactHtml} />
    </Layout.is>
  );
});
