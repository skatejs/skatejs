/** @jsx h */

import { wait } from "@skatejs/bore";
import define, { getName } from "@skatejs/define";
import Element, { h, setProps } from "..";

const Test = define(class extends Element {
  static props = { name: String };
  name: string = "World";
  render() {
    return <TestHello>{this.name}</TestHello>;
  }
});

class TestHello extends Element {
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

test("renders", async () => {
  const el = new Test();
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual("");

  document.body.appendChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent("World"));

  el.name = "Bob";
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual(testContent("Bob"));

  document.body.removeChild(el);
  await wait();
  expect(el.shadowRoot.innerHTML).toEqual("");
});

test("setProps", () => {
  const ref = setProps({ test: true });
  const obj = { test: false };
  ref(obj);
  expect(obj.test).toBe(true);
});
