import charm from 'charm';

const ch = charm();
ch.pipe(process.stdout);
ch.goto = function(pos /*: 'start' | 'end' */) {
  return this[pos === 'start' ? 'left' : 'right'](100000);
};

export default ch;
