/* eslint-env jest */

import { mount } from '@skatejs/bore';
import './';

describe('samples/with-preact', () => {
    xit('renders what we expect', (done) => {
        let el = document.createElement('hello-withpreact');
        mount( el ).wait(e => {
            expect(e.shadowRoot.firstChild.textContent).toBe('Hello, !');
            done();
        });
    });
});
