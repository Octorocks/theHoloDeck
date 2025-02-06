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

  // Animate the material's 'time' uniform using the frame clock
  useFrame((state) => {
    if (groupRef.current) {
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Simple Cube */}
      <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={0x00ff88} wireframe={true} />
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
