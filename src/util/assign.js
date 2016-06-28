const assign = Object.assign;
export default assign ? assign.bind(Object) : function (obj, ...args) {
  args.forEach(arg => Object.keys(arg).forEach(name => obj[name] = arg[name]));
  return obj;
};
