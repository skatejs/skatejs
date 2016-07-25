import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { define, prop, state, symbols, vdom } from '../../../src/index';

describe('vdom/properties', function () {
  it('class -> className', done => {
    const elem = new (define('x-test', {
      render () {
        vdom.element('div', { class: 'test' });
      }
    }));
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].firstChild.className).to.equal('test'),
      done
    );
  });

  it('false should remove the attribute', done => {
    const elem = new (define('x-test', {
      render () {
        vdom.element('div', { test: false });
      }
    }));
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].firstChild.hasAttribute('test')).to.equal(false),
      done
    );
  });

  it('should not set properties on SVG elements', done => {
    expect(function () {
      new (define('x-test', {
        render () {
          vdom.element('svg', { height: 100 });
        },
      }));
      afterMutations(
        done
      );
    }).to.not.throw(Error);
  });

  describe('re-rendering', () => {
    let Elem1, Elem2;

    beforeEach(() => {
      Elem1 = define('x-test', {
        props: {
          open: prop.boolean()
        },
        render (elem) {
          vdom.element(Elem2, { open: elem.open });
        },
      });
      Elem2 = define('x-test', {
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
      fixture(elem);
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
