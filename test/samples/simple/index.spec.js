import { mount } from '@skatejs/bore';
import './';

describe('samples/simple', () => {
  it('renders what we expect', () => {
    const el = document.createElement('hello-simple');
    return mount(el).wait(e => {
      expect(e.shadowRoot.innerHTML).toBe('Hello, <slot></slot>!');
    });
  });
});
