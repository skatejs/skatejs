import { define, prop, state, vdom } from '../../src/index';
import bp from 'birdpoo';


// Skate components.
const [ div, h1, li, ul, item, list ] = ['div', 'h1', 'li', 'ul', WcXitem, WcXlist].map(t => vdom.element.bind(null, t));
const WcXlist = (props, chren) => ul(props, chren);
const WcXitem = (props, chren) => li(props, chren);
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
