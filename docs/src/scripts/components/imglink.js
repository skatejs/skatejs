import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

export default skate('skate-imglink', {
  properties: {
    href: { attr: true },
    imgStyle: { attr: true },
    src: { attr: true }
  },
  template: shade(`
    <a attr="href"><img attr="src style:imgStyle"></a>
  `)
});
