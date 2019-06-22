import WeakMap from "./weak-map.js";

// @ts-ignore
const map = new WeakMap();

export default function(elem) {
  let events = map.get(elem);
  events || map.set(elem, (events = {}));
  return events;
}
