import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { shadowDomV0, shadowDomV1 } from '../../../src/util/support';
import { symbols, vdom } from '../../../src/index';

describe('vdom/elements', function () {
  it('slot', function () {
    const elem1 = new (element().skate({
      render () {
        vdom('slot', { name: 'test' });
      }
    }));
    const elem2 = new (element().skate({
      render () {
        vdom.slot({ name: 'test' });
      }
    }));

    function assertSlotElement () {
      expect(ch1.tagName).to.equal('SLOT', 'vdom');
      expect(ch1.getAttribute('name')).to.equal('test', 'vdom');
      expect(ch2.tagName).to.equal('SLOT', 'vdom(slot)');
      expect(ch2.getAttribute('name')).to.equal('test', 'vdom(slot)');
    }

    const ch1 = elem1[symbols.shadowRoot].firstElementChild;
    const ch2 = elem2[symbols.shadowRoot].firstElementChild;

    if (shadowDomV1) {
      assertSlotElement();
    } else if (shadowDomV0) {
      expect(ch1.tagName).to.equal('CONTENT', 'vdom');
      expect(ch1.getAttribute('select')).to.equal('[slot="test"]', 'vdom');
      expect(ch2.tagName).to.equal('CONTENT', 'vdom(slot)');
      expect(ch2.getAttribute('select')).to.equal('[slot="test"]', 'vdom(slot)');
    } else {
      assertSlotElement();
    }
  });

  it('passing a component constructor to the vdom() function', function (done) {
    const Elem1 = element().skate({
      render () {
        vdom.div(function () {
          vdom(Elem2);
        });
      }
    });
    const Elem2 = element().skate({
      render () {
        vdom.text('rendered');
      }
    });

    const elem1 = new Elem1();
    const elem2 = new Elem2();

    fixture().appendChild(elem1);
    elem1.appendChild(elem2);
    afterMutations(
      () => expect(elem2[symbols.shadowRoot].textContent).to.equal('rendered'),
      done
    );
  });
});
