import * as THREE from 'three' // Import the entire THREE.js library

// Function to create a PointLight in THREE.js
export function createPointLight(color: number, intensity: number, distance: number) {
  const light = new THREE.PointLight(color, intensity, distance) // Create a PointLight with given parameters
  light.castShadow = true // Enable shadows for the light
  return light // Return the configured light
}

// Function for a cubic ease-in-out animation curve
export function easeInOutCubic(t: number): number {
  return t < 0.5 
    ? 4 * t * t * t  // Ease in (accelerating)
    : 1 - Math.pow(-2 * t + 2, 3) / 2 // Ease out (decelerating)
}

// Function to remap a value from one range to another
export function mapRange(value: number, min1: number, max1: number, min2: number, max2: number): number {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1)) 
  // Scale value from [min1, max1] to [min2, max2]
}
