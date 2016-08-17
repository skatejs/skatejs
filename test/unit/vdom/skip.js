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
          vdom.text('1');
          vdom.element('span', () => {
            vdom.text('2');
          });
          vdom.element('div', () => {
            vdom.element('span', () => {
              vdom.text('3');
            });
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
        num: prop.number({ default: 2 })
      },
      render(elem) {
        vdom.element('div', { skip: !isEven(elem.num) }, () => {
          vdom.text(elem.num);
          vdom.element('span', elem.num.toString());
          vdom.element('div', () => {
            vdom.element('span', elem.num.toString());
          });
        });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('666'),
      done
    );
  });
});
