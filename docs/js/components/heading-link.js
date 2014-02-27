define(function() {
  return function(el) {
    var a = document.createElement('a');

    a.innerHTML = el.innerHTML;
    el.innerHTML = '';

    a.setAttribute('href', '#' + el.getAttribute('id'));
    el.appendChild(a);
  };
});
