/* eslint-env jasmine, mocha */

import { Component, define, emit, h, prop, props, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

const { boolean, number } = prop;

describe('vdom/events (on*)', () => {
  it('should not duplicate listeners', done => {
    const MyEl = define(class extends Component {
      static get props () {
        return {
          test: number({ default: 0 })
        };
      }
      renderCallback () {
        vdom.element('div', {
          'on-event': () => {
            this.test++;
          }
        }, this.test);
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
    const myel = new (define(class extends Component {
      renderCallback () {
        vdom.element('div', { 'on-test': test }, vdom.element.bind(null, 'span'));
      }
    }))();
    fixture().appendChild(myel);

    afterMutations(
      () => {
        emit(myel.shadowRoot.querySelector('span'), 'test');
        expect(called).to.equal(true);
      },
      done
    );
  });

  it('should not fail for listeners that are not functions', done => {
    const myel = new (define(class extends Component {
      static get props () {
        return {
          handler: {}
        };
      }
      renderCallback () {
        return h('div', { onTest: this.handler });
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
      el = new (define(class extends Component {
        static get props () {
          return {
            unbind: boolean()
          };
        }
        renderCallback () {
          if (this.unbind) {
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
