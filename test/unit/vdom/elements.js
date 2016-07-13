import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { shadowDomV0, shadowDomV1 } from '../../../src/util/support';
import { symbols, vdom } from '../../../src/index';

describe('vdom/elements', () => {
  describe('element()', () => {
    describe('arguments', () => {
      function create(render) {
        return new (element().skate({ render }))();
      }

      function ctor(name) {
        const Ctor = () => {};
        Ctor[symbols.$name] = name;
        return Ctor;
      }

      it('(tagName)', () => {
        const elem = create(() => vdom.element('div'));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
      });

      it('(Constructor)', () => {
        const Ctor = ctor('div'); 
        const elem = create(() => vdom.element(Ctor));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
      });

      it('(tagName, textContent)', () => {
        const elem = create(() => vdom.element('div', 'text'));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('(tagName, childrenFunction)', () => {
        const elem = create(() => vdom.element('div', vdom.text.bind(null, 'text')));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('(Contructor, textContent)', () => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, 'text'));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('(Contructor, childrenFunction)', () => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, vdom.text.bind(null, 'text')));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('tagName, attrsObject, textContent', () => {
        const elem = create(() => vdom.element('div', { id: 'test' }, 'text'));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.id).to.equal('test');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('tagName, attrsObject, childrenFunction', () => {
        const elem = create(() => vdom.element('div', { id: 'test' }, vdom.text.bind(null, 'text')));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.id).to.equal('test');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('Constructor, attrsObject, textContent', () => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, 'text'));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.id).to.equal('test');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });

      it('Constructor, attrsObject, childrenFunction', () => {
        const Ctor = ctor('div');
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, vdom.text.bind(null, 'text')));
        expect(elem[symbols.$shadowRoot].firstChild.tagName).to.equal('DIV');
        expect(elem[symbols.$shadowRoot].firstChild.id).to.equal('test');
        expect(elem[symbols.$shadowRoot].firstChild.textContent).to.equal('text');
      });
    });
  });

  it('slot', function () {
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

    function assertSlotElement () {
      expect(ch1.tagName).to.equal('SLOT', 'vdom');
      expect(ch1.getAttribute('name')).to.equal('test', 'vdom');
      expect(ch2.tagName).to.equal('SLOT', 'vdom.element(slot)');
      expect(ch2.getAttribute('name')).to.equal('test', 'vdom.element(slot)');
    }

    const ch1 = elem1[symbols.$shadowRoot].firstElementChild;
    const ch2 = elem2[symbols.$shadowRoot].firstElementChild;

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
  });

  it('passing a component constructor to the vdom.element() function', done => {
    const Elem1 = element().skate({
      render () {
        vdom.element('div', function () {
          vdom.element(Elem2);
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
      () => expect(elem2[symbols.$shadowRoot].textContent).to.equal('rendered'),
      done
    );
  });
});
