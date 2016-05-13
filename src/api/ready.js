import customElements from '../native/custom-elements';
import data from '../util/data';

function ready (element) {
  const component = customElements.get(element.tagName.toLowerCase());
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
