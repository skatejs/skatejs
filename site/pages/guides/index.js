// @flow
// @jsx h

import { component, h } from '../../utils';
import { Layout } from '../../components/layout';
import { Marked } from '../../components/marked';

export default component(function mixins() {
  return (
    <Layout.is title="Guides">
      <Marked.is
        src={`
          The "Guides" section is aimed at exposing you to patterns, tooling and other useful aspects of being a SkateJS consumer. For example, if you want to know how to automatically define Skate \`props\` using your Flow props, you'd find it here.
        `}
      />
    </Layout.is>
  );
});
