import utilCreateElement from '../util/create-element';
import utilRegisterElement from '../util/register-element';

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
    const elem = Ctor.extends ? utilCreateElement(Ctor.extends, Ctor.id) : utilCreateElement(Ctor.id);
    if (!Ctor.isNative && Ctor.extends) {
      elem.setAttribute('is', Ctor.id);
    }
    return elem;
  },
  reduce (elem, defs) {
    const tagName = elem.tagName;
    const tagNameLc = tagName && tagName.toLowerCase();
    if (tagNameLc in defs) {
      return defs[tagNameLc];
    }

    const attributes = elem.attributes;
    const isAttributeNode = attributes && attributes.is;
    const isAttributeValue = isAttributeNode && isAttributeNode .value;
    if (isAttributeValue in defs) {
      return defs[isAttributeValue];
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
      utilRegisterElement(name, nativeDefinition);
    }
  }
};
