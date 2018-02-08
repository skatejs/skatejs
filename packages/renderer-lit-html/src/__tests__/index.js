import { html } from 'lit-html';
import withRenderer from '..';

const Component = withRenderer(HTMLElement);

class MyElement extends Component {
  render({ name }) {
    return html`Hello, ${name}!`;
  }
}
customElements.define('my-element', MyElement);

describe('@skatejs/renderer-lit-html', () => {
  it('renders', () => {
    const el = new MyElement();
    expect(el.innerHTML).toEqual('');
    el.renderer(el, el.render.bind(el, { name: 'World' }));
    expect(el.innerHTML).toEqual('Hello, <!---->!');
    el.renderer(el, el.render.bind(el, { name: 'Bob' }));
    expect(el.innerHTML).toEqual('Hello, <!---->!');
  });
});
