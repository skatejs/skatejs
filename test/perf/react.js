import bench from 'skatejs-build/bench';
import { define, props, vdom } from '../../src/index';


const { React, ReactDOM } = window;


// Skate components.

define('x-app', {
  props: {
    title: props.string({ default: 0 })
  },
  render (elem) {
    vdom.element('div', function () {
      vdom.element('h1', elem.title);
      vdom.element('x-list', function () {
        for (let a = 0; a < 10; a++) {
          vdom.element('x-item', `Item ${a}`);
        }
      });
    });
  }
});

define('x-list', {
  render () {
    vdom.element('slot', { name: '' });
  }
});

define('x-item', {
  render () {
    vdom.element('slot', { name: '' });
  }
});


// React components.

const Xapp = React.createClass({
  getInitialState () {
    return { title: 0 };
  },
  render () {
    const items = [];
    for (let a = 0; a < 10; a++) {
      items.push(a);
    }
    return React.createElement('div', null,
      React.createElement('h1', this.state.title),
      React.createElement(Xlist, null,
        items.map(function (key) {
          return React.createElement(Xitem, { key }, `Item ${key}`);
        })
      )
    );
  }
});

const Xlist = React.createClass({
  render () {
    return React.createElement('div', null, this.props.children);
  }
});

const Xitem = React.createClass({
  render () {
    return React.createElement('div', null, this.props.children);
  }
});


describe('', function () {
  let fixture;

  beforeEach(function () {
    fixture = document.createElement('div');
    document.body.appendChild(fixture);
  });

  afterEach(function () {
    document.body.removeChild(fixture);
  });

  describe('initial render', function () {
    bench('skate', function () {
      fixture.innerHTML = '<x-app></x-app>';
      fixture.innerHTML = '';
    });

    bench('react', function (d) {
      ReactDOM.render(React.createElement(Xapp), fixture, function () {
        ReactDOM.unmountComponentAtNode(fixture);
        d.resolve();
      });
    });
  });

  describe('re-render after initial render', function () {
    describe('', function () {
      let component;

      beforeEach(function () {
        fixture.innerHTML = '<x-app></x-app>';
        component = fixture.firstChild;
      });

      afterEach(function () {
        fixture.innerHTML = '';
      });

      bench('skate', {
        args () {
          return component;
        },
        fn () {
          this.args().title = `Test ${this.count}`;
        }
      });
    });

    describe('', function () {
      let component;

      beforeEach(function () {
        component = ReactDOM.render(React.createElement(Xapp), fixture);
      });

      afterEach(function () {
        ReactDOM.unmountComponentAtNode(fixture);
      });

      bench('react', {
        args () {
          return component;
        },
        fn () {
          this.args().setState({
            title: `Test ${this.count}`
          });
        }
      });
    });
  });
});
