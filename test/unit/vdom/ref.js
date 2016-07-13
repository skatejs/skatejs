import { define, vdom } from '../../../src/index';

describe.only('vdom/ref', () => {
  function create(ref) {
    const Elem = define('x-test', {
      render() {
        vdom.element('div', { ref, id: 'test' });
      }
    });
    return new Elem();
  }

  it('can be a function', done => {
    create(node => {
      expect(node.tagName).to.equal('DIV');
      expect(node.id).to.equal('test');
      done();
    });
  });
});
