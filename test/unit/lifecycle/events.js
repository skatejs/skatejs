import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

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
    skate.emit(myEl, 'test');
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
    skate.emit(myEl.children[0], 'test');
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
    skate.emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate event selectors', function () {
    skate(tag.safe, {
      events: {
        test (e) {
          increment();
          expect(this.tagName).to.equal(tag.safe.toUpperCase(), 'test');
          expect(e.target.tagName).to.equal('SPAN', 'test');
          expect(e.currentTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test');
        },
        'test a' (e) {
          increment();
          expect(this.tagName).to.equal(tag.safe.toUpperCase(), 'test a');
          expect(e.target.tagName).to.equal('SPAN', 'test a');
          expect(e.currentTarget.tagName).to.equal('A', 'test a');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test a');
        },
        'test span' (e) {
          increment();
          expect(this.tagName).to.equal(tag.safe.toUpperCase(), 'test span');
          expect(e.target.tagName).to.equal('SPAN', 'test span');
          expect(e.currentTarget.tagName).to.equal('SPAN', 'test span');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test span');
        }
      }
    });

    const frag = skate.fragment(`<${tag.safe}><a><span></span></a></${tag.safe}>`);
    skate.emit(frag.querySelector('span'), 'test');
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
          skate.emit(this.querySelector('input'), 'blur');
        },
        focus: function () {
          skate.emit(this.querySelector('input'), 'focus');
        }
      }
    });

    var inst = helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName);
    skate.init(inst);

    inst.blur();
    expect(blur).to.equal(true);

    inst.focus();
    expect(focus).to.equal(true);
  });
});
