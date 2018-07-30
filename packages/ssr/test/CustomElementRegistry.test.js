import { CustomElementRegistry } from '../register/CustomElementRegistry';

const customElements = new CustomElementRegistry();

test('define() should invoke observedAttributes', () => {
  const spy = jest.fn();
  class CustomElement extends HTMLElement {
    static get observedAttributes() {
      return spy();
    }
  }
  customElements.define('x-test', CustomElement);
  expect(spy).toHaveBeenCalledTimes(1);
});
