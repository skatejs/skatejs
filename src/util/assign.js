import getPropNamesAndSymbols from './get-prop-names-and-symbols';

// We are not using Object.assign if it is defined since it will cause problems when Symbol is polyfilled.
// Apparently Object.assign (or any polyfill for this method) does not copy non-native Symbols.
export default (obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
};
