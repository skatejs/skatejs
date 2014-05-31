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

  afterEach(function () {
    skate.destroy();
    document.querySelector('body').innerHTML = '';
  });


  // Specs
  // -----

  describe('Registration', function () {
    it('Should not allow you to register the same component more than once.', function () {
      var multiple = false;

      skate('div');

      try {
        skate('div');
        multiple = true;
      } catch (e) {}

      assert(!multiple, 'Multiple "div" components were registered.');
    });
  });

  describe('Lifecycle Callbacks', function () {
    it('Should trigger ready before the element is shown.', function (done) {
      skate('div', {
        ready: function (element) {
          assert(element.className.split(' ').indexOf('__skate') === -1, 'Class found');
          done();
        }
      });

      add('div');
    });

    it('Should trigger insert after the element is shown.', function (done) {
      skate('div', {
        insert: function (element) {
          assert(element.className.split(' ').indexOf('__skate') > -1, 'Class not found');
          done();
        }
      });

      add('div');
    });

    it('Should trigger removed when the element is removed.', function (done) {
      skate('div', {
        remove: function () {
          assert(true);
          done();
        }
      });

      var el = add('div');
      skate.init(el);
      remove(el);
    });
  });


  describe('DOM node interaction.', function () {
    it('Modules should pick up nodes already in the DOM.', function (done) {
      add('div');

      skate('div', {
        insert: function (element) {
          assert(true);
          done();
        }
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function (done) {
      skate('div', {
        insert: function (element) {
          assert(true);
          done();
        }
      });

      add('div');
    });

    it('Should pick up descendants that are inserted as part of an HTML block.', function (done) {
      skate('sub-element', {
        insert: function () {
          assert(true);
          done();
        }
      });

      document.body.innerHTML = '<div><child><sub-element></sub-element></child></div>';
    });

    it('Should pick up descendants that are removed as part of an HTML block.', function (done) {
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
          assert(ok, 'Ready not called before insert.');
          done();
        }
      });

      add('div');
    });
  });

  describe('Replacing existing element.', function () {
    it('Should be done synchronously by returing from the ready callback.', function () {
      skate('div', {
        ready: function (element) {
          return document.createElement('span');
        }
      });

      skate.init(add('div'));
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

      skate.init(add('div'));
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

      add('div');
      add('div');

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

      skate.init(add('div'));
      assert(initialised);
    });
  });

  describe('Attribute listeners', function () {
    it('Should listen to changes in specified attributes', function (done) {
      skate('div', {
        attributes: {
          open: {
            insert: function (element, data) {
              data.newValue.should.equal('insert');
              element.setAttribute('open', 'update');
            },
            update: function (element, data) {
              data.oldValue.should.equal('insert');
              data.newValue.should.equal('update');
              element.removeAttribute('open');
            },
            remove: function (element, data) {
              data.oldValue.should.equal('update');
              done();
            }
          }
        }
      });

      add('div').setAttribute('open', 'insert');
    });

    it('Should accept a function insead of an object for a particular attribute definition.', function (done) {
      var init = false;

      skate('div', {
        attributes: {
          open: function (element, data) {
            if (data.type === 'insert') {
              setTimeout(function () {
                element.setAttribute('open', 'update');
              });
            } else if (data.type === 'update') {
              setTimeout(function () {
                element.removeAttribute('open');
              });
            } else if (data.type === 'remove') {
              assert(true);
              done();
            }
          }
        }
      });

      document.body.innerHTML = '<div id="attrtest" open="init"></div>';
    });

    it('Should accept a function insead of an object for the entire attribute definition.', function (done) {
      var init = false;

      skate('div', {
        attributes: function (element, data) {
          if (data.type === 'insert') {
            setTimeout(function () {
              element.setAttribute('open', 'update');
            });
          } else if (data.type === 'update') {
            setTimeout(function () {
              element.removeAttribute('open');
            });
          } else if (data.type === 'remove') {
            assert(true);
            done();
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
      skate('div').should.be.a('function');
    });

    it('Should return a new element when constructed.', function () {
      var Div = skate('div');
      var div = new Div();
      div.nodeName.should.equal('DIV');
    });

    it('Should synchronously initialise the new element.', function () {
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

  describe('Returning a constructor', function () {
    it('Should return a constructor that extends a native element.', function () {
      var Div = skate('div', {
        prototype: {
          func1: function () {}
        }
      });

      Div.prototype.func2 = function () {};

      expect(Div.prototype.func1).to.be.a('function');
      expect(Div.prototype.func2).to.be.a('function');

      var div = new Div();

      expect(div.func1).to.be.a('function');
      expect(div.func2).to.be.a('function');

      div.func1.should.equal(Div.prototype.func1);
      div.func2.should.equal(Div.prototype.func2);
    });

    it('Should not allow the constructor property to be enumerated.', function () {
      var Div = skate('div');

      for (var prop in Div.prototype) {
        if (prop === 'constructor') {
          throw new Error('The constructor property should not be enumerable.');
        }
      }
    });

    it('Should affect the element prototype even if it was not constructed using the constructor.', function () {
      var Div = skate('div', {
        prototype: {
          func1: function () {}
        }
      });

      Div.prototype.func2 = function () {};

      var div = add('div');

      div.func1.should.be.a('function');
      div.func2.should.be.a('function');
    });
  });

  describe('Doing something when an element is augmented by a particular component.', function () {
    it('Should execute a callback if an element is already augmented.', function (done) {
      var Div = skate('div', {
        prototype: {
          test: function () {}
        }
      });

      var div = new Div();
      document.body.appendChild(div);
      skate.init(div);

      skate.when(div).is('div').then(function (element) {
        expect(element.test).to.be.a('function');
        done();
      });
    });

    it('Should execute a callback when an element will be augmented.', function (done) {
      var Div = skate('div', {
        prototype: {
          test: function () {}
        }
      });

      var div = new Div();

      skate.when(div).is('div').then(function (element) {
        expect(element.test).to.be.a('function');
        done();
      });

      document.body.appendChild(div);
    });

    // Safety net to ensure this never happens.
    it('Should not execute when callbacks that were previously executed.', function () {
      var Div = skate('div');
      var div = new Div();
      var executions = 0;
      var callbacks = skate.when(div).is('div').then(incrementExecutions);

      document.body.appendChild(div);
      callbacks.then(incrementExecutions);
      executions.should.equal(2);

      function incrementExecutions () {
        ++executions;
      }
    });
  });

  describe('Events', function () {
    it('Should bind events', function (done) {
      skate('div', {
        events: {
          test: function (element, e) {
            element.should.equal(div);
            e.should.be.an('object');
            done();
          }
        }
      });

      var div = add('div');
      var evt = document.createEvent('CustomEvent');

      evt.initEvent('test');
      div.dispatchEvent(evt);
    });

    it('Should unbind events', function (done) {
      skate('div', {
        events: {
          test: function () {
            assert(false);
            done();
          }
        }
      });

      var div = add('div');
      remove(div);

      setTimeout(function () {
        var evt = document.createEvent('CustomEvent');
        evt.initEvent('test');
        div.dispatchEvent(evt);
        assert(true);
        done();
      }, 100);
    });
  });
})();
