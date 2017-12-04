// @flow

import { html } from 'lit-html/lib/lit-extended';
import { define, props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { value } from 'yocss';

export const Component = class extends withComponent(withLitHtml()) {
  $ = html;
  get $style() {
    return style(this.context.style, value(...Object.values(this.css || {})));
  }
};

export function style(...css) {
  return html`<style textContent="${css.join('')}"></style>`;
}

export const withLoadable = (opts: Object) =>
  define(
    class extends Component {
      static is = opts.is;
      props: {
        format: any,
        loader: any,
        loading: any,
        useShadowRoot: boolean
      };
      props = {
        ...{ format: r => r },
        ...opts
      };
      get renderRoot() {
        return opts.useShadowRoot ? super.renderRoot : this;
      }
      connecting() {
        const loaded = this.loading;
        if (loaded) {
          this.state = { loaded };
        }
        if (this.loader) {
          this.loader().then(r => {
            const loaded = r.default || r;
            if (loaded) {
              this.state = { loaded };
            }
          });
        }
      }
      render() {
        const { loaded } = this.state;
        return loaded ? this.format(loaded) : this.$``;
      }
    }
  );
