// @flow

import type { ComposedCustomEvent, WithLink } from './types';

function getValue (elem: WithLink): boolean | string | void {
  const { checked, type, value } = elem;
  if (type === 'checkbox' || type === 'radio') {
    return checked ? value || true : false;
  }
  return value;
}

export function link (elem: WithLink, target: string): Function {
  return (e: ComposedCustomEvent): void => {
    // We fallback to checking the composed path. Unfortunately this behaviour
    // is difficult to impossible to reproduce as it seems to be a possible
    // quirk in the shadydom polyfill that incorrectly returns null for the
    // target but has the target as the first point in the path.
    // TODO revisit once all browsers have native support.
    const localTarget: Object = e.target || (e.composedPath && e.composedPath()[0]);
    const value = getValue(localTarget);
    const localTargetName: string = target || localTarget.name || 'value';

    if (localTargetName.indexOf('.') > -1) {
      const parts = localTargetName.split('.');
      const firstPart = parts[0];
      const propName = parts.pop();
      const obj = parts.reduce((prev: Object, curr: string): Object => prev[curr], elem);

      (obj: any)[propName || localTarget.name] = value;
      (elem: any)[firstPart] = (elem: any)[firstPart];
    } else {
      (elem: any)[localTargetName] = value;
    }
  };
}
