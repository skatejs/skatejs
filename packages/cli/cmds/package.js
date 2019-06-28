const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { getLatestVersions, getWorkspacePackages } = require("./_");

const exists = promisify(fs.exists);

module.exports = async ({ cli, cwd }) => {
  const isTs =
    cli.typescript === "ts" || (await exists(path.join(cwd, "src/index.ts")));
  const isTsx =
    cli.typescript === "tsx" || (await exists(path.join(cwd, "src/index.tsx")));
  const isTsProject = isTs || isTsx;
  const useTypecript = config => (isTsProject ? config : undefined);
  const suffix = isTs ? "ts" : isTsx ? "tsx" : "js";
  return {
    files: [
      {
        name: "package.json",
        merge: true,
        data: {
          author: "Your Name <you@yourname.com>",
          description: "",
          license: "MIT",
          name: cwd,
          publishConfig: { access: "public" },
          source: `src/index.${suffix}`
        }
      },
      {
        name: "package.json",
        merge: true,
        overwrite: true,
        data: {
          "@pika/pack": useTypecript({
            pipeline: [
              ["@pika/plugin-ts-standard-pkg", { exclude: ["__tests__/**/*"] }],
              ["@pika/plugin-build-node"],
              ["@pika/plugin-build-web"],
              ["@pika/plugin-build-types"]
            ]
          }),
          devDependencies: {
            "@pika/pack": useTypecript(getLatestVersions),
            "@pika/plugin-ts-standard-pkg": useTypecript(getLatestVersions),
            "@pika/plugin-build-node": useTypecript(getLatestVersions),
            "@pika/plugin-build-web": useTypecript(getLatestVersions),
            "@pika/plugin-build-types": useTypecript(getLatestVersions),
            typescript: useTypecript(getLatestVersions)
          },
          scripts: {
            build: useTypeScript("pack build")
          },
          types: useTypescript("src/index.ts"),

          // Migration
          browser: undefined,
          esnext: undefined,
          module: undefined,
          bugs: undefined,
          homepage: undefined,
          keywords: undefined,
          repository: undefined
        }
      },
      {
        name: "tsconfig.json",
        merge: true,
        remove: !isTsProject,
        data: {
          extends: "../../tsconfig.json"
        }
      },
      {
        name: "README.md",
        data: `
        # ${cwd}

        > ...

        ## Usage

        \`\`\`js
        // ...
        \`\`\`
      `
      }
    ]
  };
};
