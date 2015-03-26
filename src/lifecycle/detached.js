import data from '../utils/data';
import elementContains from '../utils/element-contains';
import forEachComponent from './for-each-component';

export default forEachComponent(function (element, options) {
  var targetData = data(element, options.id);

  if (targetData.detached) {
    return;
  }

  if (elementContains(document, element)) {
    return;
  }

  targetData.detached = true;

  if (options.detached) {
    options.detached(element);
  }

  targetData.attached = false;
});
