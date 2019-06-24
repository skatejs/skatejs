const path = require("path");
const { getLatestVersions, getWorkspacePackages } = require("./_");

module.exports = ({ cwd }) => ({
  files: [
    {
      name: "src/index.ts",
      data: ""
    },
    {
      name: "package.json",
      merge: true,
      data: {
        description: "",
        license: "MIT",
        name: cwd
      }
    },
    {
      name: "package.json",
      merge: true,
      overwrite: true,
      data: {
        devDependencies: getLatestVersions([
          "@pika/pack",
          "@pika/plugin-ts-standard-pkg",
          "@pika/plugin-build-node",
          "@pika/plugin-build-web",
          "@pika/plugin-build-types",
          "typescript"
        ]),
        publishConfig: {
          access: "public"
        },
        scripts: {
          build: "pack build"
        },
        source: "src/index.ts",
        "@pika/pack": {
          pipeline: [
            [
              "@pika/plugin-ts-standard-pkg",
              {
                exclude: ["__tests__/**/*"]
              }
            ],
            ["@pika/plugin-build-node"],
            ["@pika/plugin-build-web"],
            ["@pika/plugin-build-types"]
          ]
        }
      }
    },
    {
      name: "tsconfig.json",
      merge: true,
      data: {
        compilerOptions: {
          jsx: "react",
          jsxFactory: "h",
          module: "esnext",
          moduleResolution: "node",
          target: "es2019"
        },
        include: ["src/index.ts"],
        exclude: ["node_modules", "**/__tests__/*"]
      }
    },
    {
      name: "tsconfig.json",
      merge: true,
      overwrite: true,
      data: {
        paths: undefined
        // paths: async () => {
        //   const ws = await getWorkspacePackages();
        //   const pkg = ws[cwd];
        //   const deps = {
        //     ...pkg.optionalDependencies,
        //     ...pkg.peerDependencies,
        //     ...pkg.devDependencies,
        //     ...pkg.dependencies
        //   };
        //   const paths = {};
        //   for (const w in ws) {
        //     const { name } = ws[w];
        //     if (name in deps) {
        //       paths[name] = path.relative(cwd, require.resolve(name));
        //     }
        //   }
        //   return paths;
        // }
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
});
