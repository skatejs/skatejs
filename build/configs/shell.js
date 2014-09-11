module.exports = function (grunt) {
  return {
    dist: {
      command: [
        'rm -rf dist',
        'mkdir dist',
        './node_modules/traceur/traceur-build --out dist/skate.js --script src/skate.js'
      ].join(' && ')
    }
  };
};
