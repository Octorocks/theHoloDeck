import { Environment } from '@/components/3d/Environment'
import { useState, useCallback } from 'react'
import * as THREE from 'three'

export default function Home() {
  const [activeObject, setActiveObject] = useState<string | null>(null)

  const handleObjectSelect = useCallback((
    position: THREE.Vector3,
    target: THREE.Vector3,
    objectId: string
  ) => {
    setActiveObject(objectId)
  }, [])

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <Environment 
        onObjectSelect={handleObjectSelect}
        activeObject={activeObject}
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
                onClick={() => handleObjectSelect(
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
                onClick={() => handleObjectSelect(
                  new THREE.Vector3(-12, 5, -10),
                  new THREE.Vector3(-15, 0, -15),
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
                onClick={() => handleObjectSelect(
                  new THREE.Vector3(12, 8, -20),
                  new THREE.Vector3(15, 5, -25),
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
                onClick={() => handleObjectSelect(
                  new THREE.Vector3(-6, 5, -25),
                  new THREE.Vector3(-8, 0, -30),
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