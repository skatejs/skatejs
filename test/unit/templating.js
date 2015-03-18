'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Templates', function () {
  it('should execute the template function before created is called', function () {
    var {safe: tagName} = helpers.safeTagName('my-el');
    var MyEl = skate(tagName, {
      created: function (element) {
        expect(element.textContent).to.equal('test');
      },

      template: function (element) {
        element.textContent = 'test';
      }
    });

    new MyEl();
  });

  it('should have access to the extended prototype in the template function', function () {
    var {safe: tagName} = helpers.safeTagName('my-el');
    var MyEl = skate(tagName, {
      prototype: {
        myfunc: function () {}
      },

      template: function (element) {
        expect(element.myfunc).to.be.a('function');
      }
    });

    new MyEl();
  });
});
