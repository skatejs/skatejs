import Component from '@skatejs/core';
import define from '@skatejs/define';
import renderer from '..';

class Base extends Component {
  renderer = renderer;
}

const Test = define(
  class extends Base {
    $: Function;
    name: string = '';
    render() {
      this.$`Hello, ${this.name}!`;
    }
  }
);

function testContent(text) {
  return new RegExp(`Hello, ${text}<!--_hyper: -?\\d+;-->!`);
}

it('renders', () => {
  const el = new Test();
  expect(el.innerHTML).toEqual('');
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toMatch(testContent('World'));
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toMatch(testContent('Bob'));
});
