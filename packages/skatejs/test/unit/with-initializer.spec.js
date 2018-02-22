// @flow

import { mount } from '@skatejs/bore';
import { define, name, withInitializer } from '../../src';

const UnnamedTest = define(class extends withInitializer() {});
const NamedTest = define(
  class extends withInitializer() {
    static is = name();
  }
);

describe('withInitializer', () => {
  describe('initializeCallback()', () => {
    const Elem = define(
      class extends UnnamedTest {
        initializeCallback() {}
      }
    );

    it('is called when an element is created', done => {
      const spy = jest.spyOn(Elem.prototype, 'initializeCallback');
      mount(new Elem());
      setTimeout(() => {
        expect(spy).toBeCalled();
        done();
      });
    });
  });
});
