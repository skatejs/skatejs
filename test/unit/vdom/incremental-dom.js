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

  describe.only('passing a function helper', () => {
    let fixture;
    beforeEach(() => fixture = document.createElement('div'));

    function patchAssert(elem, { checkChildren = true }) {
      expect(fixture.firstChild).to.equal(elem);
      expect(fixture.innerHTML).to.equal(`<div id="test">${ checkChildren ? '<span>test</span>' : '</div>'}`);
    }

    function patchIt(desc, func) {
      it(desc, () => IncrementalDOM.patch(fixture, func));
    }

    function renderChildren() {
      vdom.elementOpen('span');
      vdom.text('test');
      vdom.elementClose('span');
    }

    const Elem = (props, chren) => {
      const elem = vdom.elementOpen('div', null, null);
      Object.keys(props).forEach(prop => vdom.attr(prop, props[prop]));
      chren();
      vdom.elementClose('div');
      return elem;
    };

    patchIt('elementOpen, elementClose', () => {
      vdom.elementOpen(Elem, null, null, 'id', 'test');
      renderChildren();
      patchAssert(vdom.elementClose(Elem));
    });

    patchIt('elementOpenStart, attr, elementOpenEnd, elementClose', () => {
      vdom.elementOpenStart(Elem, null, null);
      vdom.attr('id', 'test');
      vdom.elementOpenEnd(Elem);
      renderChildren();
      patchAssert(vdom.elementClose(Elem));
    });
    
    patchIt('elementVoid', () => {
      patchAssert(vdom.elementVoid(Elem, null, null, 'id', 'test'), { checkChildren: false });
    });
  });
});
