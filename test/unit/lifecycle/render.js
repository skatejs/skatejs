import { define, prop, props } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import elem from '../../lib/element';
import fixture from '../../lib/fixture';

describe('lifecycle/render', () => {
  it('should be called', done => {
    let called = false;
    fixture(new (elem().skate({
      render () {
        called = true;
      }
    })));
    afterMutations(
      () => expect(called).to.equal(true),
      done
    );
  });

  it('should get called after created()', done => {
    let called = [];
    fixture(new (elem().skate({
      created () {
        called.push('created');
      },
      render () {
        called.push('render');
      }
    })));
    afterMutations(
      () => expect(called[0]).to.equal('created'),
      () => expect(called[1]).to.equal('render'),
      done
    );
  });

  it('should get called before descendants are initialised', done => {
    const called = [];
    const elem1 = elem();
    const elem2 = elem();

    elem1.skate({
      created () {
        called.push('elem1');
      }
    });
    elem2.skate({
      created () {
        called.push('elem2');
      }
    });

    fixture(`<${elem1.safe}><${elem2.safe}></${elem2.safe}></${elem1.safe}>`);
    afterMutations(
      () => expect(called[0]).to.equal('elem1'),
      () => expect(called[1]).to.equal('elem2'),
      done
    );
  });

  describe('updated()', () => {
    it('should be called even if there is no render function', done => {
      const Elem = define('x-test', {
        props: {
          test: prop.number()
        },
        updated(el, prev) {
          expect(el).to.equal(elem);
          expect(elem.test).to.equal(0);
          expect(prev).to.equal(undefined);
          done();
        },
      });
      const elem = new Elem();
      fixture(elem);
    });

    it('should prevent rendering if it returns falsy', done => {
      let calledUpdated, calledRender = false;
      const Elem = define('x-test', {
        updated() {
          calledUpdated = true;
        },
        render() {
          calledRender = true;
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(false);
        done();
      });
    });

    it('should allow rendering', done => {
      let calledUpdated, calledRender = false;
      const Elem = define('x-test', {
        updated() {
          calledUpdated = true;
          return true;
        },
        render() {
          calledRender = true;
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(calledUpdated).to.equal(true);
        expect(calledRender).to.equal(true);
        done();
      });
    });

    it('should allow props to be set within it and not be called again as a result', done => {
      let calledUpdated = 0;
      let calledRender = 0;
      const Elem = define('x-test', {
        props: {
          test: {}
        },
        updated(elem) {
          ++calledUpdated;

          // Sync render.
          props(elem, { test: 'updated 1' });

          // This will queue a render, but we should only queue if it's not in
          // the process of rendering.
          elem.test = 'updated 2';

          // Finally render. We do this sync here to make sure any prop sets
          // don't call the debounced render.
          return true;
        },
        render() {
          ++calledRender;
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(calledUpdated).to.equal(1, 'before');
        expect(calledRender).to.equal(1, 'render');
        done();
      });
    });
  });

  describe('rendered()', () => {
    it('should be called after rendering', done => {
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
          expect(el).to.equal(elem);
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(order[0]).to.equal('updated');
        expect(order[1]).to.equal('render');
        expect(order[2]).to.equal('rendered');
        done();
      });
    });

    it('should not be called if render() is not defined', done => {
      let afterCalled = false;
      const Elem = define('x-test', {
        rendered() {
          afterCalled = true;
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(afterCalled).to.equal(false);
        done();
      });
    });

    it('should not be called if rendering is prevented', done => {
      let afterCalled = false;
      const Elem = define('x-test', {
        updated() {
          
        },
        render() {
          
        },
        rendered() {
          afterCalled = true;
        }
      });
      const elem = new Elem();
      fixture(elem);
      afterMutations(() => {
        expect(afterCalled).to.equal(false);
        done();
      });
    });
  });
});
