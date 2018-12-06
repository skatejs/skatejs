/** @jsx React.createElement */

import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import * as React from 'react';
import Element from '..';

const Test = define(
  class extends Element {
    static props = { name: String };
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
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual('');

  document.body.appendChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('World'));

  el.name = 'Bob';
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent('Bob'));

  document.body.removeChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual('');
});
