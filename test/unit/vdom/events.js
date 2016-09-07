import { emit, prop, props, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';

const { boolean, number } = prop;

describe('vdom/events (on*)', () => {
  it('should not duplicate listeners', done => {
    const MyEl = element().skate({
      props: {
        test: number({ default: 0 }),
      },
      created(elem) {
        elem._test = 0;
      },
      render(elem) {
        vdom.element('div', {
          'on-event': () => {
            elem._test++;
          },
        }, elem.test);
      },
    });

    const el = new MyEl();
    fixture(el);

    afterMutations(() => {
      const shadowDiv = el[symbols.shadowRoot].children[0];

      // Ensures that it rendered.
      expect(shadowDiv.textContent).to.equal('0');
      expect(el._test).to.equal(0);

      // Trigger the handler.
      emit(shadowDiv, 'event');

      // Ensure the event fired.
      expect(el._test).to.equal(1);

      // Re-render.
      props(el, { test: el.test + 1 });
      expect(shadowDiv.textContent).to.equal('1');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(2);

      props(el, { test: el.test + 1 });
      expect(shadowDiv.textContent).to.equal('2');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(3);

      done();
    });
  });

  it('should trigger events bubbled from descendants', done => {
    let called = false;
    const test = () => {
      called = true;
    };
    const myel = new (element().skate({
      render() {
        vdom.element('div', { 'on-test': test }, vdom.element.bind(null, 'span'));
      },
    }));
    fixture().appendChild(myel);

    afterMutations(() => {
      emit(myel[symbols.shadowRoot].querySelector('span'), 'test');
      expect(called).to.equal(true);
      done();
    });
  });

  it('should emit events from shadow dom', done => {
    let called = false;
    let detail = null;
    const test = (e) => {
      called = true;
      detail = e.detail;
    };
    const myel = new (element().skate({
      render() {
        vdom.element('div', {}, vdom.element.bind(null, 'span'));
      },
    }));
    myel.addEventListener('test', test);
    fixture().appendChild(myel);

    afterMutations(() => {
      emit(myel[symbols.shadowRoot].querySelector('span'), 'test', { detail: 'detail' });
      expect(called).to.equal(true);
      expect(detail).to.equal('detail');
      done();
    });
  });

  it('should not fail for listeners that are not functions', done => {
    const myel = new (element().skate({
      render() {
        vdom.element('div', { 'on-test': null });
      },
    }));
    fixture(myel);
    afterMutations(() => {
      emit(myel[symbols.shadowRoot].firstChild, 'test');
      done();
    });
  });

  describe('built-in / custom', () => {
    let count;
    let div;
    let el;

    function inc() {
      ++count;
    }

    beforeEach(done => {
      count = 0;
      el = new (element().skate({
        props: {
          unbind: boolean(),
        },
        render(elem) {
          if (elem.unbind) {
            vdom.element('div');
          } else {
            vdom.element('div', { onclick: inc, onTest1: inc, 'on-test2': inc });
          }
        },
      }));
      fixture(el);
      afterMutations(
        () => {
          div = el[symbols.shadowRoot].firstChild;
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
