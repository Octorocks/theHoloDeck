import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { recommendations } from '../../data/recommendationData'

interface RecommendProps {
  onClick: () => void
  isActive: boolean
}

export function Recommendation({ onClick, isActive }: RecommendProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle isActive state with a delay for expansion
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsExpanded(true), 2100); // Delay expansion
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false); // Collapse immediately
    }
  }, [isActive])

  // Rotate the torus knot on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1; // Rotate around the X axis
      meshRef.current.rotation.y += delta * 0.1; // Rotate around the Y axis
    }
  })

  // Cycle to the next recommendation
  const nextRecommendation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length)
  }

  // Cycle to the previous recommendation
  const prevRecommendation = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    )
  }

  // Handle click to move camera and expand recommendations
  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick() // Move the camera to the object
  }

  return (
    <group>
      {/* Torus Knot */}
      <mesh ref={meshRef} onClick={handleClick}>
        <torusKnotGeometry args={[1.5, 0.3, 100, 16]} /> 
        <meshPhongMaterial 
          color={0x00ff88}
          emissive={0x00ff88}
          emissiveIntensity={0.9}
          wireframe={true}
        />
      </mesh>

      {/* Recommendation Panel */}
      <Html position={[-2, 3.5, -2]}>
        <div
          onClick={handleClick}
          className={`bg-background/90 p-4 rounded-lg transition-all duration-300 ${
            isExpanded ? 'w-80 opacity-100' : 'w-42 opacity-80'
          }`}
        >
          <h3 className="text-xl font-bold mb-2">Endorsements</h3>
          {isExpanded && (
            <div className="text-sm text-muted-foreground transition-opacity duration-500">
              <p className="mb-2 whitespace-pre-line">{recommendations[currentIndex].text}</p>
              <p className="text-primary font-semibold">— {recommendations[currentIndex].name}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevRecommendation();
                  }}
                  className="text-primary hover:text-primary/80 transition-colors duration-500"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ff88] transition-all duration-500"
                      style={{ width: `${((currentIndex + 1) / recommendations.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {recommendations.length}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextRecommendation();
                  }}
                  className="text-primary hover:text-primary/80 transition-colors duration-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
