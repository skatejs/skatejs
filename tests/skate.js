(function() {

  var body = document.getElementsByTagName('body')[0];

  afterEach(function() {
    body.innerHTML = '';
  });

  describe('Defining Modules', function() {
    var module;

    beforeEach(function() {
      module = skate('div', function(div) {
        div.innerText = 'test';
      });
    });

    afterEach(function() {
      module.destroy();
    });

    it('Modules should pick up nodes already in the DOM.', function(done) {
      var div = document.createElement('div');

      body.appendChild(div);

      skate('div', function() {
        div.innerText.should.equal('test');
        done();
        this.destroy();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      var div = document.createElement('div');

      body.appendChild(div);

      skate('div', function() {
        div.innerText.should.equal('test');
        done();
        this.destroy();
      });
    });

    it('Should expose the elements that are currently being affected by the component.', function() {
      module.elements().should.be.an('array');
      module.elements().length.should.equal(0);
      body.appendChild(document.createElement('div'));
      module.elements().length.should.equal(1);
      body.appendChild(document.createElement('div'));
      module.elements().length.should.equal(2);
    });

    it('When destroyed, that module should no longer affect new nodes.', function(done) {
      var div = document.createElement('div');

      module.destroy();
      body.appendChild(div);

      skate('div', function() {
        div.innerText.should.equal('');
        done();
        this.destroy();
      });
    });
  });

})();