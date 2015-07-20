import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

describe('created callback ordering on parent -> descendants', function () {
  var child, descendant, host, num, tag;

  function createDefinitions () {
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
    skate(`x-host-${tag}`, {
      created () {
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
    setTimeout(function () {
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
    setTimeout(function () {
      expect(num).to.equal(3, 'num');
      expect(host).to.equal(3, 'host');
      expect(child).to.equal(1, 'child');
      expect(descendant).to.equal(2, 'descendant');
      done();
    });
  });
});
