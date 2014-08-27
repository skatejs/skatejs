define(['src/skate', 'test/lib/helpers'], function (skate, helpers) {
  'use strict';

  describe('skate.init', function () {
    var Div;

    beforeEach(function () {
      Div = skate('div', {
        ready: function (element) {
          element.textContent = 'test';
        }
      });

      helpers.fixture('<div></div>');
    });

    it('should accept a selector', function () {
      expect(skate.init('#' + helpers.fixture().id + ' div').item(0).textContent).to.equal('test');
    });

    it('should accept a node', function () {
      expect(skate.init(helpers.fixture().querySelector('div')).textContent).to.equal('test');
    });

    it('should accept a node list', function () {
      expect(skate.init(helpers.fixture().querySelectorAll('div')).item(0).textContent).to.equal('test');
    });
  });

  describe('Synchronous initialisation', function () {
    it('should take an element', function () {
      var initialised = 0;

      skate('div', {
        insert: function () {
          ++initialised;
        }
      });

      skate.init(helpers.add('div'));
      assert(initialised);
    });
  });

  describe('Instantiation', function () {
    it('should return a constructor', function () {
      skate('div', {}).should.be.a('function');
    });

    it('should return a new element when constructed.', function () {
      var Div = skate('div', {});
      var div = new Div();
      div.nodeName.should.equal('DIV');
    });

    it('should synchronously initialise the new element.', function () {
      var called = false;
      var Div = skate('div', {
        prototype: {
          someMethod: function () {
            called = true;
          }
        }
      });

      new Div().someMethod();
      called.should.equal(true);
    });

    it('should call lifecycle callbacks at appropriate times.', function (done) {
      var ready = false;
      var insert = false;
      var remove = false;
      var Div = skate('div', {
        ready: function () {
          ready = true;
        },
        insert: function () {
          insert = true;
        },
        remove: function () {
          remove = true;
        }
      });

      var div = new Div();
      ready.should.equal(true, 'Should call ready');
      insert.should.equal(false, 'Should not call insert');
      remove.should.equal(false, 'Should not call remove');

      document.body.appendChild(div);
      skate.init(div);
      insert.should.equal(true, 'Should call insert');
      remove.should.equal(false, 'Should not call remove');

      div.parentNode.removeChild(div);

      // Mutation Observers are async.
      setTimeout(function () {
        remove.should.equal(true, 'Should call remove');
        done();
      }, 1);
    });

    it('should initialise multiple instances of the same type of element (possible bug).', function (done) {
      var numReady = 0;
      var numInsert = 0;
      var numRemove = 0;
      var Div = skate('div', {
        ready: function () {
          ++numReady;
        },
        insert: function () {
          ++numInsert;
        },
        remove: function () {
          ++numRemove;
        }
      });

      var div1 = new Div();
      var div2 = new Div();

      document.body.appendChild(div1);
      document.body.appendChild(div2);

      skate.init(div1);
      skate.init(div2);

      numReady.should.equal(2);
      numInsert.should.equal(2);

      div1.parentNode.removeChild(div1);
      div2.parentNode.removeChild(div2);

      // Mutation Observers are async.
      setTimeout(function () {
        numRemove.should.equal(2);
        done();
      }, 100);
    });

    it('should not allow ids that may have the same names as functions / properties on the object prototype', function () {
      var idsToSkate = ['hasOwnProperty', 'watch'];
      var idsToCheck = {};

      var div = document.createElement('div');
      div.className = idsToSkate.join(' ');

      idsToSkate.forEach(function (id) {
        skate(id, {
          type: skate.types.CLASS,
          ready: function () {
            idsToCheck[id] = true;
          }
        });
      });

      skate.init(div);

      idsToSkate.forEach(function (id) {
        idsToCheck[id].should.equal(true);
      });
    });
  });
});
