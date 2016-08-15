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
          vdom.text('text');
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
        num: prop.number({ default: 2 })
      },
      render(elem) {
        vdom.element('div', { skip: !isEven(elem.num) }, () => {
          vdom.text(elem.num);
          vdom.element('span', elem.num.toString());
        });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('22'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('22'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('44'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('44'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('66'),
      done
    );
  });
});
