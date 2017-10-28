/** @jsx h */
/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { define, withComponent } from '../../src';

const Component = withComponent(
  class extends HTMLElement {
    renderer(renderRoot, render) {
      if (renderRoot.childNodes.length) {
        renderRoot.replaceChild(render(), renderRoot.firstChild);
      } else {
        renderRoot.appendChild(render());
      }
    }
  }
);

describe('withRenderer', () => {
  describe('render()', () => {
    it('should be called', () => {
      const Elem = define(
        class extends Component {
          render(elem) {
            expect(this).toBe(elem);
            return h('div', null, 'called');
          }
        }
      );

      return mount(new Elem()).wait(e => {
        expect(e.shadowRoot.firstChild.textContent).toBe('called');
      });
    });
  });

  describe('didRender()', () => {
    it('should be called after rendering', () => {
      const Elem = define(
        class extends Component {
          render() {
            return h('div');
          }
          didRender() {
            expect(this.shadowRoot.firstChild.localName).toBe('div');
          }
        }
      );

      return mount(new Elem()).wait();
    });

    it('should not be called if rendering is prevented', () => {
      const Elem = define(
        class extends Component {
          shouldUpdate() {
            setTimeout(() => (this.called = true), 1);
            return false;
          }
          render() {
            return h('div');
          }
          didRender() {
            throw new Error('should not have been called');
          }
        }
      );
      return mount(new Elem()).waitFor(w => {
        return w.node.called;
      });
    });

    it('should be called if element creates its own shadowRoot', () => {
      const Elem = define(
        class extends Component {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
          }
          render() {
            return h('div');
          }
          didRender() {
            expect(this.shadowRoot.firstChild.localName).toBe('div');
          }
        }
      );

      return mount(new Elem()).wait();
    });
  });

  describe('renderRoot', () => {
    it('allows rendering to somewhere else', () => {
      const Elem = define(
        class extends Component {
          get renderRoot() {
            return this;
          }
          render() {
            return h('div');
          }
          didRender() {
            expect(this.firstChild.localName).toBe('div');
          }
        }
      );

      return mount(new Elem()).waitFor(w => w.has(<div />));
    });
  });

  describe('attachShadow', () => {
    it('should render to the host node if attachShadow is falsy', () => {
      const Elem = define(
        class extends Component {
          get renderRoot() {
            return this;
          }
          render() {
            return h('div', null, 'testing');
          }
        }
      );
      return mount(<Elem />).waitFor(w => w.has(<div>testing</div>));
    });

    it('should render to the return value of attachShadow if provided', () => {
      const Elem = define(
        class extends Component {
          attachShadow() {
            const div = document.createElement('div');
            this.appendChild(div);
            return (this.shadowRoot = div);
          }
          render() {
            return h('div', null, 'testing');
          }
        }
      );
      return mount(<Elem />).waitFor(w => w.has(<div>testing</div>));
    });
  });

  describe('should progressive enhance exiting markup', async () => {
    it('on shadow dom', () => {
      customElements.define(
        'x-c',
        class extends Component {
          render() {
            return h('div', null, 'Hello2');
          }
        }
      );

      const elem1 = <div />;
      mount(elem1);

      const elem2 = <x-c />;
      const root2 = elem2.attachShadow({ mode: 'open' });
      root2.innerHTML = '<div>Hello</div>';
      elem1.appendChild(elem2);

      return mount(elem1).waitFor(() => {
        return elem1.children[0].shadowRoot.innerHTML === '<div>Hello2</div>';
      });
    });

    it('on light dom', () => {
      customElements.define(
        'x-c',
        class extends Component {
          get renderRoot() {
            return this;
          }
          render() {
            return h('div', null, 'Hello2');
          }
        }
      );
      return mount(
        <x-c>
          <div>Hello</div>
        </x-c>
      )
        .waitFor(w => {
          return w.node.hasChildNodes();
        })
        .then(w => {
          expect(w.node.outerHTML).toBe('<x-c><div>Hello2</div></x-c>');
        });
    });
  });
});
