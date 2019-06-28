const fs = require("fs");
const path = require("path");

module.exports = (request, options) => {
  const requestTs = request.replace(".js", ".ts");
  const resolveTs = fs.existsSync(path.resolve(options.basedir, requestTs));
  return options.defaultResolver(resolveTs ? requestTs : request, options);
};
