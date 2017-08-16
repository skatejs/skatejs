module.exports = {
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
  presets: [["latest", { es2015: false }], "react", "stage-0"]
};
