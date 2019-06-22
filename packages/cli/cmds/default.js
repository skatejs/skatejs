const { getLatestVersions } = require("./_");

module.exports = ({ cli, cwd }) => ({
  files: [
    {
      name: "src/index.ts",
      data: ""
    },
    {
      name: "LICENSE",
      data: `
        Copyright 2019

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    },
    {
      name: "package.json",
      merge: true,
      data: {
        description: "",
        license: "MIT",
        name: cwd,
        publishConfig: {
          access: "public"
        },
        scripts: {
          test: "jest"
        },
        "@pika/pack": {
          pipeline: [
            [
              "@pika/plugin-standard-pkg",
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
