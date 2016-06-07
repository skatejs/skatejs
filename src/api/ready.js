import data from '../util/data';

export default function (elem, done) {
  const info = data(elem);
  if (elem.hasAttribute(elem.constructor.definedAttribute)) {
    done(elem);
  } else if (info.readyCallbacks) {
    info.readyCallbacks.push(done);
  } else {
    info.readyCallbacks = [done];
  }
}
