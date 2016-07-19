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

  describe('passing a function', () => {
    const Elem = () => {
      const elem = vdom.elementOpen('div', null, null, 'id', 'test');
      vdom.elementClose('div');
      return elem;
    };

    let fixture;
    beforeEach(() => fixture = document.createElement('div'));

    function itPatch(desc, func) {
      it(desc, () => IncrementalDOM.patch(fixture, func));
    }

    itPatch('elementOpen, elementClose', () => {
      vdom.elementOpen(Elem);
      const elem = vdom.elementClose(Elem);
      expect(fixture.firstChild).to.equal(elem);
      expect(fixture.innerHTML).to.equal('<div id="test"></div>');
    });

    itPatch('elementOpenStart, elementOpenEnd, elementClose', () => {
      vdom.elementOpenStart(Elem);
      vdom.elementOpenEnd(Elem);
      const elem = vdom.elementClose(Elem);
      expect(fixture.firstChild).to.equal(elem);
      expect(fixture.innerHTML).to.equal('<div id="test"></div>');
    });
    
    itPatch('elementVoid', () => {
      const elem = vdom.elementVoid(Elem);
      expect(fixture.firstChild).to.equal(elem);
      expect(fixture.innerHTML).to.equal('<div id="test"></div>');
    });
  });
});
