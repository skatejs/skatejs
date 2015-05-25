import bench from '../lib/bench';
import documentObserver from '../../src/polyfill/document-observer';
import helpers from '../lib/helpers';
import nativeCreateElement from '../../src/util/native-create-element';

describe('inserting elements', function () {
  var args;

  function benchFn () {
    var div = this.args.nativeCreateElement('div');
    var fix = this.args.fixture;
    fix.appendChild(div);
    fix.removeChild(div);
  }

  beforeEach(function () {
    args = {
      documentObserver: documentObserver,
      fixture: helpers.fixture(),
      nativeCreateElement: nativeCreateElement
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
