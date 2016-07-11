import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import { prop, state, symbols, vdom } from '../../../src/index';

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

  describe('re-rendering', () => {
    let Elem1, Elem2;

    beforeEach(() => {
      Elem1 = element().skate({
        props: {
          open: prop.boolean()
        },
        render (elem) {
          vdom.element(Elem2, { open: elem.open });
        },
      });
      Elem2 = element().skate({
        props: {
          open: prop.boolean()
        },
        render (elem) {
          vdom.text(elem.open ? 'open' : 'closed');
        },
      });
    });

    function text(elem) {
      return elem[symbols.shadowRoot].firstChild[symbols.shadowRoot].textContent;
    }

    it('boolean: false -> true -> false', done => {
      const elem = new Elem1();
      
      afterMutations(
        () => expect(text(elem)).to.equal('closed', 'init'),
        () => state(elem, { open: true }),
        () => expect(text(elem)).to.equal('open', 'false -> true'),
        () => state(elem, { open: false }),
        () => expect(text(elem)).to.equal('closed', 'true -> false'),
        done
      );
    });
  });
});
