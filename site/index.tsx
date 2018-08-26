import './fills/history';
import App from './components/app';

// If we generate a unique name for the app shell, then when every thing is
// hot-module-reloaded, it will re-render the entire app which causes issues
// with routing and makes HMR pointless.
if (!document.querySelector('x-app').shadowRoot) {
  customElements.define('x-app', App);
}
