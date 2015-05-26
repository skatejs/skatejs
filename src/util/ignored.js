import { ATTR_IGNORE } from '../constants';

export default function (element) {
  var attrs = element.attributes;
  return attrs && !!attrs[ATTR_IGNORE];
}
