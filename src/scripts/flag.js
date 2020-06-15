import gsap from 'gsap';

var ShaderUtil = {
  createShader: function (gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Compile shader source fail:\n\n' + source, '\n\n=====error log======\n\n', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  },

  createProgram: function (gl, vertexShader, fragmentShader, validate) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Creating shader program fail:\n', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    if (validate) {
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating shader program:\n', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  },

  createProgramFromSrc: function (gl, vertexShaderSrc, fragmentShaderSrc, validate) {
    var vShader = ShaderUtil.createShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
    var fShader = ShaderUtil.createShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);
    if (!vShader || !fShader) {
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      return null;
    }
    return ShaderUtil.createProgram(gl, vShader, fShader, validate);
  },

  getSrcFromUrl: function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText);
        }
      }
    };
    xhr.send();
  },
};

var Shaders = function (gl, vShaderSrc, fShaderSrc) {
  var program = ShaderUtil.createProgramFromSrc(gl, vShaderSrc, fShaderSrc, true);

  if (program) {
    this.program = program;
    this.gl = gl;
    gl.useProgram(this.program);
  }

  /**
   * @return {Shaders}
   */
  this.activate = function () {
    gl.useProgram(program);
    return this;
  };

  /**
   * @return {Shaders}
   */
  this.deactivate = function () {
    gl.useProgram(null);
    return this;
  };

  this.dispose = function () {
    if (gl.getParameter(gl.CURRENT_PROGRAM === program)) {
      this.deactivate();
    }
    gl.deleteProgram(program);
  };
};

export function flag() {
  var canvas = document.getElementById('flag-canvas');
  var gl;

  var imgWidth, imgHeight;
  var canvasWidth, canvasHeight;

  var image = new Image();

  var vShaderSrc = document.getElementById('vertex_shader').text;
  var fShaderSrc = document.getElementById('fragment_shader').text;

  var eleSize = 0;
  var vertexCount = 0;

  // ShaderUtil.getSrcFromUrl('vertexShader.vert', function (src) {
  //   vShaderSrc = src
  //   onAllLoaded()
  // })
  // ShaderUtil.getSrcFromUrl('fragmentShader.frag', function (src) {
  //   fShaderSrc = src
  //   onAllLoaded()
  // })

  init();

  function init() {
    if (!vShaderSrc || !fShaderSrc) {
      return false;
    }

    image.crossOrigin = 'anonymous';
    image.src = './assets/img/fabric.jpg';
    console.log(image);

    image.onload = function () {
      var IMG_MAX_WIDTH = window.innerWidth;
      var IMG_MAX_HEIGHT = window.innerHeight;
      imgWidth = Math.floor(image.width) * 5;
      imgHeight = Math.floor(image.height) * 5;
      if (imgWidth > IMG_MAX_WIDTH) {
        imgHeight *= IMG_MAX_WIDTH / imgWidth;
        imgWidth = IMG_MAX_WIDTH;
      }
      if (imgHeight > IMG_MAX_HEIGHT) {
        imgWidth *= IMG_MAX_HEIGHT / imgHeight;
        imgHeight = IMG_MAX_HEIGHT;
      }
      canvasWidth = imgWidth * 2;
      canvasHeight = imgHeight * 2;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      gl = canvas.getContext('webgl');
      if (!gl) {
        throw Error('no support WebGL');
      }

      console.log(gl);

      var shader = new Shaders(gl, vShaderSrc, fShaderSrc);

      var aPosition = gl.getAttribLocation(shader.program, 'a_Position');
      var uDistance = gl.getUniformLocation(shader.program, 'u_Distance');

      createVerticesBuffer();
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, eleSize * 2, 0);
      gl.enableVertexAttribArray(aPosition);

      createTexture();
      var uSampler = gl.getUniformLocation(shader.program, 'u_Sampler');
      gl.uniform1i(uSampler, 0);

      draw();
      tick();

      function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
      }

      var speed = 1;

      var stop = false;
      var timeLast = Date.now();
      var timeNow;
      var delta;
      var fps = 70;
      var interval = 1000 / fps;

      var distance = 0;

      function tick() {
        if (stop) return false;
        timeNow = Date.now();
        delta = timeNow - timeLast;
        if (delta > interval) {
          timeLast = timeNow;
          distance += delta * 0.0001 * speed;
          gl.uniform1f(uDistance, distance);
          draw();
        }
        requestAnimationFrame(tick);
      }
    };
  }

  function createVerticesBuffer() {
    var vertices = [];
    var x;
    for (var i = 0; i <= imgWidth; i++) {
      x = -1 + (2 * i) / imgWidth;
      vertices.push(x, -1, x, 1);
    }
    vertexCount = 2 * (imgWidth + 1);
    vertices = new Float32Array(vertices);
    eleSize = vertices.BYTES_PER_ELEMENT;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    return buffer;
  }

  function createTexture() {
    var texture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  }
  fadeOverlay();
}

let flagPacity = 8;

function fadeOverlay() {
  const $overlay = document.querySelector('.flag-overlay');
  const $actionBtn = document.querySelector('.page-flag .pause');

  $actionBtn.addEventListener('click', function (e) {
    if (flagPacity > 0) {
      flagPacity--;

      gsap.to($overlay, {
        autoAlpha: flagPacity / 10,
        duration: 0.3,
      });
    }
  });
}
