import * as IncrementalDOM from 'incremental-dom';
import { vdom } from '../../../src/index';

function testBasicApi (name) {
  it('should be a function', () => expect(vdom[name]).to.be.a('function'));
  it('should not be the same one as in Incremental DOM', () => expect(vdom[name]).not.to.equal(IncrementalDOM[name]));
}

describe('IncrementalDOM', function () {
  describe('attr', () => {
    testBasicApi('attr');
  });

  describe('elementClose', () => {
    testBasicApi('elementClose');
  });

  describe('elementOpen', () => {
    testBasicApi('elementOpen');
  });

  describe('elementOpenEnd', () => {
    testBasicApi('elementOpenEnd');
  });

  describe('elementOpenStart', () => {
    testBasicApi('elementOpenStart');
  });

  describe('elementVoid', () => {
    testBasicApi('elementVoid');
  });

  describe('text', () => {
    testBasicApi('text');
  });
});
