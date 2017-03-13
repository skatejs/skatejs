/* eslint-env mocha */

import expect from 'expect';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

import { define, Mixins, props } from 'src';
import root from 'src/util/root';

const { HTMLElement } = root;

describe('api/props', () => {
  let elem;

  beforeEach(done => {
    elem = new (define(class extends Mixins.Props() {
      static get props () {
        return {
          prop1: null,
          prop2: null,
          prop3: null
        };
      }
      constructor () {
        super();
        this._rendered = 0;
        this.prop1 = 'test1';
        this.prop2 = 'test2';
      }
      propsSetCallback () {
        this._rendered++;
      }
    }))();
    fixture(elem);
    afterMutations(done);
  });

  describe('getting', () => {
    it('should return only properties defined as props', () => {
      const curr = props(elem);

      expect(curr.prop1).toEqual('test1');
      expect(curr.prop2).toEqual('test2');
      expect('prop3' in curr).toEqual(true);
      expect(curr.undeclaredProp).toEqual(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', () => {
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2',
        undeclaredProp: 'updated3'
      });
      expect(elem.prop1).toEqual('updated1');
      expect(elem.prop2).toEqual('updated2');
      expect(elem.undeclaredProp).toEqual('updated3');
    });

    it('should asynchronously render if declared properties are set', done => {
      expect(elem._rendered).toEqual(1);
      props(elem, { prop1: 'updated1' });
      afterMutations(
        () => expect(elem._rendered).toEqual(2),
        done
      );
    });

    it('should asynchronously render once when multiple props are set', done => {
      expect(elem._rendered).toEqual(1);
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2'
      });
      afterMutations(
        () => expect(elem._rendered).toEqual(2),
        done
      );
    });

    it('should not render if undeclared properties are set', () => {
      expect(elem._rendered).toEqual(1);
      props(elem, { undeclaredProp: 'updated3' });
      expect(elem._rendered).toEqual(1);
    });

    it('should succeed on an uninitialised element', () => {
      const elem = new (define(class extends HTMLElement {}))();
      props(elem, { undeclaredProp: 'foo' });
      expect(elem.undeclaredProp).toBe('foo');
    });
  });
});
