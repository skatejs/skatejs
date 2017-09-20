const { config, preset } = require('conartist');
const { babel, base, jest, rollup } = preset;

module.exports = config(babel(), base(), jest(), rollup(), {
  'rollup.config.js'() {
    return Object.assign(
      {
        name: 'skate'
      },
      rollup()['rollup.config.js']()
    );
  }
});
