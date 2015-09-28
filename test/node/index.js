'use strict';

let jsdom = require('jsdom');
let fs = require('fs');
let virtualConsole = jsdom.createVirtualConsole().sendTo(console);
let baseScripts = [fs.readFileSync(__dirname + '/../../dist/skate.js', 'utf-8')];

function parse (html) {
  return jsdom.jsdom(html, { virtualConsole }).defaultView;
}

module.exports = function (html, userScripts) {
  let scripts = baseScripts.concat(userScripts || []);
  let win = parse(`<head><script type="text/javascript">${scripts.join('\n')}</script></head><body>${html}</body>`);
  let body = win.document.body;
  win.skate.init(body);
  return body.innerHTML;
};
