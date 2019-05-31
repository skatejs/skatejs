module.exports = ({ component }) => [
  require('./package'),
  component ? require('./package-component') : null
];
