import helperFixture from './lib/fixture';

mocha.setup({ timeout: 10000 }); // eslint-disable-line no-undef

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  mocha.timeout(120000); // eslint-disable-line no-undef
  helperFixture('');
});
