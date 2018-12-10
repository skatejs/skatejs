const path = require('path');
const vm = require('vm');
const { execFile } = require('../util');

function trigger(obj, data) {
  if (obj.onmessage) {
    obj.onmessage({ data });
  }
}

const context = {
  onmessage: null,
  postMessage(msg) {
    trigger(this, msg);
  }
};

class Worker {
  constructor(file) {
    execFile(file, { context });
  }
  postMessage(msg) {
    trigger(this, msg);
  }
}

module.exports = Worker;
