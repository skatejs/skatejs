import { emit, prop, state, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';

const { boolean, number } = prop;

describe('vdom/events (on*)', function () {
  it('should not duplicate listeners', done => {
    const MyEl = element().skate({
      props: {
        test: number({ default: 0 })
      },
      created (elem) {
        elem._test = 0;
      },
      render (elem) {
        vdom.element('div', {
          onevent () {
            elem._test++;
          }
        }, elem.test);
      }
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
      state(el, { test: el.test + 1 });
      expect(shadowDiv.textContent).to.equal('1');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(2);

      state(el, { test: el.test + 1 });
      expect(shadowDiv.textContent).to.equal('2');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(3);

      done();
    });
  });

  it('should trigger events bubbled from descendants', done => {
    let called = false;
    const test = () => called = true;
    const myel = new (element().skate({
      render () {
        vdom.element('div', { ontest: test }, vdom.element.bind(null, 'span'));
      }
    }));
    fixture().appendChild(myel);

    afterMutations(() => {
      emit(myel[symbols.shadowRoot].querySelector('span'), 'test');
      expect(called).to.equal(true);
      done();
    });
  });

  it('should not fail for listeners that are not functions', done => {
    const myel = new (element().skate({
      render () {
        vdom.element('div', { ontest: null });
      }
    }));
    fixture(myel);
    afterMutations(() => {
      emit(myel[symbols.shadowRoot].firstChild, 'test');
      done();
    });
  });

  describe('built-in / custom', () => {
    let count, div, el;

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
            vdom.element('div', { onclick: inc, ontest: inc });
          }
        }
      }));
      fixture(el);
      afterMutations(
        () => div = el[symbols.shadowRoot].firstChild,
        done
      );
    });

    describe('built-in', function () {
      it('binding', function () {
        expect(div.onclick).to.be.a('function');
      });

      it('triggering via function', function () {
        div.onclick();
        expect(count).to.equal(1);
      });

      it('triggering via dispatchEvent()', function () {
        emit(div, 'click');
        expect(count).to.equal(1);
      });

      it('unbinding', function () {
        state(el, { unbind: true });
        expect(div.onclick).to.equal(null);
      });
    });

    describe('custom', function () {
      it('binding', function () {
        expect(div.ontest).to.equal(undefined);
      });

      it('triggering via dispatchEvent()', function () {
        emit(div, 'test');
        expect(count).to.equal(1);
      });

      it('unbinding', function () {
        state(el, { unbind: true });
        emit(div, 'test');
        expect(count).to.equal(0);
      });
    });
  });
});
