(function() {
  'use strict';

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
        ready: function(element) {
          element.classList.contains('skate').should.equal(false);
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger insert after the element is shown.', function(done) {
      skate('div', {
        insert: function(element) {
          element.classList.contains('skate').should.equal(true);
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

  describe('Display none / block / etc behavior', function() {
    it('Should not be initialised twice', function() {
      var initialised = 0;

      skate('div', {
        insert: function() {
          ++initialised;
        }
      });

      var div = addDivToBody();
      skate.init(div);
      div.style.display = 'none';
      div.style.display = 'block';
      initialised.should.equal(1);
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
      initialised.should.equal(1);
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
      initialised.should.equal(2);
    });
  });

  describe('Destroying all instances', function() {
    it('Should be able to destroy all instances', function() {
      skate.instances.length.should.equal(0);

      skate('div', {
        insert: function(){}
      });

      skate.instances.length.should.equal(1);
      skate.destroy();
      skate.instances.length.should.equal(0);

      var div = addDivToBody();
      skate.init(div);
      div.textContent.should.equal('');
    });
  });

  describe('Dynamically resolved elements', function() {
    it('Should use a function to resolve elements', function() {
      skate(function(element) {
        return element.tagName === 'DIV';
      }, {
        insert: function(element) {
          element.textContent = 'yey';
        }
      });

      var div = addDivToBody();
      skate.init(div);
      div.textContent.should.equal('yey');
    });
  });

  describe('Dynamically resoved components', function() {
    it ('Should resolve sync', function() {
      skate('div', function(element) {

      });
    });

    it ('Should resolve async', function() {

    });
  });
})();
