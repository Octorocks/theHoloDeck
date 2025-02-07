import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface TechSphereProps {
  onClick: () => void
  isActive: boolean
}

export function TechSphere({ onClick, isActive }: TechSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const [brightness, setBrightness] = useState(1)
  const [showExpandedContent, setShowExpandedContent] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowExpandedContent(true), 2100)
      return () => clearTimeout(timer)
    } else {
      setShowExpandedContent(false)
    }
  }, [isActive])

  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime()
      setBrightness(1 + Math.abs(Math.sin(time)) * 0.5)

      sphereRef.current.rotation.y += 0.0015
    }
  })

  return (
    <group>
      <mesh ref={sphereRef} onClick={onClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={0x00ff00}
          emissive={0x002200}
          emissiveIntensity={brightness}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>

      <Html position={[2, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
          isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'
        }`}>
          <h3 className="text-xl font-bold mb-2">Skills</h3>
          <div className={`overflow-hidden transition-all duration-500 ${
            showExpandedContent ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg text-cyan-400 font-semibold">Frontend</h4>
                <p className="text-sm text-muted-foreground">HTML/CSS, TypeScript, JavaScript, MS Paint (Don't @ me)</p>
              </div>
              <div>
                <h4 className="text-lg text-fuchsia-400 font-semibold">Backend</h4>
                <p className="text-sm text-muted-foreground">Node.js, CRM Automation, SQL</p>
              </div>
              <div>
                <h4 className="text-lg text-yellow-400 font-semibold">Awards</h4>
                <p className="text-sm text-muted-foreground">Cultural Champion, MVP of Operations, Best Ideator</p>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}