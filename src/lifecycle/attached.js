import data from '../utils/data';
import elementContains from '../utils/element-contains';
import forEachComponent from './for-each-component';

export default forEachComponent(function (element, options) {
  var targetData = data(element, options.id);

  if (targetData.attached) {
    return;
  }

  if (!elementContains(document, element)) {
    return;
  }

  targetData.attached = true;
  targetData.detached = false;

  if (options.attached) {
    options.attached(element);
  }
});
