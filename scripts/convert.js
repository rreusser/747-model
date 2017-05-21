#!/usr/bin/env node

var parseObj = require('parse-obj');

function truncate (places) {
  return function (a) {
    return a.map(b => parseFloat(b.toFixed(places)))
  }
}

parseObj(process.stdin, function(err, result) {
  if(err) {
    process.stderr.write("Error parsing OBJ file: " + err);
    process.exit(1);
  }

  var output = {
    vertexPositions: result.vertexPositions.map(truncate(3)),
    vertexNormals: result.vertexNormals.map(truncate(2)),
    facePositions: result.facePositions,
    faceNormals: result.faceNormals
  }

  process.stdout.write(JSON.stringify(output));
})
