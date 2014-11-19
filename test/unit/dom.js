'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('DOM', function () {
  describe('General DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      var calls = 0;

      skate.init(helpers.fixture('<div><my-element></my-element></div>'));
      skate('my-element', {
        attached: function () {
          ++calls;
        }
      });

      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    it('Modules should pick up nodes attached to the DOM after they are defined.', function (done) {
      var calls = 0;

      skate('my-element', {
        attached: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element></my-element></div>'));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    it('should pick up descendants that are attached as part of an HTML block.', function (done) {
      var calls = 0;

      skate('my-element', {
        attached: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element></my-element></div>'));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    // IE 11 has a bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml.
    it('should pick up descendants that are detached if an ancestor\'s innerHTML is set.', function (done) {
      skate('my-element', {
        detached: function () {
          done();
        }
      });

      skate.init(helpers.fixture('<div id="removing"><child><my-element></my-element></child></div>'));
      helpers.fixture('');
    });

    // IE 9 / 10 have the same bug with removeChild() as IE 11 does with innerHTML.
    it('should pick up descendants that are detached if an ancestor is detached.', function (done) {
      skate('my-element', {
        detached: function () {
          done();
        }
      });

      skate.init(helpers.fixture('<div id="removing"><child><my-element></my-element></child></div>'));
      helpers.fixture().removeChild(document.getElementById('removing'));
    });
  });

  describe('SVG', function () {
    it('should work for any SVG element', function () {
      var html = '<svg width="100" height="100">' +
          '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
          '<circle class="my-circle" cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
        '</svg>';

      skate('my-circle', {
        prototype: {
          skated: true
        }
      });

      skate.init(helpers.fixture(html));
      expect(helpers.fixture().querySelector('.my-circle').skated).to.equal(true);
    });
  });
});
