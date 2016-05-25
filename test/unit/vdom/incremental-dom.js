import { IncrementalDOM as VdomIncrementalDOM } from '../../../src/api/vdom';
import * as IncrementalDOM from 'incremental-dom';

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});
