(function() {

  var body = document.getElementsByTagName('body')[0];

  afterEach(function() {
    body.innerHTML = '';
  });

  describe('Defining Modules', function() {
    var module;

    beforeEach(function() {
      module = skate('div', function(div) {
        div.textContent = 'test';
      });
    });

    afterEach(function() {
      module.deafen();
    });

    it('Modules should pick up nodes already in the DOM.', function(done) {
      var div = document.createElement('div');

      module.on('insert', function() {
        div.innerText.should.equal('test');
        done();
      });

      body.appendChild(div);
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      var div = document.createElement('div');

      body.appendChild(div);

      module.on('insert', function() {
        div.innerText.should.equal('test');
        done();
      });
    });

    it('When destroyed, that module should no longer affect new nodes.', function(done) {
      var div = document.createElement('div');

      module.deafen();
      body.appendChild(div);

      var newModule = skate('div', function() {
        div.innerText.should.equal('');
        newModule.deafen();
        done();
      });
    });
  });

})();