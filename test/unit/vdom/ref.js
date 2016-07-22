import { define, prop, state, vdom } from '../../../src/index';

describe('vdom/ref', () => {
  function create(ref) {
    const Elem = define('x-test', {
      props: {
        num: prop.number(),
        ref: { initial: () => ref },
      },
      render(elem) {
        vdom.element('div', { ref: elem.ref, id: 'div' }, () => 
          vdom.element('span', { id: 'span' }, 'test')
        );
      },
    });
    return new Elem();
  }

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

  it('should be called on every re-render', () => {
    let num = 0;
    const elem = create(() => ++num);
    expect(num).to.equal(1);
    state(elem, { num: num + 1 });
    expect(num).to.equal(2);
    state(elem, { num: num + 1 });
    expect(num).to.equal(3);
  });

  it('should call a different ref if changed', () => {
    let ref1, ref2;
    const elem = create(() => ref1 = true);
    expect(ref1).to.equal(true);
    expect(ref2).to.equal(undefined);
    state(elem, { ref: () => ref2 = true });
    expect(ref1).to.equal(true);
    expect(ref2).to.equal(true);
  });

  it('should not call a removed ref', () => {
    let num = 0;
    const elem = create(() => ++num);
    expect(num).to.equal(1);
    state(elem, { ref: null });
    expect(num).to.equal(1);
  });
});
