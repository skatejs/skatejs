import { define, Component } from '../../../src';
import { classStaticsInheritance } from '../../lib/support';

describe('api/Component', () => {
  if (!classStaticsInheritance()) {
    return;
  }

  describe('property getters', () => {
    it('observedAttributes', () => {
      class Test extends Component {
        static get observedAttributes() {
          return ['test'];
        }
      };
      expect(Test.observedAttributes).to.deep.equal(['test']);
    });

    it('props', () => {
      class Test extends Component {
        static get props() {
          return {
            test: { attribute: true }
          };
        }
      };
      expect(Test.props).to.deep.equal({
        test: { attribute: true }
      });
    });
  });

  describe('property initialisers', () => {
    it('observedAttributes', () => {
      class Test extends Component {
        static observedAttributes = ['test']
      };
      expect(Test.observedAttributes).to.deep.equal(['test']);
    });

    it('props', () => {
      class Test extends Component {
        static props = {
          test: { attribute: true }
        }
      };
      expect(Test.props).to.deep.equal({
        test: { attribute: true }
      });
    });
  });

  describe('id', () => {
    it('should not be defined before registration', () => {
      class Test extends Component {}
      expect(Test.id).to.equal(null);
    });

    it('should be defined after registration', () => {
      const Test = class Test extends Component {};
      expect(Test.id).to.equal(null);
      define('x-test', Test);
      expect(Test.id).to.equal('x-test');
    });
  });

  describe('uniqueId', () => {
    it('should not be defined before registration', () => {
      class Test extends Component {}
      expect(Test.uniqueId).to.equal(null);
    });

    it('should be defined after registration', () => {
      class Test extends Component {};
      expect(Test.uniqueId).to.equal(null);
      define('x-test', Test);
      expect(Test.uniqueId).to.match(/^x-test/);
    });
  });
});
