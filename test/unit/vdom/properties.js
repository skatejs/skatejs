import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

describe('properties', function () {
  it('class -> className', function () {
    const elem = new (element().skate({
      render () {
        vdom.element('div', { class: 'test' });
      }
    }));
    expect(elem[symbols.shadowRoot].firstChild.className).to.equal('test');
  });

  it('false should remove the attribute', function () {
    const elem = new (element().skate({
      render () {
        vdom.element('div', { test: false });
      }
    }));
    expect(elem[symbols.shadowRoot].firstChild.hasAttribute('test')).to.equal(false);
  });

  it('should not set properties on SVG elements', function () {
    expect(function () {
      new (element().skate({
        render () {
          vdom.element('svg', { height: 100 });
        },
      }));
    }).to.not.throw(Error);
  });
});
