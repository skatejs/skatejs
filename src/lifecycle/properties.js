import { EVENT_PREFIX } from '../constants';
import dashCase from '../util/dash-case';
import data from '../util/data';
import notify from './notify';
import property from './property';

export default function (elem, props = {}) {
  var attributeToPropertyMap = data(elem).attributeToPropertyMap = {};

  Object.keys(props).forEach(function (name) {
    var prop = props[name];

    if (!prop) {
      return;
    }

    Object.defineProperty(elem, name, property(name, prop));

    if (prop.attr) {
      attributeToPropertyMap[dashCase(name)] = name;
    }

    if (typeof prop.value === 'function') {
      elem[name] = prop.value();
    } else if (typeof prop.value !== 'undefined') {
      elem[name] = prop.value;
    }

    (prop.deps || []).forEach(
      dependency => elem.addEventListener(
        `${EVENT_PREFIX}${dependency}`,
        notify.bind(null, elem, name)
      )
    );
  });
}
