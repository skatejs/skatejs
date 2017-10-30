// @flow

import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Layout } from '../../components/layout';

import './__samples__/with-update';
import codeWithUpdate from '!raw-loader!./__samples__/with-update';
import codeWithUpdateHtml from '!raw-loader!./__samples__/with-update.html';

export default component(function mixinsWithUpdate() {
  return (
    <Layout.is title="Update">
      <style>{this.context.style}</style>
      <p>
        The <code>withUpdate</code> mixin is the heart of Skate and is what
        makes attribute / property linkage and reflection manageable by
        enforcing a convention that follows best-practices. It also exports
        several pre-defined property types that handle serialisation and
        deserialisation to / from attributes when they're set, as well as
        coercion when the property is set. When properties update, everything
        funnels into a single set of functions that are called so that you can
        update your component in a functional manner.
      </p>
      <Runnable.is code={codeWithUpdate} html={codeWithUpdateHtml} />
    </Layout.is>
  );
});
