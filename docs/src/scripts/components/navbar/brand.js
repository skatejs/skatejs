import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';

export default skate('skate-navbar-brand', {
  template: shade(`
    <a class="navbar-brand" href="#"><content name="textContent">Brand</content></a>
  `)
});
