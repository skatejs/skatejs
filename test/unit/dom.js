import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('DOM', function () {
  describe('General DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      var calls = 0;

      skate.init(helpers.fixture('<div><my-element-1></my-element-1></div>'));
      skate('my-element-1', {
        insert: function () {
          ++calls;
        }
      });

      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function (done) {
      var calls = 0;

      skate('my-element-2', {
        insert: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element-2></my-element-2></div>'));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    it('should pick up descendants that are inserted as part of an HTML block.', function (done) {
      var calls = 0;

      skate('my-element-3', {
        insert: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element-3></my-element-3></div>'));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    // IE 11 has a bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml.
    it('should pick up descendants that are removed if an ancestor\'s innerHTML is set.', function (done) {
      var calls = 0;

      skate('my-element-4', {
        remove: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div id="removing"><child><my-element-4</my-element-4></child></div>'));
      helpers.fixture('');
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    // IE 9 / 10 have the same bug with removeChild() as IE 11 does with innerHTML.
    it('should pick up descendants that are removed if an ancestor is removed.', function (done) {
      var calls = 0;

      skate('my-element-5', {
        remove: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div id="removing"><child><my-element-5></my-element-5></child></div>'));
      helpers.fixture().removeChild(document.getElementById('removing'));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
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
