module.exports = {
  babelrc: false,
  plugins: [
    [
      require("babel-plugin-modules-map"),
      {
        preact: "preact/dist/preact.esm"
      }
    ],
    [
      require("babel-plugin-modules-web-compat"),
      {
        packageResolutionStrategy: "npm"
      }
    ]
  ],
  presets: ["latest", "react", "stage-0"]
};
