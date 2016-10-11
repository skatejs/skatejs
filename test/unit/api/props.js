import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import { props } from '../../../src/index';

describe('api/props', () => {
  let elem;

  beforeEach(done => {
    elem = new (element().skate({
      props: {
        prop1: {
          initial: 'test1',
        },
        prop2: {
          initial: 'test2',
        },
        prop3: {
          default: undefined,
        },
      },
      created(el) {
        el._rendered = 0;
      },
      render(el) {
        el._rendered++;
      },
    }));
    fixture(elem);
    afterMutations(done);
  });

  describe('getting', () => {
    it('should return only properties defined as props', () => {
      const curr = props(elem);

      expect(curr.prop1).to.equal('test1');
      expect(curr.prop2).to.equal('test2');
      expect('prop3' in curr).to.equal(true);
      expect(curr.undeclaredProp).to.equal(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', () => {
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2',
        undeclaredProp: 'updated3',
      });
      expect(elem.prop1).to.equal('updated1');
      expect(elem.prop2).to.equal('updated2');
      expect(elem.undeclaredProp).to.equal('updated3');
    });

    it('should synchronously render if declared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { prop1: 'updated1' });
      expect(elem._rendered).to.equal(2);
    });

    it('should synchronously render once when multiple props are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2'
      });
      expect(elem._rendered).to.equal(2);
    });

    it('should not render if undeclared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { undeclaredProp: 'updated3' });
      expect(elem._rendered).to.equal(1);
    });

    it('should succeed on an uninitialised element', () => {
      const elem = element().create();
      props(elem, { undeclaredProp: 'foo' });
      expect(elem).property('undeclaredProp', 'foo');
    })
  });
});
