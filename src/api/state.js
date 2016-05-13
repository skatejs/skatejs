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

export default function (elem, newState) {
  return typeof newState === 'undefined' ? get(elem) : assign(elem, newState);
}
