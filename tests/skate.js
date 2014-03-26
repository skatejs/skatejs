(function() {

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


  describe('Events', function() {
    it('Should trigger ready before the element is shown.', function(done) {
      skate('div', {
        ready: function() {
          this.classList.contains('skate').should.equal(false);
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger insert after the element is shown.', function(done) {
      skate('div', {
        insert: function() {
          this.classList.contains('skate').should.equal(true);
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

      addDivToBody('removed');

      // TODO: Remove race condition between the time the element is added to
      // the removeRegistry when the insert event is triggered and when the
      // element is removed. If the element is removed before it has a chance
      // to be added to the registry then this will fail.
      setTimeout(function() {
        removeDivFromBody('removed');
      }, 100);
    });
  });


  describe('DOM node interaction.', function() {
    it('Modules should pick up nodes already in the DOM.', function(done) {
      addDivToBody().textContent = 'test';

      skate('div', function() {
        this.textContent.should.equal('test');
        done();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      skate('div', function() {
        this.textContent.should.equal('test');
        done();
      });

      addDivToBody().textContent = 'test';
    });

    it('When destroyed, that module should no longer affect new nodes.', function(done) {
      var oldModule = skate('div', function() {
        assert(false);
        oldModule.deafen();
        done();
      }).deafen();

      addDivToBody().textContent = 'test';

      var newModule = skate('div', function() {
        this.textContent.should.equal('test');
        newModule.deafen();
        done();
      });
    });
  });


  describe('Async ready event.', function() {
    it('Ready event should be async and provide a done callback.', function(done) {
      var ok = false;

      skate('div', {
        ready: function(next) {
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

    it('Ready done callback should accept a DOM element which replaces the existing element.', function(done) {
      skate('div', {
        ready: function(next) {
          setTimeout(function() {
            next(document.createElement('span'));
          }, 100);
        },

        insert: function() {
          assert(this.nodeName === 'SPAN');
          done();
        }
      });

      addDivToBody();
    });
  });

  describe('Display none / block / etc behavior', function() {
    it('Should not be initialised if initially display none', function() {
      var initialised = false;

      skate('div', function() {
        initialised = true;
      });

      setTimeout(function() {
        var div = document.createElement('div');
        div.style.display = 'none';
        document.body.appendChild(div);

        setTimeout(function() {
          initialised.should.equal(false);
        }, 100);
      }, 100);
    });

    it('Should not be initialised twice', function(done) {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      var div = addDivToBody();
      div.style.display = 'none';
      div.style.display = 'block';

      setTimeout(function() {
        initialised.should.equal(1);
        done();
      }, 100);
    });
  });

  describe('Synchronous initialisation', function() {
    it('Should take traversable items', function() {
      var initialised = false;

      skate('div', function() {
        ++initialised;
      });

      addDivToBody();
      addDivToBody();

      skate(document.querySelectorAll('div'));
      initialised.should.equal(2);
    });

    it('Should take an element', function() {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      skate(addDivToBody());
      initialised.should.equal(1);
    });

    it('Should take a selector', function() {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      addDivToBody();
      addDivToBody();

      skate('div');
      initialised.should.equal(2);
    });
  });

  describe('Destroying all instances', function() {
    it('Should be able to destroy all instances', function() {
      skate.instances.length.should.equal(0);

      skate('div', function(){});
      skate.instances.length.should.equal(1);

      skate.destroy();
      skate.instances.length.should.equal(0);

      var div = addDivToBody();
      skate(div);
      div.textContent.should.equal('');
    });
  });

})();
