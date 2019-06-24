const info = require("package-info");
const { findWorkspaces } = require("jobsite");
const path = require("path");

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

async function getWorkspacePackages() {
  const map = {};
  for (const w of await findWorkspaces()) {
    try {
      map[w] = require(path.resolve(w, "package.json"));
    } catch (e) {}
  }
  return map;
}

module.exports = {
  getLatestVersion,
  getLatestVersions,
  getWorkspacePackages
};
