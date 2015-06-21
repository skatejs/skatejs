import shade from 'shadejs';
import skate from '../../../../../src/index';

export default skate('sk-navbar-nav', {
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
