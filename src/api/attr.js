import chain from './chain';

class Attr {
  constructor (value) {
    this.created = chain();
    this.updated = chain();
    this.removed = chain();
    this.value = value;
  }

  compile () {
    return (element, diff) => {
      this[diff.type](element, diff);
    };
  }

  on (lifecycle, callback) {
    lifecycle.split(' ').forEach((name) => {
      this[name] = chain(this[name], callback);
    });
    return this;
  }

  value (value) {
    this.value = value;
    return this;
  }
}

export default function () {
  return new Attr();
}
