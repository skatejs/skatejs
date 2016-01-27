const documentCreateElement = document.createElement.bind(document);
const reservedNames = [
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
];
const customElementCriteria = [
  'contain at least one dash',
  'not start with a dash',
  `not be one of: ${reservedNames.join(', ')}`
];

export default {
  create (Ctor) {
    const elem = Ctor.extends ? documentCreateElement(Ctor.extends, Ctor.id) : documentCreateElement(Ctor.id);
    if (!Ctor.isNative && Ctor.extends) {
      elem.setAttribute('is', Ctor.id);
    }
    return elem;
  },
  filter (elem, defs) {
    const attrs = elem.attributes;
    const isAttr = attrs.is;
    const isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    const tagName = (elem.tagName || elem.localName).toLowerCase();
    const definition = defs[isAttrValue || tagName];

    if (!definition) {
      return;
    }

    const tagToExtend = definition.extends;
    if (isAttrValue) {
      if (tagName === tagToExtend) {
        return [definition];
      }
    } else if (!tagToExtend) {
      return [definition];
    }
  },
  register (Ctor) {
    const name = Ctor.id;

    // Screen non-native names and try and be more helpful than native.
    if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
      throw new Error(`${name} is not a valid custom element name. A custom element name must: ${customElementCriteria.map(a => `\n- ${a}`).join('')}`);
    }

    // In native, we have to massage the definition so that the browser doesn't
    // spit out errors for a malformed definition.
    if (Ctor.isNative) {
      const nativeDefinition = { prototype: Ctor.prototype };
      Ctor.extends && (nativeDefinition.extends = Ctor.extends);
      document.registerElement(name, nativeDefinition);
    }
  }
};
