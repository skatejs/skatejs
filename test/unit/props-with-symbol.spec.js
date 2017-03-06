/* eslint-env mocha */

import expect from 'expect';

import afterMutations from '../lib/after-mutations';
import hasSymbol from '../lib/has-symbol';
import fixture from '../lib/fixture';

import createSymbol from 'src/util/create-symbol';
import { define, Mixins, props } from 'src';

describe('api/props-with-symbol', () => {
  if (!hasSymbol()) {
    return;
  }

  let elem;
  const secret1 = createSymbol('secret');
  const secret2 = createSymbol('secret');

  beforeEach(done => {
    elem = new (define(class extends Mixins.Props() {
      static get props () {
        return {
          [secret1]: {
            initial: 'secretKey'
          },
          [secret2]: {
            initial: 'secretKey2'
          }
        };
      }
      constructor () {
        super();
        this._rendered = 0;
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

      expect(curr[secret1]).toEqual('secretKey');
      expect(curr[secret2]).toEqual('secretKey2');

      expect(secret1 in curr).toEqual(true);
      expect(secret2 in curr).toEqual(true);
      expect(curr.undeclaredProp).toEqual(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', () => {
      props(elem, {
        [secret1]: 'newSecretKey',
        [secret2]: 'newSecretKey2'
      });
      expect(elem[secret1]).toEqual('newSecretKey');
      expect(elem[secret2]).toEqual('newSecretKey2');
    });

    it('should asynchronously render if declared properties are set', done => {
      expect(elem._rendered).toEqual(1);
      props(elem, { [secret1]: 'updated1' });
      afterMutations(
        () => expect(elem._rendered).toEqual(2),
        done
      );
    });

    it('should not render if undeclared properties are set', done => {
      expect(elem._rendered).toEqual(1);
      props(elem, { undeclaredProp: 'updated3' });
      afterMutations(
        () => expect(elem._rendered).toEqual(1),
        done
      );
    });
  });
});
