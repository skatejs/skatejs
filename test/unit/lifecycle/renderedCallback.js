/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('renderedCallback()', () => {
  it('should be called after rendering', (done) => {
    const order = [];
    const Elem = define(class extends Component {
      updatedCallback () {
        order.push('updated');
        return true;
      }
      renderCallback () {
        order.push('render');
      }
      renderedCallback () {
        order.push('rendered');

        // eslint-disable-next-line no-use-before-define
        expect(this).to.equal(elemLocal);
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(
      () => {
        expect(order[0]).to.equal('updated');
        expect(order[1]).to.equal('render');
        expect(order[2]).to.equal('rendered');
      },
      done
    );
  });

  it('should not be called if renderCallback() is not defined', (done) => {
    let afterCalled = false;
    const Elem = define(class extends Component {
      renderedCallback () {
        afterCalled = true;
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(() => {
      expect(afterCalled).to.equal(false);
      done();
    });
  });

  it('should not be called if rendering is prevented', (done) => {
    let afterCalled = false;
    const Elem = define(class extends Component {
      updatedCallback () {}
      renderCallback () {}
      renderedCallback () {
        afterCalled = true;
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(() => {
      expect(afterCalled).to.equal(false);
      done();
    });
  });
});
