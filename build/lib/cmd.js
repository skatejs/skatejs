module.exports = function () {
  return [].slice.call(arguments).filter(Boolean).join(' && ');
};
