import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { holographicMaterial } from './shaders/holographic'
import * as THREE from 'three'

interface CityscapeProps {
  onClick: () => void
  isActive: boolean
}

export function Cityscape({ onClick, isActive }: CityscapeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const material = holographicMaterial()

  useFrame((state) => {
    if (groupRef.current) {
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Chest base */}
      <mesh>
        <boxGeometry args={[2, 1.2, 1.4]} />
        <meshStandardMaterial color={0x8B4513} metalness={0.3} roughness={0.7} emissive={0x3B1503} />
      </mesh>

      {/* Chest lid */}
      <mesh position={[0, 0.7, -0.6]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[2, 0.4, 1.4]} />
        <meshStandardMaterial color={0x8B4513} metalness={0.3} roughness={0.7} emissive={0x3B1503} />
      </mesh>

      {/* Metal bands */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.1, 0.1, 1.5]} />
        <meshStandardMaterial color={0xc0c0c0} metalness={0.9} roughness={0.1} emissive={0x404040} />
      </mesh>

      {/* Lock */}
      <mesh position={[0, 0.2, 0.71]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <primitive object={material} attach="material" />
      </mesh>

      <Html position={[2, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'}`}>
          <h3 className="text-xl font-bold mb-2">Experience</h3>
          {isActive && (
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Senior Web Developer @ Tech Co</li>
              <li>3D Graphics Engineer @ Studio XYZ</li>
              <li>Freelance Developer</li>
            </ul>
          )}
        </div>
      </Html>
    </group>
  )
}