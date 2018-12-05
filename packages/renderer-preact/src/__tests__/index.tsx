/* @jsx h */

import { h } from 'preact';
import Component from '@skatejs/core';
import define from '@skatejs/define';
import renderer from '..';
import { watchFile } from 'fs';

class Base extends Component {
  renderer = renderer;
}

const Test = define(
  class extends Base {
    name: string = 'World';
    render() {
      return <span>Hello, {this.name}!</span>;
    }
  }
);

function testContent(text) {
  return `<span>Hello, ${text}!</span>`;
}

test('renders', async () => {
  const el = new Test();
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('World'));

  el.name = 'Bob';
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('Bob'));

  document.body.removeChild(el);
  el.forceRender();
  expect(el.shadowRoot.innerHTML).toEqual('');
});
