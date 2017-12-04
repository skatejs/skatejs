/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { define, name as generateUniqueName, withUpdate } from '../../../src';

describe('lifecycle/attributes', () => {
  function create(definition = {}, name = 'testName', value) {
    const elem = new (define(
      class extends withUpdate() {
        static is = generateUniqueName();
        static props = { [name]: definition };
      }
    ))();
    // eslint-disable-next-line prefer-rest-params
    if (arguments.length === 3) {
      elem[name] = value;
    }
    return elem;
  }

  describe('attribute set after attach', () => {
    it('with prop already set', () => {
      const elem = create({ attribute: true }, 'testName', 'something');
      expect(elem.getAttribute('test-name')).toEqual('something');
      return mount(elem).waitFor(
        w => w.node.getAttribute('test-name') === 'something'
      );
    });

    it('with prop set via default', () => {
      const elem = create(
        { attribute: true, default: 'something' },
        'testName'
      );
      expect(elem.getAttribute('test-name')).toEqual(null);
      return mount(elem).waitFor(
        w => w.node.getAttribute('test-name') === null
      );
    });
  });

  describe('attribute set before attach', () => {
    it('should retain pre-attach attribute value when attached even if prop set', done => {
      const elem = create({ attribute: true }, 'testName', 'prop-value');
      expect(elem.testName).toEqual('prop-value', 'prop before attr');
      elem.setAttribute('test-name', 'attr-value');
      setTimeout(() => {
        expect(elem.testName).toEqual('attr-value', 'prop after attr');
        expect(elem.getAttribute('test-name')).toEqual('attr-value');
        mount(elem)
          .waitFor(w => w.node.getAttribute('test-name') === 'attr-value')
          .then(() => done());
      }, 1);
    });
  });
});
