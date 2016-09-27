/* eslint no-bitwise: 0 */

export default function () {
  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-mixed-operators
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
