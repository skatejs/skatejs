import shade from 'shadejs';
import skate from '../../../../../src/index';

export default skate('sk-navbar-header', {
  template: shade(`
    <div class="navbar-header">
      <content name="brand" select="sk-navbar-brand">
        <sk-navbar-brand></sk-navbar-brand>
      </content>
      <content name="toggle" select="sk-navbar-toggle">
        <sk-navbar-toggle></sk-navbar-toggle>
      </content>
    </div>
  `)
});
