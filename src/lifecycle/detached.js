import data from '../utils/data';
import elementContains from '../utils/element-contains';
import ignored from '../utils/ignored';

export default function (options) {
  return function () {
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.detached || ignored(element) || elementContains(document, element)) {
      return;
    }

    targetData.detached = true;

    if (options.detached) {
      options.detached(element);
    }

    targetData.attached = false;
  };
}
