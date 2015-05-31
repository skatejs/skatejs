export default class {
  find (elem, selector) {
    return selector ? [].slice.call(elem.querySelectorAll(selector)) : [elem];
  }
}
