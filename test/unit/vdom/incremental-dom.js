import * as IncrementalDOM from 'incremental-dom';
import { define, vdom } from '../../../src/index';

function testBasicApi(name) {
  describe(name, () => {
    it('should be a function', () => expect(vdom[name]).to.be.a('function'));
    it('should not be the same one as in Incremental DOM', () => expect(vdom[name]).not.to.equal(IncrementalDOM[name]));
  });
}

describe('IncrementalDOM', () => {
  testBasicApi('attr');
  testBasicApi('elementClose');
  testBasicApi('elementOpen');
  testBasicApi('elementOpenEnd');
  testBasicApi('elementOpenStart');
  testBasicApi('elementVoid');
  testBasicApi('text');

  describe('function tag names', () => {
    let fixture;
    beforeEach(() => {
      fixture = document.createElement('div');
    });

    function patchIt(desc, func) {
      it(desc, () => IncrementalDOM.patch(fixture, func));
    }

    describe('passing element name', () => {
      patchIt('elementOpenStart, attr, elementOpenEnd, elementClose', () => {
        vdom.elementOpenStart('div');
        vdom.attr('id', 'test');
        vdom.elementOpenEnd('div');
        vdom.elementClose('div');
        expect(fixture.innerHTML).to.equal('<div id="test"></div>');
      });
    });

    describe('passing a component constructor', () => {
      const Elem = define('x-test', {});

      patchIt('elementOpen, elementClose', () => {
        vdom.elementOpen(Elem);
        expect(vdom.elementClose(Elem).tagName).to.equal('X-TEST');
      });

      patchIt('elementOpenStart, elementOpenEnd, elementClose', () => {
        vdom.elementOpenStart(Elem);
        vdom.elementOpenEnd(Elem);
        expect(vdom.elementClose(Elem).tagName).to.equal('X-TEST');
      });

      patchIt('elementOpenStart (single parameter), attr, elementOpenEnd, elementClose', () => {
        vdom.elementOpenStart(Elem);
        vdom.attr('id', 'test');
        vdom.elementOpenEnd(Elem);
        const elem = vdom.elementClose(Elem);
        expect(elem.tagName).to.equal('X-TEST');
        expect(elem.getAttribute('id')).to.equal('test');
      });

      patchIt('elementVoid', () => {
        expect(vdom.elementVoid(Elem).tagName).to.equal('X-TEST');
      });
    });

    describe('passing a function helper', () => {
      function patchAssert(elem, { checkChildren = true } = {}) {
        expect(fixture.firstChild).to.equal(elem);
        expect(fixture.innerHTML).to.equal(`<div id="test">${checkChildren ? '<span>test</span>' : ''}</div>`);
      }

      function renderChildren() {
        vdom.elementOpen('span');
        vdom.text('test');
        vdom.elementClose('span');
      }

      const Elem = (props, chren) => {
        const elem = vdom.elementOpen('div', null, null, 'id', props.id);
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

      patchIt('elementOpenStart (single parameter), attr, elementOpenEnd, elementClose', () => {
        vdom.elementOpenStart(Elem);
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
});
