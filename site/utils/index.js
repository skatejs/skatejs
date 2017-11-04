import { h } from 'preact';
import { define, props, withComponent, withUpdate } from '../../src';
import withPreact from '@skatejs/renderer-preact';

export { h } from 'preact';

// Compatiblity layer for renames.
export const Component = class extends withComponent(withPreact()) {
  childrenUpdated() {
    if (this.childrenChangedCallback) {
      return this.childrenChangedCallback(...args);
    }
    if (super.childrenUpdated) {
      return super.childrenUpdated(...args);
    }
  }
  updating(...args) {
    if (this.propsSetCallback) {
      return this.propsSetCallback(...args);
    }
    if (super.updating) {
      return super.updating(...args);
    }
  }
  shouldUpdate(...args) {
    if (this.propsUpdatedCallback) {
      return this.propsUpdatedCallback(...args);
    }
    if (super.shouldUpdate) {
      return super.shouldUpdate(...args);
    }
  }
  updated(...args) {
    if (this.propsChangedCallback) {
      return this.propsChangedCallback(...args);
    }
    if (super.updated) {
      return super.updated(...args);
    }
  }
  render(...args) {
    if (this.renderCallback) {
      return this.renderCallback(...args);
    }
    if (super.render) {
      return super.render(...args);
    }
  }
  renderCallback(...args) {
    if (super.renderCallback) {
      return super.renderCallback(...args);
    }
    if (super.render) {
      return super.render(...args);
    }
  }
  renderer(...args) {
    if (this.rendererCallback) {
      return this.rendererCallback(...args);
    }
    if (super.renderer) {
      return super.renderer(...args);
    }
  }
  rendered(...args) {
    if (this.renderedCallback) {
      return this.renderedCallback(...args);
    }
    if (super.rendered) {
      return super.rendered(...args);
    }
  }
};

export function component(render, props = []) {
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

const LoadingDefault = component(() => <span>Loading...</span>);

export const withLoadable = ({ loader, loading }) =>
  define(
    class Loadable extends Component {
      props: {
        loader: any,
        Loading: any
      };
      props = {
        loader,
        Loading: loading || LoadingDefault
      };
      updating(props) {
        if (!props || this.loader !== props.loader) {
          this.loader().then(r => {
            this.state = {
              Loaded: r.default || r
            };
          });
        }
      }
      render() {
        const { Loading } = this.props;
        const { Loaded } = this.state;
        return Loaded ? <Loaded.is /> : <Loading.is />;
      }
    }
  );
