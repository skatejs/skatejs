'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/index';

describe('Using components', function () {
  function assertType (type, shouldEqual, tagToExtend) {
    it('type: ' + type + ' extending: ' + tagToExtend, function () {
      var calls = 0;
      var callsPerCreationType = {};
      var {safe: tagName} = helpers.safeTagName('my-element');
      skate(tagName, {
        type: type,
        extends: tagToExtend,
        created: function () {
          ++calls;
        }
      });

      var el1 = document.createElement(tagName);
      skate.init(el1);
      callsPerCreationType[`<${tagName}>`] = calls;

      var el2 = document.createElement('div', tagName);
      skate.init(el2);
      callsPerCreationType[`<div is="${tagName}">`] = calls;

      var el3 = document.createElement('div');
      el3.setAttribute(tagName, '');
      skate.init(el3);
      callsPerCreationType[`<div ${tagName}>`] = calls;

      var el4 = document.createElement('div');
      el4.className = tagName;
      skate.init(el4);
      callsPerCreationType[`<div class="${tagName}">`] = calls;

      expect(calls).to.equal(shouldEqual, Object.keys(callsPerCreationType).map(function (item) {
        return `${item}: ${callsPerCreationType[item]}`;
      }).join('\n') + '\nOutcome');
    });
  }

  describe('tags, attributes and classes', function () {
    assertType(skate.type.ELEMENT, 1);
    assertType(skate.type.ATTRIBUTE, 1);
    assertType(skate.type.CLASSNAME, 1);
    assertType(skate.type.ELEMENT, 1, 'div');
    assertType(skate.type.ATTRIBUTE, 1, 'div');
    assertType(skate.type.CLASSNAME, 1, 'div');
    assertType(skate.type.ELEMENT, 0, 'span');
    assertType(skate.type.ATTRIBUTE, 0, 'span');
    assertType(skate.type.CLASSNAME, 0, 'span');


    it('should not initialise a single component more than once on a single element', function () {
      var calls = 0;

      var {safe: tagName} = helpers.safeTagName('my-element');
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
