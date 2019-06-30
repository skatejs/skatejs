const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { getLatestVersion, getWorkspacePackages } = require("./_");

const exists = promisify(fs.exists);

module.exports = async ({ cli, cwd }) => {
  const isTs =
    cli.typescript === "ts" || (await exists(path.join(cwd, "src/index.ts")));
  const isTsx =
    cli.typescript === "tsx" || (await exists(path.join(cwd, "src/index.tsx")));
  const isTsProject = isTs || isTsx;
  const useTypescript = config => (isTsProject ? config : undefined);
  const suffix = isTs ? "ts" : isTsx ? "tsx" : "js";
  return {
    files: [
      {
        name: "package.json",
        merge: true,
        sort: true,
        data: {
          author: "Your Name <you@yourname.com>",
          description: "",
          license: "MIT",
          name: cwd,
          source: `src/index.${suffix}`,
          version: "0.0.0"
        }
      },
      {
        name: "package.json",
        merge: true,
        sort: true,
        data: () => {
          const pkg = require(path.resolve(cwd, "package.json"));
          return {
            publishConfig: pkg.private ? undefined : { access: "public" }
          };
        }
      },
      {
        name: "package.json",
        merge: true,
        overwrite: true,
        sort: true,
        data: useTypescript({
          "@pika/pack": {
            pipeline: [
              ["@pika/plugin-ts-standard-pkg", { exclude: ["__tests__/**/*"] }],
              ["@pika/plugin-build-node"],
              ["@pika/plugin-build-web"],
              ["@pika/plugin-build-types"]
            ]
          },
          devDependencies: {
            "@pika/pack": getLatestVersion,
            "@pika/plugin-ts-standard-pkg": getLatestVersion,
            "@pika/plugin-build-node": getLatestVersion,
            "@pika/plugin-build-web": getLatestVersion,
            "@pika/plugin-build-types": getLatestVersion,
            typescript: getLatestVersion
          },
          // This proxies pika's output, but allows dev mode to point to the
          // built module source.
          module: "pkg",
          scripts: {
            build: "pack build"
          },
          types: "src/index.ts"
        })
      },
      {
        name: `src/index.${suffix}`,
        data: `export default () => {};`
      },
      {
        name: "tsconfig.json",
        merge: true,
        remove: !isTsProject,
        data: {
          extends: "../../tsconfig.json",
          include: [`src/index.${suffix}`]
        }
      },
      {
        name: "README.md",
        data: () => {
          const pkg = require(path.resolve(cwd, "package.json"));
          return `
            # ${pkg.name}

            > ${pkg.description}
          `;
        }
      }
    ]
  };
};
