import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

export default skate('skate-nav', {
  template: shade(`
    <nav>
      <ul class="nav">
        <content name="items" wrap="li" multiple></content>
      </ul>
    </nav>
  `)
});
