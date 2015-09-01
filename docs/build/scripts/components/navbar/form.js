import shade from 'shadejs';
import skate from '../../../../../src/index';

const KEY_ESC = 27;

export default skate('sk-navbar-form', {
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
      value: 'right'
    },
    positionClass: {
      deps: 'position',
      get: function () {
        return 'navbar-' + this.position;
      }
    },
    query: {
      attr: true
    }
  },
  template: shade(`
    <form sh-class="positionClass" class="navbar-form" role="search" target="https://www.google.com.au/search" action="get">
      <div class="form-group">
        <div class="input-group">
          <input name="query" type="text" class="form-control" placeholder="Search">
          <span class="input-group-btn">
            <button class="btn btn-default" type="submit">
              <span class="glyphicon glyphicon-search"></span>
            </button>
          </span>
        </div>
      </div>
    </form>
  `)
});
