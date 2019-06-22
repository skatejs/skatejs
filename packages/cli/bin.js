#! /usr/bin/env node

require("conartist").bin({
  ...require("./package.json"),
  conartist: require("."),
  commands: {
    default: {
      description: "Generates an example SkateJS element.",
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
    },
    package: {
      description: "Generates a SkateJS monorepo package."
    }
  }
});
