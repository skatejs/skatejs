import data from '../util/data';
import registry from '../global/registry';

function ready (element) {
  const components = registry.find(element);
  for (let a = 0; a < components.length; a++) {
    if (!data(element, `lifecycle/${components[a].id}`).created) {
      return false;
    }
  }
  return true;
}

export default function (elements, callback) {
  // If a selector is provided we convert it to to a collection of elements.
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // Ensure the collection is traversable.
  const collection = elements.length === undefined ? [elements] : elements;
  const collectionLength = collection.length;

  // If there's no elements we don't do anything.
  if (!collection.length) {
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
