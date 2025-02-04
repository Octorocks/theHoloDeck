import * as THREE from 'three'

export function holographicMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ff88) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float scanline = sin(vPosition.y * 10.0 + time * 2.0) * 0.1 + 0.9;
        float edge = pow(1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0, 3.0);
        vec3 finalColor = color * scanline * edge;
        gl_FragColor = vec4(finalColor, edge * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  })
}
