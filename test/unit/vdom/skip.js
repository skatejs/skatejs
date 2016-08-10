import { define, prop, props, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('vdom/skip', () => {
  it('should skip the element children', done => {
    const Elem = define('x-test', {
      props: {
        num: prop.number()
      },
      render() {
        vdom.element('div', { skip: true }, () => {
          vdom.element('span', () => {
            vdom.text('text');
          });
        });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal(''),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal(''),
      done
    );
  });

  it('should allow conditional rendering', done => {
    function isEven(num) {
      return num % 2 === 0;
    }
    const Elem = define('x-test', {
      props: {
        num: prop.number()
      },
      render(elem) {
        vdom.element('div', { skip: !isEven(elem.num) }, () => {
          vdom.element('span', () => {
            vdom.text(elem.num);
          });
        });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('0'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('0'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('2'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('2'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('4'),
      done
    );
  });
});
