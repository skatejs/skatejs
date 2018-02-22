// @flow

import { mount } from '@skatejs/bore';
import { define, name, props, withInitializer, withUpdate } from '../../src';

const UnnamedTest = define(class extends withInitializer() {});
const NamedTest = define(
  class extends withInitializer() {
    static is = name();
  }
);

describe('withInitializer', () => {
  describe('initializeCallback()', () => {
    let counter;
    let Elem;

    beforeEach(() => {
      counter = 0;
      Elem = class extends UnnamedTest {
        static initializeCallback() {
          ++counter;
        }
      };
    });

    it('is called when an element definition is registered', () => {
      expect(counter).toEqual(0);
      define(Elem);
      expect(counter).toEqual(1);
    });

    it('is not called when an individual element is constructed', () => {
      define(Elem);
      expect(counter).toEqual(1);
      mount(new Elem());
      mount(new Elem());
      expect(counter).toEqual(1);
    });

    describe('on named elements', () => {
      beforeEach(() => {
        Elem = class extends NamedTest {
          static initializeCallback() {
            ++counter;
          }
        };
      });

      it('is called when an element definition is registered', () => {
        define(Elem);
        expect(counter).toEqual(1);
      });
    });

    describe('implementation details', () => {
      it('works with the withUpdate mixin', () => {
        const UpdatingElem = class extends withUpdate(Elem) {
          static get props() {
            return {
              name: props.string
            };
          }
          updated() {
            return (shadow(this).innerHTML = `Hello, ${this.name}!`);
          }
        };
        define(UpdatingElem);
        expect(counter).toEqual(1);
      });
    });
  });
});
