/* eslint-env jasmine, mocha */
/** @jsx h */

import { Component, define, h, ready } from '../../../src';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('deprecated/lifecycle', () => {
  it('should get called after created()', (done) => {
    const called = [];
    const Elem = define(class extends Component {
      static created (elem) {
        // We have to guard in tests because the polyfill currently calls the
        // constructor twice when constructed imperatively and inserting.
        if (!elem._created) {
          elem._created = true;
          called.push('created');
        }
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

  describe('legacy', () => {
    let MyEl;
    let myEl;
    let created = false;
    let attached = false;
    let detached = false;

    beforeEach(() => {
      created = false;
      attached = false;
      detached = false;
      MyEl = define(class extends Component {
        constructor () {
          super();
          created = true;
        }
        connectedCallback () {
          super.connectedCallback();
          attached = true;
        }
        disconnectedCallback () {
          super.disconnectedCallback();
          detached = true;
        }
      });
      myEl = new MyEl();
    });

    it('should call the created() callback when the element is created', () => {
      expect(created).to.equal(true, 'created');
      expect(attached).to.equal(false, 'attached');
      expect(detached).to.equal(false, 'detached');
    });

    it('should call the attached() callback when the element is attached', (done) => {
      fixture().appendChild(myEl);
      afterMutations(
        () => expect(created).to.equal(true, 'created'),
        () => expect(attached).to.equal(true, 'attached'),
        () => expect(detached).to.equal(false, 'detached'),
        done
      );
    });

    it('should call the detached() callback when the element is detached', (done) => {
      fixture().appendChild(myEl);
      ready(myEl, () => {
        afterMutations(
          () => fixture().removeChild(myEl),
          () => expect(created).to.equal(true, 'created'),
          () => expect(attached).to.equal(true, 'attached'),
          () => expect(detached).to.equal(true, 'detached'),
          done
        );
      });
    });

    it('should call the updated() callback', done => {
      const El = define(class extends Component {
        static updated () {
          super.updated();
          done();
        }
      });
      fixture(new El());
    });

    it('should call render() and rendered() callbacks', done => {
      const El = define(class extends Component {
        static render () {
          return <div />;
        }
        static rendered (elem) {
          super.rendered(elem);
          expect(elem.shadowRoot.firstElementChild.localName).to.equal('div');
          done();
        }
      });
      fixture(new El());
    });
  });
});
