import Component from '@skatejs/core';
import define from '@skatejs/define';
import createRenderer from '..';
import h from 'snabbdom/h';

class Base extends Component {
  renderer = createRenderer([
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/eventlisteners').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/dataset').default
  ]);
}

const Test = define(
  class extends Base {
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
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('World'));

  el.name = 'Bob';
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('Bob'));

  document.body.removeChild(el);
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual('');
});
