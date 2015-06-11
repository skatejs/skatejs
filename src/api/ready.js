export default function (callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
