import assign from 'object-assign';

function get (elem) {
  const props = elem.constructor.properties;
  const state = {};
  for (let key in props) {
    const val = elem[key];
    if (typeof val !== 'undefined') {
      state[key] = val;
    }
  }
  return state;
}

function set (elem, newState) {
  assign(elem, newState);
  elem.constructor.render(elem);
}

export default function (elem, newState) {
  return typeof newState === 'undefined' ? get(elem) : set(elem, newState);
}
