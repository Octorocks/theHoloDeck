import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PowerCube } from './PowerCube'
import { HolographicGrid } from './HolographicGrid'
import { Avatar } from './Avatar'
import { TechSphere } from './TechSphere'
import { Cityscape } from './Cityscape'
import { useEffect, useState, useCallback } from 'react'
import { useAudio } from '@/hooks/use-audio'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface EnvironmentProps {
  onObjectSelect: (position: THREE.Vector3, target: THREE.Vector3, objectId: string) => void
  activeObject: string | null
}

export function Environment({ onObjectSelect, activeObject }: EnvironmentProps) {
  const [loaded, setLoaded] = useState(false)
  const { playAmbient } = useAudio()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [controls, setControls] = useState<any>(null)

  useEffect(() => {
    if (loaded) {
      playAmbient()
    }
  }, [loaded, playAmbient])

  const moveCamera = useCallback((position: THREE.Vector3, target: THREE.Vector3, objectId: string) => {
    if (camera && controls) {
      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2,
        ease: "power2.inOut"
      })

      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 2,
        ease: "power2.inOut"
      })

      onObjectSelect(position, target, objectId)
    }
  }, [camera, controls, onObjectSelect])

  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera 
          ref={setCamera}
          makeDefault 
          position={[0, 15, 35]}
        />
        <OrbitControls 
          ref={setControls}
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
          onClick={() => moveCamera(new THREE.Vector3(0, 8, 15), new THREE.Vector3(0, 0, 0), 'cube')}
        />

        <group position={[-15, 0, -15]}>
          <Avatar 
            onClick={() => moveCamera(new THREE.Vector3(-12, 5, -10), new THREE.Vector3(-15, 0, -15), 'avatar')}
            isActive={activeObject === 'avatar'}
          />
        </group>

        <group position={[15, 5, -25]}>
          <TechSphere 
            onClick={() => moveCamera(new THREE.Vector3(12, 8, -20), new THREE.Vector3(15, 5, -25), 'sphere')}
            isActive={activeObject === 'sphere'}
          />
        </group>

        <group position={[-8, 0, -30]}>
          <Cityscape 
            onClick={() => moveCamera(new THREE.Vector3(-6, 5, -25), new THREE.Vector3(-8, 0, -30), 'city')}
            isActive={activeObject === 'city'}
          />
        </group>
      </Canvas>
    </div>
  )
}