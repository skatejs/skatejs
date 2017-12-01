require('babel-register')({
  presets: ['react', 'stage-0'].map(m => require(`babel-preset-${m}`))
});

require('../register');
const render = require('../index');

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/{page*}',
  handler(request, response) {
    const page = path.join(
      __dirname,
      'pages',
      `${request.params.page || 'index'}.js`
    );
    const Page = fs.existsSync(page)
      ? require(page)
      : require('./pages/404.js');
    document.body.innerHTML = '';
    document.body.appendChild(Object.assign(new Page(), request.params));
    return response(render());
  }
});

server.start(err => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
});
