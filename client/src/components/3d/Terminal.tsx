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

interface Project {
  name: string;
  tech: string;
  description: React.ReactNode;
  link?: string;
}

const projects: Project[] = [
  { 
    name: "AutoResponder",
    tech: "Node.js, REST APIs, JavaScript, MongoDB",
    description: "Dynamic enquiry autoresponder with real-time API processing for improved user engagement."
  },
  { 
    name: "Pipeline Tool",
    tech: "Node.js, JavaScript, Hubspot, Regexp",
    description: "Venue account management pipeline. Designed for scalability, it eliminated key data processing bottlenecks"
  },
  { 
    name: "Referral System", 
    tech: "SaaSquatch, Hubspot",
    description: "High-converting referral system for the UK's top online mortgage broker. Optimised for user-engagement and retention."
  },
  { 
    name: "DnD Roller", 
    tech: "Python",
    description: "Personal project: an initial DnD stat roller, guarantees all players a certain position on the bell curve distibution of 3d6 rolls. A massive time saver."
  },
  { 
    name: "RHCP Ranker", 
    tech: "Node.js, JavaScript, Custom ELO algorithm",
    description: (
      <>
        Ranks every <a href="https://github.com/Octorocks/RHCP-ELO-rank-project" target="_blank" rel="noopener noreferrer">RHCP song</a> by assigning and storing an ELO rating based on front end user input.
      </>
    )
  },
  { 
    name: "Server Project", 
    tech: "Node.js, Linux, Custom APIs, Cloudflare proxy, JavaScript",
    description: "This site is hosted entirely on a self-coded server, which is currently sat on my desk. Iterate headlessly via command line linux, don't get me started on the reverse proxy. "

  }
]

export function HoloTerminal({ 
  onClick, 
  isActive, 
  position = [-30, 0, 25],
  rotation = [0, Math.PI * 2/3, 0]  // Default 120-degree rotation
}: HoloTerminalProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [cardStates, setCardStates] = useState(projects.map(() => ({ scale: 0, opacity: 1 })))
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useFrame(() => {
    cardStates.forEach((state, index) => {
      if (groupRef.current?.children[index + 4]) { // +4 to skip terminal meshes and Html element
        const card = groupRef.current.children[index + 4]
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
            i === index ? { scale: 1, opacity: 0.8 } : state
          ))
        }, index * 200)
      })
    } else {
      setCardStates(projects.map(() => ({ scale: 0, opacity: 0 })))
    }
  }, [isActive])

  // Add effect for selection
  useEffect(() => {
    if (selectedProject !== null) {
      setCardStates(prev => prev.map((state, index) => 
      index === selectedProject 
        ? { scale: 1, opacity: 0.8 }
        : { scale: 0, opacity: 0 }
    ))
    } else if (isActive) {
      // Restore all cards when deselecting
      projects.forEach((_, index) => {
        setTimeout(() => {
          setCardStates(prev => prev.map((state, i) => 
            i === index ? { scale: 1, opacity: 0.8 } : state
          ))
        }, index * 200)
      })
    }
  }, [selectedProject, isActive])

  return (
    <group 
      ref={groupRef} 
      onClick={onClick} 
      position={position}
      rotation={rotation}
    >
      {/* Main terminal screen with click handler */}
      <mesh 
        position={[0, 1.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedProject !== null) {
            setSelectedProject(null);  // Clear selection to go back
          }
        }}
      >
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
        fontSize={0.5}
        color={0x00ff00}
        anchorX="center"
        anchorY="middle"
      >
        {selectedProject !== null ? '< BACK_' : isActive ? '> SELECT_' : '> READY_'}
      </Text>

      {/* Project details panel */}
      <Html position={[2, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
          isActive ? 'w-64 opacity-100' : 'w-32 opacity-80'
        }`}>
          <h3 className="text-xl font-bold mb-2">Projects</h3>
          <div className={`overflow-hidden transition-all duration-500 ${
            selectedProject !== null ? 'max-h-48' : 'max-h-24'
          } opacity-100`}>
            {selectedProject !== null ? (
              <>
                <h4 className="text-lg text-primary">{projects[selectedProject].name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{projects[selectedProject].tech}</p>
                <p className="text-sm mt-2">{projects[selectedProject].description}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                
              </p>
            )}
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

        return (
          <group
            key={project.name}
            position={position}
            scale={0}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(index);
            }}
          >
            <mesh>
              <planeGeometry args={[1.5, 0.9]} />
              <meshBasicMaterial  // Changed to BasicMaterial
                color={index === 0 ? 'cyan' : 
                       index === 1 ? 'magenta' : 
                       index === 2 ? '#00ff80' : 
                       index === 3 ? '#4040ff' : 
                       index === 4 ? '#ff8000' : 
                       '#8000ff'}
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
