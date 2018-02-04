/* @flow */

import { define, name, withContext } from '..';

const Base = withContext();

const Test1 = define(
  class extends Base {
    static is = name();
  }
);
const Test2 = define(
  class extends Base {
    static is = name();
  }
);

let test1, test2;
beforeEach(() => {
  test1 = new Test1();
  test2 = new Test2();
  test1.attachShadow({ mode: 'open' });
  test1.shadowRoot.appendChild(test2);
});

test('returns object if no context exists', () => {
  expect(test1.context).toMatchObject({});
  expect(test2.context).toMatchObject({});
});

test('returns context from ancestor', () => {
  const context = { test: true };
  test1.context = context;
  expect(test1.context).toBe(context);
  expect(test2.context).toBe(context);
});
