//@flow
import empty from './empty';

/**
 * usefull to normalize attribute values returned by elem.getAttribute()
 * and user's implementations of serialize()
 */
export default function (val:any):?string {
  return empty(val) ? null : String(val);
}
