// @flow

import { mount } from '@skatejs/bore';
import { define, name, props, withInitializer, withUpdate } from '../../src';

describe('withInitializer', () => {
  let counter;
  let inc = () => ++counter;
  beforeEach(() => (counter = 0));

  describe('initializeCallback()', () => {
    let Elem;

    beforeEach(() => {
      Elem = class extends withInitializer() {
        static initializeCallback = inc;
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
        Elem = class extends withInitializer() {
          static is = name();
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

    describe('implementation', () => {
      it('works when wrapped with withUpdate()', () => {
        const UpdatingElem = class extends withUpdate(withInitializer()) {
          static initializeCallback = inc;
          static get props() {
            return {
              name: props.string
            };
          }
        };
        expect(counter).toEqual(0);
        define(UpdatingElem);
        expect(counter).toEqual(1);
        expect(UpdatingElem.observedAttributes).toContain('name');
      });
    });
  });
});
