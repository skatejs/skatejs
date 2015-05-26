export default function (str) {
  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
    var dash = !one || idx % 2 === 0 ? '' : '-';
    return `${one}${dash}${two.toLowerCase()}`;
  });
}
