export default (obj, value) => Object.defineProperty(obj, 'constructor', { enumerable: false, value });
