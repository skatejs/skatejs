import afterMutations from '../../lib/after-mutations';
import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import { define, emit, ready, symbols, vdom } from '../../../src/index';

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
    define(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on child elements', function () {
    define(tag.safe, {
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
    define(tag.safe, {
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
    define(tag.safe, {
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

  it('should support delegate event selectors', function (done) {
    const elem = new (helperElement().skate({
      events: {
        test (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test -> elem.tagName');
          expect(e.currentTarget.tagName).to.equal(el.tagName, 'test -> e.currentTarget');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test -> e.delegateTarget');
        },
        'test a' (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test a -> elem.tagName');
          expect(e.currentTarget.tagName).to.equal('A', 'test a -> e.currentTarget');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test a -> e.delegateTarget');
        },
        'test span' (el, e) {
          increment();
          expect(elem.tagName).to.equal(el.tagName, 'test span -> elem.tagName');
          expect(e.currentTarget.tagName).to.equal('SPAN', 'test span -> e.currentTarget');
          expect(e.delegateTarget.tagName).to.equal(el.tagName, 'test span -> e.delegateTarget');
        },
        'test .should-not-trigger' () {
          increment();
        }
      },
      render () {
        vdom.element('a', vdom.element.bind(null, 'span'));
      }
    }));

    helperFixture(elem);
    afterMutations(
      () => emit(elem[symbols.shadowRoot].querySelector('span'), 'test'),
      () => expect(numTriggered).to.equal(3),
      done
    );
  });

  it('should support delegate blur and focus events', function (done) {
    var blur = false;
    var focus = false;
    var { safe: tagName } = helperElement('my-component');

    define(tagName, {
      events: {
        'blur input': () => blur = true,
        'focus input': () => focus = true
      },
      prototype: {
        blur () {
          emit(this[symbols.shadowRoot].querySelector('input'), 'blur');
        },
        focus () {
          emit(this[symbols.shadowRoot].querySelector('input'), 'focus');
        }
      },
      render () {
        vdom.element('input');
      }
    });

    var inst = helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName);

    ready(inst, function () {
      inst.blur();
      expect(blur).to.equal(true, 'blur');

      inst.focus();
      expect(focus).to.equal(true, 'focus');

      done();
    });
  });
});
