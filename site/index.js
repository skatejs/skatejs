import 'file-loader!./index.html';
import 'skatejs-web-components';
import App from './components/app';

document.getElementById('app').appendChild(new App());
