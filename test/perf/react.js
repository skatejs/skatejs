import { define, prop, props, ready, vdom } from '../../src/index';
import bp from 'birdpoo';

const { React, ReactDOM } = window;


// Skate components.
const wclist = (props, chren) => ul(props, chren);
const wcitem = (props, chren) => li(props, chren);
const [ div, h1, li, ul, item, list ] = ['div', 'h1', 'li', 'ul', wclist, wcitem].map(t => vdom.element.bind(null, t));
define('x-app', {
  props: {
    title: prop.string({ default: 'initial' }),
  },
  render (elem) {
    div(function () {
      h1(elem.title);
      list(function () {
        for (let key = 0; key < 1000; key++) {
          item(`Item ${key}`);
        }
      });
    });
  },
});


// React components.
const Xlist = props => React.createElement('div', null, props.children);
const Xitem = props => React.createElement('div', null, props.children);
const Xapp = class extends React.Component {
  constructor() {
    super();
    this.state = { title: 'initial' };
  }
  render () {
    return React.createElement('div', null,
      React.createElement('h1', null, this.state.title),
      React.createElement(Xlist, null, (function () {
        const items = [];
        for (let key = 0; key < 1000; key++) {
          items.push(React.createElement(Xitem, `Item ${key}`));
        }
        return items;
      }()))
    );
  }
};


// Fixture

const fixture = document.createElement('div');
document.body.appendChild(fixture);


// Initial render
const afterMutations = cb => isNative ? cb() : setTimeout(cb);
const isNative = !!Document.prototype.registerElement;
describe('render', () => {
  it('skate', done => {
    bp(next => {
      fixture.innerHTML = '<x-app></x-app>';
      next();
      afterMutations(next);
    }, {
      after: next => {
        fixture.innerHTML = '';
        afterMutations(next);
      }
    })
      .then(ops => console.log(`Skate (render): ${ops} / sec`))
      .then(done.bind(null, null))
      .catch(done);
  });

  it('react', done => {
    bp(next => {
      ReactDOM.render(React.createElement(Xapp), fixture);
      next();
    }, {
      after: next => {
        ReactDOM.unmountComponentAtNode(fixture);
        next();
      }
    })
      .then(ops => console.log(`React (render): ${ops} / sec`))
      .then(done.bind(null, null))
      .catch(done);
  });
});

describe('update', () => {
  it('skate', done => {
    fixture.innerHTML = '<x-app></x-app>';

    let comp = fixture.firstElementChild;
    ready(comp, () => {
      bp(function (next) {
        props(this.comp, { title: ++this.count });
        next();
      }, {
        comp,
        count: 0
      })
        .then(ops => console.log(`Skate (update): ${ops} / sec`))
        .then(() => fixture.innerHTML = '')
        .then(done.bind(null, null))
        .catch(done);
    });
  });

  it('react', done => {
    bp(function (next) {
      this.comp.setState({ title: ++this.count });
      next();
    }, {
      comp: ReactDOM.render(React.createElement(Xapp), fixture),
      count: 0
    })
      .then(ops => console.log(`React (update): ${ops} / sec`))
      .then(() => ReactDOM.unmountComponentAtNode(fixture))
      .then(done.bind(null, null))
      .catch(done);
  });
});
