const reqTests = require.context('./unit', true, /^.*\.js$/);
require('./boot');
reqTests.keys().map(reqTests);
