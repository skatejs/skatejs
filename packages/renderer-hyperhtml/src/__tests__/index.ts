import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import Component from '..';

const Test = define(
  class extends Component {
    static props = { name: String };
    name: string = 'World';
    render(html) {
      html`Hello, ${this.name}!`;
    }
  }
);

test('renders', async () => {
  const el = new Test();
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toContain('World');

  el.name = 'Bob';
  await wait();
  expect(el.shadowRoot.innerHTML).toContain('Bob');
});
