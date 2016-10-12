import assign from './assign';

function enter (object, props) {
  const saved = {};
  Object.keys(props).forEach((key) => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit (object, saved) {
  assign(object, saved);
}

// Decorates a function with a side effect that changes the properties of an
// object during its execution, and restores them after. There is no error
// handling here, if the wrapped function throws an error, properties are not
// restored and all bets are off.
export default function (object, props) {
  return func => (...args) => {
    const saved = enter(object, props);
    const result = func(...args);
    exit(object, saved);
    return result;
  };
}
