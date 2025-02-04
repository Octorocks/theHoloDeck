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

export function Environment() {
  const [loaded, setLoaded] = useState(false)
  const { playAmbient } = useAudio()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [controls, setControls] = useState<any>(null)

  useEffect(() => {
    if (loaded) {
      playAmbient()
    }
  }, [loaded])

  const moveCamera = useCallback((position: THREE.Vector3, target: THREE.Vector3) => {
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
    }
  }, [camera, controls])

  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera 
          ref={setCamera}
          makeDefault 
          position={[0, 5, 15]} 
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
          position={[0, 2, 0]} 
          onLoad={() => setLoaded(true)}
          onClick={() => moveCamera(new THREE.Vector3(0, 3, 5), new THREE.Vector3(0, 2, 0))}
        />

        <group position={[-10, 2, -10]}>
          <Avatar 
            onClick={() => moveCamera(new THREE.Vector3(-8, 3, -5), new THREE.Vector3(-10, 2, -10))}
          />
        </group>

        <group position={[10, 2, -10]}>
          <TechSphere 
            onClick={() => moveCamera(new THREE.Vector3(8, 3, -5), new THREE.Vector3(10, 2, -10))}
          />
        </group>

        <group position={[0, 2, -15]}>
          <Cityscape 
            onClick={() => moveCamera(new THREE.Vector3(0, 3, -10), new THREE.Vector3(0, 2, -15))}
          />
        </group>
      </Canvas>
    </div>
  )
}