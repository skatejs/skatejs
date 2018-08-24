import './fills/history';
import { name } from 'skatejs';
import App from './components/app';

const app = name();
customElements.define(app, class extends App {});
document.body.innerHTML = `<${app}></${app}>`;
