'use strict';

import helperElement from '../lib/element';
import skate from '../../src/index';

describe('Templates', function () {
  it('should execute the template function before created is called', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      created: function () {
        expect(this.textContent).to.equal('test');
      },

      template: function () {
        this.textContent = 'test';
      }
    });

    new MyEl();
  });

  it('should have access to the extended prototype in the template function', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      prototype: {
        myfunc: function () {}
      },

      template: function () {
        expect(this.myfunc).to.be.a('function');
      }
    });

    new MyEl();
  });
});
