var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

import React from 'react';
import { render } from 'react-dom';
import { withRenderer } from 'skatejs';

const withReact = (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return _extends({}, super.props, {
        children: React.createElement('slot', null)
      });
    }
    renderer(root, call) {
      render(call(), root);
    }
  };

export default withReact;

export const wrap = Component =>
  class extends withReact() {
    render() {
      return React.createElement(Component, this.props);
    }
  };
