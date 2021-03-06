var createContext = require('./util/create-context')
var createREGL = require('../../regl')
var tape = require('tape')

tape('this / state variables', function (t) {
  var regl = createREGL(createContext(5, 5))

  function checkPixmap (slots, args, expected, remark) {
    var base = {
      frag: [
        'precision mediump float;',
        'void main() {',
        'gl_FragColor = vec4(1, 1, 1, 1);',
        '}'
      ].join('\n'),

      vert: [
        'precision mediump float;',
        'attribute vec2 position;',
        'varying vec4 fragColor;',
        'uniform vec2 offset;',
        'void main() {',
        'gl_Position=vec4((offset + position - 2.0) / 2.1, 0, 1);',
        '}'
      ].join('\n'),

      attributes: {
        position: regl.buffer([0, 0, 4, 0, 4, 4, 0, 4])
      },

      depth: {enable: false, mask: false}
    }

    Object.keys(slots).forEach(function (x) {
      base[x] = slots[x]
    })

    var command = regl(base)

    function checkPixels (suffix) {
      var pixels = regl.read()
      var actual = new Array(25)
      for (var i = 0; i < 25; ++i) {
        actual[i] = Math.min(1, pixels[4 * i])
      }
      t.same(actual, expected, remark + ' - ' + suffix)
    }

    regl.clear({color: [0, 0, 0, 0]})
    command.call(args)
    checkPixels('draw')

    regl.clear({color: [0, 0, 0, 0]})
    command.call(args, 1)
    checkPixels('batch')
  }

  checkPixmap({
    primitive: regl.this('primitive'),
    count: regl.this('count'),
    offset: regl.this('_offset'),
    uniforms: {
      offset: [0, 0]
    }
  }, {
    primitive: 'points',
    count: 3,
    _offset: 1,
    __offset: [0, 0]
  }, [
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    1, 0, 0, 0, 1
  ], 'draw state')

  checkPixmap({
    uniforms: {
      offset: regl.this('offset')
    },
    count: 1,
    primitive: 'points'
  }, {
    offset: [2, 2]
  }, [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
  ], 'uniforms')

  // TODO :
  //   * attributes
  //   * elements
  //   * gl properties

  regl.destroy()
  t.end()
})
