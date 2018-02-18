const t = require('babel-types');

const { lookupBinding } = require('./util');

function AnyTypeAnnotation() {
  return t.memberExpression(t.identifier('props'), t.identifier('any'));
}

function GenericTypeAnnotation(path) {
  if (!path.node.typeParameters) {
    return convert(path.get('id'));
  }

  const { name } = path.node.id;

  if (identifierConverters[name]) {
    return identifierConverters[name](path);
  }

  throw new Error(`Unsupported generic type ${name}`);
}

function Identifier(path) {
  const { name } = path.node;
  if (identifierConverters[name]) {
    return identifierConverters[name](path);
  }

  const binding = lookupBinding(path, name);
  if (binding) {
    return convert(binding.path);
  }

  throw new Error(`Unable to convert type for ${name}`);
}

function IdentifierArray() {
  return t.memberExpression(t.identifier('props'), t.identifier('array'));
}

function IdentifierObject() {
  return t.memberExpression(t.identifier('props'), t.identifier('object'));
}

function BooleanTypeAnnotation() {
  return t.memberExpression(t.identifier('props'), t.identifier('boolean'));
}

function MixedTypeAnnotation() {
  return t.memberExpression(t.identifier('props'), t.identifier('any'));
}

function NumberTypeAnnotation() {
  return t.memberExpression(t.identifier('props'), t.identifier('number'));
}

function ObjectTypeAnnotation(path) {
  const props = [];
  for (const property of path.get('properties')) {
    props.push(convert(property));
  }
  return t.objectExpression(props);
}

function ObjectTypeProperty(path) {
  const key = path.get('key');
  const value = path.get('value');
  const convertedKey = t.identifier(key.node.name);
  return t.objectProperty(convertedKey, convert(value));
}

function StringTypeAnnotation() {
  return t.memberExpression(t.identifier('props'), t.identifier('string'));
}

function TypeAlias(path) {
  const right = path.get('right');
  const { type } = right.node;
  if (typeConverters[type]) {
    return typeConverters[type](right);
  }
}

function convert(path) {
  const { type } = path.node;
  const converter = typeConverters[type];
  if (!converter) {
    throw new Error(`No converter for node type: ${type}`);
  }
  return converter(path);
}

const identifierConverters = {
  Array: IdentifierArray,
  Object: IdentifierObject
};

const typeConverters = {
  AnyTypeAnnotation,
  BooleanTypeAnnotation,
  GenericTypeAnnotation,
  Identifier,
  MixedTypeAnnotation,
  NumberTypeAnnotation,
  ObjectTypeAnnotation,
  ObjectTypeProperty,
  StringTypeAnnotation,
  TypeAlias
};

module.exports = {
  convert,
  identifierConverters,
  typeConverters
};
