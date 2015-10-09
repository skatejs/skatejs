import data from '../util/data';
import registry from '../global/registry';

function ready (element) {
  const components = registry.find(element);
  const componentsLength = components.length;
  for (let a = 0; a < componentsLength; a++) {
    if (!data(element, `lifecycle/${components[a].id}`).created) {
      return false;
    }
  }
  return true;
}

export default function (elements, callback) {
  const collection = elements.length === undefined ? [elements] : elements;
  const collectionLength = collection.length;

  if (!collectionLength) {
    return elements;
  }

  let readyCount = 0;

  for (let a = 0; a < collectionLength; a++) {
    const elem = collection[a];

    if (ready(elem)) {
      ++readyCount;
    } else {
      elem.addEventListener('skate.ready', function () {
        ++readyCount;

        // Check on every completion to see if we're done.
        if (readyCount === collectionLength) {
          callback(elements);
        }
      });
    }
  }

  // If they're ready immediately, then execute.
  if (readyCount === collectionLength) {
    callback(elements);
  }

  return elements;
}
