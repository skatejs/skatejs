/* eslint-env jest */

import { mount } from '@skatejs/bore';
import './';

describe('samples/with-preact', () => {
  it('renders what we expect', () => {
    let el = document.createElement('with-preact');
    mount(el).wait(e => {
      expect(e.shadowRoot.innerHTML).toBe('<span>Hello, !</span>');
    });
  });

  it('renders props contents', () => {
    const el = document.createElement('with-preact');
    el.name = 'World';
    mount(el).wait(e => {
      expect(e.shadowRoot.innerHTML).toBe('<span>Hello, World!</span>');
    });
  });
});
