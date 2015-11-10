import elem from '../../lib/element';
import skate from '../../../src/index';

describe('lifecycle/render', function () {
  it('should be called', function () {
    let called = false;
    elem().skate({
      render () {
        called = true;
      }
    })();
    expect(called).to.equal(true);
  });

  it('should get called after created()', function () {
    let called = [];
    elem().skate({
      created () {
        called.push('created');
      },
      render () {
        called.push('render');
      }
    })();
    expect(called[0]).to.equal('created');
    expect(called[1]).to.equal('render');
  });

  it('should get called before descendants are initialised', function () {
    let called = [];
    let elem1 = elem();
    let elem2 = elem();
    elem1.skate({
      render () {
        called.push('elem1');
      }
    });
    elem2.skate({
      created () {
        called.push('elem2');
      }
    });
    skate.fragment(`<${elem1.safe}><${elem2.safe}></${elem2.safe}></${elem1.safe}>`);
    expect(called[0]).to.equal('elem1');
    expect(called[1]).to.equal('elem2');
  });

  it('should get called before ready', function () {
    let called = [];
    elem().skate({
      render () {
        called.push('render');
      },
      ready () {
        called.push('ready');
      }
    })();
    expect(called[0]).to.equal('render');
    expect(called[1]).to.equal('ready');
  });

  it('should not get called if the resolved attribute is already on the element', function () {
    let called = false;
    let el = elem();
    el.skate({ render: () => called = true });
    skate.fragment(`<${el.safe} resolved></${el.safe}>`);
    expect(called).to.equal(false);
  });
});
