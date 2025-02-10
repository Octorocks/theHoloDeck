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
  const [displayedText, setDisplayedText] = useState('')
  const fullText = `Tech obsessed and a huge nerd. I'm transitioning to a dedicated software development career, building on five years of impactful CRM automation work.`

  material.uniforms.time.value = 1.0;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowText(true), 2100)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
      setDisplayedText('')
    }
  }, [isActive])

  useEffect(() => {
    if (showText) {
      let index = -1 // not to self, don't write such crap code. That way, you won't have to start the index at -1 
      const typingSpeed = 15 
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index))
        index++
        if (index >= fullText.length) {
          clearInterval(interval)
        }
      }, typingSpeed)
      return () => clearInterval(interval)
    }
  }, [showText, fullText])

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 1.5, 0]} rotation={[0, Math.PI * 3/2.2, 0]}>
      {/* Server rack base */}
      <mesh>
        <boxGeometry args={[1.5, 3, 0.8]} />
        <meshStandardMaterial color={0x00ff00} metalness={0.8} roughness={0.2} emissive={0x00ff00} emissiveIntensity={0.2}/>
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

<Html position={[-1.6, 2, 0]}>
  <div
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
      isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'
    }`}
  >
    <h3 className="text-xl font-bold mb-2">About Me</h3>
    <div
      className={`relative bg-black rounded-lg shadow-lg text-green-400 font-mono overflow-hidden transition-all duration-500 ${
        showText ? 'p-4 max-h-96 opacity-100' : 'p-0 max-h-0 opacity-0'
      }`}
    >
      <p className="whitespace-pre-wrap">{displayedText}</p>
    </div>
  </div>
</Html>
    </group>
  )
}