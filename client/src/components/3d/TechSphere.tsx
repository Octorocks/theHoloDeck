import { useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface TechSphereProps {
  onClick: () => void
  isActive: boolean
}

export function TechSphere({ onClick, isActive }: TechSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null)

  return (
    <group>
      <mesh ref={sphereRef} onClick={onClick}>
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
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'}`}>
          <h3 className="text-xl font-bold mb-2">Skills</h3>
          {isActive && (
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>React & Three.js</li>
              <li>TypeScript</li>
              <li>Node.js</li>
              <li>WebGL & GLSL</li>
            </ul>
          )}
        </div>
      </Html>
    </group>
  )
}