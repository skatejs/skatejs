import { define, prop, props, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('vdom/skip', () => {
  it.only('should skip the element children', done => {
    const ref = e => (e.textContent = 'real');
    const Elem = define('x-test', {
      props: {
        test: prop.number()
      },
      render(elem) {
        vdom.element('div', { ref, skip: true });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('real'),
      () => props(elem, { test: 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('real'),
      done
    );
  });

  it('should still execute ref', () => {

  });

  it('should still set attributes', () => {

  });

  it('should work with custom elements', () => {
    
  });
});
