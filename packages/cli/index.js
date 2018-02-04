#!/usr/bin/env node

const chalk = require('chalk');
const { sync } = require('conartist');
const { exists, writeFile, unlink } = require('fs-extra');
const { prompt } = require('inquirer');
const outdent = require('outdent');
const spawn = require('spawndamnit');
const args = require('yargs').argv;

const { log } = console;

(async () => {
  log();

  if (!await exists('package.json')) {
    log(chalk`Generating {italic package.json}.`);
    await spawn('npm', ['init', '-f']);
  }

  const { type, renderer } = await prompt([
    {
      choices: ['app', 'lib'],
      message: 'What are you building?',
      name: 'type',
      type: 'list'
    },
    {
      choices: ['lit-html', 'preact', 'react'],
      message: 'What renderer do you want to use?',
      name: 'renderer',
      type: 'list'
    }
  ]);

  log();
  log(chalk`Writing files...`);
  await spawn('npm', ['i', 'conartist', '--save-dev']);
  await writeFile(
    'conartist.js',
    outdent`
      const { config } = require('conartist');
      module.exports = config(
        require('${__dirname}/templates/${type}'),
        require('${__dirname}/templates/${type}/${renderer}')
      );
    `
  );
  await spawn('conartist');
  await unlink('conartist.js');

  log(chalk`NPM installing...`);
  await spawn('npm', ['i']);

  log();
  log(chalk`{green Done!}`);
})();
