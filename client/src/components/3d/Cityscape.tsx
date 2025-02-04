import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { holographicMaterial } from './shaders/holographic'

export function Cityscape() {
  const groupRef = useRef<THREE.Group>(null)
  const material = holographicMaterial()

  useFrame((state) => {
    if (groupRef.current) {
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <group ref={groupRef}>
      {/* Simple cityscape made of boxes */}
      {[...Array(5)].map((_, i) => (
        <mesh 
          key={i}
          position={[i - 2, Math.random() * 2, 0]}
          scale={[0.3, 1 + Math.random() * 2, 0.3]}
        >
          <boxGeometry />
          <primitive object={material} attach="material" />
        </mesh>
      ))}

      <Html position={[2, 0, 0]}>
        <div className="bg-background/90 p-4 rounded-lg w-64">
          <h3 className="text-xl font-bold mb-2">Experience</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Senior Web Developer @ Tech Co</li>
            <li>3D Graphics Engineer @ Studio XYZ</li>
            <li>Freelance Developer</li>
          </ul>
        </div>
      </Html>
    </group>
  )
}
