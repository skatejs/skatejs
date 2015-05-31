import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';
import AttrPosition from '../../attributes/position';

export default skate('skate-navbar-nav', {
  attributes: {
    position: new AttrPosition({ prefix: 'navbar-' })
  },
  template: shade(`
    <ul class="nav navbar-nav">
      <content name="items" wrap="li" multiple></content>
    </ul>
  `)
});
