import mount, { wait } from '@skatejs/bore';
import define, { getName } from '@skatejs/define';
import Element, { props } from '..';
import { render } from 'preact';

// This test isn't completely necessary at this point because we don't yet
// offer a mixin to insert above the prototype chain of Component, but it
// is possible for an element to be given a shadow root prior to being
// constructed, so this takes care of two cases:
//
// 1. Where a parent constructor attaches a shadow root before Component
//    (mixin).
// 2. Where a custom element is created and a shadow root is attached prior to
//    being defined.
test('checks for existing shadow root', () => {
  class Elem extends Element {
    // We can't initialize this to false because it will be initialized
    // *after* the constructor is invoked, thus after attachShadow would
    // be called and give us a false positive.
    called: boolean;

    // We must return a shadow root, but we can't "new" one, so we have
    // to use a dummy one.
    get shadowRoot() {
      return document.createElement('div').attachShadow({ mode: 'open' });
    }

    // We override this to spy on if it's called.
    attachShadow(opts) {
      this.called = true;
      return super.attachShadow(opts);
    }
  }

  // The shadow root attachment happens in the constructor.
  const e = new Elem();

  // Since we can't initialize `called` to false, we must check `undefined`.
  expect(e.called).toEqual(undefined);
});

test('reflects initial attribute values to props', () => {
  const name = getName(
    define(class extends Element {
      static props = {
        test: Boolean
      };
    })
  );

  const w = mount(`<${name} test></${name}>`);
  expect(w.node.test).toEqual(true);
});

test('reflects subsequent values to props', () => {
  const Elem = define(class extends Element {
    static props = {
      test: Boolean
    };
  });

  const w = mount(new Elem());
  w.node.setAttribute('test', '');
  expect(w.node.test).toEqual(true);
});

test('does not reflect to attribute by default', async () => {
  const Elem = define(class extends Element {
    static props = {
      test: Boolean
    };
  });

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual(null);
});

test('reflects to attribute if target is supplied', async () => {
  const Elem = define(class extends Element {
    static props = {
      test: { ...props.boolean, target: 'test' }
    };
  });

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual('');
});

test('renders innerHTML by default', async () => {
  const Elem = define(class extends Element {
    render() {
      return 'test';
    }
  });

  const w = mount(new Elem());
  await wait();
  expect(w.node.shadowRoot.innerHTML).toBe('test');
});

test('https://github.com/skatejs/skatejs/issues/1469', async () => {
  // We are replicating DOM already in the tree, so we have to do this and
  // then subseaquently upgrade it.
  document.body.innerHTML = '<div></div>';
  const e = document.body.firstChild as Element & { test: string };

  // We *must* set the value *before* upgrading.
  e.test = '1';

  // In order to simulate upgrading, we must provide all of the required
  // interfaces for the upgrade to run.
  e._props = {};
  e._propsChanged = {};
  e.attachShadow({ mode: 'open' });
  e.constructor.props = { test: String };
  e.forceUpdate = Element.prototype.forceUpdate;
  e.render = () => e.test;
  e.renderer = Element.prototype.renderer;
  e.renderRoot = e.shadowRoot;
  e.rendered = Element.prototype.rendered;
  e.shouldUpdateRender = Element.prototype.shouldUpdateRender;
  e.updated = Element.prototype.updated;

  // We have to try and replicate the upgrading of an element after it's been
  // inserted to the DOM. This sucks to have to do, but this is currently the
  // only spot we have to do it. If we find ourselves having to do this more
  // we should try and find a more generalized way to do it.
  //
  // A better way to eliminate the above and below upgrading code would be to
  // implement this in the skatejs/ssr package but this is the only place we
  // need to do it so far.
  //
  // The first step is replicating what happens when it's registered.
  Object.getOwnPropertyDescriptor(Element, 'observedAttributes').get.call(
    e.constructor
  );

  // Then we replicate construction.
  Element.prototype.constructor.call(e);

  // And finally insertion.
  Element.prototype.connectedCallback.call(e);

  // This should always pass.
  await wait();
  expect(e.shadowRoot.innerHTML).toBe('1');

  // If the element is registered *before* we set `test` to `"1"` above,
  // then this will pass. This is why we need to replicate its upgrading
  // to *after* as this then fails because the setter won't do anything
  // if a property with the same name already exists.
  e.test = '2';

  // We must take the initial value, save it and then delete it, then this
  // will pass.
  await wait();
  expect(e.shadowRoot.innerHTML).toBe('2');
});
