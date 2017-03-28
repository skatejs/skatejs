/* eslint-env mocha */

import expect from 'expect';

import { Component, define, h } from 'src';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

describe('withRender', () => {
  describe('renderCallback()', () => {
    it('should be called', done => {
      const Elem = define(class extends Component {
        renderCallback () {
          return h('div');
        }
      });

      const elem = new Elem();
      fixture(elem);
      afterMutations(done);
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

    it('should pass in the props as the only argument', done => {
      const Elem = define(class extends Component {
        static props = {
          test: null
        }
        renderCallback ({ test, ...rest }) {
          expect(Object.keys(rest).length).toBe(0);
          return h('div', null, test);
        }
      });

      const elem = new Elem();
      elem.test = 'testing';
      fixture(elem);
      afterMutations(
        () => expect(elem.shadowRoot.firstChild.textContent).toBe('testing'),
        done
      );
    });
  });

  describe('renderedCallback()', () => {
    it('should be called after rendering', (done) => {
      const Elem = define(class extends Component {
        renderCallback () {
          return h('div');
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
          return h('div');
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
});
