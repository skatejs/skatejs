import { define, props, withComponent } from 'skatejs';
import marked from 'marked';
import { format } from './utils';

export default define(class extends withComponent() {
  static is = 'sk-marked';
  static props = {
    css: props.string,
    renderers: props.object,
    src: props.string
  };
  render({ css, renderers, src }) {
    const renderer = new marked.Renderer();
    Object.assign(renderer, renderers);
    return `
      <style>${css}></style>
      ${marked(format(src), { renderer })}
    `;
  }
});
