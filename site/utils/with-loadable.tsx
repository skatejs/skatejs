import { Component, h } from './component';

export const withLoadable = (props: { loader: Function; loading: Object }) =>
  class extends Component {
    static props = {
      props: Object,
      state: Object
    };
    props: {} = {};
    state: { loaded: Object } = { loaded: null };
    loader: Function = props.loader;
    loading: Object = props.loading;
    updated() {
      if (!this.state.loaded && this.loader) {
        this.loader().then(r => {
          const loaded = r.default || r;
          if (loaded) {
            this.state = { loaded };
          }
        });
      }
    }
    render() {
      const Comp = this.state.loaded || this.loading;
      return <Comp props={this.props} />;
    }
  };
