import { useRef, useState, useEffect } from 'react'
// import { useFrame } from '@react-three/fiber'
import { holographicMaterial } from './shaders/holographic'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarProps {
  onClick: () => void
  isActive: boolean
}

export function Avatar({ onClick, isActive }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const material = holographicMaterial()
  const [showText, setShowText] = useState(false)

  material.uniforms.time.value = 1.0;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowText(true), 2100)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
    }
  }, [isActive])

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 1.5, 0]} rotation={[0, Math.PI * 3/2.2, 0]}>
      {/* Server rack base */}
      <mesh>
        <boxGeometry args={[1.5, 3, 0.8]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.8} roughness={0.2} emissive={0x111111} />
      </mesh>

      {/* Server units */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[0, -1.2 + i * 0.5, 0.41]}>
          {/* Server unit face */}
          <mesh>
            <boxGeometry args={[1.4, 0.4, 0.02]} />
            <meshStandardMaterial color={0x333333} metalness={0.9} roughness={0.1} emissive={0x222222} />
          </mesh>

          {/* Glowing status lights */}
          <mesh position={[0.6, 0, 0.02]}>
            <circleGeometry args={[0.05]} />
            <primitive object={material} attach="material" />
          </mesh>
        </group>
      ))}

      <Html position={[2, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'}`}>
          <h3 className="text-xl font-bold mb-2">About Me</h3>
          <div className={`overflow-hidden transition-all duration-500 ${showText ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-sm text-muted-foreground">
              A passionate developer with a love for creating immersive web experiences.
              Specializing in 3D web development and interactive applications.
            </p>
          </div>
        </div>
      </Html>
    </group>
  )
}