import data from '../util/data';
import findElementInRegistry from '../util/find-element-in-registry';

function ready (element) {
  const component = findElementInRegistry(element);
  return component && data(element).created;
}

export default function (elem, done) {
  if (ready(elem)) {
    done(elem);
  } else {
    const info = data(elem);
    if (info.readyCallbacks) {
      info.readyCallbacks.push(done);
    } else {
      info.readyCallbacks = [done];
    }
  }
}
