// @flow

declare module 'preact' {
  declare export function h (a: Function | string, b: Object, ...c: Array<Object>): Object
  declare export function render (a: () => Object, b: Node, c?: Object): Object
}
