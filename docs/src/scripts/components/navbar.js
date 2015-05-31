import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

export default skate('skate-navbar', {
  attributes: {
    brand: function (elem, diff) {
      elem.header.brand.textContent = diff.newValue;
    }
  },
  template: shade(`
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container container-fluid">
        <content name="header" select="skate-navbar-header">
          <skate-navbar-header></skate-navbar-header>
        </content>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <content name="content">
            <skate-navbar-nav>
              <a href="#">Home</a>
            </skate-navbar-nav>
          </content>
        </div>
      </div>
    </nav>
  `)
});
