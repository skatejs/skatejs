import { EVENT_PREFIX } from '../constants';
import notify from './notify';
import property from './property';

export default function (elem, props = {}) {
  Object.keys(props).forEach(function (name) {
    var prop = props[name];
    Object.defineProperty(elem, name, property(name, prop));
    (prop && prop.deps || []).forEach(
      dependency => elem.addEventListener(
        `${EVENT_PREFIX}${dependency}`,
        notify.bind(null, elem, name)
      )
    );
  });
}
