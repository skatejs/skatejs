let counter = 0;
export default function createSymbol (description) {
  return typeof Symbol === 'function' ? Symbol(description) : `____skate_symbol_${description || (++counter)}`;
}
