const NodeEnvironment = require('jest-environment-node');
const undom = require('undom');
require('./register');

module.exports = class extends NodeEnvironment {
  constructor(config) {
    super(config);
    const window = undom().defaultView;
    Object.getOwnPropertyNames(global).forEach(n => (window[n] = global[n]));
    Object.assign(this.context, window, { window });
  }
  setup() {
    return Promise.resolve();
  }

  // Jest@21 uses `dispose` Jest@22 uses `teardown`.
  // To support both we provide both.
  // See the Jest@22 Changelog: https://github.com/facebook/jest/blob/master/CHANGELOG.md#features-3
  teardown() {
    return Promise.resolve();
  }
  dispose() {
    return this.teardown();
  }
};
