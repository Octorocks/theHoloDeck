import { Environment } from '@/components/3d/Environment' // Import the 3D environment component
import { useState, useEffect, useCallback } from 'react' // Import React hooks for state and memoized functions
import * as THREE from 'three' // Import the Three.js library for 3D rendering
import { gsap } from 'gsap' // Import GSAP for smooth animations
import { Music, Volume2, VolumeX } from 'lucide-react' 
import { useAudio } from '../hooks/use-audio'
import '../index.css'


// make sure this message is only visible for 10 seconds, for the sake of mobile users
const FunkyMessage = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000); // Message visible for 10 seconds
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div>
      {visible && (
        <p className="text-sm text-muted-foreground">
          Toggle sound on <br></br> for a funky experience
        </p>
      )}
    </div>
  );
};

export default function Home() {
  // State to track the currently active object
  const [activeObject, setActiveObject] = useState<string | null>(null)

  // State to store the camera reference
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)

  // State to store the camera controls (like OrbitControls)
  const [controls, setControls] = useState<any>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const { playAmbient, stopAmbient } = useAudio()

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  // Function to smoothly move the camera to a new position and focus on a target
  const moveCamera = useCallback((position: THREE.Vector3, target: THREE.Vector3, objectId: string) => {
    if (camera && controls) {
      // Animate the camera position using GSAP
      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2, // Animation duration (2 seconds)
        ease: "power2.inOut" // Smooth easing function
      })

      // Animate the camera's target (where it's looking)
      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 2,
        ease: "power2.inOut"
      })

      setActiveObject(objectId) // Update the active object state
    }
  }, [camera, controls]) // Dependencies: function updates when camera or controls change

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopAmbient()
    } else {
      playAmbient()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, playAmbient, stopAmbient])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle the menu open/close
  };

  const handleMenuItemClick = (cameraPosition: THREE.Vector3, lookAtPosition: THREE.Vector3, objectId: string) => {
    moveCamera(cameraPosition, lookAtPosition, objectId); // Move the camera
    setIsMenuOpen(false); // Close the menu after selection
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      {/* 3D Environment Component */}
      <Environment 
        onObjectSelect={moveCamera} // Callback when an object is selected
        activeObject={activeObject} // Pass active object state
        onControlsReady={setControls} // Set controls when ready
        onCameraReady={setCamera} // Set camera when ready
      />

      {/* Title & Instructions (Fixed at the top-left) */}
      <div className="fixed top-4 left-4 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">HoloDeck <br></br> Portfolio.</h1>
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={isPlaying ? 'Mute music' : 'Play music'}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
        <FunkyMessage />
      </div>

      {/* Navigation Menu (Fixed at the top-right) */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-background/90 p-4 rounded-lg">
          <h2 
            className="text-lg font-semibold mb-2 text-primary cursor-pointer" 
            onClick={toggleMenu} // Toggle menu on click
          >
            Navigation
          </h2>
          <ul className={`menu ${isMenuOpen ? 'open' : ''} space-y-2`}>
            {/* Button to move the camera to the "Power Core" object */}
            <li>
              <button
                onClick={() => handleMenuItemClick(
                  new THREE.Vector3(0, 8, 15), // Camera position
                  new THREE.Vector3(0, 0, 0), // Look at target
                  'cube' // Object ID
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'cube' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                Central Core
              </button>
            </li>

            {/* Button to move the camera to the "About Me" section */}
            <li>
              <button
                onClick={() => handleMenuItemClick(
                  new THREE.Vector3(10, 8, 10),
                  new THREE.Vector3(15, 0, 15),
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

            {/* Button to move the camera to the "Skills" section */}
            <li>
              <button
                onClick={() => handleMenuItemClick(
                  new THREE.Vector3(0, 8, -9),
                  new THREE.Vector3(0, 4, -15),
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

            {/* Button to move the camera to the "Experience" section */}
            <li>
              <button
                onClick={() => handleMenuItemClick(
                  new THREE.Vector3(-10, 5, -5),
                  new THREE.Vector3(-15, 1, -10),
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

            {/* Button to move the camera to the "Terminal" section */}
            <li>
              <button
                onClick={() => handleMenuItemClick(
                  new THREE.Vector3(-7, 4, 6),
                  new THREE.Vector3(-15, 1.5, 10),
                  'Projects'
                )}
                className={`text-sm px-3 py-1 rounded-md transition-colors w-full text-left ${
                  activeObject === 'terminal'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Projects
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Signature text */}
      <p className="signature">Edd Brisley [2025]</p>
    </div>
  )
}