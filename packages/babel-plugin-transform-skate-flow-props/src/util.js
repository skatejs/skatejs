function getBinding(path, name) {
  const { scope } = path;
  if (scope && scope.bindings) {
    return scope.bindings[name];
  }
}

function lookupBinding(path, name) {
  let binding;
  let parent = path;
  while (parent) {
    binding = getBinding(parent, name);
    if (binding) {
      return binding;
    }
    parent = parent.parentPath;
  }
}

module.exports = {
  getBinding,
  lookupBinding
};
