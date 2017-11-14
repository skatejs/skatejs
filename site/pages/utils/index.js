// @flow

import { component, h } from '../../utils';
import { Layout } from '../../components/layout';
import { Link } from '../../components/primitives';

export default component(function mixins() {
  return (
    <Layout.is title="Utilities">
      <style>{this.context.style}</style>
      <p>
        Skate includes a few utilities that you'll end up needing when you build
        complex components. They're minimal, opt-in and augment your building of
        web components, not required by it.
      </p>
      <ul>
        <li>
          <Link.is href="/utils/define">define()</Link.is>
        </li>
        <li>
          <Link.is href="/utils/emit">emit()</Link.is>
        </li>
        <li>
          <Link.is href="/utils/link">link()</Link.is>
        </li>
        <li>
          <Link.is href="/utils/shadow">shadow()</Link.is>
        </li>
      </ul>
    </Layout.is>
  );
});
