import { define, Component } from '../../../src';

describe('api/Component', () => {
  if (!Object.setPrototypeOf) {
    return;
  }

  describe('id', () => {
    it('should not be defined before registration', () => {
      class Test extends Component {}
      expect(Test.id).to.equal(null);
    });

    it('should be defined after registration', () => {
      class Test extends Component {}
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
      const Test = define('x-test', class extends Component {});
      expect(Test.uniqueId).to.equal((new Test()).tagName.toLowerCase());
    });
  });
});
