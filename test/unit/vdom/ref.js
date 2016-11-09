/* eslint-env jasmine, mocha */

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { Component, define, prop, props, vdom } from '../../../src/index';

function test (name, el) {
  function create (ref) {
    const Elem = define(class extends Component {
      static get props () {
        return {
          num: prop.number(),
          ref: { initial: () => ref }
        };
      }
      renderCallback () {
        vdom.element(el, { ref: this.ref, id: 'div' }, () =>
          vdom.element('span', { id: 'span' }, 'test')
        );
      }
    });
    const elem = new Elem();
    fixture(elem);
    return elem;
  }

  describe(name, () => {
    it('should be a function', done => {
      create(() => done());
    });

    it('should have access to all properties', done => {
      create(node => {
        expect(node.id).to.equal('div');
        done();
      });
    });

    it('should have access to all descendants', done => {
      create(node => {
        expect(node.firstChild.tagName).to.equal('SPAN');
        expect(node.firstChild.id).to.equal('span');
        expect(node.firstChild.textContent).to.equal('test');
        done();
      });
    });

    it('should only call a ref if it changes', done => {
      let num = 0;
      const ref = () => ++num;
      const elem = create(ref);

      // We change elem.num here so that we can see what happens when we
      // re-render without changing the ref.
      afterMutations(
        () => {}, // x-test.render()
        () => expect(num).to.equal(1),
        () => props(elem, { num: elem.num + 1 }),
        () => expect(num).to.equal(1),
        () => props(elem, { num: elem.num + 2, ref: () => ++num }),
        () => expect(num).to.equal(2),
        done
      );
    });

    it('should not call a removed ref', done => {
      let num = 0;
      const elem = create(() => ++num);
      afterMutations(
        () => {}, // x-test.render()
        () => {
          expect(num).to.equal(1);
          props(elem, { ref: null });
          expect(num).to.equal(1);
          done();
        }
      );
    });
  });
}

describe('vdom/ref', () => {
  test('normal elements', 'div');

  test('custom elements', define(class extends Component {
    renderCallback () {
      vdom.element('slot');
    }
  }));

  test('function helpers', (lprops, chren) => {
    vdom.element('div', lprops, chren);
  });

  it('void elements', done => {
    const Elem = define(class extends Component {
      renderCallback () {
        vdom.elementVoid('div', null, null, 'ref', () => done());
      }
    });
    const elem = new Elem();
    fixture(elem);
  });
});
