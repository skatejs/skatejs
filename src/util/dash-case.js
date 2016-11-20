//@flow
export default function (str:string):string {
  return str.split(/([A-Z])/).reduce((one, two, idx) => {
    const dash:string = !one || idx % 2 === 0 ? '' : '-';
    return `${one}${dash}${two.toLowerCase()}`;
  });
}
