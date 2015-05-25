import nativeCreateElement from '../util/native-create-element';
import polyfillCreateElement from '../polyfill/create-element';
import supportsCustomElements from '../support/custom-elements';

export default supportsCustomElements() ?
  nativeCreateElement :
  polyfillCreateElement;
