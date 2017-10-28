// @flow

import type { WithLifecycle } from './types';

import { prop } from './util/index';

export const withLifecycle = (
  Base: Class<any> = HTMLElement
): Class<WithLifecycle> =>
  class extends Base {
    connectedCallback() {
      this.willMount && this.willMount();
      super.connectedCallback && super.connectedCallback();
      this.didMount && this.didMount();
    }
    disconnectedCallback() {
      this.willUnmount && this.willUnmount();
      super.disconnectedCallback && super.disconnectedCallback();
      this.didUnmount && this.didUnmount();
    }
  };
