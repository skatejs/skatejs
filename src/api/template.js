export default function (...args) {
  return function () {
    this.innerHTML = args.join('');
  };
}
