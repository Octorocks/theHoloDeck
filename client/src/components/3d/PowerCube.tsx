import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Mesh, Line } from 'three'
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
  const cablesRef = useRef<THREE.Line[]>([])

  // Update the cable routes and thickness
  const cableRoutes = [
    {
      end: new THREE.Vector3(-18, 2, -22), // Avatar
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-18, 0, 0),
        new THREE.Vector3(-18, 2, -22)
      ]
    },
    {
      end: new THREE.Vector3(12, 8, -18), // TechSphere
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(12, 0, 0),
        new THREE.Vector3(12, 8, -18)
      ]
    },
    {
      end: new THREE.Vector3(-8, 2, -25), // Cityscape
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-8, 0, -15),
        new THREE.Vector3(-8, 2, -25)
      ]
    }
  ]

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1],
        duration: 2,
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
      if (cable.material instanceof THREE.LineBasicMaterial) {
        const pulseOffset = (time + index * 0.3) % 1
        cable.material.opacity = Math.max(0.3, Math.sin(pulseOffset * Math.PI))
      }
    })
  })

  // Update the line rendering with thicker lines
  return (
    <group>
      {/* Power cube */}
      <mesh 
        ref={meshRef} 
        position={[position[0], position[1] + 5, position[2]]}
        onClick={onClick}
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Energy cables */}
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

          return (
            <line
              key={`${index}-${pointIndex}`}
              ref={(el) => el && (cablesRef.current.push(el))}
            >
              <bufferGeometry
                attach="geometry"
                attributes={{
                  position: new THREE.Float32BufferAttribute(
                    points.flatMap(p => [p.x, p.y, p.z]),
                    3
                  )
                }}
              />
              <lineBasicMaterial
                attach="material"
                color={0x00ff88}
                transparent
                opacity={0.7}
                linewidth={3}
              />
            </line>
          )
        })
      ))}
    </group>
  )
}