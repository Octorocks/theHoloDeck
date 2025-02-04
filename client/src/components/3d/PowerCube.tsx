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

  // Create cable points to other objects
  const cableEndPoints = [
    new THREE.Vector3(-10, 2, -10), // To Avatar
    new THREE.Vector3(10, 2, -10),  // To TechSphere
    new THREE.Vector3(0, 2, -15)    // To Cityscape
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
      // Rotate cube
      meshRef.current.rotation.y += 0.01
      material.uniforms.time.value = time

      // Pulse the glow
      if (glowRef.current) {
        glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      }

      // Animate cables
      cablesRef.current.forEach((cable, index) => {
        if (cable.material instanceof THREE.LineBasicMaterial) {
          cable.material.opacity = (Math.sin(time * 2 + index) * 0.3 + 0.7)
        }
      })
    }
  })

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

      {/* Glow effect */}
      <mesh
        ref={glowRef}
        position={[position[0], position[1], position[2]]}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial 
          color={0x00ff88}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Energy cables */}
      {cableEndPoints.map((endPoint, index) => {
        const points = []
        const startPoint = new THREE.Vector3(position[0], position[1], position[2])
        const controlPoint = new THREE.Vector3(
          (startPoint.x + endPoint.x) * 0.5,
          position[1] + 2,
          (startPoint.z + endPoint.z) * 0.5
        )

        // Create curved path
        for (let i = 0; i <= 20; i++) {
          const t = i / 20
          points.push(new THREE.Vector3(
            startPoint.x * (1 - t) * (1 - t) + controlPoint.x * 2 * (1 - t) * t + endPoint.x * t * t,
            startPoint.y * (1 - t) * (1 - t) + controlPoint.y * 2 * (1 - t) * t + endPoint.y * t * t,
            startPoint.z * (1 - t) * (1 - t) + controlPoint.z * 2 * (1 - t) * t + endPoint.z * t * t
          ))
        }

        return (
          <line
            key={index}
            ref={(el) => el && (cablesRef.current[index] = el)}
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
              linewidth={2}
            />
          </line>
        )
      })}
    </group>
  )
}