
import { IncrementalDOM as VdomIncrementalDOM } from '../src/vdom';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});
