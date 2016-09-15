// Determine if ES2015 class statics are inherited. In IE 9 and 10 this is not
// supported. This is useful for skipping tests that require ES2015 class
// semantics for statics.
export function classStaticsInheritance() {
  class Base {};
  Base.static = 'static';
  class Subclass extends Base {};
  return Subclass.static === 'static';
};
