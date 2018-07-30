// @flow

import { define } from 'skatejs';
import { Component } from './component';

export const withLoadable = (props: Object) =>
  define(
    class extends Component {
      static is = props.is;
      props: {
        format: any,
        loader: any,
        loading: any,
        useShadowRoot: boolean
      };
      renderRoot: HTMLElement;
      state: {
        loaded: boolean
      };
      props = props;
      get renderRoot() {
        return props.useShadowRoot ? this.renderRoot : this;
      }
      connecting() {
        const loaded = this.props.loading;
        if (loaded) {
          this.state = { loaded };
        }
        if (this.props.loader) {
          this.props.loader().then(r => {
            const loaded = r.default || r;
            if (loaded) {
              this.state = { loaded };
            }
          });
        }
      }
      render() {
        const { loaded } = this.state;
        return this.$`${typeof loaded === 'function' ? new loaded() : loaded}`;
      }
    }
  );
