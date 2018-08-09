import { define, name } from '..';

test('should use `static is` as the element name', () => {
  const Elem = define(class extends HTMLElement {
    static is = name();
  });
  expect(Elem.is).toBeDefined();
  expect(customElements.get(Elem.is)).toEqual(Elem);
});

test('should use `name()` to define a name if `static is` is not defined', () => {
  const Elem = define(class extends HTMLElement {});
  expect(Elem.is).not.toBeDefined();
  const elem = new Elem();
  expect(elem.nodeName).toMatch('x-');
});
