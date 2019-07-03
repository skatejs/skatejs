import { setProps } from "..";

test("setProps", () => {
  const ref = setProps({ test: true });
  const obj = { test: false };
  ref(obj);
  expect(obj.test).toBe(true);
});
