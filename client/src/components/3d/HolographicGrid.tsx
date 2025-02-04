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
        position={[0, -0.1, 0]}
      >
        <meshBasicMaterial 
          attach="material" 
          color={0x00ff00} 
          transparent
          opacity={0.2}
        />
      </gridHelper>

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

      {/* Semi-transparent walls for depth */}
      <mesh position={[0, 25, -50]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial 
          color={0x001100}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-50, 25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial 
          color={0x001100}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[50, 25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial 
          color={0x001100}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}