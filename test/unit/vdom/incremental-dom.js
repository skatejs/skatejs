import { IncrementalDOM as VdomIncrementalDOM } from '../../../src/api/vdom';
import * as IncrementalDOM from 'incremental-dom';
import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});

describe('VdomIncrementalDOM', function () {
  describe('attributes (default)', function () {
    it('should not set properties on SVG elements', function () {
      // This should throw but the error is different depending on the browser,
      // so we don't expect any particular message.
      element().skate({
        render () {
          vdom('svg', { height: 100 });
        }
      })();
    });

    it('should set built-in event handlers as properties', function () {
      const onclick = function () {};
      const elem = element().skate({
        render () {
          vdom('div', { onclick });
        }
      })();
      expect(elem[symbols.shadowRoot].firstElementChild.onclick).to.equal(onclick);
    });
  });
});
