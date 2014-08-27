define(['src/skate', 'test/lib/helpers'], function (skate, helpers) {
  'use strict';

  describe('Events', function () {
    it('should bind events', function () {
      var numTriggered = 0;
      var Div = skate('div', {
        events: {
          test: function () {
            ++numTriggered;
          }
        }
      });

      var div = new Div();

      helpers.dispatchEvent('test', div);
      numTriggered.should.equal(1);
    });

    it('should allow you to re-add the element back into the DOM', function () {
      var numTriggered = 0;
      var Div = skate('div', {
        events: {
          test: function () {
            ++numTriggered;
          }
        }
      });

      var div = new Div();
      document.body.appendChild(div);
      var par = div.parentNode;

      par.removeChild(div);
      par.appendChild(div);
      helpers.dispatchEvent('test', div);
      numTriggered.should.equal(1);
    });

    it('should support delegate events', function () {
      var dispatched = 0;

      skate('my-component', {
        ready: function (element) {
          var a = document.createElement('a');
          element.appendChild(a);
        },
        events: {
          'click a': function (element, e) {
            element.tagName.should.equal('MY-COMPONENT');
            e.target.tagName.should.equal('A');
            ++dispatched;
          }
        }
      });

      var inst = helpers.add('my-component');

      skate.init(inst);
      helpers.dispatchEvent('click', inst);
      helpers.dispatchEvent('click', inst.querySelector('a'));
      dispatched.should.equal(1);
    });
  });
});
