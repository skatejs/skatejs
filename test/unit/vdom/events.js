import { emit, prop, state, symbols, vdom } from '../../../src/index';
import element from '../../lib/element';

const { boolean, number } = prop;

describe('vdom/events (on*)', function () {
  it('should not duplicate listeners', function () {
    const MyEl = element().skate({
      props: {
        test: number({ default: 0 })
      },
      created (elem) {
        elem._test = 0;
      },
      render (elem) {
        vdom('div', {
          onevent () {
            elem._test++;
          }
        }, elem.test);
      }
    });

    const el = new MyEl();
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
  });

  it('should not trigger events bubbled from descendants', function () {
    let called = false;
    const test = () => called = true;
    const myel = new (element().skate({
      render () {
        vdom('div', { ontest: test }, vdom.bind(null, 'span'));
      }
    }));
    emit(myel[symbols.shadowRoot].querySelector('span'), 'test');
    expect(called).to.equal(false);
  });

  it('should not fail for listeners that are not functions', function () {
    const myel = new (element().skate({
      render () {
        vdom('div', { ontest: null });
      }
    }));
    emit(myel[symbols.shadowRoot].firstChild, 'test');
  });

  describe('built-in / custom', function () {
    let count, div, el;

    function inc () {
      ++count;
    }

    beforeEach(function () {
      count = 0;
      el = new (element().skate({
        props: {
          unbind: boolean()
        },
        render (elem) {
          if (elem.unbind) {
            vdom('div');
          } else {
            vdom('div', { onclick: inc, ontest: inc });
          }
        }
      }));
      div = el[symbols.shadowRoot].firstChild;
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
