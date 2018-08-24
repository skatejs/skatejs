import { Component, h } from './component';

export const withLoadable = (props: {
  loader: Function;
  loading: Object;
  useShadowRoot?: boolean;
}) =>
  class extends Component {
    static props = {
      props: Object
    };
    state: { loaded?: Object } = {};
    loader: Function = props.loader;
    loading: Object = props.loading;
    get renderRoot() {
      return props.useShadowRoot ? super.renderRoot : this;
    }
    connectedCallback() {
      super.connectedCallback();
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
      const Comp = this.state.loaded ? this.state.loaded : this.loading;
      return <Comp props={this.props} />;
    }
  };
