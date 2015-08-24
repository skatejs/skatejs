import skate from './index';

var previousSkate = window.skate;
function noConflict () {
  window.skate = previousSkate;
  return this;
}

skate.noConflict = noConflict;
window.skate = skate;

export default skate;
