// @flow
/* @jsx h */
/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { define, name, withComponent } from '../../src';

test('should extend custom classes', () => {
  class Base extends HTMLElement {}
  expect(class extends withComponent(Base) {}.prototype instanceof Base).toBe(
    true
  );
});

test('#1399 - withChildren() / withUpdate() integration - setting props when static props are not defined should not error', done => {
  const Test = define(class extends withComponent() {
    static is = name();
    props = {
      test: true
    };
    render() {
      expect(Object.keys(this.props).length).toBe(0);
      done();
    }
  });
  mount(<Test />);
});
