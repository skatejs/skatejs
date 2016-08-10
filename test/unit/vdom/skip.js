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
});
