import { IncrementalDOM as VdomIncrementalDOM } from '../../../src/api/vdom';

const { IncrementalDOM } = window;

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});
