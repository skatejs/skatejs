import keys from './get-all-keys';

// We are not using Object.assign if it is defined since it will cause problems when Symbol is polyfilled.
// Apparently Object.assign (or any polyfill for this method) does not copy non-native Symbols.
export default (obj, ...args) => {
  args.forEach(arg => keys(arg).forEach(name => obj[name] = arg[name])); // eslint-disable-line no-return-assign
  return obj;
};
