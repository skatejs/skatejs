// TODO performance test and update this from class accessors instead.
function set(list) {
  const classList =
    (list._elem.className && list._elem.className.split(' ')) || [];
  return new Set(classList);
}

class ClassList {
  constructor(elem) {
    this._elem = elem;
  }
  add(name) {
    const classList = set(this).add(name);
    this._elem.className = Array.from(classList).join(' ');
    return this;
  }
  contains(name) {
    return set(this).has(name);
  }
  remove(name) {
    const classList = set(this);
    classList.delete(name);

    this._elem.className = Array.from(classList).join(' ');
    return this;
  }
}

module.exports = ClassList;
