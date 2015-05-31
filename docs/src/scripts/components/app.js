import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

export default skate('skate-app', {
  template: shade(`
    <content name="innerHTML"></content>
  `)
});
