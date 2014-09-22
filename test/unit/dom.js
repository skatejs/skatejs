import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('DOM', function () {
  describe('General DOM node interaction.', function () {
    function assertComponent (name, type, fixture, done) {
      var def = {};
      def[type] = function () {
        assert(true);
        done();
      };

      skate(name, def);
      helpers.fixture(fixture);
    }

    it('Modules should pick up nodes already in the DOM.', function (done) {
      assertComponent('div', 'insert', '<div></div>', done);
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function (done) {
      assertComponent('div', 'insert', '<div></div>', done);
    });

    it('should pick up descendants that are inserted as part of an HTML block.', function (done) {
      assertComponent('sub-element', 'insert', '<div><child><sub-element></sub-element></child></div>', done);
    });

    // IE 11 has a bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml.
    it('should pick up descendants that are removed if an ancestor\'s innerHTML is set.', function (done) {
      assertComponent('sub-element', 'remove', '<div><child><sub-element></sub-element></child></div>', done);
      helpers.fixture('');
    });

    // IE 9/10 have issues with this. This is also to ensure IE 11 doesn't.
    it('should pick up descendants that are removed if an ancestor is removed.', function (done) {
      assertComponent('sub-element', 'remove', '<div><child><sub-element></sub-element></child></div>', done);
      var div = helpers.fixture().querySelector('div');
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
