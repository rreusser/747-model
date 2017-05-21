var failNicely = require('fail-nicely');
var reglCamera = require('regl-camera');
var glslify = require('glslify');

require('regl')({
  //pixelRatio: 2,
  attributes: {antialias: false},
  onDone: require('fail-nicely')(regl => {
    require('resl')({
      manifest: {
        matcap: {
          type: 'image',
          src: 'assets/matcap.jpg',
          parser: img => regl.texture({data: img, flipY: true}),
        }
      },
      onDone: assets => start(regl, assets.matcap)
    })
  })
});

function unindex (obj) {
  var complex = {
    positions: [],
    uvs: [],
    normals: []
  };
  for (i = 0; i < obj.facePositions.length; i++) {
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][0]]);
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][1]]);
    complex.positions.push(obj.vertexPositions[obj.facePositions[i][2]]);
  }
  /*for (i = 0; i < obj.faceUVs.length; i++) {
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][0]]);
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][1]]);
    complex.uvs.push(obj.vertexUVs[obj.faceUVs[i][2]]);
  }*/
  for (i = 0; i < obj.faceNormals.length; i++) {
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][0]]);
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][1]]);
    complex.normals.push(obj.vertexNormals[obj.faceNormals[i][2]]);
  }

  return complex;
}

function start (regl, matcap) {
  var plane = unindex(require('./../assets/747'));
  var engine = unindex(require('./../assets/engine'));

  var draw = regl({
    vert: glslify(`
      precision mediump float;

      #pragma glslify: matcap = require(matcap)

      attribute vec3 xyz, normal;
      attribute vec2 uvcoord;

      //varying vec3 vN, vEye;
      //varying vec2 vUV;
      varying vec3 color;

      uniform vec3 eye, translate;
      uniform sampler2D img;
      uniform mat4 projection, view;

      void main () {
        vec3 vN = normalize(normal);
        vec3 p = xyz + translate;
        vec3 vEye = normalize(p - eye);

        vEye = mat3(view) * vEye;
        vN = mat3(view) * vN;

        color = texture2D(img, matcap(vEye, vN)).rgb;

        gl_Position = projection * view * vec4(p, 1);
      }
    `),
    frag: glslify(`
      precision mediump float;

      //varying vec3 vN, vEye;
      varying vec3 color;
      uniform sampler2D img;
      //varying vec2 vUV;
      void main () {

        gl_FragColor = vec4(color, 1.0);
      }
    `),
    attributes: {
      xyz: (ctx, props) => props.model.positions,
      normal: (ctx, props) => props.model.normals,
      //uvcoord: (ctx, props) => props.model.uvs
    },
    uniforms: {
      eye: regl.context('eye'),
      translate: (ctx, props) => props.translate || [0, 0, 0],
      img: matcap
    },
    cull: {
      enable: true,
      face: 'back',
    },
    count: (ctx, props) => props.model.positions.length
  })

  var camera = reglCamera(regl, {
    damping: 0,
    preventDefault: true,
    phi: 0.4,
    theta: 2.5,
    distance: 15
  });


  regl.frame(() => {
    camera(() => {
      draw({model: plane});
      draw([
        {model: engine, translate: [-0.1, 0, 0]},
        {model: engine, translate: [1.50, 0.18, 1.8]},
        {model: engine, translate: [-0.1, 0, -4.15]},
        {model: engine, translate: [1.50, 0.18, -4.15 - 1.8]},
      ]);
    });
  });

}
