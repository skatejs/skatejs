//@flow
export default function (val:any):boolean {
  return typeof val === 'undefined' || val === null;
}
