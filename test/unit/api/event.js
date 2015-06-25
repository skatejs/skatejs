import emit from '../../../src/api/emit';
import helpers from '../../lib/helpers';
import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

describe('api/event', function () {
  var numTriggered;
  var tag;

  function increment () {
    ++numTriggered;
  }

  beforeEach(function () {
    numTriggered = 0;
    tag = helperElement();
  });

  it('events on own element', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    skate.emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on child elements', function () {
    skate(tag.safe, {
      events: {
        'test > *': increment
      }
    });

    var myEl = tag.create();
    myEl.appendChild(document.createElement('span'));
    skate.emit(myEl.children[0], 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on descendant elements', function () {
    skate(tag.safe, {
      events: {
        'test *': increment
      }
    });

    var myEl = tag.create();
    myEl.appendChild(document.createElement('span'));
    skate.emit(myEl.children[0], 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should allow you to re-add the element back into the DOM', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    document.body.appendChild(myEl);
    var par = myEl.parentNode;

    par.removeChild(myEl);
    par.appendChild(myEl);
    helpers.dispatchEvent('test', myEl);
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate events', function () {
    skate(tag.safe, {
      events: {
        'test a': function (e) {
          increment();
          expect(this.tagName).to.equal(tag.safe.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
          expect(e.currentTarget.tagName).to.equal(tag.safe.toUpperCase());
          expect(e.delegateTarget.tagName).to.equal('A');
        },
        'test span': function (e) {
          increment();
          expect(this.tagName).to.equal(tag.safe.toUpperCase());
          expect(e.target.tagName).to.equal('SPAN');
          expect(e.currentTarget.tagName).to.equal(tag.safe.toUpperCase());
          expect(e.delegateTarget.tagName).to.equal('SPAN');
        }
      }
    });

    var inst = skate.create(`<${tag.safe}><a><span></span></a></${tag.safe}>`);
    helperFixture(inst);
    skate.init(inst);
    skate.emit(inst.querySelector('span'), 'test');
    expect(numTriggered).to.equal(2);
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
