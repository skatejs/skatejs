import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import h from 'snabbdom/h';
import component from '..';

const Component = component([
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/dataset').default
]);

const Test = define(
  class extends Component {
    name: string = 'World';
    static props = { name: String };
    render() {
      return h('span', `Hello, ${this.name}!`);
    }
  }
);

function testContent(text) {
  return `<span>Hello, ${text}!</span>`;
}

test('renders', async () => {
  const el = new Test();
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('World'));

  el.name = 'Bob';
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('Bob'));

  document.body.removeChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual('');
});
