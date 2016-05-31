import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

describe('properties', function () {
  it('class -> className', function () {
    const elem = element().skate({
      render () {
        vdom('div', { class: 'test' });
      }
    })();
    expect(elem[symbols.shadowRoot].firstChild.className).to.equal('test');
  });

  it('false should remove the attribute', function () {
    const elem = element().skate({
      render () {
        vdom('div', { test: false });
      }
    })();
    expect(elem[symbols.shadowRoot].firstChild.hasAttribute('test')).to.equal(false);
  });
});
