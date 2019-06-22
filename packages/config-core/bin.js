#! /usr/bin/env node

require("conartist").bin({
  ...require("./package.json"),
  conartist: require(".")
});
