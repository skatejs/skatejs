import afterMutations from '../../lib/after-mutations';
import elem from '../../lib/element';
import fixture from '../../lib/fixture';

describe('lifecycle/render', function () {
  it('should be called', function () {
    let called = false;
    new (elem().skate({
      render () {
        called = true;
      }
    }));
    expect(called).to.equal(true);
  });

  it('should get called after created()', function () {
    let called = [];
    new (elem().skate({
      created () {
        called.push('created');
      },
      render () {
        called.push('render');
      }
    }));
    expect(called[0]).to.equal('created');
    expect(called[1]).to.equal('render');
  });

  it('should get called before descendants are initialised', function (done) {
    const called = [];
    const elem1 = elem();
    const elem2 = elem();

    elem1.skate({
      created () {
        called.push('elem1');
      }
    });
    elem2.skate({
      created () {
        called.push('elem2');
      }
    });

    fixture(`<${elem1.safe}><${elem2.safe}></${elem2.safe}></${elem1.safe}>`);
    afterMutations(
      () => expect(called[0]).to.equal('elem1'),
      () => expect(called[1]).to.equal('elem2'),
      done
    );
  });

  it('should get called before ready', function () {
    let called = [];
    new (elem().skate({
      render () {
        called.push('render');
      },
      ready () {
        called.push('ready');
      }
    }));
    expect(called[0]).to.equal('render');
    expect(called[1]).to.equal('ready');
  });

  it('should not get called if the rendered attribute is already on the element', function () {
    let called = false;
    let el = elem();
    el.skate({ render: () => called = true });
    fixture(`<${el.safe} rendered></${el.safe}>`);
    expect(called).to.equal(false);
  });
});
