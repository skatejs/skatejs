/* eslint-env jasmine, mocha */

import afterMutations from '../../lib/after-mutations';
import hasSymbol from '../../lib/has-symbol';
import createSymbol from '../../../src/util/create-symbol';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { props } from '../../../src/index';

describe('api/props-with-symbol', () => {
  if (!hasSymbol()) {
    return;
  }

  let elem;
  const secret = createSymbol('secret');
  const secret2 = createSymbol('secret');

  beforeEach(done => {
    elem = new (element().skate({
      props: {
        [secret]: {
          initial: 'secretKey'
        },
        [secret2]: {
          initial: 'secretKey2'
        }
      },
      created (el) {
        el._rendered = 0;
      },
      render (el) {
        el._rendered++;
      }
    }))();
    fixture(elem);
    afterMutations(done);
  });

  describe('getting', () => {
    it('should return only properties defined as props', () => {
      const curr = props(elem);

      expect(curr[secret]).to.equal('secretKey');
      expect(curr[secret2]).to.equal('secretKey2');

      expect(secret in curr).to.equal(true);
      expect(secret2 in curr).to.equal(true);
      expect(curr.undeclaredProp).to.equal(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', () => {
      props(elem, {
        [secret]: 'newSecretKey',
        [secret2]: 'newSecretKey2'
      });
      expect(elem[secret]).to.equal('newSecretKey');
      expect(elem[secret2]).to.equal('newSecretKey2');
    });

    it('should synchronously render if declared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { [secret]: 'updated1' });
      expect(elem._rendered).to.equal(2);
    });

    it('should not render if undeclared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { undeclaredProp: 'updated3' });
      expect(elem._rendered).to.equal(1);
    });
  });
});
