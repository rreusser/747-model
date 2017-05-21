#!/usr/bin/env node

var html = require('create-html');
var fromString = require('from2-string');
var injectMeta = require('html-inject-meta');
var injectGithub = require('html-inject-github-corner');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(require('pkg-up').sync(), 'utf8'));

fromString(html({
  script: 'bundle.min.js',
  scriptAsync: true,
  body: `<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-50197543-4', 'auto');
ga('send', 'pageview');

</script>`
}))
  .pipe(injectMeta(pkg))
  .pipe(injectGithub())
  .pipe(process.stdout);
