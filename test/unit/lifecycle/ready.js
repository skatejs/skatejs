import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import helperReady from '../../lib/ready';
import skate from '../../../src/index';

describe('lifecycle/ready', function () {
  var tag;

  beforeEach(function () {
    tag = helperElement();
    skate(tag.safe, {
      ready: function (elem) {
        elem.innerHTML = 'templated';
      }
    });
  });

  it('should be called', function () {
    var el = tag.create();
    expect(el.textContent).to.equal('templated');
  });

  it('should be called after created is called', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      created: function (elem) {
        elem.textContent = 'test';
      },
      ready: function (elem) {
        expect(elem.textContent).to.equal('test');
      }
    });

    new MyEl();
  });

  it('should have access to the extended prototype', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      prototype: {
        myfunc: function () {}
      },
      ready: function (elem) {
        expect(elem.myfunc).to.be.a('function');
      }
    });

    new MyEl();
  });

  describe('ordering parent -> descendants', function () {
    var child, descendant, host, num, tag;

    // Simulate creating definitions in dependency order. This emulates having
    // separate modules for each definition and each definition importing their
    // dependencies that they require be upgraded by the time it is upgraded.
    function createDefinitions () {
      // child requires descendant, so this is first
      skate(`x-descendant-${tag}`, {
        ready () {
          descendant = ++num;
        }
      });

      // host requires child, so this is second
      skate(`x-child-${tag}`, {
        ready () {
          child = ++num;
        }
      });

      // host has no dependants so it's last
      skate(`x-host-${tag}`, {
        ready () {
          host = ++num;
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
      helperReady(function () {
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
      helperReady(function () {
        expect(num).to.equal(3, 'num');
        expect(host).to.equal(3, 'host');
        expect(child).to.equal(2, 'child');
        expect(descendant).to.equal(1, 'descendant');
        done();
      });
    });
  });
});
