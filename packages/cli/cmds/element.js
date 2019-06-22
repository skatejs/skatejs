const { getLatestVersions } = require("./_");

const types = {
  preact: `
    // @jsx h

    import Element, { h } from "@skatejs/element-preact";

    export default class extends Element {
      render() {
        return \`Hello, <slot />!\`;
      }
    }
  `
};

module.exports = ({ cli, cwd }) => ({
  files: [
    {
      name: "src/index.ts",
      data: types[cli.type]
    },
    {
      name: "package.json",
      data: {
        dependencies: getLatestVersions([`@skatejs/element-${cli.type}`])
      }
    }
  ],
  includes: [require("./default")]
});
