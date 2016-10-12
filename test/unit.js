
const reqTests = require.context('./unit', true, /^.*\.js$/);
require('skatejs-web-components');
require('./boot');
reqTests.keys().map(reqTests);
