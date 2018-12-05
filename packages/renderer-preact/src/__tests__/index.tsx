/* @jsx h */

import { wait } from '@skatejs/bore';
import define, { getName } from '@skatejs/define';
import { h } from 'preact';
import Component from '..';

const Test = define(
  class extends Component {
    static props = { name: String };
    name: string = 'World';
    render() {
      // @ts-ignore
      return <TestHello>{this.name}</TestHello>;
    }
  }
);

// This tests to ensure our Preact mods will auto-define and use the name of
// the auto-defined component when using a constructor as a node name.
class TestHello extends Component {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}

function testContent(text) {
  const name = getName(TestHello);
  return `<${name}>${text}</${name}>`;
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
