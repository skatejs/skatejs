import 'file-loader!./index.html';
import '!file-loader?name=ce-es5-shim.js!./ce-es5-shim.js';
import '!file-loader?name=404.html!./index.html';
import './fills';
import('./components/app').then(App => {
  document.getElementById('app').appendChild(new App.default());
});
