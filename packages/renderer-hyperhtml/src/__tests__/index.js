import { define } from 'skatejs';
import withRenderer from '..';

const Component = withRenderer(HTMLElement);

@define
class MyElement extends Component {
  render({ name }) {
    this.hyper`Hello, ${name}!`;
  }
}

it('renders', () => {
  const el = new MyElement();
  expect(el.innerHTML).toEqual('');
  // el.renderer(el, el.render.bind(el, { name: 'World' }));
  // expect(el.innerHTML).toEqual('Hello, <!---->!');
  // el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  // expect(el.innerHTML).toEqual('Hello, <!---->!');
});
