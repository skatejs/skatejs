import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-navbar', {
  attached () {
    this._toggleClassOnScroll = () => this.scrolled = window.scrollY;
    document.addEventListener('scroll', this._toggleClassOnScroll);
  },
  detached () {
    document.removeEventListener('scroll', this._toggleClassOnScroll);
  },
  properties: {
    scrolled: {
      type: Boolean
    }
  },
  template: shade(`
    <nav class="navbar navbar-default navbar-fixed-top" sh-class="scrolled:scrolled">
      <div class="container-fluid">
        <content name="brand" select="[brand]"></content>
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <content name="innerHTML">
            <sk-navbar-nav>
              <a href="#">Home</a>
            </sk-navbar-nav>
          </content>
        </div>
      </div>
    </nav>
  `)
});
