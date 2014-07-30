window.getTestElements = function (size) {
  var html = '';
  size = size || 1;

  for (var a = 0; a < size; a++) {
    html += '<div><article><section><div><ul><li><a href="#"><span>test ' + (a + 1) + '</span></a></li></ul></div></section></article></div>';
  }

  return html;
}

window.addTestElements = function (container, amount) {
  container.innerHTML = getTestElements(amount);
};

window.addSkateListeners = function (prefix, amount) {
  for (var a = 0; a < amount; a++) {
    skate(prefix + '-' + (a + 1), {});
  }
};
