// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

import './__samples__/with-lit-html';
import codeWithLitHtml from '!raw-loader!./__samples__/with-lit-html';
import codeWithLitHtmlHtml from '!raw-loader!./__samples__/with-lit-html.html';

export default component(function mixins() {
  return (
    <Layout.is title="LitHTML renderer">
      <style>{this.context.style}</style>
      <p>
        The{' '}
        <a href="https://github.com/skatejs/renderer-lit-html">
          LitHTML renderer
        </a>{' '}
        allows you to render using{' '}
        <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.
      </p>
      <Runnable.is code={codeWithLitHtml} html={codeWithLitHtmlHtml} />
    </Layout.is>
  );
});
