/** @jsx h */
/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { Component, define, h as vdom } from '../../src';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

describe('withRender', () => {
  describe('renderCallback()', () => {
    it('should be called', done => {
      const Elem = define(class extends Component {
        renderCallback () {
          done();
        }
      });
      mount(<Elem />);
    });

    it('should get called before descendants are initialised', done => {
      const called = [];
      const Elem1 = define(class extends Component {
        constructor () {
          super();
          called.push('elem1');
        }
      });
      const Elem2 = define(class extends Component {
        constructor () {
          super();
          called.push('elem2');
        }
      });

      fixture(`<${Elem1.is}><${Elem2.is}></${Elem2.is}></${Elem1.is}>`);
      afterMutations(
        () => expect(called[0]).toEqual('elem1'),
        () => expect(called[1]).toEqual('elem2'),
        done
      );
    });

    it('should pass in the element as the only argument', done => {
      const Elem = define(class extends Component {
        renderCallback (elem) {
          expect(this).toBe(elem);
          return vdom('div', null, 'called');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(
        () => expect(elem.shadowRoot.firstChild.textContent).toBe('called'),
        done
      );
    });
  });

  describe('renderedCallback()', () => {
    it('should be called after rendering', (done) => {
      const Elem = define(class extends Component {
        renderCallback () {
          return vdom('div');
        }
        renderedCallback () {
          expect(this.shadowRoot.firstChild.localName).toBe('div');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(done);
    });

    it('should not be called if rendering is prevented', (done) => {
      const Elem = define(class extends Component {
        propsUpdatedCallback () {
          return false;
        }
        renderCallback () {
          return vdom('div');
        }
        renderedCallback () {
          throw new Error('should not have been called');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(done);
    });

    // it('should be called if props change', (done) => {
    //   const Elem = define(class extends Component {
    //     static props = {
    //       foo: { default: 'bar' }
    //     };

    //     constructor () {
    //       super();
    //       this.count = 0;
    //     }

    //     renderCallback () {
    //       return vdom('div', null, this.foo);
    //     }

    //     renderedCallback () {
    //       this.count++;

    //       if (this.count === 1) {
    //         expect(this.shadowRoot.firstChild.textContent).toBe('bar');
    //       } else if (this.count === 2) {
    //         expect(this.shadowRoot.firstChild.textContent).toBe('baz');
    //         done();
    //       }
    //     }
    //   });

    //   const elem = new Elem();
    //   fixture(elem);
    //   afterMutations(() => {
    //     elem.foo = 'baz';
    //   });
    // });

    it('should be called if element creates its own shadowRoot', (done) => {
      const Elem = define(class extends Component {
        constructor () {
          super();
          this.attachShadow({ mode: 'open' });
        }

        renderCallback () {
          return vdom('div');
        }

        renderedCallback () {
          expect(this.shadowRoot.firstChild.localName).toBe('div');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(done);
    });
  });

  describe('renderRoot', () => {
    it('allows rendering to somewhere else', (done) => {
      const Elem = define(class extends Component {
        get renderRoot () {
          return this;
        }

        renderCallback () {
          return vdom('div');
        }

        renderedCallback () {
          expect(this.firstChild.localName).toBe('div');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(done);
    });
  });

  describe('attachShadow', () => {
    it('should render to the host node if attachShadow is falsy', () => {
      const Elem = define(class extends Component {
        attachShadow = false
        renderCallback () {
          return 'testing';
        }
      });
      return mount(<Elem />).waitFor(({ node }) => node.textContent === 'testing');
    });

    it('should render to the return value of attachShadow if provided', () => {
      const Elem = define(class extends Component {
        attachShadow () {
          const div = document.createElement('div');
          this.appendChild(div);
          return div;
        }
        renderCallback () {
          return 'testing';
        }
      });
      return mount(<Elem />).waitFor(w => w.has(<div>testing</div>));
    });
  });

  describe('should progressive enhance exiting markup', () => {
    it('on shadow dom', () => {
      customElements.define('x-c', class extends Component {
        renderCallback () {
          return vdom('div', {}, 'Hello2');
        }
      });
      const elem = document.createElement('div');
      fixture(elem);
      const elem2 = document.createElement('x-c');
      let sR = elem2.attachShadow({mode: 'open'});
      sR.innerHTML = '<div>Hello</div>';
      elem.appendChild(elem2);
      return mount(elem).waitFor(() => elem.children[0].shadowRoot.innerHTML === '<div>Hello2</div>');
    });

    it('on light dom', () => {
      customElements.define('x-c', class extends Component {
        get renderRoot () {
          return this;
        }

        renderCallback () {
          return vdom('div', {}, 'Hello2');
        }
      });
      const elem = document.createElement('div');
      fixture(elem);
      elem.innerHTML = '<x-c><div>Hello</div></x-c>';
      return mount(elem).waitFor(() => elem.innerHTML === '<x-c><div>Hello2</div></x-c>');
    });
  });

  it('rendering parent component should not remove content from nested custom-element when rendering in light dom', (done) => {
    define(class extends Component {
      static is = 'x-child';
      get renderRoot () { return this; }
      renderCallback () {
        return 'Child';
      }
    });

    customElements.define('x-parent', class extends Component {
      static props = { 'name': { attribute: true } };
      get renderRoot () { return this; }
      name = 'Foo';
      renderCallback () {
        return vdom('div', {},
          vdom('span', {}, this.name),
          vdom('x-child', {})
        );
      }
    });

    let fix = fixture('<x-parent/>');

    afterMutations(
      () => expect(fix.firstChild.firstChild.children[1].innerHTML).toBe('Child'),
      () => expect(fix.firstChild.firstChild.children[0].innerHTML).toBe('Foo'),
      () => { fix.children[0].name = 'Boo'; },
      () => expect(fix.firstChild.firstChild.children[1].innerHTML).toBe('Child'),
      () => expect(fix.firstChild.firstChild.children[0].innerHTML).toBe('Boo'),
      done);
  });
});
