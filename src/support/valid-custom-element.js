export default function (name) {
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

  return name.indexOf('-') > 0 && name.toLowerCase() === name && reservedNames.indexOf(name) < 0;
}
