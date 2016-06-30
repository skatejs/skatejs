import { IncrementalDOM as VdomIncrementalDOM } from '../../../src/api/vdom';
import * as IncrementalDOM from 'incremental-dom';
import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    // We override these, so obviously they won't be the same.
    const { attributes, elementOpen, elementOpenStart, elementVoid } = VdomIncrementalDOM;

    // Delete so they don't get compared.
    delete VdomIncrementalDOM.attributes;
    delete VdomIncrementalDOM.elementOpen;
    delete VdomIncrementalDOM.elementOpenStart;
    delete VdomIncrementalDOM.elementVoid;

    // Check same API points.
    expect(IncrementalDOM).to.contain(VdomIncrementalDOM);

    // Ensure overrides are different.
    expect(attributes).not.to.equal(IncrementalDOM.attributes);
    expect(elementOpen).not.to.equal(IncrementalDOM.elementOpen);
    expect(elementOpenStart).not.to.equal(IncrementalDOM.elementOpenStart);
    expect(elementVoid).not.to.equal(IncrementalDOM.elementVoid);
  });
});

describe('VdomIncrementalDOM', function () {
  describe('attributes (default)', function () {
    it('should not set properties on SVG elements', function () {
      expect(function () {
        new (element().skate({
          render () {
            vdom.element('svg', { height: 100 });
          }
        }));
      }).to.not.throw(Error);
    });

    it('should set built-in event handlers as properties', function () {
      const onclick = function () {};
      const elem = new (element().skate({
        render () {
          vdom.element('div', { onclick });
        }
      }));
      expect(elem[symbols.shadowRoot].firstElementChild.onclick).to.equal(onclick);
    });
  });
});
