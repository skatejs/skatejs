/* eslint no-console: 0 */
export default function (message) {
  var warn = console && (console.warn || console.log);
  if (warn) {
    warn(message);
  }
}
