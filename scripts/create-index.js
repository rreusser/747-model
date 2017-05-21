#!/usr/bin/env node

var html = require('create-html');
var fromString = require('from2-string');
var injectMeta = require('html-inject-meta');
var injectGithub = require('html-inject-github-corner');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(require('pkg-up').sync(), 'utf8'));

fromString(html({
  script: 'bundle.js',
  scriptAsync: true
}))
  .pipe(injectMeta(pkg))
  .pipe(injectGithub())
  .pipe(process.stdout);
