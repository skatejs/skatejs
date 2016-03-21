export default function dispatch (elem, cEvent) {
  if (!elem.disabled) {
    return elem.dispatchEvent(cEvent);
  }
  cEvent.isPropagationStopped = true;
}