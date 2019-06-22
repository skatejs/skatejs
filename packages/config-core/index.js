const info = require("package-info");

module.exports = async () => {
  // const npInfo = await info("np");
  // const pikaInfo = await info("@pika/pack");

  return {
    files: [
      {
        name: "package.json",
        merge: true,
        data: {
          author: "You <at@you.com>",
          bugs: "https://github.com/skatejs/skatejs/issues",
          description: "",
          homepage: "https://skatejs.netlify.com",
          keywords: [
            "web",
            "components",
            "custom",
            "elements",
            "shadow",
            "dom"
          ],
          license: "MIT",
          name: `@skatejs/package-name`,
          publishConfig: { access: "public" },
          repository: "skatejs/skatejs",
          scripts: { test: "jest" }
        }
      },
      {
        name: "package.json",
        merge: true,
        overwrite: true,
        data: {
          browser: "module/index.js",
          dependencies: {},
          devDependencies: {
            // "@pika/pack": `^${pikaInfo.version}`,
            // np: `^${npInfo.version}`,
            "@pika/pack": undefined,
            np: undefined
          },
          esnext: "esnext/index.js",
          files: ["esnext", "main", "module"],
          main: "main/index.js",
          module: "module/index.js",
          source: "src/index.ts"
        }
      }
    ]
  };
};
