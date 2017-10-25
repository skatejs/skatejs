import { h as preactH } from 'preact';
import { define, props, withComponent } from '../../src';
import withPreact from '@skatejs/renderer-preact/umd';

export const Component = class extends withComponent(withPreact()) {
  // Fix API change for renderers.
  propsChangedCallback(...args) {
    return this.componentShouldUpdateCallback(...args);
  }
  // Fix API change for renderers.
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
  const fnArgs = args(renderCallback);
  class Comp extends Component {
    static props = fnArgs.reduce((prev, curr) => {
      prev[curr] = { attribute: { source: true } };
      return prev;
    }, {});
    renderCallback() {
      return renderCallback.call(this, ...fnArgs.map(n => this[n]));
    }
  }

  // Allows the component to have a tag name hint based off the render function
  // name.
  Object.defineProperty(Comp, 'name', {
    configurable: true,
    value: renderCallback.name
  });

  return define(Comp);
}

export const h = preactH;
