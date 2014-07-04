var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
    var configs = {};

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === 'index.js') {
            return;
        }

        var name = path.basename(file, '.js');
        var conf = require('./' + name);

        configs[name] = typeof conf === 'function' ? conf(grunt) : conf;
    });

    return configs;
};
