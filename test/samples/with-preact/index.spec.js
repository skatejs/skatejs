/* eslint-env jest */

import { mount } from '@skatejs/bore';
import './';

describe('samples/with-preact', () => {
    it('renders what we expect', (done) => {
        let el = document.createElement('hello-withpreact');
        mount( el ).wait(e => {
            expect(e.shadowRoot.firstChild.textContent).toBe('Hello, !');
            expect(e.node.textContent).toBe('');
            done();
        });
    });

    it('renders props contents', (done) => {
        let el = document.createElement('hello-withpreact');
        el.name = 'World';
        mount( el ).wait(e => {
            expect(e.shadowRoot.firstChild.textContent).toBe('Hello, World!');
            expect(e.node.textContent).toBe('');
            done();
        });
    });
});
