import { useRef } from 'react'
import * as THREE from 'three'

export function HolographicGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  const wallGridRefs = useRef<THREE.GridHelper[]>([])

  return (
    <>
      {/* Floor Grid */}
      <gridHelper 
        ref={gridRef}
        args={[50, 50, 0x00ff00, 0x00ff00]}
        position={[0, 0.01, 0]}
      >
        <meshBasicMaterial 
          attach="material" 
          color={0x00ff00} 
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </gridHelper>

      {/* Floor Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color={0x333333}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Wall Grids */}
      {[
        // Back Wall
        { position: [0, 20, 25], rotation: [Math.PI / 2, 0, Math.PI] },
        // Front Wall
        { position: [0, 20, -25], rotation: [Math.PI / 2, 0, 0] },
        // Left Wall
        { position: [-25, 20, 0], rotation: [Math.PI / 2, 0, Math.PI / 2] },
        // Right Wall
        { position: [25, 20, 0], rotation: [Math.PI / 2, 0, -Math.PI / 2] }
      ].map((wall, index) => (
        <group 
          key={index} 
          position={[wall.position[0], wall.position[1], wall.position[2]]} 
          rotation={[wall.rotation[0], wall.rotation[1], wall.rotation[2]]}
        >
          <gridHelper
            ref={(el) => el && wallGridRefs.current.push(el)}
            args={[50, 50, 0x00ff00, 0x00ff00]}
          >
            <meshBasicMaterial
              attach="material"
              color={0x00ff00}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </gridHelper>
        </group>
      ))}

      {/* Wall Bases */}
      {[
        // Back Wall
        { position: [0, 20, 25], rotation: [0, 0, 0] },
        // Front Wall
        { position: [0, 20, -25], rotation: [0, 0, 0] },
        // Left Wall
        { position: [-25, 20, 0], rotation: [0, Math.PI / 2, 0] },
        // Right Wall
        { position: [25, 20, 0], rotation: [0, -Math.PI / 2, 0] }
      ].map((wall, index) => (
        <mesh 
          key={`wall-${index}`} 
          position={[wall.position[0], wall.position[1], wall.position[2]]} 
          rotation={[wall.rotation[0], wall.rotation[1], wall.rotation[2]]}
        >
          <planeGeometry args={[50, 40]} />
          <meshStandardMaterial 
            color={0x333333}
            metalness={0.6}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  )
}