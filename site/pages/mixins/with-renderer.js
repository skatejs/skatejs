// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-renderer';
import codeWithRenderer from '!raw-loader!./__samples__/with-renderer';
import codeWithRendererHtml from '!raw-loader!./__samples__/with-renderer.html';

export default component(function mixinsWithRenderer() {
  return (
    <Layout.is title="Renderer">
      <style>{this.context.style}</style>
      <p>
        The <code>withRenderer</code> mixin is what connects view libraries such
        as React, Preact and Lit HTML to the rest of Skate. It implements a{' '}
        <code>didUpdate</code> method so it can be paired with the{' '}
        <code>withUpdate</code> mixin to automate renders, or you can call it
        imperatively yourself if not.
      </p>
      <Runnable.is code={codeWithRenderer} html={codeWithRendererHtml} />
    </Layout.is>
  );
});
