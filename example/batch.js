// This example demonstrates how to use batch mode commands
//
// To use a command in batch mode, we pass in an array of objects.  Then
// the command is executed once for each object in the array.

// As usual, we start by creating a full screen regl object
const regl = require('../regl')()

// Next we create our command
const draw = regl({
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

  vert: `
    precision mediump float;
    attribute vec2 position;
    uniform float angle;
    uniform vec2 offset;
    void main() {
      gl_Position = vec4(
        cos(angle) * position.x + sin(angle) * position.y + offset.x,
        -sin(angle) * position.x + cos(angle) * position.y + offset.y, 0, 1);
    }`,

  attributes: {
    position: [
      0.5, 0,
      0, 0.5,
      1, 1]
  },

  uniforms: {
    // the batchId parameter gives the index of the command
    color: ({count}, props, batchId) => [
      Math.sin((0.1 + Math.sin(batchId)) * count + 3.0 * batchId),
      Math.cos(0.02 * count + 0.1 * batchId),
      Math.sin((0.3 + Math.cos(2.0 * batchId)) * count + 0.8 * batchId),
      1
    ],
    angle: ({count}) => 0.01 * count,
    offset: regl.prop('offset')
  },

  depth: {
    enable: false
  },

  count: 3
})

// Here we register a per-frame callback to draw the whole scene
regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1]
  })

  // This tells regl to execute the command once for each object
  draw([
    { offset: [-1, -1] },
    { offset: [-1, 0] },
    { offset: [-1, 1] },
    { offset: [0, -1] },
    { offset: [0, 0] },
    { offset: [0, 1] },
    { offset: [1, -1] },
    { offset: [1, 0] },
    { offset: [1, 1] }
  ])
})
