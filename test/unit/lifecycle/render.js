import afterMutations from '../../lib/after-mutations';
import elem from '../../lib/element';
import fixture from '../../lib/fixture';

describe('lifecycle/render', () => {
  it('should be called', done => {
    let called = false;
    fixture(new (elem().skate({
      render () {
        called = true;
      }
    })));
    afterMutations(
      () => expect(called).to.equal(true),
      done
    );
  });

  it('should get called after created()', done => {
    let called = [];
    fixture(new (elem().skate({
      created () {
        called.push('created');
      },
      render () {
        called.push('render');
      }
    })));
    afterMutations(
      () => expect(called[0]).to.equal('created'),
      () => expect(called[1]).to.equal('render'),
      done
    );
  });

  it('should get called before descendants are initialised', done => {
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
});
