module.exports = args => {
  let config;
  try {
    return require(`./cmds/${args.cmd}`);
  } catch (e) {
    console.error(`The command ${args.cmd} does not exist.`);
  }
};
