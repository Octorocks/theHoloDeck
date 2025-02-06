import * as THREE from 'three' // Import Three.js for 3D rendering

// Function to create a holographic material using a custom shader
export function holographicMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }, // Time uniform for animation effects
      color: { value: new THREE.Color(0x00ff88) } // Base color of the holographic effect (greenish cyan)
    },
    vertexShader: `
      varying vec2 vUv; // Pass UV coordinates to the fragment shader
      varying vec3 vPosition; // Pass vertex position to the fragment shader
      
      void main() {
        vUv = uv; // Store UV coordinates
        vPosition = position; // Store vertex position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Standard vertex transformation
      }
    `,
    fragmentShader: `
      uniform float time; // Time variable for animation
      uniform vec3 color; // Base color of the hologram
      varying vec2 vUv; // Received UV coordinates
      varying vec3 vPosition; // Received vertex position
      
      void main() {
        // Create a moving scanline effect by using a sine wave on the Y-axis
        float scanline = sin(vPosition.y * 10.0 + time * 2.0) * 0.1 + 0.9;
        
        // Calculate an edge fade effect by darkening the edges of the object
        float edge = pow(1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0, 3.0);
        
        // Final color combines base color, scanline effect, and edge fading
        vec3 finalColor = color * scanline * edge;
        
        // Set the final fragment color with transparency applied to the edges
        gl_FragColor = vec4(finalColor, edge * 0.8);
      }
    `,
    transparent: true, // Enable transparency for the material
    side: THREE.DoubleSide // Render both sides of the geometry
  })
}
