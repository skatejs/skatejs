export default function (child, ...parents) {
  parents.forEach(parent =>
    Object.keys(parent || {}).forEach(name =>
      child[name] = parent[name]));
  return child;
}
