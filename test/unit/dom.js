'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('DOM', function () {
  describe('General DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      var calls = 0;

      var tagName = helpers.safeTagName('my-element');
      skate.init(helpers.fixture('<div><my-element></my-element></div>', tagName));
      skate(tagName.safe, {
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

      var tagName = helpers.safeTagName('my-element');
      skate(tagName.safe, {
        attached: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element></my-element></div>', tagName));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    it('should pick up descendants that are attached as part of an HTML block.', function (done) {
      var calls = 0;

      var tagName = helpers.safeTagName('my-element');
      skate(tagName.safe, {
        attached: function () {
          ++calls;
        }
      });

      skate.init(helpers.fixture('<div><my-element></my-element></div>', tagName));
      helpers.afterMutations(function () {
        expect(calls).to.equal(1);
        done();
      });
    });

    // IE 11 has a bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml.
    it('should pick up descendants that are detached if an ancestor\'s innerHTML is set.', function (done) {
      var {safe: tagName} = helpers.safeTagName('my-element');
      skate(tagName, {
        detached: function () {
          done();
        }
      });

      skate.init(helpers.fixture(`<div id="removing"><child><${tagName}></${tagName}></child></div>`));
      helpers.fixture('');
    });

    // IE 9 / 10 have the same bug with removeChild() as IE 11 does with innerHTML.
    it('should pick up descendants that are detached if an ancestor is detached.', function (done) {
      var tagName = helpers.safeTagName('my-element');
      skate(tagName.safe, {
        detached: function () {
          done();
        }
      });

      skate.init(helpers.fixture('<div id="removing"><child><my-element></my-element></child></div>', tagName));
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
        type: skate.type.CLASSNAME,
        prototype: {
          skated: true
        }
      });

      skate.init(helpers.fixture(html));
      expect(helpers.fixture().querySelector('.my-circle').skated).to.equal(true);
    });
  });

  describe('Document Fragments', function () {
    var frag;
    var created;
    var attached;
    var tagName;
    var MyEl;

    beforeEach(function () {
      created = false;
      attached = false;
      tagName = helpers.safeTagName('my-element');
      MyEl = skate(tagName.safe, {
        created: function () {
          created = true;
        },

        attached: function () {
          attached = true;
        }
      });
      frag = document.createDocumentFragment();
    });

    it('should not call attached when initialised inside a document fragment', function () {
      var myEl = new MyEl();

      frag.appendChild(myEl);
      skate.init(frag);
      expect(created).to.equal(true);
      expect(attached).to.equal(false);
    });

    it('GH-118 - should not trigger the element is inserted, removed and then put into a fragment', function (done) {
      var div = document.createElement('div');

      document.body.appendChild(div);
      frag.appendChild(div);

      helpers.afterMutations(function () {
        done();
      });
    });
  });

  describe('Should guard against nodes that may not fully implement the HTMLElement interface', function () {
    function createElementAndRemove (prop) {
      var el = document.createElement('div');
      Object.defineProperty(el, prop, { value: undefined });
      expect(el[prop]).to.equal(undefined);
      return el;
    }

    it('tagName', function () {
      var el = createElementAndRemove('tagName');
      skate.init(el);
    });

    it('childNodes', function () {
      var el = createElementAndRemove('childNodes');
      skate.init(el);
    });
  });
});
