import compareAttributes from "./attributes.js";
import compareEvents from "./events.js";
import compareProperties from "./properties.js";

export default function(src, tar) {
  if (src.localName === tar.localName) {
    return compareAttributes(src, tar)
      .concat(compareEvents(src, tar))
      .concat(compareProperties(src, tar));
  }
}
