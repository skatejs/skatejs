import * as IncrementalDOM from 'incremental-dom';
import element from '../../lib/element';
import { symbols, vdom } from '../../../src/index';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    // Virtual element functions exposed directly from Incremental DOM.
    expect(vdom.attr).to.equal(IncrementalDOM.attr);
    expect(vdom.elementClose).to.equal(IncrementalDOM.elementClose);
    expect(vdom.elementOpenEnd).to.equal(IncrementalDOM.elementOpenEnd);
    expect(vdom.text).to.equal(IncrementalDOM.text);

    // Virtual element functions overridden by our vdom module.
    // Ensure they're functions.
    expect(vdom.elementOpen).to.be.a('function');
    expect(vdom.elementOpen).not.to.equal(IncrementalDOM.elementOpen);
    expect(vdom.elementOpenStart).to.be.a('function');

    // Ensure they're not the same as Incremental DOM's implementation.
    expect(vdom.elementOpenStart).not.to.equal(IncrementalDOM.elementOpenStart);
    expect(vdom.elementVoid).to.be.a('function');
    expect(vdom.elementVoid).not.to.equal(IncrementalDOM.elementVoid);
  });
});

describe('VdomIncrementalDOM', function () {
  describe('attributes (default)', function () {
    it('should not set properties on SVG elements', function () {
      expect(function () {
        new (element().skate({
          render () {
            vdom.element('svg', { height: 100 });
          },
        }));
      }).to.not.throw(Error);
    });

    it('should set built-in event handlers as properties', function () {
      const onclick = function () {};
      const elem = new (element().skate({
        render () {
          vdom.element('div', { onclick });
        },
      }));
      expect(elem[symbols.$shadowRoot].firstElementChild.onclick).to.equal(onclick);
    });
  });
});
