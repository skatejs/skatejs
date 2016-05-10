import component from '../../lib/component';
import vdom from '../../../src/api/vdom';

describe('properties', function () {
  it('class -> className', function () {
    const elem = component({
      render () {
        vdom('div', { class: 'test' });
      }
    })();
    expect(elem.shadowRoot.firstChild.className).to.equal('test');
  });

  it('false should remove the attribute', function () {
    const elem = component({
      render () {
        vdom('div', { test: false });
      }
    })();
    expect(elem.shadowRoot.firstChild.hasAttribute('test')).to.equal(false);
  });
});
