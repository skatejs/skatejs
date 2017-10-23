import { h as preactH } from 'preact';
import { define, props, withComponent } from '../../src';
import withPreact from '@skatejs/renderer-preact/umd';

export const Component = class extends withComponent(withPreact()) {
  propsChangedCallback(...args) {
    return this.componentShouldUpdateCallback(...args);
  }
  propsUpdatedCallback(...args) {
    return this.componentUpdatedCallback(...args);
  }
};

function args(fn) {
  return fn
    .toString()
    .match(/\(([^)]*)\)/)[1]
    .split(',')
    .map(name => name.split('=')[0].trim());
}

export function component(renderCallback) {
  return define(
    class extends Component {
      static props = args(renderCallback).reduce((prev, curr) => {
        prev[curr] = null;
        return prev;
      }, {});
      renderCallback() {
        return renderCallback(this);
      }
    }
  );
}

export const h = preactH;
