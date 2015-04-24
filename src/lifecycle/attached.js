import data from '../utils/data';
import elementContains from '../utils/element-contains';

export default function (options) {
  return function () {
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.attached) {
      return;
    }

    targetData.attached = true;
    targetData.detached = false;

    if (options.attached) {
      options.attached(element);
    }
  };
}
