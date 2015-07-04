import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import helpers from '../lib/helpers';
import skate from '../../src/index';
import typeAttribute from 'skatejs-type-attribute';

describe('lifecycle', function () {
  var MyEl;
  var myEl;
  var tagName;
  var created = false;
  var attached = false;
  var detached = false;

  beforeEach(function () {
    tagName = helpers.safeTagName('my-el');
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
    expect(created).to.equal(true);
    expect(attached).to.equal(false);
    expect(detached).to.equal(false);
  });

  it('should call the attached() callback when the element is attached', function (done) {
    helpers.fixture().appendChild(myEl);
    helpers.afterMutations(function () {
      expect(created).to.equal(true);
      expect(attached).to.equal(true);
      expect(detached).to.equal(false);
      done();
    });
  });

  it('should call the detached() callback when the element is detached', function (done) {
    helpers.fixture().appendChild(myEl);
    helpers.afterMutations(function () {
      helpers.fixture().removeChild(myEl);
      helpers.afterMutations(function () {
        expect(created).to.equal(true);
        expect(attached).to.equal(true);
        expect(detached).to.equal(true);
        done();
      });
    });
  });

  it('should not call the attached() callback when the element is initialised', function () {
    skate.init(myEl);
    expect(created).to.equal(true);
    expect(attached).to.equal(false);
    expect(detached).to.equal(false);
  });
});

describe('unresolved attribute', function () {
  it('should not be considred "resolved" until after template() is called', function () {
    var tagName = helpers.safeTagName('my-element');
    skate(tagName.safe, {
      template: function () {
        expect(this.hasAttribute('unresolved')).to.equal(true);
        expect(this.hasAttribute('resolved')).to.equal(false);
      }
    });

    skate.init(helpers.fixture('<my-element unresolved></my-element>', tagName));
  });

  it('should be considred "resolved" after the created lifecycle finishes', function () {
    var tag = helpers.safeTagName('my-element').safe;
    skate(tag, {
      created: function () {
        expect(this.hasAttribute('unresolved')).to.equal(true, 'should have unresolved');
        expect(this.hasAttribute('resolved')).to.equal(false, 'should not have resolved');
      }
    });

    var element = skate.init(helpers.fixture(`<${tag} unresolved></${tag}>`).children[0]);
    expect(element.hasAttribute('resolved')).to.equal(true, 'should have resolved');
  });
});

describe('lifecycle scenarios', function () {
  var calls;
  var El;

  beforeEach(function () {
    calls = {
      created: 0,
      attached: 0,
      detached: 0
    };

    var { safe: tagName } = helpers.safeTagName('my-element');
    El = skate(tagName, {
      created: function () {
        ++calls.created;
      },
      attached: function () {
        ++calls.attached;
      },
      detached: function () {
        ++calls.detached;
      }
    });
  });

  describe('use the constructor then add it to the DOM', function () {
    beforeEach(function () {
      helpers.fixture(new El());
    });

    it('should call created', function (done) {
      helpers.afterMutations(function () {
        expect(calls.created).to.be.greaterThan(0);
        done();
      });
    });

    it('should call attached', function (done) {
      helpers.afterMutations(function () {
        expect(calls.attached).to.be.greaterThan(0);
        done();
      });
    });
  });

  describe('attached multiple times', function () {
    function expectNumCalls (num, val, done) {
      var el = new El();

      el.textContent = 'gagas';

      helpers.fixture(el);
      helpers.afterMutations(function () {
        helpers.fixture().removeChild(el);
        helpers.afterMutations(function () {
          helpers.fixture(el);
          helpers.afterMutations(function () {
            helpers.fixture().removeChild(el);
            helpers.afterMutations(function () {
              expect(calls[num]).to.equal(val, num);
              done();
            });
          });
        });
      });
    }

    it('should have called created only once', function (done) {
      expectNumCalls('created', 1, done);
    });

    it('should have called attached twice', function (done) {
      expectNumCalls('attached', 2, done);
    });

    it('should have called detached twice', function (done) {
      expectNumCalls('detached', 2, done);
    });
  });

  describe('multiple bindings', function () {
    it('should initialise all bindings', function () {
      var id1 = helpers.safeTagName('my-el');
      var id2 = helpers.safeTagName('my-el');
      var created = 0;
      var attached = 0;
      var def = {
        type: typeAttribute,
        created: function () { ++created; },
        attached: function () { ++attached; }
      };

      skate(id1.safe, def);
      skate(id2.safe, def);

      skate.init(helpers.fixture(`<div ${id1.safe} ${id2.safe}></div>`));
      expect(created).to.equal(2, 'created');
      expect(attached).to.equal(2, 'attached');
    });
  });

  describe('created callback ordering on parent -> descendants', function () {
    var child, descendant, host, num, tag;

    function createDefinitions () {
      skate(`x-host-${tag}`, {
        created () {
          host = ++num;
        }
      });
      skate(`x-child-${tag}`, {
        created () {
          child = ++num;
        }
      });
      skate(`x-descendant-${tag}`, {
        created () {
          descendant = ++num;
        }
      });
    }

    function createStructure () {
      helperFixture(`
        <x-host-${tag}>
          <x-child-${tag}>
            <x-descendant-${tag}></x-descendant-${tag}>
          </x-child-${tag}>
        </x-host-${tag}>
      `);
    }

    beforeEach(function () {
      child = 0;
      descendant = 0;
      host = 0;
      num = 0;
      tag = helperElement().safe;
    });

    it('definition exists before element is created', function (done) {
      createDefinitions();
      createStructure();
      setTimeout(function () {
        expect(num).to.equal(3, 'num');
        expect(host).to.equal(3, 'host');
        expect(child).to.equal(2, 'child');
        expect(descendant).to.equal(1, 'descendant');
        done();
      });
    });

    it('definition exists after element is created', function (done) {
      createStructure();
      createDefinitions();
      setTimeout(function () {
        expect(num).to.equal(3, 'num');
        expect(host).to.equal(3, 'host');
        expect(child).to.equal(2, 'child');
        expect(descendant).to.equal(1, 'descendant');
        done();
      });
    });
  });
});
