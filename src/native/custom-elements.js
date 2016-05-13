import registerElement from './register-element';

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
const definitions = {};

export default window.customElements || {
  define (name, Ctor) {
    if (definitions[name]) {
      throw new Error(`A Skate component with the name of "${name}" already exists.`);
    }

    // Screen non-native names and try and be more helpful than native.
    if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
      throw new Error(`${name} is not a valid custom element name. A custom element name must: ${customElementCriteria.map(a => `\n- ${a}`).join('')}`);
    }

    // Support legacy Blink.
    if (registerElement) {
      // Blink is picky about options.
      const nativeDefinition = { prototype: Ctor.prototype };

      // Only set extends if the user specified it otherwise Blink complains
      // even if it's null.
      if (Ctor.extends) {
        nativeDefinition.extends = Ctor.extends;
      }

      registerElement(name, nativeDefinition);
    }

    // Actually register.
    definitions[name] = Ctor;
  },
  get (name) {
    return definitions[name];
  }
};
