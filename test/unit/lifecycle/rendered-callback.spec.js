/* eslint-env mocha */

import expect from 'expect';

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

import { Component, define, h } from 'src';

describe('lifecycle/rendered-callback', () => {
  it('should be called after rendering', (done) => {
    const Elem = define(class extends Component {
      renderCallback () {
        return h('div');
      }
      renderedCallback () {
        expect(this.shadowRoot.firstChild.localName).toBe('div');
      }
    });

    const elem = new Elem();
    fixture(elem);
    afterMutations(done);
  });

  it('should not be called if rendering is prevented', (done) => {
    const Elem = define(class extends Component {
      propsUpdatedCallback () {
        return false;
      }
      renderCallback () {
        return h('div');
      }
      renderedCallback () {
        throw new Error('should not have been called');
      }
    });

    const elem = new Elem();
    fixture(elem);
    afterMutations(done);
  });
});
