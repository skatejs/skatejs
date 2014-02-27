define(function() {
  return function(el) {
    el.className = 'glyphicon glyphicon-' + el.getAttribute('icon');
  };
});
