// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

import './__samples__/with-renderer';
import codeWithRenderer from '!raw-loader!./__samples__/with-renderer';
import codeWithRendererHtml from '!raw-loader!./__samples__/with-renderer.html';

export default component(function mixinsWithRenderer() {
  return (
    <Layout.is title="Renderer">
      <style>{this.context.style}</style>
      <p>
        The <code>withRenderer</code> mixin is what connects view libraries such
        as <Link.is href="/renderers/with-react">React</Link.is>,{' '}
        <Link.is href="/renderers/with-preact">Preact</Link.is> and{' '}
        <Link.is href="/renderers/with-lit-html">LitHTML</Link.is> to the rest
        of Skate. It implements a <code>didUpdate</code> method so it can be
        paired with the <code>withUpdate</code> mixin to automate renders, or
        you can call it imperatively yourself if not.
      </p>
      <Runnable.is code={codeWithRenderer} html={codeWithRendererHtml} />
      <p>
        For more information on how to write renderers, see the{' '}
        <Link.is href="/renderers">Renderers</Link.is> section.
      </p>
    </Layout.is>
  );
});
