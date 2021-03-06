var createContext = require('./util/create-context')
var createREGL = require('../../regl')
var tape = require('tape')

tape('element arg parsing', function (t) {
  var gl = createContext(16, 16)
  var regl = createREGL(gl)

  function checkProperties (elementData, props, prefix) {
    var elements = elementData._elements
    t.equals(elements.primType, props.primType, prefix + ' primType')
    t.equals(elements.vertCount, props.vertCount, prefix + ' vertCount')
    t.equals(elements.type, props.type, prefix + ' dtype')

    var buffer = elements.buffer
    t.equals(buffer.type, gl.ELEMENT_ARRAY_BUFFER, prefix + ' buffer type')
    t.equals(buffer.usage, props.usage, prefix + ' buffer usage')
    t.equals(buffer.byteLength, props.byteLength, prefix + ' buffer byteLength')
    t.equals(buffer.dimension, props.dimension, prefix + ' buffer dimension')
    // t.same(buffer.data, props.data, prefix + ' data')
  }

  checkProperties(
    regl.elements(),
    {
      primType: gl.TRIANGLES,
      vertCount: 0,
      type: gl.UNSIGNED_BYTE,
      usage: gl.STATIC_DRAW,
      byteLength: 0,
      dimension: 1,
      data: null
    },
    'empty')

  checkProperties(
    regl.elements(10),
    {
      primType: gl.TRIANGLES,
      vertCount: 10,
      type: gl.UNSIGNED_BYTE,
      usage: gl.STATIC_DRAW,
      byteLength: 10,
      dimension: 1,
      data: null
    },
    'length')

  var ext32Bit = gl.getExtension('OES_element_index_uint')
  var defaultType = ext32Bit ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT
  var defaultSize = ext32Bit ? 4 : 2
  var DefaultArray = ext32Bit ? Uint32Array : Uint16Array

  checkProperties(
    regl.elements([
      [0, 1, 2],
      [2, 1, 3]
    ]),
    {
      primType: gl.TRIANGLES,
      vertCount: 6,
      type: defaultType,
      usage: gl.STATIC_DRAW,
      byteLength: defaultSize * 6,
      dimension: 3,
      data: new DefaultArray([
        0, 1, 2,
        2, 1, 3
      ])
    },
    'array of arrays')

  checkProperties(
    regl.elements({
      usage: 'dynamic',
      primitive: 'line loop',
      data: new Uint8Array([
        1, 2, 3, 4, 5
      ])
    }),
    {
      primType: gl.LINE_LOOP,
      vertCount: 5,
      type: gl.UNSIGNED_BYTE,
      usage: gl.DYNAMIC_DRAW,
      byteLength: 5,
      dimension: 3,
      data: new Uint8Array([
        1, 2, 3, 4, 5
      ])
    },
    'manual properties')

  regl.destroy()
  t.end()
})
