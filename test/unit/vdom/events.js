/* eslint-env jasmine, mocha */

import { emit, h, prop, props, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';

const { boolean, number } = prop;

describe('vdom/events (on*)', () => {
  it('should not duplicate listeners', done => {
    const MyEl = element().skate({
      props: {
        test: number({ default: 0 })
      },
      render (elem) {
        vdom.element('div', {
          'on-event': () => {
            elem.test++;
          }
        }, elem.test);
      }
    });

    const el = new MyEl();
    fixture(el);

    afterMutations(
      () => expect(el.shadowRoot.textContent).to.equal('0'),
      () => emit(el.shadowRoot.firstChild, 'event'),
      () => expect(el.shadowRoot.textContent).to.equal('1'),
      () => emit(el.shadowRoot.firstChild, 'event'),
      () => expect(el.shadowRoot.textContent).to.equal('2'),
      done
    );
  });

  it('should trigger events bubbled from descendants', done => {
    let called = false;
    const test = () => {
      called = true;
    };
    const myel = new (element().skate({
      render () {
        vdom.element('div', { 'on-test': test }, vdom.element.bind(null, 'span'));
      }
    }))();
    fixture().appendChild(myel);

    afterMutations(
      () => {}, // .render()
      () => {
        emit(myel.shadowRoot.querySelector('span'), 'test');
        expect(called).to.equal(true);
      },
      done
    );
  });

  it('should emit events from shadow dom', done => {
    let called = false;
    let detail = null;

    const myel = new (element().skate({
      render () {
        vdom.element('div', {}, vdom.element.bind(null, 'span'));
      }
    }))();

    myel.addEventListener('test', (e) => {
      called = true;
      detail = e.detail;
    });
    fixture().appendChild(myel);

    afterMutations(
      () => emit(myel.shadowRoot.querySelector('span'), 'test', { detail: 'detail' }),
      () => expect(called).to.equal(true),
      () => expect(detail).to.equal('detail'),
      done
    );
  });

  it('should not fail for listeners that are not functions', done => {
    const myel = new (element().skate({
      props: {
        handler: {}
      },
      render (elem) {
        return h('div', { onTest: elem.handler });
      }
    }))();

    let div;
    fixture(myel);
    afterMutations(
      () => (div = myel.shadowRoot.firstChild),
      () => (myel.handler = undefined),
      () => emit(div, 'test'),
      () => (myel.handler = null),
      () => emit(div, 'test'),
      () => (myel.handler = false),
      () => emit(div, 'test'),
      () => (myel.handler = 0),
      () => emit(div, 'test'),
      () => (myel.handler = true),
      () => emit(div, 'test'),
      () => (myel.handler = 1),
      () => emit(div, 'test'),
      () => (myel.handler = ''),
      () => emit(div, 'test'),
      () => (myel.handler = 'something'),
      () => emit(div, 'test'),
      done
    );
  });

  describe('built-in / custom', () => {
    let count;
    let div;
    let el;

    function inc () {
      ++count;
    }

    beforeEach(done => {
      count = 0;
      el = new (element().skate({
        props: {
          unbind: boolean()
        },
        render (elem) {
          if (elem.unbind) {
            vdom.element('div');
          } else {
            vdom.element('div', { onclick: inc, onTest1: inc, 'on-test2': inc });
          }
        }
      }))();
      fixture(el);
      afterMutations(
        () => {}, // .render()
        () => {
          div = el.shadowRoot.firstChild;
        },
        done
      );
    });

    describe('built-in', () => {
      it('binding', () => {
        expect(div.onclick).to.be.a('function');
      });

      it('triggering via function', () => {
        div.onclick();
        expect(count).to.equal(1);
      });

      it('triggering via dispatchEvent()', () => {
        emit(div, 'click');
        expect(count).to.equal(1);
      });

      it('unbinding', () => {
        props(el, { unbind: true });
        expect(div.onclick).to.equal(null);
      });
    });

    describe('custom', () => {
      it('binding', () => {
        expect(div.onTest).to.equal(undefined);
        expect(div['on-test']).to.equal(undefined);
      });

      it('triggering via dispatchEvent()', () => {
        emit(div, 'test1');
        emit(div, 'test2');
        expect(count).to.equal(2);
      });

      it('unbinding', () => {
        props(el, { unbind: true });
        emit(div, 'test1');
        emit(div, 'test2');
        expect(count).to.equal(0);
      });
    });
  });
});
