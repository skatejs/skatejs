import hljs from 'highlight.js';
import skate from '../../../../src/index';

function setupCodeBlockContents(element) {
  var pre = document.createElement('pre');
  element.innerHTML = '';
  element.className = 'sk-code-block';
  element.appendChild(pre);
}

function getIndentLength(str) {
  if (str) {
    return str.match(/^\s*/)[0].length;
  }
}

function setIndentLength (len) {
  return len > 0 ? new Array(len + 1).join(' ') : '';
}

function formatLine (line) {
  line = line.trim();
  line = line.replace(/&gt;/g, '>');
  line = line.replace(/&lt;/g, '<');
  return line;
}

export default skate('sk-code', {
  extends: 'noscript',
  properties: {
    inline: {
      attr: true,
      type: Boolean
    },
    showLines: {
      attr: true,
      type: Boolean
    }
  },
  attached: function () {
    var element;
    var rawHtml = this.innerHTML;
    var lang = this.getAttribute('lang') || 'html';
    var lines = rawHtml.split('\n');
    var showLines = this.showLines;

    if (this.inline) {
      var code = document.createElement('code');
      code.innerHTML = hljs.highlight(lang, formatLine(lines[0])).value;
      this.parentNode.insertBefore(code, this);
      return;
    }

    element = document.createElement('div');

    // Trim leading empty lines.
    if (!lines[0].trim()) {
      lines.splice(0, 1);
    }

    // Trim trailing empty lines
    if (!lines[lines.length - 1].trim()) {
      lines.splice(lines.length - 1, 1);
    }

    var baseIndent = getIndentLength(lines[0]);

    setupCodeBlockContents(element);
    var pre = element.querySelector('pre');

    lines.forEach(function (line, index) {
      var indent = getIndentLength(line) - baseIndent;
      var num = document.createElement('code');
      var code = document.createElement('code');
      var nl = document.createTextNode('\n');

      line = formatLine(line);
      num.className = 'sk-code-line-number';
      num.innerHTML = index + 1;
      code.className = 'sk-code-line-content ' + lang;
      code.innerHTML = setIndentLength(indent) + hljs.highlight(lang, line).value;

      if (showLines) {
        pre.appendChild(num);
      }

      pre.appendChild(code);
      pre.appendChild(nl);
    });

    this.parentNode.insertBefore(element, this);
  }
});
