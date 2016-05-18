import { emit, prop, vdom } from '../../../src/index';
import component from '../../lib/component';

const { boolean, number } = prop;

describe('events (on*)', function () {
  it('should not duplicate listeners', function (done) {
    const myel = component({
      properties: {
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

    const el = myel();
    const shadowDiv = el.shadowRoot.children[0];

    // Ensures that it rendered.
    expect(shadowDiv.textContent).to.equal('0');
    expect(el._test).to.equal(0);

    // Trigger the handler.
    emit(shadowDiv, 'event');

    // Ensure the event fired.
    expect(el._test).to.equal(1);

    // Re-render.
    el.test++;

    setTimeout(function () {
      expect(shadowDiv.textContent).to.equal('1');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(2);

      el.test++;
      setTimeout(function () {
        expect(shadowDiv.textContent).to.equal('2');
        emit(shadowDiv, 'event');
        expect(el._test).to.equal(3);
        done();
      }, 100);
    }, 100);
  });

  it('should not trigger events bubbled from descendants', function () {
    let called = false;
    const test = () => called = true;
    const myel = component({
      render () {
        vdom('div', { ontest: test }, vdom.bind(null, 'span'));
      }
    })();

    emit(myel.querySelector('span'), 'test');
    expect(called).to.equal(false);
  });

  it('should not fail for listeners that are not functions', function () {
    const myel = component({
      render () {
        vdom('div', { ontest: null });
      }
    })();
    emit(myel.shadowRoot.firstChild, 'test');
  });

  describe('built-in / custom', function () {
    let count, div, el;

    function inc () {
      ++count;
    }

    beforeEach(function () {
      count = 0;
      el = component({
        properties: {
          unbind: boolean()
        },
        render (elem) {
          if (elem.unbind) {
            vdom('div');
          } else {
            vdom('div', { onclick: inc, ontest: inc });
          }
        }
      })();
      div = el.shadowRoot.firstChild;
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

      it('unbinding', function (done) {
        el.unbind = true;
        requestAnimationFrame(function () {
          expect(div.onclick).to.equal(null);
          done();
        });
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

      it('unbinding', function (done) {
        el.unbind = true;
        requestAnimationFrame(function () {
          emit(div, 'test');
          expect(count).to.equal(0);
          done();
        });
      });
    });
  });
});
