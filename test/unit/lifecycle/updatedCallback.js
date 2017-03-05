/* eslint-env jasmine, mocha */

import { Component, define, prop, props } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('updatedCallback()', () => {
  it('should be called even if there is no render function', (done) => {
    let called = 0;
    const Elem = define(class extends Component {
      static get props () {
        return {
          test: prop.number
        };
      }
      /* eslint-disable no-use-before-define */
      updatedCallback (prev) {
        if (elemLocal.test === 0) {
          expect(this).to.equal(elemLocal);
          expect(prev).to.equal(undefined);
        } else if (elemLocal.test === 1) {
          expect(this).to.equal(elemLocal);
          expect(prev.test).to.equal(0);
        } else if (elemLocal.test === 2) {
          expect(this).to.equal(elemLocal);
          expect(prev.test).to.equal(1);
        }
        ++called;
      }
      /* eslint-enable no-use-before-define */
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(
      () => expect(called).to.equal(1),
      () => expect(elemLocal.test).to.equal(0),
      () => (elemLocal.test = 1),
      () => expect(called).to.equal(2),
      () => expect(elemLocal.test).to.equal(1),
      () => (elemLocal.test = 2),
      () => expect(called).to.equal(3),
      () => expect(elemLocal.test).to.equal(2),
      done
    );
  });

  it('should prevent rendering if it returns falsy', (done) => {
    let calledUpdated;
    let calledRender = false;
    const Elem = define(class extends Component {
      updatedCallback () {
        calledUpdated = true;
      }
      renderCallback () {
        calledRender = true;
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(
      () => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(false);
      },
      done
    );
  });

  it('should allow rendering', (done) => {
    let calledUpdated;
    let calledRender = false;
    const Elem = define(class extends Component {
      updatedCallback () {
        calledUpdated = true;
        return true;
      }
      renderCallback () {
        calledRender = true;
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(
      () => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(true);
      },
      done
    );
  });

  it('should allow props to be set within it and not be called again as a result', (done) => {
    let calledUpdated = 0;
    let calledRender = 0;
    const Elem = define(class extends Component {
      static get props () {
        return {
          test: {}
        };
      }
      updatedCallback () {
        // In this test case `updated()` is *only called once* during a debounced
        // rendering of the element (triggered when it was connected to the DOM).

        ++calledUpdated;

        // An internal guard should prevent this from re-rendering.
        props(this, { test: 'updated 1' });

        // An internal guard should prevent this from re-rendering.
        this.test = 'updated 2';

        // Allow the render to actually proceed.
        return true;
      }
      renderCallback () {
        // eslint-disable-next-line no-plusplus
        ++calledRender;
      }
    });
    const elemLocal = new Elem();
    fixture(elemLocal);
    afterMutations(
      () => {
        expect(calledUpdated).to.equal(1, 'before');
        expect(calledRender).to.equal(1, 'render');
      },
      done
    );
  });
});
