import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { shadowDomV0, shadowDomV1 } from '../../../src/util/support';
import { symbols, vdom } from '../../../src/index';

describe('vdom/elements', () => {
  describe('element()', () => {
    describe('arguments', () => {
      function create(render) {
        const elem = new (element().skate({ render }))();
        fixture(elem);
        return elem;
      }

      function ctor(name) {
        const Ctor = () => {};
        Ctor[symbols.name] = name;
        return Ctor;
      }

      it('(tagName)', done => {
        const elem = create(() => vdom.element('div'));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          done
        );
      });

      it('(Constructor)', done => {
        const Ctor = ctor('div'); 
        const elem = create(() => vdom.element(Ctor));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          done
        );
      });

      it('(tagName, textContent)', done => {
        const elem = create(() => vdom.element('div', 'text'));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(tagName, childrenFunction)', done => {
        const elem = create(() => vdom.element('div', vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(Contructor, textContent)', done => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, 'text'));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(Contructor, childrenFunction)', done => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('tagName, attrsObject, textContent', done => {
        const elem = create(() => vdom.element('div', { id: 'test' }, 'text'));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.id).to.equal('test'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('tagName, attrsObject, childrenFunction', done => {
        const elem = create(() => vdom.element('div', { id: 'test' }, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.id).to.equal('test'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('Constructor, attrsObject, textContent', done => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, 'text'));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.id).to.equal('test'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('Constructor, attrsObject, childrenFunction', done => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem[symbols.shadowRoot].firstChild.tagName).to.equal('DIV'),
          () => expect(elem[symbols.shadowRoot].firstChild.id).to.equal('test'),
          () => expect(elem[symbols.shadowRoot].firstChild.textContent).to.equal('text'),
          done
        );
      });
    });
  });

  it('slot', done => {
    const elem1 = new (element().skate({
      render () {
        vdom.element('slot', { name: 'test' });
      }
    }));
    const elem2 = new (element().skate({
      render () {
        vdom.element('slot', { name: 'test' });
      }
    }));

    fixture().appendChild(elem1);
    fixture().appendChild(elem2);

    afterMutations(() => {
      const ch1 = elem1[symbols.shadowRoot].firstElementChild;
      const ch2 = elem2[symbols.shadowRoot].firstElementChild;

      function assertSlotElement () {
        expect(ch1.tagName).to.equal('SLOT', 'vdom');
        expect(ch1.getAttribute('name')).to.equal('test', 'vdom');
        expect(ch2.tagName).to.equal('SLOT', 'vdom.element(slot)');
        expect(ch2.getAttribute('name')).to.equal('test', 'vdom.element(slot)');
      }

      if (shadowDomV1) {
        assertSlotElement();
      } else if (shadowDomV0) {
        expect(ch1.tagName).to.equal('CONTENT', 'vdom');
        expect(ch1.getAttribute('select')).to.equal('[slot="test"]', 'vdom');
        expect(ch2.tagName).to.equal('CONTENT', 'vdom.element(slot)');
        expect(ch2.getAttribute('select')).to.equal('[slot="test"]', 'vdom.element(slot)');
      } else {
        assertSlotElement();
      }

      done();
    });
  });

  it('passing a component constructor to the vdom.element() function', done => {
    const Elem1 = element().skate({
      render () {
        vdom.element(Elem2);
      }
    });
    const Elem2 = element().skate({
      render () {
        vdom.text('rendered');
      }
    });

    const elem1 = new Elem1();
    const elem2 = new Elem2();

    fixture(elem1);
    fixture(elem2);

    fixture().appendChild(elem1);
    afterMutations(
      () => expect(elem2[symbols.shadowRoot].textContent).to.equal('rendered'),
      done
    );
  });

  describe('passing a function to the vdom.element() function (*part* notes where text was passed as children)', () => {
    it('*div* > span > text', done => {
      const Elem = element().skate({
        render () {
          vdom.element(Div, 'text');
        }
      });

      const Div = (props, chren) => vdom.element('div', () => vdom.element(Span, chren));
      const Span = (props, chren) => vdom.element('span', chren);
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => expect(elem[symbols.shadowRoot].innerHTML).to.equal('<div><span>text</span></div>'),
        done
      );
    });

    it('div > *span* > text', done => {
      const Elem = element().skate({
        render () {
          vdom.element(Div);
        }
      });

      const Div = () => vdom.element('div', () => vdom.element(Span, 'text'));
      const Span = (props, chren) => vdom.element('span', chren);
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => expect(elem[symbols.shadowRoot].innerHTML).to.equal('<div><span>text</span></div>'),
        done
      );
    });

    it('div > span > *text*', done => {
      const Elem = element().skate({
        render () {
          vdom.element(Div);
        }
      });

      const Div = () => vdom.element('div', () => vdom.element(Span));
      const Span = () => vdom.element('span', 'text');
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => expect(elem[symbols.shadowRoot].innerHTML).to.equal('<div><span>text</span></div>'),
        done
      );
    });

    it('*ul* (items) > li > a > text', done => {
      const Elem = element().skate({
        render () {
          vdom.element(Ul, { items: [ 'Item 1', 'Item 2' ]});
        }
      });

      const Ul = props => vdom.element('ul', () => props.items.map(item => vdom.element(Li, item)));
      const Li = (props, chren) => vdom.element('li', () => vdom.element('a', chren));
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => expect(elem[symbols.shadowRoot].innerHTML).to.equal('<ul><li><a>Item 1</a></li><li><a>Item 2</a></li></ul>'),
        done
      );
    });
  });
});
