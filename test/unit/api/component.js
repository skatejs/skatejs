/* eslint-env jasmine, mocha */

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
        static get observedAttributes () {
          return ['test'];
        }
      }
      expect(Test.observedAttributes).to.deep.equal(['test']);
    });

    it('props', () => {
      class Test extends Component {
        static get props () {
          return {
            test: { attribute: true }
          };
        }
      }
      expect(Test.props).to.deep.equal({
        test: { attribute: true }
      });
    });

    it('static props is called once', () => {
      let count = 0;
      class Test extends Component {
        static get props () {
          count++;
          return {
            test: { attribute: true }
          };
        }
      }
      define('test-props-called-once', Test);
      const instance = document.createElement('test-props-called-once');
      instance.test = 'Hello';

      const secondInstance = new Test();
      secondInstance.test = 'Hello';
      expect(count).to.equal(1);
    });

  });

  describe('property initialisers', () => {
    it('observedAttributes', () => {
      class Test extends Component {}
      Test.observedAttributes = ['test'];
      expect(Test.observedAttributes).to.deep.equal(['test']);
    });

    it('props', () => {
      class Test extends Component {}
      Component.props = {
        test: { attribute: true }
      };
      expect(Test.props).to.deep.equal({
        test: { attribute: true }
      });
    });
  });

  describe('updated()', () => {
    it('should return true if a prop changes', () => {
      const initialValue = 'hello world!';
      class Test extends Component {
        static get props () {
          return {
            test: {
              attribute: true,
              initial: initialValue
            }
          };
        }
      }

      define('test-updated-function', Test);
      const instance = document.createElement('test-updated-function');
      expect(instance.test).to.equal(initialValue);

      instance.test = 'Hello world!';
      const hasChange = instance.updatedCallback({ test: initialValue });

      expect(hasChange).to.be.true;
    });

    it('should return true if a Symbol() prop has changed', () => {
      const initialValue = 'hello world!';
      const testSymbol = createSymbol('test');
      class Test extends Component {
        static get props () {
          return {
            [testSymbol]: {
              initial: initialValue
            }
          };
        }
      }

      define('test-updated-function-2', Test);
      const instance = document.createElement('test-updated-function-2');
      expect(instance[testSymbol]).to.equal(initialValue);

      instance[testSymbol] = 'Hello world!';
      const hasChange = instance.updatedCallback({ [testSymbol]: initialValue });

      expect(hasChange).to.be.true;
    });
  });
});
