/**
 * This is needed to avoid IE11 "stack size errors" when creating
 * a new property on the constructor of an HTMLElement
 */
export default function setCtorNativeProperty (Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}
