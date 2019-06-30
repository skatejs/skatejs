module.exports = {
  presets: [
    ["@babel/preset-env", { exclude: ["@babel/plugin-transform-classes"] }],
    "@babel/preset-react"
  ]
};
