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

  function dispatchEvent (name, element) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, true, true, {});
    element.dispatchEvent(e);
  }

  afterEach(function () {
    skate.destroy();
    document.body.innerHTML = '';
  });


  // Specs
  // -----

  describe('Registration', function () {
    it('should not allow you to register the same component more than once.', function () {
      var multiple = false;

      skate('div', {});

      try {
        skate('div', {});
        multiple = true;
      } catch (e) {}

      assert(!multiple, 'Multiple "div" components were registered.');
    });

    it('should destroy all listeners when destroy() called', function () {
      skate('div', {
        insert: function (element) {
          element.test = true;
        }
      });

      skate.destroy();
      expect(skate.init(add('div')).test).to.equal(undefined);
    });

    it('should unregister the specified listener when unregister() called', function () {
      skate('div', {
        insert: function (element) {
          element.test = true;
        }
      });

      skate.unregister('div');
      expect(skate.init(add('div')).test).to.equal(undefined);
    });
  });

  describe('Using components', function () {
    function assertType (type, shouldEqual) {
      it('type: ' + type, function () {
        var calls = 0;

        skate('my-element', {
          type: type,
          ready: function () {
            ++calls;
          }
        });

        var el1 = document.createElement('my-element');
        skate.init(el1);

        var el2 = document.createElement('div');
        el2.setAttribute('is', 'my-element');
        skate.init(el2);

        var el3 = document.createElement('div');
        el3.setAttribute('my-element', '');
        skate.init(el3);

        var el4 = document.createElement('div');
        el4.className = 'my-element';
        skate.init(el4);

        calls.should.equal(shouldEqual);
      });
    }

    describe('tags, attributes and classes', function () {
      assertType(skate.types.TAG, 2);
      assertType(skate.types.ATTR, 1);
      assertType(skate.types.CLASS, 1);

      it('should not initialise a single component more than once on a single element', function () {
        var calls = 0;

        skate('my-element', {
          ready: function () {
            ++calls;
          }
        });

        var el = document.createElement('my-element');
        el.setAttribute('my-element', '');
        el.className = 'my-element';
        skate.init(el);

        calls.should.equal(1);
      });
    });
  });

  describe('Lifecycle Callbacks', function () {
    it('should trigger ready before the element is shown.', function (done) {
      skate('div', {
        ready: function (element) {
          assert(element.className.split(' ').indexOf('__skate') === -1, 'Class found');
          done();
        }
      });

      add('div');
    });

    it('should trigger insert after the element is shown.', function (done) {
      skate('div', {
        insert: function (element) {
          assert(element.className.split(' ').indexOf('__skate') > -1, 'Class not found');
          done();
        }
      });

      add('div');
    });

    it('should trigger removed when the element is removed.', function (done) {
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

      add('div');
    });

    it('should pick up descendants that are inserted as part of an HTML block.', function (done) {
      skate('sub-element', {
        insert: function () {
          assert(true);
          done();
        }
      });

      document.body.innerHTML = '<div><child><sub-element></sub-element></child></div>';
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

  describe('Synchronous initialisation', function () {
    it('should take an element', function () {
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
    it('should listen to changes in specified attributes', function (done) {
      var inserted = false;
      var updated = false;

      skate('div', {
        attributes: {
          open: {
            insert: function (element, data) {
              inserted = true;
              data.newValue.should.equal('insert');
              element.setAttribute('open', 'update');
            },
            update: function (element, data) {
              updated = true;
              data.oldValue.should.equal('insert');
              data.newValue.should.equal('update');
              element.removeAttribute('open');
            },
            remove: function (element, data) {
              inserted.should.equal(true);
              updated.should.equal(true);
              data.oldValue.should.equal('update');
              done();
            }
          }
        }
      });

      skate.init(add('div')).setAttribute('open', 'insert');
    });

    it('should accept a function insead of an object for a particular attribute definition.', function (done) {
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

      document.body.innerHTML = '<div id="attrtest" open="insert"></div>';
    });

    it('should accept a function insead of an object for the entire attribute definition.', function (done) {
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

      document.body.innerHTML = '<div id="attrtest" open="insert"></div>';
    });

    it('should ensure an attribute exists before trying to action it just in case another attribute handler removes it', function () {
      skate('div', {
        attributes: function (element, data) {
          if (data.name === 'first') {
            element.removeAttribute('second');
          }
        }
      });

      document.body.innerHTML = '<div first="first" second="second"></div>';
      var div = skate.init(document.body.querySelector('div'));
      div.hasAttribute('first').should.equal(true);
      div.hasAttribute('second').should.equal(false);
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
      }, 100);
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

  describe('Returning a constructor', function () {
    it('should return a constructor that extends a native element.', function () {
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

    it('should not allow the constructor property to be enumerated.', function () {
      var Div = skate('div', {});

      for (var prop in Div.prototype) {
        if (prop === 'constructor') {
          throw new Error('The constructor property should not be enumerable.');
        }
      }
    });

    it('should affect the element prototype even if it was not constructed using the constructor.', function () {
      var Div = skate('div', {
        prototype: {
          func1: function () {}
        }
      });

      Div.prototype.func2 = function () {};

      var div = new Div();

      div.func1.should.be.a('function');
      div.func2.should.be.a('function');
    });

    it('should allow the overwriting of the prototype', function () {
      var Div = skate('div', {});

      Div.prototype = {
        func: function () {}
      };

      var div = new Div();

      div.func.should.be.a('function');
    });
  });

  describe('Events', function () {
    it('should bind events', function () {
      var numTriggered = 0;
      var Div = skate('div', {
        events: {
          test: function () {
            ++numTriggered;
          }
        }
      });

      var div = new Div();

      dispatchEvent('test', div);
      numTriggered.should.equal(1);
    });

    it('should allow you to re-add the element back into the DOM', function () {
      var numTriggered = 0;
      var Div = skate('div', {
        events: {
          test: function () {
            ++numTriggered;
          }
        }
      });

      var div = new Div();
      document.body.appendChild(div);
      var par = div.parentNode;

      par.removeChild(div);
      par.appendChild(div);
      dispatchEvent('test', div);
      numTriggered.should.equal(1);
    });

    it('should support delegate events', function () {
      var dispatched = 0;

      skate('my-component', {
        ready: function (element) {
          var a = document.createElement('a');
          element.appendChild(a);
        },
        events: {
          'click a': function (element, e) {
            element.tagName.should.equal('MY-COMPONENT');
            e.target.tagName.should.equal('A');
            ++dispatched;
          }
        }
      });

      var inst = add('my-component');

      skate.init(inst);
      dispatchEvent('click', inst);
      dispatchEvent('click', inst.querySelector('a'));
      dispatched.should.equal(1);
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

  describe('Templates', function () {
    it('should not replacing existing content if there is no template', function () {
      skate('my-element', {});

      document.body.innerHTML = '<my-element>my content</my-element>';

      var el = document.querySelector('my-element');
      skate.init(el);
      el.innerHTML.should.equal('my content');
    });

    it('should allow a string', function () {
      var El = skate('my-element', {
        template: 'my template'
      });

      var el = new El();
      el.innerHTML.should.equal('my template');
    });

    it('should allow a function that is assumed that it will do the templating', function () {
      var El = skate('my-element', {
        template: function (element) {
          element.innerHTML = 'my template';
        }
      });

      var el = new El();
      el.innerHTML.should.equal('my template');
    });

    it('should add the content to the first matched content element with the content passed to the main element', function () {
      skate('my-element', {
        template: '<span data-skate-content=""></span>'
      });

      document.body.innerHTML = '<my-element>my content</my-element>';

      var el = document.querySelector('my-element');
      skate.init(el);
      el.innerHTML.should.equal('<span data-skate-content="">my content</span>');
    });

    it('should allow first children of the main element to be selected by the content element', function () {
      skate('my-element', {
        template: '<span data-skate-content="some descendant"></span>'
      });

      document.body.innerHTML = '<my-element><some><descendant></descendant></some></my-element>';

      var el = document.querySelector('my-element');
      skate.init(el);
      el.innerHTML.should.equal('<span data-skate-content="some descendant"></span>');
    });

    describe('default content', function () {
      var main;
      var span;

      beforeEach(function () {
        skate('my-element', {
          template: '<span data-skate-content>default content</span>'
        });

        document.body.innerHTML = '<my-element></my-element>';

        main = skate.init(document.querySelector('my-element'));
        span = main.querySelector('span');
      });

      it('should insert the default content if no content is found', function () {
        span.innerHTML.should.equal('default content');
      });

      it('should remove the default content if content is inserted', function (done) {
        span.appendChild(document.createElement('span'));

        setTimeout(function () {
          span.innerHTML.should.equal('<span></span>');
          done();
        });
      });
    });
  });

  describe('version', function () {
    it('should be exposed', function () {
      skate.version.should.be.a('string');
    });
  });

  describe('ignoring', function () {
    it('should ignore a flagged element', function () {
      var called = 0;

      // Test insertion before.
      document.body.innerHTML = '<div></div><div id="container-1" data-skate-ignore><div><div></div></div></div><div></div>';
      document.getElementById('container-1').innerHTML = '<div><div></div></div>';

      // Now register.
      skate('div', {
        insert: function () {
          ++called;
        }
      });

      // Ensure the document is sync'd.
      skate.init(document.body);

      // Test insertion after.
      document.body.innerHTML = '<div></div><div id="container-2" data-skate-ignore><div><div></div></div></div><div></div>';
      document.getElementById('container-2').innerHTML = '<div><div></div></div>';

      // Ensure all new content is sync'd.
      skate.init(document.body);

      called.should.equal(4);
    });
  });
})();
