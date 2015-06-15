import apiEmit from '../../../src/api/emit';
import apiEvent from '../../../src/api/event';
import helpers from '../../lib/helpers';

var CustomEvent = window.CustomEvent;

describe('api/event', function () {
  var supportsShadowRoot = 'createShadowRoot' in window.HTMLElement.prototype;

  /* jshint expr: true */
  supportsShadowRoot && describe('shadow dom events', function () {
    var div, shr1, shr2, triggered;

    function assertDelegation (btn) {
      return function (e) {
        triggered = true;
        expect(this).to.equal(div);
        expect(e.delegateTarget).to.equal(btn);
      };
    }

    function assertDispatchClick (delegateSelector, btnId, assertionValue) {
      var btn = div.querySelector('* /deep/ #' + btnId);
      apiEvent(div, { ['click ' + delegateSelector + ' button']: assertDelegation(btn) });
      apiEmit(btn, 'click');
      expect(triggered).to.equal(assertionValue);
    }

    beforeEach(function () {
      triggered = false;

      // The main component element with a light DOM button.
      div = document.createElement('div');
      div.innerHTML = `
        <button id="in-light-content"></button>
      `;

      // Set up a shallow shadow root to trigger events from. The div > button
      // will get projected into the deep shadow root.
      shr1 = div.createShadowRoot();
      shr1.innerHTML = `
        <button id="in-shadow-root"></button>
        <content select="#in-light-content"></content>
        <div><button id="in-deep-light-content"></button></div>
      `;

      // Set up a second, deep, shadow root to trigger events from.
      shr2 = shr1.querySelector('div').createShadowRoot();
      shr2.innerHTML = `
        <button id="in-deep-shadow-root"></button>
        <content select="#in-deep-light-content"></content>
      `;

      helpers.fixture().appendChild(div);
    });


    // Light DOM

    it('light dom', function () {
      assertDispatchClick('', 'in-light-content', true);
    });

    it('light dom (nested)', function () {
      assertDispatchClick('', 'in-deep-light-content', false);
    });


    // ::content

    it('::shadow ::content', function () {
      assertDispatchClick('::shadow ::content', 'in-light-content', true);
    });

    it('::shadow ::content (nested)', function () {
      assertDispatchClick('::shadow ::content', 'in-deep-light-content', true);
    });


    // ::shadow

    it(':host::shadow', function () {
      assertDispatchClick(':host::shadow', 'in-shadow-root', true);
    });

    it(':host::shadow (nested)', function () {
      assertDispatchClick(':host::shadow', 'in-deep-shadow-root', true);
    });
  });
});
