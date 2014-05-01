(function() {
  'use strict';


  // Setup
  // -----

  function addDivToBody(id) {
    var div = document.createElement('div');
    div.id = id || 'test';
    document.querySelector('body').appendChild(div);
    return div;
  }

  function removeDivFromBody(id) {
    var div = document.querySelector('#' +  (id || 'test'));

    if (div) {
      document.querySelector('body').removeChild(div);
    }
  }

  afterEach(function() {
    skate.destroy();
    document.querySelector('body').innerHTML = '';
  });


  // Specs
  // -----

  describe('Lifecycle Callbacks', function() {
    it('Should trigger ready before the element is shown.', function(done) {
      skate('div', {
        ready: function(element) {
          assert(element.className.split(' ').indexOf('_skate') === -1, 'Class found');
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger insert after the element is shown.', function(done) {
      skate('div', {
        insert: function(element) {
          assert(element.className.split(' ').indexOf('_skate') > -1, 'Class not found');
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger removed when the element is removed.', function(done) {
      skate('div', {
        remove: function() {
          assert(true);
          done();
        }
      });

      skate.init(addDivToBody());
      removeDivFromBody();
    });
  });


  describe('DOM node interaction.', function() {
    it('Modules should pick up nodes already in the DOM.', function(done) {
      addDivToBody().textContent = 'test';

      skate('div', {
        insert: function(element) {
          element.textContent.should.equal('test');
          done();
        }
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      skate('div', {
        insert: function(element) {
          element.textContent.should.equal('test');
          done();
        }
      });

      var div = document.createElement('div');
      div.textContent = 'test';
      document.body.appendChild(div);
    });
  });

  describe('Async ready callback.', function() {
    it('Ready event should be async and provide a done callback.', function(done) {
      var ok = false;

      skate('div', {
        ready: function(element, next) {
          setTimeout(function() {
            ok = true;
            next();
          }, 100);
        },

        insert: function() {
          assert(ok);
          done();
        }
      });

      addDivToBody();
    });
  });

  describe('Synchronous initialisation', function() {
    it('Should take traversable items', function() {
      var initialised = false;

      skate('div', {
        insert: function() {
          ++initialised;
        }
      });

      addDivToBody();
      addDivToBody();

      skate.init(document.querySelectorAll('div'));
      initialised.should.equal(2);
    });

    it('Should take an element', function() {
      var initialised = 0;

      skate('div', {
        insert: function() {
          ++initialised;
        }
      });

      skate.init(addDivToBody());
      assert(initialised);
    });

    it('Should take a selector', function() {
      var initialised = 0;

      skate('div', {
        insert: function() {
          ++initialised;
        }
      });

      addDivToBody();
      addDivToBody();

      skate.init('div');
      assert(initialised === 2);
    });
  });

  describe('Attribute listeners', function() {
    it('Should listen to changes in specified attributes', function(done) {
      var init = false;
      var update = false;
      var remove = false;

      skate('div', {
        attrs: {
          open: {
            init: function(element, value) {
              value.should.equal('init');
            },
            update: function(element, value, oldValue) {
              oldValue.should.equal('init');
              value.should.equal('update');
            },
            remove: function(element, value) {
              value.should.equal('update');
              done();
            }
          }
        }
      });

      var div = addDivToBody();
      skate.init(div);

      div.setAttribute('open', 'init');

      setTimeout(function() {
        div.setAttribute('open', 'update');
      }, 100);

      setTimeout(function() {
        div.removeAttribute('open');
      }, 200);
    });

    it('Should use the update callback as the init callback if no init callback is specified.', function(done) {
      var init = false;

      skate('div', {
        attrs: {
          open: {
            update: function(element, value, oldValue) {
              if (value === 'init') {
                init = true;
                element.setAttribute('open', 'update');
              }

              if (value === 'update') {
                init.should.equal(true);
                done();
              }
            }
          }
        }
      });

      document.body.innerHTML = '<div id="attrtest" open="init"></div>';
    });

    it('Should accept a function insead of an object for the lifecycle definition which triggers both init and update.', function(done) {
      var init = false;

      skate('div', {
        attrs: {
          open: function(element, value, oldValue) {
            if (value === 'init') {
              init = true;
              element.setAttribute('open', 'update');
            }

            if (value === 'update') {
              init.should.equal(true);
              done();
            }
          }
        }
      });

      document.body.innerHTML = '<div id="attrtest" open="init"></div>';
    });
  });

  describe('Extending', function() {
    it('Instead of using a custom tag, an attribute can be used to signify behaviour.', function() {
      var init = false;

      skate('datepicker', function() {
        init = true;
      });

      var div = document.createElement('div');
      div.setAttribute('datepicker', 'true');
      document.body.appendChild(div);
      skate.init(div);

      init.should.equal(true);
    });
  });

  describe('Instantiation', function() {
    it('Should return a constructor', function() {
      skate('div').should.be.a.function;
    });

    it('Should return a new element when constructed.', function() {
      var Div = skate('div');
      var div = new Div();
      div.nodeName.should.equal('DIV');
    });

    it('Should return a new element when called without "new".', function() {
      var div = skate('div');
      div().nodeName.should.equal('DIV');
    });

    it('Should synchronously initialise the new element.', function() {
      var called = false;
      var div = skate('div', {
        extend: {
          someMethod: function() {
            called = true;
          }
        }
      });

      div().someMethod();
      called.should.equal(true);
    });

    it('Should call lifecycle callbacks at appropriate times.', function(done) {
      var ready = false;
      var insert = false;
      var remove = false;
      var Div = skate('div', {
        ready: function() {
          ready = true;
        },
        insert: function() {
          insert = true;
        },
        remove: function() {
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
      setTimeout(function() {
        remove.should.equal(true, 'Should call remove');
        done();
      });
    });

    it('Should initialise multiple instances of the same type of element (possible bug).', function(done) {
      var numReady = 0;
      var numInsert = 0;
      var numRemove = 0;
      var div = skate('div', {
        ready: function() {
          ++numReady;
        },
        insert: function() {
          ++numInsert;
        },
        remove: function() {
          ++numRemove;
        }
      });

      var div1 = div();
      var div2 = div();

      document.body.appendChild(div1);
      document.body.appendChild(div2);

      skate.init([div1, div2]);

      div1.parentNode.removeChild(div1);
      div2.parentNode.removeChild(div2);

      assert(numReady === 2, 'Ready not called');
      assert(numInsert === 2, 'Insert not called');

      // Mutation Observers are async.
      setTimeout(function() {
        assert(numRemove === 2, 'Remove not called');
        done();
      });
    });
  });
})();
