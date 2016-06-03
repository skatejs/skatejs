import afterMutations from '../lib/after-mutations';
import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import skate, { ready } from '../../src/index';

describe('lifecycle', function () {
  var MyEl;
  var myEl;
  var tagName;
  var created = false;
  var attached = false;
  var detached = false;

  beforeEach(function () {
    tagName = helperElement('my-el');
    created = false;
    attached = false;
    detached = false;
    MyEl = skate(tagName.safe, {
      created: function () {
        created = true;
      },
      attached: function () {
        attached = true;
      },
      detached: function () {
        detached = true;
      }
    });
    myEl = new MyEl();
  });

  it('should call the created() callback when the element is created', function () {
    expect(created).to.equal(true, 'created');
    expect(attached).to.equal(false, 'attached');
    expect(detached).to.equal(false, 'detached');
  });

  it('should call the attached() callback when the element is attached', function (done) {
    helperFixture().appendChild(myEl);
    afterMutations(
      () => expect(created).to.equal(true, 'created'),
      () => expect(attached).to.equal(true, 'attached'),
      () => expect(detached).to.equal(false, 'detached'),
      done
    );
  });

  it('should call the detached() callback when the element is detached', function (done) {
    helperFixture().appendChild(myEl);
    ready(myEl, function () {
      helperFixture().removeChild(myEl);
      afterMutations(
        () => expect(created).to.equal(true, 'created'),
        () => expect(attached).to.equal(true, 'attached'),
        () => expect(detached).to.equal(true, 'detached'),
        done
      );
    });
  });
});

describe('defined attribute', function () {
  it('should not be considered "defined" until after ready() is called', function (done) {
    const tagName = helperElement('my-element');
    skate(tagName.safe, {
      ready (elem) {
        expect(elem.hasAttribute('defined')).to.equal(false);
        done();
      }
    });
    helperFixture('<my-element></my-element>', tagName);
  });

  it('should be considred "defined" after the created lifecycle finishes', function (done) {
    const tag = helperElement('my-element').safe;
    skate(tag, {
      created (elem) {
        expect(elem.hasAttribute('defined')).to.equal(false, 'should not have resolved');
      },
      attached (elem) {
        expect(elem.hasAttribute('defined')).to.equal(true, 'should have defined');
        done();
      }
    });
    helperFixture(`<${tag}></${tag}>`);
  });
});
