import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { define, prop, props, vdom } from '../../../src/index';

function test(name, el) {
  function create(ref) {
    const Elem = define('x-test', {
      props: {
        num: prop.number(),
        ref: { initial: () => ref },
      },
      render(elem) {
        vdom.element(el, { ref: elem.ref, id: 'div' }, () =>
          vdom.element('span', { id: 'span' }, 'test')
        );
      },
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

    it('should be called on every re-render', done => {
      let num = 0;
      const elem = create(() => ++num);
      afterMutations(() => {
        expect(num).to.equal(1);
        props(elem, { num: num + 1 });
        expect(num).to.equal(2);
        props(elem, { num: num + 1 });
        expect(num).to.equal(3);
        done();
      });
    });

    it('should call a different ref if changed', done => {
      let ref1;
      let ref2;
      const elem = create(() => {
        ref1 = true;
      });
      afterMutations(() => {
        expect(ref1).to.equal(true);
        expect(ref2).to.equal(undefined);
        props(elem, { ref: () => {
          ref2 = true;
        } });
        expect(ref1).to.equal(true);
        expect(ref2).to.equal(true);
        done();
      });
    });

    it('should not call a removed ref', done => {
      let num = 0;
      const elem = create(() => ++num);
      afterMutations(() => {
        expect(num).to.equal(1);
        props(elem, { ref: null });
        expect(num).to.equal(1);
        done();
      });
    });
  });
}

describe('vdom/ref', () => {
  test('normal elements', 'div');
  test('custom elements', define('x-test', {
    render() {
      vdom.element('slot');
    }
  }));
  test('function helpers', (props, chren) => {
    vdom.element('div', props, chren);
  });
});
