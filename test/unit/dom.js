define(['../../src/skate.js', '../lib/helpers.js'], function (skate, helpers) {
  'use strict';

  describe('General DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      helpers.add('div');

      skate('div', {
        insert: function () {
          assert(true);
          done();
        }
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function (done) {
      skate('div', {
        insert: function () {
          assert(true);
          done();
        }
      });

      helpers.add('div');
    });

    it('should pick up descendants that are inserted as part of an HTML block.', function (done) {
      skate('sub-element', {
        insert: function () {
          assert(true);
          done();
        }
      });

      helpers.fixture('<div><child><sub-element></sub-element></child></div>');
    });

    it('should pick up descendants that are removed as part of an HTML block.', function (done) {
      skate('sub-element', {
        remove: function () {
          assert(true);
          done();
        }
      });

      document.body.innerHTML = '<div><child><sub-element></sub-element></child></div>';
      var div = document.querySelector('div');
      div.parentNode.removeChild(div);
    });
  });

  describe('SVG', function () {
    it('should work for any SVG element', function () {
      var div = document.createElement('div');
      div.innerHTML = '<svg width="100" height="100">' +
          '<circle my-circle="true" cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
          '<circle my-circle="true" class="my-circle" cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
        '</svg>';

      skate('my-circle', {
        ready: function (element) {
          element.getAttribute('my-circle').should.equal('true');
        }
      });

      skate.init(div);
    });
  });
});
