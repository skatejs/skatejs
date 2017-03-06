/* eslint-env mocha */

import expect from 'expect';

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

import { Component, define, h } from 'src';

describe('lifecycle/render-callback', () => {
  it('should be called', done => {
    const Elem = define(class extends Component {
      renderCallback () {
        return h('div');
      }
    });

    const elem = new Elem();
    fixture(elem);
    afterMutations(
      done
    );
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
      renderCallback ({ localName }) {
        return h('div', null, localName);
      }
    });

    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem.shadowRoot.firstChild.textContent).toBe(Elem.is),
      done
    );
  });
});
