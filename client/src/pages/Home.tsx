import { Environment } from '@/components/3d/Environment'
import { useState, useCallback } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function Home() {
  const [activeObject, setActiveObject] = useState<string | null>(null)
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [controls, setControls] = useState<any>(null)

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

      setActiveObject(objectId)
    }
  }, [camera, controls])

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <Environment 
        onObjectSelect={moveCamera}
        activeObject={activeObject}
        onControlsReady={setControls}
        onCameraReady={setCamera}
      />

      <div className="fixed top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-primary">3D Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Navigate using mouse/touch controls
        </p>
      </div>

      {/* Navigation Index */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-background/90 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-primary">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => moveCamera(
                  new THREE.Vector3(0, 8, 15),
                  new THREE.Vector3(0, 0, 0),
                  'cube'
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'cube' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                Power Core
              </button>
            </li>
            <li>
              <button
                onClick={() => moveCamera(
                  new THREE.Vector3(18, 5, -12),
                  new THREE.Vector3(20, 0, -15),
                  'avatar'
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'avatar'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                About Me
              </button>
            </li>
            <li>
              <button
                onClick={() => moveCamera(
                  new THREE.Vector3(0, 8, -22),
                  new THREE.Vector3(0, 4, -25),
                  'sphere'
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'sphere'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Skills
              </button>
            </li>
            <li>
              <button
                onClick={() => moveCamera(
                  new THREE.Vector3(-18, 5, -12),
                  new THREE.Vector3(-20, 0, -15),
                  'city'
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'city'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Experience
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}