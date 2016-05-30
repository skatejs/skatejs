import element from '../../lib/element';
import { state } from '../../../src/index';

describe('api/state', function () {
  function create () {
    return element().skate({
      props: {
        prop1: {
          initial: 'test1'
        },
        prop2: {
          initial: 'test2'
        },
        rendered: {
          default: 0
        }
      },
      render (elem) {
        elem.rendered++;
      }
    })();
  }

  it('should return only defined properties', function () {
    const curr = state(create());
    expect(curr.prop1).to.equal('test1');
    expect(curr.prop2).to.equal('test2');
  });

  it('should set all properties', function () {
    const elem = create();
    state(elem, {
      prop1: 'updated1',
      prop2: 'updated2',
      undeclaredProp: 'updated3'
    });
    expect(elem.prop1).to.equal('updated1');
    expect(elem.prop2).to.equal('updated2');
    expect(elem.undeclaredProp).to.equal('updated3');
  });

  it('should synchronously render a component', function () {
    const elem = create();
    expect(elem.rendered).to.equal(1);
    state(elem, { prop1: 'updated1' });
    expect(elem.rendered).to.equal(2);
  });
});
