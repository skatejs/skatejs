var _class, _temp;

import { define, props, withComponent } from 'skatejs';
import marked from 'marked';

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

export default define(
  ((_temp = _class = class extends withComponent() {
    render({ css, renderers, src }) {
      const renderer = new marked.Renderer();
      Object.assign(renderer, renderers);
      return `
      <style>${css}></style>
      ${marked(format(src), { renderer })}
    `;
    }
  }),
  (_class.is = 'sk-marked'),
  (_class.props = {
    css: props.string,
    renderers: props.object,
    src: props.string
  }),
  _temp)
);
