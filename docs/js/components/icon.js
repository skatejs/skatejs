define(function() {
  return function(el, done) {
    el.className = 'glyphicon glyphicon-' + el.getAttribute('icon');
    done();
  };
});
