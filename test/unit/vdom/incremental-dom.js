import * as IncrementalDOM from 'incremental-dom';
import { vdom } from '../../../src/index';

function testBasicApi (name) {
  describe(name, () => {
    it('should be a function', () => expect(vdom[name]).to.be.a('function'));
    it('should not be the same one as in Incremental DOM', () => expect(vdom[name]).not.to.equal(IncrementalDOM[name]));
  });
}

describe('IncrementalDOM', function () {
  testBasicApi('attr');
  testBasicApi('elementClose');
  testBasicApi('elementOpen');
  testBasicApi('elementOpenEnd');
  testBasicApi('elementOpenStart');
  testBasicApi('elementVoid');
  testBasicApi('text');
});
