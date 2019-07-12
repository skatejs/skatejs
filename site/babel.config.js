module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        exclude: ["@babel/plugin-transform-classes"],
        corejs: 2,
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-react"
  ]
};
