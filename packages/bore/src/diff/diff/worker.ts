import diff from './main';

self.addEventListener('message', e => {
  const instructions = diff.apply(null, e.data);
  // @ts-ignore
  self.postMessage(instructions);
});
