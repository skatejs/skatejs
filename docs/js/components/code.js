import trim from 'js/lib/trim';

export default function (el) {
  var baseIndent = getIndentLength(el.textContent.split("\n")[0]);
  var lines = trim(el.textContent).split("\n");

  el.textContent = '';

  lines.forEach(function(line, index) {
    var indent = getIndentLength(line) - baseIndent;
    var num = document.createElement('code');
    var code = document.createElement('code');
    var nl = document.createTextNode("\n");

    num.className = 'code-line-number';
    num.textContent = index + 1;

    code.className = 'code-line-content';
    code.innerHTML = setIndentLength(indent) + hljs.highlight(el.getAttribute('code'), trim(line)).value;

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
