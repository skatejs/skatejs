import { define, name } from 'skatejs';
import { Component } from './component';

export const withLoadable = (props: {
  loader: Function;
  loading: Object;
  useShadowRoot?: boolean;
}) =>
  define(
    class extends Component {
      static is = name();
      state: { loaded?: Object } = {};
      loader: Function = props.loader;
      loading: Object = props.loading;
      get renderRoot() {
        return props.useShadowRoot ? this.renderRoot : this;
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
        return this.$`${this.state.loaded ? this.state.loaded : props.loading}`;
      }
    }
  );
