import { define, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

describe('vdom/skip', () => {
  it('should skip the element children', done => {
    const Elem = define('x-test', {
      render() {
        vdom.element('div', { skip: true }, () => {
          vdom.text('test');
        });
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal(''),
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
