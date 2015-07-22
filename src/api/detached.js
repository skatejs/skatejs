import apiWatch from './watch';

export default function (elem, name, func) {
  apiWatch(elem, function (added, removed) {
    for (let a = 0; a < removed.length; a++) {
      func(removed[a]);
    }
  });
}
