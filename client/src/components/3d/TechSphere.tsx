import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export function TechSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005
      sphereRef.current.rotation.x += 0.002
    }
  })

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={0x00ff00}
          emissive={0x002200}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>

      <Html position={[2, 0, 0]}>
        <div className="bg-background/90 p-4 rounded-lg w-64">
          <h3 className="text-xl font-bold mb-2">Skills</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>React & Three.js</li>
            <li>TypeScript</li>
            <li>Node.js</li>
            <li>WebGL & GLSL</li>
          </ul>
        </div>
      </Html>
    </group>
  )
}
