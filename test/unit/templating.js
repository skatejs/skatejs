import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Templates', function () {
  it('should execute the template function before created is called', function () {
    var MyEl = skate('my-el', {
      created: function (element) {
        expect(element.textContent).to.equal('test');
      },

      template: function (element) {
        element.textContent = 'test';
      }
    });

    var myEl = new MyEl();
  });

  it('should have access to the extended prototype in the template function', function () {
    var MyEl = skate('my-el', {
      prototype: {
        myfunc: function () {}
      },

      template: function (element) {
        expect(element.myfunc).to.be.a('function');
      }
    });

    var myEl = new MyEl();
  })
});
