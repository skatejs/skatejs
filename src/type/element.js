const documentCreateElement = document.createElement.bind(document);

export default {
  create (Ctor) {
    const elem = Ctor.extends ? documentCreateElement(Ctor.extends, Ctor.id) : documentCreateElement(Ctor.id);
    !Ctor.isNative && Ctor.extends && elem.setAttribute('is', Ctor.id);
    return elem;
  },
  filter (elem, defs) {
    var attrs = elem.attributes;
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tagName = (elem.tagName || elem.localName).toLowerCase();
    var definition = defs[isAttrValue || tagName];

    if (!definition) {
      return;
    }

    var tagToExtend = definition.extends;
    if (isAttrValue) {
      if (tagName === tagToExtend) {
        return [definition];
      }
    } else if (!tagToExtend) {
      return [definition];
    }
  }
};
