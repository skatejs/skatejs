import { define, prop, vdom } from '../../src/index';
import Benchmark from 'benchmark';
import React from 'react';
import ReactDOM from 'react-dom';

const fixture = document.createElement('div');
document.body.appendChild(fixture);

const render = new Benchmark.Suite();
const update = new Benchmark.Suite();


// Skate components.

define('x-app', {
  props: {
    title: prop.number(),
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
  },
});

define('x-list', {
  render () {
    vdom.element('slot');
  },
});

define('x-item', {
  render () {
    vdom.element('slot');
  },
});


// React components.

const Xapp = class extends React.Component {
  getInitialState () {
    return { title: 0 };
  }
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
};

const Xlist = props => React.createElement('div', null, props.children);
const Xitem = props => React.createElement('div', null, props.children);

render.add('skate', function () {
  fixture.innerHTML = '<x-app></x-app>';
  fixture.innerHTML = '';
}, { teardown() { fixture.innerHTML = ''; } });

render.add('react', function () {
  ReactDOM.render(React.createElement(Xapp), fixture);
  ReactDOM.unmountComponentAtNode(fixture);
}, { teardown() { fixture.innerHTML = ''; } });

update.add('skate', function () {
  component.title = `Test ${this.count}`;
}, {
  setup() {
    fixture.innerHTML = '<x-app></x-app>';
    const component = fixture.firstChild;
  },
  teardown() {
    fixture.innerHTML = '';
  },
});

update.add('react', function () {
  component.setState({
    title: `Test ${this.count}`,
  });
}, {
  setup() {
    const component = ReactDOM.render(React.createElement(Xapp), fixture);
  },
  teardown() {
    ReactDOM.unmountComponentAtNode(fixture);
  },
});

render.on('cycle', function(event) {
  console.log(String(event.target));
});

render.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});

render.run();
