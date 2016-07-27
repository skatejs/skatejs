import 'webcomponents.js/CustomElements';
import helperFixture from './lib/fixture';

mocha.setup({ timeout: 10000 });

afterEach(function () {
  // Ensure perf tests have enough time to cleanup after themselves.
  this.timeout(120000);
  helperFixture('');
});
