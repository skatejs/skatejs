test('define() should invoke observedAttributes', () => {
  const registry = new CustomElementRegistry();
  const spy = jest.fn();
  class CustomElement extends HTMLElement {
    static get observedAttributes() {
      spy();
    }
  }
  registry.define('x-test', CustomElement);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('define should add a the nodeName to the customElement', () => {
  const registry = new CustomElementRegistry();
  const CustomElement = class CustomElement extends HTMLElement {};
  registry.define('custom-element', CustomElement);
  expect(CustomElement.prototype.nodeName.toLowerCase()).toEqual(
    'custom-element'
  );
});

test('get should return the custom element', () => {
  const registry = new CustomElementRegistry();
  class CustomElement extends HTMLElement {}
  expect(registry.get('custom-element')).toEqual(undefined);
  registry.define('custom-element', CustomElement);
  expect(registry.get('custom-element')).toEqual(CustomElement);
});

test('whenDefined is a function', () => {
  const registry = new CustomElementRegistry();
  expect(typeof registry.whenDefined).toBe('function');
});

test('whenDefined fires if already defined', () => {
  const registry = new CustomElementRegistry();
  registry.define('x-testwhendefined1', class extends HTMLElement {});
  return registry.whenDefined('x-testwhendefined1');
});

test('whenDefined fires when eventually defined', () => {
  const registry = new CustomElementRegistry();
  const promise = registry.whenDefined('x-testwhendefined2');
  setTimeout(() => {
    registry.define('x-testwhendefined2', class extends HTMLElement {});
  });
  return promise;
});
