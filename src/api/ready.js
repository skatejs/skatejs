import data from '../util/data';
import registry from '../shared/registry';

function ready (element) {
  const component = registry.find(element);
  return component && data(element).created;
}

export default function (elements, callback) {
  const collection = elements.length === undefined ? [elements] : elements;
  const collectionLength = collection.length;
  let readyCount = 0;

  function callbackIfReady () {
    ++readyCount;
    if (readyCount === collectionLength) {
      callback(elements);
    }
  }

  for (let a = 0; a < collectionLength; a++) {
    const elem = collection[a];

    if (ready(elem)) {
      callbackIfReady();
    } else {
      const info = data(elem);
      if (info.readyCallbacks) {
        info.readyCallbacks.push(callbackIfReady);
      } else {
        info.readyCallbacks = [callbackIfReady];
      }
    }
  }
}
