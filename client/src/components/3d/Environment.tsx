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

        <group position={[-18, 2, -22]}>
          <Avatar 
            onClick={() => onObjectSelect(new THREE.Vector3(-15, 5, -18), new THREE.Vector3(-18, 2, -22), 'avatar')}
            isActive={activeObject === 'avatar'}
          />
        </group>

        <group position={[12, 8, -18]}>
          <TechSphere 
            onClick={() => onObjectSelect(new THREE.Vector3(10, 12, -15), new THREE.Vector3(12, 8, -18), 'sphere')}
            isActive={activeObject === 'sphere'}
          />
        </group>

        <group position={[-8, 2, -25]}>
          <Cityscape 
            onClick={() => onObjectSelect(new THREE.Vector3(-6, 6, -22), new THREE.Vector3(-8, 2, -25), 'city')}
            isActive={activeObject === 'city'}
          />
        </group>
      </Canvas>
    </div>
  )
}