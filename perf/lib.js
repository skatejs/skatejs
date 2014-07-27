window.newTestElement = function (number) {
  var div = document.createElement('div');
  div.innerHTML = '<article><section><div><ul><li><a href="#"><span>test ' + number + '</span></a></li></ul></div></section></article>';
  return div;
};

window.appendTestElements = function (container, amount) {
  for (var a = 0; a < amount; a++) {
    container.appendChild(newTestElement(a + 1));
  }
};

window.addSkateListeners = function (prefix, amount) {
  for (var a = 0; a < amount; a++) {
    skate(prefix + '-' + (a + 1), {});
  }
};
