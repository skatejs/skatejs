const execa = require('execa');

export default function(...args) {
  return execa(...args).catch(console.log);
}
