import data from '../util/data';
import registry from '../shared/registry';

function ready (element) {
  const component = registry.find(element);
  return !component || data(element, `lifecycle/${component.id}`).created;
}

export default function (elements, callback) {
  const collection = elements.length === undefined ? [elements] : elements;
  const collectionLength = collection.length;
  let readyCount = 0;

  function callbackIfReady () {
    if (readyCount === collectionLength) {
      callback(elements);
    }
  }

  for (let a = 0; a < collectionLength; a++) {
    const elem = collection[a];

    if (ready(elem)) {
      ++readyCount;
    } else {
      // skate.ready is only fired if the element has not been initialised yet.
      elem.addEventListener('skate.ready', function () {
        ++readyCount;
        callbackIfReady();
      });
    }
  }

  // If the elements are all ready by this time that means nothing was ever
  // bound to skate.ready above.
  callbackIfReady();
}
