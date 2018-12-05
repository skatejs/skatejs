import Component from '@skatejs/component';
import define from '@skatejs/define';
import renderer from '..';

class Base extends Component {
  renderer = renderer;
}

const Test = define(
  class extends Base {
    $: Function;
    name: string = 'World';
    render(html) {
      html`Hello, ${this.name}!`;
    }
  }
);

test('renders', async () => {
  const el = new Test();
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toContain('World');

  el.name = 'Bob';
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toContain('Bob');
});
