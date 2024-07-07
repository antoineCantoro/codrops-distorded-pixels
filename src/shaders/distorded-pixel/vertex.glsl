// Uniforms
uniform float uTime;
uniform vec2 uPixels;

// Varyings
varying vec2 vUv;
varying vec3 vPosition;

// Constants
float PI = 3.141592653589793238;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vUv = uv;

    gl_Position = projectedPosition;
}