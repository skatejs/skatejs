import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-docs-layout', {
  template: shade(`
    <sk-layout>
      <sk-grid fixed="3">
        <sk-docs-sidebar></sk-docs-sidebar>
        <div>
          <content></content>
        </div>
      </sk-grid>
    </sk-layout>
  `)
});
