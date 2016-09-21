import { Component } from '../../../src';

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
});