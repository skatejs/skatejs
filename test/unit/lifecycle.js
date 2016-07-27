import afterMutations from '../lib/after-mutations';
import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import { define, ready } from '../../src/index';

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
    MyEl = define(tagName.safe, {
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
