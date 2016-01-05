export default function propertiesApply (elem, properties) {
  Object.keys(properties).forEach(function (name) {
    const prop = properties[name];
    const initialValue = elem[name];

    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // When Webkit fixes that bug so that native property we can move defining
    // the property to the prototype and away from having to do if for every
    // instance since all other browsers support accessing native property
    // getters / setters.
    Object.defineProperty(elem, name, prop);

    // This will still be needed to do any setup for the property if it needs
    // any information from the element.
    //
    // Once that bug is fixed, the initial value being passed as the second
    // argument to prop.created() can use the overridden property definition to
    // get the initial value.
    if (typeof prop.created === 'function') {
      prop.created(elem, initialValue);
    }
  });
}
