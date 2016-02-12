// Just in case native document.createElement() was overridden, we ensure we're
// using the native one so that we're not bogged down by any polyfills.
export default Document.prototype.createElement.bind(document);
