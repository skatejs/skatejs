module.exports = ({ renderer }) => ({
  name: 'package.json',
  dependencies: {
    '@skatejs/element': 'latest',
    ...(renderer
      ? {
          [`@skatejs/element-${renderer}`]: 'latest'
        }
      : {})
  },
  devDependencies: {
    '@skatejs/ssr': 'latest',
    bore: 'latest'
  }
});
