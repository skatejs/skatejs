/* eslint-env jest */

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

import { define, withProps, withUnique } from '../../src';

describe('api/props', () => {
  let elem;
  let ElemClass;

  beforeEach(done => {
    ElemClass = define(class extends withUnique(withProps()) {
      static props = {
        prop1: null,
        prop2: null,
        prop3: null
      };
      constructor () {
        super();
        this._rendered = 0;
        this.prop1 = 'test1';
        this.prop2 = 'test2';
      }
      propsSetCallback () {
        this._rendered++;
      }
    });
    elem = new ElemClass();
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

    it('should work the same when the class is instantiated twice', () => {
      let elem2 = new ElemClass();

      const curr = elem.props;

      expect(curr.prop1).toEqual('test1');
      expect(curr.prop2).toEqual('test2');
      expect('prop3' in curr).toEqual(true);
      expect(curr.undeclaredProp).toEqual(undefined);

      expect(elem2.props.prop1).toEqual(curr.prop1, 'compare value on both instances');
    });
  });
});
