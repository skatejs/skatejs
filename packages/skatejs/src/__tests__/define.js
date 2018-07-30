// @flow

import { define, name } from '..';

const { expect, test } = global;

test('should use `static is` as the element name', () => {
  // $FlowFixMe - decorators :(
  @define
  class Elem extends HTMLElement {
    static is = name();
  }
  expect(Elem.is).toBeDefined();
  expect(customElements.get(Elem.is)).toEqual(Elem);
});

test('should use `name()` to define a name if `static is` is not defined', () => {
  // $FlowFixMe - decorators :(
  @define
  class Elem extends HTMLElement {}
  // $FlowFixMe - we are ensuring "is" is not defined.
  expect(Elem.is).not.toBeDefined();
  const elem = new Elem();
  expect(elem.nodeName).toMatch('x-');
});
