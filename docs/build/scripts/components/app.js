import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-app', {
  template: shade(`
    <content name="innerHTML"></content>
  `)
});
