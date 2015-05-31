import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';

export default skate('skate-navbar-header', {
  template: shade(`
    <div class="navbar-header">
      <content name="brand" select="skate-navbar-brand">
        <skate-navbar-brand></skate-navbar-brand>
      </content>
      <content name="toggle" select="skate-navbar-toggle">
        <skate-navbar-toggle></skate-navbar-toggle>
      </content>
    </div>
  `)
});
