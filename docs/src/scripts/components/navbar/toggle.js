import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';

export default skate('skate-navbar-toggle', {
  template: shade(`
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
      <span class="sr-only"><content name="textContent">Toggle navigation</content></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
  `)
});
