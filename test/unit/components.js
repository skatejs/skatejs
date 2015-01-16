'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Using components', function () {
  function assertType (type, shouldEqual, tagToExtend) {
    it('type: ' + type + ' extending: ' + tagToExtend, function () {
      var calls = 0;

      var {'my-element': tagName} = helpers.uniqueTagName('my-element');
      skate(tagName, {
        type: type,
        extends: tagToExtend,
        created: function () {
          ++calls;
        }
      });

      var el1 = document.createElement(tagName);
      skate.init(el1);

      var el2 = document.createElement('div');
      el2.setAttribute('is', tagName);
      skate.init(el2);

      var el3 = document.createElement('div');
      el3.setAttribute(tagName, '');
      skate.init(el3);

      var el4 = document.createElement('div');
      el4.className = tagName;
      skate.init(el4);

      expect(calls).to.equal(shouldEqual);
    });
  }

  describe('tags, attributes and classes', function () {
    assertType(skate.types.TAG, 1);
    assertType(skate.types.ATTR, 1);
    assertType(skate.types.CLASS, 1);
    assertType(skate.types.TAG, 1, 'div');
    assertType(skate.types.ATTR, 1, 'div');
    assertType(skate.types.CLASS, 1, 'div');
    assertType(skate.types.TAG, 0, 'non-existent');
    assertType(skate.types.ATTR, 0, 'non-existent');
    assertType(skate.types.CLASS, 0, 'non-existent');


    it('should not initialise a single component more than once on a single element', function () {
      var calls = 0;

      var {'my-element': tagName} = helpers.uniqueTagName('my-element');
      skate(tagName, {
        created: function () {
          ++calls;
        }
      });

      var el = document.createElement(tagName);
      el.setAttribute(tagName, '');
      el.className = tagName;
      skate.init(el);

      expect(calls).to.equal(1);
    });
  });
});
