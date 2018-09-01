import execa from 'execa';

export default function(...args) {
  return execa(...args).catch(console.log);
}
