#! /usr/bin/env node

require("conartist").bin({
  ...require("./package.json"),
  conartist: require("."),
  commands: {
    element: {
      description: "Maintains a SkateJS element.",
      options: {
        type: {
          alias: "t",
          default: "preact",
          description: "The type of element you are building.",
          question: {
            choices: ["preact", "react"],
            message: "What type of element are you building?"
          }
        }
      }
    }
  }
});
