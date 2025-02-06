import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

interface HoloTerminalProps {
  onClick: () => void
  isActive: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const projects = [
  { name: "Portfolio", tech: "Next.js, Three.js" },
  { name: "AI Chat", tech: "OpenAI, React" },
  { name: "Task Manager", tech: "TypeScript, Redux" },
  { name: "Weather App", tech: "React, API" },
  { name: "Blog Platform", tech: "Next.js, MDX" },
  { name: "Game Engine", tech: "Three.js, WebGL" }
]

export function HoloTerminal({ 
  onClick, 
  isActive, 
  position = [-30, 0, 25],
  rotation = [0, Math.PI * 2/3, 0]  // Default 120-degree rotation
}: HoloTerminalProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [cardStates, setCardStates] = useState(projects.map(() => ({ scale: 0, opacity: 0 })))

  useFrame(() => {
    cardStates.forEach((state, index) => {
      if (groupRef.current?.children[index + 3]) { // +3 to skip terminal meshes
        const card = groupRef.current.children[index + 3]
        card.scale.lerp(new THREE.Vector3(state.scale, state.scale, state.scale), 0.1)
        const mesh = card as THREE.Mesh
        if (mesh.material && mesh.material instanceof THREE.Material) {
          mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, state.opacity, 0.1)
        }
      }
    })
  })

  useEffect(() => {
    if (isActive) {
      // Stagger the animations with proper opacity
      projects.forEach((_, index) => {
        setTimeout(() => {
          setCardStates(prev => prev.map((state, i) => 
            i === index ? { scale: 1, opacity: 0.8 } : state  // Increased opacity
          ))
        }, index * 200)
      })
    } else {
      setCardStates(projects.map(() => ({ scale: 0, opacity: 0 })))
    }
  }, [isActive])

  return (
    <group 
      ref={groupRef} 
      onClick={onClick} 
      position={position}
      rotation={rotation}
    >
      {/* Main terminal screen */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 1.3, 0.1]} />
        <meshStandardMaterial 
          color={0x000000}
          emissive={0x00ff00}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Terminal base */}
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[1.5, 0.1, 0.4]} />
        <meshStandardMaterial 
          color={0x333333}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Holographic text */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.1}
        color={0x00ff00}
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? '> TERMINAL ACTIVE_' : '> READY_'}
      </Text>

      <Html position={[2, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'}`}>
          <h3 className="text-xl font-bold mb-2">Terminal</h3>
          <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          </div>
        </div>
      </Html>

      {/* Floating project cards */}
      {projects.map((project, index) => {
        let position: [number, number, number] = [0, 0, 0];
        if (index < 2) {
          position = [-3.5, 1.8 + (index * 1.5), 0];
        } else if (index < 4) {
          position = [(index - 2.5) * 2.5, 3.3, 0];
        } else if (index < 6) {
          position = [3.5, 1.8 + ((index - 4) * 1.5), 0];
        }

        // Holographic color palette
        const colors = [
          '#00ffff',  // Cyan
          '#ff00ff',  // Magenta
          '#00ff80',  // Mint
          '#4040ff',  // Blue
          '#ff8000',  // Orange
          '#8000ff'   // Purple
        ];

        return (
          <group
            key={project.name}
            position={position}
            scale={0}
          >
            <mesh>
              <planeGeometry args={[1.5, 0.9]} />
              <meshBasicMaterial 
                color={colors[index]}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Text
              position-z={0.1}
              fontSize={0.15}
              color="white"
            >
              {project.name}
            </Text>
          </group>
        );
      })}
    </group>
  )
}
