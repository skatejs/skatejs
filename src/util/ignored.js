export default function (element) {
  var attrs = element.attributes;
  return attrs && !!attrs['data-skate-ignore'];
}
