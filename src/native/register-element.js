// This is to only support initial implementations for Blink.
const re = Document.prototype.registerElement;
export default re && re.bind(document);
