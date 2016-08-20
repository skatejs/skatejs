const reqTests = require.context('./unit', true, /^.*\.js$/);

if (!document.registerElement && !window.customElements) {
  /* eslint import/no-extraneous-dependencies: 0, global-require: 0 */
  require('skatejs-web-components');
}

require('./boot');

reqTests.keys().map(reqTests);
