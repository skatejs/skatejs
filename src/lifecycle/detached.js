import data from '../util/data';
import elementContains from '../util/element-contains';

export default function (options) {
  return function () {
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.detached) {
      return;
    }

    targetData.detached = true;

    if (options.detached) {
      options.detached(element);
    }

    targetData.attached = false;
  };
}
