// @flow
// @jsx h

import { h } from 'preact';
import { define, props, withComponent, withUpdate } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';

export { h } from 'preact';

// Compatiblity layer for renames.
export const Component = withComponent(withPreact());

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
        if (loaded) {
          return this.format(loaded);
        }
      }
    }
  );

export const withLoadablePreact = (opts: Object) =>
  withLoadable({
    ...{
      format: r => {
        const R = r.is || r;
        return <R />;
      }
    },
    ...opts
  });

export const withLoadableStyle = (opts: Object) =>
  withLoadable({ ...{ format: r => <style>{r}</style> }, ...opts });
