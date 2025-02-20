import { Canvas } from '@react-three/fiber' // Import Canvas for rendering a 3D scene
import { OrbitControls, PerspectiveCamera } from '@react-three/drei' // Import Drei helpers for camera and controls
import { PowerCube } from './PowerCube' // Import custom 3D object components
import { HolographicGrid } from './HolographicGrid'
import { Avatar } from './Avatar'
import { TechSphere } from './TechSphere'
import { Cityscape } from './Cityscape'
import { HoloTerminal } from './Terminal'
import { useEffect, useState } from 'react' // React hooks for state and effects
import * as THREE from 'three' // Import Three.js for 3D vector calculations

// Define props for the Environment component
interface EnvironmentProps {
  onObjectSelect: (position: THREE.Vector3, target: THREE.Vector3, objectId: string) => void // Callback when an object is selected
  activeObject: string | null // Tracks the currently active object
  onControlsReady: (controls: any) => void // Callback when camera controls are ready
  onCameraReady: (camera: THREE.PerspectiveCamera) => void // Callback when the camera is ready
}

// Environment component that sets up the 3D scene
export function Environment({ onObjectSelect, activeObject, onControlsReady, onCameraReady }: EnvironmentProps) {
  const [loaded, setLoaded] = useState(false) // State to track when the scene has loaded
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0)

  useEffect(() => {
    // Delay ambient light until cube lands
    const timer = setTimeout(() => {
      setAmbientLightIntensity(0.2)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-screen no-select">
      <Canvas shadows gl={{ alpha: false }} onCreated={({ gl }) => {
        gl.setClearColor('#333333')
      }}>
        
        {/* Set up the main camera */}
        <PerspectiveCamera 
          ref={onCameraReady} // Store reference to the camera
          makeDefault // Make this the default camera
          position={[20, 14, 10]} // Initial camera position
        />
        
        {/* Enable user control over the camera (click & drag, zoom, pan) */}
        <OrbitControls 
          ref={onControlsReady} // Store reference to controls
          enablePan={false} // deny panning
          enableZoom={false} // Allow zooming
          enableRotate={true} // deny rotation
          minPolarAngle={Math.PI / 4} // Restrict downward tilt
          maxPolarAngle={Math.PI / 2.5} // Restrict upward tilt
          // Limit how far the camera can move forward and backward
          minDistance={2} 
          maxDistance={50}
          // Allow full 360-degree rotation
          minAzimuthAngle={-4 * Math.PI} 
          maxAzimuthAngle={4 * Math.PI}
        />

        {/* Scene lighting */}
        <ambientLight intensity={ambientLightIntensity} /> {/* Dynamic intensity */}
        <spotLight 
          position={[10, 10, 10]} // Light position
          angle={0.15} // Beam angle
          penumbra={1} // Softness of the edges
          intensity={0.5} // Brightness
        />

        <HolographicGrid /> {/* Add a futuristic grid effect */}

        {/* Power Cube object in the center */}
        <PowerCube 
          position={[0, 1, 0]} 
          onLoad={() => setLoaded(true)} // Mark scene as loaded when PowerCube loads
          onClick={() => onObjectSelect(new THREE.Vector3(0, 8, 15), new THREE.Vector3(0, 0, 0), 'cube')} // Move camera on click
        />

        {/* Right segment - Avatar */}
        <group position={[15, 0, 15]}>
          <Avatar 
            onClick={() => onObjectSelect(
              new THREE.Vector3(10, 8, 10),  // Camera position: moved inward towards center
              new THREE.Vector3(15, 0, 15),  // Still looking at the object's position
              'avatar'
            )}
            isActive={activeObject === 'avatar'}
          />
        </group>

        {/* Back segment - TechSphere */}
        <group position={[0, 4, -15]}>
          <TechSphere 
            onClick={() => onObjectSelect(new THREE.Vector3(0, 8, -9), new THREE.Vector3(0, 4, -15), 'sphere')}
            isActive={activeObject === 'sphere'}
          />
        </group>

        {/* Left segment - Cityscape */}
        <group position={[-15, 1, -10]}>
          <Cityscape 
            onClick={() => onObjectSelect(
              new THREE.Vector3(-10, 5, -5),  // Camera position: moved inward for better view
              new THREE.Vector3(-15, 1, -10),  // Looking at the object's position
              'city'
            )}
            isActive={activeObject === 'city'}
          />
        </group>

        {/* HoloTerminal */}
        <group position={[15, 0, -15]}>
          <HoloTerminal 
            onClick={() => onObjectSelect(
              new THREE.Vector3(-7, 3, 6),
              new THREE.Vector3(-15, 3.5, 10),
              'terminal'
            )}
            isActive={activeObject === 'terminal'}
          />
        </group>

      </Canvas>
    </div>
  )
}
