import { Environment } from '@/components/3d/Environment' // Import the 3D environment component
import { useState, useEffect, useCallback } from 'react' // Import React hooks for state and memoized functions
import * as THREE from 'three' // Import the Three.js library for 3D rendering
import { gsap } from 'gsap' // Import GSAP for smooth animations
import { Music, Volume2, VolumeX, Menu } from 'lucide-react' 
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
  const [isActive, setIsActive] = useState(false); // State to manage active status

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

  useEffect(() => {
    if (camera && controls) {
      // Wait 300ms before starting the sequence.
      setTimeout(() => {
        // First, move the camera to an intermediate position.
        moveCamera(
          new THREE.Vector3(-15, 9, -15),  // Intermediate position
          new THREE.Vector3(0, 0, 0),   // Target remains the same
          'intermediate'
        );

        // After the intermediate move (assume it takes ~2 seconds), move to the final destination.
        setTimeout(() => {
          moveCamera(
            new THREE.Vector3(0, 10, 20), // Final position
            new THREE.Vector3(0, 0, 0),  // Staying with the same target
            'final'
          );
        }, 2500); // 2.5 second delay after moving to the intermediate position
      }, 300); // Initial 300ms delay
    }
  }, [camera, controls, moveCamera])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopAmbient()
    } else {
      playAmbient()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, playAmbient, stopAmbient])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsActive(false);
  };

  const handleMenuItemClick = (cameraPosition: THREE.Vector3, target: THREE.Vector3, objectId: string) => {
    moveCamera(cameraPosition, target, objectId);
    setIsMenuOpen(false);
    setIsActive(false);
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

      {/* Hamburger navigation at the top-right */}
      <div className="hamburger-container">
        <button className="hamburger-button" onClick={toggleMenu}>
          <Menu size={24} className="text-primary" />
        </button>
        <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(0, 8, 15),
                  new THREE.Vector3(0, 0, 0),
                  "cube"
                )
              }
            >
              🏡
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(10, 8, 10),
                  new THREE.Vector3(15, 0, 15),
                  "avatar"
                )
              }
            >
              🤚
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(0, 8, -9),
                  new THREE.Vector3(0, 4, -15),
                  "sphere"
                )
              }
            >
              🧠
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(-10, 5, -5),
                  new THREE.Vector3(-15, 1, -10),
                  "city"
                )
              }
            >
              👩‍💻
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(-7, 4, 6),
                  new THREE.Vector3(-15, 1.5, 10),
                  "terminal"
                )
              }
            >
              🏗
            </button>
          </li>
        </ul>
      </div>

      {/* Signature text */}
      <p className="signature">Edd Brisley [2025] <br></br> Lets connect on <a href="https://www.linkedin.com/in/edd-brisley/" target="_blank" rel="noopener noreferrer"><u>LinkedIn</u></a></p>
    </div>
  )
}