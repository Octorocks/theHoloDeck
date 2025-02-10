import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { holographicMaterial } from './shaders/holographic'
import * as THREE from 'three'

interface CityscapeProps {
  onClick: () => void
  isActive: boolean
}

export function Cityscape({ onClick, isActive }: CityscapeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const material = holographicMaterial()
  const [brightness, setBrightness] = useState(0.1)
  const [showText, setShowText] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowText(true), 2100)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
      setSelectedCompany(null)
    }
  }, [isActive])

  // Animate the material's 'time' uniform using the frame clock
  useFrame((state) => {
    if (groupRef.current) {
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  const companies = {
    hirespace: {
      name: "Hire Space",
      color: "emerald",
      role: "CRM Specialist",
      description: [
        "Own the CRM system",
        "Build and maintain custom code automations",
        "Run Hubspot QA", 
        "Maintain data integrity across pipelines and use cases"
      ],
      tech: "Node.js, JavaScript, HubL, HTML/CSS, SQL"
    },
    monzo: {
      name: "Monzo",
      color: "cyan",
      role: "CoP Contractor",
      description: [
        "Ran analyses on politically exposed clients",
        "Identity verification and fraud detection",
        "Frontline ops support"
      ],
      tech: "Monzo Chat"
    },
    better: {
      name: "Better",
      color: "amber",
      role: "Operations Manager",
      description: [
        "Own the CRM system",
        "Embed 3rd party services",
        "Manage customer support department"
      ],
      tech: "SaaSquatch, Zapier, Hubspot, Segment, Hiya, the BAT Computer"
    },
    royalmail: {
      name: "Royal Mail",
      color: "red",
      role: "Postman",
      description: [
        "Deliver post"
      ],
      tech: "My own human legs"
    }
  }

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Simple Cube */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial 
          color={0x00ff88}
          emissive={0x00ff88}
          emissiveIntensity={brightness}
          wireframe={true}
        />
      </mesh>

      <Html position={[-1.2, 0.8, 1]}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
            isActive ? 'w-80 opacity-100' : 'w-32 opacity-80'
          }`}
        >
          <h3 className="text-xl font-bold mb-2">Experience</h3>
          <div className={`overflow-hidden transition-all duration-500 ${showText ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Matrix:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(companies).map(([key, company]) => (
                  <div
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCompany(selectedCompany === key ? null : key)
                    }}
                    className={`
                      border ${company.color === 'cyan' ? 'border-cyan-400/30' : ''}
                      ${company.color === 'emerald' ? 'border-emerald-400/30' : ''}
                      ${company.color === 'amber' ? 'border-amber-400/30' : ''}
                      ${company.color === 'red' ? 'border-red-400/30' : ''}
                      ${company.color === 'cyan' ? 'bg-cyan-950/20 hover:bg-cyan-950/40' : ''}
                      ${company.color === 'emerald' ? 'bg-emerald-950/20 hover:bg-emerald-950/40' : ''}
                      ${company.color === 'amber' ? 'bg-amber-950/20 hover:bg-amber-950/40' : ''}
                      ${company.color === 'red' ? 'bg-red-950/20 hover:bg-red-950/40' : ''}
                      p-2 rounded transition-all cursor-pointer
                      ${selectedCompany === key ? 'col-span-2 row-span-2' : ''}
                    `}
                  >
                    <p className={`
                      ${company.color === 'cyan' ? 'text-cyan-400' : ''}
                      ${company.color === 'emerald' ? 'text-emerald-400' : ''}
                      ${company.color === 'amber' ? 'text-amber-400' : ''}
                      ${company.color === 'red' ? 'text-red-400' : ''}
                    `}>
                      → {company.name}
                    </p>
                    {selectedCompany === key ? (
                      <div className="mt-2 space-y-2 animate-fadeIn">
                        <p className="text-xs font-semibold">{company.role}</p>
                        <ul className="text-xs opacity-70 list-disc pl-4 space-y-1">
                          {Array.isArray(company.description) 
                            ? company.description.map((item, i) => <li key={i}>{item}</li>)
                            : company.description}
                        </ul>
                        <p className="text-xs opacity-70 font-mono">{company.tech}</p>
                      </div>
                    ) : (
                      <p className="text-xs opacity-70">•••</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
