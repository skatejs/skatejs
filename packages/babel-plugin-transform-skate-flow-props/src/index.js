// @flow

const t = require('babel-types');
const { convert } = require('./converters');

/*::
type Path = {
  insertAfter: {} => {}, 
  isClassProperty: () => {},
  get: string => *,
  node: { computed: boolean, key: { name: string }, static: boolean },
  traverse: {} => {}
};

type PluginOptions = {};

type State = {
  opts: PluginOptions
};
*/

function isPropsClassProperty(path /*: Path*/) {
  return (
    path.isClassProperty() &&
    !path.node.computed &&
    !path.node.static &&
    path.node.key.name === 'props'
  );
}

function findPropsClassProperty(classBody /*: Path*/) /*: Path | false*/ {
  for (let item of classBody.get('body')) {
    if (isPropsClassProperty(item)) {
      return item;
    }
  }
  return false;
}

function ClassDeclaration(path) {
  const props = findPropsClassProperty(path.get('body'));
  if (!props) {
    return;
  }

  const typeAnnotation = props.get('typeAnnotation');
  if (!typeAnnotation.node) {
    return;
  }

  const objectExpression = convert(typeAnnotation.get('typeAnnotation'));
  const propsClassProperty = Object.assign(
    t.classProperty(t.identifier('props'), objectExpression),
    { static: true }
  );

  props.insertAfter(propsClassProperty);
}

const ClassExpression = ClassDeclaration;

module.exports = () => {
  return {
    name: 'skate-flow-props',
    visitor: {
      Program(path /*: Path */, state /*: State */) {
        path.traverse({ ClassDeclaration, ClassExpression });
      }
    }
  };
};
