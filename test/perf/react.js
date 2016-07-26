import { define, prop, state, vdom } from '../../src/index';
import bp from 'birdpoo';

const { element } = vdom;

// Skate components.
const wclist = (props, chren) => element('ul', props, chren);
const wcitem = (props, chren) => element('li', props, chren);
define('x-app', {
  props: {
    title: prop.string({ default: 'initial' }),
  },
  render (elem) {
    element('div', function () {
      element('h1', elem.title);
      element(wclist, function () {
        for (let key = 0; key < 100; key++) {
          element(wcitem, { key }, `Item ${key}`);
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
        for (let key = 0; key < 100; key++) {
          items.push(React.createElement(Xitem, { key }, `Item ${key}`));
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

bp(() => fixture.innerHTML = '<x-app></x-app>', {
  after: () => fixture.innerHTML = ''
}).then(opts => console.log(`Skate (render): ${opts} / sec`));

bp(() => ReactDOM.render(React.createElement(Xapp), fixture), {
  after: () => ReactDOM.unmountComponentAtNode(fixture)
}).then(opts => console.log(`React (render): ${opts} / sec`));


// Subsequent renders (actual updates)

let comp;
let count = 0;

comp = (fixture.innerHTML = '<x-app></x-app>') && fixture.firstElementChild;
bp(() => state(comp, { title: ++count })).then(opts => console.log(`Skate (update): ${opts} / sec`));
fixture.innerHTML = '';

comp = ReactDOM.render(React.createElement(Xapp), fixture);
bp(() => comp.setState({ title: ++count })).then(opts => console.log(`React (update): ${opts} / sec`));
ReactDOM.unmountComponentAtNode(fixture);
