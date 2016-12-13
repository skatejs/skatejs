export default function deprecated (elem, oldUsage, newUsage ) {
  const ownerName = elem.localName ? elem.localName : String(elem);
  console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
}
