import isProduction from './is-production';

export default function deprecated (elem, oldUsage, newUsage) {
  if (!isProduction) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}
