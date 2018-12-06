import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import Element, { h } from '..';

const Test = define(
  class extends Element {
    static modules = [
      require('snabbdom/modules/attributes').default,
      require('snabbdom/modules/eventlisteners').default,
      require('snabbdom/modules/class').default,
      require('snabbdom/modules/props').default,
      require('snabbdom/modules/style').default,
      require('snabbdom/modules/dataset').default
    ];
    static props = { name: String };
    name: string = 'World';
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
