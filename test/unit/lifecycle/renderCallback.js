/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import uniqueId from '../../../src/util/unique-id';

const { sinon } = window;

describe('lifecycle/renderCallback', () => {
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

  it('should pass in the element as the only argument', (done) => {
    const Elem = define(class extends Component {
      renderCallback (elem) {
        expect(elem).to.equal(this);
        done();
      }
    });

    fixture(new Elem());
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
});
