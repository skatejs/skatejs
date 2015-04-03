export default function (child, ...parents) {
  parents.forEach(function (parent) {
    Object.getOwnPropertyNames(parent).forEach(function (name) {
      var childDesc = Object.getOwnPropertyDescriptor(child, name);
      if (!childDesc || childDesc.configurable) {
        Object.defineProperty(child, name, Object.getOwnPropertyDescriptor(parent, name));
      }
    });
  });
  return child;
}
