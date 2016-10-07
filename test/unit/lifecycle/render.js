import { define, prop, props } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import elem from '../../lib/element';
import fixture from '../../lib/fixture';
import { isPolyfilled } from '../../../src/util/support';

describe('lifecycle/render', () => {
  it('should be called', (done) => {
    let called = false;
    const Elem = define('x-test', {
      render() {
        called = true;
      },
    });
    fixture(new Elem());
    afterMutations(
      () => expect(called).to.equal(true),
      done
    );
  });

  it('should get called after created()', (done) => {
    const called = [];
    const Elem = define('x-test', {
      created() {
        called.push('created');
      },
      render() {
        called.push('render');
      },
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
    const elem1 = elem();
    const elem2 = elem();

    elem1.skate({
      created() {
        called.push('elem1');
      },
    });
    elem2.skate({
      created() {
        called.push('elem2');
      },
    });

    fixture(`<${elem1.safe}><${elem2.safe}></${elem2.safe}></${elem1.safe}>`);
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
      const Elem = define('x-test', {
        render() {
          return spy;
        },
      });
      fixture(new Elem());
      afterMutations(
        () => expect(spy.callCount).to.equal(1),
        done
      );
    });

    it('array of functions', (done) => {
      const Elem = define('x-test', {
        render() {
          return [spy, null, spy];
        },
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
      const Elem = define('x-test', {
        props: {
          test: prop.number(),
        },
        /* eslint-disable no-use-before-define */
        updated(el, prev) {
          if (elemLocal.test === 0) {
            expect(el).to.equal(elemLocal);
            expect(prev).to.equal(undefined);
          } else if (elemLocal.test === 1) {
            expect(el).to.equal(elemLocal);
            expect(prev.test).to.equal(0);
          } else if (elemLocal.test === 2) {
            expect(el).to.equal(elemLocal);
            expect(prev.test).to.equal(1);
          }
          ++called;
        },
        /* eslint-enable no-use-before-define */
      });
      const elemLocal = new Elem();
      fixture(elemLocal);
      afterMutations(
        () => expect(called).to.equal(1),
        () => expect(elemLocal.test).to.equal(0),
        () => {
          elemLocal.test = 1;
        },
        () => expect(called).to.equal(2),
        () => expect(elemLocal.test).to.equal(1),
        () => {
          elemLocal.test = 2;
        },
        () => expect(called).to.equal(3),
        () => expect(elemLocal.test).to.equal(2),
        done
      );
    });

    it('should prevent rendering if it returns falsy', (done) => {
      let calledUpdated;
      let calledRender = false;
      const Elem = define('x-test', {
        updated() {
          calledUpdated = true;
        },
        render() {
          calledRender = true;
        },
      });
      const elemLocal = new Elem();
      fixture(elemLocal);
      afterMutations(() => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(false);
        done();
      });
    });

    it('should allow rendering', (done) => {
      let calledUpdated;
      let calledRender = false;
      const Elem = define('x-test', {
        updated() {
          calledUpdated = true;
          return true;
        },
        render() {
          calledRender = true;
        },
      });
      const elemLocal = new Elem();
      fixture(elemLocal);
      afterMutations(() => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(true);
        done();
      });
    });

    it('should allow props to be set within it and not be called again as a result', (done) => {
      let calledUpdated = 0;
      let calledRender = 0;
      const Elem = define('x-test', {
        props: {
          test: {},
        },
        updated(el) {
          ++calledUpdated;

          // Sync render.
          props(el, { test: 'updated 1' });

          // This will queue a render, but we should only queue if it's not in
          // the process of rendering.
          el.test = 'updated 2';

          // Finally render. We do this sync here to make sure any prop sets
          // don't call the debounced render.
          return true;
        },
        render() {
          /* eslint no-plusplus: 0 */
          ++calledRender;
        },
      });
      const elemLocal = new Elem();
      fixture(elemLocal);
      afterMutations(() => {
        const expectedCallCount = isPolyfilled ? 2 : 1;
        expect(calledUpdated).to.equal(expectedCallCount, 'before');
        expect(calledRender).to.equal(expectedCallCount, 'render');
        done();
      });
    });
  });

  describe('rendered()', () => {
    it('should be called after rendering', (done) => {
      const order = [];
      const Elem = define('x-test', {
        updated() {
          order.push('updated');
          return true;
        },
        render() {
          order.push('render');
        },
        rendered(el) {
          order.push('rendered');
          expect(el).to.equal(elemLocal); // eslint-disable-line no-use-before-define
        },
      });
      const elemLocal = new Elem();
      fixture(elemLocal);
      afterMutations(() => {
        expect(order[0]).to.equal('updated');
        expect(order[1]).to.equal('render');
        expect(order[2]).to.equal('rendered');
        done();
      });
    });

    it('should not be called if render() is not defined', (done) => {
      let afterCalled = false;
      const Elem = define('x-test', {
        rendered() {
          afterCalled = true;
        },
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
      const Elem = define('x-test', {
        updated() {

        },
        render() {

        },
        rendered() {
          afterCalled = true;
        },
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
