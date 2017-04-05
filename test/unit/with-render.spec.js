/** @jsx h */
/* eslint-env mocha */

import expect from 'expect';
import { h, mount } from 'bore';

import { Component, define, h as vdom } from 'src';

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
});
