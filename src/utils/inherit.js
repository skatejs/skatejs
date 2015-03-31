export default function (child, parent, overwrite) {
  var names = Object.getOwnPropertyNames(parent);
  var namesLen = names.length;

  for (var a = 0; a < namesLen; a++) {
    var name = names[a];

    if (overwrite || child[name] === undefined) {
      var desc = Object.getOwnPropertyDescriptor(parent, name);

      // Attempting to check the "configurable" property as to whether or not
      // the property can be redefined doesn't work because sometimes it is
      // true for properties that cannot be defined. This seems to be the case
      // with internal properties that may not be defined as properties using
      // this method.
      try {
        Object.defineProperty(child, name, desc);
      } catch (e) {}
    }
  }

  return child;
}
