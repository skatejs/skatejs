const { getLatestVersions } = require("./_");

module.exports = ({ cli, cwd }) => ({
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
