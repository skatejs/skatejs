const OldHtmlElement = window.HTMLElement;
const NewHtmlElement = function(...args) {
  if (typeof Reflect === 'object') {
    return Reflect.construct(OldHtmlElement, args, this.constructor);
  }
};
Object.defineProperty(NewHtmlElement, 'constructor', {
  configurable: true,
  value: HTMLElement
});
NewHtmlElement.prototype = OldHtmlElement.prototype;
window.HTMLElement = NewHtmlElement;
