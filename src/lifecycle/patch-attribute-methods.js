export default function patchAttributeMethods (elem) {
  const { removeAttribute, setAttribute } = elem;

  elem.removeAttribute = function (name) {
    const oldValue = this.getAttribute(name);
    removeAttribute.call(elem, name);
    if (elem.attributeChangedCallback) {
      elem.attributeChangedCallback(name, oldValue, null);
    }
  };

  elem.setAttribute = function (name, newValue) {
    const oldValue = this.getAttribute(name);
    setAttribute.call(elem, name, newValue);
    if (elem.attributeChangedCallback) {
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    }
  };
}
