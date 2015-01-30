'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Events', function () {
  it('should bind events', function () {
    var numTriggered = 0;
    var Div = skate('div', {
      events: {
        test: function () {
          ++numTriggered;
        }
      }
    });

    var div = new Div();

    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should bind to the component element', function () {
    var numTriggered = 0;
    var Div = skate('div', {
      events: {
        'test div' : function () {
          ++numTriggered;
        }
      }
    });

    var div = new Div();

    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should allow you to re-add the element back into the DOM', function () {
    var numTriggered = 0;
    var Div = skate('div', {
      events: {
        test: function () {
          ++numTriggered;
        }
      }
    });

    var div = new Div();
    document.body.appendChild(div);
    var par = div.parentNode;

    par.removeChild(div);
    par.appendChild(div);
    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate events', function () {
    var dispatched = 0;
    var { safe: tagName } = helpers.safeTagName('my-component');

    skate(tagName, {
      events: {
        'click': function (element, e) {
          ++dispatched;
          expect(element.tagName).to.equal(tagName.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
        },

        'click a': function (element, e, current) {
          ++dispatched;
          expect(element.tagName).to.equal(tagName.toUpperCase());
          expect(current.tagName).to.equal('A');
          expect(e.target.tagName).to.equal('SPAN');
        },
        'click span': function (element, e) {
          ++dispatched;
          expect(element.tagName).to.equal(tagName.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
        }
      },

      template: function (element) {
        element.innerHTML = '<a><span></span></a>';
      }
    });

    var inst = helpers.fixture(`<${tagName}></${tagName}>`).querySelector(tagName);

    skate.init(inst);
    helpers.dispatchEvent('click', inst.querySelector('span'));
    expect(dispatched).to.equal(3);
  });

  it('should support delegate blur and focus events', function () {
    var blur = false;
    var focus = false;
    var { safe: tagName } = helpers.safeTagName('my-component');

    skate(tagName, {
      events: {
        'blur input': function () {
          blur = true;
        },

        'focus input': function () {
          focus = true;
        }
      },

      prototype: {
        blur: function () {
          helpers.dispatchEvent('blur', this.querySelector('input'));
        },

        focus: function () {
          helpers.dispatchEvent('focus', this.querySelector('input'));
        }
      },

      template: function (element) {
        element.innerHTML = '<input>';
      }
    });

    var inst = skate.init(helpers.fixture(`<${tagName}></${tagName}>`).querySelector(tagName));

    inst.blur();
    expect(blur).to.equal(true);

    inst.focus();
    expect(focus).to.equal(true);
  });
});
