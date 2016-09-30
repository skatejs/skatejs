import { Component, define } from '../../../src';
import { classStaticsInheritance } from '../../lib/support';
import createSymbol from '../../../src/util/create-symbol';

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
        static observedAttributes = ['test'];
      };
      expect(Test.observedAttributes).to.deep.equal(['test']);
    });

    it('props', () => {
      class Test extends Component {
        static props = {
          test: { attribute: true }
        };
      };
      expect(Test.props).to.deep.equal({
        test: { attribute: true }
      });
    });
  });

  describe('updated function', () => {
    it('should return true if a prop changes', () => {
      const initialValue = 'hello world!'
      class Test extends Component {
        static props = {
          test: {
            attribute: true,
            initial: initialValue
          }
        };
      };
      define('test-updated-function', Test);
      const instance = document.createElement('test-updated-function');
      expect(instance.test).to.equal(initialValue);

      instance.test = 'Hello world!';
      const hasChange = Component.updated(instance, { test: initialValue});

      expect(hasChange).to.be.true;
    });

    it('should return true if a Symbol() prop has changed', () => {
      const initialValue = 'hello world!'
      const testSymbol = createSymbol('test');
      class Test extends Component {
        static props = {
          [testSymbol]: {
            initial: initialValue
          }
        };
      };
      define('test-updated-function-2', Test);
      const instance = document.createElement('test-updated-function-2');
      expect(instance[testSymbol]).to.equal(initialValue);

      instance[testSymbol] = 'Hello world!';
      const hasChange = Component.updated(instance, { [testSymbol]: initialValue});

      expect(hasChange).to.be.true;
    });
  });
});
