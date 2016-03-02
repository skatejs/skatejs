'use strict';

import version from './version';

const VERSION = `__skate_${version.replace(/[^\w]/g, '_')}`;

if (!window[VERSION]) {
  window[VERSION] = {
    observer: undefined,
    registry: {}
  };
}

export default window[VERSION];
