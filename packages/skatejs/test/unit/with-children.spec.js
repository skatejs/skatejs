// @flow
/* @jsx h */
/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { define, name, withChildren } from '../../src';

const Elem = define(class extends withChildren() {
  static is = name();
  childrenUpdated() {
    ++this.called;
  }
});

test('no children', done => {
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

test('children added before mount', done => {
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

test('children added after mount', done => {
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

test('sets children prop if exists', done => {
  const Elem = define(class extends withChildren() {
    static is = name();
    props = { children: null };
  });
  const { node } = mount(<Elem />);
  node.appendChild(<div />);
  setTimeout(() => {
    expect(node.children).toEqual(node.props.children);
    done();
  });
});
