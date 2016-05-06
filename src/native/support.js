import registerElement from './register-element';

const v0 = !!registerElement;
const v1 = !!window.customElements;
const polyfilled = !v0 || !v1;

export default { v0, v1, polyfilled };
