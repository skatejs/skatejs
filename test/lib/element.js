import { define } from '../../src/index';

let counter = 1;

export default function (unsafe) {
  var safe;
  unsafe = unsafe || 'my-element';
  safe = `${unsafe}-${(counter++).toString()}`;
  return {
    unsafe: unsafe,
    safe: safe,
    create () { return document.createElement(this.safe); },
    skate: define.bind(null, safe)
  };
}
