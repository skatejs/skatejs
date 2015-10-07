import bench from '../lib/bench';
import documentObserver from '../../src/global/document-observer';
import fixture from '../lib/fixture';

describe('inserting elements', function () {
  var args;

  function benchFn () {
    var div = document.createElement('div');
    var fix = this.args.fixture;

    // We're actually testing this, but...
    fix.appendChild(div);

    // We must also clean up after the test because if too many elements get
    // inserted into the DOM, then the browser might crash. The test should
    // still accurately measure how much overhead a mutation observer on the
    // document adds, though.
    fix.removeChild(div);
  }

  function createMutationObservers (num) {
    var obs = [];
    for (let a = 0; a < num; a++) {
      obs.push(new window.MutationObserver(function () {}));
      obs[a].observe(document, {
        childList: true,
        subtree: true
      });
    }
    return obs;
  }

  beforeEach(function () {
    args = {
      createMutationObservers: createMutationObservers,
      documentObserver: documentObserver,
      fixture: fixture()
    };
  });

  bench('(no observers)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.unregister();
      }
    };
  });

  bench('(one mutation observer that does nothing)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.unregister();
        this.mutationObservers = this.args.createMutationObservers(1);
      },
      teardown: function () {
        this.mutationObservers.forEach(obs => obs.disconnect());
      }
    };
  });

  bench('(two mutation observers that do nothing)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.unregister();
        this.mutationObservers = this.args.createMutationObservers(2);
      },
      teardown: function () {
        this.mutationObservers.forEach(obs => obs.disconnect());
      }
    };
  });

  bench('(ten mutation observers that do nothing)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.unregister();
        this.mutationObservers = this.args.createMutationObservers(10);
      },
      teardown: function () {
        this.mutationObservers.forEach(obs => obs.disconnect());
      }
    };
  });

  bench('(skate document observer that interrogates elements)', function () {
    return {
      args: args,
      fn: benchFn,
      setup: function () {
        this.args.documentObserver.register();
      }
    };
  });
});
