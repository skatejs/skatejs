import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate, { emit, init, symbols, vdom } from '../../../src/index';

describe('lifecycle/events', function () {
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
    emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on child elements', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    helperFixture(myEl);
    myEl.appendChild(document.createElement('span'));
    emit(myEl.children[0], 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on descendant elements', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    helperFixture(myEl);
    myEl.appendChild(document.createElement('span'));
    emit(myEl.children[0], 'test');
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
    emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate event selectors', function () {
    const elem = helperElement().skate({
      events: {
        test (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test');
          expect(e.target.tagName).to.equal('SPAN', 'test');
          expect(e.currentTarget.tagName).to.equal(el.tagName, 'test');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test');
        },
        'test a' (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test a');
          expect(e.target.tagName).to.equal('SPAN', 'test a');
          expect(e.currentTarget.tagName).to.equal('A', 'test a');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test a');
        },
        'test span' (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test span');
          expect(e.target.tagName).to.equal('SPAN', 'test span');
          expect(e.currentTarget.tagName).to.equal('SPAN', 'test span');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test span');
        }
      }
    })();

    elem.innerHTML = '<a><span></span></a>';
    helperFixture(elem);
    init(elem);
    emit(elem.querySelector('span'), 'test');
    expect(numTriggered).to.equal(3);
  });

  it('should support delegate blur and focus events', function () {
    var blur = false;
    var focus = false;
    var { safe: tagName } = helperElement('my-component');

    skate(tagName, {
      created: function (elem) {
        elem.innerHTML = '<input>';
      },
      events: {
        'blur input': () => blur = true,
        'focus input': () => focus = true
      },
      prototype: {
        blur: function () {
          emit(this.querySelector('input'), 'blur');
        },
        focus: function () {
          emit(this.querySelector('input'), 'focus');
        }
      }
    });

    var inst = helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName);
    init(inst);

    inst.blur();
    expect(blur).to.equal(true);

    inst.focus();
    expect(focus).to.equal(true);
  });
});
