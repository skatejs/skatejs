import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import helperReady from '../../lib/ready';
import skate from '../../../src/index';

describe('lifecycle/created ordering parent -> descendants', function () {
  var child, descendant, host, num, tag;

  // Simulate creating definitions in dependency order. This emulates having
  // separate modules for each definition and each definition importing their
  // dependencies that they require be upgraded by the time it is upgraded.
  function createDefinitions () {
    // child requires descendant, so this is first
    skate(`x-descendant-${tag}`, {
      prototype: {
        createdCallback () {
          descendant = ++num;
        }
      }
    });

    // host requires child, so this is second
    skate(`x-child-${tag}`, {
      prototype: {
        createdCallback () {
          child = ++num;
        }
      }
    });

    // host has no dependants so it's last
    skate(`x-host-${tag}`, {
      prototype: {
        createdCallback () {
          host = ++num;
        }
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
      expect(host).to.equal(1, 'host');
      expect(child).to.equal(2, 'child');
      expect(descendant).to.equal(3, 'descendant');
      done();
    });
  });

  it('definition exists after element is created', function (done) {
    createStructure();
    createDefinitions();
    helperReady(function () {
      expect(num).to.equal(3, 'num');
      expect(host).to.equal(1, 'host');
      expect(child).to.equal(2, 'child');
      expect(descendant).to.equal(3, 'descendant');
      done();
    });
  });
});
