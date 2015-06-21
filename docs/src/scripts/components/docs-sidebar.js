import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-docs-sidebar', {
  template: shade(`
    <sk-sidebar>
      <sk-item><a href="./">skate()</a></sk-item>
      <sk-item><a href="options.html">Options</a></sk-item>
    </sk-sidebar>
  `)
});
