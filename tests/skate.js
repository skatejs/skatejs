(function() {

  var body = document.getElementsByTagName('body')[0];

  afterEach(function() {
    body.innerHTML = '';
  });

  describe('Defining Modules', function() {
    var div, module;

    beforeEach(function() {
      div = document.createElement('div');
      module = skate('div', function(div) {
        div.innerText = 'test';
      });
    });

    afterEach(function() {
      module.destroy();
    });

    it('Modules should pick up nodes already in the DOM.', function(done) {
      body.appendChild(div);

      skate('div', function() {
        div.innerText.should.equal('test');
        done();
        this.destroy();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      body.appendChild(div);

      skate('div', function() {
        div.innerText.should.equal('test');
        done();
        this.destroy();
      });
    });

    it('When destroyed, that module should no longer affect new nodes.', function(done) {
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