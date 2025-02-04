import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function HolographicGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  const wallGridRefs = useRef<THREE.GridHelper[]>([])

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = Math.sin(state.clock.getElapsedTime()) * 0.2 + 0.3
    }
    wallGridRefs.current.forEach(grid => {
      if (grid) {
        grid.material.opacity = Math.sin(state.clock.getElapsedTime()) * 0.2 + 0.3
      }
    })
  })

  return (
    <>
      {/* Floor Grid */}
      <gridHelper 
        ref={gridRef}
        args={[100, 100, 0x00ff00, 0x00ff00]}
        position={[0, 0.01, 0]}
      >
        <meshBasicMaterial 
          attach="material" 
          color={0x00ff00} 
          transparent
          opacity={0.2}
        />
      </gridHelper>

      {/* Floor Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={0x1a1a1a}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wall Grids */}
      <group position={[0, 25, -50]} rotation={[Math.PI / 2, 0, 0]}>
        <gridHelper
          ref={(el) => el && wallGridRefs.current.push(el)}
          args={[100, 100, 0x00ff00, 0x00ff00]}
        >
          <meshBasicMaterial
            attach="material"
            color={0x00ff00}
            transparent
            opacity={0.2}
          />
        </gridHelper>
      </group>

      <group position={[-50, 25, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <gridHelper
          ref={(el) => el && wallGridRefs.current.push(el)}
          args={[100, 100, 0x00ff00, 0x00ff00]}
        >
          <meshBasicMaterial
            attach="material"
            color={0x00ff00}
            transparent
            opacity={0.2}
          />
        </gridHelper>
      </group>

      <group position={[50, 25, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        <gridHelper
          ref={(el) => el && wallGridRefs.current.push(el)}
          args={[100, 100, 0x00ff00, 0x00ff00]}
        >
          <meshBasicMaterial
            attach="material"
            color={0x00ff00}
            transparent
            opacity={0.2}
          />
        </gridHelper>
      </group>

      {/* Wall Bases */}
      <mesh position={[0, 25, -50]}>
        <planeGeometry args={[100, 50]} />
        <meshStandardMaterial 
          color={0x1a1a1a}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-50, 25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshStandardMaterial 
          color={0x1a1a1a}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[50, 25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshStandardMaterial 
          color={0x1a1a1a}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}