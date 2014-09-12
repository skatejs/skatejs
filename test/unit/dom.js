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

    it('should pick up descendants that are removed as part of an HTML block.', function (done) {
      assertComponent('sub-element', 'remove', '<div><child><sub-element></sub-element></child></div>', done);
      skate.init(helpers.fixture());
      helpers.fixture('');
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
