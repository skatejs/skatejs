// Copies the index.html file.
import 'file-loader!./index.html';

// Copies the index.html to 404.html for GitHub pages / Netlify.
import '!file-loader?name=404.html!./index.html';

import App from './components/app';

document.getElementById('app').appendChild(new App());
