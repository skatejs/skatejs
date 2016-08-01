const assign = Object.assign;
export default assign ? assign.bind(Object) : (obj, ...args) => {
  args.forEach(arg => Object.keys(arg).forEach(name => obj[name] = arg[name])); // eslint-disable-line no-return-assign
  return obj;
};
