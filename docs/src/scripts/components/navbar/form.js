import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';

const KEY_ESC = 27;

export default skate('skate-navbar-form', {
  events: {
    submit: function (e) {
      window.open('https://google.com/search?q=site:skate.js.org ' + this.query);
      e.preventDefault();
    },
    keyup: function (e) {
      if (e.keyCode === KEY_ESC) {
        this.query = '';
      }
    }
  },
  properties: {
    position: {
      attr: true,
      value: 'right',
      set (newValue, oldValue) {
        this.classList.add(`navbar-${newValue}`);
        this.classList.remove(`navbar-${oldValue}`);
      }
    },
    query: {
      attr: true
    }
  },
  template: shade(`
    <form class="navbar-form" role="search" target="https://www.google.com.au/search" action="get">
      <div class="form-group">
        <input name="query" type="text" class="form-control" placeholder="Search">
      </div>
    </form>
  `)
});
