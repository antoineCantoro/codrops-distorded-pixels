precision mediump float;

// Uniforms
uniform float uTime;
uniform vec4 uResolution;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;

// Varyings
varying vec2 vUv;
varying vec3 vPosition;

// Constants
float PI = 3.141592653589793238;

// Main
void main() {
  vec2 newUV = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);
  
  vec4 color = texture2D(uTexture, vUv);
  vec4 offset = texture2D(uDataTexture, newUV);

  gl_FragColor = texture2D(uTexture, newUV - 0.02 * offset.rg);
}