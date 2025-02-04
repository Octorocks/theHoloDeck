import * as THREE from 'three'

export function createPointLight(color: number, intensity: number, distance: number) {
  const light = new THREE.PointLight(color, intensity, distance)
  light.castShadow = true
  return light
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function mapRange(value: number, min1: number, max1: number, min2: number, max2: number): number {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}
