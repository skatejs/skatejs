/* @flow */
/* @jsx h */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { define, name, withChildren } from '..';

const { expect, test } = global;

// Very basic implementation so that the withChildren() mixin works.
global.MutationObserver = class {
  callback: Function;
  constructor(callback: Function) {
    this.callback = callback;
  }
  observe(elem) {
    const { callback } = this;
    const oldAppendChild = elem.appendChild;
    elem.appendChild = function(newChild) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(callback);
      return oldAppendChild.call(this, newChild);
    };
  }
};

const Elem = define(
  class extends withChildren(HTMLElement) {
    static is = name();
    childrenUpdated() {
      ++this.called;
    }
  }
);

test('should be called when first connected', done => {
  const node = <Elem />;
  node.called = 0;
  node.appendChild(<div />);
  node.appendChild(<div />);
  mount(node);
  setTimeout(() => {
    expect(node.called).toBe(1);
    done();
  });
});

test('should be called when children are modified', done => {
  const node = <Elem />;
  node.called = 0;
  mount(node);
  node.appendChild(<div />);
  node.appendChild(<div />);
  setTimeout(() => {
    expect(node.called).toBe(2);
    done();
  });
});
