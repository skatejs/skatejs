import { define } from 'skatejs';
import createRenderer from '..';
import h from 'snabbdom/h';

const withRenderer = createRenderer([
  // Init patch function with chosen modules
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/dataset').default
]);

function render(Comp) {
  const el = new Comp();
  el.renderer(el, el.render.bind(el));
  return el;
}

test('renders', () => {
  @define
  class MyElement extends withRenderer() {
    render({ name }) {
      return h('div', `Hello, ${name}!`);
    }
  }

  const el = new MyElement();
  expect(el.innerHTML).toMatchSnapshot();
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toMatchSnapshot();
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toMatchSnapshot();
});

test('cleanup', () => {
  const removeSpy = jest.fn((vnode, cb) => cb());
  const destroyRootSpy = jest.fn();
  const destroyLeafSpy = jest.fn();

  @define
  class MyElement extends withRenderer() {
    render({ name }) {
      return h(
        'div',
        { hook: { remove: removeSpy, destroy: destroyRootSpy } },
        [h('div', { hook: { destroy: destroyLeafSpy } }, `Hello, ${name}!`)]
      );
    }
  }

  const root = document.createElement('div');
  const el = new MyElement();
  root.appendChild(el);
  el.renderer(el, el.render.bind(el, { name: 'John' }));

  root.removeChild(el);
  expect(el.innerHTML).toMatchSnapshot();
  expect(removeSpy).toHaveBeenCalledTimes(1);
  expect(destroyRootSpy).toHaveBeenCalledTimes(1);
  expect(destroyLeafSpy).toHaveBeenCalledTimes(1);
});
