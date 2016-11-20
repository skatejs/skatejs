//@flow
import data from './data';

/**
 * Returns the data bag for given element and property name
 */
export default function getPropData (elem:any, name:string|Symbol):any {
  const elemPropsData = data(elem, 'props');
  return elemPropsData[name] || (elemPropsData[name] = {});
}
