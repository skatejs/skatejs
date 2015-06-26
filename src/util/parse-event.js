export default function (e) {
  var parts = e.split(' ');
  var name = parts.shift();
  var selector = parts.join(' ').trim();
  return {
    name: name,
    isAny: selector[0] === '*',
    isChild: selector[0] === '>',
    selector: selector
  };
}
