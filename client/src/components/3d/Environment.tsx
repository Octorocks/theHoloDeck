import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PowerCube } from './PowerCube'
import { HolographicGrid } from './HolographicGrid'
import { Avatar } from './Avatar'
import { TechSphere } from './TechSphere'
import { Cityscape } from './Cityscape'
import { useEffect, useState } from 'react'
import { useAudio } from '@/hooks/use-audio'

export function Environment() {
  const [loaded, setLoaded] = useState(false)
  const { playAmbient } = useAudio()

  useEffect(() => {
    if (loaded) {
      playAmbient()
    }
  }, [loaded])

  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls 
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
        <PowerCube position={[0, 2, 0]} onLoad={() => setLoaded(true)} />

        <group position={[-5, 2, -5]}>
          <Avatar />
        </group>

        <group position={[5, 2, -5]}>
          <TechSphere />
        </group>

        <group position={[0, 2, -8]}>
          <Cityscape />
        </group>
      </Canvas>
    </div>
  )
}
