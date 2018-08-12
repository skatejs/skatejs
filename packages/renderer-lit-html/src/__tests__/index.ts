import { html } from 'lit-html';
import { define } from 'skatejs';
import withRenderer from '..';

const Component = withRenderer(HTMLElement);

function regexContent(text) {
  return new RegExp(`Hello, ${text}!`);
}

const MyElement = define(
  class extends Component {
    render({ name }) {
      return html`Hello, ${name}!`;
    }
  }
);

it('renders', () => {
  const el = new MyElement();
  expect(el.innerHTML).toEqual('');
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toMatch(regexContent('World'));
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toMatch(regexContent('Bob'));
});
