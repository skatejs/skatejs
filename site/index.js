import 'file-loader!./index.html';
import '!file-loader?name=ce-es5-shim.js!./ce-es5-shim.js';
import '!file-loader?name=ce-sd-fill.js!./ce-sd-fill.js';
import '!file-loader?name=404.html!./index.html';
import './fills';
import App from './components/app';

document.getElementById('app').appendChild(new App());
