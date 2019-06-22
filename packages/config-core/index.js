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
  files: [
    {
      name: "package.json",
      merge: true,
      data: {
        author: "You <at@you.com>",
        bugs: "https://github.com/skatejs/skatejs/issues",
        description: "",
        homepage: "https://skatejs.netlify.com",
        keywords: ["web", "components", "custom", "elements", "shadow", "dom"],
        license: "MIT",
        name: `@skatejs/package-name`,
        publishConfig: {
          access: "public"
        },
        repository: "skatejs/skatejs",
        scripts: {
          test: "jest"
        }
      }
    },
    {
      name: "package.json",
      merge: true,
      overwrite: true,
      data: {
        browser: "module/index.js",
        dependencies: {},
        devDependencies: getLatestVersions(["@pika/pack", "np"]),
        esnext: "esnext/index.js",
        files: ["esnext", "main", "module"],
        main: "main/index.js",
        module: "module/index.js",
        source: "src/index.ts"
      }
    }
  ]
};
