define(['../../src/skate.js', '../lib/helpers.js'], function (skate, helpers) {
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
        events: {
          'click': function (element, e) {
            ++dispatched;
            expect(element.tagName).to.equal('MY-COMPONENT');
            expect(e.target.tagName).to.equal('SPAN');
          },

          'click a': function (element, e, current) {
            ++dispatched;
            expect(element.tagName).to.equal('MY-COMPONENT');
            expect(current.tagName).to.equal('A');
            expect(e.target.tagName).to.equal('SPAN');
          },
          'click span': function (element, e) {
            ++dispatched;
            expect(element.tagName).to.equal('MY-COMPONENT');
            expect(e.target.tagName).to.equal('SPAN');
          }
        },

        template: function (element) {
          element.innerHTML = '<a><span></span></a>';
        }
      });

      var inst = helpers.add('my-component');

      skate.init(inst);
      helpers.dispatchEvent('click', inst.querySelector('span'));
      dispatched.should.equal(3);
    });
  });
});
