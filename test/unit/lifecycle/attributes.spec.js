/* eslint-env jest */

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

import { define, withProps, withUnique } from '../../../src';

describe('lifecycle/attributes', () => {
  function create (definition = {}, name = 'testName', value) {
    const elem = new (define(class extends withUnique(withProps()) {
      static props = { [name]: definition };
    }))();
    // eslint-disable-next-line prefer-rest-params
    if (arguments.length === 3) {
      elem[name] = value;
    }
    return elem;
  }

  describe('attribute set after attach', () => {
    it('with prop already set', (done) => {
      const elem = create({ attribute: true }, 'testName', 'something');
      expect(elem.getAttribute('test-name')).toEqual('something');
      fixture(elem);
      afterMutations(() => {
        expect(elem.getAttribute('test-name')).toEqual('something');
        done();
      });
    });

    it('with prop set via default', (done) => {
      const elem = create({ attribute: true, default: 'something' }, 'testName');
      expect(elem.getAttribute('test-name')).toEqual(null);
      fixture(elem);
      afterMutations(() => {
        expect(elem.getAttribute('test-name')).toEqual(null);
        done();
      });
    });
  });

  describe('attribute set before attach', () => {
    it('should retain pre-attach attribute value when attached even if prop set', (done) => {
      const elem = create({ attribute: true }, 'testName', 'prop-value');
      expect(elem.testName).toEqual('prop-value', 'prop before attr');
      elem.setAttribute('test-name', 'attr-value');
      afterMutations(() => {
        expect(elem.testName).toEqual('attr-value', 'prop after attr');
        expect(elem.getAttribute('test-name')).toEqual('attr-value');
        fixture(elem);
        afterMutations(() => {
          expect(elem.getAttribute('test-name')).toEqual('attr-value');
          done();
        });
      });
    });
  });
});
