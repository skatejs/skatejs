import data from './data';

export default function getPropData (elem, name) {
  const elemData = data(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}
