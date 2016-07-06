import * as IncrementalDOM from 'incremental-dom';
import { vdom } from '../../../src/index';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    // Ensure we export the element functions.
    expect(vdom.attr).to.be.a('function');
    expect(vdom.elementClose).to.be.a('function');
    expect(vdom.elementOpenEnd).to.be.a('function');
    expect(vdom.elementOpenStart).to.be.a('function');
    expect(vdom.elementVoid).to.be.a('function');
    expect(vdom.text).to.be.a('function');

    // Ensure they're not the same as Incremental DOM's implementation.
    expect(vdom.attr).not.to.equal(IncrementalDOM.attr);
    expect(vdom.elementClose).not.to.equal(IncrementalDOM.elementClose);
    expect(vdom.elementOpenEnd).not.to.equal(IncrementalDOM.elementOpenEnd);
    expect(vdom.elementOpenStart).not.to.equal(IncrementalDOM.elementOpenStart);
    expect(vdom.elementVoid).not.to.equal(IncrementalDOM.elementVoid);
    expect(vdom.text).not.to.equal(IncrementalDOM.text);
  });
});
