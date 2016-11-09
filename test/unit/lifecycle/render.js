/* eslint-env jasmine, mocha */

import { Component, define, prop, props } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import uniqueId from '../../../src/util/unique-id';

const { sinon } = window;

describe('lifecycle/render', () => {
  it('should be called', (done) => {
    let called = false;
    const Elem = define(class extends Component {
      renderCallback () {
        called = true;
      }
    });
    fixture(new Elem());
    afterMutations(
      () => expect(called).to.equal(true),
      done
    );
  });

  it('should get called after created()', (done) => {
    const called = [];
    const Elem = define(class extends Component {
      constructor () {
        super();
        called.push('created');
      }
      renderCallback () {
        called.push('render');
      }
    });
    fixture(new Elem());
    afterMutations(
      () => expect(called[0]).to.equal('created'),
      () => expect(called[1]).to.equal('render'),
      done
    );
  });

  it('should get called before descendants are initialised', (done) => {
    const called = [];
    const elem1 = uniqueId();
    const elem2 = uniqueId();

    define(elem1, class extends Component {
      constructor () {
        super();
        called.push('elem1');
      }
    });
    define(elem2, class extends Component {
      constructor () {
        super();
        called.push('elem2');
      }
    });

    fixture(`<${elem1}><${elem2}></${elem2}></${elem1}>`);
    afterMutations(
      () => expect(called[0]).to.equal('elem1'),
      () => expect(called[1]).to.equal('elem2'),
      done
    );
  });

  describe('returning value', () => {
    let spy;

    beforeEach(() => (spy = sinon.spy()));

    it('function', (done) => {
      const Elem = define(class extends Component {
        renderCallback () {
          return spy;
        }
      });
      fixture(new Elem());
      afterMutations(
        () => expect(spy.callCount).to.equal(1),
        done
      );
    });

    it('array of functions', (done) => {
      const Elem = define(class extends Component {
        renderCallback () {
          return [spy, null, spy];
        }
      });
      fixture(new Elem());
      afterMutations(
        () => expect(spy.callCount).to.equal(2),
        done
      );
    });
  });

  describe('updated()', () => {
    it('should be called even if there is no render function', (done) => {
      let called = 0;
      const Elem = define(class extends Component {
        static get props () {
          return {
            test: prop.number()
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

  describe('rendered()', () => {
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

    it('should not be called if render() is not defined', (done) => {
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
});
