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
  const glowRef = useRef<Mesh>(null)
  const cablesRef = useRef<THREE.Mesh[]>([])

  // Update cable routes to match new object positions
  const cableRoutes = [
    {
      end: new THREE.Vector3(15, 0, 15), // Updated Avatar position
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(15, 0, 0),
        new THREE.Vector3(15, 0, 15)
      ]
    },
    {
      end: new THREE.Vector3(0, 4, -25), // TechSphere
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -15),
        new THREE.Vector3(0, 3, -15)
      ]
    },
    {
      end: new THREE.Vector3(-20, 0, -15), // Cityscape
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-10, 0, -10),
        new THREE.Vector3(-14, 0, -10)
      ]
    },
  {
    end: new THREE.Vector3(-30, 0, 25), // Terminal
    points: [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-7, 0, 10),
      new THREE.Vector3(-16, 0, 10)
  ]
    }
  ]

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1],
        duration: 4,
        ease: "power2.inOut",
        onComplete: onLoad
      })
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
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

  // Update the line rendering with thicker lines using TubeGeometry
  return (
    <group>
      {/* Power cube with glow effect */}
      <>
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
        <mesh
          position={[position[0], position[1] + 15, position[2]]}
          scale={0.8}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial 
            color={0x00ffff}
            transparent
            opacity={0.3}
          />
        </mesh>
      </>

      {/* Energy cables using TubeGeometry */}
      {cableRoutes.map((route, index) => (
        route.points.map((point, pointIndex) => {
          if (pointIndex === route.points.length - 1) return null

          const nextPoint = route.points[pointIndex + 1]
          const points = []
          const segments = 20

          for (let i = 0; i <= segments; i++) {
            const t = i / segments
            points.push(new THREE.Vector3(
              point.x * (1 - t) + nextPoint.x * t,
              point.y * (1 - t) + nextPoint.y * t,
              point.z * (1 - t) + nextPoint.z * t
            ))
          }

          const curve = new THREE.CatmullRomCurve3(points) // Create a smooth curve through points

          return (
            <mesh
              key={`${index}-${pointIndex}`}
              ref={(el) => el && (cablesRef.current.push(el))}
            >
              <tubeGeometry
                args={[curve, 20, 0.05, 8, false]} // TubeGeometry with radius 0.2 (thickness)
              />
              <meshStandardMaterial
                attach="material"
                color={0xffffff}
                transparent
                opacity={0.7}
              />
            </mesh>
          )
        })
      ))}
    </group>
  )
}
