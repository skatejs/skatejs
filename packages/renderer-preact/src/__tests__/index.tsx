/* @jsx h */

import { h } from 'preact';
import Component from '@skatejs/core';
import define from '@skatejs/define';
import renderer from '..';

class Base extends Component {
  renderer = renderer;
}

const Test = define(
  class extends Base {
    name: string = '';
    render() {
      return <span>Hello, {this.name}!</span>;
    }
  }
);

function testContent(text) {
  return `<div>Hello, ${text}!</div>`;
}

test('renders', () => {
  const el = new Test();
  expect(el.innerHTML).toEqual('');
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toEqual(testContent('World'));
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toEqual(testContent('Bob'));
});
