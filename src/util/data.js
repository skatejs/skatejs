//@flow
/**
 * For the given element returns a default Data Bag or a named Data Bag
 * If the Data Bag didn't exist yet, one is created.
 */
export default function (elem:any, namespace:string = ''):any {
  const data:any = elem.__SKATE_DATA || (elem.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
}
