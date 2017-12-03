// @flow

import { html } from 'lit-html/lib/lit-extended';
import { define, props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';

export class Component extends withComponent(withLitHtml()) {
  $ = html;
}

export function style(...css) {
  return html`<style textContent="${css.join('')}"></style>`;
}

export function component(render: Function, props: Array<string> = []) {
  class Comp extends Component {
    static props = props.reduce((prev, curr) => {
      prev[curr] = { attribute: { source: true } };
      return prev;
    }, {});
    render() {
      return render.call(this, ...props.map(n => this[n]));
    }
  }

  // Allows the component to have a tag name hint based off the render function
  // name.
  Object.defineProperty(Comp, 'name', {
    configurable: true,
    value: render.name
  });

  return define(Comp);
}

export const withLoadable = (opts: Object) =>
  define(
    class Loadable extends Component {
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
        return this.useShadowRoot ? super.renderRoot : this;
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
