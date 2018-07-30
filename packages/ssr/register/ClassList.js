// TODO performance test and update this from class accessors instead.
function set(list) {
  return new Set((list._elem.className || '').split(' '));
}

class ClassList {
  constructor(elem) {
    this._elem = elem;
  }
  add(name) {
    set(this).add(name);
    return this;
  }
  contains(name) {
    return set(this).has(name);
  }
  remove(name) {
    set(this).delete(name);
    return this;
  }
}

module.exports = {
  ClassList
};
