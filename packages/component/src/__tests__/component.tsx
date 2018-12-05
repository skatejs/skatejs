import mount from '@skatejs/bore';
import define, { getName } from '@skatejs/define';
import Component, { props, withComponent } from '..';

function wait(ms = 0) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

test('checks for existing shadow root', () => {
  class MyCustomElWithSr extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  }

  const MyCustomElement = withComponent(MyCustomElWithSr);

  expect(() => new MyCustomElement()).not.toThrow();
});

test('reflects initial attribute values to props', () => {
  const name = getName(
    define(
      class extends Component {
        static props = {
          test: Boolean
        };
      }
    )
  );

  const w = mount(`<${name} test></${name}>`);
  expect(w.node.test).toEqual(true);
});

test('reflects subsequent values to props', () => {
  const Elem = define(
    class extends Component {
      static props = {
        test: Boolean
      };
    }
  );

  const w = mount(new Elem());
  w.node.setAttribute('test', '');
  expect(w.node.test).toEqual(true);
});

test('does not reflect to attribute by default', async () => {
  const Elem = define(
    class extends Component {
      static props = {
        test: Boolean
      };
    }
  );

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual(null);
});

test('reflects to attribute if target is supplied', async () => {
  const Elem = define(
    class extends Component {
      static props = {
        test: { ...props.boolean, target: 'test' }
      };
    }
  );

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual('');
});
