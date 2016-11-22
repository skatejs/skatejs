/* eslint-env jasmine, mocha */

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { Component, define, vdom } from '../../../src/index';

describe('vdom/elements', () => {
  describe('element()', () => {
    describe('arguments', () => {
      function create (renderCallback) {
        const elem = new (define(class extends Component {
          renderCallback () {
            return renderCallback.call(this);
          }
        }))();
        fixture(elem);
        return elem;
      }

      function ctor () {
        return define(class extends Component {});
      }

      it('(tagName)', (done) => {
        const elem = create(() => vdom.element('div'));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.tagName).to.equal('DIV'),
          done
        );
      });

      it('(Constructor)', (done) => {
        const Ctor = ctor();
        const elem = create(() => vdom.element(Ctor));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.constructor).to.equal(Ctor),
          done
        );
      });

      it('(tagName, textContent)', (done) => {
        const elem = create(() => vdom.element('div', 'text'));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.tagName).to.equal('DIV'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(tagName, childrenFunction)', (done) => {
        const elem = create(() => vdom.element('div', vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.tagName).to.equal('DIV'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(Contructor, textContent)', (done) => {
        const Ctor = ctor();
        const elem = create(() => vdom.element(Ctor, 'text'));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.constructor).to.equal(Ctor),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('(Contructor, childrenFunction)', (done) => {
        const Ctor = ctor();
        const elem = create(() => vdom.element(Ctor, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.constructor).to.equal(Ctor),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('tagName, attrsObject, textContent', (done) => {
        const elem = create(() => vdom.element('div', { id: 'test' }, 'text'));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.tagName).to.equal('DIV'),
          () => expect(elem.shadowRoot.firstChild.id).to.equal('test'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('tagName, attrsObject, childrenFunction', (done) => {
        const elem = create(() => vdom.element('div', { id: 'test' }, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.tagName).to.equal('DIV'),
          () => expect(elem.shadowRoot.firstChild.id).to.equal('test'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('Constructor, attrsObject, textContent', (done) => {
        const Ctor = ctor();
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, 'text'));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.constructor).to.equal(Ctor),
          () => expect(elem.shadowRoot.firstChild.id).to.equal('test'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      it('Constructor, attrsObject, childrenFunction', (done) => {
        const Ctor = ctor();
        const elem = create(() => vdom.element(Ctor, { id: 'test' }, vdom.text.bind(null, 'text')));
        afterMutations(
          () => expect(elem.shadowRoot.firstChild.constructor).to.equal(Ctor),
          () => expect(elem.shadowRoot.firstChild.id).to.equal('test'),
          () => expect(elem.shadowRoot.firstChild.textContent).to.equal('text'),
          done
        );
      });

      describe('attrsObject should accept null and not throw', () => {
        it('null', () => {
          expect(() => create(() => vdom.element('div', null))).to.not.throw();
        });
      });
    });
  });

  it('passing a component constructor to the vdom.element() function', (done) => {
    const Elem2 = define(class extends Component {
      renderCallback () {
        vdom.text('rendered');
      }
    });
    const Elem1 = define(class extends Component {
      renderCallback () {
        vdom.element(Elem2);
      }
    });

    const elem1 = new Elem1();
    const elem2 = new Elem2();

    fixture(elem1);
    fixture(elem2);

    fixture().appendChild(elem1);
    afterMutations(
      () => expect(elem2.shadowRoot.textContent).to.equal('rendered'),
      done
    );
  });

  describe('passing a function to the vdom.element() function (*part* notes where text or number was passed as children)', () => {
    function testHelper (ch) {
      it(`*div* > span > ${ch}`, (done) => {
        const Span = (props, chren) => vdom.element('span', chren);
        const Div = (props, chren) => vdom.element('div', () => vdom.element(Span, chren));
        const Elem = define(class extends Component {
          renderCallback () {
            vdom.element(Div, ch);
          }
        });

        const elem = new Elem();

        fixture().appendChild(elem);
        afterMutations(
          () => expect(elem.shadowRoot.innerHTML).to.equal(`<div><span>${ch}</span></div>`),
          done
        );
      });

      it(`div > *span* > ${ch}`, (done) => {
        const Span = (props, chren) => vdom.element('span', chren);
        const Div = () => vdom.element('div', () => vdom.element(Span, ch));
        const Elem = define(class extends Component {
          renderCallback () {
            vdom.element(Div);
          }
        });
        const elem = new Elem();

        fixture().appendChild(elem);
        afterMutations(
          () => expect(elem.shadowRoot.innerHTML).to.equal(`<div><span>${ch}</span></div>`),
          done
        );
      });

      it(`div > span > *${ch}*`, (done) => {
        const Span = () => vdom.element('span', ch);
        const Div = () => vdom.element('div', () => vdom.element(Span));
        const Elem = define(class extends Component {
          renderCallback () {
            vdom.element(Div);
          }
        });
        const elem = new Elem();

        fixture().appendChild(elem);
        afterMutations(
          () => {}, // .render()
          () => expect(elem.shadowRoot.innerHTML).to.equal(`<div><span>${ch}</span></div>`),
          done
        );
      });
    }

    ['text', 1].forEach(testHelper);

    it('*ul* (items) > li > a > text', (done) => {
      const Li = (props, chren) => vdom.element('li', () => vdom.element('a', chren));
      const Ul = props => vdom.element('ul', () => props.items.map(item => vdom.element(Li, item)));
      const Elem = define(class extends Component {
        renderCallback () {
          vdom.element(Ul, { items: ['Item 1', 'Item 2'] });
        }
      });
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => {}, // .render()
        () => expect(elem.shadowRoot.innerHTML).to.equal('<ul><li><a>Item 1</a></li><li><a>Item 2</a></li></ul>'),
        done
      );
    });

    it('should pass through special attrs and not set them as attrs or props', (done) => {
      const key = 'my-key';
      const ref = () => {};
      const statics = [];
      const El = (props) => {
        expect(props.key).to.equal(key, 'key');
        expect(props.ref).to.equal(ref, 'ref');
        expect(props.statics).to.equal(statics, 'statics');
        vdom.element('div', { key, ref, statics });
      };
      const Elem = define(class extends Component {
        renderCallback () {
          vdom.element(El, { key, ref, statics });
        }
      });
      const elem = new Elem();

      fixture().appendChild(elem);
      afterMutations(
        () => expect(elem.shadowRoot.innerHTML).to.equal('<div></div>'),
        () => {
          const div = elem.shadowRoot;
          expect(div.key).to.equal(undefined);
          expect(div.ref).to.equal(undefined);
          expect(div.statics).to.equal(undefined);
        },
        done
      );
    });
  });
});
