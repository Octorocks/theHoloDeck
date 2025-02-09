import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

interface HoloTerminalProps {
  onClick: () => void
  isActive: boolean
  shouldAnimate?: boolean  // New optional prop to control animation
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
  const [clicked, setClicked] = useState(false);

  const handleLocalClick = (e: any) => {
    e.stopPropagation();
    setClicked(true);
    onClick();
  }

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
    if (clicked) {
      projects.forEach((_, index) => {
        setTimeout(() => {
          setCardStates(prev =>
            prev.map((state, i) =>
              i === index ? { scale: 1, opacity: 0.8 } : state
            )
          );
        }, index * 200);
      });
    } else {
      setCardStates(projects.map(() => ({ scale: 0, opacity: 0 })));
    }
  }, [clicked]);

  // Add effect for selection
  useEffect(() => {
    if (selectedProject !== null) {
      setCardStates(prev => prev.map((state, index) => 
      index === selectedProject 
        ? { scale: 1, opacity: 0.8 }
        : { scale: 0, opacity: 0 }
    ))
    } else if (clicked) {
      // Restore all cards when deselecting
      projects.forEach((_, index) => {
        setTimeout(() => {
          setCardStates(prev => prev.map((state, i) => 
            i === index ? { scale: 1, opacity: 0.8 } : state
          ))
        }, index * 200)
      })
    }
  }, [selectedProject, clicked])

  return (
    <group 
      ref={groupRef} 
      onClick={handleLocalClick} 
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
        onClick={(e) => {
          e.stopPropagation();
          if (selectedProject !== null) {
            // If < BACK_ is clicked, reset state to return to READY state.
            setSelectedProject(null);
            setClicked(false);
          } else {
            // When the terminal is in its READY state, execute onClick to move the camera.
            if (!clicked) {
              onClick(); // This callback should move the camera to a specific vector.
              setClicked(true);
            }
          }
        }}
      >
        {selectedProject !== null ? '< BACK_' : clicked ? '> SELECT_' : '> READY_'}
      </Text>

      {/* Project details panel */}
      <Html position={[-3, 0, 0]}>
        <div className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
          clicked ? 'w-64 opacity-100' : 'w-32 opacity-80'
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
          position = [-2.5, 1.3 + (index * 1.2), 0];
        } else if (index < 4) {
          position = [(index - 2.5) * 1.7, 2.9, 0];
        } else if (index < 6) {
          position = [2.5, 1.3 + ((index - 4) * 1.2), 0];
        }

        return (
          <group
            key={project.name}
            position={position}
            scale={0}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle card selection: deselect if already chosen, otherwise select.
              if (selectedProject === index) {
                setSelectedProject(null);
              } else {
                setSelectedProject(index);
              }
            }}
          >
            <mesh>
              <planeGeometry args={[1.5, 0.9]} />
              <meshBasicMaterial
                color={
                  index === 0 ? '#00ff00' :  // AutoResponder: Green
                  index === 1 ? '#ff8000' :  // Pipeline Tool: Orange
                  index === 2 ? '#ff69b4' :  // Referral System: Pink
                  index === 3 ? '#4040ff' :  // DnD Roller: Unchanged
                  index === 4 ? '#ff0000' :  // RHCP Ranker: Red
                  '#8000ff'                // Server Project: Unchanged
                }
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Text position-z={0.1} fontSize={0.15} color="white">
              {project.name}
            </Text>
          </group>
        );
      })}
    </group>
  )
}
