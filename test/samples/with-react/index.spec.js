/* eslint-env jest */

import { mount } from '@skatejs/bore';
import './';

describe('samples/with-react', () => {
  it('renders what we expect', () => {
    let el = document.createElement('with-react');
    mount(el).wait(e => {
      expect(e.shadowRoot.innerHTML).toMatchSnapshot();
    });
  });

  it('renders props contents', () => {
    const el = document.createElement('with-react');
    el.name = 'World';
    mount(el).wait(e => {
      expect(e.shadowRoot.innerHTML).toMatchSnapshot();
    });
  });
});
