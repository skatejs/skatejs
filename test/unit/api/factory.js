import { factory, symbols } from '../../../src/index';

describe('api/factory', function () {
  it('should return a function', function () {
    expect(factory({})).to.be.a('function');
  });

  describe('the returned function', function () {
    function register () {
      return factory({
        created (elem) {
          elem.test = true;
        }
      })('x-factory-test');
    }

    it('should register a constructor for the specified name', function () {
      expect(register({})[symbols.name]).to.equal('x-factory-test');
    });
  });
});
