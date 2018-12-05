import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import { html } from 'lit-html';
import Component from '..';

const Test = define(
  class extends Component {
    name: string = 'World';
    static props = { name: String };
    render() {
      return html`Hello, ${this.name}!`;
    }
  }
);

function testContent(text) {
  return new RegExp(`Hello, ${text}!`);
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
});
