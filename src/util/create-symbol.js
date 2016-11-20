//@flow
export default function createSymbol (description:string):Symbol|string {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}
