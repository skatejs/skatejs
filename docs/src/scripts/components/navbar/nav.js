import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';

export default skate('skate-navbar-nav', {
  properties: {
    position: {
      attr: true,
      value: 'left',
      set (newValue, oldValue) {
        this.classList.add(`navbar-${newValue}`);
        this.classList.remove(`navbar-${oldValue}`);
      }
    }
  },
  template: shade(`
    <ul class="nav navbar-nav">
      <content name="items" wrap="li" multiple></content>
    </ul>
  `)
});
