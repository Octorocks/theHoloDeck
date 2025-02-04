import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { holographicMaterial } from './shaders/holographic'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarProps {
  onClick: () => void
}

export function Avatar({ onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const material = holographicMaterial()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <group ref={groupRef}>
      <mesh onClick={onClick}>
        <cylinderGeometry args={[0.5, 0.3, 2, 32]} />
        <primitive object={material} attach="material" />
      </mesh>

      <Html position={[2, 0, 0]}>
        <div className="bg-background/90 p-4 rounded-lg w-64">
          <h3 className="text-xl font-bold mb-2">About Me</h3>
          <p className="text-sm text-muted-foreground">
            A passionate developer with a love for creating immersive web experiences.
            Specializing in 3D web development and interactive applications.
          </p>
        </div>
      </Html>
    </group>
  )
}