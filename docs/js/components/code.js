define([
  'lib/trim',
  'highlight'
], function(
  trim,
  hjs
) {
  return function(el) {
    var baseIndent = getIndentLength(el.textContent.split("\n")[0]);
    var lines = trim(el.innerHTML).split("\n");

    el.innerHTML = '';

    lines.forEach(function(line, index) {
      var indent = getIndentLength(line) - baseIndent;
      var num = document.createElement('code');
      var code = document.createElement('code');
      var nl = document.createTextNode("\n");

      line = trim(line);
      line = line.replace('&gt;', '>');
      line = line.replace('&lt;', '<');

      num.className = 'code-line-number';
      num.innerHTML = index + 1;

      code.className = 'code-line-content';
      code.innerHTML = setIndentLength(indent) + hjs.highlight(el.getAttribute('code'), line).value;

      el.appendChild(num);
      el.appendChild(code);
      el.appendChild(nl);
    });
  };

  function getIndentLength(str) {
    return str.match(/^\s*/)[0].length;
  }

  function setIndentLength(len) {
    return len > 0 ? new Array(len + 1).join(' ') : '';
  }
});
