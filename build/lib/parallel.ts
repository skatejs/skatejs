import path from 'path';
import exec from './exec';

export default async function(...args) {
  let code;
  const fn = args.pop();
  const mappedArgs = args.map(a => JSON.stringify(a) || 'null').join(',');
  const iife = code => `
      (async () => {
        const result = await ${code}(${mappedArgs});
        console.log(JSON.stringify(typeof result === 'undefined' ? null : result));
      })();
    `;

  if (typeof fn === 'string') {
    code = iife(`require('${path.resolve(__dirname, fn)}')`);
  } else {
    code = iife(`(${fn.toString()})`);
  }

  return exec('node', ['-e', code])
    .then(s => {
      if (s.stderr) {
        throw s.stderr;
      }
      return JSON.parse(s.stdout || null);
    })
    .catch(console.error);
}
