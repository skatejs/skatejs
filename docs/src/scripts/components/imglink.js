import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

export default skate('skate-imglink', {
  template: shade(`
    <a attr="href"><img attr="src"></a>
  `)
});
