/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('lifecycle/attributes', () => {
  function create (definition = {}, name = 'testName', value) {
    const elem = new (define(class extends Component {
      static get props () {
        return {
          [name]: definition
        };
      }
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
      expect(elem.getAttribute('test-name')).to.equal(null);
      fixture(elem);
      afterMutations(() => {
        expect(elem.getAttribute('test-name')).to.equal('something');
        done();
      });
    });

    it('with prop set via default', (done) => {
      const elem = create({ attribute: true, default: 'something' }, 'testName');
      expect(elem.getAttribute('test-name')).to.equal(null);
      fixture(elem);
      afterMutations(() => {
        expect(elem.getAttribute('test-name')).to.equal('something');
        done();
      });
    });

    it('with prop set via initial', (done) => {
      const elem = create({ attribute: true, initial: 'something' }, 'testName');
      expect(elem.getAttribute('test-name')).to.equal(null);
      fixture(elem);
      afterMutations(() => {
        expect(elem.getAttribute('test-name')).to.equal('something');
        done();
      });
    });
  });

  describe('attribute set before attach', () => {
    it('should retain pre-attach attribute value when attached even if prop set', (done) => {
      const elem = create({ attribute: true }, 'testName', 'prop-value');
      expect(elem.testName).to.equal('prop-value', 'prop before attr');
      elem.setAttribute('test-name', 'attr-value');
      afterMutations(() => {
        expect(elem.testName).to.equal('attr-value', 'prop after attr');
        expect(elem.getAttribute('test-name')).to.equal('attr-value');
        fixture(elem);
        afterMutations(() => {
          expect(elem.getAttribute('test-name')).to.equal('attr-value');
          done();
        });
      });
    });
  });
});
