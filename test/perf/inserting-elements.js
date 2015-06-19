import bench from '../lib/bench';
import documentObserver from '../../src/polyfill/document-observer';
import helpers from '../lib/helpers';

describe('inserting elements', function () {
  var args;

  function benchFn () {
    var div = document.createElement('div');
    var fix = this.args.fixture

    // We're actually testing this, but...
    fix.appendChild(div);

    // We must also clean up after the test because if too many elements get
    // inserted into the DOM, then the browser might crash. The test should
    // still accurately measure how much overhead a mutation observer on the
    // document adds, though.
    fix.removeChild(div);
  }

  beforeEach(function () {
    args = {
      documentObserver: documentObserver,
      fixture: helpers.fixture()
    };
  });

  bench('(no document observer)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.unregister();
      }
    };
  });

  bench('(registered document observer)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.register();
      }
    };
  });
});
