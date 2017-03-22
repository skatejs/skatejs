/* eslint-env mocha */

import expect from 'expect';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

import { define, withProps } from 'src';
import { root } from 'src/util';

const { HTMLElement } = root;

describe('api/props', () => {
  let elem;

  beforeEach(done => {
    elem = new (define(class extends withProps() {
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
      const curr = elem.props;

      expect(curr.prop1).toEqual('test1');
      expect(curr.prop2).toEqual('test2');
      expect('prop3' in curr).toEqual(true);
      expect(curr.undeclaredProp).toEqual(undefined);
    });
  });
});
