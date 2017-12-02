// @flow
// @jsx h

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-component';
import codeWithComponent from '!raw-loader!./__samples__/with-component';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-component.html';

export default component(function mixinsWithComponent() {
  return (
    <Layout.is title="Component">
      <style>{this.context.style}</style>
      <p>
        The <code>withComponent</code> mixin combines all of Skate's mixins into
        a single one for easy use. It's likely that this will be the most common
        mixin you'll pair with renderers when authoring components, unless you
        prefer to be selective about exactly which mixins you piece together.
      </p>
      <Runnable.is code={codeWithComponent} html={codeWithComponentHtml} />
    </Layout.is>
  );
});
