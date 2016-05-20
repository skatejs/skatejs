import component from '../../lib/component';
import { symbols, vdom } from '../../../src/index';

describe('properties', function () {
  it('class -> className', function () {
    const elem = component({
      render () {
        vdom('div', { class: 'test' });
      }
    })();
    expect(elem[symbols.shadowRoot].firstChild.className).to.equal('test');
  });

  it('false should remove the attribute', function () {
    const elem = component({
      render () {
        vdom('div', { test: false });
      }
    })();
    expect(elem[symbols.shadowRoot].firstChild.hasAttribute('test')).to.equal(false);
  });
});
