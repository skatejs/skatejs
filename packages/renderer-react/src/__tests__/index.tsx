/* @jsx React.createElement */

import { wait } from '@skatejs/bore';
import define from '@skatejs/define';
import * as React from 'react';
import Component from '..';

const Test = define(
  class extends Component {
    name: string = 'World';
    static props = { name: String };
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
