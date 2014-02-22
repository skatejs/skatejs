define(function() {
  return function(el, done) {
    el.addEventListener('click', function(e) {
      window.open(el.getAttribute('href'));
      e.preventDefault();
    });

    done();
  };
});
