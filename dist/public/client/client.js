//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";
//@ts-ignore
import { mat4 } from 'https://cdn.skypack.dev/gl-matrix@3.4.0';
const socket = io();
// Get the canvas element
const canvas = document.getElementById('main-canvas');
const gl = canvas.getContext('webgl');
// Check if WebGL is supported
if (!gl) {
    alert('WebGL is not supported.');
}
// Set the canvas dimensions
canvas.width = window.screen.width * .75;
canvas.height = window.screen.height * .75;
const vertexShaderCode = `
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShaderCode = `
  precision mediump float;

  // Uniforms
  uniform float pixelSize;
  uniform vec2 resolution;

  void main() {
    // Pixelated effect
    vec2 pixelCoord = gl_FragCoord.xy / pixelSize;
    vec2 roundedCoord = floor(pixelCoord) * pixelSize;
    vec2 uv = roundedCoord / resolution;

    // Assign a flat color based on the surface
    vec3 color;
    if (gl_FragCoord.z <= 0.5) {
      color = vec3(1.0, 0.0, 0.0); // Red
    } else if (gl_FragCoord.z <= 1.5) {
      color = vec3(0.0, 1.0, 0.0); // Green
    } else {
      color = vec3(0.0, 0.0, 1.0); // Blue
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderCode);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
const vertices = [
    // Front face
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    // Back face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    // Right face
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    // Top face
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    // Bottom face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5, // Top-right
];
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
const modelViewMatrix = mat4.create();
const projectionMatrix = mat4.create();
gl.viewport(0, 0, canvas.width, canvas.height);
const aspect = canvas.width / canvas.height;
mat4.perspective(projectionMatrix, 45 * Math.PI / 180, aspect, 0.1, 100.0);
let angleX = 0;
let angleY = 0;
function animate() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -2.5]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, angleY);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, angleX);
    const modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 18);
    angleX += 0.01;
    angleY += 0.00;
    requestAnimationFrame(animate);
}
animate();
function unixToLocaleDateTime(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    var timestampInMs = unixTimestamp * 1000;
    // Create a new Date object
    var date = new Date(timestampInMs);
    // Extract the local date and time as separate values
    var localDate = date.toLocaleDateString();
    var localTime = date.toLocaleTimeString();
    // Return as an object with properties for date and time
    return { date: localDate, time: localTime };
}
