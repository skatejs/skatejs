const info = require("package-info");

async function getLatestVersion(name, val) {
  const version = (await info(name)).version;
  const fuzzy = version[0] === "0" ? "~" : "^";
  return fuzzy + version;
}

function getLatestVersions(depNames) {
  return depNames.reduce((deps, name) => {
    deps[name] = getLatestVersion;
    return deps;
  }, {});
}

module.exports = {
  getLatestVersion,
  getLatestVersions
};
