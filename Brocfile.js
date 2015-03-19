/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon();

if (app.env === 'test') {
  app.import('bower_components/ember/ember-template-compiler.js');
}

module.exports = app.toTree();
