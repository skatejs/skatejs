import create from '../../src/api/create';
import skate from '../../src/index';

var counter = 1;

export default function (unsafe) {
  var safe;
  unsafe = unsafe || 'my-element';
  safe = unsafe + (counter++).toString();
  return {
    unsafe: unsafe,
    safe: safe,
    create: create.bind(null, safe),
    skate: skate.bind(null, safe)
  };
}
