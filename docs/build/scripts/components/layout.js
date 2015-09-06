import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-layout', {
  template: shade(`
    <div class="container-fluid">
      <content></content>
    </div>
  `)
});
