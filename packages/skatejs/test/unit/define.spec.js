/* eslint-env jest */

import { define, name } from '../../src';

it('should use `static is` as the element name', () => {
  @define
  class Elem extends HTMLElement {
    static is = name();
  }
  expect(Elem.is).toBeDefined();
  expect(customElements.get(Elem.is)).toEqual(Elem);
});

it('should use `name()` to define a name if `static is` is not defined', () => {
  @define
  class Elem extends HTMLElement {}
  expect(Elem.is).not.toBeDefined();
  const elem = new Elem();
  expect(elem.nodeName).toMatch('x-');
});
