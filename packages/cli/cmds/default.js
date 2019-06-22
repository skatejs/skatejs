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
  `,
  react: `
    // @jsx h

    import Element, { h } from "@skatejs/element-react";
    import Shadow from "@skatejs/sk-shadow";

    export default class extends Element {
      render() {
        return (
          <Shadow>
            \`Hello, <slot />!\`
          </Shadow>
        );
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
        private: true,
        dependencies: getLatestVersions([`@skatejs/element-${cli.type}`])
      }
    }
  ]
});
