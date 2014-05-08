(function () {
  'use strict';


  // Setup
  // -----

  function add(name) {
    return document.body.appendChild(document.createElement(name));
  }

  function remove (element) {
    element.parentNode.removeChild(element);
    return element;
  }

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

  afterEach(function () {
    skate.destroy();
    document.querySelector('body').innerHTML = '';
  });


  // Specs
  // -----

  describe('Lifecycle Callbacks', function () {
    it('Should trigger ready before the element is shown.', function (done) {
      skate('ready-callback', {
        ready: function (element) {
          assert(element.className.split(' ').indexOf('_skate') === -1, 'Class found');
          done();
        }
      });

      add('ready-callback');
    });

    it('Should trigger insert after the element is shown.', function (done) {
      skate('insert-callback', {
        insert: function (element) {
          assert(element.className.split(' ').indexOf('_skate') > -1, 'Class not found');
          done();
        }
      });

      add('insert-callback');
    });

    it('Should trigger removed when the element is removed.', function (done) {
      skate('remove-callback', {
        remove: function () {
          assert(true);
          done();
        }
      });

      var el = add('remove-callback');
      skate.init(el);
      remove(el);
    });
  });


  describe('DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      add('existing-element');

      skate('existing-element', {
        insert: function (element) {
          assert(true);
          done();
        }
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function (done) {
      skate('new-element', {
        insert: function (element) {
          assert(true);
          done();
        }
      });

      add('new-element');
    });
  });

  describe('Async ready callback.', function () {
    it('Ready event should be async and provide a done callback.', function (done) {
      var ok = false;

      skate('div', {
        ready: function (element, next) {
          setTimeout(function () {
            ok = true;
            next();
          }, 100);
        },

        insert: function () {
          assert(ok);
          done();
        }
      });

      addDivToBody();
    });
  });

  describe('Replacing existing element.', function () {
    it('Should be done synchronously by returing from the ready callback.', function () {
      skate('div', {
        ready: function (element) {
          return document.createElement('span');
        }
      });

      skate.init(addDivToBody());
      assert(document.body.getElementsByTagName('div').length === 0, 'Divs were found.');
      assert(document.body.getElementsByTagName('span').length === 1, 'No spans found.');
    });

    it ('Should be done asynchronously by passing to the done callback.', function (done) {
      skate('div', {
        ready: function (element, next) {
          next('<span></span>');
          assert(document.body.getElementsByTagName('div').length === 0);
          assert(document.body.getElementsByTagName('span').length === 1);
          done();
        }
      });

      skate.init(addDivToBody());
    });
  });

  describe('Synchronous initialisation', function () {
    it('Should take traversable items', function () {
      var initialised = false;

      skate('div', {
        insert: function () {
          ++initialised;
        }
      });

      addDivToBody();
      addDivToBody();

      skate.init(document.querySelectorAll('div'));
      initialised.should.equal(2);
    });

    it('Should take an element', function () {
      var initialised = 0;

      skate('div', {
        insert: function () {
          ++initialised;
        }
      });

      skate.init(addDivToBody());
      assert(initialised);
    });
  });

  describe('Attribute listeners', function () {
    it('Should listen to changes in specified attributes', function (done) {
      var init = false;
      var update = false;
      var remove = false;

      skate('div', {
        attributes: {
          open: {
            insert: function (data) {
              data.newValue.should.equal('init');
            },
            update: function (data) {
              data.oldValue.should.equal('init');
              data.newValue.should.equal('update');
            },
            remove: function (data) {
              data.oldValue.should.equal('update');
              done();
            }
          }
        }
      });

      var div = addDivToBody();
      skate.init(div);

      div.setAttribute('open', 'init');

      setTimeout(function () {
        div.setAttribute('open', 'update');
      }, 100);

      setTimeout(function () {
        div.removeAttribute('open');
      }, 200);
    });

    it('Should use the update callback as the init callback if no init callback is specified.', function (done) {
      var init = false;

      skate('div', {
        attributes: {
          open: {
            update: function (data) {
              if (data.newValue === 'init') {
                init = true;
                data.element.setAttribute('open', 'update');
              }

              if (data.newValue === 'update') {
                init.should.equal(true);
                done();
              }
            }
          }
        }
      });

      document.body.innerHTML = '<div id="attrtest" open="init"></div>';
    });

    it('Should accept a function insead of an object for the lifecycle definition which triggers both init and update.', function (done) {
      var init = false;

      skate('div', {
        attributes: {
          open: function (data) {
            if (data.newValue === 'init') {
              init = true;
              data.element.setAttribute('open', 'update');
            }

            if (data.newValue === 'update') {
              init.should.equal(true);
              done();
            }
          }
        }
      });

      document.body.innerHTML = '<div id="attrtest" open="init"></div>';
    });
  });

  describe('Extending', function () {
    it('Instead of using a custom tag, an attribute can be used to signify behaviour.', function () {
      var init = false;

      skate('datepicker', function () {
        init = true;
      });

      var div = document.createElement('div');
      div.setAttribute('datepicker', 'true');
      document.body.appendChild(div);
      skate.init(div);

      init.should.equal(true);
    });
  });

  describe('Instantiation', function () {
    it('Should return a constructor', function () {
      skate('div').should.be.a.function;
    });

    it('Should return a new element when constructed.', function () {
      var Div = skate('div');
      var div = new Div();
      div.nodeName.should.equal('DIV');
    });

    it('Should return a new element when called without "new".', function () {
      var div = skate('div');
      div().nodeName.should.equal('DIV');
    });

    it('Should synchronously initialise the new element.', function () {
      var called = false;
      var div = skate('div', {
        extend: {
          someMethod: function () {
            called = true;
          }
        }
      });

      div().someMethod();
      called.should.equal(true);
    });

    it('Should call lifecycle callbacks at appropriate times.', function (done) {
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
      });
    });

    it('Should initialise multiple instances of the same type of element (possible bug).', function (done) {
      var numReady = 0;
      var numInsert = 0;
      var numRemove = 0;
      var div = skate('div', {
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
      setTimeout(function () {
        assert(numRemove === 2, 'Remove not called');
        done();
      });
    });
  });

  describe('Watching', function () {
    it('Should watch an element for inserted nodes', function (done) {
      var div = addDivToBody();
      var span = document.createElement('span');

      skate.watch(div).on('span.insert', function (element) {
        assert(true);
        done();
      });

      div.appendChild(span);
    });

    it('Should watch an element for removed nodes', function (done) {
      var div = addDivToBody();
      var span = document.createElement('span');

      skate.watch(div).on('span.remove', function (element) {
        assert(true);
        done();
      });

      div.appendChild(span);
      div.removeChild(span);
    });

    it('Should allow you to specify if you want to watch for descendant insertions.', function (done) {
      var div = addDivToBody();

      skate.watch(div, {
        descendants: true
      }).on('span.insert', function (element) {
        assert(true);
        done();
      });

      div.appendChild(document.createElement('div'));
      div.querySelector('div').appendChild(document.createElement('span'));
    });

    it('Should allow you to specify if you want to watch for descendant removals.', function (done) {
      var div = addDivToBody();

      skate.watch(div, {
        descendants: true
      }).on('span.remove', function (element) {
        assert(true);
        done();
      });

      div.innerHTML = '<div><span></span></div>';
      div.querySelector('div').removeChild(div.querySelector('span'));
    });

    it('Should allow you to watch attributes', function (done) {
      var div = addDivToBody();
      var added = false;
      var updated = false;
      var removed = false;

      skate.watch(div, {
        attributes: true
      }).on('name.insert', function (data) {
        data.element.should.equal(div);
        data.name.should.equal('name');
        data.newValue.should.equal('value');
        added = true;
      });

      skate.watch(div, {
        attributes: true
      }).on('name.update', function (data) {
        data.element.should.equal(div);
        data.name.should.equal('name');
        data.newValue.should.equal('new value');
        data.oldValue.should.equal('value');
        updated = true;
      });

      skate.watch(div, {
        attributes: true
      }).on('name.remove', function (data) {
        data.element.should.equal(div);
        data.name.should.equal('name');
        data.oldValue.should.equal('new value');
        removed = true;
      });

      div.setAttribute('name', 'value');

      setTimeout(function () {
        div.setAttribute('name', 'new value');
      }, 100);

      setTimeout(function () {
        div.removeAttribute('name');
      }, 200);

      setTimeout(function () {
        added.should.equal(true);
        updated.should.equal(true);
        removed.should.equal(true);
        done();
      }, 300);
    });
  });
})();
