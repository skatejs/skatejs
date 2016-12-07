import { isUndefined } from './is-type';
import root from 'window-or-global';

export default function error (message) {
  const { DEBUG } = root;
  if (!isUndefined(DEBUG) && DEBUG) {
    throw new Error(message);
  }
}
