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
    document.querySelector('body').innerHTML = '';
  });


  describe('Defining Modules', function() {
    it('Modules should pick up nodes already in the DOM.', function(done) {
      addDivToBody().textContent = 'test';

      var mod = skate('div', function(el) {
        el.textContent.should.equal('test');
        mod.deafen();
        done();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      var mod = skate('div', function(el) {
        el.textContent.should.equal('test');
        mod.deafen();
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

      var newModule = skate('div', function(el) {
        el.textContent.should.equal('test');
        newModule.deafen();
        done();
      });
    });
  });


  describe('Events', function() {
    it('Should trigger ready before the element is shown.', function(done) {
      var mod = skate('div').on('ready', function(el) {
        mod.deafen();
        el.className.indexOf('__skate').should.equal(-1);
        done();
      }).listen();

      addDivToBody();
    });

    it('Should trigger insert after the element is shown.', function(done) {
      var mod = skate('div').on('insert', function(el) {
        mod.deafen();
        el.className.indexOf('__skate').should.be.greaterThan(-1);
        done();
      }).listen();

      addDivToBody();
    });

    it('Should trigger remove when the element is removed.', function(done) {
      var mod = skate('div').on('remove', function() {
        mod.deafen();
        assert(true, 'testing');
        done();
      }).listen();

      addDivToBody('remove');
      removeDivFromBody('remove');
    });
  });

})();