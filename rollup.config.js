import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import yargs from "yargs";

const args = yargs.argv;

export default {
  dest: `umd/index${args.min ? ".min" : ""}.js`,
  entry: "src/index.js",
  external: ["preact"],
  format: "umd",
  globals: { preact: "preact" },
  moduleName: "skate",
  plugins: [babel(require("./config/babel.umd"))].concat(
    args.min ? uglify() : []
  ),
  sourceMap: true
};
