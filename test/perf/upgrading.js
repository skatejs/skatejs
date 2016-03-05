import bench from '../lib/bench';
import fixture from '../lib/fixture';
import skate from '../../src/index';

document.registerElement('x-native', {
  prototype: Object.create(HTMLElement.prototype, {})
});

skate('x-skate', {});

describe('upgrading components', function () {
  var args;

  function benchFn (name) {
    return function () {
      var div = document.createElement(name);
      var fix = this.args.fixture;

      // We're actually testing this, but...
      fix.appendChild(div);

      // We must also clean up after the test because if too many elements get
      // inserted into the DOM, then the browser might crash. The test should
      // still accurately measure how much overhead a mutation observer on the
      // document adds, though.
      fix.removeChild(div);
    };
  }

  beforeEach(function () {
    args = {
      fixture: fixture()
    };
  });

  bench('document.registerElement()', function () {
    return {
      args: args,
      fn: benchFn('x-native')
    };
  });

  bench('skate', function () {
    return {
      args: args,
      fn: benchFn('x-skate')
    };
  });
});

