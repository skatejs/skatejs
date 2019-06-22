module.exports = {
  files: [
    {
      name: "package.json",
      merge: true,
      data: {
        author: "You <at@you.com>",
        browser: "module/index.js",
        bugs: "https://github.com/skatejs/skatejs/issues",
        dependencies: {},
        description: "",
        devDependencies: { jest: "latest", np: "latest" },
        esnext: "esnext/index.js",
        files: ["esnext", "main", "module"],
        homepage: "https://skatejs.netlify.com",
        keywords: ["web", "components", "custom", "elements", "shadow", "dom"],
        license: "MIT",
        main: "main/index.js",
        module: "module/index.js",
        name: `@skatejs/package-name`,
        publishConfig: { access: "public" },
        repository: "skatejs/skatejs",
        scripts: { test: "jest" },
        source: "src/index.ts"
      }
    }
  ]
};
