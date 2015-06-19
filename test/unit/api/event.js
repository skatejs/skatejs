import emit from '../../../src/api/emit';
import helpers from '../../lib/helpers';
import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('api/event', function () {
  it('should bind events', function () {
    var numTriggered = 0;
    var tagName = helpers.safeTagName('my-el');
    var MyEl = skate(tagName.safe, {
      events: {
        test: function () {
          ++numTriggered;
        }
      }
    });

    var myEl = new MyEl();

    skate.emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should bind to the component element', function () {
    var numTriggered = 0;
    var tagName = helpers.safeTagName('my-el');
    var events = {};
    var MyEl;

    events[`test ${tagName.safe}`] = function () {
      ++numTriggered;
    };

    MyEl = skate(tagName.safe, {
      events: events
    });

    var myEl = new MyEl();
    helpers.dispatchEvent('test', myEl);
    expect(numTriggered).to.equal(1);
  });

  it('should allow you to re-add the element back into the DOM', function () {
    var numTriggered = 0;
    var tagName = helpers.safeTagName('my-el');
    var MyEl = skate(tagName.safe, {
      events: {
        test: function () {
          ++numTriggered;
        }
      }
    });

    var myEl = new MyEl();
    document.body.appendChild(myEl);
    var par = myEl.parentNode;

    par.removeChild(myEl);
    par.appendChild(myEl);
    helpers.dispatchEvent('test', myEl);
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate events', function () {
    var dispatched = 0;
    var { safe: tagName } = helpers.safeTagName('my-component');

    skate(tagName, {
      events: {
        'click': function (e) {
          ++dispatched;
          expect(this.tagName).to.equal(tagName.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
          expect(e.currentTarget.tagName).to.equal(tagName.toUpperCase());
          expect(e.delegateTarget.tagName).to.equal(tagName.toUpperCase());
        },
        'click a': function (e) {
          ++dispatched;
          expect(this.tagName).to.equal(tagName.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
          expect(e.currentTarget.tagName).to.equal(tagName.toUpperCase());
          expect(e.delegateTarget.tagName).to.equal('A');
        },
        'click span': function (e) {
          ++dispatched;
          expect(this.tagName).to.equal(tagName.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
          expect(e.currentTarget.tagName).to.equal(tagName.toUpperCase());
          expect(e.delegateTarget.tagName).to.equal('SPAN');
        }
      },

      template: function () {
        this.innerHTML = '<a><span></span></a>';
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

      template: function () {
        this.innerHTML = '<input>';
      }
    });

    var inst = skate.init(helpers.fixture(`<${tagName}></${tagName}>`).querySelector(tagName));

    inst.blur();
    expect(blur).to.equal(true);

    inst.focus();
    expect(focus).to.equal(true);
  });

  it('should support an array of event handlers for a given key', function () {
    var increment = function () { ++calledNum; };
    var calledNum = 0;
    var safe = helperElement();

    skate(safe.safe, {
      events: {
        test: [
          increment,
          increment
        ]
      }
    });

    var el = safe.create();
    emit(el, 'test');
    expect(calledNum).to.equal(2);
  });
});
