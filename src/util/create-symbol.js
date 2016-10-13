export default function createSymbol (description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}
