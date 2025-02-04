import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PowerCube } from './PowerCube'
import { HolographicGrid } from './HolographicGrid'
import { Avatar } from './Avatar'
import { TechSphere } from './TechSphere'
import { Cityscape } from './Cityscape'
import { useEffect, useState } from 'react'
import { useAudio } from '@/hooks/use-audio'
import * as THREE from 'three'

interface EnvironmentProps {
  onObjectSelect: (position: THREE.Vector3, target: THREE.Vector3, objectId: string) => void
  activeObject: string | null
  onControlsReady: (controls: any) => void
  onCameraReady: (camera: THREE.PerspectiveCamera) => void
}

export function Environment({ onObjectSelect, activeObject, onControlsReady, onCameraReady }: EnvironmentProps) {
  const [loaded, setLoaded] = useState(false)
  const { playAmbient } = useAudio()

  useEffect(() => {
    if (loaded) {
      playAmbient()
    }
  }, [loaded, playAmbient])

  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera 
          ref={onCameraReady}
          makeDefault 
          position={[0, 15, 35]}
        />
        <OrbitControls 
          ref={onControlsReady}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          // Add camera bounds
          minDistance={5}
          maxDistance={40}
          // Limit camera movement within room bounds
          minAzimuthAngle={-Math.PI} // Full rotation allowed
          maxAzimuthAngle={Math.PI}
        />

        <ambientLight intensity={0.2} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={0.5}
        />

        <HolographicGrid />
        <PowerCube 
          position={[0, 0, 0]} 
          onLoad={() => setLoaded(true)}
          onClick={() => onObjectSelect(new THREE.Vector3(0, 8, 15), new THREE.Vector3(0, 0, 0), 'cube')}
        />

        {/* Right segment */}
        <group position={[20, 0, -15]}>
          <Avatar 
            onClick={() => onObjectSelect(new THREE.Vector3(18, 5, -12), new THREE.Vector3(20, 0, -15), 'avatar')}
            isActive={activeObject === 'avatar'}
          />
        </group>

        {/* Back segment */}
        <group position={[0, 4, -25]}>
          <TechSphere 
            onClick={() => onObjectSelect(new THREE.Vector3(0, 8, -22), new THREE.Vector3(0, 4, -25), 'sphere')}
            isActive={activeObject === 'sphere'}
          />
        </group>

        {/* Left segment */}
        <group position={[-20, 0, -15]}>
          <Cityscape 
            onClick={() => onObjectSelect(new THREE.Vector3(-18, 5, -12), new THREE.Vector3(-20, 0, -15), 'city')}
            isActive={activeObject === 'city'}
          />
        </group>
      </Canvas>
    </div>
  )
}