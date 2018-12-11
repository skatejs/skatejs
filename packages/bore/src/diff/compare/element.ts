import compareAttributes from './attributes';
import compareEvents from './events';
import compareProperties from './properties';

export default function(src, tar) {
  if (src.localName === tar.localName) {
    return compareAttributes(src, tar)
      .concat(compareEvents(src, tar))
      .concat(compareProperties(src, tar));
  }
}
