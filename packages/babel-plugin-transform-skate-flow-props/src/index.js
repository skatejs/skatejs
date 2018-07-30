// @flow

const t = require('babel-types');
const { convert } = require('./converters');

/*::

type PluginOptions = {};

type State = {
  opts: PluginOptions
};

*/

function isPropsClassProperty(path /*: any */) {
  return (
    path.isClassProperty() &&
    !path.node.computed &&
    !path.node.static &&
    path.node.key.name === 'props'
  );
}

function findPropsClassProperty(classBody /*: any */) /*: {} | false*/ {
  for (let item of classBody.get('body')) {
    if (isPropsClassProperty(item)) {
      return item;
    }
  }
  return false;
}

function ClassDeclaration(path /*: any */) {
  const props /*: any */ = findPropsClassProperty(path.get('body'));
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
      Program(path /*: any */, state /*: State */) {
        path.traverse({ ClassDeclaration, ClassExpression });
      }
    }
  };
};
