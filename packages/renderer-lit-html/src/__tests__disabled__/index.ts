// IMPORTANT: this test is disabled because lit-html only shipts ESM with the
// extension of ".js" and it errors when you import it into a Node env.

import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import { html } from 'lit-html';
import Component from '..';

const Test = define(
  class extends Component {
    static props = { name: String };
    name: string = 'World';
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
