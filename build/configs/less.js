module.exports = function (grunt) {
  return {
    docs: {
      files: {
        'docs/build/styles/index.css': 'docs/src/styles/index.less'
      }
    }
  };
};
