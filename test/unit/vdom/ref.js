import { define, vdom } from '../../../src/index';

describe('vdom/ref', () => {
  function create(ref) {
    const Elem = define('x-test', {
      render() {
        vdom.element('div', { ref, id: 'div' }, () => vdom.element('span', { id: 'span' }, 'test'));
      }
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
});
