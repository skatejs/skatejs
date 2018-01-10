'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _class, _temp;

var _skatejs = require('skatejs');

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function format(src) {
  src = src.replace(/"/g, '&quot;');

  // Remove leading newlines.
  src = src.split('\n');

  // Get the initial indent so we can remove it from subsequent lines.
  const indent = src[1] ? src[1].match(/^\s*/)[0].length : 0;

  // Format indentation.
  src = src.map(s => s.substring(indent));

  // Re-instate newline formatting.
  return src.join('\n');
}

exports.default = (0, _skatejs.define)(
  ((_temp = _class = class extends (0, _skatejs.withComponent)() {
    render({ css, renderers, src }) {
      const renderer = new _marked2.default.Renderer();
      Object.assign(renderer, renderers);
      return `
      <style>${css}></style>
      ${(0, _marked2.default)(format(src), { renderer })}
    `;
    }
  }),
  (_class.is = 'sk-marked'),
  (_class.props = {
    css: _skatejs.props.string,
    renderers: _skatejs.props.object,
    src: _skatejs.props.string
  }),
  _temp)
);
