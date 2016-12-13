const production = 'production';
const environment = process.env.NODE_ENV || production;

export default function deprecated (elem, oldUsage, newUsage) {
  if (environment !== production) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}
