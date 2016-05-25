import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

const shadowDomV0 = !!document.createElement('div').createShadowRoot;

describe('vdom/elements', function () {
  it('slot', function () {
    const elem1 = element().skate({
      render () {
        vdom('slot', { name: 'test' });
      }
    })();
    const elem2 = element().skate({
      render () {
        vdom.slot({ name: 'test' });
      }
    })();

    const ch1 = elem1[symbols.shadowRoot].firstElementChild;
    const ch2 = elem2[symbols.shadowRoot].firstElementChild;

    if (shadowDomV0) {
      expect(ch1.tagName).to.equal('CONTENT', 'vdom');
      expect(ch1.getAttribute('select')).to.equal('[slot="test"]', 'vdom');
      expect(ch2.tagName).to.equal('CONTENT', 'vdom(slot)');
      expect(ch2.getAttribute('select')).to.equal('[slot="test"]', 'vdom(slot)');
    } else {
      expect(ch1.tagName).to.equal('SLOT', 'vdom');
      expect(ch1.getAttribute('name')).to.equal('test', 'vdom');
      expect(ch2.tagName).to.equal('SLOT', 'vdom(slot)');
      expect(ch2.getAttribute('name')).to.equal('test', 'vdom(slot)');
    }
  });
});
