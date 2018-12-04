import { withComponent } from '../component';

test('checks for existing shadow root', () => {
  class MyCustomElWithSr extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  }

  const MyCustomElement = withComponent(MyCustomElWithSr);
  const myCustomElement = new MyCustomElement();
});
