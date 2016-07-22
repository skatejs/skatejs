import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { state } from '../../../src/index';

describe('api/state', function () {
  let elem;

  beforeEach(done => {
    elem = new (element().skate({
      props: {
        prop1: {
          initial: 'test1'
        },
        prop2: {
          initial: 'test2'
        }
      },
      created(elem) {
        elem._rendered = 0;
      },
      render(elem) {
        elem._rendered++;
      }
    }));
    fixture(elem);
    afterMutations(done);
  });

  it('getting', () => {
    it('should return only defined properties', function () {
      const curr = state(elem);
      expect(curr.prop1).to.equal('test1');
      expect(curr.prop2).to.equal('test2');
      expect(curr.undeclaredProp).to.equal(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', function () {
      state(elem, {
        prop1: 'updated1',
        prop2: 'updated2',
        undeclaredProp: 'updated3'
      });
      expect(elem.prop1).to.equal('updated1');
      expect(elem.prop2).to.equal('updated2');
      expect(elem.undeclaredProp).to.equal('updated3');
    });

    it('should synchronously render if declared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      state(elem, { prop1: 'updated1' });
      expect(elem._rendered).to.equal(2);
    });

    it('should not render if undeclared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      state(elem, { undeclaredProp: 'updated3' });
      expect(elem._rendered).to.equal(1);
    });
  });
});
