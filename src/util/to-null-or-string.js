import empty from './empty';
/**
 * Attributes value can only be null or string;
 */
const toNullOrString = val => (empty(val) ? null : String(val));

export default toNullOrString;
