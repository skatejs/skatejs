import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-notice', {
  properties: {
    type: {
      attr: true,
      init: 'info',
      set: function (value) {
        this.querySelector('p').className = `notice notice-${value}`;
      }
    }
  },
  template: shade(`
    <p><content name="innerHTML"></content></p>
  `)
});
