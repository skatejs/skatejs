import React from 'react';
import ReactDOM from 'react-dom';
import bp from 'birdpoo'; // eslint-disable-line import/no-extraneous-dependencies
import { define, prop, props, ready, vdom } from '../../src/index';

// Skate components.
const wclist = (ps, chren) => ul(ps, chren); // eslint-disable-line no-use-before-define
const wcitem = (ps, chren) => li(ps, chren); // eslint-disable-line no-use-before-define
const [div, h1, li, ul, item, list] = ['div', 'h1', 'li', 'ul', wclist, wcitem].map(t => vdom.element.bind(null, t));
define('x-app', {
  props: {
    title: prop.string({ default: 'initial' }),
  },
  render(elem) {
    div(() => {
      h1(elem.title);
      list(() => {
        for (let key = 0; key < 1000; key++) {
          item(`Item ${key}`);
        }
      });
    });
  },
});


// React components.
const Xlist = ps => React.createElement('div', null, ps.children);  // eslint-disable-line react/prop-types
const Xitem = ps => React.createElement('div', null, ps.children);  // eslint-disable-line react/prop-types
const Xapp = class extends React.Component {
  constructor() {
    super();
    this.state = { title: 'initial' };
  }
  render() {
    return React.createElement('div', null,
      React.createElement('h1', null, this.state.title),
      React.createElement(Xlist, null, (() => {
        const items = [];
        for (let key = 0; key < 1000; key++) {
          items.push(React.createElement(Xitem, `Item ${key}`));
        }
        return items;
      })())
    );
  }
};


// Fixture

const fixture = document.createElement('div');
document.body.appendChild(fixture);


// Initial render
const isNative = !!Document.prototype.registerElement;
const afterMutations = cb => (isNative ? cb() : setTimeout(cb));

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
      },
    })
      .then(ops => console.log(`Skate (render): ${ops} / sec`)) // eslint-disable-line no-console
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
      },
    })
      .then(ops => console.log(`React (render): ${ops} / sec`)) // eslint-disable-line no-console
      .then(done.bind(null, null))
      .catch(done);
  });
});

describe('update', () => {
  it('skate', done => {
    fixture.innerHTML = '<x-app></x-app>';

    const comp = fixture.firstElementChild;
    ready(comp, () => {
      bp(function (next) { // eslint-disable-line func-names
        props(this.comp, { title: ++this.count });
        next();
      }, {
        comp,
        count: 0,
      })
        .then(ops => console.log(`Skate (update): ${ops} / sec`)) // eslint-disable-line no-console
        .then(() => {
          fixture.innerHTML = '';
        })
        .then(done.bind(null, null))
        .catch(done);
    });
  });

  it('react', done => {
    bp(function (next) { // eslint-disable-line func-names
      this.comp.setState({ title: ++this.count });
      next();
    }, {
      comp: ReactDOM.render(React.createElement(Xapp), fixture), // eslint-disable-line react/no-render-return-value
      count: 0,
    })
      .then(ops => console.log(`React (update): ${ops} / sec`)) // eslint-disable-line no-console
      .then(() => ReactDOM.unmountComponentAtNode(fixture))
      .then(done.bind(null, null))
      .catch(done);
  });
});
