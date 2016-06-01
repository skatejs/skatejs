import element from '../../lib/element';
import fixture from '../../lib/fixture';
import support from '../../../src/native/support';
import { init, symbols, vdom } from '../../../src/index';

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

    function assertSlotElement () {
      expect(ch1.tagName).to.equal('SLOT', 'vdom');
      expect(ch1.getAttribute('name')).to.equal('test', 'vdom');
      expect(ch2.tagName).to.equal('SLOT', 'vdom(slot)');
      expect(ch2.getAttribute('name')).to.equal('test', 'vdom(slot)');
    }

    const ch1 = elem1[symbols.shadowRoot].firstElementChild;
    const ch2 = elem2[symbols.shadowRoot].firstElementChild;

    if (support.shadowDomV1) {
      assertSlotElement();
    } else if (support.shadowDomV0) {
      expect(ch1.tagName).to.equal('CONTENT', 'vdom');
      expect(ch1.getAttribute('select')).to.equal('[slot="test"]', 'vdom');
      expect(ch2.tagName).to.equal('CONTENT', 'vdom(slot)');
      expect(ch2.getAttribute('select')).to.equal('[slot="test"]', 'vdom(slot)');
    } else {
      assertSlotElement();
    }
  });

  it('passing a component constructor to the vdom() function', function () {
    const elem1 = element().skate({
      render () {
        vdom.text('rendered');
      }
    });
    const elem2 = element().skate({
      render () {
        vdom.div(function () {
          vdom(elem1);
        });
      }
    });

    const el2 = elem2();
    const el1 = el2[symbols.shadowRoot].firstChild.firstChild;
    fixture(el2);
    init(el1);
    expect(el1[symbols.shadowRoot].textContent).to.equal('rendered');
  });
});
