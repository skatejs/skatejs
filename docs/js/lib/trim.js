define(function() {
  return function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  };
});
