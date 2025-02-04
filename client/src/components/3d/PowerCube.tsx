import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Mesh } from 'three'
import { holographicMaterial } from './shaders/holographic'

interface PowerCubeProps {
  position: [number, number, number]
  onLoad: () => void
  onClick: () => void
}

export function PowerCube({ position, onLoad, onClick }: PowerCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const material = holographicMaterial()

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
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={[position[0], position[1] + 5, position[2]]}
      onClick={onClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}