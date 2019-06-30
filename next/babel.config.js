module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ],
  presets: [
    ["@babel/preset-env", { exclude: ["@babel/plugin-transform-classes"] }],
    "@babel/preset-react"
  ]
};
