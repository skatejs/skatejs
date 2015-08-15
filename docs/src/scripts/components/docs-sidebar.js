import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-docs-sidebar', {
  template: shade(`
    <sk-sidebar>
      <sk-item><a href="/docs">What is Skate?</a></sk-item>
      <sk-item><a href="/docs/installing.html">Installing</a></sk-item>
      <sk-item>
        <a href="/docs/skate.html">API</a>
        <sk-item>
          <a href="/docs/skate.html">skate()</a>
          <sk-item><a href="/docs/options/attached.html">attached</a></sk-item>
          <sk-item><a href="/docs/options/attribute.html">attribute</a></sk-item>
          <sk-item><a href="/docs/options/created.html">created</a></sk-item>
          <sk-item><a href="/docs/options/detached.html">detached</a></sk-item>
          <sk-item><a href="/docs/options/events.html">events</a></sk-item>
          <sk-item><a href="/docs/options/extends.html">extends</a></sk-item>
          <sk-item><a href="/docs/options/properties.html">properties</a></sk-item>
          <sk-item><a href="/docs/options/prototype.html">prototype</a></sk-item>
          <sk-item><a href="/docs/options/template.html">template</a></sk-item>
          <sk-item><a href="/docs/options/type.html">type</a></sk-item>
        </sk-item>
        <sk-item>
          <a href="/docs/skate/create.html"><span class="subtle">skate.</span>create()</a>
        </sk-item>
        <sk-item>
          <a href="/docs/skate/emit.html"><span class="subtle">skate.</span>emit()</a>
        </sk-item>
        <sk-item>
          <a href="/docs/skate/init.html"><span class="subtle">skate.</span>init()</a>
        </sk-item>
        <sk-item>
          <a href="/docs/skate/no-conflict.html"><span class="subtle">skate.</span>noConflict()</a>
        </sk-item>
        <sk-item>
          <a href="/docs/skate/version.html"><span class="subtle">skate.</span>version</a>
        </sk-item>
      </sk-item>
      <sk-item>
        <a href="/docs/native-polyfill-quirks.html">Native / Polyfill Quirks</a>
        <sk-item>
          <a href="/docs/native-polyfill-quirks.html#h3-when-native-polyfill-is-used">When Native / Polyfill is Used</a>
        </sk-item>
        <sk-item>
          <a href="/docs/native-polyfill-quirks.html#h3-element-lifecycle">Element Lifecycle</a>
        </sk-item>
        <sk-item>
          <a href="/docs/native-polyfill-quirks.html#h3-script-tags-cut-off-content">Script Tags Cut Off Content</a>
        </sk-item>
      </sk-item>
    </sk-sidebar>
  `)
});
