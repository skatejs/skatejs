const nativeHints = [
  'native code',
  '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
export default fn => nativeHints.map(
  (hint) => (fn || '').toString().indexOf([hint]) > -1
).reduce((a, b) => a || b);
