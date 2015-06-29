import apiChain from './chain';
import event from './event';
import maybeThis from '../util/maybe-this';
import utilData from '../util/data';

function parseDependency (e) {
  var path = e.split('.');
  var name = path.pop();
  return {
    name: name,
    path: path.join('.'),
    paths: path,
    pathname: e,
    eventName: path.length ? `${name} *` : name
  };
}

function observeOne (elem, handler, dependencies) {
  var valueCache = {};

  handler = apiChain(handler);
  dependencies = dependencies.map(parseDependency);

  dependencies.forEach(function (dependency) {
    event(elem, `skate.property.${dependency.eventName}`, function (e) {
      var target = e.target;

      // Check up the tree to make sure all path descriptors match anscestors.
      if (dependency.path) {
        let paths = dependency.paths.slice(0);

        // The target must be a component of the last part in the path.
        if (!(paths[paths.length - 1] in utilData(target))) {
          return;
        }

        // If the first one matches, it must be removed.
        paths.pop();

        // Start at the parent and match each ancestor against each path part.
        let current = e.target.parentNode;
        while (paths.length && current) {
          if (paths[paths.length - 1] in utilData(current)) {
            paths.pop();
          }
          current = current.parentNode;
        }

        // If there were parts that weren't matched, then the property wasn't
        // triggered frome the correct point in the heirarchy.
        if (paths.length) {
          return;
        }
      }

      // This will old the value references until the dependent property is
      // updated. If the element is removed from the DOM, a reference to it
      // will still exist here.
      var changeRecord = e.detail;
      changeRecord.target = e.target;
      valueCache[dependency.pathname] = changeRecord;

      // Only call the handler once all properties have been initialised.
      if (Object.keys(valueCache).length === dependencies.length) {
        handler.apply(elem, dependencies.map(d => valueCache[d.pathname]));
      }
    });
  });
}

function observeAll(elem, observers = {}) {
  Object.keys(observers).forEach(handler => observeOne(elem, handler, observers[handler]));
}

export default maybeThis(function (elem, handler, dependencies) {
  if (dependencies === undefined) {
    observeAll(elem, handler);
  } else {
    observeOne(elem, handler, dependencies);
  }
});
