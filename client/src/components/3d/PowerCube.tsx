import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Mesh } from 'three'
import { holographicMaterial } from './shaders/holographic'
import * as THREE from 'three'

interface PowerCubeProps {
  position: [number, number, number]
  onLoad: () => void
  onClick: () => void
}

export function PowerCube({ position, onLoad, onClick }: PowerCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const material = holographicMaterial()
  const cablesRef = useRef<THREE.Mesh[]>([])

  // Each route is in absolute coordinates (world space).
  // Make sure the first point(s) align with the Cube if desired.
  const cableRoutes = [
    {
      end: new THREE.Vector3(15, 0, 15),
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(15, 0, 0),
        new THREE.Vector3(15, 0, 15),
      ],
    },
    {
      end: new THREE.Vector3(0, 4, -25),
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, -15),
        new THREE.Vector3(0, 3, -15),
      ],
    },
    {
      end: new THREE.Vector3(-20, 0, -15),
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-10, 0, -10),
        new THREE.Vector3(-14, 0, -10),
      ],
    },
    {
      end: new THREE.Vector3(-30, 0, 25),
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(-15, 0.4, 10),
        new THREE.Vector3(-15, 0.6, 10),
      ],
    },
    {
      end: new THREE.Vector3(30, 0, 25), // recommendation vector
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0.11, -3),
        new THREE.Vector3(10, 0.2, -11),
        new THREE.Vector3(13, 1, -11),
      ],
    },
    
  ]

  useEffect(() => {
    // Animate the Cube’s Y position from whatever it starts at
    // to 'position[1]' over 4 seconds
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1],
        duration: 4,
        ease: 'power2.inOut',
        onComplete: onLoad,
      })
    }
  }, [onLoad, position])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      // Slowly rotate the Cube
      meshRef.current.rotation.y += 0.001
      material.uniforms.time.value = time
    }

    // Animate energy pulse along cables
    cablesRef.current.forEach((cable, index) => {
      if (cable.material instanceof THREE.MeshStandardMaterial) {
        const pulseOffset = (time + index * 0.3) % 1
        cable.material.opacity = Math.max(0.3, Math.sin(pulseOffset * Math.PI))
      }
    })
  })

  return (
    <group>
      {/* PowerCube Mesh */}
      <mesh
        ref={meshRef}
        position={[position[0], position[1] + 15, position[2]]}
        onClick={onClick}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={0x00ffff}
          emissive={0x00ffff}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* A second mesh for a glow effect (optional) */}
      <mesh
        position={[position[0], position[1] + 15, position[2]]}
        scale={0.8}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.3} />
      </mesh>

      {/* Energy cables in absolute/world space */}
      {cableRoutes.map((route, routeIndex) => {
        // One continuous CatmullRomCurve3 for each route
        const curve = new THREE.CatmullRomCurve3(route.points)

        return (
          <mesh
            key={routeIndex}
            ref={(el) => {
              if (el) cablesRef.current[routeIndex] = el
            }}
          >
            <tubeGeometry
              args={[curve, 20, 0.05, 8, false]} // segments, radius, radial segs, not closed
            />
            <meshStandardMaterial
              color={0xffffff}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}