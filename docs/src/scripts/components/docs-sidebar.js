import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-docs-sidebar', {
  template: shade(`
    <sk-sidebar>
      <sk-item><a href="/docs/">Getting Started</a></sk-item>
      <sk-item>
        <sk-item><a href="/docs/#h2-what-is-skate">What is Skate?</a></sk-item>
        <sk-item><a href="/docs/#h2-installing">Installing</a></sk-item>
        <sk-item><a href="/docs/#h2-native-vs-polyfill">Native vs Polyfill</a></sk-item>
        <sk-item><a href="/docs/#h2-element-lifecycle">Element Lifecycle</a></sk-item>
      </sk-item>
      <sk-item><a href="/docs/skate.html">skate (name, options)</a></sk-item>
      <sk-item>
        <sk-item><a href="/docs/options/attached.html">options.attached</a></sk-item>
        <sk-item><a href="/docs/options/attribute.html">options.attribute</a></sk-item>
        <sk-item><a href="/docs/options/created.html">options.created</a></sk-item>
        <sk-item><a href="/docs/options/detached.html">options.detached</a></sk-item>
        <sk-item><a href="/docs/options/events.html">options.events</a></sk-item>
        <sk-item><a href="/docs/options/extends.html">options.extends</a></sk-item>
        <sk-item><a href="/docs/options/properties.html">options.properties</a></sk-item>
        <sk-item><a href="/docs/options/prototype.html">options.prototype</a></sk-item>
        <sk-item><a href="/docs/options/template.html">options.template</a></sk-item>
        <sk-item><a href="/docs/options/type.html">options.type</a></sk-item>
      </sk-item>
    </sk-sidebar>
  `)
});
